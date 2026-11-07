import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuth = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuth(...a),
}));
vi.mock("../../../lib/mfa", () => ({ MFA_REQUIRED_COOKIE: "mfa_required" }));
const mockClearMfaStepUpCookie = vi.fn();
vi.mock("../../../lib/mfaStepUpProof", () => ({ clearMfaStepUpCookie: (...a: unknown[]) => mockClearMfaStepUpCookie(...a) }));

const mockRevokeSessions = vi.fn();
vi.mock("../../../lib/betterAuthRuntime", () => ({
  withBetterAuth: (_req: unknown, fn: (auth: unknown) => unknown) => fn({ api: { revokeSessions: mockRevokeSessions } }),
}));

function makeContext(): APIContext {
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  const request = new Request("https://example.com/api/auth/signout-everywhere", { method: "POST" });
  return { cookies: { delete: vi.fn() }, redirect, request } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuth.mockReset();
  mockClearMfaStepUpCookie.mockReset();
  mockRevokeSessions.mockReset();
});

describe("signout-everywhere", () => {
  it("ends every session and signs this browser out", async () => {
    mockGetAuth.mockResolvedValue({ session: { access_token: "jwt" }, user: { id: "u1" } });
    mockRevokeSessions.mockResolvedValue({ status: true });
    const { POST } = await import("./signout-everywhere");
    const context = makeContext();
    const response = await POST(context);
    expect(mockRevokeSessions).toHaveBeenCalledWith({ headers: context.request.headers });
    expect(context.cookies.delete).toHaveBeenCalledWith("mfa_required", { path: "/" });
    expect(mockClearMfaStepUpCookie).toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/signin?signed_out=all");
    expect(response.headers.getSetCookie().every((c) => c.includes("Max-Age=0"))).toBe(true);
    expect(response.headers.getSetCookie().length).toBe(2);
  });

  it("keeps this browser signed in and reports failure when revocation fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetAuth.mockResolvedValue({ session: { access_token: "jwt" }, user: { id: "u1" } });
    mockRevokeSessions.mockRejectedValue(new Error("boom"));
    const { POST } = await import("./signout-everywhere");
    const context = makeContext();
    const response = await POST(context);
    expect(context.cookies.delete).not.toHaveBeenCalled();
    expect(response.headers.getSetCookie()).toEqual([]);
    expect(response.headers.get("Location")).toContain("signout_all=failed");
  });

  it("sends signed-out visitors to sign in without revoking anything", async () => {
    mockGetAuth.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./signout-everywhere");
    const response = await POST(makeContext());
    expect(mockRevokeSessions).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/signin");
  });
});
