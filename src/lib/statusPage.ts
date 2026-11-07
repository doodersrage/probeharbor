import * as neonStatus from "./db/statusPages";
import { listHouseholdDevices } from "./devices";
import { fetchLatestSensorValues } from "./sensorReadings";
import { formatRelativeAge } from "./relativeTime";
import { newestRowFreshness, rowFreshness } from "./sensorFreshness";

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Status-page links carry a random token; only its SHA-256 hash is stored
 * (`token_hash`, migration 20261028140000), so a new link is shown once and
 * "Regenerate" replaces it. Pages created earlier still have their raw
 * `token` and keep showing it until a later cleanup clears it.
 */
const LEGACY_RAW_TOKEN = /^[0-9a-f]{36}$/;

export type StatusPageToken = {
  id: string;
  household_id: string;
  /** Raw token for pages created before hashing; null for newer pages. */
  token: string | null;
  label: string;
  created_at: string;
  revoked_at: string | null;
};

export async function createStatusPageToken(
  householdId: string,
  label: string,
): Promise<{ token: string | null; error: string | null }> {
  const token = randomToken();
  const created = await neonStatus.insertStatusPage(householdId, await sha256Hex(token), label.trim() || "Status page");
  return { token: created.error ? null : token, error: created.error };
}

/**
 * Give an active status page a new link; the old link and badge stop
 * working. Clears any legacy raw token. Returns the new raw token to show once.
 */
export async function regenerateStatusPageToken(
  householdId: string,
  id: string,
): Promise<{ token: string | null; error: string | null }> {
  const token = randomToken();
  const updated = await neonStatus.regenerateStatusPage(householdId, id, await sha256Hex(token));
  return updated.error ? { token: null, error: updated.error } : { token, error: null };
}

export async function listStatusPageTokens(
  householdId: string,
): Promise<StatusPageToken[]> {
  return neonStatus.listStatusPages(householdId);
}

export async function revokeStatusPageToken(
  householdId: string,
  id: string,
): Promise<void> {
  return neonStatus.revokeStatusPage(householdId, id);
}

export async function resolveStatusPageToken(
  token: string,
): Promise<{ householdId: string } | null> {
  // Pages created before hashing have no token_hash; only the old 36-hex
  // shape is tried as a raw token.
  return neonStatus.resolveStatusPage(await sha256Hex(token), LEGACY_RAW_TOKEN.test(token) ? token : null);
}

export async function buildStatusPageSnapshot(householdId: string) {
  const [{ devices }, latest] = await Promise.all([
    listHouseholdDevices(householdId),
    fetchLatestSensorValues(householdId),
  ]);

  // Shared freshness rule: each probe by its device's report interval.
  const newestLatest = newestRowFreshness(latest, devices);
  const newest = newestLatest.recordedAt;
  const age = formatRelativeAge(newest, undefined, undefined, newestLatest.reportIntervalMs);
  const staleCount = latest.filter((row) => rowFreshness(row, devices).stale).length;

  return {
    updatedAt: newest,
    lastReadingLabel: age.label,
    stale: !newest || age.stale,
    staleSensorCount: staleCount,
    sensorCount: latest.length,
    deviceCount: devices.length,
    sensors: latest.slice(0, 24).map((row) => ({
      label: row.sensor.label,
      kind: row.sensor.kind,
      device: row.deviceName,
      value_num: row.value_num,
      value_bool: row.value_bool,
      recorded_at: row.recorded_at,
    })),
  };
}
