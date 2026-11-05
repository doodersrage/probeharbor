import { describe, expect, it } from "vitest";
import { compareProbeAverages, compareSpaceAverages, compareYearOverYear, summarizeSeasonal } from "./seasonalInsights";

describe("space averages", () => {
  it("compares two spaces", () => {
    const map = new Map([
      ["Probe A", "garage"],
      ["Probe B", "attic"],
    ]);
    const lines = compareSpaceAverages(
      [
        { timestamp: "t", tempf: 40, humidity: 50, probeLabel: "Probe A" },
        { timestamp: "t", tempf: 55, humidity: 50, probeLabel: "Probe B" },
      ],
      map,
    );
    expect(lines[0]).toContain("attic");
  });

  it("reads differences ×5/9 for °C users and keeps °F wording otherwise", () => {
    const map = new Map([
      ["Probe A", "garage"],
      ["Probe B", "attic"],
    ]);
    const points = [
      { timestamp: "t", tempf: 40, humidity: 50, probeLabel: "Probe A" },
      { timestamp: "t", tempf: 58, humidity: 50, probeLabel: "Probe B" },
    ];
    expect(compareSpaceAverages(points, map)[0]).toBe("attic averages 18.0°F warmer than garage in this window.");
    expect(compareSpaceAverages(points, map, "en", true)[0]).toBe(
      "attic averages 10.0°C warmer than garage in this window.",
    );
    expect(compareProbeAverages(points, "en", true)[0]).toBe(
      "Probe B averages 10.0°C warmer than Probe A in this window.",
    );
  });
});

describe("seasonal summary and year-over-year in the display unit", () => {
  const points = [
    { timestamp: "2026-01-01T10:00:00Z", tempf: 32, humidity: 50, probeLabel: "Bay" },
    { timestamp: "2026-01-01T11:00:00Z", tempf: 50, humidity: 60, probeLabel: "Bay" },
  ];

  it("keeps °F text unchanged by default", () => {
    const rows = summarizeSeasonal(points, 7);
    expect(rows[0]?.detail).toMatch(/^32\.0°F on /);
    expect(rows.at(-1)?.detail).toBe("41.0°F across 2 readings");
    const prior = [{ ...points[0]!, tempf: 36 }];
    expect(compareYearOverYear(points, prior)?.detail).toBe(
      "This window averages 41.0°F vs 36.0°F last year (+5.0°F).",
    );
  });

  it("reads temperatures with the offset and the change ×5/9 in °C", () => {
    const rows = summarizeSeasonal(points, 7, "en", true);
    expect(rows[0]?.detail).toMatch(/^0\.0°C on /);
    expect(rows[1]?.detail).toMatch(/^10\.0°C on /);
    expect(rows.at(-1)?.detail).toBe("5.0°C across 2 readings");
    const prior = [{ ...points[0]!, tempf: 36 }];
    expect(compareYearOverYear(points, prior, "en", true)?.detail).toBe(
      "This window averages 5.0°C vs 2.2°C last year (+2.8°C).",
    );
  });
});
