import { BAYBUDDY_TAGLINE } from "../../../lib/bayBuddy";
import { COMPANION_APPS, type CompanionApp } from "../../../lib/companionApps";
import { DESKTOP_TAGLINE } from "../../../lib/desktop";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { keyedOverlays } from "../collect";

/**
 * Translation file shape for the companion-app data in `src/lib/companionApps.ts`,
 * `src/lib/desktop.ts` and `src/lib/bayBuddy.ts`. Only visible text: ids, paths
 * and product names come from English. The Desktop and Bay Buddy card summaries
 * default to the translated taglines.
 */
export type AppsOverlay = {
  companionApps?: Record<string, DeepPartial<CompanionApp>>;
  desktop?: { tagline?: string };
  bayBuddy?: { tagline?: string };
};

const overlays = () => keyedOverlays<unknown>("apps") as Partial<Record<Locale, AppsOverlay>>;

export function getLocalizedDesktopTagline(locale: Locale): string {
  return overlays()[locale]?.desktop?.tagline ?? DESKTOP_TAGLINE;
}

export function getLocalizedBayBuddyTagline(locale: Locale): string {
  return overlays()[locale]?.bayBuddy?.tagline ?? BAYBUDDY_TAGLINE;
}

/** `COMPANION_APPS` with visible text in the given locale (English is returned as is). */
export function getLocalizedCompanionApps(locale: Locale): CompanionApp[] {
  if (locale === "en") return [...COMPANION_APPS];
  const table = overlays()[locale]?.companionApps ?? {};
  const taglines: Record<string, string> = {
    desktop: getLocalizedDesktopTagline(locale),
    "bay-buddy": getLocalizedBayBuddyTagline(locale),
  };
  return COMPANION_APPS.map((app) =>
    mergeTranslation(app, { summary: taglines[app.id], ...table[app.id] }),
  );
}
