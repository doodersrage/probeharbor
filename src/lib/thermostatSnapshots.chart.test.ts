import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setQueryRunnerForTests, type QueryRunner } from "./db/client";
import { fetchThermostatSnapshotChartPoints } from "./thermostatSnapshots";

// 30 days of snapshots every 15 minutes, newest first, as the query returns them.
const START = Date.parse("2026-09-29T12:00:00Z");
const SNAPSHOTS = Array.from({ length: 30 * 96 }, (_, i) => ({
  recorded_at: new Date(START + i * 15 * 60000).toISOString(),
  ambient_temp_f: 68 + (i % 4),
})).reverse();

// Stand-in for the database: records each statement.
const run = vi.fn<(text: string, params?: readonly unknown[]) => Promise<unknown[]>>();

beforeEach(() => {
  run.mockReset();
  setQueryRunnerForTests(run as unknown as QueryRunner);
});

afterEach(() => {
  setQueryRunnerForTests(null);
  vi.restoreAllMocks();
});

describe("fetchThermostatSnapshotChartPoints", () => {
  it("returns the whole 30-day window through to the newest snapshot (not just the oldest 1000)", async () => {
    run.mockResolvedValue(SNAPSHOTS.map((row) => ({ ...row })));

    const points = await fetchThermostatSnapshotChartPoints("hh-1", 30);

    expect(points).toHaveLength(2880);
    expect(points[0]?.timestamp).toBe("2026-09-29T12:00:00.000Z");
    expect(points.at(-1)?.timestamp).toBe(SNAPSHOTS[0]!.recorded_at);
    // Newest first in the database (so a cap drops the oldest), one query.
    expect(run).toHaveBeenCalledTimes(1);
    const [text, params] = run.mock.calls[0]!;
    expect(text).toMatch(/order by recorded_at desc/);
    expect(params?.[0]).toBe("hh-1");
    expect(params?.[2]).toBeNull();
  });

  it("passes the window bounds and skips snapshots without an ambient temperature", async () => {
    run.mockResolvedValue([
      { recorded_at: "2026-10-02T00:00:00.000Z", ambient_temp_f: 70 },
      { recorded_at: "2026-10-01T00:00:00.000Z", ambient_temp_f: null },
    ]);

    const points = await fetchThermostatSnapshotChartPoints("hh-1", 30, {
      from: "2026-09-30T00:00:00.000Z",
      to: "2026-10-03T00:00:00.000Z",
    });

    expect(points.map((p) => [p.timestamp, p.tempf])).toEqual([["2026-10-02T00:00:00.000Z", 70]]);
    expect(run.mock.calls[0]![1]).toEqual(["hh-1", "2026-09-30T00:00:00.000Z", "2026-10-03T00:00:00.000Z"]);
  });

  it("returns no points (and logs) when the query fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    run.mockRejectedValue(new Error("connection error"));

    expect(await fetchThermostatSnapshotChartPoints("hh-1", 30)).toEqual([]);
    expect(error).toHaveBeenCalled();
  });
});
