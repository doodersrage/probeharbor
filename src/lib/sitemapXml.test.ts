import { describe, expect, it } from "vitest";
import {
  buildSitemapIndexXml,
  buildSitemapUrlsetXml,
  escapeXml,
  getPublicSitemapPathCount,
} from "./sitemapXml";

describe("sitemapXml", () => {
  it("escapes XML entities", () => {
    expect(escapeXml(`a&b<c>"d"'`)).toBe("a&amp;b&lt;c&gt;&quot;d&quot;&apos;");
  });

  it("builds a urlset with about guides", () => {
    const xml = buildSitemapUrlsetXml("https://probeharbor.dev");
    expect(xml).toContain("<urlset");
    expect(xml).toContain("https://probeharbor.dev/about/dht22-sensor-overview");
    expect(xml).toContain("https://probeharbor.dev/docs/api");
    expect(xml).not.toContain("zapier-integration");
    expect(getPublicSitemapPathCount()).toBeGreaterThanOrEqual(100);
  });

  it("adds lastmod only to pages with a recorded date", () => {
    const xml = buildSitemapUrlsetXml("https://probeharbor.dev");
    expect(xml).toMatch(
      /<loc>https:\/\/probeharbor\.dev\/answers\/garage-pipe-freeze-temperature<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/,
    );
    expect(xml).toMatch(/<url><loc>https:\/\/probeharbor\.dev\/pricing<\/loc><xhtml:link/);
  });

  it("lists translated pages with hreflang alternates", () => {
    const xml = buildSitemapUrlsetXml("https://probeharbor.dev");
    expect(xml).toContain("xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"");
    expect(xml).toContain("<loc>https://probeharbor.dev/es/pricing</loc>");
    expect(xml).toContain("<loc>https://probeharbor.dev/pt-br</loc>");
    expect(xml).toContain('hreflang="de" href="https://probeharbor.dev/de/pricing"');
    expect(xml).toContain('hreflang="x-default" href="https://probeharbor.dev/pricing"');
    // English-only pages get no locale copies or alternates.
    expect(xml).not.toContain("https://probeharbor.dev/es/privacy");
    expect(xml).toContain("<url><loc>https://probeharbor.dev/privacy</loc></url>");
  });

  it("builds a sitemap index pointing at sitemap-0", () => {
    const xml = buildSitemapIndexXml("https://probeharbor.dev/");
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("https://probeharbor.dev/sitemap-0.xml");
    expect(xml).toContain("https://probeharbor.dev/developers/sitemap.xml");
  });
});
