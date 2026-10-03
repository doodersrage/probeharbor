import type { APIRoute } from "astro";
import type { EmailOtpType } from "@supabase/supabase-js";
import { applySessionCookiesAfterAuth, createAuthClient } from "../../../lib/mfa";
import { sanitizeNextPath } from "../../../lib/siteUrl";
import { REGISTER_NEXT_DEVICES } from "../../../lib/registerUrl";

/**
 * Email-link landing for the token_hash templates
 * ({{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=...).
 *
 * The default {{ .ConfirmationURL }} links finish with a PKCE ?code= whose
 * verifier lived in the throwaway server client that called signUp, so it can
 * never be exchanged; users ended up signed out on the homepage. verifyOtp
 * needs no verifier, confirms the email, and signs the user straight in.
 */
const OTP_TYPES: ReadonlySet<EmailOtpType> = new Set([
  "signup",
  "email",
  "recovery",
  "invite",
  "magiclink",
  "email_change",
]);

function defaultNext(type: EmailOtpType): string {
  if (type === "recovery") return "/reset-password";
  if (type === "signup" || type === "email") return REGISTER_NEXT_DEVICES;
  return "/dashboard";
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const tokenHash = url.searchParams.get("token_hash")?.trim() ?? "";
  const rawType = url.searchParams.get("type") ?? "";
  const type = OTP_TYPES.has(rawType as EmailOtpType) ? (rawType as EmailOtpType) : null;

  if (!tokenHash || !type) {
    return redirect("/signin?error=confirm_link");
  }

  const { data, error } = await createAuthClient().auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error || !data.session) {
    // Expired or already-used link. For signup the address is usually
    // confirmed already, so signing in is the right next step either way.
    return redirect(type === "recovery" ? "/reset-password?error=session" : "/signin?error=confirm_link");
  }

  const next = sanitizeNextPath(url.searchParams.get("next") ?? undefined) ?? defaultNext(type);
  const { redirectTo } = await applySessionCookiesAfterAuth(cookies, data.session, next);
  return redirect(redirectTo);
};
