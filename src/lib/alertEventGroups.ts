import type { AlertEventRow } from "./alertEvents";

/** A run of look-alike alerts: the newest is shown, the rest fold under it. */
export type AlertEventGroup = { lead: AlertEventRow; rest: AlertEventRow[] };

/** Runs shorter than this stay as separate rows; folding two rows saves nothing. */
const MIN_RUN = 3;

function similarityKey(event: AlertEventRow): string | null {
  // Rows that carry advice or feedback are worth reading on their own.
  if (event.meta?.feedback || event.meta?.suggestedTipId) return null;
  return [
    event.kind,
    // Titles carry readings ("Freeze: Garage 31.2°F"); the same probe at a new temperature is still a repeat.
    event.title.replace(/-?\d+(?:\.\d+)?/g, "#"),
    [...event.channels_sent].sort().join(","),
    [...event.channels_skipped].sort().join(","),
    event.acknowledged_at ? "handled" : "open",
  ].join("|");
}

/**
 * Collapse consecutive events (newest first, as listed) that share kind, title,
 * channels, and handled state. Order is preserved; nothing is dropped.
 */
export function groupAlertEvents(events: AlertEventRow[]): AlertEventGroup[] {
  const runs: AlertEventRow[][] = [];
  let lastKey: string | null = null;
  for (const event of events) {
    const key = similarityKey(event);
    const current = runs[runs.length - 1];
    if (key !== null && key === lastKey && current) {
      current.push(event);
    } else {
      runs.push([event]);
    }
    lastKey = key;
  }
  const groups: AlertEventGroup[] = [];
  for (const run of runs) {
    if (run.length >= MIN_RUN) {
      const [lead, ...rest] = run;
      groups.push({ lead: lead!, rest });
    } else {
      for (const event of run) groups.push({ lead: event, rest: [] });
    }
  }
  return groups;
}
