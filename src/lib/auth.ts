import type { AstroCookies } from "astro";
import { createAuthClient } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

export type AuthResult = {
  session: Session | null;
  user: User | null;
  /**
   * "better-auth" when DB_BACKEND=neon. Better Auth only issues a session
   * after the second factor, so the Supabase "aal" step-up checks don't apply.
   */
  source?: "supabase" | "better-auth";
};

/** Lazy: db/client and the Better Auth runtime load cloudflare:workers. */
async function usesBetterAuth(): Promise<boolean> {
  const { dbBackend } = await import("./db/client");
  return dbBackend() === "neon";
}

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

async function sessionFromTokens(
  accessToken: string,
  refreshToken: string,
): Promise<AuthResult> {
  try {
    // Fresh client per call -- never the shared `supabase` singleton here.
    // Auth runs on essentially every request, and Cloudflare Workers can
    // interleave concurrent requests within one isolate's shared global
    // scope, so a shared client's setSession() would be a race.
    const client = createAuthClient();
    const { data, error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return { session: null, user: null };
    }

    return { session: data.session, user: data.user };
  } catch {
    return { session: null, user: null };
  }
}

function bearerAccessToken(request: Request): string | null {
  const header = request.headers.get(ACCESS_HEADER);
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}

/**
 * Resolve the signed-in user from either:
 * - HttpOnly cookies (web dashboard), or
 * - Authorization Bearer + X-SB-Refresh-Token (native / desktop companions)
 */
export async function getAuthFromRequest(
  request: Request,
  cookies: AstroCookies,
): Promise<AuthResult> {
  // Better Auth reads its cookie or the companion's Authorization: Bearer header itself.
  if (await usesBetterAuth()) return betterAuthResult(request, request.headers);
  const access = bearerAccessToken(request);
  const refresh = request.headers.get(REFRESH_HEADER)?.trim();
  if (access && refresh) {
    return sessionFromTokens(access, refresh);
  }
  return getAuthFromCookies(cookies);
}

export async function getAuthFromCookies(
  cookies: AstroCookies,
): Promise<AuthResult> {
  if (await usesBetterAuth()) {
    const { betterAuthCookieHeader } = await import("./betterAuthSession");
    const cookie = betterAuthCookieHeader((name) => cookies.get(name)?.value);
    if (!cookie) return { session: null, user: null, source: "better-auth" };
    return betterAuthResult(undefined, new Headers({ cookie }));
  }
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return { session: null, user: null };
  }

  const result = await sessionFromTokens(accessToken.value, refreshToken.value);
  if (!result.session) {
    clearAuthCookies(cookies);
  } else if (
    result.session.access_token !== accessToken.value ||
    result.session.refresh_token !== refreshToken.value
  ) {
    // setSession() refreshed an expired access token and rotated the refresh
    // token; persist the new pair so later requests don't refresh again.
    setAuthCookies(cookies, result.session.access_token, result.session.refresh_token);
  }
  return result;
}

/** MFA gate helpers also honor companion headers. */
export function companionMfaHeaderValue(request: Request): string | null {
  return request.headers.get(MFA_HEADER)?.trim() || null;
}

export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
}

export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
): void {
  const secure = import.meta.env.PROD;
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  };

  cookies.set("sb-access-token", accessToken, cookieOptions);
  cookies.set("sb-refresh-token", refreshToken, cookieOptions);
}
