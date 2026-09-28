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
