import type { APIRoute } from "astro";
import { buildSignInRedirectUrl } from "../../../../lib/signInErrors";
import { OAUTH_NEXT_COOKIE, OAUTH_REF_COOKIE } from "../../../../lib/siteUrl";
import { setMobileOAuthCookie } from "../../../../lib/mobileAuthRedirect";
import { startBetterAuthOAuth } from "../../../../lib/betterAuthAppHandoff";
import type { OAuthProviderId } from "../../../../lib/betterAuthOAuth";

const VALID = ["google", "github", "discord"] as const;

/**
 * Start OAuth in a mobile browser tab; /api/auth/oauth-done sends the app
 * back via /api/auth/companion/complete.
 */
export const GET: APIRoute = async ({ url, cookies, redirect, request }) => {
  const provider = url.searchParams.get("provider")?.trim().toLowerCase() ?? "";
  if (!VALID.includes(provider as (typeof VALID)[number])) {
    return redirect(buildSignInRedirectUrl("oauth_failed"));
  }

  setMobileOAuthCookie(cookies, url.searchParams.get("app"));
  cookies.delete(OAUTH_NEXT_COOKIE, { path: "/" });
  cookies.delete(OAUTH_REF_COOKIE, { path: "/" });

  return (await startBetterAuthOAuth(request, provider as OAuthProviderId)) ?? redirect(buildSignInRedirectUrl("oauth_failed"));
};
