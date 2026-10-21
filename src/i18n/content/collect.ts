import { isLocale, type TranslatedLocale } from "../locales";

/**
 * Gather translation files laid out as `<dataset>/<locale>/<part>.ts`, each
 * with a default export keyed by slug/id. Several part files for the same
 * locale are merged, so large datasets can be split across files.
 */
export function collectKeyedOverlays<V>(
  modules: Record<string, { default: Record<string, V> }>,
): Partial<Record<TranslatedLocale, Record<string, V>>> {
  const out: Partial<Record<TranslatedLocale, Record<string, V>>> = {};
  for (const [file, mod] of Object.entries(modules)) {
    const locale = /\/([a-z]{2}(?:-[a-z]{2})?)\/[^/]+\.ts$/.exec(file)?.[1];
    if (!isLocale(locale) || locale === "en") continue;
    out[locale] = { ...out[locale], ...mod.default };
  }
  return out;
}
