import { describe, expect, it } from "vitest";
import { FREEZE_HOURS_CHART_TEXT_EN, freezeHoursSummary } from "./FreezeHoursChart";
import { metaTrendSummary } from "./BatteryTrendChart";
import overviewInsightsEn from "../i18n/messages/app/overviewInsights/en";

const format = {
  temp: "34",
  unit: "°F",
  hours: (h: number) => h.toFixed(1),
  day: (d: { label: string }) => d.label,
};

describe("freezeHoursSummary", () => {
  it("names the worst day when any day went below freeze", () => {
    const text = freezeHoursSummary(
      [
        { dayKey: "2026-01-01", label: "Jan 1", hoursBelow: 0, coldestF: 40 },
        { dayKey: "2026-01-02", label: "Jan 2", hoursBelow: 3.5, coldestF: 30 },
        { dayKey: "2026-01-03", label: "Jan 3", hoursBelow: 1, coldestF: 33 },
      ],
      FREEZE_HOURS_CHART_TEXT_EN,
      format,
    );
    expect(text).toBe("Days shown: 3. Days with time at or below 34°F: 2. Most: 3.5 h on Jan 2.");
  });

  it("says so when no day went below freeze", () => {
    const text = freezeHoursSummary(
      [{ dayKey: "2026-01-01", label: "Jan 1", hoursBelow: 0, coldestF: 40 }],
      FREEZE_HOURS_CHART_TEXT_EN,
      format,
    );
    expect(text).toBe("Days shown: 1. No time at or below 34°F.");
  });

  it("is empty with no days", () => {
    expect(freezeHoursSummary([], FREEZE_HOURS_CHART_TEXT_EN, format)).toBe("");
  });
});

describe("metaTrendSummary", () => {
  it("gives each series' latest and lowest value", () => {
    const text = metaTrendSummary(
      [
        {
          label: "Garage",
          samples: [
            { value: 90, at: "2026-01-01T00:00:00Z" },
            { value: 80, at: "2026-01-03T00:00:00Z" },
            { value: 84, at: "2026-01-02T00:00:00Z" },
          ],
        },
        { label: "Attic $&", samples: [{ value: 55, at: "2026-01-01T00:00:00Z" }] },
      ],
      overviewInsightsEn.chart.summaryItem,
      "%",
    );
    expect(text).toBe("Garage: now 80%, lowest 80%; Attic $&: now 55%, lowest 55%");
  });
});
