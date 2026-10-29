import { describe, expect, it } from "vitest";
import { findGaps, findSharedGaps, gapThresholdMs, MIN_GAP_MS } from "./chartGaps";

const min = 60 * 1000;
const every = (startMin: number, endMin: number, stepMin: number) =>
  Array.from({ length: Math.floor((endMin - startMin) / stepMin) + 1 }, (_, i) => (startMin + i * stepMin) * min);

describe("chart gaps", () => {
  it("scales the threshold to the reporting cadence, with a floor", () => {
    expect(gapThresholdMs(every(0, 60, 5))).toBe(MIN_GAP_MS);
    expect(gapThresholdMs(every(0, 600, 60))).toBe(240 * min);
  });

  it("finds a stretch with no readings", () => {
    const series = [...every(0, 60, 5), ...every(300, 360, 5)];
    expect(findGaps(series)).toEqual([{ startMs: 60 * min, endMs: 300 * min }]);
  });

  it("doesn't call normal hourly rollups a gap", () => {
    expect(findGaps(every(0, 1440, 60))).toEqual([]);
  });

  it("only shades time when every series was silent", () => {
    const a = [...every(0, 60, 5), ...every(300, 360, 5)];
    const b = [...every(0, 120, 5), ...every(240, 360, 5)];
    expect(findSharedGaps([a, b])).toEqual([{ startMs: 120 * min, endMs: 240 * min }]);
    expect(findSharedGaps([a, every(0, 360, 5)])).toEqual([]);
  });
});

describe("segmentStarts", () => {
  const min = 60 * 1000;
  it("starts a new segment after a gap and joins steady readings", async () => {
    const { segmentStarts } = await import("./chartGaps");
    // Every 10 minutes, then a 6-hour outage, then every 10 minutes again.
    const ms = [0, 10, 20, 30, 390, 400, 410].map((m) => m * min);
    expect(segmentStarts(ms)).toEqual([true, false, false, false, true, false, false]);
  });

  it("never breaks an hourly series (slow but steady is not a gap)", async () => {
    const { segmentStarts } = await import("./chartGaps");
    const hourly = [0, 60, 120, 180, 240].map((m) => m * min);
    expect(segmentStarts(hourly)).toEqual([true, false, false, false, false]);
  });
});

describe("sampled data (first / lowest / highest per bucket)", () => {
  // 4.3 h buckets: each has points minutes apart at its start, plus one near its end.
  const bucket = 4.3 * 3600_000;
  const ms: number[] = [];
  for (let b = 0; b < 12; b += 1) {
    const start = Date.parse("2026-10-27T00:00:00Z") + b * bucket;
    ms.push(start, start + 60_000, start + bucket - 120_000);
  }

  it("calls every bucket boundary a gap without the bucket width (the old bug)", () => {
    expect(findGaps(ms, gapThresholdMs(ms)).length).toBeGreaterThan(5);
  });

  it("sees no gaps when told the bucket width", () => {
    expect(findGaps(ms, gapThresholdMs(ms, bucket))).toEqual([]);
    expect(findSharedGaps([ms, ms], bucket)).toEqual([]);
  });

  it("still finds a real gap: buckets with no data", () => {
    const withHole = ms.filter((t) => t < ms[12]! || t >= ms[24]!); // drop buckets 4-7
    expect(findGaps(withHole, gapThresholdMs(withHole, bucket))).toHaveLength(1);
  });
});
