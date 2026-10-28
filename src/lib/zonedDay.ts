/**
 * Date filters ("from 2026-10-28") mean whole days in the user's time zone,
 * not UTC. The browser's zone is kept in the `ph_tz` cookie (set by
 * DashboardLayout); without a valid zone everything stays UTC, as before.
 */

export const TIME_ZONE_COOKIE = "ph_tz";

export function isValidTimeZone(timeZone: string | null | undefined): timeZone is string {
  if (!timeZone || timeZone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(0);
    return true;
  } catch {
    return false;
  }
}

/** `timeZone` from the cookie when it's a real IANA zone, else "UTC". */
export function timeZoneFromCookie(cookies: { get(name: string): { value?: string } | undefined }): string {
  const value = cookies.get(TIME_ZONE_COOKIE)?.value;
  const decoded = value ? decodeURIComponent(value) : "";
  return isValidTimeZone(decoded) ? decoded : "UTC";
}

/** Milliseconds the zone is ahead of UTC at `utcMs` (negative west of UTC). */
function offsetMs(timeZone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

function parseDay(day: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
  return [y, mo, d];
}

function startMs(y: number, mo: number, d: number, timeZone: string): number {
  const guess = Date.UTC(y, mo - 1, d, 0, 0, 0);
  const first = guess - offsetMs(timeZone, guess);
  // Re-check at the answer: the offset can differ across a DST change.
  const second = guess - offsetMs(timeZone, first);
  return second;
}

/** ISO instant of local midnight starting `day` in `timeZone`, or null for a bad date. */
export function zonedDayStartIso(day: string, timeZone: string): string | null {
  const parsed = parseDay(day);
  if (!parsed) return null;
  return new Date(startMs(...parsed, timeZone)).toISOString();
}

/** ISO instant of the last millisecond of `day` in `timeZone` (DST days are 23 or 25 h). */
export function zonedDayEndIso(day: string, timeZone: string): string | null {
  const parsed = parseDay(day);
  if (!parsed) return null;
  const [y, mo, d] = parsed;
  const next = new Date(Date.UTC(y, mo - 1, d + 1));
  return new Date(startMs(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), timeZone) - 1).toISOString();
}
