import { contentModules, getCatalogEntry } from "../catalog";
import { isLocale, TRANSLATED_LOCALES, type TranslatedLocale } from "../locales";

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

const memo = new Map<string, { sources: unknown[]; value: unknown }>();

/**
 * Build something from a dataset's loaded translation files
 * (`contentModules(dataset, part)`), rebuilt only when the loaded tables
 * change. Call it inside getters, never at module load: tables are loaded per
 * request (`ensureLocale`), and English needs none of them.
 */
export function fromContentModules<T>(
  dataset: string,
  part: string | undefined,
  build: (modules: Record<string, { default: unknown }>) => T,
): T {
  const key = `${dataset}\0${part ?? ""}`;
  const sources = TRANSLATED_LOCALES.map((locale) => getCatalogEntry(`content/${dataset}`, locale));
  const hit = memo.get(key);
  if (hit && hit.sources.every((source, i) => source === sources[i])) return hit.value as T;
  const value = build(contentModules(dataset, part));
  memo.set(key, { sources, value });
  return value;
}

/** `collectKeyedOverlays` over a dataset's loaded translation files (see `fromContentModules`). */
export function keyedOverlays<V>(
  dataset: string,
  part?: string,
): Partial<Record<TranslatedLocale, Record<string, V>>> {
  return fromContentModules(dataset, part, (modules) =>
    collectKeyedOverlays<V>(modules as Record<string, { default: Record<string, V> }>),
  );
}
