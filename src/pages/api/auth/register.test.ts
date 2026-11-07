import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockSignUp = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockGetUserRecord = vi.fn();
vi.mock("../../../lib/userRecords", () => ({
  getUserRecord: (...a: unknown[]) => mockGetUserRecord(...a),
}));

const mockMergeUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  mergeUserMetadata: (...a: unknown[]) => mockMergeUserMetadata(...a),
}));

const mockGetTurnstileToken = vi.fn();
const mockVerifyTurnstileToken = vi.fn();
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: (...a: unknown[]) => mockGetTurnstileToken(...a),
  verifyTurnstileToken: (...a: unknown[]) => mockVerifyTurnstileToken(...a),
}));

const mockApplyReferralForNewUser = vi.fn();
vi.mock("../../../lib/referrals", () => ({
  applyReferralForNewUser: (...a: unknown[]) => mockApplyReferralForNewUser(...a),
}));

const mockSanitizeRegisterNext = vi.fn();
vi.mock("../../../lib/registerUrl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../lib/registerUrl")>();
  return {
    // The real error-URL builder (and its own next check); only the success path's check is mocked.
    buildRegisterErrorHref: actual.buildRegisterErrorHref,
    registerEmailToKeep: actual.registerEmailToKeep,
    REGISTER_EMAIL_COOKIE: actual.REGISTER_EMAIL_COOKIE,
    REGISTER_EMAIL_COOKIE_OPTIONS: actual.REGISTER_EMAIL_COOKIE_OPTIONS,
    REGISTER_NEXT_DEVICES: "/dashboard/devices",
    sanitizeRegisterNext: (...a: unknown[]) => mockSanitizeRegisterNext(...a),
  };
});

function makeContext(form: Record<string, string>): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  const cookies = { set: vi.fn() };
  return { request, redirect, clientAddress: "127.0.0.1", cookies } as unknown as APIContext;
}

function redirectedTo(context: APIContext): URL {
  const location = (context.redirect as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
  return new URL(location, "https://example.com");
}

beforeEach(() => {
  mockGetTurnstileToken.mockReset().mockReturnValue("token");
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
  mockSignUp.mockReset().mockImplementation(async () => Response.json({ user: { id: "user-1" } }));
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) =>
      fn({ api: { signUpEmail: (...a: unknown[]) => mockSignUp(...a) } }),
    );
  mockGetUserRecord.mockReset().mockResolvedValue({ id: "user-1", email: "a@example.com" });
  mockMergeUserMetadata.mockReset().mockResolvedValue(undefined);
  mockApplyReferralForNewUser.mockReset().mockResolvedValue(undefined);
  mockSanitizeRegisterNext.mockReset().mockReturnValue(null);
});

describe("POST /api/auth/register", () => {
  it("redirects with a verification error when turnstile fails", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    const url = redirectedTo(context);
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("error")).toBe("verification");
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("redirects with missing_fields when the password is absent", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com" });

    await POST(context);

    const url = redirectedTo(context);
    expect(url.searchParams.get("error")).toBe("missing_fields");
    // The email comes back in a /register-only cookie, never in the URL.
    expect(url.search).not.toContain("example.com");
    expect((context.cookies as unknown as { set: ReturnType<typeof vi.fn> }).set).toHaveBeenCalledWith(
      "ph_register_email",
      "a@example.com",
      expect.objectContaining({ path: "/register", httpOnly: true, secure: true }),
    );
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("redirects with missing_fields when the email is absent", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ password: "password1" });

    await POST(context);

    const url = redirectedTo(context);
    expect(url.searchParams.get("error")).toBe("missing_fields");
    expect(url.searchParams.has("email")).toBe(false);
  });

  it("redirects with weak_password when the password is under 8 characters", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "short" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("error")).toBe("weak_password");
  });

  it("redirects with signup_failed when sign-up fails", async () => {
    mockSignUp.mockResolvedValue(Response.json({ code: "FAILED_TO_CREATE_USER" }, { status: 422 }));
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("error")).toBe("signup_failed");
  });

  it("redirects with weak_password when Better Auth says the password is too short", async () => {
    mockSignUp.mockResolvedValue(Response.json({ code: "PASSWORD_TOO_SHORT" }, { status: 400 }));
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("error")).toBe("weak_password");
  });

  it("keeps email (in a cookie), next and ref on an error redirect, never the password", async () => {
    mockSignUp.mockResolvedValue(Response.json({ code: "UNKNOWN" }, { status: 500 }));
    const { POST } = await import("./register");
    const context = makeContext({
      email: " a@example.com ",
      password: "password1",
      next: "/dashboard/alerts",
      ref: "REF1",
    });

    await POST(context);

    const location = (context.redirect as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
    expect(location).not.toContain("password1");
    const url = redirectedTo(context);
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("error")).toBe("signup_failed");
    expect(url.searchParams.has("email")).toBe(false);
    expect((context.cookies as unknown as { set: ReturnType<typeof vi.fn> }).set).toHaveBeenCalledWith(
      "ph_register_email",
      "a@example.com",
      expect.objectContaining({ path: "/register" }),
    );
    expect(url.searchParams.get("next")).toBe("/dashboard/alerts");
    expect(url.searchParams.get("ref")).toBe("ref1");
    expect(url.searchParams.has("password")).toBe(false);
  });

  it("drops an off-site next on an error redirect", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1", next: "//evil.example" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("next")).toBe("/dashboard/devices");
  });

  it("applies a referral when a ref code is present", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1", ref: "REF1" });

    await POST(context);

    expect(mockApplyReferralForNewUser).toHaveBeenCalledWith("user-1", "ref1", {});
  });

  it("touches no profile for an address that already has an account (made-up user)", async () => {
    mockGetUserRecord.mockResolvedValue(null);
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1", ref: "REF1" });

    await POST(context);

    expect(mockMergeUserMetadata).not.toHaveBeenCalled();
    expect(mockApplyReferralForNewUser).not.toHaveBeenCalled();
    expect(redirectedTo(context).pathname).toBe("/signin");
  });

  it("does not apply a referral without a ref code", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(mockApplyReferralForNewUser).not.toHaveBeenCalled();
  });

  it("redirects to signin with the sanitized next path and registered=1", async () => {
    mockSanitizeRegisterNext.mockReturnValue("/dashboard/devices?intro=1");
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1", next: "/dashboard/devices?intro=1" });

    await POST(context);

    const location = (context.redirect as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
    const url = new URL(location, "https://example.com");
    expect(url.pathname).toBe("/signin");
    expect(url.searchParams.get("registered")).toBe("1");
    expect(url.searchParams.get("next")).toBe("/dashboard/devices?intro=1");
  });

  it("falls back to the register-devices path when next is unsafe", async () => {
    mockSanitizeRegisterNext.mockReturnValue(null);
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    const location = (context.redirect as unknown as { mock: { calls: string[][] } }).mock.calls[0][0];
    const url = new URL(location, "https://example.com");
    expect(url.searchParams.get("next")).toBe("/dashboard/devices");
  });

  it("saves the request language on the new account and sends the email in it", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });
    (context as unknown as { locals: App.Locals }).locals = { locale: "es" } as App.Locals;

    await POST(context);

    expect(mockSignUp).toHaveBeenCalledWith({
      body: { email: "a@example.com", password: "password1", name: "a@example.com" },
      asResponse: true,
    });
    expect(mockWithBetterAuth).toHaveBeenCalledWith(expect.anything(), expect.any(Function), { emailLocale: "es" });
    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { locale: "es" });
  });

  it("saves English when the request has no locale", async () => {
    const { POST } = await import("./register");
    await POST(makeContext({ email: "a@example.com", password: "password1" }));

    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { locale: "en" });
  });

  it("still finishes sign-up when saving the language fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockMergeUserMetadata.mockRejectedValue(new Error("down"));
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("registered")).toBe("1");
  });
});
