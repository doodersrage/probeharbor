import { describe, expect, it, vi } from "vitest";

vi.mock("./notify", () => ({ getAlertSettingsForUser: vi.fn(), saveAlertSettingsForUser: vi.fn() }));

import { alertSettingsToRow, DEFAULT_ALERT_SETTINGS } from "./alerts";
import { describeAlertSettingsChanges, historyChangeInDisplayUnit, mergeSnapshotOntoCurrent } from "./alertSettingsHistory";
import { ensureLocale } from "../i18n/catalog";

const base = { ...DEFAULT_ALERT_SETTINGS, enabled: true };

describe("describeAlertSettingsChanges", () => {
  it("names changed settings in plain words", () => {
    expect(
      describeAlertSettingsChanges(base, { ...base, freezeThresholdF: 31.5, channelSms: true, forecastFreezeEnabled: true }),
    ).toEqual(["Freeze line (°F) 34 → 31.5", "SMS turned on", "Forecast freeze warning turned on"]);
  });

  it("never shows secret values", () => {
    const [change] = describeAlertSettingsChanges(base, { ...base, discordWebhookUrl: "https://discord.com/api/webhooks/1/secret" });
    expect(change).toBe("Discord webhook changed");
  });

  it("ignores cooldown clocks and snooze, and counts unnamed settings", () => {
    expect(
      describeAlertSettingsChanges(base, { ...base, lastAlertSentAt: "2026-10-14T00:00:00Z", snoozeUntil: "2026-10-15T00:00:00Z" }),
    ).toEqual([]);
    expect(describeAlertSettingsChanges(base, { ...base, rssiThreshold: -90, batteryThresholdPct: 10 })).toEqual(["2 other settings"]);
  });
});

describe("describeAlertSettingsChanges in other languages", () => {
  it("writes the change list in the saver's language", async () => {
    await ensureLocale("fr", ["app"]);
    expect(
      describeAlertSettingsChanges(base, { ...base, freezeThresholdF: 31.5, channelSms: true, rssiThreshold: -90 }, "fr"),
    ).toEqual(["Seuil de gel (°F)\u00a0: 34 → 31,5", "SMS\u00a0: activé", "1 autre paramètre"]);
  });
});

describe("historyChangeInDisplayUnit", () => {
  it("leaves lines unchanged for °F users", () => {
    expect(historyChangeInDisplayUnit("Freeze line (°F) 34 → 36", "en", false)).toBe("Freeze line (°F) 34 → 36");
  });

  it("reads stored °F freeze-line and fast-drop changes in °C (the drop ×5/9)", () => {
    const [freeze, rate, sms] = describeAlertSettingsChanges(
      { ...base, rateChangeF: 15, channelSms: false },
      { ...base, freezeThresholdF: 36, rateChangeF: 9, channelSms: true },
    );
    expect(freeze).toBe("Freeze line (°F) 34 → 36");
    expect(historyChangeInDisplayUnit(freeze!, "en", true)).toBe("Freeze line (°C) 1.1 → 2.2");
    expect(rate).toBe("Fast-drop alert (°F/hr) 15 → 9");
    expect(historyChangeInDisplayUnit(rate!, "en", true)).toBe("Fast-drop alert (°C/hr) 8.3 → 5");
    expect(historyChangeInDisplayUnit(sms!, "en", true)).toBe(sms);
    expect(historyChangeInDisplayUnit("Freeze line (°F) none → 30", "en", true)).toBe("Freeze line (°C) none → -1.1");
    expect(historyChangeInDisplayUnit("Rules edited", "en", true)).toBe("Rules edited");
  });

  it("matches lines saved in the viewer's language", async () => {
    await ensureLocale("fr", ["app"]);
    const [line] = describeAlertSettingsChanges(base, { ...base, freezeThresholdF: 31.5 }, "fr");
    expect(historyChangeInDisplayUnit(line!, "fr", true)).toBe("Seuil de gel (°C) : 1,1 → -0,3");
  });
});

describe("mergeSnapshotOntoCurrent", () => {
  it("restores configuration but keeps today's cooldowns and snooze", () => {
    const snapshot = alertSettingsToRow({ ...base, freezeThresholdF: 30, lastAlertSentAt: "2026-01-01T00:00:00Z" });
    const current = { ...base, freezeThresholdF: 34, lastAlertSentAt: "2026-10-14T08:00:00Z", snoozeUntil: "2026-10-14T20:00:00Z" };
    const merged = mergeSnapshotOntoCurrent(snapshot, current);
    expect(merged.freezeThresholdF).toBe(30);
    expect(merged.lastAlertSentAt).toBe("2026-10-14T08:00:00Z");
    expect(merged.snoozeUntil).toBe("2026-10-14T20:00:00Z");
  });
});
