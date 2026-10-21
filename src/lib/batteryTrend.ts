import { fmt, plural, type Locale } from "../i18n";
import { libDate, libFixed, libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type BatterySample = { pct: number; at: string };

export function appendBatterySample(
  history: unknown,
  pct: number,
  at = new Date().toISOString(),
  maxSamples = 14,
): BatterySample[] {
  const existing = Array.isArray(history)
    ? (history as BatterySample[]).filter(
        (s) => typeof s.pct === "number" && typeof s.at === "string",
      )
    : [];
  return [...existing, { pct, at }].slice(-maxSamples);
}

/** Days until 0% at the recent drain rate, or null if the pack is charging/flat. */
export function estimateBatteryDaysRemaining(
  history: BatterySample[],
  windowDays = 7,
): number | null {
  if (history.length < 2) return null;
  const sorted = [...history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const newest = sorted[sorted.length - 1]!;
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const oldestInWindow = sorted.find((s) => Date.parse(s.at) >= cutoff) ?? sorted[0]!;
  const elapsedDays =
    (Date.parse(newest.at) - Date.parse(oldestInWindow.at)) / (24 * 60 * 60 * 1000);
  if (elapsedDays < 0.5) return null;
  const dropPerDay = (oldestInWindow.pct - newest.pct) / elapsedDays;
  if (dropPerDay <= 0.5) return null;
  const days = newest.pct / dropPerDay;
  if (!Number.isFinite(days) || days <= 0) return null;
  return days;
}

export function detectBatteryTrendDrop(
  history: BatterySample[],
  dropPct = 20,
  windowDays = 7,
  locale: Locale = "en",
): string | null {
  if (history.length < 2) return null;
  const sorted = [...history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const newest = sorted[sorted.length - 1];
  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const oldestInWindow = sorted.find((s) => Date.parse(s.at) >= cutoff) ?? sorted[0];
  const drop = oldestInWindow.pct - newest.pct;
  if (drop < dropPct) return null;
  const t = libTextMessages(locale).battery;
  const base = fmt(t.dropped, {
    drop: libFixed(drop, 0, locale),
    date: libDate(oldestInWindow.at, locale),
    from: libNumber(oldestInWindow.pct, locale),
    to: libNumber(newest.pct, locale),
  });
  const daysLeft = estimateBatteryDaysRemaining(sorted, windowDays);
  if (daysLeft != null && daysLeft <= 60) {
    const rounded = daysLeft < 2 ? t.aboutOneDay : plural(t.aboutDays, Math.round(daysLeft), locale);
    return fmt(t.mayLast, { base, duration: rounded });
  }
  return base;
}
