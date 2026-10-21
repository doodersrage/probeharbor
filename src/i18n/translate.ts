import { DEFAULT_LOCALE, type Locale, type TranslatedLocale } from "./locales";

/** Text-only overlay of an English value: any field may be left out. */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly (DeepPartial<U> | undefined)[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Lay a translation over its English source. Objects merge key by key and
 * arrays merge index by index (the English length wins), so a translation
 * only needs the text fields; hrefs, slugs, images and dates come from English.
 * Missing or undefined translated values fall back to English.
 */
export function mergeTranslation<T>(base: T, overlay: DeepPartial<NoInfer<T>> | undefined): T {
  if (overlay === undefined || overlay === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(overlay)) return base;
    return base.map((item, i) => mergeTranslation(item, overlay[i])) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(overlay)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) {
      out[key] = mergeTranslation(base[key], (overlay as Record<string, unknown>)[key] as never);
    }
    return out as T;
  }
  // Non-English strings only replace English strings (never a number/boolean/image).
  if (typeof base === typeof overlay) return overlay as T;
  return base;
}

/** Per-locale overlays for one English value. English is the source. */
export type Overlays<T> = Partial<Record<TranslatedLocale, DeepPartial<T>>>;

/** Translate one English value (an object, record, or array) for a locale. */
export function translateValue<T>(locale: Locale, base: T, overlays: Overlays<NoInfer<T>>): T {
  if (locale === DEFAULT_LOCALE) return base;
  return mergeTranslation(base, overlays[locale as TranslatedLocale]);
}

/** Per-locale overlays for a list keyed by each item's id or slug. */
export type ListOverlays<T> = Partial<Record<TranslatedLocale, Record<string, DeepPartial<T>>>>;

/**
 * Translate a list of English items keyed by id/slug, so reordering or adding
 * English items never mismatches translations. Untranslated items stay English.
 */
export function translateList<T>(
  locale: Locale,
  items: readonly T[],
  overlays: ListOverlays<NoInfer<T>>,
  keyOf: (item: NoInfer<T>) => string,
): T[] {
  if (locale === DEFAULT_LOCALE) return [...items];
  const table = overlays[locale as TranslatedLocale];
  if (!table) return [...items];
  return items.map((item) => mergeTranslation(item, table[keyOf(item)]));
}

/**
 * Page/component UI strings. `en` defines the shape; each other locale must
 * provide the same keys (TypeScript enforces it). Values may be functions for
 * interpolation, e.g. `price: (p: string) => \`${p}/mes\``.
 */
export function defineMessages<M>(messages: { en: M } & Record<TranslatedLocale, M>) {
  return (locale: Locale): M => messages[locale] ?? messages.en;
}
