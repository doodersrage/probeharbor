import { fmt, formatNumber, type Locale } from "../i18n";
import { overviewInsightsMessages } from "../i18n/messages/app/overviewInsights";

export type DoorOpenSession = {
  label: string;
  openedAt: string;
  closedAt: string | null;
  durationMs: number | null;
  stillOpen: boolean;
};

export type BoolReading = {
  label: string;
  kind: string;
  value: boolean;
  recordedAt: string;
};

/** Compute door-open sessions from chronological bool readings (door kind). */
export function computeDoorOpenSessions(readings: BoolReading[]): DoorOpenSession[] {
  const doorReadings = readings
    .filter((r) => r.kind === "door" || r.kind === "flood")
    .sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt));

  const sessions: DoorOpenSession[] = [];
  let openStart: { label: string; at: string } | null = null;

  for (const row of doorReadings) {
    if (row.value && !openStart) {
      openStart = { label: row.label, at: row.recordedAt };
    } else if (!row.value && openStart && openStart.label === row.label) {
      const durationMs = Date.parse(row.recordedAt) - Date.parse(openStart.at);
      sessions.push({
        label: openStart.label,
        openedAt: openStart.at,
        closedAt: row.recordedAt,
        durationMs,
        stillOpen: false,
      });
      openStart = null;
    }
  }

  if (openStart) {
    sessions.push({
      label: openStart.label,
      openedAt: openStart.at,
      closedAt: null,
      durationMs: null,
      stillOpen: true,
    });
  }

  return sessions;
}

export function formatDurationMs(ms: number, locale: Locale = "en"): string {
  const t = overviewInsightsMessages(locale).duration;
  const n = (value: number) => formatNumber(value, locale, { useGrouping: false });
  // Under a minute, show seconds: a 5 s opening would otherwise read "0 min".
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 60) return fmt(t.seconds, { count: n(seconds) });
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return fmt(t.minutes, { count: n(minutes) });
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0
    ? fmt(t.hoursMinutes, { hours: n(hours), minutes: n(rem) })
    : fmt(t.hours, { hours: n(hours) });
}
