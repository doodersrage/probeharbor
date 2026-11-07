import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS } from "./alerts";

const mockRecentAlert = vi.fn();
const mockMarkCooldown = vi.fn();
const mockClaimCooldown = vi.fn();
vi.mock("./db/alertSettings", () => ({
  recentAlertReachedAChannel: (...a: unknown[]) => mockRecentAlert(...a),
  markCooldown: (...a: unknown[]) => mockMarkCooldown(...a),
  claimCooldown: (...a: unknown[]) => mockClaimCooldown(...a),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("alertSettingsHaveDeliveryTimestamp", () => {
  it("is false for defaults", async () => {
    const { alertSettingsHaveDeliveryTimestamp } = await import("./notify");
    expect(alertSettingsHaveDeliveryTimestamp(DEFAULT_ALERT_SETTINGS)).toBe(false);
  });

  it("is true when a test or freeze cooldown is set", async () => {
    const { alertSettingsHaveDeliveryTimestamp } = await import("./notify");
    expect(
      alertSettingsHaveDeliveryTimestamp({
        ...DEFAULT_ALERT_SETTINGS,
        lastAlertSentAt: "2026-09-04T12:00:00.000Z",
      }),
    ).toBe(true);
    expect(
      alertSettingsHaveDeliveryTimestamp({
        ...DEFAULT_ALERT_SETTINGS,
        lastFloodAlertAt: "2026-09-04T12:00:00.000Z",
      }),
    ).toBe(true);
  });
});

describe("ensureAlertDeliveryEvidence", () => {
  it("reports a delivered alert event without arming the cooldown", async () => {
    mockRecentAlert.mockResolvedValue(true);

    const { ensureAlertDeliveryEvidence } = await import("./notify");
    const result = await ensureAlertDeliveryEvidence("user-1", DEFAULT_ALERT_SETTINGS);
    expect(result.hasDelivery).toBe(true);
    expect(mockRecentAlert).toHaveBeenCalledWith("user-1");
    // Writing last_alert_sent_at here would suppress real freeze alerts.
    expect(mockMarkCooldown).not.toHaveBeenCalled();
    expect(mockClaimCooldown).not.toHaveBeenCalled();
    expect(result.settings.lastAlertSentAt).toBeNull();
  });

  it("stays false when events were only skipped", async () => {
    mockRecentAlert.mockResolvedValue(false);

    const { ensureAlertDeliveryEvidence } = await import("./notify");
    const result = await ensureAlertDeliveryEvidence("user-1", DEFAULT_ALERT_SETTINGS);
    expect(result.hasDelivery).toBe(false);
  });
});
