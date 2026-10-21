import { type GuideHubCategory, getGuideHubCategories } from "../../../lib/guideHub";
import type { Locale, TranslatedLocale } from "../../locales";
import { isLocale } from "../../locales";
import { getLocalizedAboutPage } from "../aboutPages";
import { fromContentModules } from "../collect";

/**
 * Translation file shape for the /guides hub (`src/lib/guideHub.ts`).
 * - `categories`: keyed by category id (title, description).
 * - `links`: keyed by href, only for links with their own label/summary.
 *   Links to `/about/<slug>` take their label/summary from the localized
 *   About page (`aboutPages` overlays), like the English hub does.
 */
export type GuideHubOverlay = {
  categories?: Record<string, { title?: string; description?: string }>;
  links?: Record<string, { label?: string; summary?: string }>;
};

const loadOverlays = () =>
  fromContentModules("guideHub", undefined, (modules) => {
    const overlays: Partial<Record<TranslatedLocale, GuideHubOverlay>> = {};
    for (const [file, mod] of Object.entries(modules as Record<string, { default: GuideHubOverlay }>)) {
      const locale = /\/([a-z]{2}(?:-[a-z]{2})?)\/[^/]+\.ts$/.exec(file)?.[1];
      if (!isLocale(locale) || locale === "en") continue;
      const prev = overlays[locale] ?? {};
      overlays[locale] = {
        categories: { ...prev.categories, ...mod.default.categories },
        links: { ...prev.links, ...mod.default.links },
      };
    }
    return overlays;
  });

export function getLocalizedGuideHubCategories(locale: Locale): GuideHubCategory[] {
  const categories = getGuideHubCategories();
  if (locale === "en") return categories;
  const overlay = loadOverlays()[locale];
  return categories.map((category) => {
    const c = overlay?.categories?.[category.id];
    return {
      ...category,
      title: c?.title ?? category.title,
      description: c?.description ?? category.description,
      links: category.links.map((link) => {
        const l = overlay?.links?.[link.href];
        if (l) return { ...link, label: l.label ?? link.label, summary: l.summary ?? link.summary };
        const slug = /^\/about\/([^/#?]+)$/.exec(link.href)?.[1];
        const page = slug ? getLocalizedAboutPage(slug, locale) : undefined;
        if (!page) return link;
        return { ...link, label: page.title || link.label, summary: page.summary || link.summary };
      }),
    };
  });
}

export function getLocalizedGuideHubCategoryTitle(id: string, locale: Locale): string {
  return getLocalizedGuideHubCategories(locale).find((c) => c.id === id)?.title ?? id;
}
