import { defineMessages } from "../../../catalog";
import { formatNumber } from "../../../format";
import { LOCALE_META, type Locale } from "../../../locales";
import en from "./en";

export type { LibTextMessages } from "./en";
export const libTextMessages = defineMessages("app/libText", en);

/** `value.toFixed(digits)` in English (unchanged output); the locale's decimal separator otherwise. */
export function libFixed(value: number, digits: number, locale: Locale): string {
  if (locale === "en") return value.toFixed(digits);
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

/** `String(value)` in English (unchanged output); locale digits otherwise. */
export function libNumber(value: number, locale: Locale): string {
  return locale === "en" ? String(value) : formatNumber(value, locale, { maximumFractionDigits: 2 });
}

/** `new Date(x).toLocaleString()` in English (unchanged output); the locale's format otherwise. */
export function libDateTime(value: string | number | Date, locale: Locale): string {
  const date = new Date(value);
  return locale === "en" ? date.toLocaleString() : date.toLocaleString(LOCALE_META[locale].intl);
}

/** `new Date(x).toLocaleDateString()` in English (unchanged output); the locale's format otherwise. */
export function libDate(value: string | number | Date, locale: Locale): string {
  const date = new Date(value);
  return locale === "en" ? date.toLocaleDateString() : date.toLocaleDateString(LOCALE_META[locale].intl);
}

