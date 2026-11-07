import type { AstroCookies } from "astro";
import type { Session, User } from "./appUser";

/**
 * The signed-in user and session, from Better Auth (src/lib/betterAuthSession.ts
 * builds this shape: user with id, email, metadata; session.access_token is
 * the Better Auth session token).
 */
export type AuthResult = {
  session: Session | null;
  user: User | null;
  /** Always "better-auth": the session only exists after any TOTP step. */
  source?: "better-auth";
};

/** Lazy: the Better Auth runtime loads cloudflare:workers (middleware and prerendering import this file). */
async function betterAuthResult(request: Request | undefined, headers: Headers): Promise<AuthResult> {
  try {
    const [{ withBetterAuth }, { authResultFromHeaders }] = await Promise.all([
      import("./betterAuthRuntime"),
      import("./betterAuthSession"),
    ]);
    return await withBetterAuth(request, (auth) => authResultFromHeaders(auth, headers));
  } catch (error) {
    console.error("Better Auth session lookup failed:", error instanceof Error ? error.message : error);
    return { session: null, user: null, source: "better-auth" };
  }
}

/** Native companions (Android / Bay Buddy) send tokens as headers instead of cookies. */
export const ACCESS_HEADER = "authorization";
export const REFRESH_HEADER = "x-sb-refresh-token";
export const MFA_HEADER = "x-sb-mfa-required";

/**
 * The signed-in user from the Better Auth session cookie (web) or an
 * `Authorization: Bearer` token (desktop and mobile apps).
 */
export async function getAuthFromRequest(request: Request, _cookies: AstroCookies): Promise<AuthResult> {
  return betterAuthResult(request, request.headers);
}

/** Same, for code that has cookies but no request (reads only the Better Auth cookie). */
export async function getAuthFromCookies(cookies: AstroCookies): Promise<AuthResult> {
  const { betterAuthCookieHeader } = await import("./betterAuthSession");
  const cookie = betterAuthCookieHeader((name) => cookies.get(name)?.value);
  if (!cookie) return { session: null, user: null, source: "better-auth" };
  return betterAuthResult(undefined, new Headers({ cookie }));
}

/** MFA gate helpers also honor companion headers. */
export function companionMfaHeaderValue(request: Request): string | null {
  return request.headers.get(MFA_HEADER)?.trim() || null;
}

/** Removes the cookies left by the old Supabase sign-in (harmless cleanup for older browsers). */
export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
}
