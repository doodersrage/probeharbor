import { describe, expect, it } from "vitest";
import { quietHoursAllowsSmsCritical, shouldSuppressForQuietHours } from "./quietHours";
import { DEFAULT_ALERT_SETTINGS } from "./alerts";

describe("quiet hours SMS critical", () => {
  const base = {
    ...DEFAULT_ALERT_SETTINGS,
    quietHoursEnabled: true,
    quietHoursStart: "00:00",
    quietHoursEnd: "23:59",
    quietHoursTimezone: "UTC",
    quietHoursBypassFreeze: false,
    quietHoursSmsCritical: true,
  };

  // Fixed clock: the 00:00–23:59 window excludes the last minute of the UTC day.
  const noon = new Date("2026-01-15T12:00:00Z");

  it("suppresses non-SMS channels during quiet hours", () => {
    expect(shouldSuppressForQuietHours(base, "threshold", noon)).toBe(true);
  });

  it("allows SMS for threshold/forecast when sms critical is on", () => {
    expect(quietHoursAllowsSmsCritical(base, "threshold", noon)).toBe(true);
    expect(quietHoursAllowsSmsCritical(base, "forecast", noon)).toBe(true);
    expect(quietHoursAllowsSmsCritical(base, "flood", noon)).toBe(true);
    expect(quietHoursAllowsSmsCritical(base, "rate", noon)).toBe(false);
  });

  it("does not allow SMS critical when setting is off", () => {
    expect(
      quietHoursAllowsSmsCritical(
        { ...base, quietHoursSmsCritical: false },
        "threshold",
        noon,
      ),
    ).toBe(false);
  });
});

describe("quiet hours across midnight and daylight saving", async () => {
  const { isWithinQuietWindow } = await import("./quietHours");
  // 22:00–07:00 in Chicago. CST is UTC-6 in January.
  const chicago = (utc: string) => isWithinQuietWindow("22:00", "07:00", "America/Chicago", new Date(utc));

  it("wraps midnight: late evening and early morning are quiet, the day isn't", () => {
    expect(chicago("2026-01-15T05:30:00Z")).toBe(true); // 23:30 local
    expect(chicago("2026-01-15T12:59:00Z")).toBe(true); // 06:59 local
    expect(chicago("2026-01-15T13:00:00Z")).toBe(false); // 07:00 local: end is exclusive
    expect(chicago("2026-01-15T03:59:00Z")).toBe(false); // 21:59 local
    expect(chicago("2026-01-15T04:00:00Z")).toBe(true); // 22:00 local: start is inclusive
  });

  // 01:00–06:00 in New York on the DST change days.
  const newYork = (utc: string) => isWithinQuietWindow("01:00", "06:00", "America/New_York", new Date(utc));

  it("follows local wall time on the spring-forward night (2026-03-08)", () => {
    expect(newYork("2026-03-08T06:30:00Z")).toBe(true); // 01:30 EST
    expect(newYork("2026-03-08T07:30:00Z")).toBe(true); // 03:30 EDT (02:xx is skipped)
    expect(newYork("2026-03-08T09:59:00Z")).toBe(true); // 05:59 EDT
    expect(newYork("2026-03-08T10:00:00Z")).toBe(false); // 06:00 EDT
  });

  it("follows local wall time on the fall-back night (2026-11-01)", () => {
    expect(newYork("2026-11-01T05:30:00Z")).toBe(true); // 01:30 EDT
    expect(newYork("2026-11-01T06:30:00Z")).toBe(true); // 01:30 EST (repeated hour)
    expect(newYork("2026-11-01T10:59:00Z")).toBe(true); // 05:59 EST
    expect(newYork("2026-11-01T11:00:00Z")).toBe(false); // 06:00 EST
  });

  it("falls back to UTC for an unknown time zone instead of throwing", () => {
    expect(isWithinQuietWindow("22:00", "07:00", "Not/AZone", new Date("2026-01-15T23:00:00Z"))).toBe(true);
    expect(isWithinQuietWindow("22:00", "07:00", "Not/AZone", new Date("2026-01-15T12:00:00Z"))).toBe(false);
  });

  it("treats an unparseable time as no quiet window", () => {
    expect(isWithinQuietWindow("25:00", "07:00", "UTC", new Date("2026-01-15T03:00:00Z"))).toBe(false);
  });
});
