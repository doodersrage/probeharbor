import type { APIRoute } from "astro";
import { buildSignInRedirectUrl } from "../../../lib/signInErrors";
import { OAUTH_NEXT_COOKIE, OAUTH_REF_COOKIE, sanitizeNextPath } from "../../../lib/siteUrl";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  checkSigninRateLimit,
  clearSigninFailures,
  recordSigninFailure,
} from "../../../lib/signinLimits";
import { requestLocale } from "./_locale";
import { buildMfaChallengeUrl } from "../../../lib/mfa";
import { getUserMetadata, mergeUserMetadata } from "../../../lib/db/userMetadata";
import { betterAuthErrorCode, redirectWithAuthCookies, signInErrorFromBetterAuth } from "../../../lib/betterAuthResponse";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { startBetterAuthOAuth } from "../../../lib/betterAuthAppHandoff";
import type { OAuthProviderId } from "../../../lib/betterAuthOAuth";
import { DEFAULT_LOCALE } from "../../../i18n/locales";

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect, clientAddress } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();
  const safeNext = sanitizeNextPath(formData.get("next")?.toString());

  const refCode = formData.get("ref")?.toString()?.trim().toLowerCase() ?? "";

  const validProviders = ["google", "github", "discord"];

  // OAuth only when a provider is set and this is not an email/password submit
  // (nested OAuth fields used to leak into the email form in some browsers).
  if (provider && validProviders.includes(provider) && !password) {
    const secure = import.meta.env.PROD;
    if (safeNext) {
      cookies.set(OAUTH_NEXT_COOKIE, safeNext, {
        path: "/",
        httpOnly: true,
        secure,
        sameSite: "lax",
        maxAge: 60 * 10,
      });
    } else {
      cookies.delete(OAUTH_NEXT_COOKIE, { path: "/" });
    }

    if (refCode) {
      cookies.set(OAUTH_REF_COOKIE, refCode, {
        path: "/",
        httpOnly: true,
        secure,
        sameSite: "lax",
        maxAge: 60 * 10,
      });
    } else {
      cookies.delete(OAUTH_REF_COOKIE, { path: "/" });
    }

    // Provider returns to /api/auth/callback/<provider> (or the GitHub
    // callback), then /api/auth/oauth-done applies next / referral / language.
    const started = await startBetterAuthOAuth(request, provider as OAuthProviderId);
    return started ?? redirect(buildSignInRedirectUrl("oauth_failed"));
  }

  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(formData),
    clientAddress,
  );

  if (!turnstile.success) {
    return redirect(buildSignInRedirectUrl("turnstile_failed", email));
  }

  if (!email || !password) {
    return redirect(buildSignInRedirectUrl("missing_fields", email));
  }

  const rateLimit = checkSigninRateLimit(email);
  if (!rateLimit.ok) {
    return redirect(buildSignInRedirectUrl("rate_limited", email));
  }

  const res = await withBetterAuth(request, (auth) =>
    auth.api.signInEmail({ body: { email, password }, asResponse: true }),
  );
  const code = await betterAuthErrorCode(res);
  if (code) {
    recordSigninFailure(email);
    return redirect(buildSignInRedirectUrl(signInErrorFromBetterAuth(code), email));
  }
  const body = (await res.clone().json()) as { twoFactorRedirect?: boolean; user?: { id: string } };
  if (body.twoFactorRedirect) {
    // Password was right; Better Auth set its short-lived two-factor cookie
    // instead of a session. The code is checked on /signin/mfa.
    return redirectWithAuthCookies(buildMfaChallengeUrl(safeNext), res);
  }
  clearSigninFailures(email);
  // First sign-in from a translated page: remember that language on the account.
  const locale = requestLocale(context);
  if (body.user && locale !== DEFAULT_LOCALE) {
    try {
      const meta = await getUserMetadata(body.user.id);
      if (!meta.locale) await mergeUserMetadata(body.user.id, { locale });
    } catch (saveError) {
      console.error("auth: could not save account language", saveError instanceof Error ? saveError.message : saveError);
    }
  }
  return redirectWithAuthCookies(safeNext ?? "/dashboard", res);
};
