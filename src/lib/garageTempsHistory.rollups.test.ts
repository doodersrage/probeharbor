import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./households", () => ({ getUserHouseholdId: async () => "hh-1" }));

const mockCountChartSensors = vi.fn();
const mockRollupBucketAverages = vi.fn();
vi.mock("./db/history", () => ({
  countChartSensors: (...a: unknown[]) => mockCountChartSensors(...a),
  rollupBucketAverages: (...a: unknown[]) => mockRollupBucketAverages(...a),
}));

import { fetchRollupChartPointsForHousehold, rollupBucketSeconds, thinChartPoints } from "./garageTempsHistory";

const bucket = (key: string, kind: string, label: string, bucket_start: string, avg_num: number | null, offset_num = 0) => ({
  bucket_start,
  avg_num,
  key,
  label,
  kind,
  offset_num,
  device_name: "Shop ESP",
});

beforeEach(() => {
  mockCountChartSensors.mockReset().mockResolvedValue(0);
  mockRollupBucketAverages.mockReset().mockResolvedValue([]);
});

describe("fetchRollupChartPointsForHousehold", () => {
  it("pairs each bucket's humidity with its temperature, applying sensor offsets", async () => {
    mockRollupBucketAverages.mockResolvedValue([
      bucket("temp1", "temperature", "Shop", "2026-06-01T00:00:00+00:00", 69),
      bucket("temp1", "temperature", "Shop", "2026-06-01T01:00:00+00:00", 70, -1),
      bucket("humidity1", "humidity", "Shop humidity", "2026-06-01T01:00:00+00:00", 55, 2),
    ]);

    const points = await fetchRollupChartPointsForHousehold("hh-1", "2026-05-01T00:00:00Z", { to: "2026-06-30T23:59:59Z" });

    expect(points).toEqual([
      { timestamp: "2026-06-01T00:00:00+00:00", tempf: 69, humidity: null, probeLabel: "Shop", device: "Shop ESP" },
      { timestamp: "2026-06-01T01:00:00+00:00", tempf: 69, humidity: 57, probeLabel: "Shop", device: "Shop ESP" },
    ]);
    // The end date is honoured.
    expect(mockRollupBucketAverages).toHaveBeenCalledWith("hh-1", "2026-05-01T00:00:00Z", "2026-06-30T23:59:59Z", expect.any(Number));
  });

  it("gets wide buckets in one call sized for the sensor count", async () => {
    mockRollupBucketAverages.mockResolvedValue([
      bucket("garage_temp", "temperature", "Garage", "2025-01-01T00:00:00+00:00", 40),
      bucket("garage_rh", "humidity", "Garage humidity", "2025-01-01T00:00:00+00:00", 65),
    ]);

    const points = await fetchRollupChartPointsForHousehold("hh-1", "2025-01-01T00:00:00Z", { to: "2026-01-01T00:00:00Z" });

    expect(points).toEqual([{ timestamp: "2025-01-01T00:00:00+00:00", tempf: 40, humidity: 65, probeLabel: "Garage", device: "Shop ESP" }]);
    expect(mockRollupBucketAverages).toHaveBeenCalledTimes(1);
    // A year with no counted sensors (treated as 1) → ~900 buckets of ~9.7 h.
    expect(mockRollupBucketAverages.mock.calls[0]![3]).toBe(Math.ceil((365 * 24 * 3600) / 900));
  });

  it("widens buckets for more sensors", async () => {
    mockCountChartSensors.mockResolvedValue(6);

    await fetchRollupChartPointsForHousehold("hh-1", "2025-01-01T00:00:00Z", { to: "2026-01-01T00:00:00Z" });

    expect(mockRollupBucketAverages.mock.calls[0]![3]).toBe(Math.ceil((365 * 24 * 3600 * 6) / 900));
  });

  it("thins long series to about the cap, still spanning newest to oldest", async () => {
    mockRollupBucketAverages.mockResolvedValue(
      Array.from({ length: 2500 }, (_, i) =>
        bucket("temp1", "temperature", "Shop", new Date(Date.parse("2026-06-01T00:00:00Z") + i * 3600000).toISOString(), 60),
      ),
    );

    const points = await fetchRollupChartPointsForHousehold("hh-1", "2026-05-01T00:00:00Z");

    expect(points.length).toBeLessThanOrEqual(1500);
    expect(points[0]?.timestamp).toBe("2026-06-01T00:00:00.000Z");
    expect(Date.parse(points.at(-1)!.timestamp)).toBeGreaterThan(Date.parse("2026-09-13T00:00:00Z"));
  });

  it("returns no points and logs when the query fails", async () => {
    mockRollupBucketAverages.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await fetchRollupChartPointsForHousehold("hh-1", "2026-05-01T00:00:00Z")).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("fetchRollupChartPointsForHousehold failed:", "db down");
    errorSpy.mockRestore();
  });
});

describe("rollupBucketSeconds", () => {
  it("keeps buckets × sensors near 900 rows and never under an hour", () => {
    expect(rollupBucketSeconds("2025-01-01T00:00:00Z", "2026-01-01T00:00:00Z", 6)).toBe(Math.ceil((365 * 24 * 3600 * 6) / 900));
    expect(rollupBucketSeconds("2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z", 2)).toBe(3600);
  });
});

describe("thinChartPoints", () => {
  const pt = (h: number, tempf: number, humidity: number | null, probeLabel = "A") => ({
    timestamp: new Date(Date.parse("2026-01-01T00:00:00Z") + h * 3600000).toISOString(),
    tempf,
    humidity,
    probeLabel,
  });

  it("leaves short series alone", () => {
    const pts = [pt(0, 50, 40), pt(1, 52, 42)];
    expect(thinChartPoints(pts, 10)).toBe(pts);
  });

  it("averages per probe, keeping missing humidity missing", () => {
    const out = thinChartPoints([pt(0, 50, 40), pt(1, 54, null), pt(0, 30, null, "B"), pt(1, 34, null, "B")], 2);
    expect(out).toEqual([
      { ...pt(0, 52, 40) },
      { ...pt(0, 32, null, "B") },
    ]);
  });
});
