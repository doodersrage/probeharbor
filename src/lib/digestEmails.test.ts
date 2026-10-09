import { describe, expect, it } from "vitest";
import {
  buildWeeklyDigestParts,
  summarizeAlertDelivery,
  formatDigestFreezeLine,
  formatWeeklyDigestSubject,
  summarizePointsByDay,
} from "./digestEmails";
import type { ChartPoint } from "./garageTempsHistory";

describe("summarizePointsByDay", () => {
  it("returns one line per UTC day with min–max and average", () => {
    const points: ChartPoint[] = [
      {
        timestamp: "2026-01-05T08:00:00Z",
        tempf: 40,
        humidity: 50,
        probeLabel: "Garage",
      },
      {
        timestamp: "2026-01-05T20:00:00Z",
        tempf: 50,
        humidity: 45,
        probeLabel: "Garage",
      },
      {
        timestamp: "2026-01-06T12:00:00Z",
        tempf: 32,
        humidity: 60,
        probeLabel: "Garage",
      },
    ];

    const lines = summarizePointsByDay(points);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^Mon, Jan 5: 40\.0–50\.0 °F \(avg 45\.0°\)$/);
    expect(lines[1]).toMatch(/^Tue, Jan 6: 32\.0–32\.0 °F \(avg 32\.0°\)$/);
  });

  it("notes the coldest probe when multiple probes share a day", () => {
    const points: ChartPoint[] = [
      {
        timestamp: "2026-01-05T08:00:00Z",
        tempf: 42,
        humidity: 50,
        probeLabel: "Garage",
      },
      {
        timestamp: "2026-01-05T09:00:00Z",
        tempf: 34,
        humidity: 55,
        probeLabel: "Pipe bay",
      },
    ];

    const lines = summarizePointsByDay(points);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("34.0–42.0 °F");
    expect(lines[0]).toContain("coldest Pipe bay");
  });

  it("returns empty for no points", () => {
    expect(summarizePointsByDay([])).toEqual([]);
  });
});

describe("weekly digest freeze + subject", () => {
  const points: ChartPoint[] = [
    {
      timestamp: "2026-01-05T08:00:00Z",
      tempf: 40,
      humidity: 50,
      probeLabel: "Garage",
    },
    {
      timestamp: "2026-01-06T04:00:00Z",
      tempf: 30,
      humidity: 55,
      probeLabel: "Garage",
    },
  ];

  it("summarizes freeze exposure against the user threshold", () => {
    expect(formatDigestFreezeLine(points, 34)).toContain("at or below 34°F");
    expect(formatDigestFreezeLine(points, 34)).toContain("30.0°F");
    expect(formatDigestFreezeLine(points, 20)).toBe(
      "Freeze exposure: none at or below 20°F",
    );
  });

  it("puts the coldest day in the subject line", () => {
    expect(formatWeeklyDigestSubject(points)).toMatch(
      /^Weekly digest — coldest Tue, Jan 6 30\.0°F$/,
    );
  });
});

describe("weekly digest layout", () => {
  const mixed: ChartPoint[] = [
    {
      timestamp: "2026-01-05T08:00:00Z",
      tempf: 40,
      humidity: 50,
      probeLabel: "Garage",
    },
    {
      timestamp: "2026-01-05T20:00:00Z",
      tempf: 50,
      humidity: 45,
      probeLabel: "Pipe bay",
    },
    {
      timestamp: "2026-01-06T04:00:00Z",
      tempf: 30,
      humidity: 55,
      probeLabel: "Garage",
    },
  ];

  it("builds HTML with sections, tables, and no catch-all bullet list", () => {
    const digest = buildWeeklyDigestParts({
      points: mixed,
      freezeThresholdF: 34,
      siteUrl: "https://probeharbor.dev",
    });

    expect(digest.html).toContain("Freeze exposure");
    expect(digest.html).toContain("Highlights");
    expect(digest.html).toContain("By probe");
    expect(digest.html).toContain("Day by day");
    expect(digest.html).toContain("<th");
    expect(digest.html).toContain("Garage");
    expect(digest.html).toContain("Pipe bay");
    expect(digest.html).toContain("30.0°F");
    expect(digest.html).not.toContain("<ul");
    expect(digest.html).not.toContain("• Freeze exposure");
    expect(digest.text).toContain("By probe");
    expect(digest.text).toContain("Day by day");
    expect(digest.text).not.toContain("• Day by day:");
    expect(digest.notifyBody).toContain("Freeze exposure");
    expect(digest.subject).toContain("30.0°F");
  });

  it("uses a success freeze callout when nothing crossed the threshold", () => {
    const digest = buildWeeklyDigestParts({
      points: mixed.filter((point) => point.tempf > 34),
      freezeThresholdF: 34,
      siteUrl: "https://probeharbor.dev",
    });
    expect(digest.html).toContain("None at or below 34°F");
    expect(digest.html).toContain("#22c55e");
  });
});

describe("alert delivery in the weekly digest", () => {
  const points = [
    { timestamp: "2026-01-05T08:00:00Z", tempf: 40, humidity: 50, probeLabel: "Garage" },
  ];

  it("counts only real alerts and tallies failed channels", () => {
    const summary = summarizeAlertDelivery([
      { kind: "threshold", channels_sent: ["email", "sms"], channels_skipped: [] },
      { kind: "flood", channels_sent: [], channels_skipped: ["discord"] },
      { kind: "rule", channels_sent: ["email"], channels_skipped: ["discord", "sms_not_configured"] },
      { kind: "threshold", channels_sent: [], channels_skipped: ["quiet_hours"] },
      { kind: "generic", channels_sent: [], channels_skipped: ["slack"] },
      { kind: "digest", channels_sent: ["push"], channels_skipped: null },
    ]);
    expect(summary).toEqual({
      alerts: 3,
      heldBack: 1,
      reached: 2,
      sentChannels: ["email", "sms"],
      failedChannels: [
        { channel: "discord", count: 2 },
        { channel: "sms", count: 1 },
      ],
    });
  });

  it("shows a success callout when every alert got through", () => {
    const digest = buildWeeklyDigestParts({
      points,
      freezeThresholdF: 34,
      siteUrl: "https://probeharbor.dev",
      delivery: summarizeAlertDelivery([
        { kind: "threshold", channels_sent: ["email"], channels_skipped: [] },
      ]),
    });
    expect(digest.text).toContain("1 of 1 alert reached you via email.");
    expect(digest.html).toContain("Alert delivery");
  });

  it("flags channels that failed", () => {
    const digest = buildWeeklyDigestParts({
      points,
      freezeThresholdF: 34,
      siteUrl: "https://probeharbor.dev",
      delivery: summarizeAlertDelivery([
        { kind: "threshold", channels_sent: [], channels_skipped: ["sms"] },
      ]),
    });
    expect(digest.text).toContain("0 of 1 alert reached you.");
    expect(digest.text).toContain("Not delivered on: sms (1×)");
  });

  it("nudges a test when nothing fired, and omits the section without data", () => {
    const quiet = buildWeeklyDigestParts({
      points,
      freezeThresholdF: 34,
      siteUrl: "https://probeharbor.dev",
      delivery: summarizeAlertDelivery([]),
    });
    expect(quiet.text).toContain("No alerts went out this week");
    const none = buildWeeklyDigestParts({ points, freezeThresholdF: 34, siteUrl: "https://probeharbor.dev" });
    expect(none.text).not.toContain("Alert delivery");
    expect(none.text).not.toContain("No alerts went out");
  });
});
