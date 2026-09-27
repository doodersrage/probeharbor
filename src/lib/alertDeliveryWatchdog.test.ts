import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";

const NOW = Date.parse("2026-01-10T12:00:00.000Z");
const minutesAgo = (m: number) => new Date(NOW - m * 60 * 1000).toISOString();

const mockListHouseholdIdsForCron = vi.fn();
const mockListHouseholdMembers = vi.fn();
vi.mock("./households", () => ({
  listHouseholdIdsForCron: () => mockListHouseholdIdsForCron(),
  listHouseholdMembers: (...a: unknown[]) => mockListHouseholdMembers(...a),
}));

const mockGetAlertSettingsForUser = vi.fn();
vi.mock("./notify", () => ({
  getAlertSettingsForUser: (...a: unknown[]) => mockGetAlertSettingsForUser(...a),
}));

const mockFetchLatest = vi.fn();
const mockGetDwellSamples = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchLatestSensorValues: (...a: unknown[]) => mockFetchLatest(...a),
  getFreezeDwellSamples: (...a: unknown[]) => mockGetDwellSamples(...a),
}));

const mockListRecentAlertEvents = vi.fn();
vi.mock("./alertEvents", () => ({
  listRecentAlertEvents: (...a: unknown[]) => mockListRecentAlertEvents(...a),
}));

vi.mock("./supabase", () => ({
  createAdminClient: () => ({
    auth: {
      admin: {
        getUserById: async () => ({ data: { user: { email: "u@example.com", user_metadata: {} } } }),
      },
    },
  }),
}));

const settings: AlertSettings = {
  ...DEFAULT_ALERT_SETTINGS,
  enabled: true,
  channelEmail: true,
  freezeThresholdF: 32,
  freezeDwellMinutes: 0,
};

function coldRow(tempF: number) {
  return {
    sensor: {
      id: "s1",
      device_id: "d1",
      key: "t1",
      label: "Garage",
      kind: "temperature",
      unit: "F",
      visible: true,
    },
    deviceName: "Garage probe",
    value_num: tempF,
    value_bool: null,
    value_text: null,
    recorded_at: minutesAgo(5),
  };
}

beforeEach(() => {
  mockListHouseholdIdsForCron.mockReset().mockResolvedValue([{ householdId: "h1", ownerUserId: "u1" }]);
  mockListHouseholdMembers.mockReset().mockResolvedValue({ members: [{ user_id: "u1" }] });
  mockGetAlertSettingsForUser.mockReset().mockResolvedValue(settings);
  mockFetchLatest.mockReset().mockResolvedValue([coldRow(28)]);
  // Cold for the last hour, well past dwell + grace.
  mockGetDwellSamples.mockReset().mockResolvedValue([
    { at: minutesAgo(60), tempF: 29 },
    { at: minutesAgo(20), tempF: 28 },
    { at: minutesAgo(5), tempF: 28 },
  ]);
  mockListRecentAlertEvents.mockReset().mockResolvedValue([]);
});

describe("classifyAlertDelivery", () => {
  it("separates silence, failures, and handled alerts", async () => {
    const { classifyAlertDelivery } = await import("./alertDeliveryWatchdog");
    const ev = (sent: string[], skipped: string[], ago = 30) => ({
      kind: "threshold",
      created_at: minutesAgo(ago),
      channels_sent: sent,
      channels_skipped: skipped,
    });

    expect(classifyAlertDelivery([], NOW)).toBe("no_alert");
    expect(classifyAlertDelivery([ev(["email"], [], 60 * 7)], NOW)).toBe("no_alert");
    expect(classifyAlertDelivery([ev([], ["email"])], NOW)).toBe("delivery_failed");
    expect(classifyAlertDelivery([ev(["email"], [])], NOW)).toBe("ok");
    // Quiet hours suppressed it on purpose: not a failure.
    expect(classifyAlertDelivery([ev([], ["quiet_hours"])], NOW)).toBe("ok");
  });
});

describe("runAlertDeliveryWatchdog", () => {
  it("is quiet when the cold probe produced a delivered alert", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "threshold", created_at: minutesAgo(30), channels_sent: ["email"], channels_skipped: [] },
    ]);
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const result = await runAlertDeliveryWatchdog(NOW);

    expect(result.checked).toBe(1);
    expect(result.findings).toEqual([]);
  });

  it("flags a cold probe with no alert recorded", async () => {
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const result = await runAlertDeliveryWatchdog(NOW);

    expect(result.findings).toEqual([
      expect.objectContaining({ userId: "u1", householdId: "h1", reason: "no_alert" }),
    ]);
  });

  it("flags when every recent attempt failed on its channels", async () => {
    mockListRecentAlertEvents.mockResolvedValue([
      { kind: "threshold", created_at: minutesAgo(30), channels_sent: [], channels_skipped: ["email"] },
    ]);
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const result = await runAlertDeliveryWatchdog(NOW);

    expect(result.findings[0]?.reason).toBe("delivery_failed");
  });

  it("ignores probes that only just went cold", async () => {
    mockGetDwellSamples.mockResolvedValue([
      { at: minutesAgo(40), tempF: 35 },
      { at: minutesAgo(5), tempF: 28 },
    ]);
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const result = await runAlertDeliveryWatchdog(NOW);

    expect(result.findings).toEqual([]);
  });

  it("skips members who snoozed alerts or have none enabled", async () => {
    mockGetAlertSettingsForUser.mockResolvedValue({
      ...settings,
      // isSnoozeActive reads the real clock.
      snoozeUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const result = await runAlertDeliveryWatchdog(NOW);

    expect(result.checked).toBe(0);
    expect(result.findings).toEqual([]);
  });
});
