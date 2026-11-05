import { describe, expect, it } from "vitest";
import { channelLastAttemptFailed, failingAlertChannels, summarizeChannelDelivery } from "./channelDelivery";

describe("failingAlertChannels", () => {
  const on = {
    enabled: true,
    channelEmail: true,
    channelSms: true,
    channelDiscord: false,
    channelPush: false,
    channelWebhook: false,
    channelTelegram: false,
    channelSlack: false,
    channelTeams: false,
    channelNtfy: false,
    channelPushover: false,
    channelWhatsapp: false,
  };
  const delivery = summarizeChannelDelivery([
    { created_at: "2026-11-01T00:00:00Z", channels_sent: ["email", "sms"], channels_skipped: [] },
    { created_at: "2026-11-02T00:00:00Z", channels_sent: [], channels_skipped: ["email", "discord"] },
    { created_at: "2026-11-03T00:00:00Z", channels_sent: [], channels_skipped: ["sms"] },
  ]);

  it("lists switched-on channels whose latest attempt failed, newest failure first", () => {
    expect(failingAlertChannels(delivery, on)).toEqual([
      { channel: "sms", lastFailedAt: "2026-11-03T00:00:00Z" },
      { channel: "email", lastFailedAt: "2026-11-02T00:00:00Z" },
    ]);
  });

  it("ignores channels that are off (discord failed but is switched off)", () => {
    expect(failingAlertChannels(delivery, on).map((row) => row.channel)).not.toContain("discord");
  });

  it("is empty once the channel succeeded again", () => {
    const recovered = summarizeChannelDelivery([
      { created_at: "2026-11-02T00:00:00Z", channels_sent: [], channels_skipped: ["email"] },
      { created_at: "2026-11-04T00:00:00Z", channels_sent: ["email"], channels_skipped: [] },
    ]);
    expect(failingAlertChannels(recovered, on)).toEqual([]);
  });

  it("is empty while alerts are off", () => {
    expect(failingAlertChannels(delivery, { ...on, enabled: false })).toEqual([]);
  });

  it("does not treat held (quiet hours / snooze) alerts as channel failures", () => {
    const held = summarizeChannelDelivery([
      { created_at: "2026-11-05T00:00:00Z", channels_sent: [], channels_skipped: ["quiet_hours"] },
      { created_at: "2026-11-05T01:00:00Z", channels_sent: [], channels_skipped: ["snooze_or_vacation"] },
    ]);
    expect(failingAlertChannels(held, on)).toEqual([]);
  });
});

describe("summarizeChannelDelivery", () => {
  it("tracks the latest success and failure per channel", () => {
    const summary = summarizeChannelDelivery([
      { created_at: "2026-09-01T00:00:00Z", channels_sent: ["email", "discord"], channels_skipped: [] },
      { created_at: "2026-09-03T00:00:00Z", channels_sent: ["email"], channels_skipped: ["discord", "quiet_hours"] },
      { created_at: "2026-09-02T00:00:00Z", channels_sent: ["email"], channels_skipped: null },
    ]);

    expect(summary.email).toEqual({ lastSentAt: "2026-09-03T00:00:00Z", lastFailedAt: null });
    expect(summary.discord).toEqual({
      lastSentAt: "2026-09-01T00:00:00Z",
      lastFailedAt: "2026-09-03T00:00:00Z",
    });
    // Skip reasons that aren't channels are ignored.
    expect(Object.keys(summary).sort()).toEqual(["discord", "email"]);
  });
});

describe("channelLastAttemptFailed", () => {
  it("is true only when the latest attempt failed", () => {
    expect(channelLastAttemptFailed(undefined)).toBe(false);
    expect(channelLastAttemptFailed({ lastSentAt: null, lastFailedAt: "2026-09-03T00:00:00Z" })).toBe(true);
    expect(
      channelLastAttemptFailed({ lastSentAt: "2026-09-04T00:00:00Z", lastFailedAt: "2026-09-03T00:00:00Z" }),
    ).toBe(false);
  });
});
