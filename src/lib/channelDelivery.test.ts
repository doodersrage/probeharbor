import { describe, expect, it } from "vitest";
import { channelLastAttemptFailed, summarizeChannelDelivery } from "./channelDelivery";

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
