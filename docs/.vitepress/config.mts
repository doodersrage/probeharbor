import { defineConfig } from "vitepress";

const site = "https://probeharbor.dev";
// GitHub Pages serves this site under /probeharbor/. The copy published on the
// main domain is built with DOCS_BASE=/developers/ (see scripts/build-docs-site.mjs).
const base = process.env.DOCS_BASE || "/probeharbor/";
const onMainDomain = base === "/developers/";
// Both builds name the main-domain copy as canonical, so links to either one
// count toward probeharbor.dev.
const docs = `${site}/developers/`;

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
    const title = pageData.title ? `${pageData.title} | ${siteData.title}` : siteData.title;
    const description = pageData.frontmatter.description ?? pageData.description ?? siteData.description;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
    ];
  },
  head: [
    ["link", { rel: "icon", href: `${site}/favicon.svg` }],
    ["meta", { name: "theme-color", content: "#090b0f" }],
    ["meta", { property: "og:image", content: `${site}/og-dashboard.jpg` }],
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
