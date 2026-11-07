import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDevices = vi.fn();
const mockSensors = vi.fn();
const mockReadings = vi.fn();
vi.mock("./db/places", () => ({
  devicesForHouseholds: (...args: unknown[]) => mockDevices(...args),
  sensorsOfKinds: (...args: unknown[]) => mockSensors(...args),
  recentReadings: (...args: unknown[]) => mockReadings(...args),
}));

const mockListUserHouseholds = vi.fn();
vi.mock("./households", () => ({
  listUserHouseholds: (...args: unknown[]) => mockListUserHouseholds(...args),
}));

const mockGetAlertSettingsForUser = vi.fn();
vi.mock("./notify", () => ({
  getAlertSettingsForUser: (...args: unknown[]) => mockGetAlertSettingsForUser(...args),
}));

beforeEach(() => {
  mockDevices.mockReset().mockResolvedValue([]);
  mockSensors.mockReset().mockResolvedValue([]);
  mockReadings.mockReset().mockResolvedValue([]);
  mockListUserHouseholds.mockReset();
  mockGetAlertSettingsForUser.mockReset();
  mockGetAlertSettingsForUser.mockResolvedValue({ freezeThresholdF: 34 });
});

function dbCallCount() {
  return mockDevices.mock.calls.length + mockSensors.mock.calls.length + mockReadings.mock.calls.length;
}

describe("fetchCrossPropertySnapshots", () => {
  it("returns an empty list without querying when the user owns no households", async () => {
    mockListUserHouseholds.mockResolvedValue({ households: [], error: null });
    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");
    expect(result).toEqual({ properties: [], error: null });
    expect(dbCallCount()).toBe(0);
  });

  it("propagates a household-listing error without querying further", async () => {
    mockListUserHouseholds.mockResolvedValue({ households: [], error: "boom" });
    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");
    expect(result).toEqual({ properties: [], error: "boom" });
    expect(dbCallCount()).toBe(0);
  });

  it("batches devices/sensors/readings across households in a fixed number of queries", async () => {
    mockListUserHouseholds.mockResolvedValue({
      households: [
        { household_id: "house-1", role: "owner", name: "Cabin" },
        { household_id: "house-2", role: "owner", name: "Rental A" },
        { household_id: "house-3", role: "owner", name: "Rental B" },
      ],
      error: null,
    });

    mockDevices.mockResolvedValue([
      { id: "dev-1", household_id: "house-1" },
      { id: "dev-2", household_id: "house-2" },
      // house-3 has no devices at all.
    ]);
    mockSensors.mockResolvedValue([
      { id: "sensor-1", device_id: "dev-1", kind: "temperature" },
      { id: "sensor-2", device_id: "dev-2", kind: "temperature" },
    ]);
    // Pre-sorted by recorded_at desc, as the real query would return.
    mockReadings.mockResolvedValue([
      { household_id: "house-2", value_num: 40, recorded_at: "2026-08-31T12:00:00.000Z" },
      { household_id: "house-1", value_num: 30, recorded_at: "2026-08-31T11:55:00.000Z" },
      { household_id: "house-1", value_num: 25, recorded_at: "2026-08-31T11:50:00.000Z" },
      { household_id: "house-2", value_num: 38, recorded_at: "2026-08-31T11:45:00.000Z" },
    ]);

    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");

    // Exactly 3 bulk queries regardless of household count -- devices,
    // sensors, readings -- not up to 3 per household.
    expect(dbCallCount()).toBe(3);
    expect(mockDevices).toHaveBeenCalledWith(["house-1", "house-2", "house-3"]);
    expect(mockSensors).toHaveBeenCalledWith(["dev-1", "dev-2"], ["temperature", "flood"]);
    expect(mockReadings).toHaveBeenCalledWith(
      ["house-1", "house-2", "house-3"],
      ["sensor-1", "sensor-2"],
      expect.any(String),
      expect.any(Number),
      false,
    );

    expect(result.error).toBeNull();
    const byId = new Map(result.properties.map((p) => [p.householdId, p]));

    const house1 = byId.get("house-1")!;
    expect(house1.deviceCount).toBe(1);
    expect(house1.minTempF).toBe(25);
    expect(house1.lastReadingAt).toBe("2026-08-31T11:55:00.000Z");
    expect(house1.atRisk).toBe(true); // 25 <= 34 threshold
    expect(house1.freezeThresholdF).toBe(34);

    const house2 = byId.get("house-2")!;
    expect(house2.deviceCount).toBe(1);
    expect(house2.minTempF).toBe(38);
    expect(house2.lastReadingAt).toBe("2026-08-31T12:00:00.000Z");
    expect(house2.atRisk).toBe(false);

    const house3 = byId.get("house-3")!;
    expect(house3.deviceCount).toBe(0);
    expect(house3.minTempF).toBeNull();
    expect(house3.lastReadingAt).toBeNull();
    expect(house3.atRisk).toBe(false);
  });

  it("flags a property at risk when its minimum reading is at or below the freeze threshold", async () => {
    mockGetAlertSettingsForUser.mockResolvedValue({ freezeThresholdF: 34 });
    mockListUserHouseholds.mockResolvedValue({
      households: [{ household_id: "house-1", role: "owner", name: "Cabin" }],
      error: null,
    });
    mockDevices.mockResolvedValue([{ id: "dev-1", household_id: "house-1" }]);
    mockSensors.mockResolvedValue([{ id: "sensor-1", device_id: "dev-1", kind: "temperature" }]);
    mockReadings.mockResolvedValue([
      { household_id: "house-1", value_num: 31, recorded_at: "2026-08-31T12:00:00.000Z" },
    ]);

    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");
    expect(result.properties[0].minTempF).toBe(31);
    expect(result.properties[0].atRisk).toBe(true);
  });

  it("counts enabled devices with no recent data as silent", async () => {
    mockListUserHouseholds.mockResolvedValue({
      households: [{ household_id: "house-1", role: "owner", name: "Cabin" }],
      error: null,
    });
    const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
    mockDevices.mockResolvedValue([
      { id: "live", household_id: "house-1", enabled: true, last_seen_at: hoursAgo(0.1) },
      { id: "dead", household_id: "house-1", enabled: true, last_seen_at: hoursAgo(72) },
      { id: "never", household_id: "house-1", enabled: true, last_seen_at: null },
      { id: "off", household_id: "house-1", enabled: false, last_seen_at: hoursAgo(72) },
    ]);

    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");

    expect(result.properties[0]).toMatchObject({ deviceCount: 4, silentDeviceCount: 2 });
  });

  it("skips the sensor/reading queries entirely when no household has any devices", async () => {
    mockListUserHouseholds.mockResolvedValue({
      households: [{ household_id: "house-1", role: "owner", name: "Cabin" }],
      error: null,
    });
    mockDevices.mockResolvedValue([]);

    const { fetchCrossPropertySnapshots } = await import("./crossProperty");
    const result = await fetchCrossPropertySnapshots("user-1");

    expect(dbCallCount()).toBe(1);
    expect(mockDevices).toHaveBeenCalledTimes(1);
    expect(result.properties[0]).toMatchObject({
      deviceCount: 0,
      minTempF: null,
      atRisk: false,
    });
  });
});
