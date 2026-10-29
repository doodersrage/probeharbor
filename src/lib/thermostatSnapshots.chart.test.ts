import { beforeEach, describe, expect, it, vi } from "vitest";

// 30 days of snapshots every 15 minutes, newest first, like the real table.
const START = Date.parse("2026-09-29T12:00:00Z");
const SNAPSHOTS = Array.from({ length: 30 * 96 }, (_, i) => ({
  recorded_at: new Date(START + i * 15 * 60000).toISOString(),
  ambient_temp_f: 68 + (i % 4),
})).reverse();
const calls: Array<[string, unknown[]]> = [];

vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: () => {
      const builder: Record<string, unknown> = {};
      for (const m of ["select", "eq", "gte", "lte", "order"]) {
        builder[m] = (...args: unknown[]) => {
          calls.push([m, args]);
          return builder;
        };
      }
      builder.range = async (from: number, to: number) => {
        calls.push(["range", [from, to]]);
        return { data: SNAPSHOTS.slice(from, to + 1), error: null };
      };
      return builder;
    },
  }),
}));

import { fetchThermostatSnapshotChartPoints } from "./thermostatSnapshots";

beforeEach(() => {
  calls.length = 0;
});

describe("fetchThermostatSnapshotChartPoints", () => {
  it("returns the whole 30-day window through to the newest snapshot (not just the oldest 1000)", async () => {
    const points = await fetchThermostatSnapshotChartPoints("hh-1", 30);
    expect(points).toHaveLength(2880);
    expect(points[0]?.timestamp).toBe("2026-09-29T12:00:00.000Z");
    expect(points.at(-1)?.timestamp).toBe(SNAPSHOTS[0]!.recorded_at);
    expect(calls).toEqual(expect.arrayContaining([["order", ["recorded_at", { ascending: false }]]]));
    expect(calls.filter(([m]) => m === "range")).toHaveLength(3);
  });
});
