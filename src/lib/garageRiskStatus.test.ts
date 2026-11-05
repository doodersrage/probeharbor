import { describe, expect, it } from "vitest";
import { computeGarageRiskStatus } from "./garageRiskStatus";

const base = {
  hasDevices: true,
  hasLiveReading: true,
  coldestProbeTempF: 45,
  freezeThresholdF: 34,
  staleSensorCount: 0,
  nightsRiskCount: 0,
  alertsEnabled: true,
  hasEmailAlerts: true,
  outdoorTempF: 40,
  showColdSnapChecklist: false,
};

describe("computeGarageRiskStatus", () => {
  it("asks for a device when none exist", () => {
    const status = computeGarageRiskStatus({ ...base, hasDevices: false });
    expect(status.level).toBe("watch");
    expect(status.actionHref).toContain("devices");
  });

  it("flags freeze risk when coldest probe is at threshold", () => {
    const status = computeGarageRiskStatus({
      ...base,
      coldestProbeTempF: 32,
    });
    expect(status.level).toBe("risk");
  });

  it("flags a remaining-hours freeze clock before threshold", () => {
    const status = computeGarageRiskStatus({
      ...base,
      hoursUntilFreeze: 3.2,
      hitsAtLabel: "4:12 AM",
    });
    expect(status.level).toBe("risk");
    expect(status.detail).toMatch(/4:12 AM/);
    expect(status.actionHref).toBe("#time-to-freeze");
  });

  it("returns ok when readings and alerts are healthy", () => {
    const status = computeGarageRiskStatus(base);
    expect(status.level).toBe("ok");
    expect(status.actionHref).toBe("/dashboard/live");
  });

  it("sends near-freeze watch to Live, not marketing home", () => {
    const status = computeGarageRiskStatus({ ...base, coldestProbeTempF: 36 });
    expect(status.level).toBe("watch");
    expect(status.actionHref).toBe("/dashboard/live");
  });

  it("treats stale probes as likely unplugged", () => {
    const status = computeGarageRiskStatus({ ...base, staleSensorCount: 2 });
    expect(status.level).toBe("watch");
    expect(status.title).toMatch(/unplugged/i);
    expect(status.detail).toMatch(/stale/i);
  });

  it("prioritizes wet flood contacts as risk", () => {
    const status = computeGarageRiskStatus({ ...base, wetFloodCount: 1 });
    expect(status.level).toBe("risk");
    expect(status.title).toMatch(/flood|leak|wet/i);
    expect(status.actionHref).toBe("/dashboard/live");
  });

  it("sends nights-at-risk to Live when the checklist is off the page", () => {
    const status = computeGarageRiskStatus({ ...base, nightsRiskCount: 2 });
    expect(status.level).toBe("watch");
    expect(status.actionHref).toBe("/dashboard/live");
  });

  it("links cold-snap checklist only when that card is shown", () => {
    const status = computeGarageRiskStatus({
      ...base,
      showColdSnapChecklist: true,
    });
    expect(status.actionHref).toBe("#cold-snap");
  });

  it("prefers the checklist hash when nights-at-risk and the card is on the page", () => {
    const status = computeGarageRiskStatus({
      ...base,
      nightsRiskCount: 2,
      showColdSnapChecklist: true,
    });
    expect(status.actionHref).toBe("#cold-snap");
  });

  it("nudges alert setup when space is otherwise fine", () => {
    const status = computeGarageRiskStatus({
      ...base,
      alertsEnabled: false,
      hasEmailAlerts: false,
    });
    expect(status.level).toBe("watch");
    expect(status.actionHref).toContain("alerts");
    expect(status.actionHref).toContain("tab=settings");
  });

  describe("stale probes vs. other conditions", () => {
    it("shows freeze risk when one probe is stale and a fresh probe is freezing", () => {
      const status = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 1,
        coldestProbeTempF: 28,
      });
      expect(status.level).toBe("risk");
      expect(status.reason).toBeUndefined();
      expect(status.title).not.toMatch(/unplugged/i);
      expect(status.detail).toMatch(/28\.0/);
      expect(status.actionHref).toBe("/dashboard/alerts");
    });

    it("shows freeze-soon risk over a stale probe", () => {
      const status = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 2,
        hoursUntilFreeze: 2,
        hitsAtLabel: "3:00 AM",
      });
      expect(status.level).toBe("risk");
      expect(status.reason).toBeUndefined();
      expect(status.actionHref).toBe("#time-to-freeze");
    });

    it("keeps wet flood contacts ahead of stale probes", () => {
      const status = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 1,
        wetFloodCount: 1,
        coldestProbeTempF: 28,
      });
      expect(status.level).toBe("risk");
      expect(status.title).toMatch(/flood|leak|wet/i);
    });

    it("shows stale when nothing more severe is happening", () => {
      const status = computeGarageRiskStatus({ ...base, staleSensorCount: 1 });
      expect(status.level).toBe("watch");
      expect(status.reason).toBe("stale");
    });

    it("keeps stale ahead of watch-level freeze-later and near-freeze", () => {
      const later = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 1,
        hoursUntilFreeze: 8,
      });
      expect(later.reason).toBe("stale");
      const near = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 1,
        coldestProbeTempF: 36,
      });
      expect(near.reason).toBe("stale");
    });

    it("still shows stale when no fresh probe has a temperature", () => {
      const status = computeGarageRiskStatus({
        ...base,
        staleSensorCount: 1,
        coldestProbeTempF: null,
      });
      expect(status.reason).toBe("stale");
    });
  });

  describe("°C display preference", () => {
    it("words the freeze detail in °C and keeps °F by default", () => {
      expect(computeGarageRiskStatus({ ...base, coldestProbeTempF: 31.5 }).detail).toBe(
        "Coldest probe is 31.5°F (threshold 34°F).",
      );
      expect(computeGarageRiskStatus({ ...base, coldestProbeTempF: 31.5, useCelsius: true }).detail).toBe(
        "Coldest probe is -0.3°C (threshold 1.1°C).",
      );
    });

    it("converts the near-freeze band as a difference (5 °F = 2.8 °C)", () => {
      const status = computeGarageRiskStatus({ ...base, coldestProbeTempF: 37, useCelsius: true });
      expect(status.level).toBe("watch");
      expect(status.detail).toBe("Coldest probe 2.8°C, within 2.8°C of 1.1°C.");
      expect(computeGarageRiskStatus({ ...base, coldestProbeTempF: 37 }).detail).toBe(
        "Coldest probe 37.0°F, within 5°F of 34°F.",
      );
    });

    it("puts the threshold in °C in the time-to-freeze lines", () => {
      const soon = computeGarageRiskStatus({ ...base, hoursUntilFreeze: 3, useCelsius: true });
      expect(soon.detail).toContain("hit 1.1°C.");
      const later = computeGarageRiskStatus({ ...base, hoursUntilFreeze: 8, useCelsius: true });
      expect(later.detail).toBe("About 8.0 hours until 1.1°C at this space's lag vs outdoor.");
    });
  });
});

describe("computeGarageRiskStatus with demo-only readings", () => {
  it("shows a neutral demo state, never freeze urgency, however cold the demo probe reads", () => {
    const status = computeGarageRiskStatus({ ...base, demoOnly: true, coldestProbeTempF: 20 });
    expect(status.level).toBe("demo");
    expect(status.title).toMatch(/demo data/i);
    expect(status.detail).toMatch(/simulated/i);
    expect(status.actionHref).toContain("devices");
  });

  it("does not report a demo flood contact as wet or a demo probe as stale", () => {
    expect(computeGarageRiskStatus({ ...base, demoOnly: true, wetFloodCount: 1 }).level).toBe("demo");
    expect(computeGarageRiskStatus({ ...base, demoOnly: true, staleSensorCount: 2 }).level).toBe("demo");
  });

  it("still asks for a device or a first reading before the demo state", () => {
    expect(computeGarageRiskStatus({ ...base, demoOnly: true, hasDevices: false }).level).toBe("watch");
    expect(computeGarageRiskStatus({ ...base, demoOnly: true, hasLiveReading: false }).level).toBe("offline");
  });

  it("judges readings normally when they are not demo-only", () => {
    expect(computeGarageRiskStatus({ ...base, demoOnly: false, coldestProbeTempF: 20 }).level).toBe("risk");
  });
});
