/**
 * Neon versions of the puck (bay mood display) queries in pucks.ts. Called
 * Pucks belong to one household; claims are
 * proved with an HMAC of a one-time nonce (checked by the caller).
 *
 * Differences from the Supabase path, all deliberate:
 * - Registering only updates a puck the same household already owns, in one
 *   statement; the Supabase path checks ownership and then upserts, so two
 *   households registering the same device at once could hand it over.
 * - Finishing a claim consumes the pending nonce in the same statement that
 *   binds the bay, so one valid response can't be used twice.
 */
import type { PuckRow } from "../pucks";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Register or re-key a puck for this household; "owned" when another household has it. */
export async function registerPuck(
  deviceId: string,
  secretHex: string,
  householdId: string,
  createdBy: string,
): Promise<"ok" | "owned" | { error: string }> {
  try {
    const rows = await query(
      `insert into public.pucks (device_id, household_id, secret_hex, created_by, updated_at)
       values ($1, $2, $3, $4, now())
       on conflict (device_id) do update
         set secret_hex = excluded.secret_hex, created_by = excluded.created_by, updated_at = excluded.updated_at
         where public.pucks.household_id = excluded.household_id
       returning device_id`,
      [deviceId, householdId, secretHex, createdBy],
    );
    return rows.length > 0 ? "ok" : "owned";
  } catch (error) {
    return { error: message(error) };
  }
}

export async function getPuck(deviceId: string): Promise<PuckRow | null> {
  try {
    const [row] = await query<PuckRow>(
      `select device_id, household_id, secret_hex, bay_id, space_name, mood_override, mood_override_at
       from public.pucks where device_id = $1`,
      [deviceId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function savePendingClaim(
  deviceId: string,
  bayId: string,
  nonceHex: string,
  expiresAtIso: string,
): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.puck_claim_pending (device_id, bay_id, nonce_hex, expires_at) values ($1, $2, $3, $4)
       on conflict (device_id) do update set bay_id = excluded.bay_id, nonce_hex = excluded.nonce_hex,
         expires_at = excluded.expires_at`,
      [deviceId, bayId, nonceHex, expiresAtIso],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function getPendingClaim(
  deviceId: string,
): Promise<{ bay_id: string; nonce_hex: string; expires_at: string } | null> {
  try {
    const [row] = await query<{ bay_id: string; nonce_hex: string; expires_at: string }>(
      "select bay_id, nonce_hex, expires_at from public.puck_claim_pending where device_id = $1",
      [deviceId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

/** Use up the pending claim and bind the bay. "gone" when the claim was already used. */
export async function bindClaimedBay(
  deviceId: string,
  householdId: string,
  bayId: string,
  nonceHex: string,
  spaceName: string,
): Promise<"ok" | "gone" | { error: string }> {
  try {
    const rows = await query(
      `with consumed as (
         delete from public.puck_claim_pending
         where device_id = $1 and bay_id = $3 and nonce_hex = $4
         returning device_id
       )
       update public.pucks set bay_id = $3, space_name = $5, updated_at = now(),
         mood_override = null, mood_override_at = null
       where device_id = $1 and household_id = $2 and exists (select 1 from consumed)
       returning device_id`,
      [deviceId, householdId, bayId, nonceHex, spaceName],
    );
    return rows.length > 0 ? "ok" : "gone";
  } catch (error) {
    return { error: message(error) };
  }
}

/** Set the mood on the household's puck(s) for a bay; false when no puck has that bay. */
export async function setMoodOverride(householdId: string, bayId: string, mood: string): Promise<boolean | { error: string }> {
  try {
    const rows = await query(
      `update public.pucks set mood_override = $3, mood_override_at = now(), updated_at = now()
       where household_id = $1 and bay_id = $2 returning device_id`,
      [householdId, bayId, mood],
    );
    return rows.length > 0;
  } catch (error) {
    return { error: message(error) };
  }
}

export async function bayPuck(
  householdId: string,
  bayId: string,
): Promise<{ space_name: string | null; mood_override: string | null; mood_override_at: string | null } | null> {
  try {
    const [row] = await query<{ space_name: string | null; mood_override: string | null; mood_override_at: string | null }>(
      "select space_name, mood_override, mood_override_at from public.pucks where household_id = $1 and bay_id = $2 limit 1",
      [householdId, bayId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

/** The household's first owner's alert settings row (or null). */
export async function firstOwnerAlertSettings(householdId: string): Promise<Record<string, unknown> | null> {
  try {
    const [row] = await query<Record<string, unknown>>(
      `select s.* from public.household_members m join public.alert_settings s on s.user_id = m.user_id
       where m.household_id = $1 and m.role = 'owner' order by m.created_at, m.id limit 1`,
      [householdId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}
