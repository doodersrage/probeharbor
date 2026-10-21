import { resolveOgImageAlt } from "../../../lib/ogMeta";
import { getCatalogEntry } from "../../catalog";
import type { Locale } from "../../locales";
import type { OgAltMessages } from "./en";

export type { OgAltMessages } from "./en";

/** Default share-image alt for an (English) path, in the visitor's language. */
export function resolveLocalizedOgImageAlt(pathname: string, locale: Locale): string {
  const english = resolveOgImageAlt(pathname);
  if (locale === "en") return english;
  const table = getCatalogEntry("ogAlt", locale) as OgAltMessages | undefined;
  return table?.[english] ?? english;
}
