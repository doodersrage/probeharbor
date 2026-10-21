type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */

const en = {
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  breadcrumbLabel: "Breadcrumb",
  ogSectionFallback: "Guides",
  faqHeading: "FAQ",
  paginationLabel: "About section pages",
  aboutOverview: "About overview",
  backToOverview: "Back to overview",
  convertBar: {
    label: "Try ProbeHarbor",
    copyHtml: "<strong>Live demo</strong>, no account. Ready to connect probes? Free forever, no card.",
    demo: "Try live demo",
    startFree: "Start free",
  },
  sidebar: {
    label: "Guides in this topic",
    inThisTopic: "In this topic",
    relatedLabel: "Related guides",
    backToOverview: "← Back to overview",
    guidesHub: "Guides hub",
    allArticles: "All articles",
  },
  related: {
    title: "Related guides",
    moreUnder: "More under",
  },
  journeyStrip: {
    label: "Learning path",
    path: "Path:",
    step: `Step {n} of {total}`,
    next: `Next: {label} →`,
  },
  journeys: {
    title: "Choose a path",
    subtitle:
      "Job-based journeys through the guides, start with the outcome you care about, then dig into topics.",
    startFree: "Start free",
  },
  quickStart: {
    title: "Start here",
    lead: "Popular entry points: playbooks, demo, ingest, channels, and household sharing.",
  },
  hubNav: {
    label: "About section topics",
    title: "Browse by topic",
    lead: `{core} topic overviews and {guides} deep-dive guides across five learning paths. Search above or jump to a section below.`,
    topics: { one: "topic", other: "topics" },
    guides: "guides",
    readOverview: "Read overview",
    deepDive: "Deep-dive guides",
  },
  productCta: {
    liveDemo: "Live demo",
    seePlans: "See plans",
    fallback: {
      title: "Set this up in ProbeHarbor",
      body: "Free forever, no credit card: track probes, freeze and leak alerts, and history without running your own server.",
      label: "Create free account",
    } as ProductCta,
    bySlug: {
      "cold-snap-playbook": {
        title: "Put the playbook into practice",
        body: "Set freeze °F + email under Alerts → When to alert, or finish the inline card on Devices after first ingest.",
        label: "Open alert settings",
      },
      "alert-channel-cookbook": {
        title: "Wire your channels",
        body: "Start with email under Alerts → How you're told, then add chat apps or Pro SMS when you need louder overnight coverage.",
        label: "Open alert settings",
      },
      "household-sharing-walkthrough": {
        title: "Invite your household",
        body: "Share live probes with invites, or send a free family live link to anyone without an account.",
        label: "Open share links",
      },
      "freeze-protection-thresholds": {
        title: "Set your freeze threshold",
        body: "Start monitoring with a threshold that matches your coldest zone.",
        label: "Set threshold",
      },
      "ingest-and-webhooks": {
        title: "Add a device key",
        body: "Create push ingest credentials on the Devices page and post a test reading.",
        label: "Open devices",
      },
      "adding-devices": {
        title: "Create your free device key",
        body: "Free forever, no credit card: land on Devices, create a push key, and POST a test reading.",
        label: "Start free",
      },
      "dht22-sensor-overview": {
        title: "See it on a live dashboard",
        body: "Create a free account (no card), map your probe keys, and watch freeze and leak risk overnight.",
        label: "Start free",
      },
    } as Record<string, ProductCta>,
  },
  search: {
    label: "Search guides",
    placeholder: "Probe wiring, CSV export, ingest API, alerts…",
    featured: "Popular starting points",
    noMatchBefore: "No guides matched “",
    noMatchAfter: "”.",
  },
  probeActivity: {
    northWall: "North wall",
    doorZone: "Door zone",
    workbench: "Workbench",
    sunLoad: "Sun load {n}%",
    bayInterior: "Bay interior",
    outside: "{t} outside",
    humidity: "{n}% RH",
    feed: "JSON feed → website dashboard",
    staticPreview: "Static preview",
    simulated: "Simulated probe activity",
    ariaLabel:
      "Animated bay cross-section showing three temperature probes reporting live readings, a door opening and closing, sun load changing, and data pulses traveling to the website dashboard.",
    caption:
      "North wall, door zone, and workbench probes refresh every few seconds—the same rhythm as the live dashboard feed.",
    celsius: false,
  },
};

export type AboutArticleMessages = typeof en;
export default en;
