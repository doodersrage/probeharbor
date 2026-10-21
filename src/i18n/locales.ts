/**
 * Marketing-site locales. English lives at the bare path (/pricing); every
 * other locale is served under a path prefix (/es/pricing) by middleware,
 * which strips the prefix and renders the same page with `Astro.locals.locale`.
 */
export const LOCALES = ["en", "es", "fr", "de", "pt-br"] as const;
export type Locale = (typeof LOCALES)[number];
export type TranslatedLocale = Exclude<Locale, "en">;

export const DEFAULT_LOCALE: Locale = "en";
export const TRANSLATED_LOCALES = LOCALES.filter(
  (l): l is TranslatedLocale => l !== DEFAULT_LOCALE,
);

export type LocaleMeta = {
  /** Native name for the language switcher. */
  label: string;
  /** `<html lang>` and JSON-LD inLanguage. */
  htmlLang: string;
  /** hreflang attribute value. */
  hreflang: string;
  /** og:locale value. */
  ogLocale: string;
  /** BCP 47 tag for Intl formatting. */
  intl: string;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { label: "English", htmlLang: "en", hreflang: "en", ogLocale: "en_US", intl: "en-US" },
  es: { label: "Español", htmlLang: "es", hreflang: "es", ogLocale: "es_ES", intl: "es" },
  fr: { label: "Français", htmlLang: "fr", hreflang: "fr", ogLocale: "fr_FR", intl: "fr-FR" },
  de: { label: "Deutsch", htmlLang: "de", hreflang: "de", ogLocale: "de_DE", intl: "de-DE" },
  "pt-br": {
    label: "Português (Brasil)",
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    ogLocale: "pt_BR",
    intl: "pt-BR",
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Split `/es/pricing` into `{ locale: "es", path: "/pricing" }`.
 * Paths without a locale prefix are English.
 */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const match = /^\/([a-z]{2}(?:-[a-z]{2})?)(\/.*)?$/.exec(pathname);
  if (match && isLocale(match[1]) && match[1] !== DEFAULT_LOCALE) {
    return { locale: match[1], path: match[2] || "/" };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** `/pricing` + `es` → `/es/pricing`; English stays unprefixed. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}
