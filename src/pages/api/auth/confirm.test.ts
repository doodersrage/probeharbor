import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockVerifyEmail = vi.fn();
const mockGetSession = vi.fn();
const mockWithBetterAuth = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (...a: unknown[]) => mockWithBetterAuth(...a),
}));

const mockResetTokenUserId = vi.fn();
const mockSetResetTokenCookie = vi.fn();
vi.mock("../../../lib/betterAuthPassword", () => ({
  resetTokenUserId: (...a: unknown[]) => mockResetTokenUserId(...a),
  setResetTokenCookie: (...a: unknown[]) => mockSetResetTokenCookie(...a),
}));

const mockGetUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
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
  return { url, cookies: {}, redirect, request: new Request(url) } as unknown as APIContext;
}

function verified(): Response {
  const headers = new Headers();
  headers.append("Set-Cookie", "better-auth.session_token=abc; Path=/; HttpOnly");
  return new Response(null, { status: 200, headers });
}

beforeEach(() => {
  mockVerifyEmail.mockReset().mockImplementation(async () => verified());
  mockGetSession.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  mockWithBetterAuth
    .mockReset()
    .mockImplementation((_req: unknown, fn: (auth: unknown) => unknown) =>
      fn({ api: { verifyEmail: mockVerifyEmail, getSession: mockGetSession } }),
    );
  mockResetTokenUserId.mockReset().mockResolvedValue("user-1");
  mockSetResetTokenCookie.mockReset();
  mockGetUserMetadata.mockReset().mockResolvedValue({});
});

async function respond(search: Record<string, string>): Promise<Response> {
  const { GET } = await import("./confirm");
  return (await GET(makeContext(search))) as Response;
}

async function location(search: Record<string, string>): Promise<string | null> {
  return (await respond(search)).headers.get("Location");
}

describe("GET /api/auth/confirm", () => {
  it("verifies a signup link, signs the user in, and sends them to Devices", async () => {
    const res = await respond({ token_hash: "tok", type: "signup" });
    expect(res.headers.get("Location")).toBe("/dashboard/devices");
    expect(res.headers.getSetCookie().join(";")).toContain("session_token=abc");
    expect(mockVerifyEmail).toHaveBeenCalledWith({ query: { token: "tok" }, asResponse: true });
  });

  it("sends a recovery link to the reset-password form, keeping the token in a cookie", async () => {
    expect(await location({ token_hash: "tok", type: "recovery" })).toBe("/reset-password");
    expect(mockSetResetTokenCookie).toHaveBeenCalledWith(expect.anything(), "tok");
    expect(mockVerifyEmail).not.toHaveBeenCalled();
  });

  it("sends a recovery link to the account's language", async () => {
    mockGetUserMetadata.mockResolvedValue({ locale: "es" });
    expect(await location({ token_hash: "tok", type: "recovery" })).toBe("/es/reset-password");
  });

  it("honors a safe next path", async () => {
    expect(await location({ token_hash: "t", type: "email", next: "/dashboard/alerts" })).toBe("/dashboard/alerts");
  });

  it("rejects a missing token or unsupported type without calling Better Auth", async () => {
    expect(await location({ type: "signup" })).toBe("/signin?error=confirm_link");
    expect(await location({ token_hash: "t", type: "sms" })).toBe("/signin?error=confirm_link");
    expect(await location({ token_hash: "t", type: "magiclink" })).toBe("/signin?error=confirm_link");
    expect(mockWithBetterAuth).not.toHaveBeenCalled();
  });

  it("explains an expired or reused link", async () => {
    mockVerifyEmail.mockResolvedValue(new Response(null, { status: 401 }));
    mockResetTokenUserId.mockResolvedValue(null);
    expect(await location({ token_hash: "t", type: "signup" })).toBe("/signin?error=confirm_link");
    expect(await location({ token_hash: "t", type: "recovery" })).toBe("/reset-password?error=session");
    expect(mockSetResetTokenCookie).not.toHaveBeenCalled();
  });

  it("sends an already-confirmed address (no new session) to sign in", async () => {
    mockVerifyEmail.mockResolvedValue(new Response(null, { status: 200 }));
    expect(await location({ token_hash: "t", type: "signup" })).toBe("/signin?error=confirm_link");
    expect(mockGetSession).not.toHaveBeenCalled();
  });
});
