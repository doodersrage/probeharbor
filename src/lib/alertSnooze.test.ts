import { describe, expect, it } from "vitest";
import {
  formatAlertPauseUntil,
  getAlertPauseState,
  isSnoozeActive,
  isVacationActive,
  shouldSuppressForSnoozeOrVacation,
  snoozeUntilFromHours,
} from "./alertSnooze";
import { DEFAULT_ALERT_SETTINGS } from "./alerts";

describe("alert snooze and vacation", () => {
  it("snooze quiets routine alerts but never freeze, leak or power", () => {
    const settings = {
      ...DEFAULT_ALERT_SETTINGS,
      snoozeUntil: snoozeUntilFromHours(1),
    };
    expect(isSnoozeActive(settings)).toBe(true);
    // A battery warning's snooze link must not silence a freeze.
    expect(shouldSuppressForSnoozeOrVacation(settings, "threshold")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "power")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "battery")).toBe(true);
    expect(shouldSuppressForSnoozeOrVacation(settings, "rate")).toBe(true);
    expect(shouldSuppressForSnoozeOrVacation(settings, "outage")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "flood")).toBe(false);
  });

  it("vacation blocks rate alerts", () => {
    const settings = {
      ...DEFAULT_ALERT_SETTINGS,
      vacationUntil: new Date(Date.now() + 86400000).toISOString(),
    };
    expect(isVacationActive(settings)).toBe(true);
    expect(shouldSuppressForSnoozeOrVacation(settings, "rate")).toBe(true);
    // Freeze threshold alerts still reach you while you are away.
    expect(shouldSuppressForSnoozeOrVacation(settings, "threshold")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "forecast")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "runway")).toBe(false);
    expect(shouldSuppressForSnoozeOrVacation(settings, "flood")).toBe(false);
  });
});

describe("getAlertPauseState", () => {
  const now = Date.parse("2026-11-05T12:00:00.000Z");
  const base = { snoozeUntil: null, vacationUntil: null };

  it("is null when nothing is paused", () => {
    expect(getAlertPauseState(base, now)).toBeNull();
  });

  it("is null when snooze and vacation already ended", () => {
    expect(
      getAlertPauseState(
        { snoozeUntil: "2026-11-05T11:00:00.000Z", vacationUntil: "2026-11-01T00:00:00.000Z" },
        now,
      ),
    ).toBeNull();
  });

  it("ignores unparseable end times", () => {
    expect(getAlertPauseState({ snoozeUntil: "soon", vacationUntil: "" }, now)).toBeNull();
  });

  it("reports an active snooze and its end", () => {
    expect(getAlertPauseState({ ...base, snoozeUntil: "2026-11-05T16:00:00.000Z" }, now)).toEqual({
      snoozeUntil: "2026-11-05T16:00:00.000Z",
      vacationUntil: null,
      until: "2026-11-05T16:00:00.000Z",
    });
  });

  it("reports active vacation", () => {
    const state = getAlertPauseState({ ...base, vacationUntil: "2026-11-12T04:59:59.000Z" }, now);
    expect(state?.vacationUntil).toBe("2026-11-12T04:59:59.000Z");
    expect(state?.snoozeUntil).toBeNull();
  });

  it("uses the later end when both are active", () => {
    const state = getAlertPauseState(
      { snoozeUntil: "2026-11-06T12:00:00.000Z", vacationUntil: "2026-11-10T12:00:00.000Z" },
      now,
    );
    expect(state?.until).toBe("2026-11-10T12:00:00.000Z");
    expect(state?.snoozeUntil).toBe("2026-11-06T12:00:00.000Z");
  });

  it("drops an expired snooze while vacation continues", () => {
    const state = getAlertPauseState(
      { snoozeUntil: "2026-11-05T11:59:59.000Z", vacationUntil: "2026-11-10T12:00:00.000Z" },
      now,
    );
    expect(state?.snoozeUntil).toBeNull();
    expect(state?.until).toBe("2026-11-10T12:00:00.000Z");
  });
});

describe("formatAlertPauseUntil", () => {
  it("formats in the alert-settings time zone", () => {
    expect(formatAlertPauseUntil("2026-11-05T21:00:00.000Z", "en", "America/New_York")).toBe("Nov 5, 4:00 PM");
  });

  it("falls back to labelled UTC for an invalid zone", () => {
    expect(formatAlertPauseUntil("2026-11-05T21:00:00.000Z", "en", "Not/AZone")).toMatch(/9:00 PM UTC/);
  });
});
