import { CATALOG_GROUPS, type CatalogGroup } from "./catalogPaths";
import { DEFAULT_LOCALE, type Locale, TRANSLATED_LOCALES, type TranslatedLocale } from "./locales";
import { mergeTranslation } from "./translate";

/**
 * Runtime translation catalog.
 *
 * English lives in the main Worker bundle (each namespace's `en.ts`). The
 * es/fr/de/pt-br tables live in a separate Worker (workers/i18n) because the
 * main bundle is close to Cloudflare's 3 MB limit. `ensureLocale` fetches a
 * locale's tables over the `I18N` service binding once per isolate and keeps
 * them in memory; after that every lookup is synchronous.
 *
 * Middleware calls `ensureLocale` before rendering a page or API route. Code
 * that runs outside a request for a user's language (cron emails, alerts)
 * must `await ensureLocale(locale, ["app"])` before reading messages.
 * Anything not loaded falls back to English, never throws.
 */

type Tables = Record<string, unknown>;

/** RPC surface of the i18n Worker (workers/i18n/src/index.ts). */
export interface I18nService {
  load(locale: string, group: string): Promise<Tables>;
}

const loaded = new Map<string, Tables>();
const pending = new Map<string, Promise<void>>();
const failedAt = new Map<string, number>();
const RETRY_AFTER_MS = 30_000;

const key = (locale: TranslatedLocale, group: CatalogGroup) => `${locale}:${group}`;

async function fetchTables(locale: TranslatedLocale, group: CatalogGroup): Promise<Tables> {
  if (import.meta.env.DEV) {
    const { loadDevCatalog } = await import("./devCatalog");
    return (await loadDevCatalog())[locale]?.[group] ?? {};
  }
  // Browser bundles never load tables (getters return English there).
  if (!import.meta.env.SSR) return {};
  let service: I18nService | undefined;
  try {
    // Imported lazily so this module stays safe to reach from browser code
    // (where nothing is ever loaded and every getter returns English).
    const { env } = await import("cloudflare:workers");
    service = (env as unknown as { I18N?: I18nService }).I18N;
  } catch {
    service = undefined;
  }
  if (!service) throw new Error("I18N service binding is not configured");
  return await service.load(locale, group);
}

/** Load translation tables so later lookups for `locale` are translated. */
export async function ensureLocale(
  locale: Locale,
  groups: readonly CatalogGroup[] = CATALOG_GROUPS,
): Promise<void> {
  if (locale === DEFAULT_LOCALE) return;
  const translated = locale as TranslatedLocale;
  await Promise.all(
    groups.map((group) => {
      const k = key(translated, group);
      // Dev re-reads source tables each request so edits show without a restart.
      if (loaded.has(k) && !import.meta.env.DEV) return undefined;
      const last = failedAt.get(k);
      if (last !== undefined && Date.now() - last < RETRY_AFTER_MS) return undefined;
      let job = pending.get(k);
      if (!job) {
        job = fetchTables(translated, group)
          .then((tables) => {
            loaded.set(k, tables);
            failedAt.delete(k);
          })
          .catch((error: unknown) => {
            failedAt.set(k, Date.now());
            console.error(`i18n: could not load ${k}; serving English`, error);
          })
          .finally(() => pending.delete(k));
        pending.set(k, job);
      }
      return job;
    }),
  );
}

/** Load every translated locale (cron jobs that email users in many languages). */
export async function ensureAllLocales(groups: readonly CatalogGroup[] = CATALOG_GROUPS): Promise<void> {
  await Promise.all(TRANSLATED_LOCALES.map((locale) => ensureLocale(locale, groups)));
}

/** Raw translation data for a namespace, or undefined when not loaded / not translated. */
export function getCatalogEntry(namespace: string, locale: Locale): unknown {
  if (locale === DEFAULT_LOCALE) return undefined;
  for (const group of CATALOG_GROUPS) {
    const value = loaded.get(key(locale as TranslatedLocale, group))?.[namespace];
    if (value !== undefined) return value;
  }
  return undefined;
}

/** Test helper: forget loaded tables. */
export function resetCatalogForTests(): void {
  loaded.clear();
  pending.clear();
  failedAt.clear();
}

/** Accessor returned by `defineMessages`. */
export type MessageGetter<M> = ((locale: Locale) => M) & { namespace: string; en: M };

/**
 * UI strings for one namespace. `en` defines the shape and ships in the main
 * bundle; translations live in `<locale>.ts` files beside it (same folder),
 * which only the i18n Worker imports. Values are plain data: strings,
 * arrays, objects, numbers. Use `{name}` placeholders with `fmt()` and
 * `PluralForms` with `plural()` instead of functions.
 *
 * ```ts
 * // src/i18n/messages/pricing/index.ts
 * import en from "./en";
 * export const pricingMessages = defineMessages("pricing", en);
 * ```
 *
 * The namespace must equal the folder path under `src/i18n/messages/`.
 * Missing keys fall back to English.
 */
export function defineMessages<M>(namespace: string, en: M): MessageGetter<M> {
  const memo = new Map<Locale, { source: unknown; value: M }>();
  const get = (locale: Locale): M => {
    if (locale === DEFAULT_LOCALE) return en;
    const source = getCatalogEntry(namespace, locale);
    if (source === undefined) return en;
    const hit = memo.get(locale);
    if (hit && hit.source === source) return hit.value;
    const value = mergeTranslation(en, source as never);
    memo.set(locale, { source, value });
    return value;
  };
  return Object.assign(get, { namespace, en });
}

/**
 * Loaded translation files of a content dataset, in the same shape as
 * `import.meta.glob("./*\/*.ts", { eager: true })` from the dataset folder:
 * `{ "./es/faqs.ts": { default: … } }`. Call it inside the getter (not at
 * module load) so tables loaded later are seen. `part` limits it to one file
 * name per locale (`"accessories"` → `./<locale>/accessories.ts`).
 */
export function contentModules<V = unknown>(
  dataset: string,
  part?: string,
): Record<string, { default: V }> {
  const out: Record<string, { default: V }> = {};
  for (const locale of TRANSLATED_LOCALES) {
    const parts = getCatalogEntry(`content/${dataset}`, locale) as Record<string, V> | undefined;
    if (!parts) continue;
    for (const [name, data] of Object.entries(parts)) {
      if (part && name !== part) continue;
      out[`./${locale}/${name}.ts`] = { default: data };
    }
  }
  return out;
}
