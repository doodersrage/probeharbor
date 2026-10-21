import { type Story, stories } from "../../../lib/stories";
import type { Locale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [storySlug]: { headline, title, setup: [...], ... } }`. */
export type StoryOverlay = Record<string, DeepPartial<Story>>;

const overlays = () => keyedOverlays<DeepPartial<Story>>("stories");

export function getLocalizedStories(locale: Locale): Story[] {
  return translateList(locale, stories, overlays(), (s) => s.slug);
}

export function getLocalizedStory(slug: string, locale: Locale): Story | undefined {
  return getLocalizedStories(locale).find((s) => s.slug === slug);
}
