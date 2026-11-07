import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { fetchLastSuccessfulCollectHistory } from "./cronHealth";
import { listHouseholdDevices, upsertDeviceSensor } from "./devices";
import { storeFeedUptimeChecks } from "./feedUptimeMonitor";
import {
  ABANDONED_RUN_MS,
  closeAbandonedJobRuns,
  finishJobRun,
  listRecentJobRuns,
  runSensorReadingRetention,
  startJobRun,
} from "./jobRuns";
import { findStuckSensors } from "./stuckSensors";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'Garage', 'push') returning id",
    [m!.household_id],
  );
  return { userId, householdId: m!.household_id, deviceId: d!.id };
}

/** One reading every `stepMin` minutes over the last `hours`, value from `valueAt(i)`. */
async function series(sensorId: string, householdId: string, hours: number, stepMin: number, valueAt: (i: number) => number) {
  await sql(
    `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
     select $1, $2, now() - (g * $4 || ' minutes')::interval, $5::float8 + (case when $6 then g % 3 else 0 end)
     from generate_series(0, ($3 * 60 / $4)::int) g`,
    [sensorId, householdId, hours, stepMin, valueAt(0), valueAt(1) !== valueAt(0)],
  );
}

describe("job-run log (Neon)", () => {
  it("start, finish and list; abandoned runs are closed as errors, recent ones left alone", async () => {
    const id = await startJobRun("collect-history", { note: "test" });
    expect(typeof id).toBe("number");
    await finishJobRun(id, "success", { ok: 3 });
    await sql(
      `insert into public.job_runs (job_name, status, started_at) values
       ('collect-history', 'running', now() - $1::interval), ('collect-history', 'running', now())`,
      [`${ABANDONED_RUN_MS / 1000 + 60} seconds`],
    );

    await expect(closeAbandonedJobRuns("collect-history")).resolves.toBe(1);
    const { runs, error } = await listRecentJobRuns(10);
    expect(error).toBeNull();
    expect(runs.map((r) => r.status).sort()).toEqual(["error", "running", "success"]);
    expect(runs.find((r) => r.status === "error")?.detail).toMatchObject({ abandoned: true });
    expect(runs.find((r) => r.id === id)?.detail).toEqual({ ok: 3 });
    expect(await fetchLastSuccessfulCollectHistory()).toBeTruthy();
  });
});

describe("raw reading retention (Neon)", () => {
  it("rolls old readings into hourly rows, deletes only those, keeps recent ones", async () => {
    const h = await home("a@example.com");
    const t = (await upsertDeviceSensor(h.deviceId, "t", "Bay", "temperature", "F")).sensor!.id;
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values
       ($1, $2, date_trunc('hour', now() - interval '100 days') + interval '5 minutes', 30),
       ($1, $2, date_trunc('hour', now() - interval '100 days') + interval '35 minutes', 40),
       ($1, $2, now() - interval '1 day', 50)`,
      [t, h.householdId],
    );
    const result = await runSensorReadingRetention(90);
    expect(result).toMatchObject({ error: null, deleted: 2 });
    expect(await sql("select value_num from public.sensor_readings where sensor_id = $1", [t])).toEqual([{ value_num: 50 }]);
    const [rollup] = await sql<{ avg_num: number; sample_count: number; household_id: string }>(
      "select avg_num, sample_count, household_id from public.sensor_reading_rollups where sensor_id = $1",
      [t],
    );
    expect(rollup).toEqual({ avg_num: 35, sample_count: 2, household_id: h.householdId });
  });
});

describe("stuck sensors (Neon)", () => {
  it("flags a probe repeating one value for a day, not one that varies or one with too few samples", async () => {
    const h = await home("a@example.com");
    const stuck = (await upsertDeviceSensor(h.deviceId, "stuck", "Stuck", "temperature", "F")).sensor!.id;
    const live = (await upsertDeviceSensor(h.deviceId, "live", "Live", "temperature", "F")).sensor!.id;
    const sparse = (await upsertDeviceSensor(h.deviceId, "sparse", "Sparse", "temperature", "F")).sensor!.id;
    await series(stuck, h.householdId, 30, 30, () => 41);
    await series(live, h.householdId, 30, 30, (i) => 41 + i);
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values
       ($1, $2, now() - interval '30 hours', 41), ($1, $2, now() - interval '1 hour', 41)`,
      [sparse, h.householdId],
    );

    const { devices } = await listHouseholdDevices(h.householdId);
    const found = await findStuckSensors(devices);
    expect(found.map((s) => s.sensorId)).toEqual([stuck]);
  });
});

describe("feed uptime (Neon)", () => {
  it("stores each check for its user", async () => {
    const a = await home("a@example.com");
    await storeFeedUptimeChecks(a.userId, [
      { feedId: "f1", feedName: "Feed", url: "https://x/feed", ok: false, message: "timeout", checkedAt: new Date().toISOString() } as never,
      { feedId: "f1", feedName: "Feed", url: "https://x/feed", ok: true, message: null, checkedAt: new Date().toISOString() } as never,
    ]);
    const rows = await sql<{ ok: boolean; user_id: string }>("select ok, user_id from public.feed_uptime_checks order by id");
    expect(rows).toEqual([
      { ok: false, user_id: a.userId },
      { ok: true, user_id: a.userId },
    ]);
  });
});
