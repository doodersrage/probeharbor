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

const mockEvaluateAlertRules = vi.fn();
vi.mock("./alertRules", () => ({
  evaluateAlertRules: (...args: unknown[]) => mockEvaluateAlertRules(...args),
}));

const mockHasNumericReadingAboveSince = vi.fn();
vi.mock("./sensorReadings", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./sensorReadings")>()),
  hasNumericReadingAboveSince: (...args: unknown[]) => mockHasNumericReadingAboveSince(...args),
}));

const mockBuildFreezeAlertContext = vi.fn();
vi.mock("./alertContext", () => ({
  buildFreezeAlertContext: (...args: unknown[]) => mockBuildFreezeAlertContext(...args),
}));

beforeEach(() => {
  mockNotifyUser.mockReset().mockResolvedValue({ sent: ["email"], skipped: [] });
  mockMarkCooldown.mockReset().mockResolvedValue(undefined);
  mockMarkEscalation.mockReset().mockResolvedValue(undefined);
  mockBuildFreezeAlertContext.mockReset().mockResolvedValue(null);
  mockListRecentAlertEvents.mockReset().mockResolvedValue([]);
  mockHasNumericReadingAboveSince.mockReset().mockResolvedValue(false);
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

describe("maybeSendRuleAlerts cooldown", () => {
  const rule = { id: "r1", name: "Garage humid", conditions: [], channels: [] };

  it("is not blocked by a recent freeze alert and stamps its own cooldown", async () => {
    mockEvaluateAlertRules.mockReturnValue(["Garage humidity above 80%"]);
    const { maybeSendRuleAlerts } = await import("./alertNotifications");
    await maybeSendRuleAlerts(
      "user-1",
      "a@example.com",
      [],
      {
        ...DEFAULT_ALERT_SETTINGS,
        enabled: true,
        alertRules: [rule] as never,
        lastAlertSentAt: new Date().toISOString(),
      },
      freezingReading,
    );

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_rule_alert_at");
    expect(mockMarkCooldown).not.toHaveBeenCalledWith("user-1", "last_alert_sent_at");
  });

  it("respects its own cooldown", async () => {
    mockEvaluateAlertRules.mockReturnValue(["Garage humidity above 80%"]);
    const { maybeSendRuleAlerts } = await import("./alertNotifications");
    await maybeSendRuleAlerts(
      "user-1",
      "a@example.com",
      [],
      {
        ...DEFAULT_ALERT_SETTINGS,
        enabled: true,
        alertRules: [rule] as never,
        lastRuleAlertAt: new Date().toISOString(),
      },
      freezingReading,
    );

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });
});

describe("sendThresholdAlertsIfNeeded delivery retry", () => {
  const enabled = { ...DEFAULT_ALERT_SETTINGS, enabled: true };
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

  it("leaves the cooldown unarmed when no channel delivered, so it retries", async () => {
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["email"] });
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", enabled, freezingReading);

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    expect(mockMarkCooldown).not.toHaveBeenCalled();
  });

  it("throttles retries to one per 30 minutes after a failed attempt", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "threshold", created_at: minutesAgo(10), channels_sent: [], channels_skipped: ["email"] },
    ]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", enabled, freezingReading);

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("still arms the cooldown when quiet hours held the alert on purpose", async () => {
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["quiet_hours"] });
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", enabled, freezingReading);

    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_alert_sent_at");
  });
});

describe("maybeSendRateAndOutageAlerts outages", () => {
  const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
  const device = (name: string, lastSeenAt: string) =>
    ({ id: name, name, enabled: true, last_seen_at: lastSeenAt, sensors: [] }) as never;
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, outageHours: 2 };

  it("does not re-alert for a device that was already offline at the last outage alert", async () => {
    const { maybeSendRateAndOutageAlerts } = await import("./alertNotifications");
    await maybeSendRateAndOutageAlerts(
      "user-1",
      "a@example.com",
      [device("Garage", hoursAgo(30 * 24))],
      { ...settings, lastOutageAlertAt: hoursAgo(5) },
    );

    expect(mockNotifyUser).not.toHaveBeenCalled();
    expect(mockMarkCooldown).not.toHaveBeenCalled();
  });

  it("alerts only the newly silent device and counts the ones already reported", async () => {
    const { maybeSendRateAndOutageAlerts } = await import("./alertNotifications");
    await maybeSendRateAndOutageAlerts(
      "user-1",
      "a@example.com",
      [device("Garage", hoursAgo(30 * 24)), device("Attic", hoursAgo(3))],
      { ...settings, lastOutageAlertAt: hoursAgo(5) },
    );

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    const body: string = mockNotifyUser.mock.calls[0][3].body;
    expect(body).toContain("Attic has been silent");
    expect(body).not.toContain("Garage");
    expect(body).toContain("1 other device is still offline");
    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_outage_alert_at");
  });
});

describe("sendThresholdAlertsIfNeeded after \"I'm on it\"", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true };
  const ackedAt = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
  const withSensor: AlertReading[] = [{ label: "Garage", tempf: 30, humidity: 40, sensorId: "s1" }];
  const sentTemperatureAlerts = () =>
    mockNotifyUser.mock.calls.filter((call) => call[3]?.title === "Temperature alert");

  it("stays quiet while an acknowledged freeze continues", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: ackedAt }]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, withSensor);

    expect(mockHasNumericReadingAboveSince).toHaveBeenCalledWith("s1", ackedAt, settings.freezeThresholdF);
    expect(sentTemperatureAlerts()).toHaveLength(0);
    expect(mockMarkCooldown).not.toHaveBeenCalled();
  });

  it("alerts again once the sensor recovered above the threshold and dropped back", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: ackedAt }]);
    mockHasNumericReadingAboveSince.mockResolvedValue(true);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, withSensor);

    expect(sentTemperatureAlerts()).toHaveLength(1);
  });

  it("keeps repeating when the last alert was never acknowledged", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: null }]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, withSensor);

    expect(mockHasNumericReadingAboveSince).not.toHaveBeenCalled();
    expect(sentTemperatureAlerts()).toHaveLength(1);
  });

  it("never suppresses when humidity is also alerting", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: ackedAt }]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [
      { label: "Garage", tempf: 30, humidity: 99, sensorId: "s1" },
    ]);

    expect(sentTemperatureAlerts()).toHaveLength(1);
  });

  it("alerts when it can't tell (reading without a sensor id)", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "threshold", acknowledged_at: ackedAt }]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [
      { label: "Garage", tempf: 30, humidity: 40 },
    ]);

    expect(sentTemperatureAlerts()).toHaveLength(1);
  });
});
