import type { APIRoute, AstroCookies } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import {
  buildYubiKeyMetadataRemove,
  buildYubiKeyMetadataUpdate,
  getYubiKeyPublicIdsFromUser,
  isYubiKeyOtpConfigured,
  verifyYubiKeyOtpWithYubiCloud,
} from "../../../lib/yubikeyOtp";
import { authApiMessages } from "../../../i18n/messages/app/auth/api";
import { requestLocale } from "./_locale";
import { getUserMetadata, mergeUserMetadata } from "../../../lib/db/userMetadata";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { betterAuthErrorCode } from "../../../lib/betterAuthResponse";
import { getTotpState, isElevated, jsonWithAuthCookies, totpFactors } from "../../../lib/betterAuthMfa";
import { renderIngestQrDataUrl } from "../../../lib/qrSvg";

/** Factor list for the settings screen. */
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

/** The POST actions, on Better Auth's two-factor API and user_profiles.metadata. */
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

/** List the signed-in user's factors (cookie session). */
export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireSession(cookies);
  if (!auth) return json({ error: "Unauthorized" }, 401);
  return listBetterAuth(auth.user.id);
};

type ManageBody = {
  action?: string;
  code?: string;
  otp?: string;
  publicId?: string;
  /** Account password for turning TOTP on or off. */
  password?: string;
};

/**
 * MFA enrollment management via HttpOnly cookies:
 * - enroll → QR code (TOTP)
 * - verify → activate TOTP
 * - unenroll → turn TOTP off
 * - yubikey_enroll / yubikey_unenroll → add or remove a YubiKey OTP key
 * Security-key actions answer that security keys moved to passkeys.
 */
export const POST: APIRoute = async (context) => {
  const { request, cookies } = context;
  const t = authApiMessages(requestLocale(context)).mfa;
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
  return manageBetterAuth(request, cookies, auth.user.id, body, t);
};
