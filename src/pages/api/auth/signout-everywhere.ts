import type { APIRoute } from "astro";
import { clearAuthCookies, getAuthFromCookies } from "../../../lib/auth";
import { MFA_REQUIRED_COOKIE } from "../../../lib/mfa";
import { clearMfaStepUpCookie } from "../../../lib/mfaStepUpProof";
import { createAdminClient } from "../../../lib/supabase";
import { dbBackend } from "../../../lib/db/client";
import { expiredBetterAuthCookies } from "../../../lib/betterAuthResponse";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";

/**
 * Revokes every refresh token for this account (browsers, phones, the
 * desktop app), then signs this browser out. API keys and ingest keys are
 * separate credentials and keep working.
 */
export const POST: APIRoute = async ({ cookies, redirect, request }) => {
  const { session } = await getAuthFromCookies(cookies);
  if (!session) return redirect("/signin");

  if (dbBackend() === "neon") {
    // Ends every Better Auth session for this account, this browser's included.
    const revoked = await withBetterAuth(request, (auth) => auth.api.revokeSessions({ headers: request.headers })).then(
      () => true,
      (error: unknown) => {
        console.error("sign out everywhere failed:", error instanceof Error ? error.message : error);
        return false;
      },
    );
    if (!revoked) return redirect("/dashboard/settings?signout_all=failed#account-security");
    cookies.delete(MFA_REQUIRED_COOKIE, { path: "/" });
    clearMfaStepUpCookie(cookies);
    const headers = new Headers({ Location: "/signin?signed_out=all" });
    for (const cookie of expiredBetterAuthCookies()) headers.append("Set-Cookie", cookie);
    return new Response(null, { status: 302, headers });
  }
  const { error } = await createAdminClient().auth.admin.signOut(session.access_token, "global");
  if (error) {
    // Keep this browser signed in so the user can retry and knows the others weren't revoked.
    return redirect("/dashboard/settings?signout_all=failed#account-security");
  }

  clearAuthCookies(cookies);
  cookies.delete(MFA_REQUIRED_COOKIE, { path: "/" });
  clearMfaStepUpCookie(cookies);
  return redirect("/signin?signed_out=all");
};
