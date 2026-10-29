import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./households", () => ({ getUserHouseholdId: async () => "hh-1" }));

type Row = { bucket_start: string; avg_num: number | null; device_sensors: unknown };
let table: Row[] = [];
const calls: Array<[string, unknown[]]> = [];

vi.mock("./supabase", () => ({
  createServerClient: () => {
    const builder: Record<string, unknown> = new Proxy(
      {},
      {
        get: (_t, prop: string) => {
          if (prop === "then") return undefined;
          if (prop === "range")
            return async (from: number, to: number) => {
              calls.push(["range", [from, to]]);
              return { data: table.slice(from, to + 1), error: null };
            };
          return (...args: unknown[]) => {
            calls.push([prop, args]);
            return builder;
          };
        },
      },
    );
    return { from: () => builder };
  },
}));

import { fetchRollupChartPointsForHousehold, thinChartPoints } from "./garageTempsHistory";

const sensor = (key: string, kind: string, label: string, offset = 0) => ({
  key,
  label,
  kind,
  offset_num: offset,
  devices: { name: "Shop ESP" },
});

beforeEach(() => {
  calls.length = 0;
});

describe("fetchRollupChartPointsForHousehold", () => {
  it("pairs each hour's humidity with its temperature (newest-first pages, end date honoured)", async () => {
    // Newest first, as the query asks for.
    table = [
      { bucket_start: "2026-06-01T01:00:00+00:00", avg_num: 70, device_sensors: sensor("temp1", "temperature", "Shop", -1) },
      { bucket_start: "2026-06-01T01:00:00+00:00", avg_num: 55, device_sensors: sensor("humidity1", "humidity", "Shop humidity", 2) },
      { bucket_start: "2026-06-01T00:00:00+00:00", avg_num: 69, device_sensors: sensor("temp1", "temperature", "Shop") },
    ];

    const points = await fetchRollupChartPointsForHousehold("hh-1", "2026-05-01T00:00:00Z", { to: "2026-06-30T23:59:59Z" });

    expect(points).toEqual([
      { timestamp: "2026-06-01T00:00:00+00:00", tempf: 69, humidity: null, probeLabel: "Shop", device: "Shop ESP" },
      { timestamp: "2026-06-01T01:00:00+00:00", tempf: 69, humidity: 57, probeLabel: "Shop", device: "Shop ESP" },
    ]);
    expect(calls).toEqual(
      expect.arrayContaining([
        ["in", ["device_sensors.kind", ["temperature", "humidity"]]],
        ["lte", ["bucket_start", "2026-06-30T23:59:59Z"]],
        ["order", ["bucket_start", { ascending: false }]],
        ["order", ["sensor_id", { ascending: true }]],
      ]),
    );
  });

  it("reads past 1000 rows instead of stopping at the oldest page", async () => {
    table = Array.from({ length: 2500 }, (_, i) => ({
      bucket_start: new Date(Date.parse("2026-06-01T00:00:00Z") + (2499 - i) * 3600000).toISOString(),
      avg_num: 60,
      device_sensors: sensor("temp1", "temperature", "Shop"),
    }));

    const points = await fetchRollupChartPointsForHousehold("hh-1", "2026-05-01T00:00:00Z");

    expect(calls.filter(([m]) => m === "range")).toHaveLength(3);
    // 2500 hourly points are thinned to about the cap, still spanning newest to oldest.
    expect(points.length).toBeLessThanOrEqual(1500);
    expect(points[0]?.timestamp).toBe("2026-06-01T00:00:00.000Z");
    expect(Date.parse(points.at(-1)!.timestamp)).toBeGreaterThan(Date.parse("2026-09-13T00:00:00Z"));
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
