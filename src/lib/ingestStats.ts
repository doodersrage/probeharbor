import * as neonIngest from "./db/ingest";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Counts only for a device of `householdId` (checked in SQL). */
export async function recordIngestStat(
  householdId: string,
  deviceId: string,
  success: boolean,
): Promise<void> {
  return neonIngest.recordIngestStat(householdId, deviceId, success, todayUtc());
}

export type IngestStatRow = {
  device_id: string;
  day: string;
  success_count: number;
  error_count: number;
  device_name?: string;
};

export async function listIngestStatsForHousehold(
  householdId: string,
  days = 7,
): Promise<IngestStatRow[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceDay = since.toISOString().slice(0, 10);
  return neonIngest.listIngestStatsForHousehold(householdId, sinceDay);
}

export async function listRecentIngestStatsAdmin(days = 7): Promise<IngestStatRow[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceDay = since.toISOString().slice(0, 10);
  return neonIngest.listRecentIngestStatsAdmin(sinceDay);
}
