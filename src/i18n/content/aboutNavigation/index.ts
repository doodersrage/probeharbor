import {
  type AboutJourney,
  type AboutJourneyStep,
  aboutJourneys,
} from "../../../lib/aboutJourneys";
import {
  type AboutMegaGroup,
  type AboutTopicSection,
  aboutMegaGroups,
  featuredAboutSlugs,
  getAboutMegaGroupSections,
} from "../../../lib/aboutNavigation";
import type { AboutPage } from "../../../lib/aboutPages";
import { type AboutSearchEntry, buildAboutSearchIndex } from "../../../lib/aboutSearchIndex";
import type { Locale, TranslatedLocale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { getLocalizedAboutPages } from "../aboutPages";
import { fromContentModules } from "../collect";

/**
 * Translation file shape (one file per locale folder):
 * `{ megaGroups: { [groupId]: { title, description } }, journeys: { [journeyId]: { title, description, ctaLabel, steps: [{ label }, ...] } } }`.
 * Journey steps follow the English order; slugs and hrefs come from English.
 */
export type AboutNavigationOverlay = {
  megaGroups?: Record<string, DeepPartial<Pick<AboutMegaGroup, "title" | "description">>>;
  journeys?: Record<string, DeepPartial<Pick<AboutJourney, "title" | "description" | "ctaLabel" | "steps">>>;
};

const loadOverlays = () =>
  fromContentModules("aboutNavigation", undefined, (modules) => {
    const overlays: Partial<Record<TranslatedLocale, AboutNavigationOverlay>> = {};
    for (const [file, mod] of Object.entries(modules as Record<string, { default: AboutNavigationOverlay }>)) {
      const locale = /\/([a-z]{2}(?:-[a-z]{2})?)\/[^/]+\.ts$/.exec(file)?.[1] as TranslatedLocale | undefined;
      if (!locale) continue;
      const prev = overlays[locale] ?? {};
      overlays[locale] = {
        megaGroups: { ...prev.megaGroups, ...mod.default.megaGroups },
        journeys: { ...prev.journeys, ...mod.default.journeys },
      };
    }
    return overlays;
  });

function pageMap(locale: Locale): Map<string, AboutPage> {
  return new Map(getLocalizedAboutPages(locale).map((p) => [p.slug, p]));
}

function localizeSection(section: AboutTopicSection, pages: Map<string, AboutPage>): AboutTopicSection {
  return {
    core: pages.get(section.core.slug) ?? section.core,
    guides: section.guides.map((g) => pages.get(g.slug) ?? g),
  };
}

export function getLocalizedAboutMegaGroups(locale: Locale): AboutMegaGroup[] {
  const table = loadOverlays()[locale as TranslatedLocale]?.megaGroups ?? {};
  return translateList(locale, aboutMegaGroups, { [locale]: table }, (g) => g.id);
}

export function getLocalizedAboutMegaGroupSections(locale: Locale) {
  const pages = pageMap(locale);
  const groups = new Map(getLocalizedAboutMegaGroups(locale).map((g) => [g.id, g]));
  return getAboutMegaGroupSections().map((entry) => ({
    ...entry,
    group: groups.get(entry.group.id) ?? entry.group,
    sections: entry.sections.map((s) => localizeSection(s, pages)),
  }));
}

export function getLocalizedFeaturedAboutPages(locale: Locale): AboutPage[] {
  const pages = pageMap(locale);
  return featuredAboutSlugs
    .map((slug) => pages.get(slug))
    .filter((page): page is AboutPage => !!page);
}

/** Like `getTopicContext`, with localized page titles and summaries. */
export function getLocalizedTopicContext(
  slug: string,
  locale: Locale,
): { core: AboutPage; guides: AboutPage[]; current: AboutPage } | null {
  const pages = pageMap(locale);
  const current = pages.get(slug);
  if (!current) return null;
  const coreSlug = current.parentSlug ?? current.slug;
  const core = pages.get(coreSlug);
  if (!core) return null;
  const guides = [...pages.values()].filter((p) => p.parentSlug === coreSlug);
  return { core, guides, current };
}

export function getLocalizedAboutJourneys(locale: Locale): AboutJourney[] {
  const table = loadOverlays()[locale as TranslatedLocale]?.journeys ?? {};
  return translateList(locale, aboutJourneys, { [locale]: table }, (j) => j.id);
}

/** Like `getJourneysForSlug`, with localized journey and step labels. */
export function getLocalizedJourneysForSlug(slug: string, locale: Locale) {
  const out: Array<{
    journey: AboutJourney;
    stepIndex: number;
    nextStep: AboutJourneyStep | null;
    previousStep: AboutJourneyStep | null;
  }> = [];
  for (const journey of getLocalizedAboutJourneys(locale)) {
    const stepIndex = journey.steps.findIndex((step) => step.slug === slug);
    if (stepIndex < 0) continue;
    out.push({
      journey,
      stepIndex,
      previousStep: stepIndex > 0 ? journey.steps[stepIndex - 1]! : null,
      nextStep: stepIndex < journey.steps.length - 1 ? journey.steps[stepIndex + 1]! : null,
    });
  }
  return out;
}

export function getLocalizedAboutSearchIndex(locale: Locale): AboutSearchEntry[] {
  return buildAboutSearchIndex(getLocalizedAboutPages(locale));
}

export function getLocalizedFeaturedAboutSearchIndex(locale: Locale): AboutSearchEntry[] {
  return buildAboutSearchIndex(getLocalizedFeaturedAboutPages(locale));
}
