import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockResend = vi.fn();
vi.mock("../../../lib/supabase", () => ({
  createAuthClient: () => ({ auth: { resend: (...a: unknown[]) => mockResend(...a) } }),
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
  return { request, redirect, clientAddress: "127.0.0.1" } as unknown as APIContext;
}

async function post(form: Record<string, string>): Promise<string | null> {
  const { POST } = await import("./resend-confirmation");
  const res = (await POST(makeContext(form))) as Response;
  return res.headers.get("Location");
}

beforeEach(() => {
  mockResend.mockReset().mockResolvedValue({ data: {}, error: null });
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
});

describe("POST /api/auth/resend-confirmation", () => {
  it("resends the signup email and confirms without revealing account state", async () => {
    expect(await post({ email: " a@example.com " })).toBe("/resend-confirmation?sent=1");
    expect(mockResend).toHaveBeenCalledWith({ type: "signup", email: "a@example.com" });
  });

  it("reports sent even when Supabase errors (no account enumeration)", async () => {
    mockResend.mockResolvedValue({ data: null, error: { message: "User already confirmed" } });
    expect(await post({ email: "a@example.com" })).toBe("/resend-confirmation?sent=1");
  });

  it("requires Turnstile and an email before sending anything", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    expect(await post({ email: "a@example.com" })).toBe("/resend-confirmation?error=verification");
    mockVerifyTurnstileToken.mockResolvedValue({ success: true });
    expect(await post({ email: "" })).toBe("/resend-confirmation?error=missing_email");
    expect(mockResend).not.toHaveBeenCalled();
  });
});
