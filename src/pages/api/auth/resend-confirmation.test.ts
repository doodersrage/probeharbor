import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockSendVerificationEmail = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockVerifyTurnstileToken = vi.fn();
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: () => "token",
  verifyTurnstileToken: (...a: unknown[]) => mockVerifyTurnstileToken(...a),
}));

function makeContext(form: Record<string, string>): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return { request, redirect, clientAddress: "127.0.0.1", locals: { locale: "fr" } } as unknown as APIContext;
}

async function post(form: Record<string, string>): Promise<string | null> {
  const { POST } = await import("./resend-confirmation");
  const res = (await POST(makeContext(form))) as Response;
  return res.headers.get("Location");
}

beforeEach(() => {
  mockSendVerificationEmail.mockReset().mockResolvedValue({ status: true });
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) =>
      fn({ api: { sendVerificationEmail: (...a: unknown[]) => mockSendVerificationEmail(...a) } }),
    );
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
});

describe("POST /api/auth/resend-confirmation", () => {
  it("resends the signup email in the page's language and confirms without revealing account state", async () => {
    expect(await post({ email: " a@example.com " })).toBe("/resend-confirmation?sent=1");
    expect(mockSendVerificationEmail).toHaveBeenCalledWith({ body: { email: "a@example.com" } });
    expect(mockWithBetterAuth).toHaveBeenCalledWith(expect.anything(), expect.any(Function), { emailLocale: "fr" });
  });

  it("reports sent even when sending fails (no account enumeration)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockSendVerificationEmail.mockRejectedValue(new Error("User already confirmed"));
    expect(await post({ email: "a@example.com" })).toBe("/resend-confirmation?sent=1");
  });

  it("requires Turnstile and an email before sending anything", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    expect(await post({ email: "a@example.com" })).toBe("/resend-confirmation?error=verification");
    mockVerifyTurnstileToken.mockResolvedValue({ success: true });
    expect(await post({ email: "" })).toBe("/resend-confirmation?error=missing_email");
    expect(mockWithBetterAuth).not.toHaveBeenCalled();
  });
});
