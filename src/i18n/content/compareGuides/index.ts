import { type CompareGuide, compareGuides } from "../../../lib/compareGuides";
import type { Locale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [guideSlug]: { title, headline, rows: [...], ... } }`. */
export type CompareGuideOverlay = Record<string, DeepPartial<CompareGuide>>;

const overlays = () => keyedOverlays<DeepPartial<CompareGuide>>("compareGuides");

export function getLocalizedCompareGuides(locale: Locale): CompareGuide[] {
  return translateList(locale, compareGuides, overlays(), (g) => g.slug);
}

export function getLocalizedCompareGuide(slug: string, locale: Locale): CompareGuide | undefined {
  return getLocalizedCompareGuides(locale).find((g) => g.slug === slug);
}
