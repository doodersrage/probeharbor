/**
 * Alert pipeline integration tests: real evaluation, dwell sampling,
 * notifyUser, channel delivery, cooldowns, and the watchdog. Only the
 * database queries (src/lib/db/*, faked over in-memory tables), fetch, and
 * the weather context are faked. Any database call without a fake fails the
 * test, so the fakes below are exactly what the pipeline reads and writes.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;
type Fn = (...args: never[]) => unknown;

const h = vi.hoisted(() => {
  const unfaked = new Set<string>();
  const fakes: Record<string, Record<string, (...args: never[]) => unknown>> = {};
  /** The module's real exports, with every function routed to its fake (or a recorded failure). */
  function wrap(name: string, actual: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(actual)) {
      if (typeof value !== "function") {
        out[key] = value;
        continue;
      }
      out[key] = (...args: never[]) => {
        const fake = fakes[name]?.[key];
        if (fake) return fake(...args);
        unfaked.add(`${name}.${key}`);
        return Promise.reject(new Error(`db fake missing: ${name}.${key}`));
      };
    }
    return out;
  }
  return { unfaked, fakes, wrap };
});

vi.mock("./db/client", async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  query: (text: string) => {
    h.unfaked.add(`client.query: ${text.replace(/\s+/g, " ").slice(0, 80)}`);
    return Promise.reject(new Error("raw query in pipeline test"));
  },
}));
vi.mock("./userRecords", async (orig) => h.wrap("userRecords", await orig()));
vi.mock("./db/alertSettings", async (orig) => h.wrap("alertSettings", await orig()));
vi.mock("./db/alertEvents", async (orig) => h.wrap("alertEvents", await orig()));
vi.mock("./db/alertExtras", async (orig) => h.wrap("alertExtras", await orig()));
vi.mock("./db/readings", async (orig) => h.wrap("readings", await orig()));
vi.mock("./db/devices", async (orig) => h.wrap("devices", await orig()));
vi.mock("./db/ingest", async (orig) => h.wrap("ingest", await orig()));
vi.mock("./db/households", async (orig) => h.wrap("households", await orig()));
vi.mock("./db/admin", async (orig) => h.wrap("admin", await orig()));
vi.mock("./db/emailJobs", async (orig) => h.wrap("emailJobs", await orig()));
vi.mock("./db/billing", async (orig) => h.wrap("billing", await orig()));
vi.mock("./db/doors", async (orig) => h.wrap("doors", await orig()));
vi.mock("./db/pushTokens", async (orig) => h.wrap("pushTokens", await orig()));
vi.mock("./db/jobs", async (orig) => h.wrap("jobs", await orig()));
vi.mock("./db/remaining", async (orig) => h.wrap("remaining", await orig()));
vi.mock("./db/places", async (orig) => h.wrap("places", await orig()));
vi.mock("./db/userMetadata", async (orig) => h.wrap("userMetadata", await orig()));
vi.mock("./db/householdTools", async (orig) => h.wrap("householdTools", await orig()));
vi.mock("./db/thermostats", async (orig) => h.wrap("thermostats", await orig()));
vi.mock("./db/pucks", async (orig) => h.wrap("pucks", await orig()));
vi.mock("./db/history", async (orig) => h.wrap("history", await orig()));
vi.mock("./db/access", async (orig) => h.wrap("access", await orig()));
vi.mock("./db/accounts", async (orig) => h.wrap("accounts", await orig()));
vi.mock("./db/shareLinks", async (orig) => h.wrap("shareLinks", await orig()));
vi.mock("./db/statusPages", async (orig) => h.wrap("statusPages", await orig()));
vi.mock("./db/deviceActions", async (orig) => h.wrap("deviceActions", await orig()));
vi.mock("./db/freezeSubscriptions", async (orig) => h.wrap("freezeSubscriptions", await orig()));
vi.mock("./db/referrals", async (orig) => h.wrap("referrals", await orig()));
vi.mock("./db/legacyTempConfig", async (orig) => h.wrap("legacyTempConfig", await orig()));
// Weather/thermostat context is decoration on the alert body; keep it out.
vi.mock("./alertContext", () => ({ buildFreezeAlertContext: async () => null }));

/** In-memory tables the fakes read and write. */
class MemDb {
  tables: Record<string, Row[]> = {};
  users = new Map<string, { id: string; email?: string; user_metadata?: Row }>();
  private nextId = 1;

  table(name: string): Row[] {
    this.tables[name] ??= [];
    return this.tables[name];
  }

  seed(name: string, rows: Row[]): void {
    for (const row of rows) this.table(name).push({ id: this.nextId++, created_at: new Date().toISOString(), ...row });
  }

  insert(name: string, row: Row): Row {
    const stored = { id: this.nextId++, created_at: new Date().toISOString(), ...row };
    this.table(name).push(stored);
    return stored;
  }
}

let db: MemDb;

const ms = (iso: unknown) => (typeof iso === "string" ? Date.parse(iso) : Number.NaN);
const newestFirst = (a: Row, b: Row) => ms(b.created_at) - ms(a.created_at) || Number(b.id) - Number(a.id);

/** What the unhandled-alert SQL (db/alertEvents unhandledSql) selects. */
function isUnhandled(event: Row, informational: readonly string[], safety: readonly string[]): boolean {
  const sent = (event.channels_sent as string[] | undefined) ?? [];
  const kind = String(event.kind);
  return event.acknowledged_at == null && !informational.includes(kind) && (sent.length > 0 || safety.includes(kind));
}

function settingsRow(userId: unknown): Row | undefined {
  return db.table("alert_settings").find((row) => row.user_id === userId);
}

/** Readings of one sensor, oldest first, matching `keep`. */
function readingsOf(sensorId: string, keep: (row: Row) => boolean): Row[] {
  return db
    .table("sensor_readings")
    .filter((row) => row.sensor_id === sensorId && keep(row))
    .sort((a, b) => ms(a.recorded_at) - ms(b.recorded_at));
}

function sensorsOf(deviceId: unknown): Row[] {
  return db.table("device_sensors").filter((sensor) => sensor.device_id === deviceId);
}

function installFakes() {
  const f = h.fakes;
  for (const key of Object.keys(f)) delete f[key];

  f.userRecords = {
    getUserRecord: async (userId: string) => {
      const user = db.users.get(userId);
      return user ? { app_metadata: {}, user_metadata: {}, ...user } : null;
    },
  } as Record<string, Fn>;

  f.alertSettings = {
    getAlertSettingsRow: async (userId: string) => {
      const row = settingsRow(userId);
      return row ? { ...row } : null;
    },
    insertDefaultAlertSettings: async (userId: string, row: Row) => {
      if (!settingsRow(userId)) db.table("alert_settings").push({ ...row, user_id: userId });
    },
    saveAlertSettingsRow: async (userId: string, row: Row) => {
      const existing = settingsRow(userId);
      if (existing) Object.assign(existing, row);
      else db.table("alert_settings").push({ ...row, user_id: userId });
      return { error: null };
    },
    markCooldown: async (userId: string, field: string, defaults: Row) => {
      const now = new Date().toISOString();
      const existing = settingsRow(userId);
      if (existing) Object.assign(existing, { [field]: now, updated_at: now });
      else db.table("alert_settings").push({ ...defaults, user_id: userId, [field]: now, updated_at: now });
    },
    // Compare-and-set, as the SQL: wins only when the stored stamp still equals `previous`.
    claimCooldown: async (userId: string, field: string, previous: string | null) => {
      const now = new Date().toISOString();
      const row = settingsRow(userId);
      const current = (row?.[field] as string | null | undefined) ?? null;
      const same = current === null || previous === null ? current === previous : ms(current) === ms(previous);
      if (row && same) {
        Object.assign(row, { [field]: now, updated_at: now });
        return { claimed: true, claimedAt: now };
      }
      const previousMs = previous ? ms(previous) : Number.NEGATIVE_INFINITY;
      if (row && Number.isFinite(ms(current)) && ms(current) > previousMs) return { claimed: false, claimedAt: null };
      return { claimed: true, claimedAt: null };
    },
    releaseCooldown: async (userId: string, field: string, claimedAt: string, previous: string | null) => {
      const row = settingsRow(userId);
      if (row && ms(row[field]) === ms(claimedAt)) row[field] = previous;
    },
    markEscalation: async (userId: string) => {
      const row = settingsRow(userId);
      if (row) row.last_escalation_at = new Date().toISOString();
    },
    recentAlertReachedAChannel: async (userId: string) =>
      db
        .table("alert_events")
        .filter((event) => event.user_id === userId)
        .sort(newestFirst)
        .slice(0, 25)
        .some((event) => ((event.channels_sent as string[]) ?? []).length > 0),
  } as Record<string, Fn>;

  f.alertEvents = {
    recordAlertEvent: async (input: {
      userId: string;
      kind: string;
      title: string;
      body: string;
      channelsSent: string[];
      channelsSkipped: string[];
      meta?: Row;
    }) =>
      db.insert("alert_events", {
        user_id: input.userId,
        kind: input.kind,
        title: input.title,
        body: input.body,
        channels_sent: [...input.channelsSent],
        channels_skipped: [...input.channelsSkipped],
        meta: input.meta ?? {},
        acknowledged_at: null,
      }).id,
    updateAlertEventChannels: async (eventId: number, userId: string, sent: string[], skipped: string[]) => {
      const event = db.table("alert_events").find((row) => row.id === eventId && row.user_id === userId);
      if (event) Object.assign(event, { channels_sent: [...sent], channels_skipped: [...skipped] });
    },
    listRecentAlertEvents: async (userId: string, limit: number) =>
      db
        .table("alert_events")
        .filter((event) => event.user_id === userId)
        .sort(newestFirst)
        .slice(0, limit)
        .map((event) => ({ ...event })),
    listRecentAlertEventsFiltered: async (
      userId: string,
      informational: readonly string[],
      safety: readonly string[],
      options: { limit: number; offset: number; kind?: string | null; kinds?: readonly string[] | null; unackedOnly?: boolean },
    ) => {
      const kindLike = options.kind?.trim().toLowerCase();
      const rows = db
        .table("alert_events")
        .filter(
          (event) =>
            event.user_id === userId &&
            (!kindLike || String(event.kind).toLowerCase().includes(kindLike)) &&
            (!options.kinds?.length || options.kinds.includes(String(event.kind))) &&
            (!options.unackedOnly || isUnhandled(event, informational, safety)),
        )
        .sort(newestFirst)
        .slice(options.offset, options.offset + options.limit + 1)
        .map((event) => ({ ...event }));
      return { events: rows.slice(0, options.limit), hasMore: rows.length > options.limit };
    },
    listRecentDeliveryAttempts: async (userId: string, limit: number) =>
      db
        .table("alert_events")
        .filter((event) => event.user_id === userId)
        .sort(newestFirst)
        .slice(0, limit)
        .map(({ created_at, channels_sent, channels_skipped }) => ({ created_at, channels_sent, channels_skipped })),
    hasUnhandledAlertOfKinds: async (
      userId: string,
      kinds: readonly string[],
      informational: readonly string[],
      safety: readonly string[],
    ) =>
      db
        .table("alert_events")
        .some(
          (event) =>
            event.user_id === userId && kinds.includes(String(event.kind)) && isUnhandled(event, informational, safety),
        ),
    autoResolveAlerts: async (
      userId: string,
      informational: readonly string[],
      safety: readonly string[],
      options: { kinds?: string[]; olderThanIso?: string; reason: string },
    ) => {
      const resolved = db
        .table("alert_events")
        .filter(
          (event) =>
            event.user_id === userId &&
            isUnhandled(event, informational, safety) &&
            (!options.kinds?.length || options.kinds.includes(String(event.kind))) &&
            (!options.olderThanIso || ms(event.created_at) < ms(options.olderThanIso)),
        );
      for (const event of resolved) {
        event.acknowledged_at = new Date().toISOString();
        event.meta = { ...(event.meta as Row), autoResolved: options.reason };
      }
      return { resolved: resolved.length, channels: [...new Set(resolved.flatMap((e) => e.channels_sent as string[]))] };
    },
  } as Record<string, Fn>;

  f.readings = {
    getRecentNumericReadings: async (sensorId: string, sinceIso: string) =>
      readingsOf(sensorId, (r) => ms(r.recorded_at) >= ms(sinceIso) && r.value_num != null).map((r) => r.value_num),
    getRecentNumericReadingSamples: async (sensorId: string, sinceIso: string) =>
      readingsOf(sensorId, (r) => ms(r.recorded_at) >= ms(sinceIso) && r.value_num != null).map((r) => ({
        at: r.recorded_at,
        tempF: r.value_num,
      })),
    getNumericReadingInWindow: async (sensorId: string, notBeforeIso: string, atOrBeforeIso: string) => {
      const row = readingsOf(
        sensorId,
        (r) => ms(r.recorded_at) >= ms(notBeforeIso) && ms(r.recorded_at) <= ms(atOrBeforeIso),
      ).at(-1);
      return row && typeof row.value_num === "number" ? { value: row.value_num, at: row.recorded_at } : null;
    },
    hasNumericReadingAboveSince: async (sensorId: string, sinceIso: string, thresholdF: number) =>
      readingsOf(sensorId, (r) => ms(r.recorded_at) >= ms(sinceIso) && Number(r.value_num) > thresholdF).length > 0,
    getDwellAnchor: async (sensorId: string, anchorSinceIso: string, cutoffIso: string) =>
      readingsOf(
        sensorId,
        (r) => ms(r.recorded_at) >= ms(anchorSinceIso) && ms(r.recorded_at) < ms(cutoffIso) && r.value_num != null,
      )
        .slice(-1)
        .map((r) => ({ at: r.recorded_at, tempF: r.value_num })),
    fetchRecentBoolReadings: async (sensorId: string, sinceIso: string) =>
      readingsOf(sensorId, (r) => ms(r.recorded_at) >= ms(sinceIso) && r.value_bool != null).map((r) => ({
        value: r.value_bool,
        recordedAt: r.recorded_at,
      })),
    // Latest reading per visible sensor on enabled devices, offsets applied, demo devices flagged.
    fetchLatestSensorValuesResult: async (householdId: string) => {
      const { isDemoDevice } = await import("./demoFeed");
      const { applySensorOffset } = await import("./sensorCalibration");
      const { reportIntervalMsFromMeta } = await import("./reportInterval");
      const rows = [];
      for (const device of db.table("devices").filter((d) => d.household_id === householdId && d.enabled)) {
        for (const sensor of sensorsOf(device.id).filter((s) => s.visible)) {
          const latest = readingsOf(String(sensor.id), () => true).at(-1);
          if (!latest) continue;
          const offset = typeof sensor.offset_num === "number" ? sensor.offset_num : 0;
          const numeric = sensor.kind === "temperature" || sensor.kind === "humidity";
          rows.push({
            sensor: { sort_order: 0, ...sensor },
            deviceName: device.name ?? "Device",
            deviceSpace: typeof device.space === "string" ? device.space : null,
            value_num:
              latest.value_num != null && numeric ? applySensorOffset(Number(latest.value_num), offset) : latest.value_num,
            value_bool: latest.value_bool,
            value_text: latest.value_text,
            recorded_at: latest.recorded_at,
            deviceDemo: isDemoDevice({
              source: device.source as string,
              pull_url: device.pull_url as string | null,
              meta: device.meta as Row | null,
            }),
            reportIntervalMs: reportIntervalMsFromMeta(device.meta as Row | null) ?? null,
          });
        }
      }
      return { rows, error: null };
    },
  } as Record<string, Fn>;

  f.devices = {
    listHouseholdDevices: async (householdId: string) => ({
      devices: db
        .table("devices")
        .filter((device) => device.household_id === householdId)
        .map((device) => ({
          source: "push",
          pull_url: null,
          last_seen_at: null,
          sort_order: 0,
          meta: {},
          ...device,
          sensors: sensorsOf(device.id).map((sensor) => ({ sort_order: 0, ...sensor })),
        })),
      error: null,
    }),
  } as Record<string, Fn>;

  f.households = {
    listHouseholdIdsForCron: async () => {
      const seen = new Map<string, string>();
      for (const member of db.table("household_members")) {
        if (member.role === "owner" && !seen.has(String(member.household_id))) {
          seen.set(String(member.household_id), String(member.user_id));
        }
      }
      return [...seen].map(([householdId, ownerUserId]) => ({ householdId, ownerUserId }));
    },
    listHouseholdMembers: async (householdId: string) => ({
      members: db.table("household_members").filter((member) => member.household_id === householdId),
      error: null,
    }),
  } as Record<string, Fn>;

  f.admin = {
    isUserInGroup: async () => false,
  } as Record<string, Fn>;

  f.emailJobs = {
    isSuppressed: async () => false,
  } as Record<string, Fn>;
}

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
  db = new MemDb();
  h.unfaked.clear();
  installFakes();
  fetchMock.mockReset().mockImplementation(async (url: string) =>
    url === DISCORD ? new Response(null, { status: 204 }) : new Response("not found", { status: 404 }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  // Every database call the pipeline made had a fake behind it.
  expect([...h.unfaked]).toEqual([]);
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

describe("demo (simulated) feed readings", () => {
  const DEMO_URL = "https://probeharbor.com/api/feeds/example";

  /** The example feed saved by "Try it with a demo feed", with a cold reading. */
  function seedDemoFeed(tempF = 20) {
    db.seed("devices", [
      {
        id: "dev-demo",
        household_id: HOUSE,
        name: "Example weather feed",
        source: "pull_url",
        pull_url: DEMO_URL,
        enabled: true,
        space: null,
        last_seen_at: null,
        sort_order: 1,
        meta: { pull_json_root: "temp" },
      },
    ]);
    db.seed("device_sensors", [
      { id: "sen-demo", device_id: "dev-demo", key: "0", label: "Probe 0", kind: "temperature", unit: "F", visible: true, offset_num: 0 },
    ]);
    db.seed("sensor_readings", [
      { sensor_id: "sen-demo", household_id: HOUSE, value_num: tempF, value_bool: null, value_text: null, recorded_at: minutesAgo(1) },
    ]);
  }

  /** The cron entry point (collectHistory) for one member. */
  async function cronThresholdPass() {
    const { maybeSendThresholdAlerts } = await import("./alertNotifications");
    const { listHouseholdDevices } = await import("./devices");
    const { devices } = await listHouseholdDevices(HOUSE);
    await maybeSendThresholdAlerts(USER, "owner@example.com", {}, [], [], [], HOUSE, devices, "en");
  }

  it("never sends a freeze alert from a demo feed (cron path)", async () => {
    seedHousehold();
    seedReadings([[1, 50]]); // the real probe is warm
    seedDemoFeed(20);

    await cronThresholdPass();

    expect(thresholdEvents()).toHaveLength(0);
    expect(discordPosts()).toBe(0);
  });

  it("still alerts on a cold real probe next to a demo feed, naming only the real probe", async () => {
    seedHousehold();
    seedReadings([[1, 28]]);
    seedDemoFeed(20);

    await cronThresholdPass();

    const events = thresholdEvents();
    expect(events).toHaveLength(1);
    expect(discordPosts()).toBe(1);
    const text = JSON.stringify(events[0]);
    expect(text).toContain("Garage");
    expect(text).not.toContain("Probe 0");
  });

  it("skips demo readings on the ingest path (fetchAlertSensorValues)", async () => {
    seedHousehold();
    seedReadings([[1, 50]]);
    seedDemoFeed(20);
    const { getAlertSettingsForUser } = await import("./notify");
    const { buildAlertReadingsFromLatestSensors, fetchAlertSensorValues, sendThresholdAlertsIfNeeded } =
      await import("./alertNotifications");

    const latest = await fetchAlertSensorValues(HOUSE);
    expect(latest.map((row) => row.sensor.id)).toEqual(["sen-1"]);
    await sendThresholdAlertsIfNeeded(
      USER,
      "owner@example.com",
      await getAlertSettingsForUser(USER),
      buildAlertReadingsFromLatestSensors(latest),
      HOUSE,
      { latestSensors: latest },
    );

    expect(thresholdEvents()).toHaveLength(0);
  });

  it("labels demo rows in the latest readings without hiding them from display", async () => {
    seedHousehold();
    seedReadings([[1, 50]]);
    seedDemoFeed(20);
    const { fetchLatestSensorValues } = await import("./sensorReadings");

    const latest = await fetchLatestSensorValues(HOUSE);
    const bySensor = Object.fromEntries(latest.map((row) => [row.sensor.id, row.deviceDemo]));
    expect(bySensor).toEqual({ "sen-1": false, "sen-demo": true });
  });

  it("does not fire a custom rule from demo readings", async () => {
    seedHousehold({
      rules: [{ id: "r1", name: "Cold", enabled: true, all: [{ type: "temp_below", value: 40 }] }],
    });
    seedReadings([[1, 50]]);
    seedDemoFeed(20);
    const { maybeSendRuleAlerts, buildAlertReadingsFromLatestSensors, fetchAlertSensorValues } =
      await import("./alertNotifications");
    const { getAlertSettingsForUser } = await import("./notify");
    const { listHouseholdDevices } = await import("./devices");
    const { devices } = await listHouseholdDevices(HOUSE);

    const readings = buildAlertReadingsFromLatestSensors(await fetchAlertSensorValues(HOUSE));
    await maybeSendRuleAlerts(USER, "owner@example.com", devices, await getAlertSettingsForUser(USER), readings, HOUSE);

    expect(db.table("alert_events").filter((e) => e.kind === "rule")).toHaveLength(0);
  });

  it("does not report a demo feed as a silent device, but still reports a real one", async () => {
    seedHousehold();
    seedDemoFeed(20);
    const { maybeSendRateAndOutageAlerts } = await import("./alertNotifications");
    const { getAlertSettingsForUser } = await import("./notify");
    const { listHouseholdDevices } = await import("./devices");
    const { devices } = await listHouseholdDevices(HOUSE);
    const settings = await getAlertSettingsForUser(USER);

    // Only the demo feed has never reported: nothing to say.
    const demoOnly = devices.filter((d) => d.id === "dev-demo");
    await maybeSendRateAndOutageAlerts(USER, "owner@example.com", demoOnly, settings, HOUSE);
    expect(db.table("alert_events").filter((e) => e.kind === "outage")).toHaveLength(0);

    // The real probe has never reported either: that one still alerts.
    await maybeSendRateAndOutageAlerts(USER, "owner@example.com", devices, settings, HOUSE);
    const outages = db.table("alert_events").filter((e) => e.kind === "outage");
    expect(outages).toHaveLength(1);
    expect(JSON.stringify(outages[0])).toContain("Garage probe");
    expect(JSON.stringify(outages[0])).not.toContain("Example weather feed");
  });

  it("the watchdog does not expect alerts for demo readings", async () => {
    seedHousehold();
    seedDemoFeed(20);
    const { runAlertDeliveryWatchdog } = await import("./alertDeliveryWatchdog");

    const watchdog = await runAlertDeliveryWatchdog();

    expect(watchdog.findings).toEqual([]);
    expect(watchdog.checked).toBe(0);
  });
});
