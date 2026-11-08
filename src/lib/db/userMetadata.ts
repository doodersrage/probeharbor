/**
 * Per-user settings (active household, locale, °C, dashboard preferences,
 * ...) in `public.user_profiles.metadata`: the same JSON object Supabase kept
 * in `user_metadata`, copied over in step 5 of the move.
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
 * different keys at the same time can't drop each other's change (the old
 * Supabase code read, merged in JS, then wrote the whole object).
 */
export async function mergeUserMetadata(userId: string, patch: Record<string, unknown>): Promise<void> {
  await query(
    `insert into public.user_profiles (user_id, metadata) values ($1, $2::jsonb)
     on conflict (user_id) do update
       set metadata = public.user_profiles.metadata || excluded.metadata, updated_at = now()`,
    [userId, JSON.stringify(patch)],
  );
}
