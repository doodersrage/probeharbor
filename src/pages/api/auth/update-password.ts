import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { redirectWithAuthCookies } from "../../../lib/betterAuthResponse";
import {
  RESET_TOKEN_COOKIE,
  clearResetTokenCookie,
  markEmailVerified,
  resetTokenUserId,
  setPasswordForUser,
} from "../../../lib/betterAuthPassword";
import { buildMfaChallengeUrl } from "../../../lib/mfa";
import { getUserRecord } from "../../../lib/userRecords";

const UPDATED = "/dashboard?password=updated";

/**
 * With a reset token (from the emailed link): set the password, then sign in
 * with it, ending on the dashboard. Other sessions are ended by the reset.
 * Signed in without a token: change it without the current password.
 */
async function updatePasswordBetterAuth(
  request: Request,
  cookies: Parameters<APIRoute>[0]["cookies"],
  password: string,
): Promise<Response | string> {
  const token = cookies.get(RESET_TOKEN_COOKIE)?.value ?? "";
  if (token) {
    return withBetterAuth(request, async (auth) => {
      const userId = await resetTokenUserId(auth, token);
      const user = userId ? await getUserRecord(userId) : null;
      if (!userId || !user?.email) return "/reset-password?error=session";
      const reset = await auth.api.resetPassword({ body: { newPassword: password, token }, asResponse: true });
      if (!reset.ok) return "/reset-password?error=session";
      clearResetTokenCookie(cookies);
      await markEmailVerified(auth, userId);
      const signedIn = await auth.api.signInEmail({ body: { email: user.email, password }, asResponse: true });
      if (!signedIn.ok) return "/signin";
      const body = (await signedIn.clone().json()) as { twoFactorRedirect?: boolean };
      return redirectWithAuthCookies(body.twoFactorRedirect ? buildMfaChallengeUrl(UPDATED) : UPDATED, signedIn);
    });
  }
  const { user } = await getAuthFromCookies(cookies);
  if (!user) return "/signin?error=generic";
  try {
    await withBetterAuth(request, (auth) => setPasswordForUser(auth, user.id, password));
  } catch (error) {
    console.error("password change failed:", error instanceof Error ? error.message : error);
    return "/reset-password?error=update";
  }
  return UPDATED;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // The form is checked first; the reset token or session is checked after.
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!password || password.length < 8) {
    return redirect("/reset-password?error=weak");
  }

  if (password !== confirm) {
    return redirect("/reset-password?error=mismatch");
  }

  const result = await updatePasswordBetterAuth(request, cookies, password);
  return typeof result === "string" ? redirect(result) : result;
};
