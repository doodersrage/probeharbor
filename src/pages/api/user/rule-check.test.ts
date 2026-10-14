import { describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockAuth = vi.fn();
vi.mock("../../../lib/auth", () => ({ getAuthFromCookies: (...a: unknown[]) => mockAuth(...a) }));
vi.mock("../../../lib/households", () => ({ getOrCreateHouseholdForUser: async () => ({ householdId: "hh" }) }));
vi.mock("../../../lib/devices", () => ({ listHouseholdDevices: async () => ({ devices: [], error: null }) }));
vi.mock("../../../lib/notify", () => ({ getAlertSettingsForUser: async () => ({ alertRules: [] }) }));
const mockExplain = vi.fn(async (..._args: unknown[]) => ({ checkedAt: "t", alertsEnabled: true, cooldownUntil: null, rules: [] }));
vi.mock("../../../lib/alertNotifications", () => ({ explainRulesForUser: (...a: unknown[]) => mockExplain(...a) }));

describe("rule-check", () => {
  it("returns the explanation for the signed-in user's property", async () => {
    mockAuth.mockResolvedValue({ session: {}, user: { id: "u1", email: "a@b.c" } });
    const { GET } = await import("./rule-check");
    const response = await GET({ cookies: {} } as unknown as APIContext);
    expect(response.status).toBe(200);
    expect(mockExplain).toHaveBeenCalledWith("u1", { alertRules: [] }, "hh", []);
    expect(((await response.json()) as { alertsEnabled: boolean }).alertsEnabled).toBe(true);
  });

  it("401s when signed out", async () => {
    mockAuth.mockResolvedValue({ session: null, user: null });
    const { GET } = await import("./rule-check");
    expect((await GET({ cookies: {} } as unknown as APIContext)).status).toBe(401);
  });
});
