/**
 * Neon versions of the scheduled-job queries: the job-run log (jobRuns.ts,
 * cronHealth.ts), raw-reading retention, stuck-sensor facts
 * (stuckSensors.ts) and feed uptime checks (feedUptimeMonitor.ts).
 *
 * Differences from the old Supabase code, all deliberate:
 * - The four stuck-sensor lookups per sensor are one query (same filters).
 */
import type { JobRun } from "../jobRuns";
import { query } from "./client";

// ---- job-run log ------------------------------------------------------------

/** Mark this job's "running" rows older than `beforeIso` as errors; returns how many. Throws on failure. */
export async function closeAbandonedJobRuns(jobName: string, finishedAtIso: string, beforeIso: string, detail: object): Promise<number> {
  const rows = await query(
    `update public.job_runs set status = 'error', finished_at = $2, detail = $4::jsonb
     where job_name = $1 and status = 'running' and started_at < $3 returning id`,
    [jobName, finishedAtIso, beforeIso, JSON.stringify(detail)],
  );
  return rows.length;
}

/** Throws on failure. */
export async function startJobRun(jobName: string, detail: object): Promise<number | null> {
  const [row] = await query<{ id: number }>(
    "insert into public.job_runs (job_name, status, detail) values ($1, 'running', $2::jsonb) returning id",
    [jobName, JSON.stringify(detail)],
  );
  return row?.id ?? null;
}

export async function finishJobRun(id: number, status: "success" | "error", detail: object): Promise<void> {
  try {
    await query("update public.job_runs set status = $2, finished_at = now(), detail = $3::jsonb where id = $1", [
      id,
      status,
      JSON.stringify(detail),
    ]);
  } catch (error) {
    console.error("Failed to finish job run:", error instanceof Error ? error.message : error);
  }
}

/** Throws on failure. */
export function listRecentJobRuns(limit: number): Promise<JobRun[]> {
  return query<JobRun>(
    `select id, job_name, status, started_at, finished_at, detail from public.job_runs
     order by started_at desc, id desc limit $1`,
    [limit],
  );
}

export async function lastSuccessfulRun(jobName: string, sinceIso: string): Promise<string | null> {
  try {
    const [row] = await query<{ started_at: string }>(
      `select started_at from public.job_runs
       where job_name = $1 and status = 'success' and started_at >= $2
       order by started_at desc limit 1`,
      [jobName, sinceIso],
    );
    return row?.started_at ?? null;
  } catch {
    return null;
  }
}

/** roll_up_and_prune_readings: one transaction, nothing deleted without its rollup. Throws on failure. */
export async function rollUpAndPruneReadings(cutoffIso: string): Promise<{ rolled_up?: number; deleted?: number }> {
  const [row] = await query<{ result: { rolled_up?: number; deleted?: number } | null }>(
    "select public.roll_up_and_prune_readings($1) as result",
    [cutoffIso],
  );
  return row?.result ?? {};
}

// ---- stuck sensors ----------------------------------------------------------

export type StuckFacts = {
  latest_value: number | null;
  latest_at: string | null;
  last_different_at: string | null;
  reported_before_window: boolean;
  samples_in_window: number;
};

/** Everything evaluateStuckSensor needs for one sensor, in one query. Throws on failure. */
export async function stuckSensorFacts(sensorId: string, windowStartIso: string, lookbackStartIso: string): Promise<StuckFacts | null> {
  const [row] = await query<StuckFacts>(
    `with latest as (
       select value_num, recorded_at from public.sensor_readings
       where sensor_id = $1 and value_num is not null
       order by recorded_at desc limit 1
     )
     select l.value_num as latest_value, l.recorded_at as latest_at,
            (select r.recorded_at from public.sensor_readings r
             where r.sensor_id = $1 and r.recorded_at >= $3 and r.value_num <> l.value_num
             order by r.recorded_at desc limit 1) as last_different_at,
            exists (select 1 from public.sensor_readings r where r.sensor_id = $1 and r.recorded_at < $2)
              as reported_before_window,
            (select count(*) from public.sensor_readings r where r.sensor_id = $1 and r.recorded_at >= $2)
              as samples_in_window
     from latest l`,
    [sensorId, windowStartIso, lookbackStartIso],
  );
  return row ?? null;
}

// ---- feed uptime ------------------------------------------------------------

export async function insertFeedUptimeChecks(
  rows: Array<{
    user_id: string;
    feed_id: string;
    feed_name: string;
    url: string;
    ok: boolean;
    message: string | null;
    latency_ms: number | null;
    checked_at: string;
  }>,
): Promise<void> {
  if (rows.length === 0) return;
  try {
    await query(
      `insert into public.feed_uptime_checks (user_id, feed_id, feed_name, url, ok, message, latency_ms, checked_at)
       select r.user_id, r.feed_id, r.feed_name, r.url, r.ok, r.message, r.latency_ms, r.checked_at
       from jsonb_to_recordset($1::jsonb) as r(user_id uuid, feed_id text, feed_name text, url text, ok boolean,
            message text, latency_ms integer, checked_at timestamptz)`,
      [JSON.stringify(rows)],
    );
  } catch (error) {
    console.error("Failed to store feed uptime checks:", error instanceof Error ? error.message : error);
  }
}

export async function lastOkFeedCheckAt(userId: string, feedId: string): Promise<string | null> {
  try {
    const [row] = await query<{ checked_at: string }>(
      `select checked_at from public.feed_uptime_checks
       where user_id = $1 and feed_id = $2 and ok order by checked_at desc limit 1`,
      [userId, feedId],
    );
    return row?.checked_at ?? null;
  } catch {
    return null;
  }
}

export async function markFeedUptimeAlert(userId: string): Promise<void> {
  try {
    await query(
      "update public.alert_settings set last_feed_uptime_alert_at = now(), updated_at = now() where user_id = $1",
      [userId],
    );
  } catch (error) {
    console.error("Failed to stamp feed uptime alert:", error instanceof Error ? error.message : error);
  }
}
