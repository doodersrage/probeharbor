import { defineMessages } from "../../../../catalog";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../../../locales";
import en from "./en";

export type { ApiMoreCommonMessages } from "./en";
export const apiMoreCommonMessages = defineMessages("app/apiMore/common", en);

/**
 * Request locale for API routes and actions (set by middleware). Unlike
 * `getLocale`, tolerates a context without `locals` (unit tests), returning English.
 */
export function apiLocale(context: { locals?: App.Locals | null } | null | undefined): Locale {
  const value = context?.locals?.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
