import { describe, expect, it } from "vitest";
import { pickHumiditySource } from "./chartHumidity";

const p = (probeLabel: string, timestamp: string, humidity: number | null) => ({ probeLabel, timestamp, humidity });

// "Old DHT" was taken down on the 25th; "Bay" still reports humidity.
const points = [
  p("Old DHT", "2026-10-22T00:00:00Z", 60),
  p("Old DHT", "2026-10-25T00:00:00Z", 62),
  p("Bay", "2026-10-28T00:00:00Z", 55),
  p("Bay", "2026-10-29T12:00:00Z", 57),
  p("Rafters", "2026-10-29T12:00:00Z", null),
  p("Rafters", "2026-10-29T12:15:00Z", null),
];

describe("pickHumiditySource", () => {
  it("prefers the probe with the most recent humidity, not the first one seen", () => {
    expect(pickHumiditySource(points, new Set(["Old DHT", "Bay", "Rafters"]))).toBe("Bay");
  });

  it("skips hidden probes while a visible one has humidity", () => {
    expect(pickHumiditySource(points, new Set(["Old DHT", "Rafters"]))).toBe("Old DHT");
  });

  it("falls back to a hidden probe when no visible probe has humidity", () => {
    expect(pickHumiditySource(points, new Set(["Rafters"]))).toBe("Bay");
  });

  it("breaks ties on latest time by number of readings", () => {
    const tie = [
      p("A", "2026-10-29T10:00:00Z", 50),
      p("A", "2026-10-29T12:00:00Z", 50),
      p("B", "2026-10-29T08:00:00Z", 50),
      p("B", "2026-10-29T10:00:00Z", 50),
      p("B", "2026-10-29T12:00:00Z", 50),
    ];
    expect(pickHumiditySource(tie, new Set(["A", "B"]))).toBe("B");
  });

  it("returns null when no probe has two humidity readings (0 and missing don't count)", () => {
    expect(pickHumiditySource([p("A", "2026-10-29T10:00:00Z", 0), p("A", "2026-10-29T11:00:00Z", 50)], new Set(["A"]))).toBeNull();
    expect(pickHumiditySource([], new Set())).toBeNull();
  });
});
