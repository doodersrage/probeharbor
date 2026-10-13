import type { APIRoute } from "astro";
import { clearAuthCookies, getAuthFromCookies } from "../../../lib/auth";
import { MFA_REQUIRED_COOKIE } from "../../../lib/mfa";
import { clearMfaStepUpCookie } from "../../../lib/mfaStepUpProof";
import { createAdminClient } from "../../../lib/supabase";

/**
 * Revokes every refresh token for this account (browsers, phones, the
 * desktop app), then signs this browser out. API keys and ingest keys are
 * separate credentials and keep working.
 */
export const POST: APIRoute = async ({ cookies, redirect }) => {
  const { session } = await getAuthFromCookies(cookies);
  if (!session) return redirect("/signin");

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
