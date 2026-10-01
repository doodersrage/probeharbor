import { getPublicSitemapPaths, getSitemapLastModified } from "./sitemapPages";

const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
} as const;

/** Build a urlset sitemap body for all public paths. */
export function buildSitemapUrlsetXml(site: string): string {
  const base = site.replace(/\/+$/, "");
  const lastModified = getSitemapLastModified();
  const body = getPublicSitemapPaths()
    .map((path) => {
      const lastmod = lastModified.get(path);
      return `  <url><loc>${escapeXml(`${base}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/** Sitemap index pointing at the single urlset (SSR-served). */
export function buildSitemapIndexXml(site: string): string {
  const base = site.replace(/\/+$/, "");
  const loc = `${base}/sitemap-0.xml`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>\n</sitemapindex>\n`;
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
