import { isLocale, type TranslatedLocale } from "./locales";

/**
 * Translation groups. Each group is fetched from the i18n Worker as one
 * table per locale, so a page only pulls what it can use:
 * - `site`: marketing pages, the shared layout and marketing content data.
 * - `app`: dashboard, sign-in pages, API messages, emails and alerts.
 */
export const CATALOG_GROUPS = ["site", "app"] as const;
export type CatalogGroup = (typeof CATALOG_GROUPS)[number];

export type CatalogEntry = {
  locale: TranslatedLocale;
  group: CatalogGroup;
  namespace: string;
  /** Content files: the part file name. Stored as `{ [part]: data }`. */
  part: string | null;
};

/**
 * Map a translation file path to its namespace. Two layouts:
 * - `…/i18n/messages/<namespace…>/<locale>.ts` → namespace `<namespace…>`
 *   (`messages/app/settings/es.ts` → `app/settings`, group `app`)
 * - `…/i18n/content/<dataset>/<locale>/<part>.ts` → namespace `content/<dataset>`,
 *   stored per part (`{ faqs: …, part2: … }`) so the dataset getter decides how to combine.
 * English files (`en.ts`) and anything else return null.
 */
export function catalogEntryForPath(file: string): CatalogEntry | null {
  const normalized = file.replaceAll("\\", "/");
  const message = /(?:^|\/)(?:i18n\/)?messages\/(.+)\/([a-z]{2}(?:-[a-z]{2})?)\.ts$/.exec(normalized);
  if (message) {
    const [, namespace, locale] = message;
    if (!isLocale(locale) || locale === "en") return null;
    const group: CatalogGroup = namespace.startsWith("app/") ? "app" : "site";
    return { locale, group, namespace, part: null };
  }
  const content = /(?:^|\/)(?:i18n\/)?content\/([^/]+)\/([a-z]{2}(?:-[a-z]{2})?)\/([^/]+)\.ts$/.exec(normalized);
  if (content) {
    const [, dataset, locale, part] = content;
    if (!isLocale(locale) || locale === "en") return null;
    return { locale, group: "site", namespace: `content/${dataset}`, part };
  }
  return null;
}

/** locale → group → namespace → translation data. */
export type CatalogTables = Partial<
  Record<TranslatedLocale, Partial<Record<CatalogGroup, Record<string, unknown>>>>
>;

/** Build the catalog from `{ path: module }` (an import.meta.glob result or the generated list). */
export function buildCatalog(modules: Record<string, { default: unknown }>): CatalogTables {
  const tables: CatalogTables = {};
  for (const [file, mod] of Object.entries(modules)) {
    const entry = catalogEntryForPath(file);
    if (!entry) continue;
    const byGroup = tables[entry.locale] ?? {};
    tables[entry.locale] = byGroup;
    const byNamespace = byGroup[entry.group] ?? {};
    byGroup[entry.group] = byNamespace;
    const data = mod.default;
    if (entry.part) {
      const parts = (byNamespace[entry.namespace] ?? {}) as Record<string, unknown>;
      byNamespace[entry.namespace] = parts;
      parts[entry.part] = data;
    } else {
      byNamespace[entry.namespace] = data;
    }
  }
  return tables;
}
