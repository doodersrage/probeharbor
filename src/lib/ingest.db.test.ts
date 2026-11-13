/**
 * The push-ingest endpoint end to end on the Neon path: a real request goes
 * through POST /api/ingest/[deviceKey] into Postgres. Only the after-response
 * work (alerts, webhooks, door history) is stubbed; those areas move later.
 */
import { createHash } from "node:crypto";
import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
const background = vi.hoisted(() => ({ labels: [] as string[] }));
vi.mock("./backgroundWork", () => ({
  runAfterResponse: async (_locals: unknown, label: string) => {
    background.labels.push(label);
  },
}));

import { POST } from "../pages/api/ingest/[deviceKey]";
import { findDeviceByIngestKeyHash, updateDeviceMeta, upsertDeviceSensor } from "./devices";
import { listIngestStatsForHousehold, listRecentIngestStatsAdmin, recordIngestStat } from "./ingestStats";
import { insertSensorReadings } from "./sensorReadings";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

let keyCounter = 0;
/** A household with one enabled push device; returns its plaintext key. */
async function pushDevice(email: string, options: { enabled?: boolean; meta?: object } = {}) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1",
    [userId],
  );
  const key = `test-key-${++keyCounter}-${email}`;
  const [d] = await sql<{ id: string }>(
    `insert into public.devices (household_id, name, source, ingest_key_hash, ingest_key_prefix, enabled, meta)
     values ($1, 'Garage probe', 'push', $2, 'tk', $3, $4) returning id`,
    [m!.household_id, sha256(key), options.enabled ?? true, JSON.stringify(options.meta ?? {})],
  );
  return { householdId: m!.household_id, deviceId: d!.id, key };
}

function ingest(key: string, body: unknown, userAgent = "ProbeHarbor-ESP32/1.2.5") {
  return POST({
    params: { deviceKey: "_" },
    request: new Request("https://example.com/api/ingest/_", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Ingest-Key": key, "User-Agent": userAgent },
      body: JSON.stringify(body),
    }),
    locals: {},
  } as unknown as APIContext);
}

const readingsOf = (deviceId: string) =>
  sql<{ key: string; kind: string; value_num: number | null; value_bool: boolean | null; household_id: string }>(
    `select s.key, s.kind, r.value_num, r.value_bool, r.household_id
     from public.sensor_readings r join public.device_sensors s on s.id = r.sensor_id
     where s.device_id = $1 order by s.key, s.kind`,
    [deviceId],
  );

beforeEach(() => {
  background.labels = [];
});

describe("POST /api/ingest on Neon", () => {
  it("stores a classic temperature + humidity upload under the device's household", async () => {
    const dev = await pushDevice("a@example.com");
    const response = await ingest(dev.key, { temp: { "0": { c: 5, f: 41, h: 40 } } });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, readings: 2 });
    expect(await readingsOf(dev.deviceId)).toEqual([
      { key: "0", kind: "humidity", value_num: 40, value_bool: null, household_id: dev.householdId },
      { key: "0", kind: "temperature", value_num: 41, value_bool: null, household_id: dev.householdId },
    ]);
    const [device] = await sql<{ last_seen_at: string | null }>("select last_seen_at from public.devices where id = $1", [
      dev.deviceId,
    ]);
    expect(device?.last_seen_at).not.toBeNull();
    expect(background.labels).toContain("Ingest webhooks/alerts");
  });

  it("creates each new sensor once and reuses it on the next upload", async () => {
    const dev = await pushDevice("a@example.com");
    const body = {
      sensors: [
        { key: "door1", kind: "door", bool: true, label: "Side door" },
        { key: "t1", kind: "temperature", value: 50 },
      ],
    };
    expect((await ingest(dev.key, body)).status).toBe(200);
    expect((await ingest(dev.key, body)).status).toBe(200);

    const sensors = await sql<{ key: string; kind: string; label: string }>(
      "select key, kind, label from public.device_sensors where device_id = $1 order by key",
      [dev.deviceId],
    );
    expect(sensors).toHaveLength(2);
    expect(sensors[0]).toMatchObject({ key: "door1", kind: "door", label: "Side door" });
    expect(await readingsOf(dev.deviceId)).toHaveLength(4);
  });

  it("rejects an unknown or disabled key without touching any household", async () => {
    const dev = await pushDevice("a@example.com", { enabled: false });
    expect((await ingest(dev.key, { temp: { "0": { c: 5, f: 41, h: 40 } } })).status).toBe(401);
    expect((await ingest("not-a-real-key", { temp: { "0": { c: 5, f: 41, h: 40 } } })).status).toBe(401);
    const [n] = await sql<{ n: number }>("select count(*) as n from public.sensor_readings");
    expect(n?.n).toBe(0);
  });

  it("keeps two households' devices apart", async () => {
    const a = await pushDevice("a@example.com");
    const b = await pushDevice("b@example.com");
    await ingest(a.key, { temp: { "0": { c: 5, f: 41, h: 40 } } });
    await ingest(b.key, { temp: { "0": { c: 20, f: 68, h: 55 } } });

    expect((await readingsOf(a.deviceId)).map((r) => [r.value_num, r.household_id])).toEqual([
      [40, a.householdId],
      [41, a.householdId],
    ]);
    expect((await readingsOf(b.deviceId)).map((r) => [r.value_num, r.household_id])).toEqual([
      [55, b.householdId],
      [68, b.householdId],
    ]);
  });

  it("counts successes and failures per device per day", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp: { "0": { c: 5, f: 41, h: 40 } } });
    await ingest(dev.key, { temp: { "0": { c: 5, f: 41, h: 40 } } });
    await ingest(dev.key, { nothing: "here" }); // no sensor values → 400, counted as an error

    const stats = await listIngestStatsForHousehold(dev.householdId);
    expect(stats).toEqual([
      {
        device_id: dev.deviceId,
        day: new Date().toISOString().slice(0, 10),
        success_count: 2,
        error_count: 1,
        device_name: "Garage probe",
      },
    ]);
  });

  it("merges device meta: firmware and client recorded, earlier keys kept", async () => {
    const dev = await pushDevice("a@example.com", { meta: { space_note: "keep me", firmware_version: "1.0.0" } });
    await ingest(dev.key, { temp: { "0": { c: 5, f: 41, h: 40 } }, fw: "1.2.5", rssi: -61 });

    const [device] = await sql<{ meta: Record<string, unknown> }>("select meta from public.devices where id = $1", [
      dev.deviceId,
    ]);
    expect(device?.meta.space_note).toBe("keep me");
    expect(device?.meta.rssi).toBe(-61);
  });
});

describe("ingest helpers on Neon", () => {
  it("parallel ingest counts are not lost", async () => {
    const dev = await pushDevice("a@example.com");
    const day = new Date().toISOString().slice(0, 10);
    await Promise.all(Array.from({ length: 20 }, (_, i) => recordIngestStat(dev.householdId, dev.deviceId, i % 4 !== 0)));
    const [row] = await sql<{ success_count: number; error_count: number }>(
      "select success_count, error_count from public.ingest_stats where device_id = $1 and day = $2",
      [dev.deviceId, day],
    );
    expect(row).toEqual({ success_count: 15, error_count: 5 });
  });

  it("finds the device with its sensors in sort order; a duplicate key finds nothing", async () => {
    const dev = await pushDevice("a@example.com");
    await upsertDeviceSensor(dev.householdId, dev.deviceId, "b", "B", "humidity");
    await upsertDeviceSensor(dev.householdId, dev.deviceId, "a", "A", "temperature", "F");
    await sql("update public.device_sensors set sort_order = case key when 'a' then 1 else 2 end where device_id = $1", [
      dev.deviceId,
    ]);

    const found = await findDeviceByIngestKeyHash(sha256(dev.key));
    expect(found).toMatchObject({ id: dev.deviceId, household_id: dev.householdId, enabled: true });
    expect(found?.sensors.map((s) => [s.key, s.kind, s.offset_num, s.visible])).toEqual([
      ["a", "temperature", 0, true],
      ["b", "humidity", 0, true],
    ]);

    // Two devices with the same key hash: refuse rather than pick one.
    await sql(
      `insert into public.devices (household_id, name, source, ingest_key_hash, enabled)
       values ($1, 'Clone', 'push', $2, true)`,
      [dev.householdId, sha256(dev.key)],
    );
    await expect(findDeviceByIngestKeyHash(sha256(dev.key))).resolves.toBeNull();
  });

  it("corrects a temperature sensor first saved as °C to °F", async () => {
    const dev = await pushDevice("a@example.com");
    await upsertDeviceSensor(dev.householdId, dev.deviceId, "t", "T", "temperature", "C");
    const result = await upsertDeviceSensor(dev.householdId, dev.deviceId, "t", "T", "temperature", "F");
    expect(result.sensor?.unit).toBe("F");
    const [row] = await sql<{ unit: string }>("select unit from public.device_sensors where device_id = $1", [dev.deviceId]);
    expect(row?.unit).toBe("F");
  });

  it("a non-temperature sensor keeps the unit it was saved with", async () => {
    const dev = await pushDevice("a@example.com");
    await upsertDeviceSensor(dev.householdId, dev.deviceId, "h", "H", "humidity", "%");
    const result = await upsertDeviceSensor(dev.householdId, dev.deviceId, "h", "H", "humidity", "F");
    expect(result.sensor?.unit).toBe("%");
    const [row] = await sql<{ unit: string }>("select unit from public.device_sensors where device_id = $1", [dev.deviceId]);
    expect(row?.unit).toBe("%");
  });

  it("device meta that isn't an object yet (column is not null) is replaced, not merged into", async () => {
    const dev = await pushDevice("a@example.com");
    await sql(`update public.devices set meta = '[]'::jsonb, last_seen_at = null where id = $1`, [dev.deviceId]);
    await updateDeviceMeta(dev.householdId, dev.deviceId, { firmware: "1.2.0" }, { touchLastSeen: false });
    const [row] = await sql<{ meta: unknown; last_seen_at: unknown }>("select meta, last_seen_at from public.devices where id = $1", [dev.deviceId]);
    expect(row?.meta).toEqual({ firmware: "1.2.0" });
    expect(row?.last_seen_at).toBeNull();
  });

  it("a failing batch stores nothing", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const dev = await pushDevice("a@example.com");
    const { sensor } = await upsertDeviceSensor(dev.householdId, dev.deviceId, "t", "T", "temperature", "F");
    const result = await insertSensorReadings([
      { sensor_id: sensor!.id, household_id: dev.householdId, value_num: 40 },
      { sensor_id: "00000000-0000-4000-8000-000000000000", household_id: dev.householdId, value_num: 41 },
    ]);
    // An unknown sensor is not a sensor of this household: the batch is refused before the insert.
    expect(result.error).toMatch(/outside its household/);
    const [n] = await sql<{ n: number }>("select count(*) as n from public.sensor_readings");
    expect(n?.n).toBe(0);
    errors.mockRestore();
  });

  it("the admin list shows every device's counts", async () => {
    const a = await pushDevice("a@example.com");
    const b = await pushDevice("b@example.com");
    await recordIngestStat(a.householdId, a.deviceId, true);
    await recordIngestStat(b.householdId, b.deviceId, false);
    const rows = await listRecentIngestStatsAdmin();
    expect(rows.map((r) => [r.device_id, r.success_count, r.error_count]).sort()).toEqual(
      [
        [a.deviceId, 1, 0],
        [b.deviceId, 0, 1],
      ].sort(),
    );
  });
});

describe("POST /api/ingest with device times (recorded_at)", () => {
  const timesOf = (deviceId: string) =>
    sql<{ key: string; value_num: number; epoch: number }>(
      `select s.key, r.value_num, extract(epoch from r.recorded_at)::float8 as epoch
       from public.sensor_readings r join public.device_sensors s on s.id = r.sensor_id
       where s.device_id = $1 and s.kind = 'temperature' order by r.recorded_at`,
      [deviceId],
    );
  // One base for the file, so two calls in a test never straddle a second.
  const base = Math.floor(Date.now() / 1000);
  const minutesAgo = (n: number) => base - n * 60;

  it("stores a single reading at the device's time, not the server's", async () => {
    const dev = await pushDevice("a@example.com");
    const at = minutesAgo(30);
    const response = await ingest(dev.key, { temp_c: 4.5, recorded_at: at });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, readings: 1 });
    const rows = await timesOf(dev.deviceId);
    expect(rows.map((r) => r.epoch)).toEqual([at]);
  });

  it("a resend after a lost reply stores nothing new and still answers 200", async () => {
    const dev = await pushDevice("a@example.com");
    const body = { temp_c: 4.5, recorded_at: minutesAgo(2) };
    await ingest(dev.key, body);
    const retry = await ingest(dev.key, body);

    expect(retry.status).toBe(200);
    expect(await retry.json()).toMatchObject({ ok: true, readings: 0, duplicates: 1 });
    expect(await timesOf(dev.deviceId)).toHaveLength(1);
    expect(background.labels).toEqual(["Ingest webhooks/alerts"]);
  });

  it("stores a buffered batch in time order, skipping bad items and items already stored", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp_c: 1, recorded_at: minutesAgo(50) });
    const response = await ingest(dev.key, {
      fw: "1.3.0",
      rssi: -70,
      readings: [
        { temp_c: 1, recorded_at: minutesAgo(50) },
        { temp_c: 2, recorded_at: minutesAgo(40) },
        { temp_c: 3 },
        { temp_c: 4, recorded_at: minutesAgo(5 * 24 * 60) },
        { temp_c: 5, recorded_at: new Date(minutesAgo(20) * 1000).toISOString() },
        { temp_c: 5, recorded_at: minutesAgo(20) },
      ],
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      readings: 2,
      duplicates: 2,
      rejected_entries: [
        { index: 2, reason: "invalid_recorded_at" },
        { index: 3, reason: "recorded_at_too_old" },
      ],
    });
    const rows = await timesOf(dev.deviceId);
    expect(rows.map((r) => [r.epoch, r.value_num])).toEqual([
      [minutesAgo(50), 1],
      [minutesAgo(40), 2],
      [minutesAgo(20), 5],
    ]);
    const [device] = await sql<{ meta: Record<string, unknown>; seen_ago_s: number }>(
      "select meta, extract(epoch from now() - last_seen_at)::float8 as seen_ago_s from public.devices where id = $1",
      [dev.deviceId],
    );
    expect(device?.meta.firmware_version).toBe("1.3.0");
    expect(device?.meta.rssi).toBe(-70);
    // Last seen is when the device got through, not its newest reading.
    expect(device?.seen_ago_s).toBeLessThan(60);
  });

  it("does not turn recorded_at into a sensor", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp_c: 4.5, recorded_at: minutesAgo(1) });

    const keys = await sql<{ key: string }>("select key from public.device_sensors where device_id = $1", [dev.deviceId]);
    expect(keys.map((k) => k.key)).not.toContain("recorded_at");
  });

  it("rejects a single reading with a bad time instead of storing it at server time", async () => {
    const dev = await pushDevice("a@example.com");
    const response = await ingest(dev.key, { temp_c: 4.5, recorded_at: "2026-11-13T10:00:00" });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid recorded_at",
      rejected_entries: [{ index: 0, reason: "invalid_recorded_at" }],
    });
    expect(await timesOf(dev.deviceId)).toEqual([]);
  });

  it("door history follows each door's newest state in a batch", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, {
      readings: [
        { door: false, recorded_at: minutesAgo(3) },
        { door: true, recorded_at: minutesAgo(10) },
      ],
    });
    expect(background.labels).toContain("Ingest door history");

    background.labels = [];
    await ingest(dev.key, {
      readings: [
        { door: false, recorded_at: minutesAgo(2) },
        { door: true, recorded_at: minutesAgo(1) },
      ],
    });
    expect(background.labels).not.toContain("Ingest door history");
  });

  it("still stores a SenML array body", async () => {
    const dev = await pushDevice("a@example.com");
    const response = await ingest(dev.key, [{ bn: "probe/", n: "0", u: "Cel", v: 18.5 }]);

    expect(response.status).toBe(200);
    expect(await timesOf(dev.deviceId)).toHaveLength(1);
  });

  it("without recorded_at, the same value twice is stored twice (unchanged)", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp_c: 4.5 });
    await ingest(dev.key, { temp_c: 4.5 });

    expect(await timesOf(dev.deviceId)).toHaveLength(2);
  });
});

describe("POST /api/ingest: certificate status from probe firmware 1.5.0+", () => {
  const metaOf = async (deviceId: string) =>
    (await sql<{ meta: Record<string, unknown> }>("select meta from public.devices where id = $1", [deviceId]))[0]!.meta;

  it("records tls unverified, keeps it while it lasts, and clears it once the probe verifies again", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp1: 40, fw: "1.5.0", tls: "unverified" });
    expect((await metaOf(dev.deviceId)).tls).toBe("unverified");

    const now = Math.floor(Date.now() / 1000);
    await ingest(dev.key, { fw: "1.5.0", tls: "unverified", readings: [{ temp1: 41, recorded_at: now }] });
    expect((await metaOf(dev.deviceId)).tls).toBe("unverified");

    await ingest(dev.key, { temp1: 42, fw: "1.5.0" });
    expect((await metaOf(dev.deviceId)).tls).toBeNull();
  });

  it("never writes it for clients that don't send it", async () => {
    const dev = await pushDevice("a@example.com");
    await ingest(dev.key, { temp1: 40 });
    expect("tls" in (await metaOf(dev.deviceId))).toBe(false);
  });
});
