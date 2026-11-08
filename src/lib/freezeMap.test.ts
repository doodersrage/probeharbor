import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FreezeMapSnapshot } from "./freezeMap";

const recentSnapshots = vi.fn();
vi.mock("./db/places", () => ({
  recentSnapshots: (...args: unknown[]) => recentSnapshots(...args),
}));

import {
  listFreezeMapSparklines,
  listLatestFreezeMapSnapshots,
  redactBelowFloorSnapshot,
} from "./freezeMap";
import { FREEZE_MAP_SAMPLE_FLOOR, resolveFreezeMapDisplay } from "./freezeMapSeed";

function snap(overrides: Partial<FreezeMapSnapshot>): FreezeMapSnapshot {
  return {
    city_id: "5128581",
    city_label: "New York, NY",
    sample_count: 3,
    avg_temp_f: 40,
    min_temp_f: 36,
    freeze_risk_count: 1,
    captured_at: "2026-11-07T12:00:00.000Z",
    lat: 40.71,
    lon: -74.01,
    ...overrides,
  };
}

// Distinctive values so a leak shows up in a serialized payload.
const LONE_AVG = 27.123;
const LONE_MIN = 21.987;

beforeEach(() => {
  recentSnapshots.mockReset();
});

describe("redactBelowFloorSnapshot", () => {
  it("leaves a city at the floor untouched", () => {
    const row = snap({ sample_count: FREEZE_MAP_SAMPLE_FLOOR });
    expect(redactBelowFloorSnapshot(row)).toBe(row);
  });

  it("strips temperatures, risk count and coordinates below the floor", () => {
    const row = snap({
      sample_count: FREEZE_MAP_SAMPLE_FLOOR - 1,
      avg_temp_f: LONE_AVG,
      min_temp_f: LONE_MIN,
      freeze_risk_count: 2,
    });
    expect(redactBelowFloorSnapshot(row)).toEqual({
      ...row,
      avg_temp_f: null,
      min_temp_f: null,
      freeze_risk_count: 0,
      lat: null,
      lon: null,
      belowFloor: true,
    });
  });
});

describe("listLatestFreezeMapSnapshots", () => {
  it("returns no reading-derived figure for a city below the floor", async () => {
    recentSnapshots.mockResolvedValue([
      snap({ city_id: "a", city_label: "Busy", sample_count: 5, avg_temp_f: 50, min_temp_f: 45 }),
      snap({
        city_id: "geo:44.48,-73.21",
        city_label: "Lone",
        sample_count: 1,
        avg_temp_f: LONE_AVG,
        min_temp_f: LONE_MIN,
        freeze_risk_count: 1,
        lat: 44.4801,
        lon: -73.2102,
      }),
      // An older batch is ignored entirely.
      snap({ city_id: "old", sample_count: 1, captured_at: "2026-11-07T11:00:00.000Z" }),
    ]);

    const rows = await listLatestFreezeMapSnapshots();
    expect(rows.map((r) => r.city_id)).toEqual(["a", "geo:44.48,-73.21"]);
    const lone = rows[1]!;
    expect(lone).toMatchObject({
      // A custom location's name is one household's own text: withheld.
      city_label: "",
      sample_count: 1,
      avg_temp_f: null,
      min_temp_f: null,
      freeze_risk_count: 0,
      lat: null,
      lon: null,
      belowFloor: true,
    });
    const json = JSON.stringify(rows);
    expect(json).not.toContain(String(LONE_AVG));
    expect(json).not.toContain(String(LONE_MIN));
    expect(json).not.toContain("44.4801");
    expect(json).not.toContain("Lone");
    // The listed city keeps its numbers as before.
    expect(rows[0]).toMatchObject({ avg_temp_f: 50, min_temp_f: 45, freeze_risk_count: 1 });
  });

  it("orders below-floor cities by label, not by their hidden temperature", async () => {
    recentSnapshots.mockResolvedValue([
      snap({ city_id: "4887398", city_label: "Our cabin", sample_count: 1, avg_temp_f: 10 }),
      snap({ city_id: "5368361", city_label: "Smith garage", sample_count: 2, avg_temp_f: 60 }),
      snap({ city_id: "m", city_label: "Mid", sample_count: 4, avg_temp_f: 70 }),
    ]);
    const rows = await listLatestFreezeMapSnapshots();
    // Below the floor a preset city shows its standard name, never the
    // household's own label.
    expect(rows.map((r) => r.city_label)).toEqual(["Mid", "Chicago, IL", "Los Angeles, CA"]);
  });

  it("feeds the page's momentum list names and counts only", async () => {
    recentSnapshots.mockResolvedValue([
      snap({ city_id: "a", sample_count: 4 }),
      snap({ city_id: "4887398", city_label: "Lone", sample_count: 1, avg_temp_f: LONE_AVG, min_temp_f: LONE_MIN }),
      snap({ city_id: "geo:44.48,-73.21", city_label: "Our farm", sample_count: 2 }),
    ]);
    const resolved = resolveFreezeMapDisplay(await listLatestFreezeMapSnapshots(), new Map());
    expect(resolved.isSeed).toBe(false);
    expect(resolved.approaching).toHaveLength(1);
    expect(resolved.approaching[0]).toMatchObject({ city_label: "Chicago, IL", avg_temp_f: null, min_temp_f: null });
    expect(JSON.stringify(resolved.approaching)).not.toContain("Our farm");
    // The page's listed rows (same filter as freeze-map.astro) exclude it.
    const visible = resolved.snapshots.filter(
      (row) => !row.belowFloor && row.sample_count >= FREEZE_MAP_SAMPLE_FLOOR,
    );
    expect(visible.map((r) => r.city_id)).toEqual(["a"]);
  });

  it("falls back to seed data (with live sparse cities redacted) when nothing meets the floor", async () => {
    recentSnapshots.mockResolvedValue([
      snap({ city_id: "b", city_label: "Lone", sample_count: 2, avg_temp_f: LONE_AVG, min_temp_f: LONE_MIN }),
    ]);
    const resolved = resolveFreezeMapDisplay(await listLatestFreezeMapSnapshots(), new Map());
    expect(resolved.isSeed).toBe(true);
    expect(JSON.stringify(resolved)).not.toContain(String(LONE_AVG));
    expect(JSON.stringify(resolved)).not.toContain(String(LONE_MIN));
  });
});

describe("listFreezeMapSparklines", () => {
  it("skips snapshots taken while the city was below the floor", async () => {
    // Newest first, as the query returns them.
    recentSnapshots.mockResolvedValue([
      snap({ city_id: "a", sample_count: 3, avg_temp_f: 41, captured_at: "2026-11-07T12:00:00.000Z" }),
      snap({ city_id: "a", sample_count: 2, avg_temp_f: LONE_AVG, captured_at: "2026-11-07T11:00:00.000Z" }),
      snap({ city_id: "a", sample_count: 4, avg_temp_f: 43, captured_at: "2026-11-07T10:00:00.000Z" }),
      snap({ city_id: "a", sample_count: 1, avg_temp_f: LONE_MIN, captured_at: "2026-11-07T09:00:00.000Z" }),
      snap({ city_id: "lone", sample_count: 1, avg_temp_f: 30, captured_at: "2026-11-07T12:00:00.000Z" }),
    ]);
    const map = await listFreezeMapSparklines(7);
    expect(map.get("a")).toEqual([43, 41]);
    expect(map.has("lone")).toBe(false);
  });

  it("still caps points per city after skipping", async () => {
    recentSnapshots.mockResolvedValue([
      snap({ sample_count: 1, avg_temp_f: 1 }),
      snap({ sample_count: 3, avg_temp_f: 2 }),
      snap({ sample_count: 3, avg_temp_f: 3 }),
      snap({ sample_count: 3, avg_temp_f: 4 }),
    ]);
    const map = await listFreezeMapSparklines(2);
    expect(map.get("5128581")).toEqual([3, 2]);
  });
});
