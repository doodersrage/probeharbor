import type { APIRoute } from "astro";
import type { AstroCookies } from "astro";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "../../../types/supabase";
import { getAuthFromCookies, setAuthCookies } from "../../../lib/auth";
import {
  createAuthClientFromSession,
  getAalClaim,
  syncMfaRequiredCookieFromClient,
  userHasAnyMfaEnrolled,
} from "../../../lib/mfa";
import { hasElevatedAuth } from "../../../lib/mfaStepUpProof";
import {
  challengeWebAuthnFactor,
  enrollWebAuthnFactor,
  verifyWebAuthnFactor,
  type WebAuthnCredentialResponse,
} from "../../../lib/webauthnMfaApi";
import { resolveWebAuthnRp } from "../../../lib/webauthnRp";
import {
  buildYubiKeyMetadataRemove,
  buildYubiKeyMetadataUpdate,
  getYubiKeyPublicIdsFromUser,
  isYubiKeyOtpConfigured,
  verifyYubiKeyOtpWithYubiCloud,
} from "../../../lib/yubikeyOtp";
import { authApiMessages } from "../../../i18n/messages/app/auth/api";
import type { Locale } from "../../../i18n/locales";
import { requestLocale } from "./_locale";
import { dbBackend } from "../../../lib/db/client";
import { getUserMetadata, mergeUserMetadata } from "../../../lib/db/userMetadata";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { betterAuthErrorCode } from "../../../lib/betterAuthResponse";
import { getTotpState, isElevated, jsonWithAuthCookies, totpFactors } from "../../../lib/betterAuthMfa";
import { renderIngestQrDataUrl } from "../../../lib/qrSvg";

/** Neon: factor list for the settings screen. */
async function listBetterAuth(userId: string): Promise<Response> {
  const [state, metadata] = await Promise.all([getTotpState(userId), getUserMetadata(userId)]);
  const totp = totpFactors(state);
  return json({
    factors: totp,
    totp,
    webauthn: [],
    yubikeyPublicIds: getYubiKeyPublicIdsFromUser({ user_metadata: metadata }),
    yubikeyOtpConfigured: isYubiKeyOtpConfigured(),
    passwordRequired: state.hasPassword,
  });
}

/** Neon: the same actions as below, on Better Auth's two-factor API and user_profiles.metadata. */
async function manageBetterAuth(
  request: Request,
  cookies: AstroCookies,
  userId: string,
  body: ManageBody,
  t: ReturnType<typeof authApiMessages>["mfa"],
): Promise<Response> {
  const action = body.action?.trim();
  const [state, metadata] = await Promise.all([getTotpState(userId), getUserMetadata(userId)]);
  const yubikeys = getYubiKeyPublicIdsFromUser({ user_metadata: metadata });
  const hasAnyMfa = state.enabled || yubikeys.length > 0;
  const elevated = () => isElevated(state, request, cookies, userId);
  const password = body.password ?? "";
  const failed = async (res: Response, fallback: string) =>
    json({ error: (await betterAuthErrorCode(res)) === "INVALID_PASSWORD" ? t.passwordIncorrect : fallback }, 400);

  if (action === "enroll") {
    if (state.enabled) return json({ error: t.totpAlreadyEnabled }, 400);
    if (hasAnyMfa && !(await elevated())) return json({ error: t.verifyBeforeAdding }, 401);
    if (state.hasPassword && !password) return json({ error: t.passwordIncorrect }, 400);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.enableTwoFactor({ body: state.hasPassword ? { password } : {}, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) return failed(res, t.verificationFailed);
    const { totpURI } = (await res.clone().json()) as { totpURI?: string };
    if (!totpURI) return json({ error: t.verificationFailed }, 400);
    return jsonWithAuthCookies({ factorId: "totp", qrCode: renderIngestQrDataUrl(totpURI, 180) }, 200, res);
  }

  if (action === "verify") {
    const code = body.code?.trim() ?? "";
    if (!/^\d{6}$/.test(code)) return json({ error: t.invalidCode }, 400);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.verifyTOTP({ body: { code }, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) return json({ error: t.verificationFailed }, 400);
    return jsonWithAuthCookies({ ok: true }, 200, res);
  }

  if (action === "unenroll") {
    if (!state.enabled && !state.pending) return json({ error: "Missing factorId" }, 400);
    if (!(await elevated())) return json({ error: t.verifyBeforeRemoving }, 401);
    if (state.hasPassword && !password) return json({ error: t.passwordIncorrect }, 400);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.disableTwoFactor({ body: state.hasPassword ? { password } : {}, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) return failed(res, t.verificationFailed);
    return jsonWithAuthCookies({ ok: true }, 200, res);
  }

  if (action === "webauthn_enroll" || action === "webauthn_challenge" || action === "webauthn_verify") {
    return json({ error: t.securityKeysMoved }, 400);
  }

  if (action === "yubikey_enroll") {
    if (!isYubiKeyOtpConfigured()) return json({ error: t.yubikeyNotConfigured }, 503);
    if (hasAnyMfa && !(await elevated())) return json({ error: t.verifyBeforeAdding }, 401);
    const otp = body.otp?.trim() ?? "";
    if (!otp) return json({ error: t.tapYubikey }, 400);
    const verified = await verifyYubiKeyOtpWithYubiCloud(otp);
    if (!verified.ok) return json({ error: verified.error }, 400);
    if (yubikeys.includes(verified.publicId)) return json({ error: t.yubikeyAlreadyEnrolled }, 400);
    if (yubikeys.length >= 5) return json({ error: t.yubikeyLimit }, 400);
    await mergeUserMetadata(userId, buildYubiKeyMetadataUpdate(yubikeys, verified.publicId));
    return json({ ok: true, publicId: verified.publicId });
  }

  if (action === "yubikey_unenroll") {
    const publicId = body.publicId?.trim().toLowerCase() ?? "";
    const otp = body.otp?.trim() ?? "";
    if (!publicId) return json({ error: "Missing publicId" }, 400);
    if (!yubikeys.includes(publicId)) return json({ error: t.yubikeyNotFound }, 400);
    if (!(await elevated())) {
      if (!isYubiKeyOtpConfigured()) return json({ error: t.verifyBeforeRemovingYubikeys }, 401);
      if (!otp) return json({ error: t.tapYubikeyToRemove }, 400);
      const verified = await verifyYubiKeyOtpWithYubiCloud(otp);
      if (!verified.ok || verified.publicId !== publicId) return json({ error: t.yubikeyConfirmFailed }, 400);
    }
    await mergeUserMetadata(userId, buildYubiKeyMetadataRemove(yubikeys, publicId));
    return json({ ok: true });
  }

  return json({ error: "Unknown action" }, 400);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function requireSession(cookies: Parameters<typeof getAuthFromCookies>[0]) {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) return null;
  return { session, user };
}

/**
 * First-factor enroll stays available at aal1. Adding another factor after MFA
 * exists requires aal2 or a valid step-up proof (closes password-theft enroll bypass).
 */
async function requireElevatedForAdditionalEnroll(
  request: Request,
  cookies: AstroCookies,
  session: Session,
  user: User,
  client: SupabaseClient<Database>,
  locale: Locale,
): Promise<Response | null> {
  const { data: userData } = await client.auth.getUser();
  const hasMfa = await userHasAnyMfaEnrolled(client, userData.user ?? user);
  if (!hasMfa) return null;

  if (await hasElevatedAuth(request, cookies, session.access_token, user.id)) {
    return null;
  }

  return json(
    { error: authApiMessages(locale).mfa.verifyBeforeAdding },
    401,
  );
}

/** List TOTP factors for the signed-in user (cookie session; no browser Supabase keys). */
export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireSession(cookies);
  if (!auth) return json({ error: "Unauthorized" }, 401);
  if (dbBackend() === "neon") return listBetterAuth(auth.user.id);

  const { client, error } = await createAuthClientFromSession(
    auth.session.access_token,
    auth.session.refresh_token,
  );
  if (error) return json({ error }, 401);

  const { data, error: factorsError } = await client.auth.mfa.listFactors();
  if (factorsError) {
    return json({ error: factorsError.message }, 400);
  }

  const mapFactor = (factor: {
    id: string;
    friendly_name?: string | null;
    status: string;
  }) => ({
    id: factor.id,
    friendly_name: factor.friendly_name ?? null,
    status: factor.status,
  });

  const totp = (data?.totp ?? []).map(mapFactor);
  const webauthn = (data?.webauthn ?? []).map(mapFactor);
  const { data: userData } = await client.auth.getUser();
  const yubikeyPublicIds = getYubiKeyPublicIdsFromUser(userData.user ?? auth.user);

  return json({
    factors: totp,
    totp,
    webauthn,
    yubikeyPublicIds,
    yubikeyOtpConfigured: isYubiKeyOtpConfigured(),
  });
};

type ManageBody = {
  action?: string;
  factorId?: string;
  code?: string;
  friendlyName?: string;
  challengeId?: string;
  ceremonyType?: "create" | "request";
  credentialResponse?: WebAuthnCredentialResponse;
  otp?: string;
  publicId?: string;
  /** Neon: account password for turning TOTP on or off. */
  password?: string;
};

/**
 * MFA enrollment management via HttpOnly cookies:
 * - enroll → QR + factor id
 * - verify → activate factor, refresh cookies to aal2 when possible
 * - unenroll → remove factor
 */
export const POST: APIRoute = async (context) => {
  const { request, cookies } = context;
  const locale = requestLocale(context);
  const t = authApiMessages(locale).mfa;
  const auth = await requireSession(cookies);
  if (!auth) return json({ error: "Unauthorized" }, 401);

  let body: ManageBody;
  try {
    body = (await request.json()) as ManageBody;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const action = body.action?.trim();
  if (!action) return json({ error: "Missing action" }, 400);
  if (dbBackend() === "neon") return manageBetterAuth(request, cookies, auth.user.id, body, t);

  const { client, error } = await createAuthClientFromSession(
    auth.session.access_token,
    auth.session.refresh_token,
  );
  if (error) return json({ error }, 401);

  if (action === "enroll") {
    const blocked = await requireElevatedForAdditionalEnroll(
      request,
      cookies,
      auth.session,
      auth.user,
      client,
      locale,
    );
    if (blocked) return blocked;

    const { data, error: enrollError } = await client.auth.mfa.enroll({
      factorType: "totp",
      friendlyName:
        body.friendlyName?.trim() ||
        `Authenticator ${new Date().toLocaleDateString()}`,
    });
    if (enrollError) return json({ error: enrollError.message }, 400);

    return json({
      factorId: data?.id ?? null,
      qrCode: data?.totp?.qr_code ?? null,
    });
  }

  if (action === "verify") {
    const factorId = body.factorId?.trim();
    const code = body.code?.trim() ?? "";
    if (!factorId || !/^\d{6}$/.test(code)) {
      return json({ error: t.invalidCode }, 400);
    }

    const { data, error: verifyError } = await client.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });
    if (verifyError || !data?.access_token || !data.refresh_token) {
      return json({ error: verifyError?.message ?? t.verificationFailed }, 400);
    }

    setAuthCookies(cookies, data.access_token, data.refresh_token);
    const refreshed = await createAuthClientFromSession(
      data.access_token,
      data.refresh_token,
    );
    if (!refreshed.error) {
      await syncMfaRequiredCookieFromClient(
        cookies,
        refreshed.client,
        data.access_token,
      );
    } else {
      await syncMfaRequiredCookieFromClient(cookies, client, data.access_token);
    }

    return json({ ok: true });
  }

  if (action === "webauthn_enroll") {
    const blocked = await requireElevatedForAdditionalEnroll(
      request,
      cookies,
      auth.session,
      auth.user,
      client,
      locale,
    );
    if (blocked) return blocked;

    const friendlyName =
      body.friendlyName?.trim() ||
      `Security key ${new Date().toLocaleDateString()}`;
    const { factorId, error: enrollError } = await enrollWebAuthnFactor(
      auth.session.access_token,
      friendlyName,
    );
    if (enrollError) return json({ error: enrollError }, 400);
    return json({ factorId, friendlyName });
  }

  if (action === "webauthn_challenge") {
    const factorId = body.factorId?.trim();
    if (!factorId) return json({ error: "Missing factorId" }, 400);

    const rp = resolveWebAuthnRp(request);
    const { challenge, error: challengeError } = await challengeWebAuthnFactor(
      auth.session.access_token,
      factorId,
      rp,
    );
    if (challengeError || !challenge) {
      return json({ error: challengeError ?? t.challengeFailed }, 400);
    }

    return json({
      ok: true,
      factorId: challenge.factorId,
      challengeId: challenge.challengeId,
      ceremonyType: challenge.ceremonyType,
      publicKey: challenge.publicKey,
    });
  }

  if (action === "webauthn_verify") {
    const factorId = body.factorId?.trim();
    const challengeId = body.challengeId?.trim();
    const ceremonyType = body.ceremonyType;
    const credentialResponse = body.credentialResponse;

    if (
      !factorId ||
      !challengeId ||
      (ceremonyType !== "create" && ceremonyType !== "request") ||
      !credentialResponse ||
      typeof credentialResponse !== "object"
    ) {
      return json({ error: "Missing WebAuthn verification payload" }, 400);
    }

    const rp = resolveWebAuthnRp(request);
    const { result, error: verifyError } = await verifyWebAuthnFactor(
      auth.session.access_token,
      factorId,
      challengeId,
      ceremonyType,
      credentialResponse,
      rp,
    );
    if (verifyError || !result) {
      return json({ error: verifyError ?? t.verificationFailed }, 400);
    }

    setAuthCookies(cookies, result.accessToken, result.refreshToken);
    const refreshed = await createAuthClientFromSession(
      result.accessToken,
      result.refreshToken,
    );
    if (!refreshed.error) {
      await syncMfaRequiredCookieFromClient(
        cookies,
        refreshed.client,
        result.accessToken,
      );
    }

    return json({ ok: true });
  }

  if (action === "yubikey_enroll") {
    if (!isYubiKeyOtpConfigured()) {
      return json({ error: t.yubikeyNotConfigured }, 503);
    }

    const blocked = await requireElevatedForAdditionalEnroll(
      request,
      cookies,
      auth.session,
      auth.user,
      client,
      locale,
    );
    if (blocked) return blocked;

    const otp = body.otp?.trim() ?? "";
    if (!otp) return json({ error: t.tapYubikey }, 400);

    const verified = await verifyYubiKeyOtpWithYubiCloud(otp);
    if (!verified.ok) return json({ error: verified.error }, 400);

    const { data: userData } = await client.auth.getUser();
    const existing = getYubiKeyPublicIdsFromUser(userData.user ?? auth.user);
    if (existing.includes(verified.publicId)) {
      return json({ error: t.yubikeyAlreadyEnrolled }, 400);
    }
    if (existing.length >= 5) {
      return json({ error: t.yubikeyLimit }, 400);
    }

    const { error: updateError } = await client.auth.updateUser({
      data: buildYubiKeyMetadataUpdate(existing, verified.publicId),
    });
    if (updateError) return json({ error: updateError.message }, 400);

    const { data: sessionData } = await client.auth.getSession();
    if (sessionData.session) {
      setAuthCookies(
        cookies,
        sessionData.session.access_token,
        sessionData.session.refresh_token,
      );
    }

    return json({ ok: true, publicId: verified.publicId });
  }

  if (action === "yubikey_unenroll") {
    const publicId = body.publicId?.trim().toLowerCase() ?? "";
    const otp = body.otp?.trim() ?? "";
    if (!publicId) return json({ error: "Missing publicId" }, 400);

    const { data: userData } = await client.auth.getUser();
    const existing = getYubiKeyPublicIdsFromUser(userData.user ?? auth.user);
    if (!existing.includes(publicId)) {
      return json({ error: t.yubikeyNotFound }, 400);
    }

    if (getAalClaim(auth.session.access_token) !== "aal2") {
      if (!isYubiKeyOtpConfigured()) {
        return json({ error: t.verifyBeforeRemovingYubikeys }, 401);
      }
      if (!otp) {
        return json({ error: t.tapYubikeyToRemove }, 400);
      }
      const verified = await verifyYubiKeyOtpWithYubiCloud(otp);
      if (!verified.ok || verified.publicId !== publicId) {
        return json({ error: t.yubikeyConfirmFailed }, 400);
      }
    }

    const { error: updateError } = await client.auth.updateUser({
      data: buildYubiKeyMetadataRemove(existing, publicId),
    });
    if (updateError) return json({ error: updateError.message }, 400);

    return json({ ok: true });
  }

  if (action === "unenroll") {
    if (getAalClaim(auth.session.access_token) !== "aal2") {
      return json(
        { error: t.verifyBeforeRemoving },
        401,
      );
    }

    const factorId = body.factorId?.trim();
    if (!factorId) return json({ error: "Missing factorId" }, 400);

    const { error: unenrollError } = await client.auth.mfa.unenroll({ factorId });
    if (unenrollError) return json({ error: unenrollError.message }, 400);

    // Refresh cookies if Supabase rotated the session; always recompute MFA gate.
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData.session) {
      setAuthCookies(
        cookies,
        sessionData.session.access_token,
        sessionData.session.refresh_token,
      );
      await syncMfaRequiredCookieFromClient(
        cookies,
        client,
        sessionData.session.access_token,
      );
    } else {
      await syncMfaRequiredCookieFromClient(cookies, client);
    }

    return json({ ok: true });
  }

  return json({ error: "Unknown action" }, 400);
};
