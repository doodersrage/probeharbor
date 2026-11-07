import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../../lib/auth";
import {
  hasMobileOAuthCookie,
  maybeRedirectMobileOAuth,
} from "../../../../lib/mobileAuthRedirect";
import { buildMfaChallengeUrl, sessionNeedsMfaStepUp } from "../../../../lib/mfa";
import { hasValidMfaStepUpProof } from "../../../../lib/mfaStepUpProof";
import { dbBackend } from "../../../../lib/db/client";
import { createAppSessionToken } from "../../../../lib/betterAuthAppHandoff";
import { betterAuthNeedsStepUp } from "../../../../lib/betterAuthMfaGate";

/**
 * After email/password (or OAuth next=) sign-in, finish companion handoff.
 * Requires companion/start to have set the mobile_oauth (+ optional loopback) cookies.
 */
export const GET: APIRoute = async ({ cookies, redirect, request, site }) => {
  if (dbBackend() === "neon") {
    // TOTP was checked before this session existed; YubiKey still steps up here.
    const { user } = await getAuthFromCookies(cookies);
    if (!user) return redirect(`/signin?next=${encodeURIComponent("/api/auth/companion/complete")}`);
    if (!hasMobileOAuthCookie(cookies)) return redirect("/apps?error=companion_session");
    if (await betterAuthNeedsStepUp(user, (id) => hasValidMfaStepUpProof(request, cookies, id))) {
      return redirect(buildMfaChallengeUrl("/api/auth/companion/complete"));
    }
    const token = await createAppSessionToken(request, user.id);
    return (await maybeRedirectMobileOAuth(cookies, token, token, site)) ?? redirect("/dashboard");
  }
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session?.access_token || !session.refresh_token) {
    return redirect(
      `/signin?next=${encodeURIComponent("/api/auth/companion/complete")}`,
    );
  }

  if (!hasMobileOAuthCookie(cookies)) {
    return redirect("/apps?error=companion_session");
  }

  const needsMfa = await sessionNeedsMfaStepUp(
    session.access_token,
    session.refresh_token,
    user,
  );
  if (needsMfa) {
    const hasProof =
      !!user?.id &&
      (await hasValidMfaStepUpProof(request, cookies, user.id));
    if (!hasProof) {
      return redirect(buildMfaChallengeUrl("/api/auth/companion/complete"));
    }
  }

  const handoff = await maybeRedirectMobileOAuth(
    cookies,
    session.access_token,
    session.refresh_token,
    site,
  );
  if (handoff) return handoff;

  return redirect("/dashboard");
};
