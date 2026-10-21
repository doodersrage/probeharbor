/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */

const en = {
  layoutTitle: "About",
  title: "About ProbeHarbor",
  description:
    "Guides on temperature probes, freeze and flood/leak alerts, Arduino firmware, ESP ingest, household sharing, and the monitoring stack behind ProbeHarbor.",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  kicker: "About",
  lede: "Open-source guides on probes, freeze/flood alerts, firmware, and the stack behind ProbeHarbor. Prefer a shorter list? Start on the guides hub.",
  startFree: "Start free",
  guidesHub: "Guides hub",
  findTitle: "Find a guide",
  findSubtitle: `Search {count} articles or browse by learning path below.`,
  probe: {
    eyebrow: "Live simulation",
    title: "Three probes, one space",
    lede: "Watch temperature and humidity shift as sun load, outdoor air, and airflow change conditions zone by zone, just like the live JSON feed.",
  },
  repos: {
    title: "Open-source repositories",
    subtitleHtml:
      'Projects you can inspect, fork, or adapt for your own build. Programmatic integrations start with the <a class="text-link" href="/docs/api">HTTP API</a> and <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Arduino sketch and sensor firmware",
    website: "This website (Astro on Cloudflare): includes sample sensor sketches",
    relay: "JSON feed relay (FastAPI with Redis caching)",
  },
  faqLede: "Quick answers before you dive into a guide.",
  faqs: [
    {
      question: "What is covered in the About guides?",
      answer:
        "Probe placement, DHT22 and Arduino wiring, freeze thresholds, flood/leak contacts, ingest APIs, household sharing, PWA install, and how ProbeHarbor stores and charts readings.",
    },
    {
      question: "Where should I start?",
      answer:
        "Pick a job-based journey on this page (freeze protection, flood/leak setup, wiring, ingest, debugging, or household setup), or search the full guide index.",
    },
    {
      question: "Is ProbeHarbor open source?",
      answer:
        "Yes: application and firmware-related repos are linked from this hub so you can inspect, fork, or adapt the stack.",
    },
    {
      question: "Where does ProbeHarbor run?",
      answer:
        "The website and ingest APIs run on Cloudflare’s edge (Workers). Live job and ingest health is on /system-status: we publish measured health, not a marketing uptime percentage. Stack detail: /about/astro-applications.",
    },
  ],
};

export type AboutMessages = typeof en;
export default en;
