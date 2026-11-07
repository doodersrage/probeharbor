import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { MAX_SERIES_ROWS } from "./db/readings";
import { upsertDeviceSensor } from "./devices";
import {
  fetchLatestSensorValuesResult,
  fetchRecentBoolReadings,
  getFreezeDwellSamples,
  getNumericReadingInWindow,
  getRecentNumericReadings,
  getRecentNumericReadingSamples,
  hasNumericReadingAboveSince,
} from "./sensorReadings";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

async function home(email: string) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  return m!.household_id;
}

async function device(householdId: string, name: string, extra: { enabled?: boolean; meta?: object } = {}) {
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source, enabled, meta) values ($1, $2, 'push', $3, $4) returning id",
    [householdId, name, extra.enabled ?? true, JSON.stringify(extra.meta ?? {})],
  );
  return d!.id;
}

async function sensor(deviceId: string, key: string, kind: "temperature" | "humidity" | "door" = "temperature") {
  return (await upsertDeviceSensor(deviceId, key, key, kind, kind === "temperature" ? "F" : null)).sensor!.id;
}

async function reading(sensorId: string, householdId: string, at: string, value: number | boolean | null) {
  await sql(
    "insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num, value_bool) values ($1, $2, $3, $4, $5)",
    [sensorId, householdId, at, typeof value === "number" ? value : null, typeof value === "boolean" ? value : null],
  );
}

describe("latest value per sensor (Neon)", () => {
  it("only the household's visible sensors on enabled devices, newest value, offset applied", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const garage = await device(a, "Garage", { meta: { report_interval_ms: 60_000 } });
    const off = await device(a, "Unplugged", { enabled: false });
    const theirs = await device(b, "Theirs");

    const t = await sensor(garage, "t");
    const hidden = await sensor(garage, "hidden");
    const never = await sensor(garage, "never");
    const offT = await sensor(off, "t");
    const theirT = await sensor(theirs, "t");
    await sql("update public.device_sensors set offset_num = -1.5 where id = $1", [t]);
    await sql("update public.device_sensors set visible = false where id = $1", [hidden]);

    await reading(t, a, minutesAgo(10), 40);
    await reading(t, a, minutesAgo(1), 42);
    await reading(hidden, a, minutesAgo(1), 1);
    await reading(offT, a, minutesAgo(1), 2);
    await reading(theirT, b, minutesAgo(1), 99);

    const { rows, error } = await fetchLatestSensorValuesResult(a);
    expect(error).toBeNull();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      deviceName: "Garage",
      value_num: 40.5,
      deviceDemo: false,
      sensor: { id: t, key: "t", kind: "temperature", offset_num: -1.5 },
    });
    expect(rows[0]?.recorded_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?\+00:00$/);
    expect(rows.some((r) => r.sensor.id === never)).toBe(false);
  });

  it("flags demo devices", async () => {
    const a = await home("a@example.com");
    const demo = await device(a, "Demo", { meta: { demo: true } });
    await reading(await sensor(demo, "t"), a, minutesAgo(1), 30);
    const { rows } = await fetchLatestSensorValuesResult(a);
    expect(rows[0]?.deviceDemo).toBe(true);
  });
});

describe("reading series (Neon)", () => {
  it("returns every reading in the window oldest first, past Supabase's 1000-row limit", async () => {
    const a = await home("a@example.com");
    const s = await sensor(await device(a, "Probe"), "t");
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
       select $1, $2, now() - (g || ' minutes')::interval, g from generate_series(1, 1500) g`,
      [s, a],
    );
    const samples = await getRecentNumericReadingSamples(s, minutesAgo(2000));
    expect(samples).toHaveLength(1500);
    expect(samples[0]?.tempF).toBe(1500); // oldest
    expect(samples.at(-1)?.tempF).toBe(1); // newest
    expect(await getRecentNumericReadings(s, minutesAgo(100))).toHaveLength(99);
  });

  it("past the cap it keeps the newest rows, never the oldest", async () => {
    const a = await home("a@example.com");
    const s = await sensor(await device(a, "Chatty"), "t");
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
       select $1, $2, now() - (g || ' seconds')::interval, g from generate_series(1, $3::int) g`,
      [s, a, MAX_SERIES_ROWS + 50],
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const samples = await getRecentNumericReadingSamples(s, minutesAgo(24 * 60));
    expect(samples).toHaveLength(MAX_SERIES_ROWS);
    expect(samples.at(-1)?.tempF).toBe(1);
    expect(samples[0]?.tempF).toBe(MAX_SERIES_ROWS);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("window lookups and threshold probes", async () => {
    const a = await home("a@example.com");
    const s = await sensor(await device(a, "Probe"), "t");
    await reading(s, a, minutesAgo(180), 30);
    await reading(s, a, minutesAgo(120), 31);
    await reading(s, a, minutesAgo(30), 36);

    await expect(getNumericReadingInWindow(s, minutesAgo(200), minutesAgo(100))).resolves.toMatchObject({ value: 31 });
    await expect(getNumericReadingInWindow(s, minutesAgo(90), minutesAgo(60))).resolves.toBeNull();
    await expect(hasNumericReadingAboveSince(s, minutesAgo(60), 35)).resolves.toBe(true);
    await expect(hasNumericReadingAboveSince(s, minutesAgo(60), 36)).resolves.toBe(false);
  });

  it("freeze dwell: the last reading before the window, then the window", async () => {
    const a = await home("a@example.com");
    const s = await sensor(await device(a, "Pipe"), "t");
    await reading(s, a, minutesAgo(300), 33);
    await reading(s, a, minutesAgo(200), 31); // anchor: newest before the cutoff
    await reading(s, a, minutesAgo(50), 30);
    await reading(s, a, minutesAgo(10), 29);

    const samples = await getFreezeDwellSamples(s, minutesAgo(60));
    expect(samples.map((x) => x.tempF)).toEqual([31, 30, 29]);
  });

  it("door readings come back oldest first, ignoring rows with no state", async () => {
    const a = await home("a@example.com");
    const s = await sensor(await device(a, "Door"), "d", "door");
    await reading(s, a, minutesAgo(30), true);
    await reading(s, a, minutesAgo(20), null);
    await reading(s, a, minutesAgo(10), false);
    expect((await fetchRecentBoolReadings(s, minutesAgo(60))).map((r) => r.value)).toEqual([true, false]);
  });
});
