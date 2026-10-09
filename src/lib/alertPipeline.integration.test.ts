/**
 * Alert pipeline integration tests: real evaluation, dwell sampling,
 * notifyUser, channel delivery, cooldowns, and the watchdog. Only the
 * database (in-memory), fetch, and the weather context are faked.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeSupabase } from "../test/fakeSupabase";

let db: FakeSupabase;
vi.mock("./supabase", () => ({
  createServerClient: () => db,
  createAdminClient: () => db,
  createAuthClient: () => db,
  supabase: {},
}));
// Weather/thermostat context is decoration on the alert body; keep it out.
vi.mock("./alertContext", () => ({ buildFreezeAlertContext: async () => null }));

const DISCORD = "https://discord.com/api/webhooks/1/abc";
const USER = "user-1";
const HOUSE = "house-1";
const fetchMock = vi.fn();

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

function seedHousehold(options: { dwellMinutes?: number; rules?: unknown[] } = {}) {
  db.users.set(USER, { id: USER, email: "owner@example.com", user_metadata: {} });
  db.seed("households", [{ id: HOUSE, name: "Home" }]);
  db.seed("household_members", [{ household_id: HOUSE, user_id: USER, role: "owner" }]);
  db.seed("devices", [{ id: "dev-1", household_id: HOUSE, name: "Garage probe", enabled: true, space: null }]);
  db.seed("device_sensors", [
    { id: "sen-1", device_id: "dev-1", key: "t1", label: "Garage", kind: "temperature", unit: "F", visible: true, offset_num: 0 },
  ]);
  db.seed("alert_settings", [
    {
      user_id: USER,
      enabled: true,
      channel_email: false,
      channel_discord: true,
      discord_webhook_url: DISCORD,
      freeze_threshold_f: 32,
      freeze_dwell_minutes: options.dwellMinutes ?? 0,
      alert_rules: options.rules ?? [],
    },
  ]);
}

function seedReadings(points: Array<[minutesAgo: number, tempF: number]>) {
  db.seed(
    "sensor_readings",
    points.map(([ago, temp]) => ({
      sensor_id: "sen-1",
      household_id: HOUSE,
      value_num: temp,
      value_bool: null,
      value_text: null,
      recorded_at: minutesAgo(ago),
    })),
  );
}

/** One evaluation pass, the way ingest runs it for a household member. */
async function evaluateNow() {
  const { getAlertSettingsForUser } = await import("./notify");
  const { fetchLatestSensorValues } = await import("./sensorReadings");
  const { buildAlertReadingsFromLatestSensors, sendThresholdAlertsIfNeeded } = await import(
    "./alertNotifications"
  );
  const latest = await fetchLatestSensorValues(HOUSE);
  const settings = await getAlertSettingsForUser(USER);
  await sendThresholdAlertsIfNeeded(
    USER,
    "owner@example.com",
    settings,
    buildAlertReadingsFromLatestSensors(latest),
    HOUSE,
    { latestSensors: latest },
  );
}

const discordPosts = () => fetchMock.mock.calls.filter(([url]) => url === DISCORD).length;
const thresholdEvents = () => db.table("alert_events").filter((e) => e.kind === "threshold");

beforeEach(() => {
  db = new FakeSupabase();
  fetchMock.mockReset().mockImplementation(async (url: string) =>
    url === DISCORD ? new Response(null, { status: 204 }) : new Response("not found", { status: 404 }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("freeze alert pipeline", () => {
  it("delivers once for a cold probe, then holds the cooldown", async () => {
    seedHousehold();
    seedReadings([[1, 28]]);

    await evaluateNow();
    await evaluateNow();

    expect(discordPosts()).toBe(1);
    expect(thresholdEvents()).toHaveLength(1);
    expect(thresholdEvents()[0]!.channels_sent).toEqual(["discord"]);
    expect(db.table("alert_settings")[0]!.last_alert_sent_at).toEqual(expect.any(String));
  });

  it("still alerts after a test alert and a dashboard visit", async () => {
    seedHousehold();
    seedReadings([[1, 28]]);
    const { notifyUser, getAlertSettingsForUser, ensureAlertDeliveryEvidence } = await import("./notify");

    // What /api/user/alert-test does, then an Overview load.
    const settings = await getAlertSettingsForUser(USER);
    await notifyUser(USER, "owner@example.com", settings, {
      title: "ProbeHarbor test alert",
      body: "test",
      kind: "generic",
    });
    const evidence = await ensureAlertDeliveryEvidence(USER, await getAlertSettingsForUser(USER));
    expect(evidence.hasDelivery).toBe(true);

    await evaluateNow();

    expect(thresholdEvents()).toHaveLength(1);
    expect(discordPosts()).toBe(2);
  });

  it("meets a 30-minute dwell for a probe reporting every 20 minutes", async () => {
    seedHousehold({ dwellMinutes: 30 });
    seedReadings([
      [60, 30],
      [40, 30],
      [20, 29],
      [0, 28],
    ]);

    await evaluateNow();

    expect(thresholdEvents()).toHaveLength(1);
  });

  it("does not fire before the dwell when the probe was warm at the cutoff", async () => {
    seedHousehold({ dwellMinutes: 30 });
    seedReadings([
      [60, 30],
      [35, 40],
      [10, 29],
      [0, 28],
    ]);

    await evaluateNow();

    expect(thresholdEvents()).toHaveLength(0);
  });

  it("retries a dead webhook at most every 30 minutes, and the watchdog flags it", async () => {
    seedHousehold();
    seedReadings([
      [60, 29],
      [30, 28],
      [0, 28],
    ]);
    fetchMock.mockImplementation(async () => new Response("Unknown Webhook", { status: 404 }));

    await evaluateNow();
    await evaluateNow();

    const events = thresholdEvents();
    expect(events).toHaveLength(1);
    expect(events[0]!.channels_sent).toEqual([]);
    expect(events[0]!.channels_skipped).toContain("discord");
    expect(db.table("alert_settings")[0]!.last_alert_sent_at ?? null).toBeNull();

    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");
    const watchdog = await runAlertDeliveryWatchdog();
    expect(watchdog.findings).toEqual([
      expect.objectContaining({ userId: USER, householdId: HOUSE, reason: "delivery_failed" }),
    ]);
  });

  it("does not let a custom rule alert silence the freeze alert", async () => {
    seedHousehold({
      rules: [
        { id: "r1", name: "Garage cold", enabled: true, all: [{ type: "temp_below", value: 50 }] },
      ],
    });
    seedReadings([[1, 28]]);
    const { maybeSendRuleAlerts } = await import("./alertNotifications");
    const { getAlertSettingsForUser } = await import("./notify");

    const { fetchLatestSensorValues } = await import("./sensorReadings");
    const { buildAlertReadingsFromLatestSensors } = await import("./alertNotifications");
    const readings = buildAlertReadingsFromLatestSensors(await fetchLatestSensorValues(HOUSE));
    await maybeSendRuleAlerts(USER, "owner@example.com", [], await getAlertSettingsForUser(USER), readings, HOUSE);
    expect(db.table("alert_events").filter((e) => e.kind === "rule")).toHaveLength(1);

    await evaluateNow();

    expect(thresholdEvents()).toHaveLength(1);
  });
});
