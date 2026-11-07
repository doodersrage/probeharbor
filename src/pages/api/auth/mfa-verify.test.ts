import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockSetMfaRequiredCookie = vi.fn();
vi.mock("../../../lib/mfa", () => ({
  setMfaRequiredCookie: (...a: unknown[]) => mockSetMfaRequiredCookie(...a),
}));

const mockCreateMfaStepUpProof = vi.fn();
const mockSetMfaStepUpCookie = vi.fn();
const mockHasValidMfaStepUpProof = vi.fn();
vi.mock("../../../lib/mfaStepUpProof", () => ({
  createMfaStepUpProof: (...a: unknown[]) => mockCreateMfaStepUpProof(...a),
  setMfaStepUpCookie: (...a: unknown[]) => mockSetMfaStepUpCookie(...a),
  hasValidMfaStepUpProof: (...a: unknown[]) => mockHasValidMfaStepUpProof(...a),
}));

vi.mock("../../../lib/siteUrl", () => ({
  sanitizeNextPath: (v: string | null | undefined) => (v?.startsWith("/") && !v.startsWith("//") ? v : null),
}));

const mockCheckMfaVerifyRateLimit = vi.fn();
const mockClearMfaVerifyFailures = vi.fn();
const mockRecordMfaVerifyFailure = vi.fn();
vi.mock("../../../lib/mfaVerifyLimits", () => ({
  checkMfaVerifyRateLimit: (...a: unknown[]) => mockCheckMfaVerifyRateLimit(...a),
  clearMfaVerifyFailures: (...a: unknown[]) => mockClearMfaVerifyFailures(...a),
  recordMfaVerifyFailure: (...a: unknown[]) => mockRecordMfaVerifyFailure(...a),
}));

const mockGetYubiKeyPublicIdsFromUser = vi.fn();
const mockIsYubiKeyOtpConfigured = vi.fn();
const mockVerifyYubiKeyOtpWithYubiCloud = vi.fn();
vi.mock("../../../lib/yubikeyOtp", () => ({
  getYubiKeyPublicIdsFromUser: (...a: unknown[]) => mockGetYubiKeyPublicIdsFromUser(...a),
  isYubiKeyOtpConfigured: () => mockIsYubiKeyOtpConfigured(),
  verifyYubiKeyOtpWithYubiCloud: (...a: unknown[]) => mockVerifyYubiKeyOtpWithYubiCloud(...a),
}));

const mockHasMobileOAuthCookie = vi.fn();
vi.mock("../../../lib/mobileAuthRedirect", () => ({
  hasMobileOAuthCookie: (...a: unknown[]) => mockHasMobileOAuthCookie(...a),
}));

const mockGetUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
}));

const mockVerifyTOTP = vi.fn();
const mockVerifyYubiKeyTwoFactor = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (_req: unknown, fn: (auth: unknown) => unknown) =>
    fn({ api: { verifyTOTP: mockVerifyTOTP, verifyYubiKeyTwoFactor: mockVerifyYubiKeyTwoFactor } }),
}));

const mockNeedsStepUp = vi.fn();
vi.mock("../../../lib/betterAuthMfaGate", () => ({
  betterAuthNeedsStepUp: (...a: unknown[]) => mockNeedsStepUp(...a),
}));

const mockHasTwoFactorChallenge = vi.fn();
vi.mock("../../../lib/betterAuthMfa", () => ({
  hasTwoFactorChallenge: (...a: unknown[]) => mockHasTwoFactorChallenge(...a),
  jsonWithAuthCookies: (body: unknown, status: number, from?: Response) => {
    const headers = new Headers({ "Content-Type": "application/json" });
    for (const cookie of from?.headers.getSetCookie() ?? []) headers.append("Set-Cookie", cookie);
    return new Response(JSON.stringify(body), { status, headers });
  },
}));

function makeContext(options: { json?: boolean; body?: Record<string, unknown> | string } = {}): APIContext {
  const { json = false, body = {} } = options;
  const url = new URL("https://example.com/api/auth/mfa-verify");
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  let request: Request;
  if (json) {
    request = new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  } else {
    const form = new FormData();
    if (typeof body === "object") for (const [k, v] of Object.entries(body)) form.set(k, String(v));
    request = new Request(url, { method: "POST", body: form });
  }
  const cookies = { get: (name: string) => (name === "better-auth.two_factor" ? { value: "chal" } : undefined) };
  return { request, cookies, redirect, url } as unknown as APIContext;
}

function sessionResponse(): Response {
  const headers = new Headers();
  headers.append("Set-Cookie", "better-auth.session_token=abc; Path=/; HttpOnly");
  return new Response("{}", { status: 200, headers });
}

async function post(options: Parameters<typeof makeContext>[0]): Promise<Response> {
  const { POST } = await import("./mfa-verify");
  return (await POST(makeContext(options))) as Response;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({ session: { token: "s" }, user: { id: "user-1", user_metadata: {} } });
  mockSetMfaRequiredCookie.mockReset();
  mockCreateMfaStepUpProof.mockReset().mockResolvedValue("proof");
  mockSetMfaStepUpCookie.mockReset();
  mockHasValidMfaStepUpProof.mockReset().mockResolvedValue(false);
  mockCheckMfaVerifyRateLimit.mockReset().mockReturnValue({ ok: true });
  mockClearMfaVerifyFailures.mockReset();
  mockRecordMfaVerifyFailure.mockReset();
  mockGetYubiKeyPublicIdsFromUser.mockReset().mockReturnValue(["ccccccabcdef"]);
  mockIsYubiKeyOtpConfigured.mockReset().mockReturnValue(true);
  mockVerifyYubiKeyOtpWithYubiCloud.mockReset().mockResolvedValue({ ok: true, publicId: "ccccccabcdef" });
  mockHasMobileOAuthCookie.mockReset().mockReturnValue(false);
  mockGetUserMetadata.mockReset().mockResolvedValue({ yubikey_otp_public_ids: ["ccccccabcdef"] });
  mockVerifyTOTP.mockReset().mockImplementation(async () => sessionResponse());
  mockVerifyYubiKeyTwoFactor.mockReset().mockImplementation(async () => sessionResponse());
  mockNeedsStepUp.mockReset().mockResolvedValue(true);
  mockHasTwoFactorChallenge.mockReset().mockReturnValue(false);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/auth/mfa-verify — request handling", () => {
  it("returns 400 for invalid JSON", async () => {
    const res = await post({ json: true, body: "not json" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON" });
  });

  it("answers security-key actions with no_factor (they moved to passkeys)", async () => {
    const res = await post({ json: true, body: { action: "webauthn_challenge" } });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "no_factor" });
    expect((await post({ json: true, body: { action: "webauthn_verify" } })).status).toBe(400);
  });

  it("keeps a safe next on form errors and drops an off-site one", async () => {
    mockHasTwoFactorChallenge.mockReturnValue(true);
    expect((await post({ body: { code: "12", next: "/dashboard/alerts" } })).headers.get("Location")).toBe(
      "/signin/mfa?error=invalid_code&next=%2Fdashboard%2Falerts",
    );
    expect((await post({ body: { code: "12", next: "//evil.example" } })).headers.get("Location")).toBe(
      "/signin/mfa?error=invalid_code&next=%2Fdashboard",
    );
  });
});

describe("POST /api/auth/mfa-verify — pending sign-in challenge, TOTP", () => {
  beforeEach(() => mockHasTwoFactorChallenge.mockReturnValue(true));

  it("refuses a malformed code without asking Better Auth", async () => {
    const res = await post({ json: true, body: { code: "12ab56" } });
    expect(await res.json()).toEqual({ error: "invalid_code" });
    expect(mockVerifyTOTP).not.toHaveBeenCalled();
  });

  it("reports a wrong code as invalid_code", async () => {
    mockVerifyTOTP.mockResolvedValue(Response.json({ code: "INVALID_CODE" }, { status: 401 }));
    const res = await post({ json: true, body: { code: "123456" } });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_code" });
  });

  it("reports too many attempts as rate_limited", async () => {
    mockVerifyTOTP.mockResolvedValue(Response.json({ code: "TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE" }, { status: 429 }));
    const res = await post({ json: true, body: { code: "123456" } });
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate_limited" });
  });

  it("signs in to the next page with the session cookie on the right code", async () => {
    const res = await post({ body: { code: "123456", next: "/dashboard/alerts" } });
    expect(mockVerifyTOTP).toHaveBeenCalledWith(expect.objectContaining({ body: { code: "123456" }, asResponse: true }));
    expect(res.headers.get("Location")).toBe("/dashboard/alerts");
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=abc");
    expect(mockSetMfaRequiredCookie).toHaveBeenCalledWith(expect.anything(), false);
  });

  it("answers JSON callers with ok and aal2, passing the session cookie", async () => {
    const res = await post({ json: true, body: { code: "123456" } });
    expect(await res.json()).toEqual({ ok: true, aal: "aal2" });
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=abc");
  });

  it("finishes an app sign-in at companion/complete", async () => {
    mockHasMobileOAuthCookie.mockReturnValue(true);
    const res = await post({ body: { code: "123456", next: "/dashboard/alerts" } });
    expect(res.headers.get("Location")).toBe("/api/auth/companion/complete");
  });
});

describe("POST /api/auth/mfa-verify — pending sign-in challenge, YubiKey", () => {
  beforeEach(() => mockHasTwoFactorChallenge.mockReturnValue(true));

  it("rate-limits per challenge", async () => {
    mockCheckMfaVerifyRateLimit.mockReturnValue({ ok: false });
    const res = await post({ json: true, body: { yubikey_otp: "otp" } });
    expect(res.status).toBe(429);
    expect(mockCheckMfaVerifyRateLimit).toHaveBeenCalledWith("2fa:chal");
    expect(mockVerifyYubiKeyTwoFactor).not.toHaveBeenCalled();
  });

  it("maps Better Auth's refusals to the page's errors", async () => {
    const cases: Array<[string, number, string]> = [
      ["REPLAYED", 400, "replayed_otp"],
      ["NOT_ENROLLED", 400, "yubikey_not_enrolled"],
      ["BAD_OTP", 400, "invalid_yubikey"],
      ["YUBIKEY_NOT_CONFIGURED", 503, "generic"],
    ];
    for (const [code, status, error] of cases) {
      mockVerifyYubiKeyTwoFactor.mockResolvedValueOnce(Response.json({ code }, { status: 401 }));
      const res = await post({ json: true, body: { yubikey_otp: "otp" } });
      expect(res.status).toBe(status);
      expect(await res.json()).toEqual({ error });
    }
    expect(mockRecordMfaVerifyFailure).toHaveBeenCalledWith("2fa:chal");
  });

  it("finishes the challenge with the key", async () => {
    const res = await post({ body: { yubikey_otp: "otp" } });
    expect(mockVerifyYubiKeyTwoFactor).toHaveBeenCalledWith(expect.objectContaining({ body: { otp: "otp" }, asResponse: true }));
    expect(mockClearMfaVerifyFailures).toHaveBeenCalledWith("2fa:chal");
    expect(res.headers.get("Location")).toBe("/dashboard");
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=abc");
  });
});

describe("POST /api/auth/mfa-verify — signed in, YubiKey step-up", () => {
  it("returns 401 JSON / redirects to sign-in when not signed in", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    expect((await post({ json: true, body: {} })).status).toBe(401);
    expect((await post({ body: {} })).headers.get("Location")).toBe("/signin?error=generic");
  });

  it("goes straight on when no step-up is needed", async () => {
    mockNeedsStepUp.mockResolvedValue(false);
    expect(await (await post({ json: true, body: {} })).json()).toEqual({ ok: true, aal: "aal2" });
    expect((await post({ body: { next: "/dashboard/alerts" } })).headers.get("Location")).toBe("/dashboard/alerts");
    expect(mockSetMfaRequiredCookie).toHaveBeenCalledWith(expect.anything(), false);
  });

  it("checks the step-up against the stored metadata", async () => {
    await post({ json: true, body: { yubikey_otp: "otp" } });
    expect(mockNeedsStepUp).toHaveBeenCalledWith(
      { id: "user-1", user_metadata: { yubikey_otp_public_ids: ["ccccccabcdef"] } },
      expect.any(Function),
    );
  });

  it("asks for the key when no OTP is given", async () => {
    expect(await (await post({ json: true, body: {} })).json()).toEqual({ error: "invalid_yubikey" });
  });

  it("rate-limits per user", async () => {
    mockCheckMfaVerifyRateLimit.mockReturnValue({ ok: false });
    const res = await post({ json: true, body: { yubikey_otp: "otp" } });
    expect(res.status).toBe(429);
    expect(mockCheckMfaVerifyRateLimit).toHaveBeenCalledWith("user-1");
    expect(mockVerifyYubiKeyOtpWithYubiCloud).not.toHaveBeenCalled();
  });

  it("answers 503 when YubiCloud isn't configured", async () => {
    mockIsYubiKeyOtpConfigured.mockReturnValue(false);
    const res = await post({ body: { yubikey_otp: "otp" } });
    expect(res.headers.get("Location")).toBe("/signin/mfa?error=generic&next=%2Fdashboard");
  });

  it("reports a replayed OTP distinctly from an invalid one", async () => {
    mockVerifyYubiKeyOtpWithYubiCloud.mockResolvedValueOnce({ ok: false, error: "OTP already used" });
    expect(await (await post({ json: true, body: { yubikey_otp: "otp" } })).json()).toEqual({ error: "replayed_otp" });
    mockVerifyYubiKeyOtpWithYubiCloud.mockResolvedValueOnce({ ok: false, error: "BAD_OTP" });
    expect(await (await post({ json: true, body: { yubikey_otp: "otp" } })).json()).toEqual({ error: "invalid_yubikey" });
    expect(mockRecordMfaVerifyFailure).toHaveBeenCalledTimes(2);
  });

  it("rejects an OTP from a key not enrolled on this account", async () => {
    mockVerifyYubiKeyOtpWithYubiCloud.mockResolvedValue({ ok: true, publicId: "cccccczzzzzz" });
    expect(await (await post({ json: true, body: { yubikey_otp: "otp" } })).json()).toEqual({ error: "yubikey_not_enrolled" });
    expect(mockSetMfaStepUpCookie).not.toHaveBeenCalled();
  });

  it("sets the step-up proof and returns it on success", async () => {
    const res = await post({ json: true, body: { yubikey_otp: "otp" } });
    expect(await res.json()).toEqual({ ok: true, aal: "aal2", mfa_stepup: "proof" });
    expect(mockSetMfaStepUpCookie).toHaveBeenCalledWith(expect.anything(), "proof");
    expect(mockClearMfaVerifyFailures).toHaveBeenCalledWith("user-1");
  });

  it("answers 503 when the step-up proof can't be minted", async () => {
    mockCreateMfaStepUpProof.mockResolvedValue(null);
    const res = await post({ json: true, body: { yubikey_otp: "otp" } });
    expect(res.status).toBe(503);
    expect(mockSetMfaRequiredCookie).not.toHaveBeenCalled();
  });
});
