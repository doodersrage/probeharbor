import { describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

describe("GET /api/auth/callback (old Supabase OAuth return)", () => {
  it("sends the visitor back to sign-in with the exchange-failed message", async () => {
    const { GET } = await import("./callback");
    const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
    const url = new URL("https://example.com/api/auth/callback?code=abc");

    const response = (await GET({ url, redirect } as unknown as APIContext)) as Response;

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("error=oauth_exchange_failed");
  });
});
