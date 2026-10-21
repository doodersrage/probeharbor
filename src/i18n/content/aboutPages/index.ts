import { type AboutPage, aboutPages } from "../../../lib/aboutPages";
import type { Locale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [aboutSlug]: { title, description, summary } }`. */
export type AboutPageOverlay = Record<string, DeepPartial<Pick<AboutPage, "title" | "description" | "summary">>>;

const overlays = () => keyedOverlays<DeepPartial<AboutPage>>("aboutPages");

export function getLocalizedAboutPages(locale: Locale): AboutPage[] {
  return translateList(locale, aboutPages, overlays(), (p) => p.slug);
}

export function getLocalizedAboutPage(slug: string, locale: Locale): AboutPage | undefined {
  return getLocalizedAboutPages(locale).find((p) => p.slug === slug);
}

export function getLocalizedAboutParent(slug: string, locale: Locale): AboutPage | undefined {
  const page = getLocalizedAboutPage(slug, locale);
  return page?.parentSlug ? getLocalizedAboutPage(page.parentSlug, locale) : undefined;
}
