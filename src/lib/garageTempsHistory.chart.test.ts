import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("./households", () => ({ getUserHouseholdId: async () => "hh-1" }));

// 20 posts from one device: "bme_t" and "bme_h" don't share a key, so they can't pair.
const rows = Array.from({ length: 20 }, (_, i) => {
  const at = new Date(Date.parse("2026-10-29T00:00:00Z") + i * 60000).toISOString();
  const sensor = (key: string, kind: string, label: string) => ({ key, label, kind, offset_num: 0, devices: { name: "Garage ESP" } });
  return [
    { recorded_at: at, value_num: 50 + i / 10, meta: {}, device_sensors: sensor("bme_t", "temperature", "Garage") },
    { recorded_at: at, value_num: 60, meta: {}, device_sensors: sensor("bme_h", "humidity", "Garage air humidity") },
  ];
}).flat();

const mockFetchAllRawSensorRows = vi.fn(async () => ({ rows, error: null }));
vi.mock("./db/history", () => ({
  // No sampled readings: the chart reads raw rows.
  listChartSensors: async () => null,
  fetchAllRawSensorRows: (...a: unknown[]) => mockFetchAllRawSensorRows(...(a as [])),
  countChartSensors: async () => 0,
  rollupBucketAverages: async () => [],
}));

import { fetchGarageTempChartData } from "./garageTempsHistory";

// The rows are dated 2026-10-29; pin "now" so they stay inside the 7-day
// window. Only Date is faked, so promises and timers run normally.
beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
});
afterAll(() => {
  vi.useRealTimers();
});

describe("fetchGarageTempChartData", () => {
  it("returns humidity that paired with no temperature, so the chart can still draw it", async () => {
    const { points, humidityOnly, error } = await fetchGarageTempChartData("user-1", 7);
    expect(error).toBeNull();
    // Temperature points carry no humidity (nothing paired with them)...
    expect(points).toHaveLength(20);
    expect(points.every((p) => p.humidity == null)).toBe(true);
    // ...and the humidity is returned on its own instead of being dropped.
    expect(humidityOnly).toHaveLength(20);
    expect(humidityOnly?.[0]).toEqual({ timestamp: "2026-10-29T00:00:00.000Z", humidity: 60, probeLabel: "Garage air" });
  });

  it("asks the database for temperature and humidity only (not door, leak or battery readings)", async () => {
    mockFetchAllRawSensorRows.mockClear();
    await fetchGarageTempChartData("user-1", 30);
    expect(mockFetchAllRawSensorRows).toHaveBeenCalledWith("hh-1", expect.any(Object), ["temperature", "humidity"], true);
  });
});

describe("formatReadingTimestamp", () => {
  it("shows the time in the browser's zone when given", async () => {
    const { formatReadingTimestamp } = await import("./garageTempsHistory");
    // 03:00 UTC is still the evening before in New York.
    const text = formatReadingTimestamp("2026-10-29T03:00:00Z", "en", "America/New_York");
    expect(text).toContain("Oct 28, 2026");
    expect(text).toContain("11:00");
  });
});
