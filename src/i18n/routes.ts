import { getPublicSitemapPaths } from "../lib/sitemapPages";
import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from "./locales";

/**
 * Public pages that stay English-only. Legal text is binding in English, and
 * the HTTP API reference is code-heavy developer documentation.
 */
const ENGLISH_ONLY_PATHS = new Set(["/privacy", "/terms", "/docs/api"]);

/**
 * Sign-in pages served under a locale prefix too (/es/signin), so links from
 * a Spanish page stay Spanish. They are noindex: no sitemap or hreflang.
 */
const AUTH_PATHS = new Set([
  "/signin",
  "/signin/mfa",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/resend-confirmation",
]);
const AUTH_PREFIXES = ["/invite/"];

let localizable: Set<string> | null = null;

/** Every marketing path that has /es, /fr, /de and /pt-br versions. */
export function getLocalizablePaths(): string[] {
  return [...getLocalizableSet()];
}

/** Legal pages and the API reference: always English. */
export function isEnglishOnlyPath(path: string): boolean {
  return ENGLISH_ONLY_PATHS.has(path);
}

/** Marketing (sitemap) path with translations: gets hreflang alternates. */
export function isMarketingPath(path: string): boolean {
  return getLocalizableSet().has(path);
}

/** Sign-in, register, password reset and invite pages. */
export function isAuthPagePath(path: string): boolean {
  return AUTH_PATHS.has(path) || AUTH_PREFIXES.some((p) => path.startsWith(p) && path.length > p.length);
}

function getLocalizableSet(): Set<string> {
  if (!localizable) {
    localizable = new Set(getPublicSitemapPaths().filter((p) => !ENGLISH_ONLY_PATHS.has(p)));
  }
  return localizable;
}

/** Any path served under a locale prefix: marketing pages plus sign-in pages. */
export function isLocalizablePath(path: string): boolean {
  return isMarketingPath(path) || isAuthPagePath(path);
}

/** hreflang alternates for a marketing path (English first). */
export function getAlternatePaths(path: string): Array<{ locale: Locale; path: string }> {
  if (!isMarketingPath(path)) return [];
  return LOCALES.map((locale) => ({ locale, path: localizePath(path, locale) }));
}

const ANCHOR_TAG = /<a\b[^>]*>/gi;
const HREF_ATTR = /(\shref=)(["'])(\/[^"']*)\2/i;

/**
 * Point internal links at the same locale: on /es pages, `href="/pricing#faq"`
 * becomes `href="/es/pricing#faq"` when /pricing has translations (sign-in
 * pages included). Dashboard, API, asset and English-only links are left alone, as is any
 * anchor marked `data-locale-switch` (the language switcher).
 */
export function localizeHtmlLinks(html: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return html;
  return html.replace(ANCHOR_TAG, (tag) => {
    if (tag.includes("data-locale-switch")) return tag;
    return tag.replace(HREF_ATTR, (whole, prefix: string, quote: string, href: string) => {
      if (href.startsWith("//")) return whole;
      const cut = href.search(/[?#]/);
      const path = cut === -1 ? href : href.slice(0, cut);
      const rest = cut === -1 ? "" : href.slice(cut);
      if (!isLocalizablePath(path)) return whole;
      return `${prefix}${quote}${localizePath(path, locale)}${rest}${quote}`;
    });
  });
}
