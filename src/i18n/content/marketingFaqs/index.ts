import type { AboutFaqItem } from "../../../lib/aboutFaqs";
import { getMarketingFaqs, type MarketingFaqKey } from "../../../lib/marketingFaqs";
import { getFaqPageSchema } from "../../../lib/schemaMarkup";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [faqKey]: [{ question, answer }, ...] }` in English order. */
export type MarketingFaqOverlay = Partial<Record<MarketingFaqKey, DeepPartial<AboutFaqItem>[]>>;

const overlays = () => keyedOverlays<DeepPartial<AboutFaqItem>[]>("marketingFaqs");

export function getLocalizedMarketingFaqs(key: MarketingFaqKey, locale: Locale): AboutFaqItem[] {
  const base = getMarketingFaqs(key) as AboutFaqItem[];
  if (locale === "en") return base;
  return mergeTranslation(base, overlays()[locale]?.[key]);
}

export function getLocalizedMarketingFaqSchema(pageUrl: string, key: MarketingFaqKey, locale: Locale) {
  return getFaqPageSchema(pageUrl, getLocalizedMarketingFaqs(key, locale));
}
