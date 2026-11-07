import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../../lib/auth";
import { buildSignInRedirectUrl } from "../../../../lib/signInErrors";
import { OAUTH_NEXT_COOKIE, OAUTH_REF_COOKIE } from "../../../../lib/siteUrl";
import {
  redirectMobileOAuthComplete,
  setMobileOAuthCookie,
} from "../../../../lib/mobileAuthRedirect";
import {
  parseCompanionClient,
  setCompanionClientCookie,
  setCompanionLoopbackCookie,
} from "../../../../lib/companionAuth";
import { buildMfaChallengeUrl } from "../../../../lib/mfa";
import { hasValidMfaStepUpProof } from "../../../../lib/mfaStepUpProof";
import { createAppSessionToken, startBetterAuthOAuth } from "../../../../lib/betterAuthAppHandoff";
import { betterAuthNeedsStepUp } from "../../../../lib/betterAuthMfaGate";
import type { OAuthProviderId } from "../../../../lib/betterAuthOAuth";

const VALID_PROVIDERS = ["google", "github", "discord"] as const;

/**
 * Start companion (Bay Buddy / Desktop / Android) sign-in.
 *
 * Query:
 * - `client=baybuddy|desktop|android` (default baybuddy)
 * - `loopback=http://127.0.0.1:PORT/oauth` (required for desktop return)
 * - `provider=google|github|discord` (optional; omit to use email sign-in page)
 */
export const GET: APIRoute = async ({ url, cookies, redirect, request, site }) => {
  const client = parseCompanionClient(url.searchParams.get("client"));
  const loopback = url.searchParams.get("loopback")?.trim() ?? "";
  const provider = url.searchParams.get("provider")?.trim().toLowerCase() ?? "";

  if (loopback && !setCompanionLoopbackCookie(cookies, loopback)) {
    return new Response(JSON.stringify({ error: "Invalid loopback URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  setCompanionClientCookie(cookies, client);
  // Android passes its package (app=) so the hand-off opens the right app.
  setMobileOAuthCookie(cookies, url.searchParams.get("app"));
  cookies.delete(OAUTH_NEXT_COOKIE, { path: "/" });
  cookies.delete(OAUTH_REF_COOKIE, { path: "/" });

  // Already signed in here: hand the app a session of its own (after any YubiKey step).
  const { user: signedIn } = await getAuthFromCookies(cookies);
  if (signedIn) {
    if (await betterAuthNeedsStepUp(signedIn, (id) => hasValidMfaStepUpProof(request, cookies, id))) {
      return redirect(buildMfaChallengeUrl(`${url.pathname}${url.search}`));
    }
    const token = await createAppSessionToken(request, signedIn.id);
    const handoff = await redirectMobileOAuthComplete(token, token, site);
    if (handoff) return handoff;
  }
  if (provider && VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])) {
    return (await startBetterAuthOAuth(request, provider as OAuthProviderId)) ?? redirect(buildSignInRedirectUrl("oauth_failed"));
  }
  // Email / password (or pick a provider on the sign-in page).
  return redirect(`/signin?next=${encodeURIComponent("/api/auth/companion/complete")}`);
};
