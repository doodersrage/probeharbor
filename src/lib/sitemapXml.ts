import { getPublicSitemapPaths, getSitemapLastModified } from "./sitemapPages";
import { LOCALE_META, TRANSLATED_LOCALES, localizePath } from "../i18n/locales";
import { getAlternatePaths, isLocalizablePath } from "../i18n/routes";

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
} as const;

/**
 * Build a urlset sitemap body for all public paths, plus /es, /fr, /de and
 * /pt-br versions of each translated page with hreflang alternates.
 */
export function buildSitemapUrlsetXml(site: string): string {
  const base = site.replace(/\/+$/, "");
  const lastModified = getSitemapLastModified();
  const entry = (englishPath: string, loc: string) => {
    const lastmod = lastModified.get(englishPath);
    const alternates = getAlternatePaths(englishPath);
    const links = alternates.length
      ? [
          ...alternates.map(
            (alt) =>
              `<xhtml:link rel="alternate" hreflang="${LOCALE_META[alt.locale].hreflang}" href="${escapeXml(`${base}${alt.path}`)}"/>`,
          ),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}${englishPath}`)}"/>`,
        ].join("")
      : "";
    return `  <url><loc>${escapeXml(`${base}${loc}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${links}</url>`;
  };
  const paths = getPublicSitemapPaths();
  const body = [
    ...paths.map((path) => entry(path, path)),
    ...TRANSLATED_LOCALES.flatMap((locale) =>
      paths.filter(isLocalizablePath).map((path) => entry(path, localizePath(path, locale))),
    ),
  ].join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

/** Sitemap index: the SSR-served urlset plus the developer docs' own sitemap. */
export function buildSitemapIndexXml(site: string): string {
  const base = site.replace(/\/+$/, "");
  // /developers/sitemap.xml is written by the VitePress build (scripts/build-docs-site.mjs).
  const entries = [`${base}/sitemap-0.xml`, `${base}/developers/sitemap.xml`]
    .map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, { status: 200, headers: XML_HEADERS });
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Count of public paths (for smoke/tests). */
export function getPublicSitemapPathCount(): number {
  return getPublicSitemapPaths().length;
}
