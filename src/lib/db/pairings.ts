/**
 * Pairing codes (src/lib/pairingCode.ts) in public.device_pairings
 * (migration 0008). Codes are stored as hashes only.
 */
import { query } from "./client";

/**
 * Store a new code for a device, replacing any of its unused codes, so only
 * the newest code a person was shown works. Returns the row's id (for the
 * device page to follow, getPairingStatus).
 */
export async function createPairing(input: {
  householdId: string;
  deviceId: string;
  userId: string;
  codeHash: string;
  expiresAt: Date;
}): Promise<string> {
  const [row] = await query<{ id: string }>(
    `with replaced as (
       delete from public.device_pairings where device_id = $2 and used_at is null
     )
     insert into public.device_pairings (code_hash, household_id, device_id, created_by, expires_at)
     values ($1, $3, $2, $4, $5)
     returning id`,
    [
      input.codeHash,
      input.deviceId,
      input.householdId,
      input.userId,
      input.expiresAt.toISOString(),
    ],
  );
  if (!row) throw new Error("pairing not stored");
  return row.id;
}

/**
 * What became of a code the device page is showing: null when it's gone
 * (a newer code for the device replaced it, or the device was deleted) or
 * belongs to another household.
 */
export async function getPairingStatus(
  householdId: string,
  id: string,
): Promise<{ usedAt: string | null; usedChip: string | null; expiresAt: string } | null> {
  const [row] = await query<{
    used_at: string | null;
    used_chip: string | null;
    expires_at: string;
  }>(
    `select used_at, used_chip, expires_at from public.device_pairings
     where id = $1 and household_id = $2`,
    [id, householdId],
  );
  return row ? { usedAt: row.used_at, usedChip: row.used_chip, expiresAt: row.expires_at } : null;
}

/**
 * Spend a code: atomically marks it used, only if it exists, is unused and
 * hasn't expired. Two claims racing for one code: exactly one wins. Returns
 * the device it pairs, or null (unknown, used or expired: not told apart).
 */
export async function claimPairing(
  codeHash: string,
  chip: string | null,
): Promise<{ householdId: string; deviceId: string; deviceName: string } | null> {
  const [row] = await query<{ household_id: string; device_id: string; name: string }>(
    `with spent as (
       update public.device_pairings set used_at = now(), used_chip = $2
       where code_hash = $1 and used_at is null and expires_at > now()
       returning household_id, device_id
     )
     select s.household_id, s.device_id, d.name
     from spent s join public.devices d on d.id = s.device_id and d.household_id = s.household_id
     where d.source = 'push'`,
    [codeHash, chip],
  );
  return row
    ? { householdId: row.household_id, deviceId: row.device_id, deviceName: row.name }
    : null;
}
