import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuth = vi.fn();
const mockClearAuthCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuth(...a),
  clearAuthCookies: (...a: unknown[]) => mockClearAuthCookies(...a),
}));
vi.mock("../../../lib/mfa", () => ({ MFA_REQUIRED_COOKIE: "mfa_required" }));
vi.mock("../../../lib/mfaStepUpProof", () => ({ clearMfaStepUpCookie: vi.fn() }));

const mockAdminSignOut = vi.fn();
vi.mock("../../../lib/supabase", () => ({
  createAdminClient: () => ({ auth: { admin: { signOut: (...a: unknown[]) => mockAdminSignOut(...a) } } }),
}));

function makeContext(): APIContext {
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return { cookies: { delete: vi.fn() }, redirect } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuth.mockReset();
  mockClearAuthCookies.mockReset();
  mockAdminSignOut.mockReset();
});

describe("signout-everywhere", () => {
  it("revokes every session globally and signs this browser out", async () => {
    mockGetAuth.mockResolvedValue({ session: { access_token: "jwt" }, user: { id: "u1" } });
    mockAdminSignOut.mockResolvedValue({ error: null });
    const { POST } = await import("./signout-everywhere");
    const response = await POST(makeContext());
    expect(mockAdminSignOut).toHaveBeenCalledWith("jwt", "global");
    expect(mockClearAuthCookies).toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/signin?signed_out=all");
  });

  it("keeps this browser signed in and reports failure when revocation fails", async () => {
    mockGetAuth.mockResolvedValue({ session: { access_token: "jwt" }, user: { id: "u1" } });
    mockAdminSignOut.mockResolvedValue({ error: { message: "boom" } });
    const { POST } = await import("./signout-everywhere");
    const response = await POST(makeContext());
    expect(mockClearAuthCookies).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toContain("signout_all=failed");
  });

  it("sends signed-out visitors to sign in without calling Supabase", async () => {
    mockGetAuth.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./signout-everywhere");
    const response = await POST(makeContext());
    expect(mockAdminSignOut).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/signin");
  });
});
