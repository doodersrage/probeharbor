import { describe, expect, it, vi } from "vitest";

vi.mock("./supabase", () => ({ createServerClient: vi.fn() }));
vi.mock("./notify", () => ({ getAlertSettingsForUser: vi.fn(), saveAlertSettingsForUser: vi.fn() }));

import { alertSettingsToRow, DEFAULT_ALERT_SETTINGS } from "./alerts";
import { describeAlertSettingsChanges, mergeSnapshotOntoCurrent } from "./alertSettingsHistory";

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
