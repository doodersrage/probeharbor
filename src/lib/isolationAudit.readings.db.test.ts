/**
 * Household-isolation audit (IMPLEMENTATION_PLAN.md, "Cross-household tests"):
 * src/lib/db/places.ts, history.ts, readings.ts, doors.ts, ingest.ts.
 *
 * One test per exported query that had no existing test proving another
 * household's data can't be read or changed through it. Each sets up two
 * households with look-alike data, acts for household A (or passes B's ids
 * to A's call) and checks B's rows are neither returned nor touched.
 *
 * Sensor- and device-scoped helpers (readings.ts, the door-reading lookups,
 * the ingest device writes and inserts, setIndoorReference) also take the
 * household and check it in SQL. The tests prove a neighbor's sensor or device
 * with the same key, label or times never mixes in, and that passing another
 * household's sensor or device id with A's household reads nothing and
 * changes nothing (defence in depth: today's callers only pass their own ids).
 */
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import * as doors from "./db/doors";
import * as history from "./db/history";
import * as ingest from "./db/ingest";
import * as places from "./db/places";
import * as readings from "./db/readings";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const ago = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/** A household with one device ("Garage") holding temperature, humidity and door sensors, same keys in every household. */
async function household(email: string) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  const householdId = m!.household_id;
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source, meta) values ($1, 'Garage', 'push', '{}') returning id",
    [householdId],
  );
  const deviceId = d!.id;
  const temp = (await ingest.upsertDeviceSensor(householdId, deviceId, "0", "Bay", "temperature", "F")).sensor!.id;
  const hum = (await ingest.upsertDeviceSensor(householdId, deviceId, "0", "Bay humidity", "humidity", "%")).sensor!.id;
  const door = (await ingest.upsertDeviceSensor(householdId, deviceId, "door1", "Side door", "door")).sensor!.id;
  return { userId, householdId, deviceId, temp, hum, door };
}

async function num(sensorId: string, householdId: string, at: string, value: number) {
  await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values ($1, $2, $3, $4)", [
    sensorId,
    householdId,
    at,
    value,
  ]);
}

async function bool(sensorId: string, householdId: string, at: string, value: boolean) {
  await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_bool) values ($1, $2, $3, $4)", [
    sensorId,
    householdId,
    at,
    value,
  ]);
}

async function doorEvent(householdId: string, openedAt: string, closedAt: string | null, label = "Side door") {
  await sql(
    `insert into public.door_open_events (household_id, label, opened_at, closed_at, duration_ms)
     values ($1, $2, $3, $4, $5)`,
    [householdId, label, openedAt, closedAt, closedAt ? Date.parse(closedAt) - Date.parse(openedAt) : null],
  );
}

// ---- places.ts -----------------------------------------------------------------

describe("isolation: places.ts", () => {
  it("updateFreezeMapSettings / getFreezeMapSettings change and read only the given household", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await places.updateFreezeMapSettings(b.householdId, { optIn: true, cityId: "b-city", lat: 1, lon: 2, label: "B" });
    await expect(
      places.updateFreezeMapSettings(a.householdId, { optIn: false, cityId: "a-city", lat: 3, lon: 4, label: "A" }),
    ).resolves.toEqual({ error: null });

    await expect(places.getFreezeMapSettings(b.householdId)).resolves.toEqual({
      freeze_map_opt_in: true,
      freeze_map_city_id: "b-city",
      freeze_map_lat: 1,
      freeze_map_lon: 2,
      freeze_map_label: "B",
    });
    await expect(places.getFreezeMapSettings(a.householdId)).resolves.toMatchObject({ freeze_map_city_id: "a-city" });
  });

  it("setIndoorReference / getIndoorReference touch only the given household", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await places.setIndoorReference(b.householdId, b.temp);
    await places.setIndoorReference(a.householdId, a.temp);
    await expect(places.getIndoorReference(b.householdId)).resolves.toBe(b.temp);
    await places.setIndoorReference(a.householdId, null);
    await expect(places.getIndoorReference(b.householdId)).resolves.toBe(b.temp);
    await expect(places.getIndoorReference(a.householdId)).resolves.toBeNull();
  });

  it("setIndoorReference refuses another household's sensor and leaves the setting as it was", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await places.setIndoorReference(a.householdId, a.temp);
    const result = await places.setIndoorReference(a.householdId, b.temp);
    expect(result.error).toBeTruthy();
    await expect(places.getIndoorReference(a.householdId)).resolves.toBe(a.temp);
    // Clearing still works.
    await expect(places.setIndoorReference(a.householdId, null)).resolves.toEqual({ error: null });
    await expect(places.getIndoorReference(a.householdId)).resolves.toBeNull();
  });

  it("householdSensorKind / householdSensor return nothing for another household's sensor", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await expect(places.householdSensorKind(a.householdId, b.temp)).resolves.toBeNull();
    await expect(places.householdSensor(a.householdId, b.temp)).resolves.toBeNull();
    await expect(places.householdSensorKind(a.householdId, a.temp)).resolves.toBe("temperature");
  });

  it("recentReadings: another household's sensor id passed with A's household returns nothing", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(a.temp, a.householdId, ago(5), 40);
    await num(b.temp, b.householdId, ago(5), 99);
    const rows = await places.recentReadings([a.householdId], [a.temp, b.temp], ago(60), 100, false);
    expect(rows.map((r) => [r.household_id, r.value_num])).toEqual([[a.householdId, 40]]);
  });

  it("devicesForHouseholds / sensorsOfKinds list only the ids given", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const devices = await places.devicesForHouseholds([a.householdId]);
    expect(devices.map((d) => d.id)).toEqual([a.deviceId]);
    const sensors = await places.sensorsOfKinds([a.deviceId], ["temperature"]);
    expect(sensors.map((s) => s.id)).toEqual([a.temp]);
    expect(sensors.some((s) => s.id === b.temp)).toBe(false);
  });

  it("sensorBucketAverages: another household's sensor id returns no buckets", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(b.temp, b.householdId, ago(30), 99);
    await expect(places.sensorBucketAverages(a.householdId, b.temp, ago(120), ago(0), 3600)).resolves.toEqual([]);
  });
});

// ---- history.ts ----------------------------------------------------------------

describe("isolation: history.ts", () => {
  it("fetchHumidityRowsAt: another household's humidity at the very same time is not paired", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const at = ago(10);
    await num(a.hum, a.householdId, at, 50);
    await num(b.hum, b.householdId, at, 99);
    const { rows, error } = await history.fetchHumidityRowsAt(a.householdId, [at]);
    expect(error).toBeNull();
    expect(rows.map((r) => r.value_num)).toEqual([50]);
  });

  it("countTemperatureHistoryRows / fetchTemperatureHistoryPage: same device name and probe key in B don't count", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(a.temp, a.householdId, ago(10), 40);
    await num(b.temp, b.householdId, ago(10), 99);
    await num(b.temp, b.householdId, ago(20), 98);
    const filters = { feedName: "Garage", probeKey: "0" };
    await expect(history.countTemperatureHistoryRows(a.householdId, filters)).resolves.toEqual({ count: 1, error: null });
    const page = await history.fetchTemperatureHistoryPage(a.householdId, filters, 0, 50);
    expect(page.rows.map((r) => r.value_num)).toEqual([40]);
  });

  it("listChartSensors / countChartSensors: only the household's sensors", async () => {
    const a = await household("a@example.com");
    await household("b@example.com");
    const sensors = await history.listChartSensors(a.householdId);
    expect(sensors?.map((s) => s.id).sort()).toEqual([a.temp, a.hum].sort());
    await expect(history.countChartSensors(a.householdId)).resolves.toBe(2);
  });

  it("sensorBucketSamples: another household's sensor ids return nothing", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(a.temp, a.householdId, ago(10), 40);
    await num(b.temp, b.householdId, ago(10), 99);
    const rows = await history.sensorBucketSamples(a.householdId, [a.temp, b.temp], [a.temp, b.temp], ago(60), ago(0), 60);
    expect(rows?.map((r) => [r.sensor_id, r.value_num])).toEqual([[a.temp, 40]]);
  });

  it("fetchEarliestSensorReadingAt: an older reading in B is not A's earliest", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const mine = ago(60);
    await num(a.temp, a.householdId, mine, 40);
    await num(b.temp, b.householdId, ago(6000), 99);
    expect(Date.parse((await history.fetchEarliestSensorReadingAt(a.householdId))!)).toBe(Date.parse(mine));
  });

  it("temperatureReadingCounts: B's readings and rollups don't count, even with B's sensor ids passed", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(a.temp, a.householdId, ago(10), 30);
    await num(b.temp, b.householdId, ago(10), 20);
    await num(b.temp, b.householdId, ago(20), 20);
    const hour = new Date(Date.now() - 3 * 3600_000);
    hour.setUTCMinutes(0, 0, 0);
    await sql(
      `insert into public.sensor_reading_rollups (sensor_id, household_id, bucket_start, avg_num, max_num, sample_count)
       values ($1, $2, $3, 20, 20, 12)`,
      [b.temp, b.householdId, hour.toISOString()],
    );
    await expect(history.temperatureReadingCounts(a.householdId, ago(600), ago(0), 36, null)).resolves.toEqual({
      total_count: 1,
      below_count: 1,
      from_rollups: false,
    });
    await expect(history.temperatureReadingCounts(a.householdId, ago(600), ago(0), 36, [b.temp])).resolves.toEqual({
      total_count: 0,
      below_count: 0,
      from_rollups: false,
    });
  });
});

// ---- readings.ts (sensor + household scoped) -------------------------------------

describe("isolation: readings.ts", () => {
  it("numeric series, window, threshold and dwell lookups read only the given sensor", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(a.temp, a.householdId, ago(30), 40);
    await num(b.temp, b.householdId, ago(30), 99);
    await num(b.temp, b.householdId, ago(20), 98);

    const h = a.householdId;
    await expect(readings.getRecentNumericReadings(h, a.temp, ago(60))).resolves.toEqual([40]);
    expect((await readings.getRecentNumericReadingSamples(h, a.temp, ago(60))).map((s) => s.tempF)).toEqual([40]);
    await expect(readings.getNumericReadingInWindow(h, a.temp, ago(60), ago(0))).resolves.toMatchObject({ value: 40 });
    await expect(readings.hasNumericReadingAboveSince(h, a.temp, ago(60), 50)).resolves.toBe(false);
    expect((await readings.getDwellAnchor(h, a.temp, ago(60), ago(0))).map((s) => s.tempF)).toEqual([40]);
  });

  it("another household's sensor id passed with A's household reads nothing", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await num(b.temp, b.householdId, ago(30), 99);
    await bool(b.door, b.householdId, ago(30), true);
    const h = a.householdId;
    await expect(readings.getRecentNumericReadings(h, b.temp, ago(60))).resolves.toEqual([]);
    await expect(readings.getRecentNumericReadingSamples(h, b.temp, ago(60))).resolves.toEqual([]);
    await expect(readings.getNumericReadingInWindow(h, b.temp, ago(60), ago(0))).resolves.toBeNull();
    await expect(readings.hasNumericReadingAboveSince(h, b.temp, ago(60), 50)).resolves.toBe(false);
    await expect(readings.getDwellAnchor(h, b.temp, ago(60), ago(0))).resolves.toEqual([]);
    await expect(readings.fetchRecentBoolReadings(h, b.door, ago(60))).resolves.toEqual([]);
    // B's own household still reads them (the filter isn't simply "nothing").
    await expect(readings.getRecentNumericReadings(b.householdId, b.temp, ago(60))).resolves.toEqual([99]);
    await expect(readings.hasNumericReadingAboveSince(b.householdId, b.temp, ago(60), 50)).resolves.toBe(true);
  });

  it("fetchRecentBoolReadings reads only the given sensor", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await bool(a.door, a.householdId, ago(30), false);
    await bool(b.door, b.householdId, ago(20), true);
    expect((await readings.fetchRecentBoolReadings(a.householdId, a.door, ago(60))).map((r) => r.value)).toEqual([false]);
  });
});

// ---- doors.ts --------------------------------------------------------------------

describe("isolation: doors.ts", () => {
  it("savedSessionKeysSince / listDoorEvents / doorBandsOverlapping: only the household's sessions", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await doorEvent(a.householdId, ago(60), ago(50));
    await doorEvent(b.householdId, ago(40), ago(30));

    const keys = await doors.savedSessionKeysSince(a.householdId, ago(120));
    expect(keys).toHaveLength(1); // both households have a "Side door" session in the window
    const events = await doors.listDoorEvents(a.householdId, 50);
    expect(events.map((e) => e.household_id)).toEqual([a.householdId]);
    const bands = await doors.doorBandsOverlapping(a.householdId, ago(120), ago(0), 50);
    expect(bands).toHaveLength(1);
  });

  it("insertDoorSessions: a session matching one of B's (label + start) is saved for A; B's is untouched", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const opened = ago(60);
    const closed = ago(50);
    await doorEvent(b.householdId, opened, closed);
    await doors.insertDoorSessions([
      { household_id: a.householdId, sensor_id: a.door, label: "Side door", opened_at: opened, closed_at: closed, duration_ms: 600_000 },
    ]);
    const rows = await sql<{ household_id: string; sensor_id: string | null }>(
      "select household_id, sensor_id from public.door_open_events order by household_id",
    );
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.household_id === b.householdId)?.sensor_id).toBeNull();
    expect(rows.find((r) => r.household_id === a.householdId)?.sensor_id).toBe(a.door);
  });

  it("insertDoorSessions: a row naming B's sensor under A's household stores nothing (whole batch) and throws", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const session = (sensorId: string | null, openedAt: string) => ({
      household_id: a.householdId,
      sensor_id: sensorId,
      label: "Side door",
      opened_at: openedAt,
      closed_at: ago(5),
      duration_ms: 1,
    });
    await expect(doors.insertDoorSessions([session(a.door, ago(60)), session(b.door, ago(50))])).rejects.toThrow(
      /outside its household/,
    );
    expect(errors.mock.calls.flat().join(" ")).toContain(b.door);
    errors.mockRestore();
    await expect(sql("select 1 from public.door_open_events")).resolves.toEqual([]);
    // Own sensor and a null sensor are fine.
    await doors.insertDoorSessions([session(a.door, ago(60)), session(null, ago(40))]);
    const [n] = await sql<{ n: number }>("select count(*)::int as n from public.door_open_events");
    expect(n?.n).toBe(2);
  });

  it("findOpenStartBefore / lastDoorStateBefore read only the given sensor", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await bool(a.door, a.householdId, ago(100), true);
    // B's door closed after A's opened: must not cut A's open stretch short.
    await bool(b.door, b.householdId, ago(80), false);
    await bool(b.door, b.householdId, ago(70), true);

    const start = await doors.findOpenStartBefore(a.householdId, a.door, ago(10));
    expect(Math.abs(Date.parse(start!) - Date.parse(ago(100)))).toBeLessThan(5_000);
    await expect(doors.lastDoorStateBefore(a.householdId, a.door, ago(10))).resolves.toBe(true);
    await expect(doors.lastDoorStateBefore(a.householdId, a.door, ago(200))).resolves.toBeNull();
  });

  it("findOpenStartBefore / lastDoorStateBefore: B's door id with A's household reads nothing", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await bool(b.door, b.householdId, ago(100), true);
    await expect(doors.findOpenStartBefore(a.householdId, b.door, ago(10))).resolves.toBeNull();
    await expect(doors.lastDoorStateBefore(a.householdId, b.door, ago(10))).resolves.toBeNull();
    await expect(doors.lastDoorStateBefore(b.householdId, b.door, ago(10))).resolves.toBe(true);
  });
});

// ---- ingest.ts -------------------------------------------------------------------

describe("isolation: ingest.ts", () => {
  it("upsertDeviceSensor on A's device never returns or changes B's sensor with the same key", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await sql("update public.device_sensors set unit = 'C' where id = $1", [b.temp]);
    const found = await ingest.upsertDeviceSensor(a.householdId, a.deviceId, "0", "Bay", "temperature", "F");
    expect(found.sensor?.id).toBe(a.temp);
    const created = await ingest.upsertDeviceSensor(a.householdId, a.deviceId, "new", "New", "humidity", "%");
    expect(created.sensor?.device_id).toBe(a.deviceId);
    const [bSensor] = await sql<{ unit: string }>("select unit from public.device_sensors where id = $1", [b.temp]);
    expect(bSensor?.unit).toBe("C");
    const [n] = await sql<{ n: number }>("select count(*)::int as n from public.device_sensors where device_id = $1", [b.deviceId]);
    expect(n?.n).toBe(3);
  });

  it("upsertDeviceSensor with B's device under A's household neither returns, creates nor fixes a sensor", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await sql("update public.device_sensors set unit = 'C' where id = $1", [b.temp]);
    const existing = await ingest.upsertDeviceSensor(a.householdId, b.deviceId, "0", "Bay", "temperature", "F");
    expect(existing.sensor).toBeNull();
    expect(existing.error).toBeTruthy();
    const created = await ingest.upsertDeviceSensor(a.householdId, b.deviceId, "new", "New", "humidity", "%");
    expect(created.sensor).toBeNull();
    const rows = await sql<{ key: string; unit: string | null }>(
      "select key, unit from public.device_sensors where device_id = $1 order by key, kind",
      [b.deviceId],
    );
    expect(rows.map((r) => r.key)).toEqual(["0", "0", "door1"]);
    expect(rows.some((r) => r.unit === "F")).toBe(false); // the °C → °F fix didn't run on B's sensor
  });

  it("updateDeviceMeta / touchDeviceLastSeen / recordIngestStat with B's device under A's household change nothing", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const day = new Date().toISOString().slice(0, 10);
    await ingest.updateDeviceMeta(a.householdId, b.deviceId, { fw: "evil" }, true);
    await ingest.touchDeviceLastSeen(a.householdId, b.deviceId);
    await ingest.recordIngestStat(a.householdId, b.deviceId, true, day);
    const [bDevice] = await sql<{ meta: Record<string, unknown>; last_seen_at: string | null }>(
      "select meta, last_seen_at from public.devices where id = $1",
      [b.deviceId],
    );
    expect(bDevice).toEqual({ meta: {}, last_seen_at: null });
    await expect(sql("select 1 from public.ingest_stats")).resolves.toEqual([]);
  });

  it("insertSensorReadings: a batch with one row naming B's sensor under A's household stores nothing and errors", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await ingest.insertSensorReadings([
      { sensor_id: a.temp, household_id: a.householdId, value_num: 40 },
      { sensor_id: b.temp, household_id: a.householdId, value_num: 99 },
    ]);
    expect(result.error).toMatch(/outside its household/);
    expect(errors.mock.calls.flat().join(" ")).toContain(b.temp);
    errors.mockRestore();
    await expect(sql("select 1 from public.sensor_readings")).resolves.toEqual([]);
    // A's own sensor tagged with B's household is refused too.
    const swapped = await ingest.insertSensorReadings([{ sensor_id: a.temp, household_id: b.householdId, value_num: 1 }]);
    expect(swapped.error).toBeTruthy();
    await expect(sql("select 1 from public.sensor_readings")).resolves.toEqual([]);
  });

  it("insertSensorReadings: a valid batch is stored exactly as given", async () => {
    const a = await household("a@example.com");
    const at = ago(3);
    await expect(
      ingest.insertSensorReadings([
        { sensor_id: a.temp, household_id: a.householdId, recorded_at: at, value_num: 40.5, meta: { tempc: 4.7 } },
        { sensor_id: a.door, household_id: a.householdId, recorded_at: at, value_bool: true },
      ]),
    ).resolves.toEqual({ error: null });
    const rows = await sql<Record<string, unknown>>(
      `select sensor_id, household_id, (extract(epoch from recorded_at) * 1000)::float8 as recorded_ms,
              value_num, value_bool, value_text, meta
       from public.sensor_readings order by sensor_id = $1 desc`,
      [a.temp],
    );
    expect(rows).toEqual([
      { sensor_id: a.temp, household_id: a.householdId, recorded_ms: Date.parse(at), value_num: 40.5, value_bool: null, value_text: null, meta: { tempc: 4.7 } },
      { sensor_id: a.door, household_id: a.householdId, recorded_ms: Date.parse(at), value_num: null, value_bool: true, value_text: null, meta: {} },
    ]);
  });

  it("updateDeviceMeta / touchDeviceLastSeen change only the given device", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    await ingest.updateDeviceMeta(a.householdId, a.deviceId, { fw: "9.9" }, true);
    await ingest.touchDeviceLastSeen(a.householdId, a.deviceId);
    const [bDevice] = await sql<{ meta: Record<string, unknown>; last_seen_at: string | null }>(
      "select meta, last_seen_at from public.devices where id = $1",
      [b.deviceId],
    );
    expect(bDevice).toEqual({ meta: {}, last_seen_at: null });
  });

  it("listIngestStatsForHousehold: only the household's devices", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const day = new Date().toISOString().slice(0, 10);
    await ingest.recordIngestStat(a.householdId, a.deviceId, true, day);
    await ingest.recordIngestStat(b.householdId, b.deviceId, false, day);
    const rows = await ingest.listIngestStatsForHousehold(a.householdId, day);
    expect(rows.map((r) => [r.device_id, r.success_count, r.error_count])).toEqual([[a.deviceId, 1, 0]]);
  });
});
