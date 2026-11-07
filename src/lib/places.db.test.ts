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
    // c doesn't opt in.

    await expect(getHouseholdFreezeMapSettings(a.home)).resolves.toMatchObject({ optIn: true, lat: 42.36, label: "Boston" });
    await expect(countFreezeMapOptIns()).resolves.toBe(2);
    await expect(collectFreezeMapSnapshots()).resolves.toEqual({ cities: 1, error: null });
    const [snap] = await listLatestFreezeMapSnapshots();
    expect(snap).toMatchObject({ sample_count: 2, avg_temp_f: 35, min_temp_f: 30, freeze_risk_count: 1 });
    expect([...(await listFreezeMapSparklines()).values()]).toEqual([[35]]);

    await sql("update public.freeze_map_snapshots set captured_at = now() - interval '100 days'");
    await expect(pruneFreezeMapSnapshots(90)).resolves.toEqual({ deleted: 1, error: null });
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
