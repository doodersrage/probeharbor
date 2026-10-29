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

import {
  clipDoorBands,
  doorBandsAt,
  fetchChartDoorBands,
  summarizeDoorBands,
  toDoorStates,
  type ChartDoorBand,
} from "./chartDoorBands";

const ms = (iso: string) => Date.parse(iso);

const bands: ChartDoorBand[] = [
  { label: "Garage door", openedAt: "2026-10-28T08:00:00Z", closedAt: "2026-10-28T08:30:00Z" },
  { label: "Shop door", openedAt: "2026-10-28T23:00:00Z", closedAt: "2026-10-29T01:00:00Z" },
  { label: "Garage door", openedAt: "2026-10-29T11:00:00Z", closedAt: null },
];

describe("door band helpers", () => {
  it("clips bands to the window and runs an open band to the window end", () => {
    expect(clipDoorBands(bands, ms("2026-10-29T00:00:00Z"), ms("2026-10-29T12:00:00Z"))).toEqual([
      { label: "Shop door", startMs: ms("2026-10-29T00:00:00Z"), endMs: ms("2026-10-29T01:00:00Z") },
      { label: "Garage door", startMs: ms("2026-10-29T11:00:00Z"), endMs: ms("2026-10-29T12:00:00Z") },
    ]);
  });

  it("drops bands entirely outside the window", () => {
    expect(clipDoorBands(bands, ms("2026-10-28T09:00:00Z"), ms("2026-10-28T22:00:00Z"))).toEqual([]);
  });

  it("finds the bands covering an instant, including their edges", () => {
    expect(doorBandsAt(bands, ms("2026-10-28T08:30:00Z")).map((b) => b.label)).toEqual(["Garage door"]);
    expect(doorBandsAt(bands, ms("2026-10-28T12:00:00Z"))).toEqual([]);
    expect(doorBandsAt(bands, ms("2026-10-30T00:00:00Z"))[0]?.closedAt).toBeNull();
  });

  it("counts periods in the window and lists each door once", () => {
    expect(summarizeDoorBands(bands, ms("2026-10-28T00:00:00Z"), ms("2026-10-29T12:00:00Z"))).toEqual({
      count: 3,
      labels: ["Garage door", "Shop door"],
    });
  });

  it("maps bands to open periods for anomaly notes", () => {
    expect(toDoorStates(bands.slice(2))).toEqual([
      { label: "Garage door", open: true, recordedAt: "2026-10-29T11:00:00Z", until: null },
    ]);
  });
});

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
