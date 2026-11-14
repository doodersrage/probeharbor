import { describe, expect, it } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";
import { latestAlertSentAt, overviewFocus, type OverviewFocusInput } from "./overviewFocus";

const alertsOn: AlertSettings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, channelEmail: true };
const base: OverviewFocusInput = {
  devices: [],
  latestCount: 0,
  alertSettings: alertsOn,
  userEmail: "owner@example.com",
  hasDelivery: false,
  canEdit: true,
  onboardingDismissed: false,
  overviewMode: "insights",
};

describe("overviewFocus: first-run until the essentials are done", () => {
  it("a brand-new account is in first-run focus", () => {
    expect(overviewFocus(base)).toMatchObject({ hasDevices: false, essentialDone: false, firstRunFocus: true, showInsights: false });
  });

  it("a device alone isn't enough: alerts must have reached someone", () => {
    const f = overviewFocus({ ...base, devices: [{ source: "push" }] });
    expect(f).toMatchObject({ hasDevices: true, hasSentAnyAlert: false, firstRunFocus: true });
  });

  it("device + alerts on + a delivered alert + a channel ends first-run and shows the chosen mode", () => {
    const f = overviewFocus({ ...base, devices: [{ source: "pull_url" }], hasDelivery: true });
    expect(f).toMatchObject({ essentialDone: true, firstRunFocus: false, showInsights: true });
    expect(overviewFocus({ ...base, devices: [{ source: "push" }], hasDelivery: true, overviewMode: "simple" }).showInsights).toBe(false);
  });

  it("a cooldown stamp counts as an alert sent (test sends only show in the log)", () => {
    const f = overviewFocus({
      ...base,
      latestCount: 3,
      alertSettings: { ...alertsOn, lastForecastAlertAt: "2026-11-10T08:00:00Z" },
    });
    expect(f).toMatchObject({ hasDevices: true, hasSentAnyAlert: true, lastAlertAt: "2026-11-10T08:00:00Z", essentialDone: true });
  });

  it("alerts off, or no channel, keeps first-run", () => {
    const done = { ...base, devices: [{ source: "push" as const }], hasDelivery: true };
    expect(overviewFocus({ ...done, alertSettings: { ...alertsOn, enabled: false } }).firstRunFocus).toBe(true);
    expect(overviewFocus({ ...done, alertSettings: { ...alertsOn, channelEmail: false } }).firstRunFocus).toBe(true);
  });

  it("viewers and people who dismissed onboarding never get first-run focus", () => {
    expect(overviewFocus({ ...base, canEdit: false })).toMatchObject({ firstRunFocus: false, showInsights: true });
    expect(overviewFocus({ ...base, onboardingDismissed: true }).firstRunFocus).toBe(false);
  });

  it("other device sources (e.g. a thermostat) don't count as a device", () => {
    expect(overviewFocus({ ...base, devices: [{ source: "thermostat" as never }] }).hasDevices).toBe(false);
  });
});

describe("latestAlertSentAt", () => {
  it("picks the newest stamp across the reported kinds", () => {
    expect(
      latestAlertSentAt({
        ...alertsOn,
        lastAlertSentAt: "2026-11-01T00:00:00Z",
        lastNwsAlertAt: "2026-11-12T00:00:00Z",
        lastRateAlertAt: "2026-11-05T00:00:00Z",
      }),
    ).toBe("2026-11-12T00:00:00Z");
    expect(latestAlertSentAt(alertsOn)).toBeNull();
  });
});
