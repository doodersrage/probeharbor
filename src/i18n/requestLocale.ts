import type { User } from "@supabase/supabase-js";
import type { CatalogGroup } from "./catalogPaths";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { isEnglishOnlyPath, isLocalizablePath, isMarketingPath } from "./routes";
import { getSavedUserLocale, localeFromAcceptLanguage } from "./userLocale";

export type RequestLocaleInput = {
  /** Path without the locale prefix. */
  path: string;
  /** Locale from the URL prefix (`en` when there is none). */
  prefixLocale: Locale;
  /** Signed-in user, when middleware has loaded one. */
  user: Pick<User, "user_metadata"> | null;
  cookieLocale: string | undefined;
  acceptLanguage: string | null;
};

/**
 * Which language a request renders in:
 * - Marketing and sign-in pages: the URL prefix only (/es/pricing is Spanish,
 *   /pricing is English), so every URL has one canonical language.
 * - Privacy, terms and the API reference: always English.
 * - Everything else (dashboard, API, share/status/embed pages): the account
 *   language, then the `ph_locale` cookie. Signed-out visitors to share and
 *   status pages also fall back to the browser's Accept-Language. Signed-in
 *   users without a saved language stay on English rather than switching on
 *   a browser header they never chose.
 */
export function resolveRequestLocale(input: RequestLocaleInput): Locale {
  if (isLocalizablePath(input.path)) return input.prefixLocale;
  if (isEnglishOnlyPath(input.path)) return DEFAULT_LOCALE;
  if (input.user) {
    return getSavedUserLocale(input.user) ?? (isLocale(input.cookieLocale) ? input.cookieLocale : DEFAULT_LOCALE);
  }
  if (isLocale(input.cookieLocale)) return input.cookieLocale;
  if (input.path.startsWith("/dashboard")) return DEFAULT_LOCALE;
  return localeFromAcceptLanguage(input.acceptLanguage) ?? DEFAULT_LOCALE;
}

/** Translation groups a path can use (see catalogPaths.ts). */
export function translationGroupsForPath(path: string): CatalogGroup[] {
  if (path.startsWith("/api/")) return ["app"];
  if (isMarketingPath(path)) return ["site"];
  return ["site", "app"];
}
