import { describe, expect, it } from "vitest";
import { buildGarageTempsCsv, type ChartPoint, type GarageTempReading } from "./garageTempsHistory";
import { averageHumidity, wettestPoint } from "./humidityStats";
import { buildMonthlyReportPlainText, summarizeProbesForReport } from "./monthlyReportHtml";
import { summarizeSeasonal } from "./seasonalInsights";

// History must show a missing value as missing (blank / "—"), never as 0°F or
// 0%. Temperature-only probes used to report "0%" average humidity and
// humidity-only probes appeared as 0°F rows.

const point = (tempf: number, humidity: number | null, probeLabel = "Garage"): ChartPoint => ({
  timestamp: "2026-01-01T12:00:00Z",
  tempf,
  humidity,
  probeLabel,
});

describe("humidity helpers", () => {
  it("average only real humidity values", () => {
    expect(averageHumidity([point(40, 50), point(41, null), point(42, 70)])).toBe(60);
    expect(averageHumidity([point(40, null)])).toBeNull();
  });

  it("pick the most humid point that has humidity", () => {
    expect(wettestPoint([point(40, null), point(41, 30), point(42, 55)])?.humidity).toBe(55);
    expect(wettestPoint([point(40, null)])).toBeNull();
  });
});

describe("CSV export", () => {
  it("leaves unmeasured values empty instead of writing 0.0", () => {
    const rows: GarageTempReading[] = [
      { tempc: 4.4, tempf: 40, humidity: null, timestamp: "2026-01-01T12:00:00Z", feed_name: "Pi", probe_key: "t1" },
      { tempc: null, tempf: null, humidity: 55, timestamp: "2026-01-01T12:00:00Z", feed_name: "Pi", probe_key: "h1" },
    ];
    const [, tempOnly, humidityOnly] = buildGarageTempsCsv(rows).split("\n");
    expect(tempOnly?.endsWith(",40.0,4.4,")).toBe(true);
    expect(humidityOnly?.endsWith(",,,55.0")).toBe(true);
  });
});

describe("reports and insights", () => {
  it("report a temperature-only probe's humidity as unknown, not 0%", () => {
    const [summary] = summarizeProbesForReport([point(40, null), point(42, null)]);
    expect(summary?.avgHumidity).toBeNull();
    const text = buildMonthlyReportPlainText({
      monthLabel: "January 2026",
      periodDays: 30,
      reportKind: "monthly",
      readingCount: 2,
      minTempF: 40,
      maxTempF: 42,
      avgTempF: 41,
      freezeThresholdF: 34,
      nightsAtRisk: 0,
      nights: [],
      freezeHours: { hoursBelow34: 0, degreeHoursBelow: 0, readingsBelow34: 0, totalReadings: 2, coldestF: 40 },
      probes: [summary!],
      alertsUrl: "https://example.com/a",
      historyUrl: "https://example.com/h",
    });
    expect(text).toContain("—");
    expect(text).not.toMatch(/(^|[^0-9])0%/);
  });

  it("skip the humidity insight when nothing measured humidity", () => {
    const titles = summarizeSeasonal([point(40, null), point(30, null)], 7).map((i) => i.title.toLowerCase());
    expect(titles.some((title) => title.includes("humid"))).toBe(false);
  });
});
