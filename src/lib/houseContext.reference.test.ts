import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRpc = vi.fn();
const mockSensor = vi.fn();
const mockPage = vi.fn();
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    rpc: (...a: unknown[]) => mockRpc(...a),
    from: (table: string) => {
      const builder: Record<string, unknown> = new Proxy(
        {},
        {
          get: (_t, prop: string) => {
            if (prop === "then") return undefined;
            if (prop === "maybeSingle") return () => mockSensor();
            if (prop === "range") return (from: number, to: number) => mockPage(table, from, to);
            return () => builder;
          },
        },
      );
      return builder;
    },
  }),
}));

import { bucketSecondsFor, fetchReferenceSensorChartPoints } from "./houseContext";

beforeEach(() => {
  mockRpc.mockReset();
  mockSensor.mockReset().mockResolvedValue({ data: { label: "Hallway", kind: "temperature" }, error: null });
  mockPage.mockReset().mockResolvedValue({ data: [], error: null });
});

describe("bucketSecondsFor", () => {
  it("sizes buckets so a window comes out near 900 points, never under a minute", () => {
    expect(bucketSecondsFor("2026-09-29T00:00:00Z", "2026-10-29T00:00:00Z")).toBe(2880); // 30 days → 48 min
    expect(bucketSecondsFor("2026-10-29T00:00:00Z", "2026-10-29T06:00:00Z")).toBe(60);
  });
});

describe("fetchReferenceSensorChartPoints", () => {
  it("uses bucket averages for the whole window in one call", async () => {
    mockRpc.mockResolvedValue({
      data: [
        { sensor_id: "s", bucket_start: "2026-09-29T00:00:00+00:00", avg_num: 68.2, min_num: 68, max_num: 68.5, sample_count: 48 },
        { sensor_id: "s", bucket_start: "2026-10-28T23:12:00+00:00", avg_num: 69, min_num: 69, max_num: 69, sample_count: 48 },
      ],
      error: null,
    });

    const points = await fetchReferenceSensorChartPoints("hh-1", "s", 30, { from: "2026-09-29T00:00:00Z", to: "2026-10-29T00:00:00Z" });

    expect(mockRpc).toHaveBeenCalledWith("sensor_bucket_averages", {
      p_household_id: "hh-1",
      p_sensor_ids: ["s"],
      p_from: "2026-09-29T00:00:00Z",
      p_to: "2026-10-29T00:00:00Z",
      p_bucket_seconds: 2880,
    });
    expect(points).toEqual([
      { timestamp: "2026-09-29T00:00:00+00:00", tempf: 68.2, humidity: null, probeLabel: "Hallway" },
      { timestamp: "2026-10-28T23:12:00+00:00", tempf: 69, humidity: null, probeLabel: "Hallway" },
    ]);
    expect(mockPage).not.toHaveBeenCalled();
  });

  it("falls back to reading raw rows when the function isn't there yet", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockRpc.mockResolvedValue({ data: null, error: { code: "PGRST202", message: "function not found" } });
    mockPage.mockResolvedValue({
      data: [{ recorded_at: "2026-10-28T23:59:00Z", value_num: 70, device_sensors: { id: "s", label: "Hallway", kind: "temperature" } }],
      error: null,
    });

    const points = await fetchReferenceSensorChartPoints("hh-1", "s", 30);

    expect(mockPage).toHaveBeenCalled();
    expect(points.map((p) => p.tempf)).toEqual([70]);
    warn.mockRestore();
  });
});
