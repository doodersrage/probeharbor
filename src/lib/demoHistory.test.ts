import { describe, expect, it } from "vitest";
import { buildDemoHistoryPoints, outdoorHistoryPoints, parseOpenMeteoDemoHourly } from "./demoHistory";

describe("parseOpenMeteoDemoHourly", () => {
  const payload = {
    utc_offset_seconds: -4 * 3600,
    hourly: {
      time: ["2026-09-27T12:00", "2026-09-27T13:00", "2026-09-29T12:00"],
      temperature_2m: [60, 62, 70],
      cloud_cover: [10, null, 50],
    },
  };

  it("converts local wall time to UTC and keeps the local hour", () => {
    const rows = parseOpenMeteoDemoHourly(payload, Date.parse("2026-09-28T12:00:00Z"));
    expect(rows).toHaveLength(2);
    expect(new Date(rows[0]!.atMs).toISOString()).toBe("2026-09-27T16:00:00.000Z");
    expect(rows[0]!.localHour).toBe(12);
  });

  it("drops forecast hours and defaults missing cloud cover", () => {
    const rows = parseOpenMeteoDemoHourly(payload, Date.parse("2026-09-28T12:00:00Z"));
    expect(rows.every((r) => r.atMs <= Date.parse("2026-09-28T12:00:00Z"))).toBe(true);
    expect(rows[1]!.cloudCover).toBe(40);
  });

  it("returns nothing for junk", () => {
    expect(parseOpenMeteoDemoHourly(null)).toEqual([]);
    expect(parseOpenMeteoDemoHourly({ hourly: {} })).toEqual([]);
  });
});

describe("buildDemoHistoryPoints", () => {
  const hourly = [
    { atMs: Date.parse("2026-09-27T08:00:00Z"), localHour: 4, tempf: 40, cloudCover: 0 },
    { atMs: Date.parse("2026-09-27T17:00:00Z"), localHour: 13, tempf: 40, cloudCover: 0 },
  ];

  it("emits one point per probe per hour", () => {
    const points = buildDemoHistoryPoints(hourly);
    expect(points).toHaveLength(6);
    expect(new Set(points.map((p) => p.probeLabel)).size).toBe(3);
  });

  it("warms the shop at midday in the location's own time", () => {
    const points = buildDemoHistoryPoints(hourly);
    const night = points.filter((p) => p.timestamp.startsWith("2026-09-27T08"));
    const noon = points.filter((p) => p.timestamp.startsWith("2026-09-27T17"));
    const max = (ps: typeof points) => Math.max(...ps.map((p) => p.tempf));
    expect(max(noon)).toBeGreaterThan(max(night));
  });

  it("labels the outdoor series", () => {
    expect(outdoorHistoryPoints(hourly)[0]).toMatchObject({ probeLabel: "Outdoor", tempf: 40 });
  });
});
