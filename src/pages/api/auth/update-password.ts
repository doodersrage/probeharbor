import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { createAuthClient } from "../../../lib/supabase";
import { dbBackend } from "../../../lib/db/client";
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
 * Neon. With a reset token (from the emailed link): set the password, then
 * sign in with it, ending on the dashboard as Supabase's recovery did. Other
 * sessions are ended by the reset. Signed in without a token: change it
 * without the current password, as before.
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
  const neon = dbBackend() === "neon";
  // Neon checks the reset token or session itself, after the form checks.
  const { session } = neon ? { session: null } : await getAuthFromCookies(cookies);

  if (!neon && !session) {
    return redirect("/signin?error=generic");
  }

  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!password || password.length < 8) {
    return redirect("/reset-password?error=weak");
  }

  if (password !== confirm) {
    return redirect("/reset-password?error=mismatch");
  }

  if (neon) {
    const result = await updatePasswordBetterAuth(request, cookies, password);
    return typeof result === "string" ? redirect(result) : result;
  }

  if (!session) {
    return redirect("/signin?error=generic");
  }

  // Fresh client per request -- never the shared `supabase` singleton for
  // this. Cloudflare Workers can interleave concurrent requests within one
  // isolate's shared global scope, so a shared client's setSession() call
  // here would race against any other in-flight request's auth calls, and
  // this updateUser({ password }) call (no explicit token) would silently
  // apply to whichever session most recently "won" the shared client.
  const client = createAuthClient();
  const { error: sessionError } = await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  if (sessionError) {
    return redirect("/reset-password?error=session");
  }

  const { error } = await client.auth.updateUser({ password });

  if (error) {
    return redirect("/reset-password?error=update");
  }

  return redirect("/dashboard?password=updated");
};
