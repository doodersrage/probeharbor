/**
 * Neon versions of the smaller alert tables: settings history
 * (alertSettingsHistory.ts), snooze links (alertSnoozeTokens.ts) and webhook
 * delivery log (webhookDeliveries.ts). Called when `dbBackend() === "neon"`.
 * Everything is scoped to one user, or to one household's members.
 *
 * Differences from the Supabase path, all deliberate:
 * - A snooze link is claimed (marked used) in one statement before the snooze
 *   is applied, so two clicks at once can't both use it. (Supabase: check,
 *   apply, then mark used.)
 * - Pruning old settings history is one statement.
 */
import type { WebhookDeliveryRow } from "../webhookDeliveries";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- settings history -------------------------------------------------------

/** Store the replaced version, then keep only the newest `keep` for the user. */
export async function recordSettingsHistory(
  userId: string,
  settings: Record<string, unknown>,
  changes: string[],
  keep: number,
): Promise<void> {
  await query(
    "insert into public.alert_settings_history (user_id, settings, changes) values ($1, $2::jsonb, $3::text[])",
    [userId, JSON.stringify(settings), changes],
  );
  await query(
    `delete from public.alert_settings_history
     where user_id = $1 and id in (
       select id from public.alert_settings_history where user_id = $1
       order by saved_at desc, id desc offset $2
     )`,
    [userId, keep],
  );
}

export async function listSettingsHistory(
  userId: string,
  limit: number,
): Promise<Array<{ id: number; savedAt: string; changes: string[] }>> {
  try {
    const rows = await query<{ id: number; saved_at: string; changes: string[] | null }>(
      `select id, saved_at, changes from public.alert_settings_history
       where user_id = $1 order by saved_at desc, id desc limit $2`,
      [userId, limit],
    );
    return rows.map((r) => ({ id: r.id, savedAt: r.saved_at, changes: r.changes ?? [] }));
  } catch {
    return [];
  }
}

/** The snapshot saved as entry `id`, only if it is the user's. */
export async function getSettingsHistorySnapshot(userId: string, id: number): Promise<Record<string, unknown> | null> {
  try {
    const [row] = await query<{ settings: Record<string, unknown> }>(
      "select settings from public.alert_settings_history where user_id = $1 and id = $2",
      [userId, id],
    );
    return row?.settings ?? null;
  } catch {
    return null;
  }
}

// ---- snooze links -----------------------------------------------------------

export type SnoozeTokenRow = { token: string; user_id: string; hours: number; expires_at: string; used_at: string | null };

export async function findSnoozeToken(lookupKeys: string[]): Promise<SnoozeTokenRow | null> {
  try {
    const [row] = await query<SnoozeTokenRow>(
      "select token, user_id, hours, expires_at, used_at from public.alert_snooze_tokens where token = any($1::text[]) limit 1",
      [lookupKeys],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function insertSnoozeToken(tokenHash: string, userId: string, hours: number, expiresAtIso: string): Promise<void> {
  try {
    await query("insert into public.alert_snooze_tokens (token, user_id, hours, expires_at) values ($1, $2, $3, $4)", [
      tokenHash,
      userId,
      hours,
      expiresAtIso,
    ]);
  } catch (error) {
    console.error("Failed to store snooze link:", message(error));
  }
}

/**
 * Mark the link used if it is unused and unexpired; returns who it snoozes and
 * for how long. Null means it was already used, expired, or unknown.
 */
export async function claimSnoozeToken(lookupKeys: string[]): Promise<{ user_id: string; hours: number } | null> {
  const [row] = await query<{ user_id: string; hours: number }>(
    `update public.alert_snooze_tokens set used_at = now()
     where token = (
       select token from public.alert_snooze_tokens
       where token = any($1::text[]) and used_at is null and expires_at >= now()
       limit 1
     ) and used_at is null
     returning user_id, hours`,
    [lookupKeys],
  );
  return row ?? null;
}

export async function householdMemberIds(householdId: string): Promise<string[]> {
  const rows = await query<{ user_id: string }>(
    "select user_id from public.household_members where household_id = $1 order by created_at, id",
    [householdId],
  );
  return rows.map((r) => r.user_id);
}

// ---- webhook delivery log ---------------------------------------------------

export async function recordWebhookDelivery(row: {
  user_id: string;
  webhook_type: string;
  url_host: string;
  status_code: number | null;
  success: boolean;
  error_message: string | null;
  duration_ms: number | null;
}): Promise<void> {
  try {
    await query(
      `insert into public.webhook_deliveries (user_id, webhook_type, url_host, status_code, success, error_message, duration_ms)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [row.user_id, row.webhook_type, row.url_host, row.status_code, row.success, row.error_message, row.duration_ms],
    );
  } catch (error) {
    console.error("Failed to record webhook delivery:", message(error));
  }
}

export async function listRecentWebhookDeliveries(userId: string, limit: number): Promise<WebhookDeliveryRow[]> {
  try {
    return await query<WebhookDeliveryRow>(
      `select id, webhook_type, url_host, status_code, success, error_message, duration_ms, created_at
       from public.webhook_deliveries where user_id = $1 order by created_at desc, id desc limit $2`,
      [userId, limit],
    );
  } catch {
    return [];
  }
}
