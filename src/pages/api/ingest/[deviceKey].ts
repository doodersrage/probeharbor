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
      await recordIngestStat(device.id, success);
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
  const interpreted = interpretIngestPayload(payload, device.name);
  const sensorSync = await ensureDiscoveredPushSensors(
    device.id,
    interpreted.discovered,
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

  const recordedAt = new Date().toISOString();
  const rows = [];
  let sensorFailures = 0;
  // The device's sensors came with the device lookup; only query for a
  // sensor that's new (or whose saved unit needs correcting to °F).
  const knownSensors = new Map(device.sensors.map((s) => [`${s.key}::${s.kind}`, s]));
  for (const reading of interpreted.readings) {
    const known = knownSensors.get(`${reading.key}::${reading.kind}`);
    const needsUnitFix =
      known != null && reading.kind === "temperature" && reading.unit === "F" && known.unit != null && known.unit !== "F";
    const sensor =
      known && !needsUnitFix
        ? { sensor: known, error: null }
        : await upsertDeviceSensor(device.id, reading.key, reading.label, reading.kind, reading.unit);
    if (!sensor.sensor) {
      sensorFailures += 1;
      console.error(`Ingest for device ${device.id}: sensor ${reading.key} (${reading.kind}) not saved:`, sensor.error);
      continue;
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
        ? { error: "No valid sensor values", rejected: interpreted.rejected }
        : { error: "No sensor values found" };
    return finish(
      new Response(JSON.stringify(body), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );
  }

  const { error } = await insertSensorReadings(rows);
  if (error) {
    console.error(`Ingest for device ${device.id}: insert failed:`, error);
    return storageFailed();
  }

  const metaPatch: Record<string, unknown> = {};
  if (interpreted.batteryPct != null) metaPatch.battery_pct = interpreted.batteryPct;
  if (interpreted.rssi != null) metaPatch.rssi = interpreted.rssi;
  const firmware = interpreted.firmwareVersion;
  if (firmware && firmware !== device.meta?.firmware_version) {
    metaPatch.firmware_version = firmware;
  }
  // Remember which integration feeds this device, for Share → Integrations diagnostics.
  const client = ingestClientPatch(
    device.meta?.ingest_client,
    detectIngestClient(request.headers.get("user-agent"), recordedAt),
  );
  if (client) metaPatch.ingest_client = client;
  // Learn how often this device reports, for freshness labels (writes only while learning or on change).
  const interval = nextReportInterval(device.meta, device.last_seen_at, recordedAt);
  if (interval) Object.assign(metaPatch, interval);

  if (Object.keys(metaPatch).length > 0) {
    await updateDeviceMeta(
      device.id,
      enrichDeviceMetaHistories(device.meta, metaPatch, recordedAt),
    );
  } else {
    await touchDeviceLastSeen(device.id);
  }

  // Webhooks and alerts run after the response (waitUntil), so a slow
  // provider can't hold up the device. Failures stay in the alert log.
  await runAfterResponse(locals, "Ingest webhooks/alerts", async () => {
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
      const { createAdminClient } = await import("../../../lib/supabase");
      const members = await listHouseholdMembers(device.household_id);
      const admin = createAdminClient();
      for (const member of members.members) {
        // Isolate each member so one failure can't skip everyone after them.
        try {
          const { data } = await admin.auth.admin.getUserById(member.user_id);
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
            recorded_at: recordedAt,
            reading_count: rows.length,
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
        } = await import("../../../lib/alertNotifications");
        const { fetchLatestSensorValues } = await import("../../../lib/sensorReadings");

        const devices = await listHouseholdDevices(device.household_id);
        const latest = await fetchLatestSensorValues(device.household_id);
        const readings = buildAlertReadingsFromLatestSensors(latest);
        const floodReadings = buildFloodReadingsFromLatestSensors(latest);

        for (const member of memberContexts) {
          // Isolate each member so one failure can't skip everyone after them.
          try {
            // Alerts go out in each member's account language.
            const locale = localeFromMetadata(member.userMetadata);
            const weatherCityId =
              typeof member.userMetadata?.weather_city_id === "string"
                ? member.userMetadata.weather_city_id.trim()
                : null;
            await sendThresholdAlertsIfNeeded(
              member.userId,
              member.email,
              member.settings,
              readings,
              device.household_id,
              { weatherCityId, latestSensors: latest, useCelsius: member.userMetadata?.use_celsius === true },
              locale,
            );
            await sendFloodAlertsIfNeeded(member.userId, member.email, member.settings, floodReadings, locale);
            await maybeSendRuleAlerts(
              member.userId,
              member.email,
              devices.devices,
              member.settings,
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
        readings: rows.length,
        sensors_created: sensorSync.created,
        ...(interpreted.rejected.length > 0 ? { rejected: interpreted.rejected } : {}),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    ),
    true,
  );
};
