import { beforeEach, describe, expect, it, vi } from "vitest";

// One household with a push device and the example pull feed, as on a real account.
const savePullDevicesForHousehold = vi.fn().mockResolvedValue({ error: null });
const exampleFeed = { id: "dev-example", name: "Workshop", url: "https://probeharbor.dev/api/feeds/example", enabled: true, jsonRoot: "temp" };
vi.mock("./devices", () => ({
  getUserDevicesAsTempConfig: vi.fn().mockResolvedValue({
    householdId: "h1",
    devices: [{ id: "dev-push" }, { id: "dev-example" }],
    feeds: [exampleFeed],
    probes: [{ id: "dev-example:temp", feedId: "dev-example", key: "temp", label: "Workshop" }],
    error: null,
  }),
  savePullDevicesForHousehold,
}));
vi.mock("./households", () => ({ getOrCreateHouseholdForUser: vi.fn().mockResolvedValue({ householdId: "h1" }) }));
// Legacy per-user tables are empty: every query resolves to no rows.
vi.mock("./supabase", () => {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "delete", "eq", "order"]) chain[method] = () => chain;
  chain.then = (resolve: (value: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve);
  return { createServerClient: () => ({ from: () => chain }) };
});

beforeEach(() => savePullDevicesForHousehold.mockClear());

describe("deleteUserTempFeed", () => {
  it("deleting the last pull feed leaves none instead of re-creating the example feed", async () => {
    const { deleteUserTempFeed } = await import("./userTempConfig");
    const result = await deleteUserTempFeed("user-1", "dev-example");
    expect(result.error).toBeNull();
    expect(savePullDevicesForHousehold).toHaveBeenCalledWith("h1", [], []);
  });
});

describe("getUserTempConfig", () => {
  it("does not show the example feed to an account that has only push devices", async () => {
    const devices = await import("./devices");
    vi.mocked(devices.getUserDevicesAsTempConfig).mockResolvedValueOnce({
      householdId: "h1",
      devices: [{ id: "dev-push" }],
      feeds: [],
      probes: [],
      error: null,
    } as never);
    const { getUserTempConfig } = await import("./userTempConfig");
    const config = await getUserTempConfig({ id: "user-1", email: "a@example.com", user_metadata: {} } as never);
    expect(config.feeds).toEqual([]);
  });
});
