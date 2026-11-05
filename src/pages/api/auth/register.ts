import type { APIRoute } from "astro";
import { createAuthClient } from "../../../lib/supabase";
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

  // Fresh client -- never the shared `supabase` singleton, which would
  // leave this newly-created session sitting as ambient state for any
  // other concurrent request on the same Worker isolate to pick up.
  // The language the form was viewed in (ph_locale cookie, set by /es/register
  // etc.) becomes the account language for emails, alerts and the dashboard.
  const { data, error } = await createAuthClient().auth.signUp({
    email,
    password,
    options: { data: { locale: requestLocale(context) } },
  });

  if (error) {
    // Supabase only says "already registered" when email confirmation is off;
    // with it on, sign-up for a known address succeeds without telling us, so
    // this reveals nothing Supabase's own response doesn't already.
    return backToForm(isAlreadyRegistered(error) ? "email_taken" : "signup_failed");
  }

  if (data.user && refCode) {
    await applyReferralForNewUser(data.user.id, refCode, data.user.app_metadata);
  }

  const safeNext = sanitizeRegisterNext(next) ?? REGISTER_NEXT_DEVICES;
  const params = new URLSearchParams({ registered: "1", next: safeNext });
  return redirect(`/signin?${params.toString()}`);
};

function isAlreadyRegistered(error: { code?: string }): boolean {
  return error.code === "user_already_exists" || error.code === "email_exists";
}
