import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS } from "./alerts";

const mockGetRow = vi.fn();
const mockInsertDefault = vi.fn();
const mockSaveRow = vi.fn();
const mockMarkCooldown = vi.fn();
const mockMarkEscalation = vi.fn();
const mockRecentAlert = vi.fn();
vi.mock("./db/alertSettings", () => ({
  getAlertSettingsRow: (...args: unknown[]) => mockGetRow(...args),
  insertDefaultAlertSettings: (...args: unknown[]) => mockInsertDefault(...args),
  saveAlertSettingsRow: (...args: unknown[]) => mockSaveRow(...args),
  markCooldown: (...args: unknown[]) => mockMarkCooldown(...args),
  markEscalation: (...args: unknown[]) => mockMarkEscalation(...args),
  recentAlertReachedAChannel: (...args: unknown[]) => mockRecentAlert(...args),
}));

beforeEach(() => {
  mockGetRow.mockReset();
  mockInsertDefault.mockReset().mockResolvedValue(undefined);
  mockSaveRow.mockReset();
  mockMarkCooldown.mockReset().mockResolvedValue(undefined);
  mockMarkEscalation.mockReset().mockResolvedValue(undefined);
  mockRecentAlert.mockReset();
});

describe("isTwilioConfigured", () => {
  const keys = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"] as const;
  let prev: Record<string, string | undefined>;

  beforeEach(() => {
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    prev = Object.fromEntries(keys.map((k) => [k, env[k]]));
  });

  afterEach(() => {
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    for (const k of keys) env[k] = prev[k];
  });

  it("is false when any Twilio credential is missing", async () => {
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    env.TWILIO_ACCOUNT_SID = "sid";
    env.TWILIO_AUTH_TOKEN = "";
    env.TWILIO_FROM_NUMBER = "+15551234567";
    const { isTwilioConfigured } = await import("./notify");

    expect(isTwilioConfigured()).toBe(false);
  });

  it("is true once all three credentials are set", async () => {
    const env = import.meta.env as unknown as Record<string, string | undefined>;
    env.TWILIO_ACCOUNT_SID = "sid";
    env.TWILIO_AUTH_TOKEN = "token";
    env.TWILIO_FROM_NUMBER = "+15551234567";
    const { isTwilioConfigured } = await import("./notify");

    expect(isTwilioConfigured()).toBe(true);
  });
});

describe("getAlertSettingsForUser", () => {
  it("returns settings decoded from an existing row without writing anything", async () => {
    mockGetRow.mockResolvedValue({ user_id: "user-1", freeze_threshold_f: 30 });
    const { getAlertSettingsForUser } = await import("./notify");

    const settings = await getAlertSettingsForUser("user-1");

    expect(settings.freezeThresholdF).toBe(30);
    expect(mockInsertDefault).not.toHaveBeenCalled();
  });

  it("falls back to metadata and persists it when no row exists yet", async () => {
    mockGetRow.mockResolvedValue(null);
    const { getAlertSettingsForUser } = await import("./notify");

    const settings = await getAlertSettingsForUser("user-1", {});

    expect(settings).toEqual(expect.objectContaining({ lastAlertSentAt: null }));
    expect(mockInsertDefault).toHaveBeenCalledWith("user-1", expect.any(Object));
  });

  it("returns the row another request created first", async () => {
    mockGetRow.mockResolvedValueOnce(null).mockResolvedValueOnce({ user_id: "user-1", freeze_threshold_f: 28 });
    const { getAlertSettingsForUser } = await import("./notify");

    const settings = await getAlertSettingsForUser("user-1", {});

    expect(settings.freezeThresholdF).toBe(28);
  });

  it("uses metadata/defaults without writing when the row can't be read", async () => {
    mockGetRow.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getAlertSettingsForUser } = await import("./notify");

    const settings = await getAlertSettingsForUser("user-1", {});

    expect(settings).toEqual(expect.objectContaining({ lastAlertSentAt: null }));
    expect(mockInsertDefault).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("saveAlertSettingsForUser", () => {
  it("saves the settings row for the user and returns no error on success", async () => {
    mockSaveRow.mockResolvedValue({ error: null });
    const { saveAlertSettingsForUser } = await import("./notify");

    const result = await saveAlertSettingsForUser("user-1", DEFAULT_ALERT_SETTINGS);

    expect(result).toEqual({ error: null });
    expect(mockSaveRow).toHaveBeenCalledWith("user-1", expect.any(Object));
  });

  it("surfaces the database error message on failure", async () => {
    mockSaveRow.mockResolvedValue({ error: "db unavailable" });
    const { saveAlertSettingsForUser } = await import("./notify");

    const result = await saveAlertSettingsForUser("user-1", DEFAULT_ALERT_SETTINGS);

    expect(result).toEqual({ error: "db unavailable" });
  });
});

describe("markCooldown", () => {
  it("stamps the field, with defaults for a row that doesn't exist yet", async () => {
    const { markCooldown } = await import("./notify");

    await markCooldown("user-1", "last_outage_alert_at");

    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_outage_alert_at", expect.any(Object));
  });
});

describe("alertSettingsHaveDeliveryTimestamp", () => {
  it("is false when every delivery timestamp is null", async () => {
    const { alertSettingsHaveDeliveryTimestamp } = await import("./notify");
    expect(alertSettingsHaveDeliveryTimestamp(DEFAULT_ALERT_SETTINGS)).toBe(false);
  });

  it("is true when any single delivery timestamp is set", async () => {
    const { alertSettingsHaveDeliveryTimestamp } = await import("./notify");
    expect(
      alertSettingsHaveDeliveryTimestamp({
        ...DEFAULT_ALERT_SETTINGS,
        lastRssiAlertAt: "2026-01-01T00:00:00.000Z",
      }),
    ).toBe(true);
  });
});

describe("ensureAlertDeliveryEvidence", () => {
  it("short-circuits without querying when a cooldown timestamp already proves delivery", async () => {
    const { ensureAlertDeliveryEvidence } = await import("./notify");
    const settings = { ...DEFAULT_ALERT_SETTINGS, lastAlertSentAt: "2026-01-01T00:00:00.000Z" };

    const result = await ensureAlertDeliveryEvidence("user-1", settings);

    expect(result).toEqual({ hasDelivery: true, settings });
    expect(mockRecentAlert).not.toHaveBeenCalled();
  });

  it("reports no delivery when no recent alert reached a channel", async () => {
    mockRecentAlert.mockResolvedValue(false);
    const { ensureAlertDeliveryEvidence } = await import("./notify");

    const result = await ensureAlertDeliveryEvidence("user-1", DEFAULT_ALERT_SETTINGS);

    expect(result.hasDelivery).toBe(false);
  });

  it("reports delivery from alert events without writing a cooldown", async () => {
    mockRecentAlert.mockResolvedValue(true);
    const { ensureAlertDeliveryEvidence } = await import("./notify");

    const result = await ensureAlertDeliveryEvidence("user-1", DEFAULT_ALERT_SETTINGS);

    expect(result.hasDelivery).toBe(true);
    expect(result.settings.lastAlertSentAt).toBeNull();
    // Writing last_alert_sent_at would arm the cooldown.
    expect(mockMarkCooldown).not.toHaveBeenCalled();
  });

  it("reports no delivery when the lookup fails", async () => {
    mockRecentAlert.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { ensureAlertDeliveryEvidence } = await import("./notify");

    const result = await ensureAlertDeliveryEvidence("user-1", DEFAULT_ALERT_SETTINGS);

    expect(result.hasDelivery).toBe(false);
    errorSpy.mockRestore();
  });
});

describe("markEscalation", () => {
  it("stamps last_escalation_at for the user", async () => {
    const { markEscalation } = await import("./notify");

    await markEscalation("user-1");

    expect(mockMarkEscalation).toHaveBeenCalledWith("user-1");
  });
});
