import { formatHistoryRetention } from "../../../lib/entitlements";
import type { Locale } from "../../locales";

const UNITS: Record<Locale, { year: string; years: string; days: string }> = {
  en: { year: "year", years: "years", days: "days" },
  es: { year: "año", years: "años", days: "días" },
  fr: { year: "an", years: "ans", days: "jours" },
  de: { year: "Jahr", years: "Jahre", days: "Tage" },
  "pt-br": { year: "ano", years: "anos", days: "dias" },
};

/** Localized `formatHistoryRetention` ("7 days", "1 year"). English is the lib helper itself. */
export function formatRetention(days: number, locale: Locale): string {
  if (locale === "en") return formatHistoryRetention(days);
  const u = UNITS[locale];
  if (days >= 365) {
    const years = days / 365;
    return years === 1 ? `1 ${u.year}` : `${Number.isInteger(years) ? years : years.toFixed(1)} ${u.years}`;
  }
  return `${days} ${u.days}`;
}

/** Percent as written in each locale (`20%`, `20 %`). */
export function formatPercent(value: number | string, locale: Locale): string {
  if (locale === "fr") return `${value} %`;
  if (locale === "es" || locale === "de") return `${value} %`;
  return `${value}%`;
}
