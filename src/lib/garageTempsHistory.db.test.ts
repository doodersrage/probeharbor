import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { HISTORY_PAGE_ROWS } from "./db/history";
import { upsertDeviceSensor } from "./devices";
import {
  fetchAllGarageTempReadings,
  fetchEarliestSensorReadingAt,
  fetchGarageTempChartData,
  fetchGarageTempHistory,
  fetchHistoryFilterOptions,
  fetchRollupChartPointsForHousehold,
  householdHasTemperatureHistory,
} from "./garageTempsHistory";
import { fetchTemperatureReadingCounts } from "./readingCounts";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/** A user, their household, and one device with a temperature + humidity probe. */
async function setup(email: string, deviceName: string) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  const householdId = m!.household_id;
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, $2, 'push') returning id",
    [householdId, deviceName],
  );
  const temp = (await upsertDeviceSensor(householdId, d!.id, "0", "Bay", "temperature", "F")).sensor!.id;
  const hum = (await upsertDeviceSensor(householdId, d!.id, "0", "Bay humidity", "humidity", "%")).sensor!.id;
  return { userId, householdId, deviceId: d!.id, temp, hum };
}

async function pair(h: Awaited<ReturnType<typeof setup>>, at: string, tempF: number, humidity: number) {
  await sql(
    `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
     values ($1, $3, $4, $5), ($2, $3, $4, $6)`,
    [h.temp, h.hum, h.householdId, at, tempF, humidity],
  );
}

describe("History table (Neon)", () => {
  it("pages temperature readings newest first, with humidity paired, and counts them", async () => {
    const a = await setup("a@example.com", "Garage");
    const b = await setup("b@example.com", "Theirs");
    for (let i = 1; i <= 5; i += 1) await pair(a, minutesAgo(i * 10), 40 + i, 50 + i);
    await pair(b, minutesAgo(5), 99, 99);

    const page1 = await fetchGarageTempHistory(a.userId, 1, 2);
    expect(page1.error).toBeNull();
    expect(page1).toMatchObject({ totalCount: 5, totalPages: 3 });
    expect(page1.readings.map((r) => [r.tempf, r.humidity, r.feed_name])).toEqual([
      [41, 51, "Garage"],
      [42, 52, "Garage"],
    ]);
    const page3 = await fetchGarageTempHistory(a.userId, 3, 2);
    expect(page3.readings.map((r) => r.tempf)).toEqual([45]);
    await expect(householdHasTemperatureHistory(a.userId)).resolves.toBe(true);
  });

  it("filters by device, probe and time", async () => {
    const a = await setup("a@example.com", "Garage");
    const shed = await upsertDeviceSensor(
      a.householdId,
      (await sql<{ id: string }>("insert into public.devices (household_id, name, source) values ($1, 'Shed', 'push') returning id", [a.householdId]))[0]!.id,
      "7",
      "Shed probe",
      "temperature",
      "F",
    );
    await pair(a, minutesAgo(60), 40, 50);
    await pair(a, minutesAgo(10), 41, 51);
    await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values ($1, $2, $3, 30)", [
      shed.sensor!.id,
      a.householdId,
      minutesAgo(10),
    ]);

    expect((await fetchGarageTempHistory(a.userId, 1, 20, { feedName: "Shed" })).readings.map((r) => r.tempf)).toEqual([30]);
    expect((await fetchGarageTempHistory(a.userId, 1, 20, { probeKey: "0" })).totalCount).toBe(2);
    expect((await fetchGarageTempHistory(a.userId, 1, 20, { from: minutesAgo(30) })).totalCount).toBe(2);
    expect((await fetchGarageTempHistory(a.userId, 1, 20, { to: minutesAgo(30) })).readings.map((r) => r.tempf)).toEqual([40]);
  });
});

describe("full history for export (Neon)", () => {
  it("reads past one page without gaps or repeats, newest first", async () => {
    const a = await setup("a@example.com", "Garage");
    const total = HISTORY_PAGE_ROWS + 120;
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
       select $1, $2, now() - (g || ' seconds')::interval, g from generate_series(1, $3::int) g`,
      [a.temp, a.householdId, total],
    );
    const { readings, error } = await fetchAllGarageTempReadings(a.userId);
    expect(error).toBeNull();
    expect(readings).toHaveLength(total);
    expect(readings[0]?.tempf).toBe(1);
    expect(readings.at(-1)?.tempf).toBe(total);
    expect(new Set(readings.map((r) => r.timestamp)).size).toBe(total);
  });

  it("never includes another household's readings", async () => {
    const a = await setup("a@example.com", "Garage");
    const b = await setup("b@example.com", "Theirs");
    await pair(a, minutesAgo(5), 40, 50);
    await pair(b, minutesAgo(5), 99, 99);
    const { readings } = await fetchAllGarageTempReadings(a.userId);
    expect(readings.map((r) => r.feed_name)).toEqual(["Garage"]);
  });
});

describe("charts (Neon)", () => {
  it("sampled chart points come from the household's own sensors", async () => {
    const a = await setup("a@example.com", "Garage");
    const b = await setup("b@example.com", "Theirs");
    for (let i = 1; i <= 30; i += 1) await pair(a, minutesAgo(i * 20), 40 + (i % 5), 55);
    await pair(b, minutesAgo(30), 99, 99);

    const chart = await fetchGarageTempChartData(a.userId, 1);
    expect(chart.error).toBeNull();
    expect(chart.points.length).toBeGreaterThan(0);
    expect(chart.points.every((p) => p.device === "Garage" && p.tempf < 99)).toBe(true);
    expect(chart.points.some((p) => p.humidity === 55)).toBe(true);
  });

  it("rollup chart points pair temperature with humidity per hour, household only", async () => {
    const a = await setup("a@example.com", "Garage");
    const b = await setup("b@example.com", "Theirs");
    const hour = new Date(Date.now() - 48 * 3600_000);
    hour.setUTCMinutes(0, 0, 0);
    await sql(
      `insert into public.sensor_reading_rollups (sensor_id, household_id, bucket_start, avg_num, sample_count)
       values ($1, $3, $4, 38, 12), ($2, $3, $4, 61, 12), ($5, $6, $4, 99, 12)`,
      [a.temp, a.hum, a.householdId, hour.toISOString(), b.temp, b.householdId],
    );
    const points = await fetchRollupChartPointsForHousehold(a.householdId, minutesAgo(72 * 60));
    expect(points).toEqual([
      expect.objectContaining({ tempf: 38, humidity: 61, device: "Garage", probeLabel: "Bay" }),
    ]);
  });
});

describe("History helpers (Neon)", () => {
  it("filter options list the household's devices and temperature probes", async () => {
    const a = await setup("a@example.com", "Garage");
    await setup("b@example.com", "Theirs");
    await expect(fetchHistoryFilterOptions(a.userId)).resolves.toEqual({
      feeds: ["Garage"],
      probes: [{ key: "0", label: "Bay" }],
      error: null,
    });
  });

  it("earliest reading and below-threshold counts", async () => {
    const a = await setup("a@example.com", "Garage");
    const first = minutesAgo(300);
    await pair(a, first, 30, 50);
    await pair(a, minutesAgo(100), 35, 50);
    await pair(a, minutesAgo(10), 45, 50);

    expect(Date.parse((await fetchEarliestSensorReadingAt(a.householdId))!)).toBe(Date.parse(first));
    await expect(fetchTemperatureReadingCounts(a.householdId, minutesAgo(400), minutesAgo(0), 36)).resolves.toEqual({
      total: 3,
      below: 2,
      approximate: false,
    });
  });
});
