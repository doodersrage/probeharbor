import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockResetPassword = vi.fn();
const mockSignInEmail = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockResetTokenUserId = vi.fn();
const mockSetPasswordForUser = vi.fn();
const mockMarkEmailVerified = vi.fn();
const mockClearResetTokenCookie = vi.fn();
vi.mock("../../../lib/betterAuthPassword", () => ({
  RESET_TOKEN_COOKIE: "ph_reset_token",
  clearResetTokenCookie: (...a: unknown[]) => mockClearResetTokenCookie(...a),
  markEmailVerified: (...a: unknown[]) => mockMarkEmailVerified(...a),
  resetTokenUserId: (...a: unknown[]) => mockResetTokenUserId(...a),
  setPasswordForUser: (...a: unknown[]) => mockSetPasswordForUser(...a),
}));

vi.mock("../../../lib/mfa", () => ({
  buildMfaChallengeUrl: (next: string) => `/signin/mfa?next=${encodeURIComponent(next)}`,
}));

const mockGetUserRecord = vi.fn();
vi.mock("../../../lib/userRecords", () => ({
  getUserRecord: (...a: unknown[]) => mockGetUserRecord(...a),
}));

function makeContext(form: Record<string, string>, resetToken?: string): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  const cookies = { get: (name: string) => (name === "ph_reset_token" && resetToken ? { value: resetToken } : undefined) };
  return { request, cookies, redirect } as unknown as APIContext;
}

function signedIn(body: Record<string, unknown> = {}): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "better-auth.session_token=new; Path=/; HttpOnly");
  return new Response(JSON.stringify(body), { status: 200, headers });
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "at", refresh_token: "rt" },
    user: { id: "user-1" },
  });
  mockResetPassword.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
  mockSignInEmail.mockReset().mockImplementation(async () => signedIn());
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) =>
      fn({ api: { resetPassword: mockResetPassword, signInEmail: mockSignInEmail } }),
    );
  mockResetTokenUserId.mockReset().mockResolvedValue("user-1");
  mockSetPasswordForUser.mockReset().mockResolvedValue(undefined);
  mockMarkEmailVerified.mockReset().mockResolvedValue(undefined);
  mockClearResetTokenCookie.mockReset();
  mockGetUserRecord.mockReset().mockResolvedValue({ id: "user-1", email: "a@example.com" });
});

async function post(form: Record<string, string>, resetToken?: string): Promise<Response> {
  const { POST } = await import("./update-password");
  return (await POST(makeContext(form, resetToken))) as Response;
}

describe("POST /api/auth/update-password", () => {
  it("redirects to signin when there's no session and no reset token", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const res = await post({ password: "password1", confirm: "password1" });
    expect(res.headers.get("Location")).toBe("/signin?error=generic");
    expect(mockSetPasswordForUser).not.toHaveBeenCalled();
  });

  it("redirects with a weak error when the password is missing", async () => {
    expect((await post({ confirm: "password1" })).headers.get("Location")).toBe("/reset-password?error=weak");
  });

  it("redirects with a weak error for a short password", async () => {
    expect((await post({ password: "short", confirm: "short" })).headers.get("Location")).toBe("/reset-password?error=weak");
  });

  it("redirects with a mismatch error when the passwords differ", async () => {
    const res = await post({ password: "password1", confirm: "password2" }, "tok");
    expect(res.headers.get("Location")).toBe("/reset-password?error=mismatch");
    expect(mockWithBetterAuth).not.toHaveBeenCalled();
  });

  it("signed in without a token: changes the password and redirects to the dashboard", async () => {
    const res = await post({ password: "password1", confirm: "password1" });
    expect(mockSetPasswordForUser).toHaveBeenCalledWith(expect.anything(), "user-1", "password1");
    expect(res.headers.get("Location")).toBe("/dashboard?password=updated");
  });

  it("redirects with an update error when the change fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockSetPasswordForUser.mockRejectedValue(new Error("boom"));
    const res = await post({ password: "password1", confirm: "password1" });
    expect(res.headers.get("Location")).toBe("/reset-password?error=update");
  });

  it("with a reset token: resets, confirms the address, signs in and lands on the dashboard", async () => {
    const res = await post({ password: "password1", confirm: "password1" }, "tok");
    expect(mockResetPassword).toHaveBeenCalledWith({ body: { newPassword: "password1", token: "tok" }, asResponse: true });
    expect(mockClearResetTokenCookie).toHaveBeenCalled();
    expect(mockMarkEmailVerified).toHaveBeenCalledWith(expect.anything(), "user-1");
    expect(mockSignInEmail).toHaveBeenCalledWith({ body: { email: "a@example.com", password: "password1" }, asResponse: true });
    expect(res.headers.get("Location")).toBe("/dashboard?password=updated");
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=new");
  });

  it("with a reset token and two-factor on: goes through the MFA challenge", async () => {
    mockSignInEmail.mockImplementation(async () => signedIn({ twoFactorRedirect: true }));
    const res = await post({ password: "password1", confirm: "password1" }, "tok");
    expect(res.headers.get("Location")).toBe(`/signin/mfa?next=${encodeURIComponent("/dashboard?password=updated")}`);
  });

  it("refuses an expired or unknown reset token", async () => {
    mockResetTokenUserId.mockResolvedValue(null);
    const res = await post({ password: "password1", confirm: "password1" }, "tok");
    expect(res.headers.get("Location")).toBe("/reset-password?error=session");
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("reports a session error when the reset itself fails", async () => {
    mockResetPassword.mockResolvedValue(new Response("{}", { status: 400 }));
    const res = await post({ password: "password1", confirm: "password1" }, "tok");
    expect(res.headers.get("Location")).toBe("/reset-password?error=session");
    expect(mockClearResetTokenCookie).not.toHaveBeenCalled();
  });
});
