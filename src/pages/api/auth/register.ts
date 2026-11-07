import type { APIRoute } from "astro";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  applyReferralForNewUser,
} from "../../../lib/referrals";
import {
  REGISTER_EMAIL_COOKIE,
  REGISTER_EMAIL_COOKIE_OPTIONS,
  REGISTER_NEXT_DEVICES,
  buildRegisterErrorHref,
  registerEmailToKeep,
  sanitizeRegisterNext,
} from "../../../lib/registerUrl";
import { requestLocale } from "./_locale";
import { mergeUserMetadata } from "../../../lib/db/userMetadata";
import { betterAuthErrorCode } from "../../../lib/betterAuthResponse";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { getUserRecord } from "../../../lib/userRecords";

export const POST: APIRoute = async (context) => {
  const { request, redirect, clientAddress, cookies } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const refCode = formData.get("ref")?.toString()?.trim().toLowerCase() ?? "";
  const next = formData.get("next")?.toString() ?? "";
  // Errors go back to the form with next and referral kept; the email rides in a
  // short-lived cookie so it never appears in a URL (never the password at all).
  const backToForm = (code: string) => {
    const keep = registerEmailToKeep(email);
    if (keep) cookies.set(REGISTER_EMAIL_COOKIE, keep, REGISTER_EMAIL_COOKIE_OPTIONS);
    return redirect(buildRegisterErrorHref(code, { next, ref: refCode }));
  };

  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(formData),
    clientAddress,
  );

  if (!turnstile.success) {
    return backToForm("verification");
  }

  if (!email || !password) {
    return backToForm("missing_fields");
  }

  if (password.length < 8) {
    return backToForm("weak_password");
  }

  const safeNext = sanitizeRegisterNext(next) ?? REGISTER_NEXT_DEVICES;
  const done = () => redirect(`/signin?${new URLSearchParams({ registered: "1", next: safeNext }).toString()}`);

  const locale = requestLocale(context);
  const res = await withBetterAuth(
    request,
    (auth) => auth.api.signUpEmail({ body: { email, password, name: email }, asResponse: true }),
    { emailLocale: locale },
  );
  const code = await betterAuthErrorCode(res);
  if (code) return backToForm(code === "PASSWORD_TOO_SHORT" ? "weak_password" : "signup_failed");
  // An address that already has an account gets the same generic success
  // with a made-up user (so sign-up never reveals which addresses exist), so
  // only touch the profile when the user really exists. The language the form
  // was viewed in becomes the account language for emails and alerts.
  const { user } = (await res.json()) as { user: { id: string } };
  if (await getUserRecord(user.id)) {
    await mergeUserMetadata(user.id, { locale }).catch((error: unknown) =>
      console.error("register: could not save account language", error instanceof Error ? error.message : error),
    );
    if (refCode) await applyReferralForNewUser(user.id, refCode, {});
  }
  return done();
};
