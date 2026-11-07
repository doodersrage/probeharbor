/**
 * Write settings into the signed-in user's `user_metadata`, from the session
 * tokens the routes already have (step 4g of the move off Supabase).
 *
 * - Supabase: set the session on a fresh auth client, then updateUser({ data })
 *   (top-level keys merged), as each helper did before.
 * - Neon (DB_BACKEND=neon): the access token is the Better Auth session
 *   token; its user's `user_profiles.metadata` gets the keys merged in one
 *   statement. The session doesn't change, so there are no new tokens.
 *
 * db/* is loaded lazily: some of these helpers sit in modules the
 * middleware or prerendered pages import.
 */
import type { AstroCookies } from "astro";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "./supabase";

async function onNeon(): Promise<boolean> {
  const { dbBackend } = await import("./db/client");
  return dbBackend() === "neon";
}

/** The user of an unexpired Better Auth session token, or null. */
export async function userIdForSessionToken(token: string): Promise<string | null> {
  if (!token) return null;
  const { query } = await import("./db/client");
  const [row] = await query<{ user_id: string }>(
    `select "userId" as user_id from public.auth_sessions where token = $1 and "expiresAt" > now()`,
    [token],
  );
  return row?.user_id ?? null;
}

export async function updateSessionUserMetadata(
  accessToken: string,
  refreshToken: string,
  patch: Record<string, unknown>,
): Promise<{ user: User | null; error: Error | null }> {
  if (await onNeon()) {
    try {
      const userId = await userIdForSessionToken(accessToken);
      if (!userId) return { user: null, error: new Error("Invalid session") };
      const [{ mergeUserMetadata }, { getUserRecord }] = await Promise.all([
        import("./db/userMetadata"),
        import("./userRecords"),
      ]);
      await mergeUserMetadata(userId, patch);
      return { user: (await getUserRecord(userId)) as User | null, error: null };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
    }
  }
  // Fresh client per call -- the shared `supabase` singleton would race
  // against any other concurrent request's auth calls (see ./supabase.ts).
  const client = createAuthClient();
  const { data: sessionData, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError || !sessionData.session) {
    return { user: null, error: sessionError ?? new Error("Invalid session") };
  }
  const { data, error } = await client.auth.updateUser({ data: patch });
  if (error) return { user: null, error };
  return { user: data.user, error: null };
}

/**
 * Supabase puts user_metadata in the access token, so after a write the
 * routes refresh the session and store the new tokens. Better Auth reads it
 * from the database on each request: nothing to do.
 */
export async function refreshCookiesAfterMetadataWrite(cookies: AstroCookies, refreshToken: string): Promise<void> {
  if (await onNeon()) return;
  const { setAuthCookies } = await import("./auth");
  // Fresh client -- see above.
  const { data } = await createAuthClient().auth.refreshSession({ refresh_token: refreshToken });
  if (data.session) setAuthCookies(cookies, data.session.access_token, data.session.refresh_token);
}
