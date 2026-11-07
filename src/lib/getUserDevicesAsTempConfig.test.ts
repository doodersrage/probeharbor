import { beforeEach, describe, expect, it, vi } from "vitest";

const mockListHouseholdDevices = vi.fn();
vi.mock("./db/devices", () => ({
  listHouseholdDevices: (...args: unknown[]) => mockListHouseholdDevices(...args),
}));

const mockGetOrCreateHouseholdForUser = vi.fn();
vi.mock("./households", () => ({
  getOrCreateHouseholdForUser: (...args: unknown[]) => mockGetOrCreateHouseholdForUser(...args),
}));

const mockMigrateLegacyTempTablesToDevices = vi.fn();
vi.mock("./userTempConfig", () => ({
  migrateLegacyTempTablesToDevices: (...args: unknown[]) =>
    mockMigrateLegacyTempTablesToDevices(...args),
}));

beforeEach(() => {
  mockListHouseholdDevices.mockReset().mockResolvedValue({ devices: [], error: null });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({
    householdId: "house-1",
    error: null,
  });
  mockMigrateLegacyTempTablesToDevices.mockReset().mockResolvedValue({
    migratedFeeds: 0,
    createdDevices: 0,
  });
});

describe("getUserDevicesAsTempConfig", () => {
  it("runs the legacy migration before ensuring/listing devices", async () => {
    const { getUserDevicesAsTempConfig } = await import("./devices");

    await getUserDevicesAsTempConfig("user-1", "user@example.com");

    expect(mockMigrateLegacyTempTablesToDevices).toHaveBeenCalledWith(
      "user-1",
      "user@example.com",
    );
    expect(mockGetOrCreateHouseholdForUser).toHaveBeenCalledWith(
      "user-1",
      "user@example.com",
    );
    expect(mockMigrateLegacyTempTablesToDevices.mock.invocationCallOrder[0]).toBeLessThan(
      mockListHouseholdDevices.mock.invocationCallOrder[0]!,
    );
    expect(mockListHouseholdDevices).toHaveBeenCalledWith("house-1");
  });

  it("swallows a migration failure and still returns the household's devices", async () => {
    mockMigrateLegacyTempTablesToDevices.mockRejectedValue(new Error("legacy migration boom"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getUserDevicesAsTempConfig } = await import("./devices");

    const result = await getUserDevicesAsTempConfig("user-1");

    expect(result.error).toBeNull();
    expect(result.householdId).toBe("house-1");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Legacy temp-config migration failed:",
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  it("propagates a household-creation error with empty devices and the legacy defaults", async () => {
    mockGetOrCreateHouseholdForUser.mockResolvedValue({
      householdId: "",
      error: "could not create household",
    });
    const { getUserDevicesAsTempConfig } = await import("./devices");

    const result = await getUserDevicesAsTempConfig("user-1");

    expect(result.error).toBe("could not create household");
    expect(result.devices).toEqual([]);
    expect(result.feeds.length).toBeGreaterThan(0);
    expect(result.probes.length).toBeGreaterThan(0);
  });

  it("maps the household's real devices into feeds/probes on success", async () => {
    mockListHouseholdDevices.mockResolvedValue({
      devices: [
        {
          id: "d1",
          household_id: "house-1",
          name: "Garage",
          source: "pull_url",
          pull_url: "https://example.com/feed.json",
          ingest_key_prefix: null,
          enabled: true,
          last_seen_at: null,
          sort_order: 0,
          meta: {},
          sensors: [
            {
              id: "s1",
              device_id: "d1",
              key: "0",
              label: "Bay 0",
              kind: "temperature",
              unit: "F",
              visible: true,
              sort_order: 0,
              offset_num: 0,
            },
          ],
        },
      ],
      error: null,
    });
    const { getUserDevicesAsTempConfig } = await import("./devices");

    const result = await getUserDevicesAsTempConfig("user-1");

    expect(result.error).toBeNull();
    expect(result.householdId).toBe("house-1");
    expect(result.devices).toHaveLength(1);
    expect(result.feeds).toEqual([
      expect.objectContaining({ id: "d1", url: "https://example.com/feed.json" }),
    ]);
    expect(result.probes).toEqual([
      expect.objectContaining({ id: "d1:0", feedId: "d1", key: "0" }),
    ]);
  });

  it("returns the device-list error with the legacy defaults", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [], error: "db down" });
    const { getUserDevicesAsTempConfig } = await import("./devices");

    const result = await getUserDevicesAsTempConfig("user-1");

    expect(result.error).toBe("db down");
    expect(result.householdId).toBe("house-1");
    expect(result.devices).toEqual([]);
  });
});
