import type { AlertSettings, NotifyKind } from "./alerts";
import { formatDateTime } from "../i18n/format";
import type { Locale } from "../i18n/locales";

/**
 * Snooze quiets routine alerts. Freeze (threshold), leak (flood) and power-off
 * alerts always get through, like vacation mode: an unattended freeze is the
 * failure ProbeHarbor exists to catch. To stop repeats of one freeze, use
 * "I'm on it" (acknowledge), which holds them while that freeze continues.
 */
const SNOOZE_BLOCKED: NotifyKind[] = [
  "rate",
  "digest",
  "generic",
  "forecast",
  "runway",
  "nws",
  "rule",
  "battery",
  "rssi",
  "stuck",
  "recovery",
];

/**
 * Vacation mutes routine noise while nobody is home. Freeze threshold alerts
 * are not muted: an empty house is exactly when a freeze matters.
 */
const VACATION_BLOCKED: NotifyKind[] = [
  "rate",
  "digest",
  "generic",
  "rule",
  "battery",
  "rssi",
];

export function isSnoozeActive(settings: Pick<AlertSettings, "snoozeUntil">, now = Date.now()): boolean {
  if (!settings.snoozeUntil) return false;
  const until = Date.parse(settings.snoozeUntil);
  return Number.isFinite(until) && now < until;
}

export function isVacationActive(settings: Pick<AlertSettings, "vacationUntil">, now = Date.now()): boolean {
  if (!settings.vacationUntil) return false;
  const until = Date.parse(settings.vacationUntil);
  return Number.isFinite(until) && now < until;
}

/**
 * Which routine-alert pauses are active right now, for display only. Each
 * field is the ISO end time when that mode is active, else null. Freeze,
 * leak, power and sensor-offline alerts still send in both modes (see the
 * blocked lists above), so callers must not present this as "all alerts off".
 * Returns null when nothing is paused.
 */
export type AlertPauseState = {
  snoozeUntil: string | null;
  vacationUntil: string | null;
  /** When the last active pause ends. */
  until: string;
};

export function getAlertPauseState(
  settings: Pick<AlertSettings, "snoozeUntil" | "vacationUntil">,
  now = Date.now(),
): AlertPauseState | null {
  const snoozeUntil = isSnoozeActive(settings, now)
    ? new Date(Date.parse(settings.snoozeUntil as string)).toISOString()
    : null;
  const vacationUntil = isVacationActive(settings, now)
    ? new Date(Date.parse(settings.vacationUntil as string)).toISOString()
    : null;
  if (!snoozeUntil && !vacationUntil) return null;
  const until = [snoozeUntil, vacationUntil]
    .filter((value): value is string => value != null)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  return { snoozeUntil, vacationUntil, until };
}

/** "Nov 5, 4:00 PM" in the alert-settings time zone (UTC if that zone is invalid). */
export function formatAlertPauseUntil(iso: string, locale: Locale, timeZone: string | null | undefined): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  try {
    return formatDateTime(iso, locale, { ...options, timeZone: timeZone || "UTC" });
  } catch {
    return formatDateTime(iso, locale, { ...options, timeZone: "UTC", timeZoneName: "short" });
  }
}

export function shouldSuppressForSnoozeOrVacation(
  settings: AlertSettings,
  kind: NotifyKind | undefined,
): boolean {
  const k = kind ?? "generic";
  if (isSnoozeActive(settings) && SNOOZE_BLOCKED.includes(k)) return true;
  if (isVacationActive(settings) && VACATION_BLOCKED.includes(k)) return true;
  return false;
}

export function snoozeUntilFromHours(hours: number, now = Date.now()): string {
  const clamped = Math.min(Math.max(Number.isFinite(hours) ? hours : 24, 1), 168);
  return new Date(now + clamped * 60 * 60 * 1000).toISOString();
}

export function vacationUntilFromDays(days: number, now = Date.now()): string {
  const clamped = Math.min(Math.max(Number.isFinite(days) ? days : 7, 1), 90);
  return new Date(now + clamped * 24 * 60 * 60 * 1000).toISOString();
}

/** End-of-day ISO for a YYYY-MM-DD vacation return date (local calendar day). */
export function vacationUntilFromDate(
  dateYmd: string,
  now = Date.now(),
): string | null {
  const trimmed = dateYmd.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const end = new Date(`${trimmed}T23:59:59`);
  const ms = end.getTime();
  if (!Number.isFinite(ms) || ms <= now) return null;
  const max = now + 90 * 24 * 60 * 60 * 1000;
  return new Date(Math.min(ms, max)).toISOString();
}

/** Persist snooze on alert_settings for a user (used by ack playbook). */
export async function snoozeAlertsForUser(
  userId: string,
  hours: number,
): Promise<void> {
  const { getAlertSettingsForUser, saveAlertSettingsForUser } = await import("./notify");
  const settings = await getAlertSettingsForUser(userId, {});
  await saveAlertSettingsForUser(userId, {
    ...settings,
    snoozeUntil: snoozeUntilFromHours(hours),
  });
}
