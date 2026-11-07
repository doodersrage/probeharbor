import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReadDoorSessions = vi.fn();
vi.mock("./doorEvents", () => ({
  readDoorSessions: (...a: unknown[]) => mockReadDoorSessions(...a),
}));

const mockDoorBandsOverlapping = vi.fn();
vi.mock("./db/doors", () => ({
  doorBandsOverlapping: (...a: unknown[]) => mockDoorBandsOverlapping(...a),
}));

import { fetchChartDoorBands } from "./chartDoorBands.server";

const ms = (iso: string) => Date.parse(iso);

describe("fetchChartDoorBands", () => {
  const NOW = ms("2026-10-29T12:00:00Z");
  const sensors = [{ id: "door-1", label: "Garage door" }];

  beforeEach(() => {
    mockReadDoorSessions.mockReset().mockResolvedValue([]);
    mockDoorBandsOverlapping.mockReset().mockResolvedValue([]);
  });

  it("asks for saved sessions overlapping the window, oldest first in the result", async () => {
    mockDoorBandsOverlapping.mockResolvedValue([
      { label: "Garage door", opened_at: "2026-10-29T09:00:00Z", closed_at: "2026-10-29T09:10:00Z" },
      { label: "Garage door", opened_at: "2026-10-28T09:00:00Z", closed_at: "2026-10-28T09:10:00Z" },
    ]);

    const result = await fetchChartDoorBands(
      "hh-1",
      "2026-10-22T12:00:00.000Z",
      "2026-10-29T12:00:00.000Z",
      sensors,
      NOW,
    );

    expect(mockDoorBandsOverlapping).toHaveBeenCalledWith(
      "hh-1",
      "2026-10-22T12:00:00.000Z",
      "2026-10-29T12:00:00.000Z",
      1000,
    );
    expect(result.error).toBeNull();
    expect(result.bands.map((b) => b.openedAt)).toEqual(["2026-10-28T09:00:00Z", "2026-10-29T09:00:00Z"]);
  });

  it("adds a door that is open now (with its true start) from recent readings", async () => {
    mockReadDoorSessions.mockResolvedValue([
      { label: "Garage door", openedAt: "2026-10-29T08:00:00Z", closedAt: "2026-10-29T08:05:00Z", durationMs: 300000, stillOpen: false },
      { label: "Garage door", openedAt: "2026-10-26T11:30:00Z", closedAt: null, durationMs: null, stillOpen: true },
    ]);

    const result = await fetchChartDoorBands("hh-1", "2026-10-22T12:00:00Z", "2026-10-29T12:00:00Z", sensors, NOW);

    expect(mockReadDoorSessions).toHaveBeenCalledWith(sensors[0], "2026-10-28T12:00:00.000Z");
    expect(result.bands).toEqual([{ label: "Garage door", openedAt: "2026-10-26T11:30:00Z", closedAt: null }]);
  });

  it("skips the open-now lookup for a window that ended more than a day ago", async () => {
    await fetchChartDoorBands("hh-1", "2026-09-01T00:00:00Z", "2026-09-08T00:00:00Z", sensors, NOW);
    expect(mockReadDoorSessions).not.toHaveBeenCalled();
  });

  it("returns the error instead of an empty-looking success when the query fails", async () => {
    mockDoorBandsOverlapping.mockRejectedValue(new Error("db down"));

    const result = await fetchChartDoorBands("hh-1", "2026-10-22T12:00:00Z", "2026-10-29T12:00:00Z", sensors, NOW);

    expect(result).toEqual({ bands: [], error: "db down" });
    expect(mockReadDoorSessions).not.toHaveBeenCalled();
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
