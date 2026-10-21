import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export * from "./locales";
export {
  type DeepPartial,
  type ListOverlays,
  mergeTranslation,
  type Overlays,
  translateList,
  translateValue,
} from "./translate";
export {
  contentModules,
  defineMessages,
  ensureAllLocales,
  ensureLocale,
  type MessageGetter,
} from "./catalog";
export * from "./format";

/**
 * Locale for the current request, set by middleware: the URL prefix on
 * marketing and sign-in pages, the account language on the dashboard.
 */
export function getLocale(astro: { locals: App.Locals }): Locale {
  const value = astro.locals.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
