import { describe, expect, it } from "vitest";
import { META_DESCRIPTION_MAX_LENGTH } from "./brand";
import { answers, getAnswersRelatedTo } from "./answers";
import { getPublicSitemapPaths } from "./sitemapPages";

describe("answers", () => {
  it("keeps descriptions within the SERP cutoff", () => {
    for (const a of answers) {
      expect(a.description.length, a.slug).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    }
  });

  it("leads with a short answer and has unique slugs matching paths", () => {
    expect(new Set(answers.map((a) => a.slug)).size).toBe(answers.length);
    for (const a of answers) {
      expect(a.path).toBe(`/answers/${a.slug}`);
      expect(a.question.endsWith("?")).toBe(true);
      expect(a.shortAnswer.length).toBeGreaterThan(80);
    }
  });

  it("links only to answers that exist", () => {
    const paths = new Set(answers.map((a) => a.path));
    for (const a of answers) {
      for (const link of a.related.filter((l) => l.href.startsWith("/answers/"))) {
        expect(paths.has(link.href), `${a.slug} → ${link.href}`).toBe(true);
      }
    }
  });

  it("finds answers that link to a page, then fills from fallbacks", () => {
    const related = getAnswersRelatedTo("/compare/tempstick", ["freeze-alarm-temperature-setting"]);
    expect(related.map((a) => a.slug)).toEqual([
      "freeze-alarm-without-subscription",
      "freeze-alarm-temperature-setting",
    ]);
    expect(getAnswersRelatedTo("/nowhere", ["missing-slug"])).toEqual([]);
  });

  it("lists the hub and every answer in the sitemap", () => {
    const sitemap = getPublicSitemapPaths();
    expect(sitemap).toContain("/answers");
    for (const a of answers) expect(sitemap).toContain(a.path);
  });
});
