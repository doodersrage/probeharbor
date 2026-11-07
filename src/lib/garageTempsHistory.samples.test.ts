import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./households", () => ({ getUserHouseholdId: async () => "hh-1" }));

const sensors = [
  { id: "t", key: "temp1", label: "Bay", kind: "temperature", offset_num: 0, devices: { name: "Garage ESP" } },
  { id: "h", key: "humidity1", label: "Bay humidity", kind: "humidity", offset_num: 0, devices: { name: "Garage ESP" } },
];
const mockListChartSensors = vi.fn();
const mockSensorBucketSamples = vi.fn();
const mockFetchAllRawSensorRows = vi.fn();
vi.mock("./db/history", () => ({
  listChartSensors: (...a: unknown[]) => mockListChartSensors(...a),
  sensorBucketSamples: (...a: unknown[]) => mockSensorBucketSamples(...a),
  fetchAllRawSensorRows: (...a: unknown[]) => mockFetchAllRawSensorRows(...a),
  // Fewer than 10 points also asks for rollups: answer with no rows.
  countChartSensors: async () => 0,
  rollupBucketAverages: async () => [],
}));

import { fetchGarageTempChartData, groupSensorsForSampling, sampleBucketCount } from "./garageTempsHistory";

// The sample readings are dated 2026-10-29; pin "now" so they stay inside
// the 7-day window. Only Date is faked, so promises and timers run normally.
beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
});
afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  mockListChartSensors.mockReset().mockResolvedValue(sensors);
  mockSensorBucketSamples.mockReset();
  mockFetchAllRawSensorRows.mockReset().mockResolvedValue({ rows: [], error: null });
});

describe("fetchGarageTempChartData with bucket samples", () => {
  it("charts real sampled readings, keeps a short dip, and pairs same-post humidity", async () => {
    const samples = [
      { sensor_id: "t", recorded_at: "2026-10-29T00:00:00+00:00", value_num: 45 },
      { sensor_id: "h", recorded_at: "2026-10-29T00:00:00+00:00", value_num: 60 },
      // The bucket's lowest reading: a 2-minute dip to 33 °F.
      { sensor_id: "t", recorded_at: "2026-10-29T01:12:00+00:00", value_num: 33 },
      { sensor_id: "t", recorded_at: "2026-10-29T02:00:00+00:00", value_num: 44 },
      { sensor_id: "h", recorded_at: "2026-10-29T02:00:00+00:00", value_num: 62 },
    ];
    // Each call returns only the sensors it asked for.
    mockSensorBucketSamples.mockImplementation(async (_household: string, sensorIds: string[]) =>
      samples.filter((row) => sensorIds.includes(row.sensor_id)),
    );

    const { points, error, sampleIntervalMs } = await fetchGarageTempChartData("user-1", 7);

    expect(error).toBeNull();
    // The bucket width goes to the chart's gap rule (seconds → ms).
    const bucketSeconds = mockSensorBucketSamples.mock.calls[0]![5] as number;
    expect(sampleIntervalMs).toBe(bucketSeconds * 1000);
    expect(points.map((p) => [p.tempf, p.humidity])).toEqual([
      [45, 60],
      [33, null],
      [44, 62],
    ]);
    expect(mockFetchAllRawSensorRows).not.toHaveBeenCalled();
    // 300 buckets: temperature (first/min/max, up to 900 rows) fills one call; humidity gets its own.
    expect(mockSensorBucketSamples.mock.calls.map((c) => c[1])).toEqual([["t"], ["h"]]);
    expect(mockSensorBucketSamples.mock.calls[0]![0]).toBe("hh-1");
    expect(mockSensorBucketSamples.mock.calls[0]![2]).toEqual(["t"]);
    expect(mockSensorBucketSamples.mock.calls[1]![2]).toEqual([]);
    // 7 days over 300 buckets (one temperature sensor) → ~34 min.
    // ("now" is read twice, so the window can be a few ms over 7 days.)
    expect(bucketSeconds).toBeGreaterThanOrEqual(Math.ceil((7 * 24 * 3600) / 300));
    expect(bucketSeconds).toBeLessThanOrEqual(Math.ceil((7 * 24 * 3600) / 300) + 1);
  });

  it("falls back to reading raw rows when a sample call fails", async () => {
    mockSensorBucketSamples.mockResolvedValue(null);

    await fetchGarageTempChartData("user-1", 7);

    expect(mockFetchAllRawSensorRows).toHaveBeenCalled();
  });

  it("falls back to reading raw rows when the sensor lookup fails", async () => {
    mockListChartSensors.mockResolvedValue(null);

    await fetchGarageTempChartData("user-1", 7);

    expect(mockSensorBucketSamples).not.toHaveBeenCalled();
    expect(mockFetchAllRawSensorRows).toHaveBeenCalled();
  });
});

describe("sampling sizes", () => {
  it("aims for ~1000 temperature points in total, 50-300 buckets per sensor", () => {
    expect(sampleBucketCount(1)).toBe(300);
    expect(sampleBucketCount(3)).toBe(111);
    expect(sampleBucketCount(20)).toBe(50);
  });

  it("splits sensors so each call stays under 900 rows", () => {
    const list = [
      { id: "t1", kind: "temperature" },
      { id: "h1", kind: "humidity" },
      { id: "t2", kind: "temperature" },
      { id: "h2", kind: "humidity" },
    ];
    const groups = groupSensorsForSampling(list, 150); // temp 450 rows, humidity 150
    expect(groups.map((g) => g.map((s) => s.id))).toEqual([["t1", "h1"], ["t2", "h2"]]);
  });
});
