/**
 * Neon versions of household status pages (statusPage.ts), the public status
 * email subscriptions (statusSubscriptions.ts) and the status-change notifier
 * state (statusNotify.ts).
 *
 * Differences from the old Supabase code, all deliberate:
 * - Status subscribe writes with ON CONFLICT (email); confirm and unsubscribe
 *   are one statement each.
 */
import type { StatusPageToken } from "../statusPage";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- household status pages -------------------------------------------------

export async function insertStatusPage(householdId: string, tokenHash: string, label: string): Promise<{ error: string | null }> {
  try {
    await query("insert into public.status_page_tokens (household_id, token_hash, label) values ($1, $2, $3)", [
      householdId,
      tokenHash,
      label,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function regenerateStatusPage(householdId: string, id: string, tokenHash: string): Promise<{ error: string | null }> {
  try {
    const rows = await query(
      `update public.status_page_tokens set token_hash = $3, token = null
       where id = $1 and household_id = $2 and revoked_at is null returning id`,
      [id, householdId, tokenHash],
    );
    return rows.length > 0 ? { error: null } : { error: "Status page not found" };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function listStatusPages(householdId: string): Promise<StatusPageToken[]> {
  try {
    return await query<StatusPageToken>(
      `select id, household_id, token, label, created_at, revoked_at from public.status_page_tokens
       where household_id = $1 and revoked_at is null order by created_at desc, id`,
      [householdId],
    );
  } catch {
    return [];
  }
}

export async function revokeStatusPage(householdId: string, id: string): Promise<void> {
  try {
    await query("update public.status_page_tokens set revoked_at = now() where id = $1 and household_id = $2", [id, householdId]);
  } catch (error) {
    console.error("Failed to revoke status page:", message(error));
  }
}

/** Active page by hash, or (pre-hash rows) by raw token when `legacyRaw` is given. */
export async function resolveStatusPage(tokenHash: string, legacyRaw: string | null): Promise<{ householdId: string } | null> {
  try {
    const [byHash] = await query<{ household_id: string }>(
      "select household_id from public.status_page_tokens where token_hash = $1 and revoked_at is null",
      [tokenHash],
    );
    if (byHash) return { householdId: byHash.household_id };
    if (!legacyRaw) return null;
    const [byRaw] = await query<{ household_id: string }>(
      `select household_id from public.status_page_tokens
       where token = $1 and token_hash is null and revoked_at is null`,
      [legacyRaw],
    );
    return byRaw ? { householdId: byRaw.household_id } : null;
  } catch {
    return null;
  }
}

// ---- public status email subscriptions -------------------------------------

/** Throws on failure. */
export async function findStatusSubscriber(email: string): Promise<{ id: string; confirmed_at: string | null } | null> {
  const [row] = await query<{ id: string; confirmed_at: string | null }>(
    "select id, confirmed_at from public.status_subscriptions where email = $1",
    [email],
  );
  return row ?? null;
}

/** New or rotated token for an unconfirmed address (a confirmed one keeps its row). Throws on failure. */
export async function writeStatusSubscriberToken(email: string, token: string): Promise<void> {
  await query(
    `insert into public.status_subscriptions (email, token) values ($1, $2)
     on conflict (email) do update set token = excluded.token
       where public.status_subscriptions.confirmed_at is null`,
    [email, token],
  );
}

export async function confirmStatusSubscriber(token: string): Promise<boolean> {
  try {
    const rows = await query(
      "update public.status_subscriptions set confirmed_at = coalesce(confirmed_at, now()) where token = $1 returning id",
      [token],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function deleteStatusSubscriber(token: string): Promise<boolean> {
  try {
    const rows = await query("delete from public.status_subscriptions where token = $1 returning id", [token]);
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Throws on failure. */
export function listConfirmedStatusSubscribers(): Promise<Array<{ email: string; token: string }>> {
  return query(
    "select email, token from public.status_subscriptions where confirmed_at is not null order by created_at, id",
  );
}

// ---- notifier state (one row) ----------------------------------------------

/** null = no row yet. Throws on failure. */
export async function readLastKnownHealthy(): Promise<boolean | null> {
  const [row] = await query<{ last_healthy: boolean | null }>(
    "select last_healthy from public.status_notify_state where id = 1",
  );
  return row ? row.last_healthy : null;
}

export async function writeLastKnownHealthy(healthy: boolean): Promise<void> {
  try {
    await query(
      `insert into public.status_notify_state (id, last_healthy, updated_at) values (1, $1, now())
       on conflict (id) do update set last_healthy = excluded.last_healthy, updated_at = excluded.updated_at`,
      [healthy],
    );
  } catch (error) {
    console.error("status-notify: failed to write state:", message(error));
  }
}
