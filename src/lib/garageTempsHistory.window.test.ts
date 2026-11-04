import { afterEach, describe, expect, it } from "vitest";
import { rollingWindowStart } from "./garageTempsHistory";

const HOUR_MS = 60 * 60 * 1000;
const originalTz = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTz;
});

describe("rollingWindowStart", () => {
  it("is exactly 7 × 24 h even when the window crosses a DST change", () => {
    // US clocks fell back on 2026-11-01; local calendar math gave 169 h here.
    process.env.TZ = "America/New_York";
    const now = Date.parse("2026-11-04T20:00:00Z");
    const start = rollingWindowStart(7, now);
    expect(now - start.getTime()).toBe(168 * HOUR_MS);
    expect(start.toISOString()).toBe("2026-10-28T20:00:00.000Z");
  });

  it("is the same in UTC (what Workers run in)", () => {
    process.env.TZ = "UTC";
    const now = Date.parse("2026-11-04T20:00:00Z");
    expect(rollingWindowStart(30, now).toISOString()).toBe("2026-10-05T20:00:00.000Z");
  });
});
