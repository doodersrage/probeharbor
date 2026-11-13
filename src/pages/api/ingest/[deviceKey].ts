import { getUserRecord } from "../../../lib/userRecords";
import type { APIRoute } from "astro";
import { checkEdgeRateLimit } from "../../../lib/edgeRateLimit";
import { localeFromMetadata } from "../../../i18n/userLocale";
import {
  findDeviceByIngestKeyHash,
  touchDeviceLastSeen,
  updateDeviceMeta,
  upsertDeviceSensor,
} from "../../../lib/devices";
import { insertSensorReadings } from "../../../lib/sensorReadings";
import { interpretIngestPayload } from "../../../lib/ingestInterpret";
import { detectIngestClient, ingestClientPatch } from "../../../lib/ingestClient";
import { ensureDiscoveredPushSensors } from "../../../lib/pushSensorDiscovery";
import {
  checkIngestRateLimit,
  readJsonBodyWithLimit,
} from "../../../lib/ingestLimits";
import { recordIngestStat } from "../../../lib/ingestStats";
import { enrichDeviceMetaHistories } from "../../../lib/rssiHistory";
import { runAfterResponse } from "../../../lib/backgroundWork";
import { nextReportInterval } from "../../../lib/reportInterval";
import { splitIngestBody } from "../../../lib/ingestTime";
import type { DiscoveredPushSensor } from "../../../lib/pushSensorDiscovery";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const POST: APIRoute = async ({ params, request, locals }) => {
  const headerKey = request.headers.get("X-Ingest-Key")?.trim() ?? "";
  const pathKey = params.deviceKey?.trim() ?? "";
  // Prefer header so bridges need not put secrets in the URL path. Path `_`
  // is a placeholder when the key is header-only.
  const deviceKey =
    headerKey || (pathKey && pathKey !== "_" ? pathKey : "");
  if (!deviceKey) {
    return new Response(JSON.stringify({ error: "Missing device key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const keyHash = await sha256Hex(deviceKey);
  // Cloudflare's limiter counts across isolates (per location); the in-memory
  // check below still applies when the binding isn't available.
  const edgeAllowed = await checkEdgeRateLimit("INGEST_RATE_LIMITER", keyHash);
  const rate =
    edgeAllowed === false
      ? { ok: false, retryAfterSec: 60, error: "Rate limit exceeded. Try again shortly." }
      : checkIngestRateLimit(keyHash);
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: rate.error }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : {}),
      },
    });
  }

  const device = await findDeviceByIngestKeyHash(keyHash);

  if (!device) {
    return new Response(JSON.stringify({ error: "Invalid device key" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const finish = async (
    response: Response,
    success: boolean,
  ): Promise<Response> => {
    try {
      await recordIngestStat(device.household_id, device.id, success);
    } catch (statError) {
      console.error("Ingest stat failed:", statError);
    }
    return response;
  };

  const body = await readJsonBodyWithLimit(request);
  if (!body.ok) {
    return finish(
      new Response(JSON.stringify({ error: body.error }), {
        status: body.status,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );
  }

  const payload = body.payload;
  // When the server received this request: device fields (last seen, report
  // interval, client) use it. Readings use their own time when the device
  // sent one (`recorded_at`, see ingestTime.ts), otherwise this.
  const receivedAt = new Date().toISOString();
  const split = splitIngestBody(payload, Date.parse(receivedAt));
  if (!split.ok) {
    return finish(
      new Response(
        JSON.stringify({
          error: split.error,
          ...(split.rejectedEntries ? { rejected_entries: split.rejectedEntries } : {}),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
      false,
    );
  }
  const entries = split.entries.map((entry) => ({
    ...entry,
    interpreted: interpretIngestPayload(entry.payload, device.name),
  }));
  // Device fields: top level of the body; in a batch, else the newest item.
  const deviceFields = split.batch ? interpretIngestPayload(payload, device.name) : entries[0]!.interpreted;
  const newestEntry = entries.reduce<(typeof entries)[number] | null>(
    (newest, entry) => (newest == null || entry.recordedAt > newest.recordedAt ? entry : newest),
    null,
  );
  const interpreted = {
    batteryPct: deviceFields.batteryPct ?? newestEntry?.interpreted.batteryPct ?? null,
    rssi: deviceFields.rssi ?? newestEntry?.interpreted.rssi ?? null,
    firmwareVersion: deviceFields.firmwareVersion ?? newestEntry?.interpreted.firmwareVersion ?? null,
    tlsUnverified: deviceFields.tlsUnverified || (newestEntry?.interpreted.tlsUnverified ?? false),
    rejected: entries.flatMap((entry) => entry.interpreted.rejected),
  };
  const discovered = new Map<string, DiscoveredPushSensor>();
  for (const entry of entries) {
    for (const sensor of entry.interpreted.discovered) {
      const id = `${sensor.key}::${sensor.kind}`;
      if (!discovered.has(id)) discovered.set(id, sensor);
    }
  }
  const sensorSync = await ensureDiscoveredPushSensors(
    device.household_id,
    device.id,
    [...discovered.values()],
    device.sensors,
  );
  if (sensorSync.error) {
    console.error("Push sensor discovery failed:", sensorSync.error);
  }

  // Server-side failures get a generic message; details stay in the log.
  const storageFailed = () =>
    finish(
      new Response(JSON.stringify({ error: "Could not store readings. Try again." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );

  const rows = [];
  let sensorFailures = 0;
  // Each door's newest state in this request. A door whose newest state is
  // "closed" may finish an open/close session to save in door history.
  const latestDoor = new Map<string, { label: string; closed: boolean; at: string }>();
  // The device's sensors came with the device lookup; only query for a
  // sensor that's new (or whose saved unit needs correcting to °F).
  const knownSensors = new Map(device.sensors.map((s) => [`${s.key}::${s.kind}`, s]));
  const failedSensors = new Set<string>();
  for (const { interpreted: entryReadings, recordedAt } of entries) {
    for (const reading of entryReadings.readings) {
      const sensorId = `${reading.key}::${reading.kind}`;
      if (failedSensors.has(sensorId)) {
        sensorFailures += 1;
        continue;
      }
      const known = knownSensors.get(sensorId);
      const needsUnitFix =
        known != null && reading.kind === "temperature" && reading.unit === "F" && known.unit != null && known.unit !== "F";
      const sensor =
        known && !needsUnitFix
          ? { sensor: known, error: null }
          : await upsertDeviceSensor(device.household_id, device.id, reading.key, reading.label, reading.kind, reading.unit);
      if (!sensor.sensor) {
        sensorFailures += 1;
        failedSensors.add(sensorId);
        console.error(`Ingest for device ${device.id}: sensor ${reading.key} (${reading.kind}) not saved:`, sensor.error);
        continue;
      }
      // A batch names the same sensor many times: look it up once.
      knownSensors.set(sensorId, sensor.sensor);
      if (reading.kind === "door" && reading.value_bool != null) {
        const previous = latestDoor.get(sensor.sensor.id);
        if (!previous || recordedAt >= previous.at) {
          latestDoor.set(sensor.sensor.id, {
            label: sensor.sensor.label ?? reading.label,
            closed: reading.value_bool === false,
            at: recordedAt,
          });
        }
      }
      rows.push({
        sensor_id: sensor.sensor.id,
        household_id: device.household_id,
        recorded_at: recordedAt,
        value_num: reading.value_num,
        value_bool: reading.value_bool,
        value_text: reading.value_text,
        meta: reading.meta,
      });
    }
  }
  const closedDoors = [...latestDoor.entries()]
    .filter(([, door]) => door.closed)
    .map(([id, door]) => ({ id, label: door.label, at: door.at }));
  const rejectedEntries = split.rejectedEntries.length > 0 ? { rejected_entries: split.rejectedEntries } : {};

  if (interpreted.rejected.length > 0) {
    // Values that can't be real (e.g. a DS18B20 fault code) are reported, not stored.
    console.warn(
      `Ingest for device ${device.id} rejected ${interpreted.rejected.length} implausible value(s):`,
      interpreted.rejected.map((r) => `${r.key}=${r.value} (${r.reason})`).join(", "),
    );
  }

  if (rows.length === 0 && sensorFailures > 0) {
    // The payload was fine; we couldn't save its sensors.
    return storageFailed();
  }

  if (rows.length === 0) {
    const body =
      interpreted.rejected.length > 0
        ? { error: "No valid sensor values", rejected: interpreted.rejected, ...rejectedEntries }
        : { error: "No sensor values found", ...rejectedEntries };
    return finish(
      new Response(JSON.stringify(body), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );
  }

  // A device that sends its own times may resend after a lost reply: skip
  // readings already stored for that sensor at that time.
  const deviceTimed = entries.some((entry) => entry.deviceTime);
  const { error, inserted } = await insertSensorReadings(rows, { skipDuplicates: deviceTimed });
  const duplicates = rows.length - inserted;
  if (error) {
    console.error(`Ingest for device ${device.id}: insert failed:`, error);
    return storageFailed();
  }

  const metaPatch: Record<string, unknown> = {};
  if (interpreted.batteryPct != null) metaPatch.battery_pct = interpreted.batteryPct;
  if (interpreted.rssi != null) metaPatch.rssi = interpreted.rssi;
  // Probe firmware 1.5.0+ flags a connection it couldn't verify; clear the
  // flag once it posts verified again. Written only when it changes.
  if (interpreted.tlsUnverified !== (device.meta?.tls === "unverified")) {
    metaPatch.tls = interpreted.tlsUnverified ? "unverified" : null;
  }
  const firmware = interpreted.firmwareVersion;
  if (firmware && firmware !== device.meta?.firmware_version) {
    metaPatch.firmware_version = firmware;
  }
  // Remember which integration feeds this device, for Share → Integrations diagnostics.
  const client = ingestClientPatch(
    device.meta?.ingest_client,
    detectIngestClient(request.headers.get("user-agent"), receivedAt),
  );
  if (client) metaPatch.ingest_client = client;
  // Learn how often this device reports, for freshness labels (writes only while learning or on change).
  const interval = nextReportInterval(device.meta, device.last_seen_at, receivedAt);
  if (interval) Object.assign(metaPatch, interval);

  if (Object.keys(metaPatch).length > 0) {
    await updateDeviceMeta(
      device.household_id,
      device.id,
      enrichDeviceMetaHistories(device.meta, metaPatch, receivedAt),
    );
  } else {
    await touchDeviceLastSeen(device.household_id, device.id);
  }

  // Door history is saved for every household, not only those with alert rules.
  if (closedDoors.length > 0 && inserted > 0) {
    const closedAt = closedDoors.reduce((latest, door) => (door.at > latest ? door.at : latest), closedDoors[0]!.at);
    await runAfterResponse(locals, "Ingest door history", async () => {
      const { recordDoorSessionsIfJustClosed } = await import("../../../lib/doorEvents");
      await recordDoorSessionsIfJustClosed(
        device.household_id,
        closedDoors.map(({ id, label }) => ({ id, label })),
        closedAt,
      );
    });
  }

  // Newest reading time in this request (the receive time unless the device sent times).
  const newestRecordedAt = rows.reduce((latest, row) => (row.recorded_at > latest ? row.recorded_at : latest), rows[0]!.recorded_at);

  // Webhooks and alerts run after the response (waitUntil), so a slow
  // provider can't hold up the device. Failures stay in the alert log.
  // Nothing new stored (a resend of readings already saved): nothing to send.
  if (inserted > 0) await runAfterResponse(locals, "Ingest webhooks/alerts", async () => {
    // Each member's account and alert settings, loaded once and shared by the
    // reading webhooks and the alert pass (was loaded twice per member).
    type MemberContext = {
      userId: string;
      email: string | null | undefined;
      userMetadata: Record<string, unknown> | undefined;
      settings: Awaited<ReturnType<typeof import("../../../lib/notify").getAlertSettingsForUser>>;
    };
    let memberContexts: MemberContext[] = [];
    try {
      const { listHouseholdMembers } = await import("../../../lib/households");
      const { getAlertSettingsForUser } = await import("../../../lib/notify");
      const members = await listHouseholdMembers(device.household_id);
      for (const member of members.members) {
        // Isolate each member so one failure can't skip everyone after them.
        try {
          const data = { user: await getUserRecord(member.user_id) };
          const userMetadata = data.user?.user_metadata as Record<string, unknown> | undefined;
          memberContexts.push({
            userId: member.user_id,
            email: data.user?.email,
            userMetadata,
            settings: await getAlertSettingsForUser(member.user_id, userMetadata),
          });
        } catch (memberError) {
          console.error(`Ingest: loading member ${member.user_id} failed:`, memberError);
        }
      }
    } catch (membersError) {
      console.error("Ingest: loading household members failed:", membersError);
      memberContexts = [];
    }

    try {
      const { sendReadingWebhook } = await import("../../../lib/readingWebhook");
      for (const member of memberContexts) {
        if (!member.settings.readingWebhookUrl) continue;
        try {
          await sendReadingWebhook(member.userId, member.settings, {
            device_id: device.id,
            device_name: device.name,
            household_id: device.household_id,
            recorded_at: newestRecordedAt,
            reading_count: inserted,
            battery_pct: metaPatch.battery_pct ?? null,
            rssi: metaPatch.rssi ?? null,
          });
        } catch (memberError) {
          console.error(`Reading webhook failed for member ${member.userId}:`, memberError);
        }
      }
    } catch (webhookError) {
      console.error("Reading webhook failed:", webhookError);
    }

    // Best-effort immediate alerts (cooldowns still apply)
    if (memberContexts.length > 0) {
      try {
        const { listHouseholdDevices } = await import("../../../lib/devices");
        const {
          sendThresholdAlertsIfNeeded,
          sendFloodAlertsIfNeeded,
          maybeSendRuleAlerts,
          buildAlertReadingsFromLatestSensors,
          buildFloodReadingsFromLatestSensors,
          fetchAlertSensorValues,
        } = await import("../../../lib/alertNotifications");

        const { withHouseholdHold } = await import("../../../lib/alertSnooze");
        const { loadHouseholdAlertHold } = await import("../../../lib/alertSnoozeTokens");
        // The household's own snooze / vacation (inbound webhook), read once:
        // held like each member's own, for this household's alerts only.
        const householdHold = await loadHouseholdAlertHold(device.household_id);

        const devices = await listHouseholdDevices(device.household_id);
        // Skips demo (simulated) feeds in the same household: they never alert.
        const latest = await fetchAlertSensorValues(device.household_id);
        const readings = buildAlertReadingsFromLatestSensors(latest);
        const floodReadings = buildFloodReadingsFromLatestSensors(latest);

        for (const member of memberContexts) {
          // Isolate each member so one failure can't skip everyone after them.
          try {
            // Alerts go out in each member's account language.
            const locale = localeFromMetadata(member.userMetadata);
            // Evaluation only, never saved (see withHouseholdHold).
            const settings = withHouseholdHold(member.settings, householdHold);
            const weatherCityId =
              typeof member.userMetadata?.weather_city_id === "string"
                ? member.userMetadata.weather_city_id.trim()
                : null;
            await sendThresholdAlertsIfNeeded(
              member.userId,
              member.email,
              settings,
              readings,
              device.household_id,
              { weatherCityId, latestSensors: latest, useCelsius: member.userMetadata?.use_celsius === true },
              locale,
            );
            await sendFloodAlertsIfNeeded(member.userId, member.email, settings, floodReadings, locale);
            await maybeSendRuleAlerts(
              member.userId,
              member.email,
              devices.devices,
              settings,
              readings,
              device.household_id,
              locale,
            );
          } catch (memberError) {
            console.error(`Ingest alerts failed for member ${member.userId}:`, memberError);
          }
        }
      } catch (alertError) {
        console.error("Ingest alert evaluation failed:", alertError);
      }
    }
  });

  return finish(
    new Response(
      JSON.stringify({
        ok: true,
        readings: inserted,
        sensors_created: sensorSync.created,
        ...(duplicates > 0 ? { duplicates } : {}),
        ...(interpreted.rejected.length > 0 ? { rejected: interpreted.rejected } : {}),
        ...rejectedEntries,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    ),
    true,
  );
};
