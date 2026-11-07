/**
 * Neon versions of household invites (householdInvites.ts) and API keys
 * (apiKeys.ts). Called when `dbBackend() === "neon"`. Both grant access, so
 * every change is scoped to the household it belongs to; tokens and keys are
 * stored only as SHA-256 hashes (callers hash).
 *
 * Differences from the Supabase path, all deliberate:
 * - Resolving an API key finds it and stamps last_used_at in one statement.
 * - Marking an invite accepted only touches one not yet accepted.
 */
import type { ApiKeyRow } from "../apiKeys";
import type { HouseholdInvite, PendingInvite } from "../householdInvites";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));
const INVITE_COLUMNS = "id, household_id, email, invited_by, expires_at, accepted_at, created_at, role";
const KEY_COLUMNS = "id, household_id, name, key_prefix, created_at, last_used_at, revoked_at";

// ---- invites ----------------------------------------------------------------

export async function insertInvite(row: {
  householdId: string;
  email: string;
  tokenHash: string;
  invitedBy: string;
  expiresAt: string;
  role: string;
}): Promise<{ invite: PendingInvite | null; error: string | null }> {
  try {
    const [invite] = await query<PendingInvite>(
      `insert into public.household_invites (household_id, email, token, invited_by, expires_at, role)
       values ($1, $2, $3, $4, $5, $6) returning ${INVITE_COLUMNS}`,
      [row.householdId, row.email, row.tokenHash, row.invitedBy, row.expiresAt, row.role],
    );
    return invite ? { invite, error: null } : { invite: null, error: "Failed to create invite" };
  } catch (error) {
    return { invite: null, error: message(error) };
  }
}

/** New link + expiry for a pending invite of this household. */
export async function reissueInvite(
  householdId: string,
  inviteId: string,
  tokenHash: string,
  expiresAt: string,
): Promise<{ invite: PendingInvite | null; error: string | null }> {
  try {
    const [invite] = await query<PendingInvite>(
      `update public.household_invites set token = $3, expires_at = $4
       where id = $1 and household_id = $2 and accepted_at is null returning ${INVITE_COLUMNS}`,
      [inviteId, householdId, tokenHash, expiresAt],
    );
    return invite ? { invite, error: null } : { invite: null, error: "Invite not found" };
  } catch (error) {
    return { invite: null, error: message(error) };
  }
}

export async function listPendingInvites(householdId: string): Promise<{ invites: PendingInvite[]; error: string | null }> {
  try {
    const invites = await query<PendingInvite>(
      `select ${INVITE_COLUMNS} from public.household_invites
       where household_id = $1 and accepted_at is null and expires_at > now()
       order by created_at desc, id`,
      [householdId],
    );
    return { invites, error: null };
  } catch (error) {
    return { invites: [], error: message(error) };
  }
}

export async function findInviteByTokenKeys(keys: string[]): Promise<HouseholdInvite | null> {
  try {
    const [invite] = await query<HouseholdInvite>(
      "select * from public.household_invites where token = any($1::text[]) limit 1",
      [keys],
    );
    return invite ?? null;
  } catch {
    return null;
  }
}

export async function markInviteAccepted(inviteId: string): Promise<void> {
  try {
    await query("update public.household_invites set accepted_at = now() where id = $1 and accepted_at is null", [inviteId]);
  } catch (error) {
    console.error("Failed to mark invite accepted:", message(error));
  }
}

export async function revokeInvite(householdId: string, inviteId: string): Promise<{ error: string | null }> {
  try {
    await query("delete from public.household_invites where id = $1 and household_id = $2 and accepted_at is null", [
      inviteId,
      householdId,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

// ---- API keys ---------------------------------------------------------------

export async function listApiKeys(householdId: string): Promise<ApiKeyRow[]> {
  try {
    return await query<ApiKeyRow>(
      `select ${KEY_COLUMNS} from public.api_keys
       where household_id = $1 and revoked_at is null order by created_at desc, id`,
      [householdId],
    );
  } catch {
    return [];
  }
}

export async function insertApiKey(row: {
  householdId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  createdBy: string;
}): Promise<{ key: ApiKeyRow | null; error: string | null }> {
  try {
    const [key] = await query<ApiKeyRow>(
      `insert into public.api_keys (household_id, name, key_prefix, key_hash, created_by)
       values ($1, $2, $3, $4, $5) returning ${KEY_COLUMNS}`,
      [row.householdId, row.name, row.keyPrefix, row.keyHash, row.createdBy],
    );
    return key ? { key, error: null } : { key: null, error: "Failed to create key" };
  } catch (error) {
    return { key: null, error: message(error) };
  }
}

export async function revokeApiKey(householdId: string, keyId: string): Promise<{ error: string | null }> {
  try {
    await query("update public.api_keys set revoked_at = now() where id = $1 and household_id = $2", [keyId, householdId]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** The household of an active key (and stamp its use), or null. */
export async function resolveApiKey(keyHash: string): Promise<{ householdId: string; keyId: string } | null> {
  try {
    const [row] = await query<{ id: string; household_id: string }>(
      `update public.api_keys set last_used_at = now()
       where key_hash = $1 and revoked_at is null returning id, household_id`,
      [keyHash],
    );
    return row ? { householdId: row.household_id, keyId: row.id } : null;
  } catch {
    return null;
  }
}
