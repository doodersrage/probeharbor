import { defineMessages } from "../../catalog";
import { formatNumber } from "../../format";
import { LOCALE_META, type Locale } from "../../locales";
import { formatRelativeAge } from "../../../lib/relativeTime";
import en from "./en";

export type { FreezeMapMessages } from "./en";
export const freezeMapMessages = defineMessages("freezeMap", en);

/** One decimal: English as `toFixed(1)`, other locales with their decimal mark and a true minus. */
export function freezeMapNumber(value: number, locale: Locale): string {
  if (locale === "en") return value.toFixed(1);
  return formatNumber(value, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace("-", "−");
}

/** A °F reading: "28.2°F" (en), "−2,1 °C (28,2 °F)" elsewhere. Fills `{temp}`. */
export function freezeMapTemp(tempF: number, locale: Locale): string {
  if (locale === "en") return `${tempF.toFixed(1)}°F`;
  return `${freezeMapNumber(((tempF - 32) * 5) / 9, locale)} °C (${freezeMapNumber(tempF, locale)} °F)`;
}

/** A °F difference (×5/9, no offset): "3.0°F" (en), "1,7 °C (3,0 °F)" elsewhere. Fills `{delta}`. */
export function freezeMapDelta(deltaF: number, locale: Locale): string {
  if (locale === "en") return `${deltaF.toFixed(1)}°F`;
  return `${freezeMapNumber((deltaF * 5) / 9, locale)} °C (${freezeMapNumber(deltaF, locale)} °F)`;
}

/**
 * Snapshot age for the freeze map. English is `formatRelativeAge` unchanged;
 * other locales use Intl.RelativeTimeFormat with the same thresholds
 * (minutes under an hour, hours under 48, then days).
 */
export function formatFreezeMapAge(
  iso: string | null,
  locale: Locale,
): { label: string; absolute: string | null } {
  const english = formatRelativeAge(iso, "not yet");
  if (locale === "en" || !iso) return english;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return english;
  const intl = LOCALE_META[locale].intl;
  const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  const minutes = Math.floor((Date.now() - parsed) / 60000);
  let label: string;
  if (minutes < 1) label = rtf.format(0, "second");
  else if (minutes < 60) label = rtf.format(-minutes, "minute");
  else {
    const hours = Math.floor(minutes / 60);
    label = hours < 48 ? rtf.format(-hours, "hour") : rtf.format(-Math.floor(hours / 24), "day");
  }
  return { label, absolute: new Date(parsed).toLocaleString(intl) };
}
