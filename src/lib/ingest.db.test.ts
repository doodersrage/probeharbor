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
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));
const background = vi.hoisted(() => ({ labels: [] as string[] }));
vi.mock("./backgroundWork", () => ({
  runAfterResponse: async (_locals: unknown, label: string) => {
    background.labels.push(label);
  },
}));

import { POST } from "../pages/api/ingest/[deviceKey]";
import { findDeviceByIngestKeyHash, upsertDeviceSensor } from "./devices";
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
    await Promise.all(Array.from({ length: 20 }, (_, i) => recordIngestStat(dev.deviceId, i % 4 !== 0)));
    const [row] = await sql<{ success_count: number; error_count: number }>(
      "select success_count, error_count from public.ingest_stats where device_id = $1 and day = $2",
      [dev.deviceId, day],
    );
    expect(row).toEqual({ success_count: 15, error_count: 5 });
  });

  it("finds the device with its sensors in sort order; a duplicate key finds nothing", async () => {
    const dev = await pushDevice("a@example.com");
    await upsertDeviceSensor(dev.deviceId, "b", "B", "humidity");
    await upsertDeviceSensor(dev.deviceId, "a", "A", "temperature", "F");
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
    await upsertDeviceSensor(dev.deviceId, "t", "T", "temperature", "C");
    const result = await upsertDeviceSensor(dev.deviceId, "t", "T", "temperature", "F");
    expect(result.sensor?.unit).toBe("F");
    const [row] = await sql<{ unit: string }>("select unit from public.device_sensors where device_id = $1", [dev.deviceId]);
    expect(row?.unit).toBe("F");
  });

  it("a failing batch stores nothing", async () => {
    const dev = await pushDevice("a@example.com");
    const { sensor } = await upsertDeviceSensor(dev.deviceId, "t", "T", "temperature", "F");
    const result = await insertSensorReadings([
      { sensor_id: sensor!.id, household_id: dev.householdId, value_num: 40 },
      { sensor_id: "00000000-0000-4000-8000-000000000000", household_id: dev.householdId, value_num: 41 },
    ]);
    expect(result.error).toMatch(/sensor_readings/);
    const [n] = await sql<{ n: number }>("select count(*) as n from public.sensor_readings");
    expect(n?.n).toBe(0);
  });

  it("the admin list shows every device's counts", async () => {
    const a = await pushDevice("a@example.com");
    const b = await pushDevice("b@example.com");
    await recordIngestStat(a.deviceId, true);
    await recordIngestStat(b.deviceId, false);
    const rows = await listRecentIngestStatsAdmin();
    expect(rows.map((r) => [r.device_id, r.success_count, r.error_count]).sort()).toEqual(
      [
        [a.deviceId, 1, 0],
        [b.deviceId, 0, 1],
      ].sort(),
    );
  });
});
