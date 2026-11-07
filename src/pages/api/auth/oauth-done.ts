import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import { getUserMetadata, mergeUserMetadata } from "../../../lib/db/userMetadata";
import { applyReferralForNewUser } from "../../../lib/referrals";
import { REGISTER_NEXT_DEVICES } from "../../../lib/registerUrl";
import { type SignInErrorCode, buildSignInRedirectUrl } from "../../../lib/signInErrors";
import { OAUTH_NEXT_COOKIE, OAUTH_REF_COOKIE, sanitizeNextPath } from "../../../lib/siteUrl";
import { DEFAULT_LOCALE } from "../../../i18n/locales";
import { requestLocale } from "./_locale";

/**
 * Where OAuth sign-in lands after Better Auth's callback (DB_BACKEND=neon).
 * Does what /api/auth/callback and the GitHub callback did after Supabase
 * signed the user in: account language, referral for new accounts, and the
 * page to go to next. Two-factor users never get here: they're sent to
 * /signin/mfa first (oauthTwoFactorPlugin). YubiKey users are stopped by the
 * middleware on the next page, as before.
 */
function errorCode(code: string): SignInErrorCode {
  if (code === "access_denied") return "oauth_denied";
  // GitHub link refused, or an email that isn't verified on one side.
  if (code === "account_not_linked" || code === "unable_to_link_account" || code === "account_already_linked_to_different_user") {
    return "oauth_account_exists";
  }
  return "oauth_exchange_failed";
}

export const GET: APIRoute = async (context) => {
  const { url, cookies, redirect, request } = context;
  const failure = url.searchParams.get("error");
  if (failure) {
    console.error("OAuth sign-in failed:", failure.slice(0, 80));
    return redirect(buildSignInRedirectUrl(errorCode(failure)));
  }

  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) return redirect(buildSignInRedirectUrl("oauth_exchange_failed"));
  const isNew = url.searchParams.get("new") === "1";

  // New accounts get the language they signed up in; existing ones without a
  // language get it when signing in from a translated page.
  const locale = requestLocale(context);
  try {
    const metadata = await getUserMetadata(user.id);
    if (!metadata.locale && (isNew || locale !== DEFAULT_LOCALE)) await mergeUserMetadata(user.id, { locale });
  } catch (error) {
    console.error("oauth: could not save account language", error instanceof Error ? error.message : error);
  }

  const refCode = cookies.get(OAUTH_REF_COOKIE)?.value?.trim().toLowerCase() ?? "";
  cookies.delete(OAUTH_REF_COOKIE, { path: "/" });
  if (refCode && isNew) await applyReferralForNewUser(user.id, refCode, user.app_metadata);

  const nextCookie = cookies.get(OAUTH_NEXT_COOKIE)?.value;
  cookies.delete(OAUTH_NEXT_COOKIE, { path: "/" });
  return redirect(sanitizeNextPath(nextCookie) ?? (isNew ? REGISTER_NEXT_DEVICES : "/dashboard"));
};
