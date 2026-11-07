import type { APIRoute, AstroCookies } from "astro";
import { getAuthFromCookies, setAuthCookies } from "../../../lib/auth";
import {
  createAuthClient,
  getAssuranceLevels,
  getAalClaim,
  needsMfaStepUp,
  setMfaRequiredCookie,
} from "../../../lib/mfa";
import {
  createMfaStepUpProof,
  setMfaStepUpCookie,
} from "../../../lib/mfaStepUpProof";
import { sanitizeNextPath } from "../../../lib/siteUrl";
import {
  checkMfaVerifyRateLimit,
  clearMfaVerifyFailures,
  recordMfaVerifyFailure,
} from "../../../lib/mfaVerifyLimits";
import {
  challengeWebAuthnFactor,
  verifyWebAuthnFactor,
  type WebAuthnCredentialResponse,
} from "../../../lib/webauthnMfaApi";
import { resolveWebAuthnRp } from "../../../lib/webauthnRp";
import {
  getYubiKeyPublicIdsFromUser,
  isYubiKeyOtpConfigured,
  userHasYubiKeyOtpEnrolled,
  verifyYubiKeyOtpWithYubiCloud,
} from "../../../lib/yubikeyOtp";
import { maybeRedirectMobileOAuth } from "../../../lib/mobileAuthRedirect";
import { dbBackend } from "../../../lib/db/client";
import { getUserMetadata } from "../../../lib/db/userMetadata";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { betterAuthErrorCode, redirectWithAuthCookies } from "../../../lib/betterAuthResponse";
import { betterAuthNeedsStepUp } from "../../../lib/betterAuthMfaGate";
import { hasTwoFactorChallenge, jsonWithAuthCookies } from "../../../lib/betterAuthMfa";
import { hasValidMfaStepUpProof } from "../../../lib/mfaStepUpProof";

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
 * Neon. TOTP: the password (or OAuth) step left Better Auth's two-factor
 * cookie and no session; Better Auth checks the code (and counts attempts)
 * and issues the session. YubiKey: the user is signed in and the
 * middleware asks for the step-up; YubiCloud checks the OTP as before and
 * the signed step-up proof is set. Security keys moved to passkeys.
 * Companion / Android JSON callers get their tokens in step 4f.
 */
async function verifyBetterAuth(
  request: Request,
  cookies: AstroCookies,
  redirect: (path: string) => Response,
  input: { asJson: boolean; code: string; yubikeyOtp: string; action: string; next?: string },
): Promise<Response> {
  const { asJson, code, yubikeyOtp, action } = input;
  const safeNext = sanitizeNextPath(input.next) ?? "/dashboard";
  const fail = (error: string, status = 400) =>
    asJson ? jsonResponse({ error }, status) : redirect(buildMfaErrorRedirect(error, safeNext));

  if (action === "webauthn_challenge" || action === "webauthn_verify") return fail("no_factor");

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

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  if (dbBackend() === "neon") {
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
    return verifyBetterAuth(request, cookies, redirect, {
      asJson,
      code: fields.code?.trim() ?? "",
      yubikeyOtp: fields.yubikey_otp?.trim() ?? "",
      action: fields.action?.trim() ?? "",
      next: fields.next,
    });
  }
  const { session, user } = await getAuthFromCookies(cookies);
  const asJson = wantsJson(request);

  if (!session || !user) {
    if (asJson) return jsonResponse({ error: "Unauthorized" }, 401);
    return redirect("/signin?error=generic");
  }

  let code = "";
  let yubikeyOtp = "";
  let next: string | undefined;
  let action = "";
  let factorId = "";
  let challengeId = "";
  let ceremonyType: "create" | "request" | "" = "";
  let credentialResponse: WebAuthnCredentialResponse | null = null;

  if (asJson) {
    let body: {
      action?: string;
      code?: string;
      yubikey_otp?: string;
      next?: string;
      factorId?: string;
      challengeId?: string;
      ceremonyType?: "create" | "request";
      credentialResponse?: WebAuthnCredentialResponse;
    };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    action = body.action?.trim() ?? "";
    code = body.code?.trim() ?? "";
    yubikeyOtp = body.yubikey_otp?.trim() ?? "";
    next = body.next;
    factorId = body.factorId?.trim() ?? "";
    challengeId = body.challengeId?.trim() ?? "";
    ceremonyType = body.ceremonyType ?? "";
    credentialResponse = body.credentialResponse ?? null;
  } else {
    const formData = await request.formData();
    code = formData.get("code")?.toString().trim() ?? "";
    yubikeyOtp = formData.get("yubikey_otp")?.toString().trim() ?? "";
    next = formData.get("next")?.toString();
  }

  const safeNext = sanitizeNextPath(next) ?? "/dashboard";

  const client = createAuthClient();
  const { error: sessionError } = await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
  if (sessionError) {
    if (asJson) return jsonResponse({ error: "generic" }, 400);
    return redirect("/signin?error=generic");
  }

  const levels = await getAssuranceLevels(client);
  const needsSupabaseStepUp = needsMfaStepUp(levels);
  const needsYubiStepUp =
    getAalClaim(session.access_token) !== "aal2" &&
    userHasYubiKeyOtpEnrolled(user);

  if (!needsSupabaseStepUp && !needsYubiStepUp) {
    setMfaRequiredCookie(cookies, false);
    const mfaStepup = await issueMfaStepUpProof(cookies, user.id);
    if (asJson) {
      return jsonResponse({
        ok: true,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        aal: "aal2",
        ...(mfaStepup ? { mfa_stepup: mfaStepup } : {}),
      });
    }
    const mobileRedirect = await maybeRedirectMobileOAuth(
      cookies,
      session.access_token,
      session.refresh_token,
      url.origin,
    );
    if (mobileRedirect) return mobileRedirect;
    return redirect(safeNext);
  }

  if (asJson && action === "webauthn_challenge") {
    const { data: factors, error: factorsError } = await client.auth.mfa.listFactors();
    if (factorsError) {
      return jsonResponse({ error: "generic" }, 400);
    }

    const webauthnFactor =
      (factorId
        ? factors.webauthn.find((item) => item.id === factorId)
        : null) ??
      factors.webauthn.find((item) => item.status === "verified") ??
      factors.webauthn[0] ??
      null;

    if (!webauthnFactor) {
      return jsonResponse({ error: "no_factor" }, 400);
    }

    const rp = resolveWebAuthnRp(request);
    const { challenge, error: challengeError } = await challengeWebAuthnFactor(
      session.access_token,
      webauthnFactor.id,
      rp,
    );
    if (challengeError || !challenge) {
      return jsonResponse({ error: challengeError ?? "generic" }, 400);
    }

    return jsonResponse({
      ok: true,
      factorId: challenge.factorId,
      challengeId: challenge.challengeId,
      ceremonyType: challenge.ceremonyType,
      publicKey: challenge.publicKey,
    });
  }

  if (asJson && action === "webauthn_verify") {
    const rateLimit = checkMfaVerifyRateLimit(user.id);
    if (!rateLimit.ok) {
      return jsonResponse({ error: "rate_limited" }, 429);
    }

    if (
      !factorId ||
      !challengeId ||
      (ceremonyType !== "create" && ceremonyType !== "request") ||
      !credentialResponse
    ) {
      recordMfaVerifyFailure(user.id);
      return jsonResponse({ error: "invalid_code" }, 400);
    }

    const rp = resolveWebAuthnRp(request);
    const { result, error: verifyError } = await verifyWebAuthnFactor(
      session.access_token,
      factorId,
      challengeId,
      ceremonyType,
      credentialResponse,
      rp,
    );

    if (verifyError || !result) {
      recordMfaVerifyFailure(user.id);
      return jsonResponse({ error: "invalid_code" }, 400);
    }

    clearMfaVerifyFailures(user.id);
    setAuthCookies(cookies, result.accessToken, result.refreshToken);
    setMfaRequiredCookie(cookies, false);
    const mfaStepup = await issueMfaStepUpProof(cookies, user.id);
    return jsonResponse({
      ok: true,
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      aal: "aal2",
      ...(mfaStepup ? { mfa_stepup: mfaStepup } : {}),
    });
  }

  if (yubikeyOtp) {
    const rateLimit = checkMfaVerifyRateLimit(user.id);
    if (!rateLimit.ok) {
      if (asJson) return jsonResponse({ error: "rate_limited" }, 429);
      return redirect(buildMfaErrorRedirect("rate_limited", safeNext));
    }

    if (!isYubiKeyOtpConfigured()) {
      if (asJson) return jsonResponse({ error: "generic" }, 503);
      return redirect(buildMfaErrorRedirect("generic", safeNext));
    }

    const { data: freshUserData } = await client.auth.getUser();
    const enrolled = getYubiKeyPublicIdsFromUser(freshUserData.user ?? user);
    if (enrolled.length === 0) {
      if (asJson) return jsonResponse({ error: "no_factor" }, 400);
      return redirect(buildMfaErrorRedirect("no_factor", safeNext));
    }

    const verified = await verifyYubiKeyOtpWithYubiCloud(yubikeyOtp);
    if (!verified.ok) {
      recordMfaVerifyFailure(user.id);
      const errorCode = verified.error.includes("already used")
        ? "replayed_otp"
        : "invalid_yubikey";
      if (asJson) return jsonResponse({ error: errorCode }, 400);
      return redirect(buildMfaErrorRedirect(errorCode, safeNext));
    }
    if (!enrolled.includes(verified.publicId)) {
      recordMfaVerifyFailure(user.id);
      if (asJson) return jsonResponse({ error: "yubikey_not_enrolled" }, 400);
      return redirect(buildMfaErrorRedirect("yubikey_not_enrolled", safeNext));
    }

    clearMfaVerifyFailures(user.id);
    // YubiKey leaves the Supabase JWT at aal1; step-up cookie is required
    // for middleware to treat the session as MFA-complete.
    const mfaStepup = await issueMfaStepUpProof(cookies, user.id);
    if (!mfaStepup) {
      console.error(
        "MFA step-up secret not configured (set MFA_STEPUP_SECRET or CRON_SECRET)",
      );
      if (asJson) return jsonResponse({ error: "generic" }, 503);
      return redirect(buildMfaErrorRedirect("generic", safeNext));
    }
    setMfaRequiredCookie(cookies, false);
    if (asJson) {
      return jsonResponse({
        ok: true,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        aal: getAalClaim(session.access_token) ?? "aal1",
        mfa_stepup: mfaStepup,
      });
    }
    const mobileRedirect = await maybeRedirectMobileOAuth(
      cookies,
      session.access_token,
      session.refresh_token,
      url.origin,
    );
    if (mobileRedirect) return mobileRedirect;
    return redirect(safeNext);
  }

  const rateLimit = checkMfaVerifyRateLimit(user.id);
  if (!rateLimit.ok) {
    if (asJson) return jsonResponse({ error: "rate_limited" }, 429);
    return redirect(buildMfaErrorRedirect("rate_limited", safeNext));
  }

  if (!/^\d{6}$/.test(code)) {
    recordMfaVerifyFailure(user.id);
    if (asJson) return jsonResponse({ error: "invalid_code" }, 400);
    return redirect(buildMfaErrorRedirect("invalid_code", safeNext));
  }

  if (!needsSupabaseStepUp) {
    if (asJson) return jsonResponse({ error: "no_factor" }, 400);
    return redirect(buildMfaErrorRedirect("no_factor", safeNext));
  }

  const { data: factors, error: factorsError } = await client.auth.mfa.listFactors();
  if (factorsError) {
    if (asJson) return jsonResponse({ error: "generic" }, 400);
    return redirect(buildMfaErrorRedirect("generic", safeNext));
  }

  const factor =
    factors.totp.find((item) => item.status === "verified") ??
    factors.totp[0] ??
    null;

  if (!factor) {
    if (asJson) return jsonResponse({ error: "no_factor" }, 400);
    return redirect(buildMfaErrorRedirect("no_factor", safeNext));
  }

  const { data, error } = await client.auth.mfa.challengeAndVerify({
    factorId: factor.id,
    code,
  });

  if (error || !data?.access_token || !data.refresh_token) {
    recordMfaVerifyFailure(user.id);
    if (asJson) return jsonResponse({ error: "invalid_code" }, 400);
    return redirect(buildMfaErrorRedirect("invalid_code", safeNext));
  }

  clearMfaVerifyFailures(user.id);
  setAuthCookies(cookies, data.access_token, data.refresh_token);
  setMfaRequiredCookie(cookies, false);
  const mfaStepup = await issueMfaStepUpProof(cookies, user.id);
  if (asJson) {
    return jsonResponse({
      ok: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      aal: "aal2",
      ...(mfaStepup ? { mfa_stepup: mfaStepup } : {}),
    });
  }
  const mobileRedirect = await maybeRedirectMobileOAuth(
    cookies,
    data.access_token,
    data.refresh_token,
    url.origin,
  );
  if (mobileRedirect) return mobileRedirect;
  return redirect(safeNext);
};
