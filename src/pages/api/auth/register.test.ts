import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockSignUp = vi.fn();
const mockCreateAuthClient = vi.fn();
vi.mock("../../../lib/supabase", () => ({
  createAuthClient: () => mockCreateAuthClient(),
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
  mockSignUp.mockReset().mockResolvedValue({
    data: { user: { id: "user-1", app_metadata: {} } },
    error: null,
  });
  mockCreateAuthClient.mockReset().mockReturnValue({ auth: { signUp: (...a: unknown[]) => mockSignUp(...a) } });
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

  it("redirects with signup_failed when signUp errors", async () => {
    mockSignUp.mockResolvedValue({ data: { user: null }, error: { message: "exists" } });
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("error")).toBe("signup_failed");
  });

  it("keeps email (in a cookie), next and ref on an error redirect, never the password", async () => {
    mockSignUp.mockResolvedValue({ data: { user: null }, error: { message: "boom" } });
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

  it("says email_taken when Supabase reports the address is already registered", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered", code: "user_already_exists" },
    });
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(redirectedTo(context).searchParams.get("error")).toBe("email_taken");
  });

  it("applies a referral when a ref code is present", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1", ref: "REF1" });

    await POST(context);

    expect(mockApplyReferralForNewUser).toHaveBeenCalledWith("user-1", "ref1", {});
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

  it("saves the request language on the new account", async () => {
    const { POST } = await import("./register");
    const context = makeContext({ email: "a@example.com", password: "password1" });
    (context as unknown as { locals: App.Locals }).locals = { locale: "es" } as App.Locals;

    await POST(context);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "a@example.com",
      password: "password1",
      options: { data: { locale: "es" } },
    });
  });

  it("saves English when the request has no locale", async () => {
    const { POST } = await import("./register");
    await POST(makeContext({ email: "a@example.com", password: "password1" }));

    expect(mockSignUp.mock.calls[0][0].options).toEqual({ data: { locale: "en" } });
  });
});
