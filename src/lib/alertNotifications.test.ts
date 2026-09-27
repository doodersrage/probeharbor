import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertReading } from "./alerts";

const mockNotifyUser = vi.fn();
const mockMarkCooldown = vi.fn();
const mockMarkEscalation = vi.fn();
vi.mock("./notify", () => ({
  notifyUser: (...args: unknown[]) => mockNotifyUser(...args),
  markCooldown: (...args: unknown[]) => mockMarkCooldown(...args),
  markEscalation: (...args: unknown[]) => mockMarkEscalation(...args),
  getAlertSettingsForUser: vi.fn(),
  saveAlertSettingsForUser: vi.fn(),
}));

const mockListRecentAlertEvents = vi.fn();
vi.mock("./alertEvents", () => ({
  listRecentAlertEvents: (...args: unknown[]) => mockListRecentAlertEvents(...args),
}));

const mockBuildFreezeAlertContext = vi.fn();
vi.mock("./alertContext", () => ({
  buildFreezeAlertContext: (...args: unknown[]) => mockBuildFreezeAlertContext(...args),
}));

beforeEach(() => {
  mockNotifyUser.mockReset().mockResolvedValue(undefined);
  mockMarkCooldown.mockReset().mockResolvedValue(undefined);
  mockMarkEscalation.mockReset().mockResolvedValue(undefined);
  mockBuildFreezeAlertContext.mockReset().mockResolvedValue(null);
  mockListRecentAlertEvents.mockReset().mockResolvedValue([]);
});

describe("sendThresholdAlertsIfNeeded escalation", () => {
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
  const escalating = {
    ...DEFAULT_ALERT_SETTINGS,
    enabled: true,
    channelSms: true,
    escalationEnabled: true,
    escalationMinutes: 30,
  };
  const smsOnlyCalls = () =>
    mockNotifyUser.mock.calls.filter((call) => call[4]?.smsOnly === true);

  it("escalates an unacknowledged alert once escalationMinutes pass", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: null }]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...escalating, lastAlertSentAt: minutesAgo(45) },
      freezingReading,
    );

    expect(smsOnlyCalls()).toHaveLength(1);
    expect(mockMarkEscalation).toHaveBeenCalledWith("user-1");
  });

  it("does not escalate once the alert is acknowledged", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "threshold", acknowledged_at: minutesAgo(10) },
    ]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...escalating, lastAlertSentAt: minutesAgo(45) },
      freezingReading,
    );

    expect(smsOnlyCalls()).toHaveLength(0);
    expect(mockMarkEscalation).not.toHaveBeenCalled();
  });

  it("does not escalate a new incident days after the last alert", async () => {
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...escalating, lastAlertSentAt: minutesAgo(3 * 24 * 60) },
      freezingReading,
    );

    expect(smsOnlyCalls()).toHaveLength(0);
    // The regular alert still goes out.
    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
  });
});

const freezingReading: AlertReading[] = [
  { label: "Garage", tempf: 30, humidity: 40 },
];

describe("sendThresholdAlertsIfNeeded context block", () => {
  it("sends the alert with no context when buildFreezeAlertContext returns null", async () => {
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...DEFAULT_ALERT_SETTINGS, enabled: true },
      freezingReading,
      "house-1",
    );

    expect(mockBuildFreezeAlertContext).toHaveBeenCalled();
    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    const body = mockNotifyUser.mock.calls[0][3].body as string;
    expect(body).toContain("Garage is 30.0");
    expect(body).not.toContain("House thermostat");
    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_alert_sent_at");
  });

  it("appends context to the alert body when provided", async () => {
    mockBuildFreezeAlertContext.mockResolvedValue(
      "House thermostat: 68°F, set to 70°F, actively heating -- this alert is from an unconditioned space and is expected to run colder.",
    );
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...DEFAULT_ALERT_SETTINGS, enabled: true },
      freezingReading,
      "house-1",
    );

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    const body = mockNotifyUser.mock.calls[0][3].body as string;
    expect(body).toContain("Garage is 30.0");
    expect(body).toContain("House thermostat: 68°F");
    expect(body.startsWith("Garage is 30.0")).toBe(true);
  });

  it("still sends the alert when context builder throws", async () => {
    mockBuildFreezeAlertContext.mockRejectedValue(new Error("context down"));
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...DEFAULT_ALERT_SETTINGS, enabled: true },
      freezingReading,
      "house-1",
    );

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    const body = mockNotifyUser.mock.calls[0][3].body as string;
    expect(body).toContain("Garage is 30.0");
    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_alert_sent_at");
  });

  it("doesn't send an alert when nothing crosses threshold", async () => {
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...DEFAULT_ALERT_SETTINGS, enabled: true },
      [{ label: "Garage", tempf: 70, humidity: 40 }],
      "house-1",
    );

    expect(mockBuildFreezeAlertContext).not.toHaveBeenCalled();
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });
});
