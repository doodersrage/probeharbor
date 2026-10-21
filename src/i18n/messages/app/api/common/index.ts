import { defineMessages } from "../../../../catalog";
import { getLocale } from "../../../../index";
import type { Locale } from "../../../../locales";
import en from "./en";

export type { ApiCommonMessages } from "./en";
export const apiCommonMessages = defineMessages("app/api/common", en);

/**
 * Locale of an API request. Like `getLocale`, but English when the context
 * has no `locals` (unit tests call handlers with a bare context).
 */
export function apiLocale(context: { locals?: App.Locals }): Locale {
  return context.locals ? getLocale({ locals: context.locals }) : "en";
}
