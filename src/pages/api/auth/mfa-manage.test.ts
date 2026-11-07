import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { authApiMessages } from "../../../i18n/messages/app/auth/api";

const t = authApiMessages("en").mfa;

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockIsYubiKeyOtpConfigured = vi.fn();
const mockVerifyYubiKeyOtpWithYubiCloud = vi.fn();
vi.mock("../../../lib/yubikeyOtp", async () => {
  const metadata = await import("../../../lib/yubikeyOtpMetadata");
  return {
    buildYubiKeyMetadataRemove: metadata.buildYubiKeyMetadataRemove,
    buildYubiKeyMetadataUpdate: metadata.buildYubiKeyMetadataUpdate,
    getYubiKeyPublicIdsFromUser: metadata.getYubiKeyPublicIdsFromUser,
    isYubiKeyOtpConfigured: () => mockIsYubiKeyOtpConfigured(),
    verifyYubiKeyOtpWithYubiCloud: (...a: unknown[]) => mockVerifyYubiKeyOtpWithYubiCloud(...a),
  };
});

const mockGetUserMetadata = vi.fn();
const mockMergeUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
  mergeUserMetadata: (...a: unknown[]) => mockMergeUserMetadata(...a),
}));

const mockEnableTwoFactor = vi.fn();
const mockVerifyTOTP = vi.fn();
const mockDisableTwoFactor = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (_req: unknown, fn: (auth: unknown) => unknown) =>
    fn({ api: { enableTwoFactor: mockEnableTwoFactor, verifyTOTP: mockVerifyTOTP, disableTwoFactor: mockDisableTwoFactor } }),
}));

const mockGetTotpState = vi.fn();
const mockIsElevated = vi.fn();
vi.mock("../../../lib/betterAuthMfa", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../lib/betterAuthMfa")>();
  return {
    getTotpState: (...a: unknown[]) => mockGetTotpState(...a),
    isElevated: (...a: unknown[]) => mockIsElevated(...a),
    jsonWithAuthCookies: actual.jsonWithAuthCookies,
    totpFactors: actual.totpFactors,
  };
});

vi.mock("../../../lib/qrSvg", () => ({
  renderIngestQrDataUrl: (uri: string) => `data:qr,${uri}`,
}));

const KEY = "ccccccbdefgh";

function makeContext(body?: Record<string, unknown> | string): APIContext {
  const request = new Request("https://example.com/api/auth/mfa-manage", {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
  return { request, cookies: {}, locals: { locale: "en" } } as unknown as APIContext;
}

async function post(body: Record<string, unknown> | string): Promise<{ status: number; json: Record<string, unknown>; res: Response }> {
  const { POST } = await import("./mfa-manage");
  const res = (await POST(makeContext(body))) as Response;
  return { status: res.status, json: (await res.clone().json()) as Record<string, unknown>, res };
}

function withCookie(body: unknown): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "better-auth.session_token=rotated; Path=/; HttpOnly");
  return new Response(JSON.stringify(body), { status: 200, headers });
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({ session: { token: "s" }, user: { id: "user-1" } });
  mockIsYubiKeyOtpConfigured.mockReset().mockReturnValue(true);
  mockVerifyYubiKeyOtpWithYubiCloud.mockReset().mockResolvedValue({ ok: true, publicId: KEY });
  mockGetUserMetadata.mockReset().mockResolvedValue({});
  mockMergeUserMetadata.mockReset().mockResolvedValue(undefined);
  mockEnableTwoFactor.mockReset().mockImplementation(async () => withCookie({ totpURI: "otpauth://totp/x" }));
  mockVerifyTOTP.mockReset().mockImplementation(async () => withCookie({ status: true }));
  mockDisableTwoFactor.mockReset().mockImplementation(async () => withCookie({ status: true }));
  mockGetTotpState.mockReset().mockResolvedValue({ enabled: false, pending: false, hasPassword: true });
  mockIsElevated.mockReset().mockResolvedValue(false);
});

describe("GET /api/auth/mfa-manage", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { GET } = await import("./mfa-manage");
    expect(((await GET(makeContext())) as Response).status).toBe(401);
  });

  it("lists the authenticator app, YubiKeys and whether a password is asked for", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: true, pending: false, hasPassword: false });
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY] });
    const { GET } = await import("./mfa-manage");
    const res = (await GET(makeContext())) as Response;
    const totp = [{ id: "totp", friendly_name: null, status: "verified" }];
    expect(await res.json()).toEqual({
      factors: totp,
      totp,
      webauthn: [],
      yubikeyPublicIds: [KEY],
      yubikeyOtpConfigured: true,
      passwordRequired: false,
    });
  });
});

describe("POST /api/auth/mfa-manage — basics", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    expect((await post({ action: "enroll" })).status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    const { status, json } = await post("not json");
    expect(status).toBe(400);
    expect(json).toEqual({ error: "Invalid JSON" });
  });

  it("returns 400 when action is missing", async () => {
    expect((await post({})).json).toEqual({ error: "Missing action" });
  });

  it("returns 400 for an unknown action", async () => {
    expect((await post({ action: "nope" })).json).toEqual({ error: "Unknown action" });
  });

  it("says security keys moved to passkeys", async () => {
    for (const action of ["webauthn_enroll", "webauthn_challenge", "webauthn_verify"]) {
      const { status, json } = await post({ action });
      expect(status).toBe(400);
      expect(json).toEqual({ error: t.securityKeysMoved });
    }
  });
});

describe("POST /api/auth/mfa-manage — TOTP", () => {
  it("refuses a second authenticator app", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: true, pending: false, hasPassword: true });
    expect((await post({ action: "enroll", password: "pw" })).json).toEqual({ error: t.totpAlreadyEnabled });
  });

  it("blocks enroll when the user has a YubiKey and isn't verified this session", async () => {
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY] });
    const { status, json } = await post({ action: "enroll", password: "pw" });
    expect(status).toBe(401);
    expect(json).toEqual({ error: t.verifyBeforeAdding });
    expect(mockEnableTwoFactor).not.toHaveBeenCalled();
  });

  it("asks for the password when the account has one", async () => {
    expect((await post({ action: "enroll" })).json).toEqual({ error: t.passwordIncorrect });
    expect(mockEnableTwoFactor).not.toHaveBeenCalled();
  });

  it("returns the QR code and passes on Better Auth's cookies", async () => {
    const { status, json, res } = await post({ action: "enroll", password: "pw" });
    expect(mockEnableTwoFactor).toHaveBeenCalledWith(expect.objectContaining({ body: { password: "pw" }, asResponse: true }));
    expect(status).toBe(200);
    expect(json).toEqual({ factorId: "totp", qrCode: "data:qr,otpauth://totp/x" });
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=rotated");
  });

  it("doesn't ask an OAuth-only account for a password", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: false, pending: false, hasPassword: false });
    await post({ action: "enroll" });
    expect(mockEnableTwoFactor).toHaveBeenCalledWith(expect.objectContaining({ body: {} }));
  });

  it("says the password is wrong when Better Auth does", async () => {
    mockEnableTwoFactor.mockResolvedValue(Response.json({ code: "INVALID_PASSWORD" }, { status: 400 }));
    expect((await post({ action: "enroll", password: "bad" })).json).toEqual({ error: t.passwordIncorrect });
    mockEnableTwoFactor.mockResolvedValue(Response.json({ code: "OTHER" }, { status: 400 }));
    expect((await post({ action: "enroll", password: "pw" })).json).toEqual({ error: t.verificationFailed });
  });

  it("verify: refuses a malformed code, reports a wrong one, confirms a right one", async () => {
    expect((await post({ action: "verify", code: "12" })).json).toEqual({ error: t.invalidCode });
    expect(mockVerifyTOTP).not.toHaveBeenCalled();
    mockVerifyTOTP.mockResolvedValueOnce(Response.json({ code: "INVALID_CODE" }, { status: 401 }));
    expect((await post({ action: "verify", code: "123456" })).json).toEqual({ error: t.verificationFailed });
    const ok = await post({ action: "verify", code: " 123456 " });
    expect(mockVerifyTOTP).toHaveBeenLastCalledWith(expect.objectContaining({ body: { code: "123456" } }));
    expect(ok.json).toEqual({ ok: true });
    expect(ok.res.headers.getSetCookie().join(";")).toContain("session_token=rotated");
  });

  it("unenroll: nothing to remove, needs a verified session, then the password", async () => {
    expect((await post({ action: "unenroll", password: "pw" })).json).toEqual({ error: "Missing factorId" });
    mockGetTotpState.mockResolvedValue({ enabled: false, pending: true, hasPassword: true });
    const blocked = await post({ action: "unenroll", password: "pw" });
    expect(blocked.status).toBe(401);
    expect(blocked.json).toEqual({ error: t.verifyBeforeRemoving });
    mockIsElevated.mockResolvedValue(true);
    expect((await post({ action: "unenroll" })).json).toEqual({ error: t.passwordIncorrect });
    expect(mockDisableTwoFactor).not.toHaveBeenCalled();
    expect((await post({ action: "unenroll", password: "pw" })).json).toEqual({ ok: true });
    expect(mockDisableTwoFactor).toHaveBeenCalledWith(expect.objectContaining({ body: { password: "pw" } }));
  });
});

describe("POST /api/auth/mfa-manage — YubiKey", () => {
  it("returns 503 when YubiKey OTP isn't configured for enroll", async () => {
    mockIsYubiKeyOtpConfigured.mockReturnValue(false);
    const { status, json } = await post({ action: "yubikey_enroll", otp: "otp" });
    expect(status).toBe(503);
    expect(json).toEqual({ error: t.yubikeyNotConfigured });
  });

  it("blocks adding a key when another factor exists and the session isn't verified", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: false, pending: false, hasPassword: true });
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: ["cccccctttttt"] });
    expect((await post({ action: "yubikey_enroll", otp: "otp" })).status).toBe(401);
  });

  it("asks for a tap when the OTP is missing, and passes on YubiCloud's refusal", async () => {
    expect((await post({ action: "yubikey_enroll" })).json).toEqual({ error: t.tapYubikey });
    mockVerifyYubiKeyOtpWithYubiCloud.mockResolvedValue({ ok: false, error: "BAD_OTP" });
    expect((await post({ action: "yubikey_enroll", otp: "otp" })).json).toEqual({ error: "BAD_OTP" });
    expect(mockMergeUserMetadata).not.toHaveBeenCalled();
  });

  it("refuses a key already enrolled, and a sixth key", async () => {
    mockIsElevated.mockResolvedValue(true);
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY] });
    expect((await post({ action: "yubikey_enroll", otp: "otp" })).json).toEqual({ error: t.yubikeyAlreadyEnrolled });
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: ["ccccccbbbbbb", "ccccccdddddd", "cccccceeeeee", "ccccccffffff", "ccccccgggggg"] });
    expect((await post({ action: "yubikey_enroll", otp: "otp" })).json).toEqual({ error: t.yubikeyLimit });
    expect(mockMergeUserMetadata).not.toHaveBeenCalled();
  });

  it("enrolls a new key into the profile metadata", async () => {
    const { json } = await post({ action: "yubikey_enroll", otp: " otp " });
    expect(mockVerifyYubiKeyOtpWithYubiCloud).toHaveBeenCalledWith("otp");
    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { yubikey_otp_public_ids: [KEY] });
    expect(json).toEqual({ ok: true, publicId: KEY });
  });

  it("unenroll: needs a publicId that is enrolled", async () => {
    expect((await post({ action: "yubikey_unenroll" })).json).toEqual({ error: "Missing publicId" });
    expect((await post({ action: "yubikey_unenroll", publicId: KEY })).json).toEqual({ error: t.yubikeyNotFound });
  });

  it("unenroll: removes without a tap from a verified session", async () => {
    mockIsElevated.mockResolvedValue(true);
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY, "cccccctttttt"] });
    expect((await post({ action: "yubikey_unenroll", publicId: KEY.toUpperCase() })).json).toEqual({ ok: true });
    expect(mockVerifyYubiKeyOtpWithYubiCloud).not.toHaveBeenCalled();
    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { yubikey_otp_public_ids: ["cccccctttttt"] });
  });

  it("unenroll: otherwise needs that key's own OTP", async () => {
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY] });
    expect((await post({ action: "yubikey_unenroll", publicId: KEY })).json).toEqual({ error: t.tapYubikeyToRemove });
    mockVerifyYubiKeyOtpWithYubiCloud.mockResolvedValueOnce({ ok: true, publicId: "cccccctttttt" });
    expect((await post({ action: "yubikey_unenroll", publicId: KEY, otp: "otp" })).json).toEqual({ error: t.yubikeyConfirmFailed });
    expect(mockMergeUserMetadata).not.toHaveBeenCalled();
    expect((await post({ action: "yubikey_unenroll", publicId: KEY, otp: "otp" })).json).toEqual({ ok: true });
    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { yubikey_otp_public_ids: [] });
  });

  it("unenroll without a verified session and no YubiCloud: says to verify first", async () => {
    mockIsYubiKeyOtpConfigured.mockReturnValue(false);
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: [KEY] });
    const { status, json } = await post({ action: "yubikey_unenroll", publicId: KEY });
    expect(status).toBe(401);
    expect(json).toEqual({ error: t.verifyBeforeRemovingYubikeys });
  });
});
