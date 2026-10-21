import { type AboutContentBlock, getExpandedAboutContent } from "../../../lib/aboutExpandedContent";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { keyedOverlays } from "../collect";

/**
 * Translation file shape: `{ [aboutSlug]: [block, block, ...] }`, one entry per
 * English block in the same order (`{ html }`, `{ text }`, `{ items }`, `{ alt, caption }`).
 * Leave `pre` code blocks out or as `{}` so the English code is kept.
 */
export type AboutExpandedOverlay = Record<string, DeepPartial<AboutContentBlock>[]>;

const overlays = () => keyedOverlays<DeepPartial<AboutContentBlock>[]>("aboutExpanded");

export function getLocalizedExpandedAboutContent(
  slug: string,
  locale: Locale,
): AboutContentBlock[] | undefined {
  const base = getExpandedAboutContent(slug);
  if (!base || locale === "en") return base;
  return mergeTranslation(base, overlays()[locale]?.[slug] as DeepPartial<AboutContentBlock[]> | undefined);
}
