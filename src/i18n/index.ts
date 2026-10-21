import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export * from "./locales";
export * from "./translate";

/** Locale for the current request (set by middleware from the URL prefix). */
export function getLocale(astro: { locals: App.Locals }): Locale {
  const value = astro.locals.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
