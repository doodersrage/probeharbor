import { describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockForwardOAuthCallback = vi.fn();
vi.mock("../../../../lib/betterAuthRuntime", () => ({
  forwardOAuthCallback: (...a: unknown[]) => mockForwardOAuthCallback(...a),
}));

describe("GET /api/auth/github/callback", () => {
  it("hands the provider's return to Better Auth as the github callback", async () => {
    const forwarded = new Response(null, { status: 302, headers: { Location: "/api/auth/oauth-done" } });
    mockForwardOAuthCallback.mockResolvedValue(forwarded);
    const { GET } = await import("./callback");
    const request = new Request("https://example.com/api/auth/github/callback?code=abc&state=xyz");

    const response = await GET({ request } as unknown as APIContext);

    expect(mockForwardOAuthCallback).toHaveBeenCalledWith(request, "github");
    expect(response).toBe(forwarded);
  });
});
