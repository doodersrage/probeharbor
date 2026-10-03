import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockApplySessionCookiesAfterAuth = vi.fn();
const mockVerifyOtp = vi.fn();
vi.mock("../../../lib/mfa", () => ({
  applySessionCookiesAfterAuth: (...a: unknown[]) => mockApplySessionCookiesAfterAuth(...a),
  createAuthClient: () => ({ auth: { verifyOtp: (...a: unknown[]) => mockVerifyOtp(...a) } }),
}));

vi.mock("../../../lib/siteUrl", () => ({
  sanitizeNextPath: (v: string | null | undefined) => (v?.startsWith("/") ? v : null),
}));

vi.mock("../../../lib/registerUrl", () => ({
  REGISTER_NEXT_DEVICES: "/dashboard/devices",
}));

function makeContext(search: Record<string, string>): APIContext {
  const url = new URL("https://example.com/api/auth/confirm");
  for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return { url, cookies: {}, redirect } as unknown as APIContext;
}

const session = { access_token: "at", refresh_token: "rt" };

beforeEach(() => {
  mockVerifyOtp.mockReset().mockResolvedValue({ data: { session }, error: null });
  mockApplySessionCookiesAfterAuth
    .mockReset()
    .mockImplementation(async (_c: unknown, _s: unknown, next: string) => ({ redirectTo: next }));
});

async function location(search: Record<string, string>): Promise<string | null> {
  const { GET } = await import("./confirm");
  const res = (await GET(makeContext(search))) as Response;
  return res.headers.get("Location");
}

describe("GET /api/auth/confirm", () => {
  it("verifies a signup link, signs the user in, and sends them to Devices", async () => {
    expect(await location({ token_hash: "pkce_abc", type: "signup" })).toBe("/dashboard/devices");
    expect(mockVerifyOtp).toHaveBeenCalledWith({ token_hash: "pkce_abc", type: "signup" });
    expect(mockApplySessionCookiesAfterAuth).toHaveBeenCalledWith(
      expect.anything(),
      session,
      "/dashboard/devices",
    );
  });

  it("sends a recovery link to the reset-password form", async () => {
    expect(await location({ token_hash: "pkce_abc", type: "recovery" })).toBe("/reset-password");
  });

  it("honors a safe next path", async () => {
    expect(await location({ token_hash: "t", type: "email", next: "/dashboard/alerts" })).toBe(
      "/dashboard/alerts",
    );
  });

  it("rejects a missing token or unknown type without calling Supabase", async () => {
    expect(await location({ type: "signup" })).toBe("/signin?error=confirm_link");
    expect(await location({ token_hash: "t", type: "sms" })).toBe("/signin?error=confirm_link");
    expect(mockVerifyOtp).not.toHaveBeenCalled();
  });

  it("explains an expired or reused link", async () => {
    mockVerifyOtp.mockResolvedValue({ data: { session: null }, error: { message: "expired" } });
    expect(await location({ token_hash: "t", type: "signup" })).toBe("/signin?error=confirm_link");
    expect(await location({ token_hash: "t", type: "recovery" })).toBe("/reset-password?error=session");
    expect(mockApplySessionCookiesAfterAuth).not.toHaveBeenCalled();
  });
});
