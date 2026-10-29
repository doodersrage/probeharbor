import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchRecentBoolReadings = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchRecentBoolReadings: (...a: unknown[]) => mockFetchRecentBoolReadings(...a),
}));

const mockQueryResult = vi.fn();
const queryCalls: Array<[string, unknown[]]> = [];
vi.mock("./supabase", () => ({
  createServerClient: () => {
    const builder: Record<string, unknown> = {};
    for (const method of ["from", "select", "eq", "lte", "gte", "order"]) {
      builder[method] = (...args: unknown[]) => {
        queryCalls.push([method, args]);
        return builder;
      };
    }
    builder.limit = (...args: unknown[]) => {
      queryCalls.push(["limit", args]);
      return mockQueryResult();
    };
    return builder;
  },
}));

import { fetchChartDoorBands } from "./chartDoorBands.server";

const ms = (iso: string) => Date.parse(iso);

describe("fetchChartDoorBands", () => {
  const NOW = ms("2026-10-29T12:00:00Z");
  const sensors = [{ id: "door-1", label: "Garage door" }];

  beforeEach(() => {
    queryCalls.length = 0;
    mockFetchRecentBoolReadings.mockReset().mockResolvedValue([]);
    mockQueryResult.mockReset().mockResolvedValue({ data: [], error: null });
  });

  it("asks for saved sessions overlapping the window, oldest first in the result", async () => {
    mockQueryResult.mockResolvedValue({
      data: [
        { label: "Garage door", opened_at: "2026-10-29T09:00:00Z", closed_at: "2026-10-29T09:10:00Z" },
        { label: "Garage door", opened_at: "2026-10-28T09:00:00Z", closed_at: "2026-10-28T09:10:00Z" },
      ],
      error: null,
    });

    const result = await fetchChartDoorBands(
      "hh-1",
      "2026-10-22T12:00:00.000Z",
      "2026-10-29T12:00:00.000Z",
      sensors,
      NOW,
    );

    expect(queryCalls).toEqual(
      expect.arrayContaining([
        ["from", ["door_open_events"]],
        ["eq", ["household_id", "hh-1"]],
        ["lte", ["opened_at", "2026-10-29T12:00:00.000Z"]],
        ["gte", ["closed_at", "2026-10-22T12:00:00.000Z"]],
      ]),
    );
    expect(result.error).toBeNull();
    expect(result.bands.map((b) => b.openedAt)).toEqual(["2026-10-28T09:00:00Z", "2026-10-29T09:00:00Z"]);
  });

  it("adds a door that is open now from recent readings", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-29T08:00:00Z" },
      { value: false, recordedAt: "2026-10-29T08:05:00Z" },
      { value: true, recordedAt: "2026-10-29T11:30:00Z" },
    ]);

    const result = await fetchChartDoorBands("hh-1", "2026-10-22T12:00:00Z", "2026-10-29T12:00:00Z", sensors, NOW);

    expect(mockFetchRecentBoolReadings).toHaveBeenCalledWith("door-1", "2026-10-28T12:00:00.000Z");
    expect(result.bands).toEqual([{ label: "Garage door", openedAt: "2026-10-29T11:30:00Z", closedAt: null }]);
  });

  it("skips the open-now lookup for a window that ended more than a day ago", async () => {
    await fetchChartDoorBands("hh-1", "2026-09-01T00:00:00Z", "2026-09-08T00:00:00Z", sensors, NOW);
    expect(mockFetchRecentBoolReadings).not.toHaveBeenCalled();
  });

  it("returns the error instead of an empty-looking success when the query fails", async () => {
    mockQueryResult.mockResolvedValue({ data: null, error: { message: "db down" } });

    const result = await fetchChartDoorBands("hh-1", "2026-10-22T12:00:00Z", "2026-10-29T12:00:00Z", sensors, NOW);

    expect(result).toEqual({ bands: [], error: "db down" });
    expect(mockFetchRecentBoolReadings).not.toHaveBeenCalled();
  });
});

describe("browser safety", () => {
  it("keeps server code out of chartDoorBands.ts, which the chart island imports", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(new URL("./chartDoorBands.ts", import.meta.url), "utf8");
    const imports = [...source.matchAll(/^import\s+(type\s+)?[^;]*from\s+"([^"]+)"/gm)]
      .filter((m) => !m[1])
      .map((m) => m[2]);
    expect(imports).toEqual([]);
  });
});
