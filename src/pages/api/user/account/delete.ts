import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../../lib/auth";
import { deleteUserAccount } from "../../../../lib/accountLifecycle";
import { clearMfaStepUpCookie } from "../../../../lib/mfaStepUpProof";
import { formRedirectPath, withQuery } from "../../../../lib/siteUrl";
import { getUserMetadata } from "../../../../lib/db/userMetadata";
import { withBetterAuth } from "../../../../lib/betterAuthRuntime";
import { expiredBetterAuthCookies } from "../../../../lib/betterAuthResponse";
import { getTotpState, isElevated } from "../../../../lib/betterAuthMfa";
import { getYubiKeyPublicIdsFromUser } from "../../../../lib/yubikeyOtp";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const confirm = formData.get("confirm")?.toString();
  const password = formData.get("password")?.toString() ?? "";
  const confirmEmail = formData.get("confirm_email")?.toString()?.trim() ?? "";
  const redirectTo = formRedirectPath(formData, "/");

  if (confirm !== "DELETE") {
    return redirect("/dashboard/settings?delete_error=confirm");
  }

  // The password when the account has one (else the typed email), and a
  // verified session when two-factor is on.
  const state = await getTotpState(user.id);
  if (state.hasPassword) {
    if (!password) return redirect("/dashboard/settings?delete_error=password");
    const ok = await withBetterAuth(request, (auth) =>
      auth.api.verifyPassword({ body: { password }, headers: request.headers }),
    ).then(
      () => true,
      () => false,
    );
    if (!ok) return redirect("/dashboard/settings?delete_error=password");
  } else {
    const email = user.email?.trim()?.toLowerCase() ?? "";
    if (!email || confirmEmail.toLowerCase() !== email) {
      return redirect("/dashboard/settings?delete_error=email");
    }
  }
  const yubikeys = getYubiKeyPublicIdsFromUser({ user_metadata: await getUserMetadata(user.id) });
  if ((state.enabled || yubikeys.length > 0) && !(await isElevated(state, request, cookies, user.id))) {
    return redirect("/dashboard/settings?delete_error=mfa");
  }
  // Deleting the user row also deletes its Better Auth sessions, logins,
  // TOTP secret and passkeys (foreign keys cascade).
  const { error } = await deleteUserAccount(user.id);
  if (error) return redirect("/dashboard/settings?delete_error=1");
  clearMfaStepUpCookie(cookies);
  const headers = new Headers({ Location: withQuery(redirectTo, { account_deleted: "1" }) });
  for (const cookie of expiredBetterAuthCookies()) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
};
