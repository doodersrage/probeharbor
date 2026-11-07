import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockRequestPasswordReset = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockGetTurnstileToken = vi.fn();
const mockVerifyTurnstileToken = vi.fn();
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: (...a: unknown[]) => mockGetTurnstileToken(...a),
  verifyTurnstileToken: (...a: unknown[]) => mockVerifyTurnstileToken(...a),
}));

function makeContext(form: Record<string, string>): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return {
    request,
    redirect,
    clientAddress: "127.0.0.1",
    locals: { locale: "es" },
  } as unknown as APIContext;
}

beforeEach(() => {
  mockRequestPasswordReset.mockReset().mockResolvedValue({ status: true });
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) =>
      fn({ api: { requestPasswordReset: (...a: unknown[]) => mockRequestPasswordReset(...a) } }),
    );
  mockGetTurnstileToken.mockReset().mockReturnValue("token");
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
});

describe("POST /api/auth/forgot-password", () => {
  it("redirects with a verification error when turnstile fails", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    const { POST } = await import("./forgot-password");
    const context = makeContext({ email: "user@example.com" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/forgot-password?error=verification");
    expect(mockWithBetterAuth).not.toHaveBeenCalled();
  });

  it("redirects with missing_email when the email is absent", async () => {
    const { POST } = await import("./forgot-password");
    const context = makeContext({});

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/forgot-password?error=missing_email");
    expect(mockWithBetterAuth).not.toHaveBeenCalled();
  });

  it("requests the reset in the page's language and redirects with sent=1", async () => {
    const { POST } = await import("./forgot-password");
    const context = makeContext({ email: " user@example.com " });

    await POST(context);

    expect(mockRequestPasswordReset).toHaveBeenCalledWith({ body: { email: "user@example.com" } });
    expect(mockWithBetterAuth).toHaveBeenCalledWith(expect.anything(), expect.any(Function), { emailLocale: "es" });
    expect(context.redirect).toHaveBeenCalledWith("/forgot-password?sent=1");
  });

  it("gives the same answer when the request fails (no account enumeration)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockRequestPasswordReset.mockRejectedValue(new Error("down"));
    const { POST } = await import("./forgot-password");
    const context = makeContext({ email: "user@example.com" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/forgot-password?sent=1");
  });
});
