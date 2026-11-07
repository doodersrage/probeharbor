/**
 * Neon versions of smaller household tools: inbound webhooks
 * (inboundWebhooks.ts), claims-pack exports (claimsPackExports.ts), saved
 * History views (historySavedViews.ts) and cold-storage archives
 * (archiveHistory.ts). Changes name the
 * household (or user, for saved views); webhook tokens are looked up by hash.
 *
 * Differences from the Supabase path, all deliberate:
 * - Resolving an inbound webhook finds it and stamps last_used_at in one
 *   statement.
 * - The archive job reads up to the 5000 rows it asks for, oldest first; the
 *   Supabase path's request was cut to 1000 rows in no set order.
 */
import type { HistorySavedViewParams } from "../historySavedViews";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- inbound webhooks -------------------------------------------------------

export async function insertInboundWebhook(row: {
  household_id: string;
  name: string;
  token_prefix: string;
  token_hash: string;
  created_by: string;
  signing_secret: string;
}): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.inbound_webhooks (household_id, name, token_prefix, token_hash, created_by, signing_secret)
       values ($1, $2, $3, $4, $5, $6)`,
      [row.household_id, row.name, row.token_prefix, row.token_hash, row.created_by, row.signing_secret],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function listInboundWebhooks(householdId: string): Promise<{
  rows: Array<{
    id: string;
    household_id: string;
    name: string;
    token_prefix: string;
    created_at: string;
    last_used_at: string | null;
    has_signing_secret: boolean;
  }>;
  error: string | null;
}> {
  try {
    const rows = await query<{
      id: string;
      household_id: string;
      name: string;
      token_prefix: string;
      created_at: string;
      last_used_at: string | null;
      has_signing_secret: boolean;
    }>(
      `select id, household_id, name, token_prefix, created_at, last_used_at,
              (signing_secret is not null and signing_secret <> '') as has_signing_secret
       from public.inbound_webhooks where household_id = $1 order by created_at desc, id`,
      [householdId],
    );
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: message(error) };
  }
}

export async function deleteInboundWebhook(householdId: string, webhookId: string): Promise<{ error: string | null }> {
  try {
    await query("delete from public.inbound_webhooks where id = $1 and household_id = $2", [webhookId, householdId]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function resolveInboundWebhook(
  tokenHash: string,
): Promise<{ householdId: string; webhookId: string; signingSecret: string | null } | null> {
  try {
    const [row] = await query<{ id: string; household_id: string; signing_secret: string | null }>(
      `update public.inbound_webhooks set last_used_at = now() where token_hash = $1
       returning id, household_id, signing_secret`,
      [tokenHash],
    );
    return row ? { householdId: row.household_id, webhookId: row.id, signingSecret: row.signing_secret ?? null } : null;
  } catch {
    return null;
  }
}

/** Throws on failure (caller logs). */
export async function setSignatureFormat(webhookId: string, format: string): Promise<void> {
  await query("update public.inbound_webhooks set last_signature_format = $2 where id = $1", [webhookId, format]);
}

// ---- claims-pack exports ----------------------------------------------------

export async function insertClaimsPack(row: {
  household_id: string;
  token: string;
  range_from: string;
  range_to: string;
  content_hash: string;
  pack_data: unknown;
  generated_by: string | null;
  expires_at: string;
}): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.claims_pack_exports
         (household_id, token, range_from, range_to, content_hash, pack_data, generated_by, expires_at)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)`,
      [row.household_id, row.token, row.range_from, row.range_to, row.content_hash, JSON.stringify(row.pack_data), row.generated_by, row.expires_at],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function findClaimsPack(
  token: string,
): Promise<{ pack_data: unknown; expires_at: string | null; revoked_at: string | null } | null> {
  try {
    const [row] = await query<{ pack_data: unknown; expires_at: string | null; revoked_at: string | null }>(
      "select pack_data, expires_at, revoked_at from public.claims_pack_exports where token = $1",
      [token],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function revokeClaimsPack(householdId: string, token: string): Promise<boolean> {
  try {
    await query(
      "update public.claims_pack_exports set revoked_at = now() where household_id = $1 and token = $2 and revoked_at is null",
      [householdId, token],
    );
    return true;
  } catch {
    return false;
  }
}

// ---- saved History views ----------------------------------------------------

export async function listSavedViews(userId: string): Promise<
  Array<{ id: string; user_id: string; household_id: string | null; name: string; params: HistorySavedViewParams | null; created_at: string }>
> {
  try {
    return await query(
      `select id, user_id, household_id, name, params, created_at from public.history_saved_views
       where user_id = $1 order by created_at desc, id limit 30`,
      [userId],
    );
  } catch {
    return [];
  }
}

export async function insertSavedView(
  userId: string,
  householdId: string | null,
  name: string,
  params: HistorySavedViewParams,
): Promise<{ id: string | null; error: string | null }> {
  try {
    const [row] = await query<{ id: string }>(
      `insert into public.history_saved_views (user_id, household_id, name, params) values ($1, $2, $3, $4::jsonb) returning id`,
      [userId, householdId, name, JSON.stringify(params)],
    );
    return { id: row?.id ?? null, error: null };
  } catch (error) {
    return { id: null, error: message(error) };
  }
}

export async function deleteSavedView(userId: string, id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await query("delete from public.history_saved_views where id = $1 and user_id = $2", [id, userId]);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

// ---- cold-storage archives --------------------------------------------------

/** Throws on failure. */
export async function householdIds(limit: number): Promise<string[]> {
  const rows = await query<{ id: string }>("select id from public.households order by created_at, id limit $1", [limit]);
  return rows.map((r) => r.id);
}

/** Readings older than the cutoff, oldest first. Throws on failure. */
export function oldReadings(
  householdId: string,
  cutoffIso: string,
  limit: number,
): Promise<Array<{ id: number; value_num: number | null; recorded_at: string; sensor_id: string }>> {
  return query(
    `select id, value_num, recorded_at, sensor_id from public.sensor_readings
     where household_id = $1 and recorded_at < $2 order by recorded_at, id limit $3`,
    [householdId, cutoffIso, limit],
  );
}

export async function insertArchive(row: {
  household_id: string;
  period_start: string;
  period_end: string;
  object_key: string;
  row_count: number;
}): Promise<void> {
  await query(
    `insert into public.history_archives (household_id, period_start, period_end, object_key, row_count)
     values ($1, $2::date, $3::date, $4, $5)`,
    [row.household_id, row.period_start, row.period_end, row.object_key, row.row_count],
  );
}
