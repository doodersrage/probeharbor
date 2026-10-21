import { type Answer, answers, getAnswersRelatedTo } from "../../../lib/answers";
import type { Locale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { keyedOverlays } from "../collect";

/** Translation file shape: `{ [answerSlug]: { question, shortAnswer, sections: [...], ... } }`. */
export type AnswerOverlay = Record<string, DeepPartial<Answer>>;

const overlays = () => keyedOverlays<DeepPartial<Answer>>("answers");

export function getLocalizedAnswers(locale: Locale): Answer[] {
  return translateList(locale, answers, overlays(), (a) => a.slug);
}

export function getLocalizedAnswer(slug: string, locale: Locale): Answer | undefined {
  return getLocalizedAnswers(locale).find((a) => a.slug === slug);
}

export function getLocalizedAnswersRelatedTo(
  path: string,
  locale: Locale,
  fallbackSlugs: string[] = [],
  limit = 3,
): Answer[] {
  const slugs = getAnswersRelatedTo(path, fallbackSlugs, limit).map((a) => a.slug);
  return slugs
    .map((slug) => getLocalizedAnswer(slug, locale))
    .filter((a): a is Answer => !!a);
}
