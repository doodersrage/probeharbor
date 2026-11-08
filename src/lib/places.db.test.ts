import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { fetchCrossPropertySnapshots } from "./crossProperty";
import {
  collectFreezeMapSnapshots,
  countFreezeMapOptIns,
  getHouseholdFreezeMapSettings,
  listFreezeMapSparklines,
  listLatestFreezeMapSnapshots,
  pruneFreezeMapSnapshots,
  updateHouseholdFreezeMapSettings,
} from "./freezeMap";
import { addHouseholdMemberByUserId } from "./households";
import { fetchReferenceSensorChartPoints } from "./houseContext";
import { getIndoorReferenceSensorId, updateIndoorReferenceSensor } from "./indoorReference";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function sensorWithReading(householdId: string, kind: "temperature" | "flood", value: number | boolean, minutesAgo = 5) {
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source, last_seen_at) values ($1, 'P', 'push', now()) returning id",
    [householdId],
  );
  const [s] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind) values ($1, $2, 'Probe', $2) returning id",
    [d!.id, kind],
  );
  await sql(
    `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num, value_bool)
     values ($1, $2, now() - ($3 || ' minutes')::interval, $4, $5)`,
    [s!.id, householdId, minutesAgo, typeof value === "number" ? value : null, typeof value === "boolean" ? value : null],
  );
  return s!.id;
}

describe("freeze map (Neon)", () => {
  it("opted-in households are aggregated per city; the latest batch and sparklines read back; old batches prune", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const c = await home("c@example.com");
    await sensorWithReading(a.home, "temperature", 30);
    await sensorWithReading(b.home, "temperature", 40);
    await sensorWithReading(c.home, "temperature", 50);
    await updateHouseholdFreezeMapSettings(a.home, { optIn: true, cityId: null, lat: 42.36, lon: -71.06, label: "Boston" });
    await updateHouseholdFreezeMapSettings(b.home, { optIn: true, cityId: null, lat: 42.36, lon: -71.06, label: "Boston" });
    await updateHouseholdFreezeMapSettings(c.home, { optIn: true, cityId: null, lat: 42.36, lon: -71.06, label: "Boston" });
    const d = await home("d@example.com");
    await sensorWithReading(d.home, "temperature", 20);
    // d doesn't opt in.

    await expect(getHouseholdFreezeMapSettings(a.home)).resolves.toMatchObject({ optIn: true, lat: 42.36, label: "Boston" });
    await expect(countFreezeMapOptIns()).resolves.toBe(3);
    await expect(collectFreezeMapSnapshots()).resolves.toEqual({ cities: 1, error: null });
    const [snap] = await listLatestFreezeMapSnapshots();
    expect(snap).toMatchObject({ sample_count: 3, avg_temp_f: 40, min_temp_f: 30, freeze_risk_count: 1 });
    expect([...(await listFreezeMapSparklines()).values()]).toEqual([[40]]);

    await sql("update public.freeze_map_snapshots set captured_at = now() - interval '100 days'");
    await expect(pruneFreezeMapSnapshots(90)).resolves.toEqual({ deleted: 1, error: null });
  });

  it("a city below the sample floor yields no numbers, and its below-floor history never reaches a sparkline", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const lone = await home("lone@example.com");
    await sensorWithReading(a.home, "temperature", 31.5);
    await sensorWithReading(b.home, "temperature", 33.5);
    await sensorWithReading(lone.home, "temperature", 28.75);
    // Two homes in Burlington, one alone in Duluth: both below the floor of 3.
    for (const h of [a.home, b.home]) {
      await updateHouseholdFreezeMapSettings(h, { optIn: true, cityId: null, lat: 44.48, lon: -73.21, label: "Burlington" });
    }
    await updateHouseholdFreezeMapSettings(lone.home, { optIn: true, cityId: null, lat: 46.7867, lon: -92.1005, label: "Duluth" });

    await expect(collectFreezeMapSnapshots()).resolves.toEqual({ cities: 2, error: null });
    // The raw rows still hold the aggregates (internal only)...
    const [raw] = await sql<{ avg_temp_f: number }>(
      "select avg_temp_f from public.freeze_map_snapshots where city_label = 'Duluth'",
    );
    expect(raw!.avg_temp_f).toBe(28.75);
    // ...but the public read path never returns them.
    const rows = await listLatestFreezeMapSnapshots();
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row).toMatchObject({ avg_temp_f: null, min_temp_f: null, freeze_risk_count: 0, lat: null, lon: null, belowFloor: true });
    }
    // Custom locations below the floor don't even keep their (household-chosen) names.
    expect(rows.map((r) => [r.city_label, r.sample_count]).sort()).toEqual([["", 1], ["", 2]]);
    const json = JSON.stringify(rows);
    for (const leaked of ["28.75", "31.5", "33.5", "32.5", "46.7867", "Burlington", "Duluth"]) expect(json).not.toContain(leaked);
    await expect(listFreezeMapSparklines()).resolves.toEqual(new Map());

    // A third Burlington home brings it to the floor: the new snapshot shows,
    // but the older two-home point stays out of its sparkline.
    await sql("update public.freeze_map_snapshots set captured_at = now() - interval '1 hour'");
    const c = await home("c@example.com");
    await sensorWithReading(c.home, "temperature", 35.5);
    await updateHouseholdFreezeMapSettings(c.home, { optIn: true, cityId: null, lat: 44.48, lon: -73.21, label: "Burlington" });
    await expect(collectFreezeMapSnapshots()).resolves.toEqual({ cities: 2, error: null });
    const latest = await listLatestFreezeMapSnapshots();
    expect(latest[0]).toMatchObject({ city_label: "Burlington", sample_count: 3, avg_temp_f: 33.5, min_temp_f: 31.5 });
    expect(latest[1]).toMatchObject({ city_label: "", avg_temp_f: null, belowFloor: true });
    const sparks = await listFreezeMapSparklines();
    expect([...sparks.entries()]).toEqual([["geo:44.48,-73.21", [33.5]]]);
  });
});

describe("indoor reference sensor (Neon)", () => {
  it("only a temperature sensor from the same household can be chosen", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const mine = await sensorWithReading(a.home, "temperature", 60);
    const myFlood = await sensorWithReading(a.home, "flood", false);
    const theirs = await sensorWithReading(b.home, "temperature", 60);

    expect((await updateIndoorReferenceSensor(a.home, theirs)).error).toBeTruthy();
    expect((await updateIndoorReferenceSensor(a.home, myFlood)).error).toBeTruthy();
    await expect(getIndoorReferenceSensorId(a.home)).resolves.toBeNull();
    await expect(updateIndoorReferenceSensor(a.home, mine)).resolves.toEqual({ error: null });
    await expect(getIndoorReferenceSensorId(a.home)).resolves.toBe(mine);
    await updateIndoorReferenceSensor(a.home, null);
    await expect(getIndoorReferenceSensorId(a.home)).resolves.toBeNull();
  });

  it("the house reference line uses the household's sensor only", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const mine = await sensorWithReading(a.home, "temperature", 62, 30);
    const theirs = await sensorWithReading(b.home, "temperature", 99, 30);
    const points = await fetchReferenceSensorChartPoints(a.home, mine, 1);
    expect(points.map((p) => p.tempf)).toEqual([62]);
    await expect(fetchReferenceSensorChartPoints(a.home, theirs, 1)).resolves.toEqual([]);
  });
});

describe("cross-property snapshots (Neon)", () => {
  it("covers the user's households only, with coldest reading and leak state", async () => {
    const a = await home("a@example.com");
    const other = await home("other@example.com");
    const stranger = await home("stranger@example.com");
    await addHouseholdMemberByUserId(other.home, a.id, "viewer");
    await sensorWithReading(a.home, "temperature", 31);
    await sensorWithReading(other.home, "flood", true);
    await sensorWithReading(stranger.home, "temperature", 10);

    const { properties, error } = await fetchCrossPropertySnapshots(a.id);
    expect(error).toBeNull();
    expect(properties.map((p) => p.householdId).sort()).toEqual([a.home, other.home].sort());
    expect(properties.find((p) => p.householdId === a.home)).toMatchObject({ minTempF: 31, atRisk: true, deviceCount: 1 });
    expect(properties.find((p) => p.householdId === other.home)).toMatchObject({ floodWet: true, atRisk: true });
  });
});
