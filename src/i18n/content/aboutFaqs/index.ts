import { type AboutFaqItem, getAboutFaqs } from "../../../lib/aboutFaqs";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { collectKeyedOverlays } from "../collect";

/** Translation file shape: `{ [aboutSlug]: [{ question, answer }, ...] }` in English order. */
export type AboutFaqOverlay = Record<string, DeepPartial<AboutFaqItem>[]>;

const overlays = collectKeyedOverlays<DeepPartial<AboutFaqItem>[]>(
  import.meta.glob("./*/*.ts", { eager: true }),
);

export function getLocalizedAboutFaqs(slug: string, locale: Locale): AboutFaqItem[] {
  const base = getAboutFaqs(slug);
  if (locale === "en") return base;
  return mergeTranslation(base, overlays[locale]?.[slug]);
}
