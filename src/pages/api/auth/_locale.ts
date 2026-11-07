/**
 * Language helpers for the /api/auth routes (the leading underscore keeps
 * this file out of Astro's routing).
 *
 * The request locale on these routes comes from middleware: the account
 * language, else the `ph_locale` cookie that the localized sign-in and
 * register pages set when viewed (/es/register → `es`).
 */
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../../i18n/locales";

/** `getLocale` that tolerates a context without `locals` (unit tests). */
export function requestLocale(context: { locals?: App.Locals }): Locale {
  const value = context.locals?.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
