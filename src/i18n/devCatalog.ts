/**
 * Dev server and unit tests only: read translation files straight from the
 * source tree. Production fetches them from the i18n Worker instead (see
 * workers/i18n), which keeps them out of the main Worker bundle. This module
 * is only reached through an `import.meta.env.DEV` branch, so the build drops it.
 * A file that fails to load is skipped (logged), so one broken file doesn't
 * blank every translation in dev.
 */
import { buildCatalog, type CatalogTables } from "./catalogPaths";

/** Rebuilt on every call so edits show up without restarting the dev server. */
export function loadDevCatalog(): Promise<CatalogTables> {
  return (async () => {
    const loaders = import.meta.glob<{ default: unknown }>([
      "./messages/**/{es,fr,de,pt-br}.ts",
      "./content/*/{es,fr,de,pt-br}/*.ts",
    ]);
    const modules: Record<string, { default: unknown }> = {};
    await Promise.all(
      Object.entries(loaders).map(async ([file, load]) => {
        try {
          modules[file] = await load();
        } catch (error) {
          console.error(`i18n (dev): skipping ${file}`, error);
        }
      }),
    );
    return buildCatalog(modules);
  })();
}
