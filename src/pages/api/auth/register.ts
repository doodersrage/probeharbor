import type { APIRoute } from "astro";
import { createAuthClient } from "../../../lib/supabase";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  applyReferralForNewUser,
} from "../../../lib/referrals";
import { REGISTER_NEXT_DEVICES, sanitizeRegisterNext } from "../../../lib/registerUrl";
import { requestLocale } from "./_locale";

export const POST: APIRoute = async (context) => {
  const { request, redirect, clientAddress } = context;
  const formData = await request.formData();
  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(formData),
    clientAddress,
  );

  if (!turnstile.success) {
    return redirect("/register?error=verification");
  }

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const refCode = formData.get("ref")?.toString()?.trim().toLowerCase() ?? "";

  if (!email || !password) {
    return redirect("/register?error=missing_fields");
  }

  if (password.length < 8) {
    return redirect("/register?error=weak_password");
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
    return redirect("/register?error=signup_failed");
  }

  if (data.user && refCode) {
    await applyReferralForNewUser(data.user.id, refCode, data.user.app_metadata);
  }

  const next = formData.get("next")?.toString() ?? "";
  const safeNext = sanitizeRegisterNext(next) ?? REGISTER_NEXT_DEVICES;
  const params = new URLSearchParams({ registered: "1", next: safeNext });
  return redirect(`/signin?${params.toString()}`);
};
