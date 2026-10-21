import { defineMessages } from "../../catalog";
import { LOCALE_META, type Locale } from "../../locales";
import { formatRelativeAge } from "../../../lib/relativeTime";
import en from "./en";

export type { SystemStatusMessages } from "./en";
export const systemStatusMessages = defineMessages("systemStatus", en);

/**
 * Relative age label ("5m ago") for the status page. English keeps the exact
 * `formatRelativeAge` wording; other locales use Intl.RelativeTimeFormat with
 * the same minute/hour/day buckets.
 */
export function formatLocalizedAge(iso: string | null | undefined, locale: Locale): string {
  const t = systemStatusMessages(locale);
  if (locale === "en") return formatRelativeAge(iso, t.age.never).label;
  const parsed = iso ? Date.parse(iso) : Number.NaN;
  if (Number.isNaN(parsed)) return t.age.never;
  const minutes = Math.floor((Date.now() - parsed) / 60000);
  if (minutes < 1) return t.age.justNow;
  const rtf = new Intl.RelativeTimeFormat(LOCALE_META[locale].intl, { style: "short", numeric: "always" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  return hours < 48 ? rtf.format(-hours, "hour") : rtf.format(-Math.floor(hours / 24), "day");
}

/** Date + time for the status page; English keeps the runtime default format. */
export function formatStatusDateTime(value: string | number | Date, locale: Locale): string {
  const date = new Date(value);
  return locale === "en"
    ? date.toLocaleString()
    : date.toLocaleString(LOCALE_META[locale].intl, { dateStyle: "medium", timeStyle: "long", timeZone: "UTC" });
}
