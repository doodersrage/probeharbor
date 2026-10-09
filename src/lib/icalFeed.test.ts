import { describe, expect, it } from "vitest";
import { buildFreezeOutlookIcal } from "./icalFeed";

describe("ical feed", () => {
  it("includes at-risk nights", () => {
    const ical = buildFreezeOutlookIcal([
      { date: "2024-01-01", dateLabel: "Mon", minTempF: 28, atRisk: true },
      { date: "2024-01-02", dateLabel: "Tue", minTempF: 40, atRisk: false },
    ]);
    expect(ical).toContain("BEGIN:VEVENT");
    expect(ical).toContain("28");
  });

  it("gives each event an all-day DTSTART/DTEND", () => {
    const ical = buildFreezeOutlookIcal([
      { date: "2024-01-31", dateLabel: "Wed", minTempF: 25, atRisk: true },
    ]);
    expect(ical).toContain("DTSTART;VALUE=DATE:20240131");
    expect(ical).toContain("DTEND;VALUE=DATE:20240201");
    expect(ical).toContain("UID:probeharbor-freeze-2024-01-31@probeharbor.dev");
  });
});
