import { describe, expect, it } from "vitest";
import { formatRelativeAge, freshnessThresholds } from "./relativeTime";
import { nextReportInterval, reportIntervalSeconds } from "./reportInterval";

const at = (minutes: number) => new Date(Date.UTC(2026, 0, 1, 0, minutes)).toISOString();

describe("learning a device's reporting interval", () => {
  it("records gaps and keeps the median", () => {
    let meta: Record<string, unknown> = {};
    for (const [prev, now] of [[0, 60], [60, 120], [120, 181], [181, 240]]) {
      const next = nextReportInterval(meta, at(prev), at(now));
      meta = { ...meta, ...next };
    }
    expect(reportIntervalSeconds(meta)).toBe(3600);
  });

  it("ignores retries, outages and a first post", () => {
    const learned = { report_intervals_s: [3600, 3600, 3600], report_interval_s: 3600 };
    expect(nextReportInterval(learned, null, at(60))).toBeNull(); // no previous post
    expect(nextReportInterval(learned, at(0), new Date(Date.UTC(2026, 0, 1, 0, 0, 5)).toISOString())).toBeNull(); // 5 s retry
    expect(nextReportInterval(learned, at(0), at(5 * 60))).toBeNull(); // 5 h outage (> 4× hourly)
  });

  it("stops writing once a steady device is learned, but notices a new cadence", () => {
    const steady = { report_intervals_s: Array(9).fill(600), report_interval_s: 600 };
    expect(nextReportInterval(steady, at(0), at(10))).toBeNull();
    expect(nextReportInterval(steady, at(0), at(2))?.report_intervals_s.at(-1)).toBe(120);
  });
});

describe("freshness thresholds", () => {
  it("keep 30 min / 2 h for fast or unknown devices", () => {
    expect(freshnessThresholds(null)).toEqual({ lagMs: 30 * 60_000, staleMs: 2 * 3600_000 });
    expect(freshnessThresholds(60_000)).toEqual({ lagMs: 30 * 60_000, staleMs: 2 * 3600_000 });
  });

  it("give an hourly device 3 missed reports before 'may be offline'", () => {
    expect(freshnessThresholds(3600_000)).toEqual({ lagMs: 3 * 3600_000, staleMs: 6 * 3600_000 });
  });

  it("an hourly device isn't called offline 90 minutes after its last post", () => {
    const ninetyMinAgo = new Date(Date.now() - 90 * 60_000).toISOString();
    expect(formatRelativeAge(ninetyMinAgo).lagging).toBe(true); // fixed thresholds: "may be offline"
    expect(formatRelativeAge(ninetyMinAgo, "never", "en", 3600_000).lagging).toBe(false);
  });
});
