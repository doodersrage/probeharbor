import { defineConfig } from "vitepress";

const site = "https://probeharbor.dev";
// GitHub Pages serves this site under /probeharbor/. The copy published on the
// main domain is built with DOCS_BASE=/developers/ (see scripts/build-docs-site.mjs).
const base = process.env.DOCS_BASE || "/probeharbor/";
const onMainDomain = base === "/developers/";
// Both builds name the main-domain copy as canonical, so links to either one
// count toward probeharbor.dev.
const docs = `${site}/developers/`;
/** The default share-image alt text from src/lib/ogMeta.ts. */
const shareImageAlt =
  "ProbeHarbor environmental sensor dashboard with live curves, freeze alerts, and flood/leak contacts";

/**
 * JSON-LD for a docs page: a TechArticle plus breadcrumbs back to the main
 * site. No datePublished/dateModified: CI checks out with depth 1, so git
 * dates would all read as the latest commit, which would be false.
 */
function docsStructuredData(url: string, pageTitle: string | undefined, description: string) {
  const publisher = {
    "@type": "Organization",
    name: "ProbeHarbor",
    url: site,
    logo: { "@type": "ImageObject", url: `${site}/logo.svg` },
  };
  const crumbs = [
    { name: "ProbeHarbor", url: site },
    { name: "Developers", url: docs },
  ];
  if (url !== docs && pageTitle) crumbs.push({ name: pageTitle, url });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: pageTitle || "ProbeHarbor Docs",
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: [`${site}/og-dashboard.jpg`],
        inLanguage: "en-US",
        author: publisher,
        publisher,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      },
    ],
  };
}

export default defineConfig({
  title: "ProbeHarbor Docs",
  description:
    "Developer documentation for ProbeHarbor — ingest, API, sketches, local development, and deploy.",
  base,
  cleanUrls: true,
  lastUpdated: true,
  // Operator notes and drafts live in the repo, not on the published site.
  srcExclude: ["README.md", "analytics-funnel.md", "community/**"],
  sitemap: onMainDomain ? { hostname: docs } : undefined,
  transformHead({ pageData, siteData }) {
    if (pageData.isNotFound) return [];
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
    const url = `${docs}${path}`;
    // Per-page share previews: each page's own title, description, and URL.
    // The home page's title is the site title; don't repeat it.
    const title =
      pageData.title && pageData.title !== siteData.title
        ? `${pageData.title} | ${siteData.title}`
        : siteData.title;
    const description = pageData.frontmatter.description ?? pageData.description ?? siteData.description;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:type", content: url === docs ? "website" : "article" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["script", { type: "application/ld+json" }, JSON.stringify(docsStructuredData(url, pageData.title, description))],
    ];
  },
  head: [
    ["link", { rel: "icon", href: `${site}/favicon.svg` }],
    ["meta", { name: "theme-color", content: "#090b0f" }],
    // Same share image and tags as the main site's Layout (src/lib/ogMeta.ts).
    ["meta", { property: "og:site_name", content: "ProbeHarbor" }],
    ["meta", { property: "og:locale", content: "en_US" }],
    ["meta", { property: "og:image", content: `${site}/og-dashboard.jpg` }],
    ["meta", { property: "og:image:type", content: "image/jpeg" }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    ["meta", { property: "og:image:alt", content: shareImageAlt }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: `${site}/og-dashboard.jpg` }],
    ["meta", { name: "twitter:image:alt", content: shareImageAlt }],
  ],
  themeConfig: {
    logo: { src: `${site}/favicon.svg`, alt: "ProbeHarbor" },
    siteTitle: "ProbeHarbor",
    nav: [
      { text: "Guide", link: "/guide/architecture" },
      { text: "Ingest", link: "/ingest/" },
      { text: "API", link: "/api/" },
      {
        text: "Links",
        items: [
          { text: "Live app", link: site },
          { text: "About & guides", link: `${site}/about` },
          { text: "GitHub repo", link: "https://github.com/doodersrage/probeharbor" },
          { text: "OpenAPI YAML", link: "/openapi.yaml" },
        ],
      },
    ],
    sidebar: {
      "/": [
        {
          text: "Introduction",
          items: [
            { text: "Overview", link: "/" },
            { text: "Architecture", link: "/guide/architecture" },
            { text: "Local development", link: "/guide/local-dev" },
            { text: "Deploy & ops", link: "/guide/deploy" },
            { text: "Troubleshooting", link: "/guide/troubleshooting" },
          ],
        },
        {
          text: "Hardware & ingest",
          items: [
            { text: "Push ingest", link: "/ingest/" },
            { text: "Pull feeds", link: "/ingest/pull-feeds" },
            { text: "Sensor sketches", link: "/sketches/" },
          ],
        },
        {
          text: "Integrations",
          items: [
            { text: "HTTP API", link: "/api/" },
            { text: "Alert webhooks", link: "/integrations/webhooks" },
            { text: "Home Assistant", link: "/integrations/home-assistant" },
            { text: "Matter / Apple Home", link: "/integrations/matter" },
            { text: "SmartThings (via Matter)", link: "/integrations/smartthings" },
            { text: "Node-RED", link: "/integrations/node-red" },
            { text: "MQTT bridge", link: "/integrations/mqtt-bridge" },
            { text: "InfluxDB & Telegraf", link: "/integrations/influx" },
            { text: "IFTTT / n8n / Sheets", link: "/integrations/automation" },
            { text: "ESPHome & Shelly", link: "/integrations/esphome-shelly" },
            { text: "Personal weather stations", link: "/integrations/personal-weather-stations" },
            { text: "Grafana / Prometheus", link: "/integrations/grafana" },
          ],
        },
        {
          text: "On probeharbor.dev",
          items: [
            { text: "Product About hub", link: `${site}/about` },
            { text: "In-app API page", link: `${site}/docs/api` },
            { text: "Pricing", link: `${site}/pricing` },
            { text: "System status", link: `${site}/system-status` },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/doodersrage/probeharbor" },
    ],
    footer: {
      message:
        'App & product guides: <a href="https://probeharbor.dev">probeharbor.dev</a> · This site: developer reference',
      copyright: "Copyright © ProbeHarbor",
    },
    search: { provider: "local" },
    editLink: {
      pattern:
        "https://github.com/doodersrage/probeharbor/edit/main/docs/:path",
      text: "Edit on GitHub",
    },
    outline: { level: [2, 3] },
  },
});
