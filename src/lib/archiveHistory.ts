import * as neonTools from "./db/householdTools";
import { RAW_READING_RETENTION_DAYS } from "./retentionSchedule";

export type ArchiveResult = {
  archived: number;
  skipped: boolean;
  error: string | null;
};

/** Export aged readings to archive metadata (R2 upload when binding present). */
export async function archiveOldReadings(options?: {
  r2?: R2Bucket;
  retentionDays?: number;
}): Promise<ArchiveResult> {
  const retentionDays = options?.retentionDays ?? RAW_READING_RETENTION_DAYS;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  return archiveOldReadingsNeon(cutoff, options?.r2);
}

/** Archive each household's aged readings (queries in src/lib/db/householdTools.ts). */
async function archiveOldReadingsNeon(cutoff: Date, r2: R2Bucket | undefined): Promise<ArchiveResult> {
  let households: string[];
  try {
    households = await neonTools.householdIds(500);
  } catch (error) {
    return { archived: 0, skipped: false, error: error instanceof Error ? error.message : String(error) };
  }
  if (!r2) return { archived: 0, skipped: true, error: null };

  let archived = 0;
  for (const householdId of households) {
    const readings = await neonTools.oldReadings(householdId, cutoff.toISOString(), 5000);
    if (!readings.length) continue;
    const key = `archives/${householdId}/${cutoff.toISOString().slice(0, 10)}.json`;
    await r2.put(key, JSON.stringify(readings), { httpMetadata: { contentType: "application/json" } });
    await neonTools.insertArchive({
      household_id: householdId,
      period_start: cutoff.toISOString().slice(0, 10),
      period_end: new Date().toISOString().slice(0, 10),
      object_key: key,
      row_count: readings.length,
    });
    archived += readings.length;
  }
  return { archived, skipped: false, error: null };
}
