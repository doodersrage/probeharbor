/**
 * The runway (time-to-freeze) alert reads its week of indoor readings in
 * 10-minute buckets instead of every reading (getRecentNumericReadingBuckets:
 * ~1,000 rows instead of ~10,000 per pass). This checks the projection comes
 * out the same either way, on a synthetic week of one-a-minute readings,
 * with buckets built exactly like the SQL (average value at the average time).
 */
import { describe, expect, it } from "vitest";
import { buildTimeToFreezeProjection, type OutdoorHourlyPoint } from "./spaceThermalModel";
import type { TempSample } from "./timeToFreeze";

const HOUR = 3_600_000;
const NOW = Date.parse("2026-11-13T18:00:00.000Z");

/** Outdoor air: a daily swing around 38°F in the past week, then dropping to 18°F. */
function outdoor(): { past: OutdoorHourlyPoint[]; forecast: OutdoorHourlyPoint[] } {
  const past: OutdoorHourlyPoint[] = [];
  for (let h = -7 * 24; h <= 0; h += 1) {
    past.push({ atMs: NOW + h * HOUR, tempF: 38 + 8 * Math.sin((2 * Math.PI * h) / 24) });
  }
  const forecast: OutdoorHourlyPoint[] = [];
  for (let h = 1; h <= 48; h += 1) forecast.push({ atMs: NOW + h * HOUR, tempF: Math.max(18, 38 - h) });
  return { past, forecast };
}

/** An unheated space: Newton cooling toward outdoor + 9°F, one reading a minute. */
function indoorWeek(past: OutdoorHourlyPoint[], gap?: { fromH: number; toH: number }): TempSample[] {
  const samples: TempSample[] = [];
  let temp = 47;
  for (let m = -7 * 24 * 60; m <= 0; m += 1) {
    const atMs = NOW + m * 60_000;
    const hourIdx = Math.min(past.length - 1, Math.max(0, Math.floor((atMs - past[0]!.atMs) / HOUR)));
    temp += (past[hourIdx]!.tempF + 9 - temp) * (1 - Math.exp(-0.3 / 60));
    if (gap && m / 60 >= gap.fromH && m / 60 < gap.toH) continue; // probe offline
    samples.push({ at: new Date(atMs).toISOString(), tempF: Math.round(temp * 100) / 100 });
  }
  return samples;
}

/** What getNumericReadingBuckets returns: avg value at avg time per 10-minute bucket. */
function bucket(samples: TempSample[], seconds = 600): TempSample[] {
  const groups = new Map<number, { sumT: number; sumMs: number; n: number }>();
  for (const s of samples) {
    const ms = Date.parse(s.at);
    const key = Math.floor(ms / 1000 / seconds);
    const g = groups.get(key) ?? { sumT: 0, sumMs: 0, n: 0 };
    g.sumT += s.tempF;
    g.sumMs += ms;
    g.n += 1;
    groups.set(key, g);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, g]) => ({ at: new Date(g.sumMs / g.n).toISOString(), tempF: g.sumT / g.n }));
}

function compare(gap?: { fromH: number; toH: number }) {
  const { past, forecast } = outdoor();
  const raw = indoorWeek(past, gap);
  const bucketed = bucket(raw);
  const common = {
    currentTempF: raw.at(-1)!.tempF,
    freezeThresholdF: 34,
    outdoorPast: past,
    outdoorForecast: forecast,
    nowMs: NOW,
    lookAheadHours: 48,
  };
  return {
    rawCount: raw.length,
    bucketCount: bucketed.length,
    a: buildTimeToFreezeProjection({ ...common, indoorSamples: raw }),
    b: buildTimeToFreezeProjection({ ...common, indoorSamples: bucketed }),
  };
}

describe("runway projection: every reading vs 10-minute buckets", () => {
  it("gives the same projection from a tenth of the rows", () => {
    const { rawCount, bucketCount, a, b } = compare();
    expect(rawCount).toBeGreaterThan(10_000);
    expect(bucketCount).toBeLessThan(1_100);

    expect(b.source).toBe(a.source);
    expect(b.confidence).toBe(a.confidence);
    expect(b.params?.fittedCoupling).toBe(a.params?.fittedCoupling);
    expect(b.params?.couplingPerHour).toBeCloseTo(a.params?.couplingPerHour ?? 0, 2);
    expect(Math.abs((b.params?.offsetF ?? 0) - (a.params?.offsetF ?? 0))).toBeLessThan(0.1);
    expect(a.hours).not.toBeNull();
    expect(Math.abs((b.hours ?? 0) - (a.hours ?? 0))).toBeLessThan(0.25);
  });

  it("still learns the cooling rate across an outage gap", () => {
    const { a, b } = compare({ fromH: -60, toH: -54 });
    expect(b.source).toBe(a.source);
    expect(b.confidence).toBe(a.confidence);
    expect(b.params?.fittedCoupling).toBe(a.params?.fittedCoupling);
    expect(Math.abs((b.params?.couplingPerHour ?? 0) - (a.params?.couplingPerHour ?? 0))).toBeLessThan(0.02);
    expect(Math.abs((b.hours ?? 0) - (a.hours ?? 0))).toBeLessThan(0.25);
  });
});
