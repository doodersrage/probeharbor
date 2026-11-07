import { describe, expect, it } from "vitest";
import type { APIContext } from "astro";

describe("POST /api/auth/set-session (old Supabase-only endpoint)", () => {
  it("answers 404 whatever the body", async () => {
    const { POST } = await import("./set-session");

    const response = (await POST({} as unknown as APIContext)) as Response;

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not found" });
  });
});
