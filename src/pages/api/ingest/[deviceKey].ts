import type { APIRoute } from "astro";
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

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const POST: APIRoute = async ({ params, request }) => {
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
  const rate = checkIngestRateLimit(keyHash);
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

  const recordedAt = new Date().toISOString();
  const rows = [];
  for (const reading of interpreted.readings) {
    const sensor = await upsertDeviceSensor(
      device.id,
      reading.key,
      reading.label,
      reading.kind,
      reading.unit,
    );
    if (!sensor.sensor) continue;
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

  if (rows.length === 0) {
    return finish(
      new Response(JSON.stringify({ error: "No sensor values found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );
  }

  const { error } = await insertSensorReadings(rows);
  if (error) {
    return finish(
      new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      false,
    );
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

  if (Object.keys(metaPatch).length > 0) {
    await updateDeviceMeta(
      device.id,
      enrichDeviceMetaHistories(device.meta, metaPatch, recordedAt),
    );
  } else {
    await touchDeviceLastSeen(device.id);
  }

  try {
    const { listHouseholdMembers } = await import("../../../lib/households");
    const { getAlertSettingsForUser } = await import("../../../lib/notify");
    const { sendReadingWebhook } = await import("../../../lib/readingWebhook");
    const { createAdminClient } = await import("../../../lib/supabase");
    const members = await listHouseholdMembers(device.household_id);
    const admin = createAdminClient();
    for (const member of members.members) {
      try {
        const { data } = await admin.auth.admin.getUserById(member.user_id);
        const settings = await getAlertSettingsForUser(
          member.user_id,
          data.user?.user_metadata as Record<string, unknown> | undefined,
        );
        if (settings.readingWebhookUrl) {
          await sendReadingWebhook(member.user_id, settings, {
            device_id: device.id,
            device_name: device.name,
            household_id: device.household_id,
            recorded_at: recordedAt,
            reading_count: rows.length,
            battery_pct: metaPatch.battery_pct ?? null,
            rssi: metaPatch.rssi ?? null,
          });
        }
      } catch (memberError) {
        console.error(`Reading webhook failed for member ${member.user_id}:`, memberError);
      }
    }
  } catch (webhookError) {
    console.error("Reading webhook failed:", webhookError);
  }

  // Best-effort immediate alerts (cooldowns still apply)
  try {
    const { listHouseholdMembers } = await import("../../../lib/households");
    const { listHouseholdDevices } = await import("../../../lib/devices");
    const {
      getAlertSettingsForUser,
    } = await import("../../../lib/notify");
    const {
      sendThresholdAlertsIfNeeded,
      sendFloodAlertsIfNeeded,
      maybeSendRuleAlerts,
      buildAlertReadingsFromLatestSensors,
      buildFloodReadingsFromLatestSensors,
    } = await import("../../../lib/alertNotifications");
    const { fetchLatestSensorValues } = await import("../../../lib/sensorReadings");
    const { createAdminClient } = await import("../../../lib/supabase");

    const members = await listHouseholdMembers(device.household_id);
    const devices = await listHouseholdDevices(device.household_id);
    const latest = await fetchLatestSensorValues(device.household_id);
    const readings = buildAlertReadingsFromLatestSensors(latest);
    const floodReadings = buildFloodReadingsFromLatestSensors(latest);
    const admin = createAdminClient();

    for (const member of members.members) {
      // Isolate each member so one failure can't skip everyone after them.
      try {
        const { data } = await admin.auth.admin.getUserById(member.user_id);
        const userMetadata = data.user?.user_metadata as Record<string, unknown> | undefined;
        const settings = await getAlertSettingsForUser(member.user_id, userMetadata);
        const weatherCityId =
          typeof userMetadata?.weather_city_id === "string"
            ? userMetadata.weather_city_id.trim()
            : null;
        await sendThresholdAlertsIfNeeded(
          member.user_id,
          data.user?.email,
          settings,
          readings,
          device.household_id,
          { weatherCityId, latestSensors: latest },
        );
        await sendFloodAlertsIfNeeded(
          member.user_id,
          data.user?.email,
          settings,
          floodReadings,
        );
        await maybeSendRuleAlerts(
          member.user_id,
          data.user?.email,
          devices.devices,
          settings,
          readings,
          device.household_id,
        );
      } catch (memberError) {
        console.error(`Ingest alerts failed for member ${member.user_id}:`, memberError);
      }
    }
  } catch (alertError) {
    console.error("Ingest alert evaluation failed:", alertError);
  }

  return finish(
    new Response(
      JSON.stringify({
        ok: true,
        readings: rows.length,
        sensors_created: sensorSync.created,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    ),
    true,
  );
};
