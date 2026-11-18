import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import { getDeviceSource } from "../../../lib/db/devices";
import { createPairing, getPairingStatus } from "../../../lib/db/pairings";
import {
  canEditHousehold,
  getOrCreateHouseholdForUser,
  getUserHouseholdRole,
} from "../../../lib/households";
import {
  formatPairingCode,
  generatePairingCode,
  hashPairingCode,
  PAIRING_TTL_MS,
} from "../../../lib/pairingCode";

/**
 * POST /api/devices/pairing {device_id}: a pairing code for one of the
 * household's push devices, for editors. Replaces the device's unused code.
 * The code is shown once (only its hash is stored); `id` lets the page
 * follow it.
 *
 * GET /api/devices/pairing?id=…: that code's status, for the device page
 * (the phone setup page closes when Wi-Fi joins and can't say whether
 * pairing worked; owner's test 2026-11-17): waiting, paired (chip, time),
 * expired, or replaced (gone: a newer code, or the device was deleted).
 */
function json(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) return json(401, { error: "Sign in first." });
  let body: { device_id?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }
  const deviceId = typeof body?.device_id === "string" ? body.device_id : "";
  if (!/^[0-9a-f-]{36}$/i.test(deviceId)) return json(400, { error: "device_id is required" });

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (household.error || !household.householdId) return json(500, { error: "household" });
  if (!canEditHousehold(await getUserHouseholdRole(user.id, household.householdId))) {
    return json(403, { error: "View-only: ask an owner to pair a probe." });
  }
  const source = await getDeviceSource(household.householdId, deviceId);
  if (source !== "push") return json(404, { error: "No such probe in this household." });

  const code = generatePairingCode();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MS);
  let id: string;
  try {
    id = await createPairing({
      householdId: household.householdId,
      deviceId,
      userId: user.id,
      codeHash: await hashPairingCode(code),
      expiresAt,
    });
  } catch (error) {
    console.error("Pairing code not stored:", error instanceof Error ? error.message : error);
    return json(503, { error: "Pairing isn't available right now." });
  }
  return json(200, { id, code: formatPairingCode(code), expires_at: expiresAt.toISOString() });
};

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) return json(401, { error: "Sign in first." });
  const id = url.searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json(400, { error: "id is required" });
  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (household.error || !household.householdId) return json(500, { error: "household" });
  if (!canEditHousehold(await getUserHouseholdRole(user.id, household.householdId))) {
    return json(403, { error: "View-only." });
  }
  let row: Awaited<ReturnType<typeof getPairingStatus>>;
  try {
    row = await getPairingStatus(household.householdId, id);
  } catch (error) {
    console.error("Pairing status failed:", error instanceof Error ? error.message : error);
    return json(503, { error: "Pairing isn't available right now." });
  }
  if (!row) return json(200, { status: "replaced" });
  if (row.usedAt) return json(200, { status: "paired", chip: row.usedChip, paired_at: row.usedAt });
  if (Date.parse(row.expiresAt) <= Date.now()) return json(200, { status: "expired" });
  return json(200, { status: "waiting" });
};
