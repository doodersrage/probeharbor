/**
 * Turn a Better Auth session into the app's `AuthResult` shape (the session
 * and user fields the app was written against on Supabase), so pages and
 * routes read it the same way.
 *
 * - user: id, email, created_at, email_confirmed_at, user_metadata and
 *   app_metadata, via getUserRecord (auth_users + user_profiles).
 * - session.access_token: the Better Auth session token. There is no
 *   refresh token (Better Auth sessions refresh themselves), so
 *   refresh_token is "".
 */
import type { Session, User } from "./appUser";
import type { AuthResult } from "./auth";
import type { ProbeHarborAuth } from "./betterAuthConfig";
import { getUserRecord } from "./userRecords";

export const BETTER_AUTH_COOKIE = "better-auth.session_token";
export const BETTER_AUTH_SECURE_COOKIE = `__Secure-${BETTER_AUTH_COOKIE}`;

export async function authResultFromHeaders(auth: Pick<ProbeHarborAuth, "api">, headers: Headers): Promise<AuthResult> {
  const found = await auth.api.getSession({ headers });
  if (!found) return { session: null, user: null, source: "better-auth" };
  const record = await getUserRecord(found.user.id);
  if (!record) return { session: null, user: null, source: "better-auth" };

  const user = {
    ...record,
    aud: "authenticated",
    role: "authenticated",
    updated_at: new Date(found.user.updatedAt).toISOString(),
  } as unknown as User;
  const expiresAtMs = new Date(found.session.expiresAt).getTime();
  const session = {
    access_token: found.session.token,
    refresh_token: "",
    token_type: "bearer",
    expires_at: Math.floor(expiresAtMs / 1000),
    expires_in: Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)),
    user,
  } as Session;
  return { session, user, source: "better-auth" };
}

/**
 * Cookie header carrying only the Better Auth session cookie(s), for code that
 * has cookies but no request. Astro's cookies.get() returns the value
 * decoded; Better Auth reads the header encoded, so a signed value with
 * "+", "/" or "=" must be encoded again or it doesn't match.
 */
export function betterAuthCookieHeader(read: (name: string) => string | undefined): string | null {
  const parts = [BETTER_AUTH_SECURE_COOKIE, BETTER_AUTH_COOKIE]
    .map((name) => [name, read(name)] as const)
    .filter(([, value]) => !!value)
    .map(([name, value]) => `${name}=${encodeURIComponent(value!)}`);
  return parts.length ? parts.join("; ") : null;
}
