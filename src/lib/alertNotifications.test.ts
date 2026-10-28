import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertReading } from "./alerts";

const mockNotifyUser = vi.fn();
const mockMarkCooldown = vi.fn();
const mockMarkEscalation = vi.fn();
const mockClaimCooldown = vi.fn();
const mockReleaseCooldown = vi.fn();
vi.mock("./notify", () => ({
  notifyUser: (...args: unknown[]) => mockNotifyUser(...args),
  markCooldown: (...args: unknown[]) => mockMarkCooldown(...args),
  claimCooldown: (...args: unknown[]) => mockClaimCooldown(...args),
  releaseCooldown: (...args: unknown[]) => mockReleaseCooldown(...args),
  markEscalation: (...args: unknown[]) => mockMarkEscalation(...args),
  getAlertSettingsForUser: vi.fn(),
  saveAlertSettingsForUser: vi.fn(),
}));

const mockListRecentAlertEvents = vi.fn();
const mockAutoResolveAlerts = vi.fn().mockResolvedValue({ resolved: 0, channels: [] });
vi.mock("./alertEvents", () => ({
  listRecentAlertEvents: (...args: unknown[]) => mockListRecentAlertEvents(...args),
  // Same fake log, filtered by kind like the real query.
  listRecentAlertEventsFiltered: async (userId: string, options: { kind?: string | null } = {}) => {
    const events = ((await mockListRecentAlertEvents(userId, 10)) ?? []) as Array<{ kind: string }>;
    return { events: events.filter((event) => !options.kind || event.kind === options.kind), hasMore: false };
  },
  autoResolveAlerts: (...args: unknown[]) => mockAutoResolveAlerts(...args),
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
  // Default: the claim succeeded without stamping, so a delivered alert calls markCooldown.
  mockClaimCooldown.mockReset().mockResolvedValue({ claimed: true, claimedAt: null });
  mockReleaseCooldown.mockReset().mockResolvedValue(undefined);
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
    mockNotifyUser.mock.calls.filter(
      (call) => call[3]?.kind === "threshold" && !String(call[3]?.title).startsWith("Escalated"),
    );

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

describe("alerts close themselves when the condition clears", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, freezeThresholdF: 32 };

  it("closes open freeze alerts once every probe is back above freeze by the margin", async () => {
    mockAutoResolveAlerts.mockClear();
    mockListRecentAlertEvents.mockResolvedValue([]);
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Garage", tempf: 40, humidity: 40 }]);
    expect(mockAutoResolveAlerts).toHaveBeenCalledWith("user-1", { kinds: ["threshold"], reason: "recovered" });
  });

  it("leaves them open while a probe is still at or just above the line", async () => {
    mockAutoResolveAlerts.mockClear();
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Garage", tempf: 33, humidity: 40 }]);
    expect(mockAutoResolveAlerts).not.toHaveBeenCalled();
  });

  it("tells people once, on the channels the alert reached", async () => {
    mockAutoResolveAlerts.mockResolvedValueOnce({ resolved: 2, channels: ["email", "push"] });
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Garage", tempf: 40, humidity: 40 }]);
    const recovery = mockNotifyUser.mock.calls.find((call) => call[3]?.kind === "recovery");
    expect(recovery?.[3]).toMatchObject({ title: "Recovered: temperatures are back to normal" });
    expect(recovery?.[3].body).toContain("Garage 40.0°F (freeze line 32°F)");
    expect(recovery?.[4]).toEqual({ channelFilter: ["email", "push"] });
  });

  it("sends nothing when no alert was open", async () => {
    mockAutoResolveAlerts.mockResolvedValueOnce({ resolved: 0, channels: [] });
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Garage", tempf: 40, humidity: 40 }]);
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("closes flood alerts when nothing is wet", async () => {
    mockAutoResolveAlerts.mockClear();
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");
    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, []);
    expect(mockAutoResolveAlerts).toHaveBeenCalledWith("user-1", { kinds: ["flood"], reason: "recovered" });
  });
});

describe("stuck probe alerts", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true };
  const stuck = [{ sensorId: "s1", label: "Crawlspace", message: "Crawlspace has reported exactly 41.0°F for 30 hours.", detail: "" }];

  it("alerts on a stuck probe", async () => {
    const { maybeSendStuckSensorAlerts } = await import("./alertNotifications");
    await maybeSendStuckSensorAlerts("user-1", "a@example.com", settings, stuck);
    expect(mockNotifyUser.mock.calls[0]?.[3]).toMatchObject({ kind: "stuck", title: "Check Crawlspace: readings look stuck" });
  });

  it("waits a day before repeating", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ kind: "stuck", created_at: new Date(Date.now() - 3600_000).toISOString() }]);
    const { maybeSendStuckSensorAlerts } = await import("./alertNotifications");
    await maybeSendStuckSensorAlerts("user-1", "a@example.com", settings, stuck);
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("closes the alert once readings move again", async () => {
    mockAutoResolveAlerts.mockClear();
    const { maybeSendStuckSensorAlerts } = await import("./alertNotifications");
    await maybeSendStuckSensorAlerts("user-1", "a@example.com", settings, []);
    expect(mockAutoResolveAlerts).toHaveBeenCalledWith("user-1", { kinds: ["stuck"], reason: "recovered" });
  });
});

describe("power-off alerts", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true };
  const off = [{ label: "Garage outlet", space: "Garage" }];

  it("alerts when a power sensor reads off, routed to its space", async () => {
    mockNotifyUser.mockClear();
    mockMarkCooldown.mockClear();
    const { sendPowerAlertsIfNeeded } = await import("./alertNotifications");
    await sendPowerAlertsIfNeeded("user-1", "a@example.com", settings, off);
    expect(mockNotifyUser.mock.calls[0]?.[3]).toMatchObject({ kind: "power", title: "Power off" });
    expect(String(mockNotifyUser.mock.calls[0]?.[3]?.body)).toContain("Garage outlet reports the power is off.");
    expect(mockNotifyUser.mock.calls[0]?.[4]).toEqual({ space: "Garage" });
    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_power_alert_at");
  });

  it("stays quiet when turned off or inside the cooldown", async () => {
    mockNotifyUser.mockClear();
    const { sendPowerAlertsIfNeeded } = await import("./alertNotifications");
    await sendPowerAlertsIfNeeded("user-1", "a@example.com", { ...settings, powerAlertsEnabled: false }, off);
    await sendPowerAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastPowerAlertAt: new Date().toISOString() }, off);
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("closes the alert when power is back", async () => {
    mockAutoResolveAlerts.mockClear();
    const { sendPowerAlertsIfNeeded } = await import("./alertNotifications");
    await sendPowerAlertsIfNeeded("user-1", "a@example.com", settings, []);
    expect(mockAutoResolveAlerts).toHaveBeenCalledWith("user-1", { kinds: ["power"], reason: "recovered" });
  });
});

describe("delivery-aware cooldown for every alert type", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, powerAlertsEnabled: true };
  const wet = [{ label: "Water heater", space: "Garage" }];
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

  it("leaves the leak cooldown off when every channel failed, so it retries", async () => {
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["email", "sms"] });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    expect(mockMarkCooldown).not.toHaveBeenCalledWith("user-1", "last_flood_alert_at");
  });

  it("arms the leak cooldown once anyone was reached", async () => {
    mockNotifyUser.mockResolvedValue({ sent: ["push"], skipped: ["email"] });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_flood_alert_at");
  });

  it("retries a failed leak alert at most every 30 minutes", async () => {
    const failed = { kind: "flood", channels_sent: [], channels_skipped: ["email"] };
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    mockListRecentAlertEvents.mockResolvedValue([{ ...failed, created_at: minutesAgo(10) }]);
    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);
    expect(mockNotifyUser).not.toHaveBeenCalled();

    mockListRecentAlertEvents.mockResolvedValue([{ ...failed, created_at: minutesAgo(31) }]);
    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);
    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
  });

  it("doesn't let a failed freeze alert hold back a leak alert", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "threshold", channels_sent: [], channels_skipped: ["email"], created_at: minutesAgo(5) },
    ]);
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
  });

  it("applies the same rule to power-off alerts", async () => {
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["email"] });
    const { sendPowerAlertsIfNeeded } = await import("./alertNotifications");

    await sendPowerAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Freezer outlet", space: null }]);

    expect(mockMarkCooldown).not.toHaveBeenCalledWith("user-1", "last_power_alert_at");
  });

  it("still arms the cooldown when the alert was held on purpose (quiet hours)", async () => {
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["quiet_hours"] });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockMarkCooldown).toHaveBeenCalledWith("user-1", "last_flood_alert_at");
  });
});

describe("reachedNoOne", () => {
  it.each([
    [{ sent: [], skipped: ["email"] }, true],
    [{ sent: [], skipped: ["email", "sms"] }, true],
    [{ sent: ["push"], skipped: ["email"] }, false],
    [{ sent: [], skipped: ["quiet_hours"] }, false],
    [{ sent: [], skipped: ["snooze_or_vacation"] }, false],
    // No channel set up: nothing was tried, so a retry can't help.
    [{ sent: [], skipped: [] }, false],
  ])("%o → %s", async (delivery, expected) => {
    const { reachedNoOne } = await import("./alertNotifications");
    expect(reachedNoOne(delivery)).toBe(expected);
  });
});

describe("a new incident after recovery isn't held back by the old cooldown", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, powerAlertsEnabled: true };
  const wet = [{ label: "Water heater", space: "Garage" }];
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
  const recoveredFlood = (sentMinAgo: number, recoveredMinAgo: number) => ({
    kind: "flood",
    channels_sent: ["email"],
    channels_skipped: [],
    created_at: minutesAgo(sentMinAgo),
    acknowledged_at: minutesAgo(recoveredMinAgo),
    meta: { autoResolved: "recovered" },
  });

  it("alerts a second leak 2 hours after the first one dried up", async () => {
    mockListRecentAlertEvents.mockResolvedValue([recoveredFlood(150, 120)]);
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastFloodAlertAt: minutesAgo(150) }, wet);

    expect(mockNotifyUser).toHaveBeenCalledWith(
      "user-1",
      "a@example.com",
      expect.anything(),
      expect.objectContaining({ kind: "flood" }),
      expect.anything(),
      "en",
    );
  });

  it("stays quiet while the first leak is still open", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "flood", channels_sent: ["email"], channels_skipped: [], created_at: minutesAgo(60), acknowledged_at: null },
    ]);
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastFloodAlertAt: minutesAgo(60) }, wet);

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("waits 10 minutes after recovery so a flapping sensor can't spam", async () => {
    mockListRecentAlertEvents.mockResolvedValue([recoveredFlood(30, 3)]);
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastFloodAlertAt: minutesAgo(30) }, wet);

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("doesn't treat a person's acknowledgement as a recovery", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "flood", channels_sent: ["email"], channels_skipped: [], created_at: minutesAgo(90), acknowledged_at: minutesAgo(60), meta: {} },
    ]);
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastFloodAlertAt: minutesAgo(90) }, wet);

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("applies to power-off too", async () => {
    mockListRecentAlertEvents.mockResolvedValue([{ ...recoveredFlood(150, 120), kind: "power" }]);
    const { sendPowerAlertsIfNeeded } = await import("./alertNotifications");

    await sendPowerAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...settings, lastPowerAlertAt: minutesAgo(150) },
      [{ label: "Freezer outlet", space: null }],
    );

    expect(mockNotifyUser.mock.calls.some((call) => call[3]?.kind === "power")).toBe(true);
  });
});

describe("concurrent evaluations send an alert once", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true };
  const wet = [{ label: "Water heater", space: "Garage" }];

  it("doesn't send when another evaluation already claimed the alert", async () => {
    mockClaimCooldown.mockResolvedValue({ claimed: false, claimedAt: null });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("claims from the value it read, then keeps the stamp after delivering", async () => {
    const previous = "2026-01-01T00:00:00.000Z";
    mockClaimCooldown.mockResolvedValue({ claimed: true, claimedAt: "2026-01-02T00:00:00.000Z" });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", { ...settings, lastFloodAlertAt: previous }, wet);

    expect(mockClaimCooldown).toHaveBeenCalledWith("user-1", "last_flood_alert_at", previous);
    expect(mockNotifyUser).toHaveBeenCalledTimes(1);
    expect(mockReleaseCooldown).not.toHaveBeenCalled();
    expect(mockMarkCooldown).not.toHaveBeenCalled(); // already stamped by the claim
  });

  it("releases the claim when nobody was reached, so it retries", async () => {
    mockClaimCooldown.mockResolvedValue({ claimed: true, claimedAt: "2026-01-02T00:00:00.000Z" });
    mockNotifyUser.mockResolvedValue({ sent: [], skipped: ["email"] });
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");

    await sendFloodAlertsIfNeeded("user-1", "a@example.com", settings, wet);

    expect(mockReleaseCooldown).toHaveBeenCalledWith("user-1", "last_flood_alert_at", "2026-01-02T00:00:00.000Z", null);
  });
});

describe("freeze alerts are claimed too", () => {
  it("doesn't send a freeze alert another evaluation already claimed", async () => {
    mockClaimCooldown.mockResolvedValue({ claimed: false, claimedAt: null });
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");

    await sendThresholdAlertsIfNeeded(
      "user-1",
      "a@example.com",
      { ...DEFAULT_ALERT_SETTINGS, enabled: true, freezeThresholdF: 34, freezeDwellMinutes: 0 },
      [{ label: "Garage pipe", tempf: 20, humidity: null }],
    );

    expect(mockNotifyUser.mock.calls.some((call) => call[3]?.kind === "threshold")).toBe(false);
    expect(mockClaimCooldown).toHaveBeenCalledWith("user-1", "last_alert_sent_at", null);
  });
});

describe("freeze recovery needs a 2°F margin (no flapping at the line)", () => {
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, freezeThresholdF: 34, freezeDwellMinutes: 0 };
  const recoveryCalls = () =>
    mockAutoResolveAlerts.mock.calls.filter((call) => (call[1] as { kinds?: string[] })?.kinds?.includes("threshold"));

  it("isn't recovered just above the threshold", async () => {
    mockAutoResolveAlerts.mockClear();
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Pipe", tempf: 35.9, humidity: null }]);
    expect(recoveryCalls()).toHaveLength(0);
  });

  it("is recovered at threshold + 2°F", async () => {
    mockAutoResolveAlerts.mockClear();
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("user-1", "a@example.com", settings, [{ label: "Pipe", tempf: 36, humidity: null }]);
    expect(recoveryCalls()).toHaveLength(1);
  });
});
