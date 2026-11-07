import type { APIRoute } from "astro";
import { MFA_REQUIRED_COOKIE } from "../../../lib/mfa";
import { clearMfaStepUpCookie } from "../../../lib/mfaStepUpProof";
import { sanitizeNextPath } from "../../../lib/siteUrl";
import { expiredBetterAuthCookies } from "../../../lib/betterAuthResponse";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";

/** End this session in the database, then expire its cookie. */
async function signOutBetterAuth(request: Request, location: string): Promise<Response> {
  await withBetterAuth(request, (auth) => auth.api.signOut({ headers: request.headers })).catch(() => {
    // No session, or already gone: the cookie is cleared below either way.
  });
  const headers = new Headers({ Location: location });
  for (const cookie of expiredBetterAuthCookies()) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

/** Clears the MFA cookies, and the old sb-* session cookies older browsers may still hold. */
function clearSession(cookies: Parameters<APIRoute>[0]["cookies"]): void {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  cookies.delete(MFA_REQUIRED_COOKIE, { path: "/" });
  clearMfaStepUpCookie(cookies);
}

function signOutRedirect(url: URL): string {
  const safeNext = sanitizeNextPath(url.searchParams.get("next"));
  const email = url.searchParams.get("email")?.trim() ?? "";
  if (safeNext) {
    const params = new URLSearchParams({ next: safeNext });
    if (email) params.set("email", email);
    return `/signin?${params.toString()}`;
  }
  return "/signin";
}

/** Prefer POST to avoid logout CSRF via image/link GET. */
export const POST: APIRoute = async ({ cookies, url, request }) => {
  clearSession(cookies);
  return signOutBetterAuth(request, signOutRedirect(url));
};

/** GET kept for existing nav links; clears session (SameSite=Lax mitigates CSRF). */
export const GET: APIRoute = async ({ cookies, url, request }) => {
  clearSession(cookies);
  return signOutBetterAuth(request, signOutRedirect(url));
};
