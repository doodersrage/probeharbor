import type { Locale } from "../../locales";
import { LOCALE_META } from "../../locales";

/** "$290" (en-US display string from stripePricing) → locale USD format. */
export function localizeUsd(display: string, locale: Locale): string {
  if (locale === "en") return display;
  const amount = Number(display.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount)) return display;
  const num = new Intl.NumberFormat(LOCALE_META[locale].intl, {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  switch (locale) {
    case "fr":
      return `${num} $ US`;
    case "pt-br":
      return `US$ ${num}`;
    default:
      return `${num} US$`;
  }
}
