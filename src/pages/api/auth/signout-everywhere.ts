import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { MFA_REQUIRED_COOKIE } from "../../../lib/mfa";
import { clearMfaStepUpCookie } from "../../../lib/mfaStepUpProof";
import { expiredBetterAuthCookies } from "../../../lib/betterAuthResponse";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";

/**
 * Ends every session for this account (browsers, phones, the desktop app),
 * this browser's included, then signs this browser out. API keys and ingest
 * keys are separate credentials and keep working.
 */
export const POST: APIRoute = async ({ cookies, redirect, request }) => {
  const { session } = await getAuthFromCookies(cookies);
  if (!session) return redirect("/signin");

  const revoked = await withBetterAuth(request, (auth) => auth.api.revokeSessions({ headers: request.headers })).then(
    () => true,
    (error: unknown) => {
      console.error("sign out everywhere failed:", error instanceof Error ? error.message : error);
      return false;
    },
  );
  // Keep this browser signed in so the user can retry and knows the others weren't revoked.
  if (!revoked) return redirect("/dashboard/settings?signout_all=failed#account-security");
  cookies.delete(MFA_REQUIRED_COOKIE, { path: "/" });
  clearMfaStepUpCookie(cookies);
  const headers = new Headers({ Location: "/signin?signed_out=all" });
  for (const cookie of expiredBetterAuthCookies()) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
};
