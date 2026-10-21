/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */

const en = {
  title: "Garage freeze & flood monitoring",
  ogImageAlt:
    "ProbeHarbor live telemetry graph: probe curves with humidity, dew point, freeze alerts, and flood/wet contacts",
  breadcrumbHome: "Home",
  brandDefinition:
    "ProbeHarbor watches temperature and leak sensors in garages, workshops, attics, crawlspaces, and shops, with live charts, history, and freeze, leak, and heat alerts. Open source, with a free plan.",
  hero: {
    promise: "Know before your pipes freeze or your garage floods.",
    openDashboard: "Open dashboard",
    liveReadings: "Live readings",
    startFree: "Start free",
    seeDemo: "See the live demo",
    signedInHtml:
      'Signed in — Overview for ops, Live for glanceable probes, or <a class="text-link" href="/dashboard/devices">Devices</a> to manage ingest.',
    guestHtml:
      'No credit card. No hardware yet? <a class="text-link" href="/pipe-freeze-forecast">Get free freeze alerts for your ZIP</a>.',
    freeForever: "Free forever · no credit card",
    planPrice: "{plan} {price}/mo",
    visualAlt:
      "ProbeHarbor Insights: seven-day probe curves with the freeze line, flood/wet contacts, nights-at-risk forecast, and forecast-backed time-to-freeze clock",
    visualCaption:
      "Real ProbeHarbor dashboard: 30-day probe curves, freeze threshold, and week-over-year comparison, not a mockup.",
  },
  live: {
    title: "Two ways to try it (no account)",
    lede: "Open the garage door and trigger a cold snap in the simulator, or watch the real demo probes below.",
    coldSnap: "Try a cold snap",
    demoFeed: "Live demo feed",
    readingsLabel: "Live demo readings",
  },
  steps: {
    title: "How it works",
    lede: "One recommended path: ESP32 + waterproof probe → ProbeHarbor → phone alert. Other boards and feeds stay supported after you are live.",
    buildTitle: "Build one probe",
    buildCopy:
      "ESP32 + waterproof DS18B20 is the default kit (~$20–30 parts): three wires and one resistor. A DHT22 adds humidity on the same pin.",
    installTitle: "Install from your browser",
    installCopyHtml:
      'Plug the ESP32 into USB, install the firmware from the <a class="text-link" href="/flash">web flasher</a> in Chrome or Edge, and send it your Wi‑Fi and device key over the same cable. No Arduino IDE, no code.',
    alertsTitle: "Get freeze alerts",
    alertsCopy:
      "Set freeze °F + email, send a test, then watch Live and Overview. Add a flood/leak contact when you are ready.",
    partsHtml:
      "<strong>You need:</strong> a free account, an ESP32 board (about $8–15), a waterproof DS18B20 (about $2–5), your Wi‑Fi, and a USB cable with Chrome or Edge. Under about $25, no subscription to try freeze alerts.",
    startFree: "Start free",
    partsList: "ESP32 parts list",
    otherBoards: "Other boards and integrations",
  },
  maker: {
    title: "Love DIY? You don’t have to DIY everything.",
    lede: "Keep your ESP32, Arduino, MQTT, or Home Assistant setup. ProbeHarbor adds hosted history plus household freeze and flood alerts without another server to babysit.",
    tagline: "Your sensor. Your data. Your alerts.",
    mqttBridge: "MQTT bridge",
    vsDiy: "vs DIY MQTT",
  },
  story: {
    kicker: "Scenario",
    title: "34°F. That’s when the alert matters.",
    copyHtml:
      'Picture an attached garage where one corner dips below 34°F every clear night. The alert says something is wrong; the history chart shows where, pointing at a drafty door seal before supply lines ice. That is exactly the kind of timeline a <a class="text-link" href="/claims-pack">claims evidence pack</a> would document if freeze damage ever became an insurance conversation.',
    shotCaption: "The same freeze line households set in Alerts, visible on History curves.",
    read: "Read the scenario",
    more: "More scenarios",
  },
  features: {
    label: "Product highlights",
    protectTitle: "Protect vulnerable spaces",
    protectCopyHtml:
      'Freeze and leak alerts on every plan, plus a time-to-freeze clock for this space so you know when pipes will hit freeze, not only after they do. Member adds outdoor forecast warnings; Pro adds official NWS alerts and SMS. <a class="text-link" href="/about/cold-snap-playbook">Cold-snap playbook</a>',
    leaksTitle: "Catch leaks before they spread",
    leaksCopyHtml:
      'Flood / leak contacts auto-alert when wet, even during snooze or vacation. Add a sump or tank <code>level</code> sensor if you want early-warning rules before water reaches the floor. <a class="text-link" href="/about/ingest-and-webhooks">Flood + level ingest guide</a>',
    stackTitle: "Your sensors, your stack",
    stackCopyHtml:
      'Temperature, humidity, air quality, doors, leaks, power, and motion on hardware you control. <a class="text-link" href="/about/ingest-and-webhooks">Ingest guide</a> · <a class="text-link" href="/docs/api">HTTP API</a>',
    portfolioTitle: "Households to portfolios",
    portfolioCopyHtml:
      'Invite family and share a live link without handing out a password. Pro adds a <a class="text-link" href="/claims-pack">claims evidence pack</a>; Portfolio adds <a class="text-link" href="/property-management">property-manager logins</a> for rentals and multi-unit sites.',
  },
  pricing: {
    title: "Free to start",
    lede: "Pick a rung by job, whether that is freeze nights, wet leak alerts, or portfolio monitoring. Full limits live on pricing.",
    free: "See if ProbeHarbor works for you",
    member: "Track a whole cold season",
    pro: "Serious alerts and automation",
    perMonth: " · {price}/mo",
    startFree: "Start free",
    compare: "Compare plans",
  },
  guides: {
    label: "Guides",
    heading: "Guides:",
    hardware: "Hardware setup",
    freeze: "Freeze alerts",
    flood: "Flood / leak alerts",
    sharing: "Sharing and API",
    hub: "Open the guides hub",
  },
  ossHtml:
    'Open-source dashboard and sample sensor sketches. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">View source on GitHub</a>.',
  faqLede: "Straight answers for homeowners wiring probes, wet contacts, and setting freeze or flood alerts.",
};

export type HomeMessages = typeof en;
export default en;
