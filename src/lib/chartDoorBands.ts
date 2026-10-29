import type { DoorStateAtTime } from "./anomalyDetection";

// Browser-safe: HistoryChart (a client island) imports this file, so it must
// not import server code (Supabase clients, sensor reads). The database
// fetch lives in chartDoorBands.server.ts.

/**
 * A stretch of time a door sensor reported open, for shading the History
 * chart. `closedAt` is null while the latest reading still says open (no
 * close has been reported yet).
 */
export type ChartDoorBand = {
  label: string;
  openedAt: string;
  closedAt: string | null;
};

function bandEndMs(band: ChartDoorBand): number {
  return band.closedAt ? Date.parse(band.closedAt) : Number.POSITIVE_INFINITY;
}

/** Bands that overlap [minTs, maxTs], clipped to it; open-ended ones run to maxTs. */
export function clipDoorBands(
  bands: ChartDoorBand[],
  minTs: number,
  maxTs: number,
): Array<{ label: string; startMs: number; endMs: number }> {
  const out: Array<{ label: string; startMs: number; endMs: number }> = [];
  for (const band of bands) {
    const start = Date.parse(band.openedAt);
    const end = bandEndMs(band);
    if (!Number.isFinite(start) || Number.isNaN(end)) continue;
    if (end < minTs || start > maxTs) continue;
    out.push({ label: band.label, startMs: Math.max(start, minTs), endMs: Math.min(end, maxTs) });
  }
  return out;
}

/** Bands that cover the instant `ts`. */
export function doorBandsAt(bands: ChartDoorBand[], ts: number): ChartDoorBand[] {
  return bands.filter((band) => {
    const start = Date.parse(band.openedAt);
    return Number.isFinite(start) && start <= ts && ts <= bandEndMs(band);
  });
}

/** How many open periods overlap the window, in total and per door (in door order). */
export function summarizeDoorBands(
  bands: ChartDoorBand[],
  minTs: number,
  maxTs: number,
): { count: number; labels: string[]; perDoor: Array<{ label: string; count: number }> } {
  const clipped = clipDoorBands(bands, minTs, maxTs);
  const counts = new Map<string, number>();
  for (const band of clipped) counts.set(band.label, (counts.get(band.label) ?? 0) + 1);
  const labels = doorLabels(clipped);
  return {
    count: clipped.length,
    labels,
    perDoor: labels.map((label) => ({ label, count: counts.get(label) ?? 0 })),
  };
}

/** Door names in a stable order (alphabetical), each once. */
export function doorLabels(bands: Array<{ label: string }>): string[] {
  return [...new Set(bands.map((b) => b.label))].sort((a, b) => a.localeCompare(b));
}

/** At most this many per-door rows above the chart; other doors are still shaded. */
export const MAX_DOOR_LANES = 4;

/**
 * Which doors get their own row above the chart. One door (or none) needs
 * no rows: its band and top strip inside the plot already say it all.
 */
export function doorLanes(
  visibleLabels: string[],
  maxLanes = MAX_DOOR_LANES,
): { lanes: string[]; overflow: number } {
  if (visibleLabels.length <= 1) return { lanes: [], overflow: 0 };
  return {
    lanes: visibleLabels.slice(0, maxLanes),
    overflow: Math.max(0, visibleLabels.length - maxLanes),
  };
}

/** Door periods in the shape `detectTemperatureAnomalies` takes. */
export function toDoorStates(bands: ChartDoorBand[]): DoorStateAtTime[] {
  return bands.map((band) => ({
    label: band.label,
    open: true,
    recordedAt: band.openedAt,
    until: band.closedAt,
  }));
}
