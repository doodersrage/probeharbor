import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";
import {
  RAW_READING_RETENTION_DAYS,
  shouldRunDailyRetention,
} from "./retentionSchedule";

export { RAW_READING_RETENTION_DAYS, shouldRunDailyRetention } from "./retentionSchedule";


export type JobRun = {
  id: number;
  job_name: string;
  status: "running" | "success" | "error";
  started_at: string;
  finished_at: string | null;
  detail: Record<string, unknown>;
};

export async function startJobRun(
  jobName: string,
  detail: Record<string, unknown> = {},
): Promise<number | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("job_runs")
    .insert({
      job_name: jobName,
      status: "running",
      detail: detail as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to start job run:", error?.message);
    return null;
  }

  return data.id as number;
}

export async function finishJobRun(
  id: number | null,
  status: "success" | "error",
  detail: Record<string, unknown> = {},
): Promise<void> {
  if (id == null) return;
  const supabase = createServerClient();
  await supabase
    .from("job_runs")
    .update({
      status,
      finished_at: new Date().toISOString(),
      detail: detail as Json,
    })
    .eq("id", id);
}

export async function listRecentJobRuns(
  limit = 50,
): Promise<{ runs: JobRun[]; error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("job_runs")
    .select("id, job_name, status, started_at, finished_at, detail")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { runs: [], error: error.message };
  }

  return { runs: (data ?? []) as JobRun[], error: null };
}

/** Start of the UTC hour `retentionDays` before `now`, so an hour is never split across runs. */
export function retentionCutoff(retentionDays: number, now = new Date()): string {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - retentionDays);
  cutoff.setUTCMinutes(0, 0, 0);
  return cutoff.toISOString();
}

/**
 * Roll numeric readings older than retention into hourly rollups, then delete
 * the raw rows. Runs as one database transaction (roll_up_and_prune_readings),
 * so nothing is deleted without its rollup and there is no row cap. If the
 * function is missing or fails, nothing is deleted.
 */
export async function runSensorReadingRetention(
  retentionDays = RAW_READING_RETENTION_DAYS,
): Promise<{
  rolledUp: number;
  deleted: number;
  error: string | null;
}> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("roll_up_and_prune_readings", {
    p_cutoff: retentionCutoff(retentionDays),
  });

  if (error) {
    return { rolledUp: 0, deleted: 0, error: error.message };
  }

  const result = (data ?? {}) as { rolled_up?: number; deleted?: number };
  return { rolledUp: result.rolled_up ?? 0, deleted: result.deleted ?? 0, error: null };
}
