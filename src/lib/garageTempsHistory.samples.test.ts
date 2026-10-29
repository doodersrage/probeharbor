import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./households", () => ({ getUserHouseholdId: async () => "hh-1" }));

const mockRpc = vi.fn();
const rawRange = vi.fn();
const sensors = [
  { id: "t", key: "temp1", label: "Bay", kind: "temperature", offset_num: 0, devices: { name: "Garage ESP", household_id: "hh-1" } },
  { id: "h", key: "humidity1", label: "Bay humidity", kind: "humidity", offset_num: 0, devices: { name: "Garage ESP", household_id: "hh-1" } },
];

vi.mock("./supabase", () => ({
  createServerClient: () => ({
    rpc: (...a: unknown[]) => mockRpc(...a),
    from: (table: string) => {
      const builder: Record<string, unknown> = new Proxy(
        {},
        {
          get: (_t, prop: string) => {
            if (prop === "then") {
              // Awaiting the device_sensors query resolves to the sensor list.
              return table === "device_sensors"
                ? (resolve: (v: unknown) => void) => resolve({ data: sensors, error: null })
                : undefined;
            }
            if (prop === "range") return (...a: unknown[]) => rawRange(...a);
            return () => builder;
          },
        },
      );
      return builder;
    },
  }),
}));

import { fetchGarageTempChartData, groupSensorsForSampling, sampleBucketCount } from "./garageTempsHistory";

beforeEach(() => {
  mockRpc.mockReset();
  rawRange.mockReset().mockResolvedValue({ data: [], error: null });
});

describe("fetchGarageTempChartData with sensor_bucket_samples", () => {
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
    // (Fewer than 10 points also asks for rollups: answer that with no rows.)
    mockRpc.mockImplementation(async (fn: string, args: { p_sensor_ids: string[] }) =>
      fn === "sensor_bucket_samples"
        ? { data: samples.filter((row) => args.p_sensor_ids.includes(row.sensor_id)), error: null }
        : { data: [], error: null },
    );

    const { points, error } = await fetchGarageTempChartData("user-1", 7);

    expect(error).toBeNull();
    expect(points.map((p) => [p.tempf, p.humidity])).toEqual([
      [45, 60],
      [33, null],
      [44, 62],
    ]);
    expect(rawRange).not.toHaveBeenCalled();
    // 300 buckets: temperature (first/min/max, up to 900 rows) fills one call; humidity gets its own.
    const sampleCalls = mockRpc.mock.calls.filter((c) => c[0] === "sensor_bucket_samples");
    expect(sampleCalls.map((c) => (c[1] as { p_sensor_ids: string[] }).p_sensor_ids)).toEqual([["t"], ["h"]]);
    const args = mockRpc.mock.calls[0]![1] as Record<string, unknown>;
    expect(mockRpc.mock.calls[0]![0]).toBe("sensor_bucket_samples");
    expect(args.p_extreme_sensor_ids).toEqual(["t"]);
    expect((mockRpc.mock.calls[1]![1] as Record<string, unknown>).p_extreme_sensor_ids).toEqual([]);
    // 7 days over 300 buckets (one temperature sensor) → ~34 min.
    // ("now" is read twice, so the window can be a few ms over 7 days.)
    expect(args.p_bucket_seconds).toBeGreaterThanOrEqual(Math.ceil((7 * 24 * 3600) / 300));
    expect(args.p_bucket_seconds).toBeLessThanOrEqual(Math.ceil((7 * 24 * 3600) / 300) + 1);
  });

  it("falls back to reading raw rows when the function isn't there yet", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockRpc.mockResolvedValue({ data: null, error: { code: "PGRST202", message: "function not found" } });

    await fetchGarageTempChartData("user-1", 7);

    expect(rawRange).toHaveBeenCalled();
    warn.mockRestore();
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
