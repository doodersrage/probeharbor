/**
 * Whether the forecast-freeze, NWS freeze-warning and device-health
 * (battery, Wi-Fi signal, battery trend) alerts fire. The real decision
 * rules in alerts.ts run; only the edges are mocked: weather/NWS fetches,
 * plan entitlements, the user record, cooldown storage and notifyUser.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";
import type { DeviceWithSensors } from "./devices";

const notifyUser = vi.fn();
const claimCooldown = vi.fn();
const releaseCooldown = vi.fn();
const markCooldown = vi.fn();
vi.mock("./notify", () => ({
  notifyUser: (...a: unknown[]) => notifyUser(...a),
  claimCooldown: (...a: unknown[]) => claimCooldown(...a),
  releaseCooldown: (...a: unknown[]) => releaseCooldown(...a),
  markCooldown: (...a: unknown[]) => markCooldown(...a),
  markEscalation: vi.fn(),
  getAlertSettingsForUser: vi.fn(),
  saveAlertSettingsForUser: vi.fn(),
}));
const recentEvents = vi.fn();
vi.mock("./alertEvents", () => ({
  listRecentAlertEvents: vi.fn().mockResolvedValue([]),
  listRecentAlertEventsFiltered: async (_userId: string, options: { kind?: string | null } = {}) => ({
    events: ((await recentEvents()) as Array<{ kind: string }>).filter((e) => !options.kind || e.kind === options.kind),
    hasMore: false,
  }),
  autoResolveAlerts: vi.fn().mockResolvedValue({ resolved: 0, channels: [] }),
}));
const entitlements = vi.hoisted(() => ({ value: { canUseForecastAlerts: true, canUseNwsAlerts: true } }));
vi.mock("./entitlements", () => ({ getUserEntitlements: vi.fn(async () => entitlements.value) }));
vi.mock("./userRecords", () => ({
  getUserRecord: vi.fn().mockResolvedValue({ user_metadata: { weather_city_id: "4887398" } }),
}));
const forecastMin = vi.fn();
const snapshot = vi.fn();
vi.mock("./weatherContext", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./weatherContext")>()),
  fetchForecastMinTempForConfig: (...a: unknown[]) => forecastMin(...a),
  fetchWeatherSnapshotForConfig: (...a: unknown[]) => snapshot(...a),
}));
const nwsAlerts = vi.fn();
vi.mock("./nwsAlerts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./nwsAlerts")>()),
  fetchNwsAlerts: (...a: unknown[]) => nwsAlerts(...a),
}));
vi.mock("./alertSnoozeTokens", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./alertSnoozeTokens")>()),
  buildSnoozeUrl: vi.fn().mockResolvedValue("https://probeharbor.test/snooze/x"),
}));
vi.mock("./siteUrl", () => ({ buildSiteUrl: () => "https://probeharbor.test" }));

beforeEach(() => {
  notifyUser.mockReset().mockResolvedValue({ sent: ["email"], skipped: [] });
  claimCooldown.mockReset().mockResolvedValue({ claimed: true, claimedAt: "2026-11-13T00:00:00.000Z" });
  releaseCooldown.mockReset().mockResolvedValue(undefined);
  markCooldown.mockReset().mockResolvedValue(undefined);
  recentEvents.mockReset().mockResolvedValue([]);
  forecastMin.mockReset();
  snapshot.mockReset();
  nwsAlerts.mockReset();
  entitlements.value = { canUseForecastAlerts: true, canUseNwsAlerts: true };
});

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const sentKinds = () => notifyUser.mock.calls.map((call) => (call[3] as { kind: string }).kind);
const sentBody = (i = 0) => (notifyUser.mock.calls[i]![3] as { body: string }).body;

describe("forecast freeze alert", () => {
  const on: AlertSettings = {
    ...DEFAULT_ALERT_SETTINGS,
    enabled: true,
    forecastFreezeEnabled: true,
    forecastHoursAhead: 24,
    freezeThresholdF: 34,
  };
  const run = async (settings: AlertSettings = on) => {
    const { maybeSendForecastFreezeAlert } = await import("./alertNotifications");
    await maybeSendForecastFreezeAlert("user-1", "a@example.com", settings);
  };

  it("alerts when the forecast low is at or below the freeze threshold, then arms the cooldown", async () => {
    forecastMin.mockResolvedValue({ minTempF: 29.4, cityName: "Chicago", hoursAhead: 24 });
    await run();
    expect(sentKinds()).toEqual(["forecast"]);
    expect(sentBody()).toContain("29.4");
    expect(claimCooldown).toHaveBeenCalledWith("user-1", "last_forecast_alert_at", null);
    expect(releaseCooldown).not.toHaveBeenCalled();
  });

  it("stays quiet when the forecast low is above the threshold", async () => {
    forecastMin.mockResolvedValue({ minTempF: 41, cityName: "Chicago", hoursAhead: 24 });
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("stays quiet when there's no forecast (fetch failed or no location)", async () => {
    forecastMin.mockResolvedValue(null);
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("is off unless enabled, and needs the plan", async () => {
    forecastMin.mockResolvedValue({ minTempF: 20, cityName: null, hoursAhead: 24 });
    await run({ ...on, forecastFreezeEnabled: false });
    entitlements.value = { ...entitlements.value, canUseForecastAlerts: false };
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
    expect(forecastMin).not.toHaveBeenCalled();
  });

  it("doesn't repeat inside the cooldown", async () => {
    forecastMin.mockResolvedValue({ minTempF: 20, cityName: null, hoursAhead: 24 });
    await run({ ...on, lastForecastAlertAt: hoursAgo(1) });
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("releases the cooldown when nobody was reached, so it retries", async () => {
    forecastMin.mockResolvedValue({ minTempF: 20, cityName: null, hoursAhead: 24 });
    notifyUser.mockResolvedValue({ sent: [], skipped: ["email"] });
    await run();
    expect(releaseCooldown).toHaveBeenCalledWith("user-1", "last_forecast_alert_at", "2026-11-13T00:00:00.000Z", null);
  });

  it("sends once when another evaluation already claimed it", async () => {
    forecastMin.mockResolvedValue({ minTempF: 20, cityName: null, hoursAhead: 24 });
    claimCooldown.mockResolvedValue({ claimed: false, claimedAt: null });
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
  });
});

describe("NWS freeze-warning alert", () => {
  const on: AlertSettings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, nwsFreezeAlertsEnabled: true };
  const here = { lat: 41.88, lon: -87.63, name: "Chicago" };
  const run = async (settings: AlertSettings = on) => {
    const { maybeSendNwsFreezeAlert } = await import("./alertNotifications");
    await maybeSendNwsFreezeAlert("user-1", "a@example.com", settings);
  };
  const warning = (headline: string, event = "Freeze Warning") => ({
    alerts: [{ event, headline, severity: "Moderate", expires: null }],
    lat: here.lat,
    lon: here.lon,
  });

  it("alerts with the NWS headline for the user's location", async () => {
    snapshot.mockResolvedValue(here);
    nwsAlerts.mockResolvedValue(warning("Freeze Warning issued November 13 until 9 AM CST"));
    await run();
    expect(nwsAlerts).toHaveBeenCalledWith(41.88, -87.63);
    expect(sentKinds()).toEqual(["nws"]);
    expect(sentBody()).toBe("Freeze Warning issued November 13 until 9 AM CST");
  });

  it("falls back to the event name when the headline is blank", async () => {
    snapshot.mockResolvedValue(here);
    nwsAlerts.mockResolvedValue(warning("  ", "Hard Freeze Warning"));
    await run();
    expect(sentBody()).toBe("Hard Freeze Warning");
  });

  it("stays quiet with no freeze-related warning", async () => {
    snapshot.mockResolvedValue(here);
    nwsAlerts.mockResolvedValue({ alerts: [], lat: here.lat, lon: here.lon });
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("doesn't query NWS without coordinates", async () => {
    snapshot.mockResolvedValue({ name: "Somewhere", lat: null, lon: null });
    await run();
    expect(nwsAlerts).not.toHaveBeenCalled();
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("is off unless enabled, needs the plan, and respects the cooldown", async () => {
    snapshot.mockResolvedValue(here);
    nwsAlerts.mockResolvedValue(warning("Freeze Warning"));
    await run({ ...on, nwsFreezeAlertsEnabled: false });
    await run({ ...on, lastNwsAlertAt: hoursAgo(1) });
    entitlements.value = { ...entitlements.value, canUseNwsAlerts: false };
    await run();
    expect(notifyUser).not.toHaveBeenCalled();
  });
});

describe("device health alerts", () => {
  const device = (name: string, meta: Record<string, unknown>, extra: Partial<DeviceWithSensors> = {}) =>
    ({ id: name, name, source: "push", enabled: true, meta, sensors: [], ...extra }) as unknown as DeviceWithSensors;
  const on: AlertSettings = {
    ...DEFAULT_ALERT_SETTINGS,
    enabled: true,
    batteryAlertsEnabled: true,
    batteryThresholdPct: 20,
    rssiAlertsEnabled: true,
    rssiThreshold: -80,
  };
  const run = async (devices: DeviceWithSensors[], settings: AlertSettings = on) => {
    const { maybeSendDeviceHealthAlerts } = await import("./alertNotifications");
    await maybeSendDeviceHealthAlerts("user-1", "a@example.com", devices, settings, "https://probeharbor.test");
  };

  it("sends one battery alert naming every low device, with a snooze link", async () => {
    await run([device("Garage", { battery_pct: 12 }), device("Attic", { battery_pct: 18 }), device("Shed", { battery_pct: 80 })]);
    expect(sentKinds()).toEqual(["battery"]);
    expect(sentBody()).toContain("Garage");
    expect(sentBody()).toContain("Attic");
    expect(sentBody()).not.toContain("Shed");
    expect(notifyUser.mock.calls[0]![4]).toEqual({ snoozeUrl: "https://probeharbor.test/snooze/x" });
    expect(claimCooldown).toHaveBeenCalledWith("user-1", "last_battery_alert_at", null);
  });

  it("sends a weak-signal alert at or below the RSSI threshold", async () => {
    await run([device("Crawlspace", { rssi: -84 }), device("Kitchen", { rssi: -60 })]);
    expect(sentKinds()).toEqual(["rssi"]);
    expect(sentBody()).toContain("Crawlspace");
    expect(sentBody()).not.toContain("Kitchen");
  });

  it("sends nothing when every device is healthy or reports neither value", async () => {
    await run([device("Garage", { battery_pct: 90, rssi: -55 }), device("Old feed", {})]);
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("doesn't repeat a battery alert inside its cooldown, but still checks signal", async () => {
    await run([device("Garage", { battery_pct: 10, rssi: -90 })], { ...on, lastBatteryAlertAt: hoursAgo(1) });
    expect(sentKinds()).toEqual(["rssi"]);
  });

  it("ignores the demo feed", async () => {
    await run([device("Example feed", { battery_pct: 5, rssi: -95, demo: true }, { source: "pull_url", feed_url: "https://probeharbor.dev/api/feeds/example" } as Partial<DeviceWithSensors>)]);
    expect(notifyUser).not.toHaveBeenCalled();
  });

  it("does nothing when alerts are off", async () => {
    await run([device("Garage", { battery_pct: 5, rssi: -95 })], { ...on, enabled: false });
    expect(notifyUser).not.toHaveBeenCalled();
  });
});
