import type { APIRoute, AstroCookies } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { setMfaRequiredCookie } from "../../../lib/mfa";
import {
  createMfaStepUpProof,
  hasValidMfaStepUpProof,
  setMfaStepUpCookie,
} from "../../../lib/mfaStepUpProof";
import { sanitizeNextPath } from "../../../lib/siteUrl";
import {
  checkMfaVerifyRateLimit,
  clearMfaVerifyFailures,
  recordMfaVerifyFailure,
} from "../../../lib/mfaVerifyLimits";
import {
  getYubiKeyPublicIdsFromUser,
  isYubiKeyOtpConfigured,
  verifyYubiKeyOtpWithYubiCloud,
} from "../../../lib/yubikeyOtp";
import { hasMobileOAuthCookie } from "../../../lib/mobileAuthRedirect";
import { getUserMetadata } from "../../../lib/db/userMetadata";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { betterAuthErrorCode, redirectWithAuthCookies } from "../../../lib/betterAuthResponse";
import { betterAuthNeedsStepUp } from "../../../lib/betterAuthMfaGate";
import { hasTwoFactorChallenge, jsonWithAuthCookies } from "../../../lib/betterAuthMfa";

/** Mint step-up proof after successful MFA (needed for YubiKey aal1 path). */
async function issueMfaStepUpProof(
  cookies: AstroCookies,
  userId: string,
): Promise<string | null> {
  const token = await createMfaStepUpProof(userId);
  if (token) setMfaStepUpCookie(cookies, token);
  return token;
}

function buildMfaErrorRedirect(code: string, next?: string | null): string {
  const params = new URLSearchParams({ error: code });
  const safeNext = sanitizeNextPath(next ?? undefined);
  if (safeNext) params.set("next", safeNext);
  return `/signin/mfa?${params.toString()}`;
}

function wantsJson(request: Request): boolean {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  return accept.includes("application/json") || contentType.includes("application/json");
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * TOTP: the password (or OAuth) step left Better Auth's two-factor cookie
 * and no session; Better Auth checks the code (and counts attempts) and
 * issues the session. YubiKey: the user is signed in and the middleware asks
 * for the step-up; YubiCloud checks the OTP and the signed step-up proof is
 * set. Security keys moved to passkeys. App sign-ins finish at
 * /api/auth/companion/complete, which hands the app its session.
 */
async function verify(
  request: Request,
  cookies: AstroCookies,
  redirect: (path: string) => Response,
  input: { asJson: boolean; code: string; yubikeyOtp: string; action: string; next?: string },
): Promise<Response> {
  const { asJson, code, yubikeyOtp, action } = input;
  // Signing in for an app: finish by handing it a session (companion/complete).
  const safeNext = hasMobileOAuthCookie(cookies) ? "/api/auth/companion/complete" : (sanitizeNextPath(input.next) ?? "/dashboard");
  const fail = (error: string, status = 400) =>
    asJson ? jsonResponse({ error }, status) : redirect(buildMfaErrorRedirect(error, safeNext));

  if (action === "webauthn_challenge" || action === "webauthn_verify") return fail("no_factor");

  // Pending challenge + YubiKey: accounts that have both an authenticator app
  // and a YubiKey may finish it with the key.
  if (yubikeyOtp && hasTwoFactorChallenge(cookies)) {
    const challengeKey = `2fa:${cookies.get("__Secure-better-auth.two_factor")?.value ?? cookies.get("better-auth.two_factor")?.value ?? ""}`;
    if (!checkMfaVerifyRateLimit(challengeKey).ok) return fail("rate_limited", 429);
    // The endpoint checks its one field by hand (no schema), so give the call its shape here.
    type VerifyYubiKey = (args: { body: { otp: string }; headers: Headers; asResponse: true }) => Promise<Response>;
    const res = await withBetterAuth(request, (auth) =>
      (auth.api.verifyYubiKeyTwoFactor as unknown as VerifyYubiKey)({ body: { otp: yubikeyOtp }, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) {
      recordMfaVerifyFailure(challengeKey);
      const reason = (await betterAuthErrorCode(res)) ?? "";
      if (reason === "YUBIKEY_NOT_CONFIGURED") return fail("generic", 503);
      return fail(reason === "REPLAYED" ? "replayed_otp" : reason === "NOT_ENROLLED" ? "yubikey_not_enrolled" : "invalid_yubikey");
    }
    clearMfaVerifyFailures(challengeKey);
    setMfaRequiredCookie(cookies, false);
    return asJson ? jsonWithAuthCookies({ ok: true, aal: "aal2" }, 200, res) : redirectWithAuthCookies(safeNext, res);
  }

  if (!yubikeyOtp && hasTwoFactorChallenge(cookies)) {
    if (!/^\d{6}$/.test(code)) return fail("invalid_code");
    const res = await withBetterAuth(request, (auth) =>
      auth.api.verifyTOTP({ body: { code }, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) {
      const reason = (await betterAuthErrorCode(res)) ?? "";
      return fail(/ATTEMPT/i.test(reason) ? "rate_limited" : "invalid_code", /ATTEMPT/i.test(reason) ? 429 : 400);
    }
    setMfaRequiredCookie(cookies, false);
    return asJson ? jsonWithAuthCookies({ ok: true, aal: "aal2" }, 200, res) : redirectWithAuthCookies(safeNext, res);
  }

  const { user } = await getAuthFromCookies(cookies);
  if (!user) return asJson ? jsonResponse({ error: "Unauthorized" }, 401) : redirect("/signin?error=generic");
  const metadata = await getUserMetadata(user.id).catch(() => user.user_metadata ?? {});
  const fresh = { id: user.id, user_metadata: metadata };
  const needsStepUp = await betterAuthNeedsStepUp(fresh, (id) => hasValidMfaStepUpProof(request, cookies, id));
  if (!needsStepUp) {
    setMfaRequiredCookie(cookies, false);
    return asJson ? jsonResponse({ ok: true, aal: "aal2" }) : redirect(safeNext);
  }
  if (!yubikeyOtp) return fail("invalid_yubikey");

  const rateLimit = checkMfaVerifyRateLimit(user.id);
  if (!rateLimit.ok) return fail("rate_limited", 429);
  if (!isYubiKeyOtpConfigured()) return fail("generic", 503);
  const enrolled = getYubiKeyPublicIdsFromUser(fresh);
  const verified = await verifyYubiKeyOtpWithYubiCloud(yubikeyOtp);
  if (!verified.ok) {
    recordMfaVerifyFailure(user.id);
    return fail(verified.error.includes("already used") ? "replayed_otp" : "invalid_yubikey");
  }
  if (!enrolled.includes(verified.publicId)) {
    recordMfaVerifyFailure(user.id);
    return fail("yubikey_not_enrolled");
  }
  clearMfaVerifyFailures(user.id);
  const mfaStepup = await issueMfaStepUpProof(cookies, user.id);
  if (!mfaStepup) {
    console.error("MFA step-up secret not configured (set MFA_STEPUP_SECRET or CRON_SECRET)");
    return fail("generic", 503);
  }
  setMfaRequiredCookie(cookies, false);
  return asJson ? jsonResponse({ ok: true, aal: "aal2", mfa_stepup: mfaStepup }) : redirect(safeNext);
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const asJson = wantsJson(request);
  let fields: { code?: string; yubikey_otp?: string; action?: string; next?: string } = {};
  if (asJson) {
    try {
      fields = (await request.clone().json()) as typeof fields;
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
  } else {
    const form = await request.clone().formData();
    fields = {
      code: form.get("code")?.toString(),
      yubikey_otp: form.get("yubikey_otp")?.toString(),
      next: form.get("next")?.toString(),
    };
  }
  return verify(request, cookies, redirect, {
    asJson,
    code: fields.code?.trim() ?? "",
    yubikeyOtp: fields.yubikey_otp?.trim() ?? "",
    action: fields.action?.trim() ?? "",
    next: fields.next,
  });
};
