/**
 * probeharbor-i18n: serves es/fr/de/pt-br translation tables to the main
 * Worker over a service binding (`I18N`), keeping them out of its 3 MB bundle.
 * See src/i18n/catalog.ts for the client side.
 */
import { WorkerEntrypoint } from "cloudflare:workers";
import { buildCatalog, type CatalogTables } from "../../../src/i18n/catalogPaths";
import { MODULES } from "./modules.generated";

let catalog: CatalogTables | null = null;

export class I18n extends WorkerEntrypoint {
  /** All translations for one locale and group: `{ namespace: data }`. */
  async load(locale: string, group: string): Promise<Record<string, unknown>> {
    catalog ??= buildCatalog(MODULES);
    const byGroup = catalog[locale as keyof CatalogTables] as Record<string, Record<string, unknown>> | undefined;
    return byGroup?.[group] ?? {};
  }
}

export default {
  async fetch(): Promise<Response> {
    return new Response("Not found", { status: 404 });
  },
};
