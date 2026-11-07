/**
 * Per-user settings that Supabase kept in `user_metadata` (active household,
 * locale, °C, dashboard preferences, ...). On Neon they live in
 * `public.user_profiles.metadata` as the same JSON object, copied from
 * Supabase in step 5.
 *
 * Neon only. Callers keep their Supabase path behind `dbBackend()` until
 * step 7. (Code that reads `user.user_metadata` from the signed-in session is
 * moved in step 4, with login.)
 */
import { query } from "./client";

export async function getUserMetadata(userId: string): Promise<Record<string, unknown>> {
  const rows = await query<{ metadata: Record<string, unknown> }>(
    "select metadata from public.user_profiles where user_id = $1",
    [userId],
  );
  return rows[0]?.metadata ?? {};
}

/**
 * Set some keys, keeping the rest. One statement, so two requests changing
 * different keys at the same time can't drop each other's change (the
 * Supabase path reads, merges in JS, then writes the whole object).
 */
export async function mergeUserMetadata(userId: string, patch: Record<string, unknown>): Promise<void> {
  await query(
    `insert into public.user_profiles (user_id, metadata) values ($1, $2::jsonb)
     on conflict (user_id) do update
       set metadata = public.user_profiles.metadata || excluded.metadata, updated_at = now()`,
    [userId, JSON.stringify(patch)],
  );
}
