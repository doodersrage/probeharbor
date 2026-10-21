import { type AboutFaqItem, getAboutFaqs } from "../../../lib/aboutFaqs";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [aboutSlug]: [{ question, answer }, ...] }` in English order. */
export type AboutFaqOverlay = Record<string, DeepPartial<AboutFaqItem>[]>;

const overlays = () => keyedOverlays<DeepPartial<AboutFaqItem>[]>("aboutFaqs");

export function getLocalizedAboutFaqs(slug: string, locale: Locale): AboutFaqItem[] {
  const base = getAboutFaqs(slug);
  if (locale === "en") return base;
  return mergeTranslation(base, overlays()[locale]?.[slug]);
}
