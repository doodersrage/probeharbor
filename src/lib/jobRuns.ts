import * as neonJobs from "./db/jobs";
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

/**
 * A cron Worker stops after at most 15 minutes, so a run still "running"
 * after this long was killed (time limit, crash, deploy) before it could
 * record its result.
 */
export const ABANDONED_RUN_MS = 30 * 60 * 1000;

/**
 * Mark this job's runs stuck in "running" for over ABANDONED_RUN_MS as
 * errors, so Ops shows the failed run instead of one that never ends.
 * Best effort: returns how many were closed (0 on failure).
 */
export async function closeAbandonedJobRuns(jobName: string, now = Date.now()): Promise<number> {
  try {
    const closed = await neonJobs.closeAbandonedJobRuns(
      jobName,
      new Date(now).toISOString(),
      new Date(now - ABANDONED_RUN_MS).toISOString(),
      { abandoned: true, message: "Stopped before it finished (time limit, crash or deploy)." },
    );
    if (closed > 0) console.error(`job ${jobName}: ${closed} run(s) never finished; marked as errors`);
    return closed;
  } catch (error) {
    console.error("Failed to close abandoned job runs:", error);
    return 0;
  }
}

export async function startJobRun(
  jobName: string,
  detail: Record<string, unknown> = {},
): Promise<number | null> {
  await closeAbandonedJobRuns(jobName);
  try {
    return await neonJobs.startJobRun(jobName, detail);
  } catch (error) {
    console.error("Failed to start job run:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function finishJobRun(
  id: number | null,
  status: "success" | "error",
  detail: Record<string, unknown> = {},
): Promise<void> {
  if (id == null) return;
  return neonJobs.finishJobRun(id, status, detail);
}

export async function listRecentJobRuns(
  limit = 50,
): Promise<{ runs: JobRun[]; error: string | null }> {
  try {
    return { runs: await neonJobs.listRecentJobRuns(limit), error: null };
  } catch (error) {
    return { runs: [], error: error instanceof Error ? error.message : String(error) };
  }
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
  try {
    const result = await neonJobs.rollUpAndPruneReadings(retentionCutoff(retentionDays));
    return { rolledUp: result.rolled_up ?? 0, deleted: result.deleted ?? 0, error: null };
  } catch (error) {
    // The function runs as one transaction: if it fails, nothing was deleted.
    return { rolledUp: 0, deleted: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Job-run log rows are kept this long; every reader looks back 24 hours or at the latest 50 runs. */
export const JOB_RUN_KEEP_DAYS = 30;
/**
 * Snooze-link rows are kept this long after they expire, so an old link still
 * says "expired" rather than "invalid" for a month.
 */
export const SNOOZE_TOKEN_KEEP_DAYS_AFTER_EXPIRY = 30;
/** Rows deleted per table per daily run, so a backlog clears over a few days instead of in one big delete. */
export const HOUSEKEEPING_BATCH = 5000;

/**
 * Daily cleanup of tables that otherwise only grow: old job-run log rows and
 * long-expired snooze-link tokens. Bounded per run. Never touches readings
 * (see runSensorReadingRetention).
 */
export async function runHousekeeping(now = new Date()): Promise<{
  jobRuns: number;
  snoozeTokens: number;
  error: string | null;
}> {
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  let jobRuns = 0;
  let snoozeTokens = 0;
  try {
    jobRuns = await neonJobs.pruneJobRuns(daysAgo(JOB_RUN_KEEP_DAYS), HOUSEKEEPING_BATCH);
    snoozeTokens = await neonJobs.pruneExpiredSnoozeTokens(daysAgo(SNOOZE_TOKEN_KEEP_DAYS_AFTER_EXPIRY), HOUSEKEEPING_BATCH);
    return { jobRuns, snoozeTokens, error: null };
  } catch (error) {
    return { jobRuns, snoozeTokens, error: error instanceof Error ? error.message : String(error) };
  }
}

