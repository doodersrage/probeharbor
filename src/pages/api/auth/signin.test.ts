import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockBuildSignInRedirectUrl = vi.fn();
vi.mock("../../../lib/signInErrors", () => ({
  buildSignInRedirectUrl: (...a: unknown[]) => mockBuildSignInRedirectUrl(...a),
}));

vi.mock("../../../lib/mfa", () => ({
  buildMfaChallengeUrl: (next: string | null) => `/signin/mfa${next ? `?next=${encodeURIComponent(next)}` : ""}`,
}));

const mockSanitizeNextPath = vi.fn();
vi.mock("../../../lib/siteUrl", () => ({
  OAUTH_NEXT_COOKIE: "oauth_next",
  OAUTH_REF_COOKIE: "oauth_ref",
  sanitizeNextPath: (...a: unknown[]) => mockSanitizeNextPath(...a),
}));

const mockStartBetterAuthOAuth = vi.fn();
vi.mock("../../../lib/betterAuthAppHandoff", () => ({
  startBetterAuthOAuth: (...a: unknown[]) => mockStartBetterAuthOAuth(...a),
}));

const mockSignInEmail = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockGetUserMetadata = vi.fn();
const mockMergeUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
  mergeUserMetadata: (...a: unknown[]) => mockMergeUserMetadata(...a),
}));

const mockGetTurnstileToken = vi.fn();
const mockVerifyTurnstileToken = vi.fn();
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: (...a: unknown[]) => mockGetTurnstileToken(...a),
  verifyTurnstileToken: (...a: unknown[]) => mockVerifyTurnstileToken(...a),
}));

const mockCheckSigninRateLimit = vi.fn();
const mockClearSigninFailures = vi.fn();
const mockRecordSigninFailure = vi.fn();
vi.mock("../../../lib/signinLimits", () => ({
  checkSigninRateLimit: (...a: unknown[]) => mockCheckSigninRateLimit(...a),
  clearSigninFailures: (...a: unknown[]) => mockClearSigninFailures(...a),
  recordSigninFailure: (...a: unknown[]) => mockRecordSigninFailure(...a),
}));

function makeCookies() {
  const store = new Map<string, string>();
  return {
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    set: vi.fn((name: string, value: string) => store.set(name, value)),
    delete: vi.fn((name: string) => store.delete(name)),
  };
}

function makeContext(form: Record<string, string>, locale?: string): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return {
    request,
    cookies: makeCookies(),
    redirect,
    clientAddress: "127.0.0.1",
    site: new URL("https://example.com"),
    locals: locale ? { locale } : undefined,
  } as unknown as APIContext;
}

function signedIn(body: Record<string, unknown>): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "better-auth.session_token=abc; Path=/; HttpOnly");
  return new Response(JSON.stringify(body), { status: 200, headers });
}

beforeEach(() => {
  mockBuildSignInRedirectUrl.mockReset().mockImplementation((code: string) => `/signin?error=${code}`);
  mockSanitizeNextPath.mockReset().mockImplementation((v: string | null | undefined) => v || null);
  mockStartBetterAuthOAuth
    .mockReset()
    .mockResolvedValue(new Response(null, { status: 302, headers: { Location: "https://provider.example.com/authorize" } }));
  mockSignInEmail.mockReset().mockImplementation(async () => signedIn({ user: { id: "user-1" } }));
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) => fn({ api: { signInEmail: mockSignInEmail } }));
  mockGetUserMetadata.mockReset().mockResolvedValue({});
  mockMergeUserMetadata.mockReset().mockResolvedValue(undefined);
  mockGetTurnstileToken.mockReset().mockReturnValue("token");
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
  mockCheckSigninRateLimit.mockReset().mockReturnValue({ ok: true });
  mockClearSigninFailures.mockReset();
  mockRecordSigninFailure.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/auth/signin — OAuth", () => {
  it("starts the provider's OAuth flow and redirects to the provider URL", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ provider: "google" });

    const response = await POST(context);

    expect(mockStartBetterAuthOAuth).toHaveBeenCalledWith(context.request, "google");
    expect(response.headers.get("Location")).toBe("https://provider.example.com/authorize");
  });

  it("keeps next and ref in short-lived cookies for oauth-done", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ provider: "github", next: "/dashboard/alerts", ref: "REF1" });

    await POST(context);

    expect(context.cookies.set).toHaveBeenCalledWith("oauth_next", "/dashboard/alerts", expect.objectContaining({ httpOnly: true, maxAge: 600 }));
    expect(context.cookies.set).toHaveBeenCalledWith("oauth_ref", "ref1", expect.objectContaining({ httpOnly: true, maxAge: 600 }));
  });

  it("clears stale next and ref cookies when none are given", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ provider: "discord" });

    await POST(context);

    expect(context.cookies.delete).toHaveBeenCalledWith("oauth_next", { path: "/" });
    expect(context.cookies.delete).toHaveBeenCalledWith("oauth_ref", { path: "/" });
  });

  it("redirects to oauth_failed when the provider can't be started", async () => {
    mockStartBetterAuthOAuth.mockResolvedValue(null);
    const { POST } = await import("./signin");
    const context = makeContext({ provider: "discord" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=oauth_failed");
  });

  it("does not treat provider as OAuth when a password is also present", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ provider: "google", email: "a@example.com", password: "password1" });

    await POST(context);

    expect(mockStartBetterAuthOAuth).not.toHaveBeenCalled();
    expect(mockSignInEmail).toHaveBeenCalled();
  });
});

describe("POST /api/auth/signin — email/password", () => {
  it("redirects with turnstile_failed when verification fails", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=turnstile_failed");
    expect(mockSignInEmail).not.toHaveBeenCalled();
  });

  it("redirects with missing_fields when email or password is absent", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=missing_fields");
  });

  it("redirects with rate_limited when the rate limit is exceeded", async () => {
    mockCheckSigninRateLimit.mockReturnValue({ ok: false });
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=rate_limited");
    expect(mockSignInEmail).not.toHaveBeenCalled();
  });

  it("records a failure and redirects on invalid credentials", async () => {
    mockSignInEmail.mockResolvedValue(Response.json({ code: "INVALID_EMAIL_OR_PASSWORD" }, { status: 401 }));
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com", password: "wrong" });

    await POST(context);

    expect(mockRecordSigninFailure).toHaveBeenCalledWith("a@example.com");
    expect(mockClearSigninFailures).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/signin?error=invalid_credentials");
  });

  it("says email_not_confirmed for an unconfirmed address", async () => {
    mockSignInEmail.mockResolvedValue(Response.json({ code: "EMAIL_NOT_VERIFIED" }, { status: 403 }));
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=email_not_confirmed");
  });

  it("clears failures and redirects to /dashboard with the session cookie on success", async () => {
    const { POST } = await import("./signin");
    const context = makeContext({ email: "a@example.com", password: "password1" });

    const response = await POST(context);

    expect(mockSignInEmail).toHaveBeenCalledWith({ body: { email: "a@example.com", password: "password1" }, asResponse: true });
    expect(mockClearSigninFailures).toHaveBeenCalledWith("a@example.com");
    expect(response.headers.get("Location")).toBe("/dashboard");
    expect(response.headers.getSetCookie().join(";")).toContain("session_token=abc");
  });

  it("honors a safe next path on success", async () => {
    const { POST } = await import("./signin");
    const response = await POST(makeContext({ email: "a@example.com", password: "password1", next: "/dashboard/alerts" }));

    expect(response.headers.get("Location")).toBe("/dashboard/alerts");
  });

  it("sends a two-factor user to the MFA challenge, keeping next", async () => {
    mockSignInEmail.mockImplementation(async () => signedIn({ twoFactorRedirect: true }));
    const { POST } = await import("./signin");
    const response = await POST(makeContext({ email: "a@example.com", password: "password1", next: "/dashboard/alerts" }));

    expect(response.headers.get("Location")).toBe(`/signin/mfa?next=${encodeURIComponent("/dashboard/alerts")}`);
    expect(mockClearSigninFailures).not.toHaveBeenCalled();
  });

  it("saves a translated page's language on an account without one", async () => {
    const { POST } = await import("./signin");
    await POST(makeContext({ email: "a@example.com", password: "password1" }, "es"));

    expect(mockMergeUserMetadata).toHaveBeenCalledWith("user-1", { locale: "es" });
  });

  it("keeps an already saved language, and saves nothing from English pages", async () => {
    mockGetUserMetadata.mockResolvedValue({ locale: "de" });
    const { POST } = await import("./signin");
    await POST(makeContext({ email: "a@example.com", password: "password1" }, "es"));
    await POST(makeContext({ email: "a@example.com", password: "password1" }));

    expect(mockMergeUserMetadata).not.toHaveBeenCalled();
    expect(mockGetUserMetadata).toHaveBeenCalledTimes(1);
  });

  it("still signs in when saving the language fails", async () => {
    mockGetUserMetadata.mockRejectedValue(new Error("down"));
    const { POST } = await import("./signin");
    const response = await POST(makeContext({ email: "a@example.com", password: "password1" }, "es"));

    expect(response.headers.get("Location")).toBe("/dashboard");
  });
});
