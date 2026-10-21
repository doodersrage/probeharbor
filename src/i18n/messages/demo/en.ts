/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */

const en = {
  title: "Live probe demo",
  description:
    "Try ProbeHarbor without an account: interactive probe simulator, real live demo probes, and the same freeze/flood alert path your hardware will use.",
  ogImageAlt: "ProbeHarbor live probe temperature curves, no account required",
  breadcrumbHome: "Home",
  breadcrumbDemo: "Live demo",
  schemaName: "ProbeHarbor live probe demo",
  schemaDescription:
    "No-account ProbeHarbor demos: interactive multi-zone probe simulator plus live demo probes on the production ingest path.",
  header: {
    kicker: "Try it (no account)",
    title: "Demos: simulator + live feed",
    lede: "Cause a freeze event in the interactive probe simulator, or watch real demo probes next to outdoor weather: same ingest path your ESP or Arduino will use for freeze and flood alerts.",
    simulator: "Interactive simulator",
    liveReadings: "Live readings",
    connect: "Connect my probes",
  },
  paths: {
    title: "Three ways to try ProbeHarbor",
    lede: "Start with the simulator if you want to feel freeze risk respond to you, then confirm with the live feed and auto-wet flood path.",
    items: [
      {
        label: "Interactive probe simulator",
        text: "Hands-on (best first stop). Tweak door open/closed, sun load, outdoor air, and freeze threshold. Cause a cold snap; watch multi-zone bars and push/pull JSON update.",
      },
      {
        label: "Live demo feed",
        text: "Observational. Real demo probes refresh here on the production ingest path. Best when you want “is this fake?” answered with live numbers.",
      },
      {
        label: "Kit QR onboarding",
        text: "Hardware path. After you create a push device, scan the ingest QR (or print it on a kit label) so firmware can POST temperature, flood, and other sensor kinds without typing the key.",
      },
    ],
  },
  sim: {
    title: "Cause the change: interactive simulator",
    lede: "Presets for cold snap, door draft, and sun load reuse the same Overview space-status helper as production. Open the bay door and watch the door zone diverge from the workbench: that’s why multi-probe placement matters.",
    doorDraft: "Try door draft",
    coldSnap: "Try cold snap",
    openFull: "Open full simulator",
  },
  live: {
    title: "Live demo feed",
    ledeHtml:
      'Real demo probe readings and outdoor weather, not a mockup. Prefer to manipulate variables yourself? <a class="text-link" href="/about/probe-demo">Open the interactive simulator</a>.',
    readingsLabel: "Live demo readings",
    historyNote:
      "Probe curves are the demo shop model run over the past week's real hourly weather; the dashed line is outdoor temperature.",
  },
  screenshotCaption:
    "Same product UI after you connect hardware. Insights with 30-day curves, freeze threshold, and nights-at-risk.",
  freeze: {
    title: "Same data that fires freeze and flood alerts",
    lede: "When a probe crosses your threshold, ProbeHarbor can reach you on email, browser push, Discord, Telegram, Slack, and on Pro, SMS. Wet flood/leak contacts auto-alert on the same stack. Set the line once; test it before the next cold night.",
    channelsLabel: "Alert channels",
    channels: [
      "Email · Discord · Telegram · Slack",
      "Push on every plan",
      "SMS · webhooks on Pro",
      "Leak / flood sensors alert automatically when wet",
    ],
    startFree: "Start free: open Devices",
    story: "Flood/leak story",
    cookbook: "Channel cookbook",
    imageAlt: "ProbeHarbor temperature trend with humidity, dew point, and freeze threshold at 34°F",
  },
  steps: {
    title: "Your kit next",
    ledeHtml:
      'Free account, no credit card, from blank dashboard to a live curve in one sitting. Physical kits can use <a class="text-link" href="/about/kit-qr-onboarding">kit QR onboarding</a> so the ingest URL is a scan away.',
    items: [
      {
        title: "Create a push device",
        copyHtml:
          "Sign up and pick a path on Devices: Home Assistant, ESPHome, or MQTT get a copy-paste snippet; a board gets a pre-filled sketch; no hardware gets a one-click demo feed.",
      },
      {
        title: "POST JSON",
        copyHtml:
          "POST to <code>/api/ingest/&lt;key&gt;</code>. Sensors auto-import on first POST: rename on Devices afterward.",
      },
      {
        title: "Watch Home & set alerts",
        copyHtml:
          "Confirm live values, set a freeze threshold, and know that wet flood/leak contacts auto-alert on the same account.",
      },
    ],
    startFree: "Start free: open Devices",
    guide: "Adding devices guide",
    walkthrough: "Kit QR walkthrough",
  },
  compat: {
    label: "Works with",
    push: "HTTPS JSON push",
    pull: "HTTPS JSON pull",
    mqtt: "MQTT bridge",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Keep MQTT on your LAN; mirror to ProbeHarbor over HTTPS for household freeze/flood alerts and history. <a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a>',
  },
  explore: {
    title: "Keep exploring",
    lede: "Already triggered a simulated cold snap? Confirm with the live feed, then try a flood/leak story, map a city, or set up kit QR.",
    items: [
      { label: "Interactive probe simulator", hint: "Primary hands-on demo: door, sun, outdoor, freeze threshold" },
      { label: "Community freeze map", hint: "Opt-in city aggregates, no account required" },
      { label: "Kit QR onboarding", hint: "Create device → scan ingest QR → first POST" },
      { label: "Freeze scenario", hint: "What a 2 a.m. heater failure looks like, alert by alert" },
    ],
  },
  faqLede: "Demo-specific answers, for plans and product basics see Pricing or the homepage FAQ.",
};

export type DemoMessages = typeof en;
export default en;
