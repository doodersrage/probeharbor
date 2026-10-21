import { describe, expect, it } from "vitest";
import { localizePath, splitLocalePath } from "./locales";
import { getAlternatePaths, isLocalizablePath, localizeHtmlLinks } from "./routes";
import { mergeTranslation, translateList } from "./translate";

describe("locale paths", () => {
  it("splits a locale prefix", () => {
    expect(splitLocalePath("/es/pricing")).toEqual({ locale: "es", path: "/pricing" });
    expect(splitLocalePath("/pt-br")).toEqual({ locale: "pt-br", path: "/" });
    expect(splitLocalePath("/pricing")).toEqual({ locale: "en", path: "/pricing" });
    expect(splitLocalePath("/en/pricing")).toEqual({ locale: "en", path: "/en/pricing" });
    expect(splitLocalePath("/esp32")).toEqual({ locale: "en", path: "/esp32" });
  });

  it("builds localized paths", () => {
    expect(localizePath("/", "fr")).toBe("/fr");
    expect(localizePath("/compare/nest", "de")).toBe("/de/compare/nest");
    expect(localizePath("/compare/nest", "en")).toBe("/compare/nest");
  });

  it("keeps legal and API pages English-only", () => {
    expect(isLocalizablePath("/pricing")).toBe(true);
    expect(isLocalizablePath("/privacy")).toBe(false);
    expect(isLocalizablePath("/docs/api")).toBe(false);
    expect(isLocalizablePath("/dashboard")).toBe(false);
    expect(getAlternatePaths("/terms")).toEqual([]);
    expect(getAlternatePaths("/").map((a) => a.path)).toEqual(["/", "/es", "/fr", "/de", "/pt-br"]);
  });
});

describe("localizeHtmlLinks", () => {
  it("rewrites internal marketing links only", () => {
    const html = [
      '<a class="x" href="/pricing#faq">p</a>',
      '<a href="/about/probe-demo?preset=coldSnap">d</a>',
      '<a href="/signin">s</a>',
      '<a href="/privacy">pr</a>',
      '<a href="https://github.com/x">g</a>',
      '<a href="/" data-locale-switch>en</a>',
      '<link rel="canonical" href="/pricing">',
    ].join("");
    const out = localizeHtmlLinks(html, "es");
    expect(out).toContain('href="/es/pricing#faq"');
    expect(out).toContain('href="/es/about/probe-demo?preset=coldSnap"');
    expect(out).toContain('href="/es/signin"');
    expect(out).toContain('href="/privacy"');
    expect(out).toContain('href="https://github.com/x"');
    expect(out).toContain('<a href="/" data-locale-switch>');
    expect(out).toContain('<link rel="canonical" href="/pricing">');
    expect(localizeHtmlLinks(html, "en")).toBe(html);
  });
});

describe("translations", () => {
  it("overlays text and keeps English structure", () => {
    const base = { title: "Hi", href: "/x", n: 3, items: [{ q: "a", id: 1 }, { q: "b", id: 2 }] };
    expect(mergeTranslation(base, { title: "Hola", items: [{ q: "A" }] })).toEqual({
      title: "Hola",
      href: "/x",
      n: 3,
      items: [{ q: "A", id: 1 }, { q: "b", id: 2 }],
    });
  });

  it("translates lists by key and falls back to English", () => {
    const list = [{ slug: "a", t: "One" }, { slug: "b", t: "Two" }];
    const out = translateList("fr", list, { fr: { b: { t: "Deux" } } }, (i) => i.slug);
    expect(out.map((i) => i.t)).toEqual(["One", "Deux"]);
    expect(translateList("de", list, { fr: { b: { t: "Deux" } } }, (i) => i.slug)).toEqual(list);
  });
});
