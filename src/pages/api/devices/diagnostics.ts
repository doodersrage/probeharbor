import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { buildDeviceDiagnostics } from "../../../lib/deviceDiagnostics";
import { scoreDeviceHealth } from "../../../lib/deviceHealthScore";
import { listHouseholdDevices } from "../../../lib/devices";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { listIngestStatsForHousehold } from "../../../lib/ingestStats";
import { fetchLatestSensorValues } from "../../../lib/sensorReadings";
import { findStuckSensors } from "../../../lib/stuckSensors";

/** Download a redacted support bundle for one device in the active property. */
export const GET: APIRoute = async ({ cookies, url }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) return new Response("Unauthorized", { status: 401 });

  const deviceId = url.searchParams.get("device_id") ?? "";
  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId || !deviceId) return new Response("Not found", { status: 404 });

  const { devices } = await listHouseholdDevices(household.householdId);
  const device = devices.find((d) => d.id === deviceId);
  if (!device) return new Response("Not found", { status: 404 });

  const now = Date.now();
  const [latest, stuck, ingestStats] = await Promise.all([
    fetchLatestSensorValues(household.householdId),
    findStuckSensors([device], now),
    listIngestStatsForHousehold(household.householdId, 7),
  ]);
  const bundle = buildDeviceDiagnostics({
    device,
    latest,
    health: scoreDeviceHealth(device, latest, now, -80, stuck),
    stuck,
    ingestStats,
    now,
  });
  const slug = device.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "device";
  return new Response(JSON.stringify(bundle, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="probeharbor-${slug}-diagnostics.json"`,
      "Cache-Control": "no-store",
    },
  });
};
