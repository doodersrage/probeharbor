/**
 * Write settings into the signed-in user's `user_metadata`
 * (`user_profiles.metadata`), from the session token the routes already have:
 * the token's user gets the keys merged in one statement.
 *
 * db/* is loaded lazily: some of these helpers sit in modules the
 * middleware or prerendered pages import.
 */
import type { User } from "./appUser";

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
  _refreshToken: string,
  patch: Record<string, unknown>,
): Promise<{ user: User | null; error: Error | null }> {
  try {
    const userId = await userIdForSessionToken(accessToken);
    if (!userId) return { user: null, error: new Error("Invalid session") };
    const [{ mergeUserMetadata }, { getUserRecord }] = await Promise.all([import("./db/userMetadata"), import("./userRecords")]);
    await mergeUserMetadata(userId, patch);
    return { user: (await getUserRecord(userId)) as User | null, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
