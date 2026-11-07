import { beforeEach, describe, expect, it, vi } from "vitest";

// The write goes through the shared session-metadata helper (tested against
// Postgres in accountSettings.db.test.ts). Here: the key it sends.
const mockUpdateSessionUserMetadata = vi.fn();
vi.mock("./sessionMetadata", () => ({
  updateSessionUserMetadata: (...args: unknown[]) => mockUpdateSessionUserMetadata(...args),
}));

beforeEach(() => {
  mockUpdateSessionUserMetadata.mockReset().mockResolvedValue({ user: { id: "user-1" }, error: null });
});

describe("getDashboardOverviewMode", () => {
  it("returns 'insights' when the metadata says so", async () => {
    const { getDashboardOverviewMode } = await import("./dashboardOverviewMode");

    const user = { user_metadata: { dashboard_overview_mode: "insights" } } as never;
    expect(getDashboardOverviewMode(user)).toBe("insights");
  });

  it("defaults to 'simple' for any other value, missing metadata, or no user", async () => {
    const { getDashboardOverviewMode } = await import("./dashboardOverviewMode");

    expect(getDashboardOverviewMode({ user_metadata: { dashboard_overview_mode: "bogus" } } as never)).toBe(
      "simple",
    );
    expect(getDashboardOverviewMode({ user_metadata: {} } as never)).toBe("simple");
    expect(getDashboardOverviewMode(null)).toBe("simple");
    expect(getDashboardOverviewMode(undefined)).toBe("simple");
  });
});

describe("updateDashboardOverviewMode", () => {
  it("writes dashboard_overview_mode for the session's user and returns the user", async () => {
    const { updateDashboardOverviewMode } = await import("./dashboardOverviewMode");
    await expect(updateDashboardOverviewMode("access", "", "insights")).resolves.toEqual({ user: { id: "user-1" }, error: null });
    expect(mockUpdateSessionUserMetadata).toHaveBeenCalledWith("access", "", { dashboard_overview_mode: "insights" });
  });

  it("passes the helper's error back", async () => {
    mockUpdateSessionUserMetadata.mockResolvedValue({ user: null, error: new Error("Invalid session") });
    const { updateDashboardOverviewMode } = await import("./dashboardOverviewMode");
    const result = await updateDashboardOverviewMode("access", "", "simple");
    expect(result.error?.message).toBe("Invalid session");
  });
});
