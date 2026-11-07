import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockDeleteUserAccount = vi.fn();
vi.mock("../../../../lib/accountLifecycle", () => ({
  deleteUserAccount: (...a: unknown[]) => mockDeleteUserAccount(...a),
}));

const mockGetTotpState = vi.fn();
const mockIsElevated = vi.fn();
vi.mock("../../../../lib/betterAuthMfa", () => ({
  getTotpState: (...a: unknown[]) => mockGetTotpState(...a),
  isElevated: (...a: unknown[]) => mockIsElevated(...a),
}));

const mockVerifyPassword = vi.fn();
vi.mock("../../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (_req: unknown, fn: (auth: unknown) => unknown) =>
    fn({ api: { verifyPassword: (...a: unknown[]) => mockVerifyPassword(...a) } }),
}));

vi.mock("../../../../lib/betterAuthResponse", () => ({
  expiredBetterAuthCookies: () => ["better-auth.session_token=; Max-Age=0; Path=/"],
}));

const mockGetUserMetadata = vi.fn();
vi.mock("../../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
}));

const mockClearMfaStepUpCookie = vi.fn();
vi.mock("../../../../lib/mfaStepUpProof", () => ({
  clearMfaStepUpCookie: (...a: unknown[]) => mockClearMfaStepUpCookie(...a),
}));

const mockFormRedirectPath = vi.fn();
vi.mock("../../../../lib/siteUrl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../lib/siteUrl")>()),
  formRedirectPath: (...a: unknown[]) => mockFormRedirectPath(...a),
}));

function fakeRedirect(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

function makeContext(fields: Record<string, string>): APIContext {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  const request = {
    formData: () => Promise.resolve(form),
    headers: new Headers(),
  } as unknown as Request;
  return {
    request,
    cookies: {},
    redirect: fakeRedirect,
  } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "at", refresh_token: "" },
    user: { id: "user-1", email: "user@example.com" },
  });
  mockFormRedirectPath.mockReset().mockReturnValue("/");
  mockGetTotpState.mockReset().mockResolvedValue({ enabled: false, hasPassword: true });
  mockIsElevated.mockReset().mockResolvedValue(true);
  mockVerifyPassword.mockReset().mockResolvedValue({ status: true });
  mockGetUserMetadata.mockReset().mockResolvedValue({});
  mockDeleteUserAccount.mockReset().mockResolvedValue({ error: null });
  mockClearMfaStepUpCookie.mockReset();
});

describe("POST /api/user/account/delete", () => {
  it("redirects to signin when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./delete");

    const response = await POST(makeContext({ confirm: "DELETE" }));

    expect(response.headers.get("Location")).toBe("/signin");
  });

  it("redirects with confirm error when DELETE is not typed", async () => {
    const { POST } = await import("./delete");

    const response = await POST(makeContext({ confirm: "nope" }));

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=confirm",
    );
  });

  it("redirects with password error when password verification fails", async () => {
    mockVerifyPassword.mockRejectedValue(new Error("INVALID_PASSWORD"));
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", password: "wrong" }),
    );

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=password",
    );
  });

  it("redirects with password error when no password is given", async () => {
    const { POST } = await import("./delete");

    const response = await POST(makeContext({ confirm: "DELETE" }));

    expect(mockVerifyPassword).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=password",
    );
  });

  it("requires email confirmation for accounts without a password", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: false, hasPassword: false });
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", confirm_email: "other@example.com" }),
    );

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=email",
    );
  });

  it("redirects with mfa error when step-up is missing", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: true, hasPassword: true });
    mockIsElevated.mockResolvedValue(false);
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", password: "secret" }),
    );

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=mfa",
    );
    expect(mockDeleteUserAccount).not.toHaveBeenCalled();
  });

  it("requires step-up when only a YubiKey is registered", async () => {
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: ["cccccccccccc"] });
    mockIsElevated.mockResolvedValue(false);
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", password: "secret" }),
    );

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=mfa",
    );
  });

  it("deletes the account, clears cookies, and redirects", async () => {
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", password: "secret" }),
    );

    expect(mockDeleteUserAccount).toHaveBeenCalledWith("user-1");
    expect(mockClearMfaStepUpCookie).toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/?account_deleted=1");
    expect(response.headers.get("Set-Cookie")).toContain("Max-Age=0");
  });

  it("redirects with a generic error when deletion fails", async () => {
    mockDeleteUserAccount.mockResolvedValue({ error: { message: "boom" } });
    const { POST } = await import("./delete");

    const response = await POST(
      makeContext({ confirm: "DELETE", password: "secret" }),
    );

    expect(response.headers.get("Location")).toBe(
      "/dashboard/settings?delete_error=1",
    );
  });
});
