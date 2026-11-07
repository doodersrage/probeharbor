import { describe, expect, it, vi } from "vitest";

const withBetterAuth = vi.fn();
vi.mock("./betterAuthRuntime", () => ({ withBetterAuth: (...a: unknown[]) => withBetterAuth(...a) }));

import { getAuthFromCookies } from "./auth";

// Better Auth lookups (cookie, bearer, revoked) run against Postgres in
// betterAuthSession.db.test.ts; the cookie header itself in betterAuthSession.test.ts.
describe("getAuthFromCookies", () => {
  it("without a Better Auth cookie: no session, no lookup", async () => {
    const result = await getAuthFromCookies({ get: () => undefined } as never);
    expect(result).toEqual({ session: null, user: null, source: "better-auth" });
    expect(withBetterAuth).not.toHaveBeenCalled();
  });

  it("ignores the old Supabase cookies", async () => {
    const jar: Record<string, string> = { "sb-access-token": "a", "sb-refresh-token": "r" };
    const result = await getAuthFromCookies({ get: (n: string) => (jar[n] ? { value: jar[n] } : undefined) } as never);
    expect(result.session).toBeNull();
    expect(withBetterAuth).not.toHaveBeenCalled();
  });
});
