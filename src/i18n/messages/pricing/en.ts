/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */

const en = {
  meta: {
    title: "Plans & pricing",
    description:
      "Compare ProbeHarbor Free, Member, Pro, and Portfolio: devices, history, freeze and flood alerts, NWS warnings, and annual billing. Start free.",
    breadcrumbHome: "Home",
    breadcrumbPricing: "Pricing",
  },
  header: {
    kicker: "Pricing",
    title: "Plans that grow with your probes",
    lede: "Start free to see if ProbeHarbor fits. Upgrade to Member for a full cold season of history, or Pro when you want serious freeze and flood alerts, thermostat context, and automation. Need more than a handful of properties or on-site manager logins? Portfolio is below.",
    signedInAs: "Signed in as",
    currentPlan: "Current plan:",
    dashboard: "Dashboard",
    createAccount: "Create free account",
    signIn: "Sign in",
  },
  ladder: {
    label: "Plan ladder",
    free: "See if ProbeHarbor works for you: live curves, freeze and leak alerts, one family live share.",
    member:
      "Track a whole cold season, or a wet basement season: 90-day history, CSV, more devices, and forecast freeze warnings.",
    pro: "Serious alerts and automation. NWS, SMS, Nest/Ecobee house context, claims pack, 14-day trial. Up to {properties} properties.",
    portfolio: "Larger multi-property ops: up to {properties} owned properties, cross-property freeze/flood risk view, property-manager logins without billing access.",
  },
  billing: {
    label: "Billing interval",
    monthly: "Monthly",
    annual: "Annual",
    perMonth: "/mo",
    perYear: "/yr",
    contactUs: "Contact us",
    billedMonthly: "Billed monthly",
    billedAnnually: "Billed annually",
    perMonthBilledAnnually: "{monthly}/mo billed annually",
    annualNotConfigured: "Annual pricing not configured",
    customPricing: "Custom pricing",
    percent: "{pct}%",
    approxTwenty: "~20%",
    aboutTwenty: "about 20%",
    saveUpTo: "Save up to {pct}",
    saveApprox: "Save ~20%",
    saveVsMonthly: "Save {pct} vs monthly",
    switchToAnnual: "Switch to annual to save {pct}",
    monthlyHint: "You’re viewing monthly prices. Annual locks in {pct} off ({memberAnnual} / {proAnnual} per year).",
    annualHint: "You’re viewing yearly totals. Toggle Monthly to see {memberMonthly} / {proMonthly} per month.",
    withTrial: "{sub} · 14-day free trial",
  },
  cards: {
    devices: "{n} push devices per property",
    history: "{retention} of history",
    historyPlus: "{retention}+ of history",
    currentPlan: "Current plan",
    includedInPlan: "Included in your plan",
    signInToSubscribe: "Sign in to subscribe",
    free: {
      tagline: "Live monitoring for one property, no credit card",
      freezeLeak: "Threshold freeze and leak alerts",
      channels: "Email, push, and chat-app alerts",
      getStarted: "Get started",
    },
    member: {
      badge: "Most popular",
      tagline: "History export, more headroom, and forecast freeze",
      forecast: "Forecast freeze warnings",
      csv: "CSV history export",
      upgrade: "Upgrade to Member",
    },
    pro: {
      taglineHtml:
        'Official NWS alerts, Nest/Ecobee house context, <a class="text-link" href="/claims-pack">claims pack</a>',
      forecastNws: "Forecast freeze warnings + official NWS alerts",
      thermostatHtml:
        '<a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> thermostat connection (house vs probe)',
      claimsHtml: '<a class="text-link" href="/claims-pack">Claims / insurance evidence pack</a>',
      automationHtml:
        'SMS, webhooks, Pro share scopes &amp; <a class="text-link" href="/docs/api">API keys</a>',
      properties: "Up to {n} owned properties (vacation home, rental, workshop)",
      startTrial: "Start Pro trial",
      onPro: "You're on Pro",
      signInForTrial: "Sign in for Pro trial",
    },
    portfolio: {
      badge: "For portfolios",
      tagline: "For ops past Pro’s {proMax}-property ceiling: managers without billing access",
      everythingInPro: "Everything in Pro, plus: ",
      properties: "Up to {max} owned properties (Pro already covers up to {proMax})",
      crossProperty: "Cross-property freeze-risk dashboard",
      managers: "Property-manager logins (devices & alerts only, no billing or other properties)",
      noteHtml:
        'A few rentals or a vacation place usually stay on Pro. Portfolio is priced for larger landlords and property-management teams: see <a class="text-link" href="/property-management">property management</a>.',
      onPortfolio: "You're on Portfolio",
      upgrade: "Upgrade to Portfolio",
      contact: "Contact us about Portfolio",
    },
    manageBilling: "Manage billing",
  },
  screenshotCaption:
    "Member and Pro keep longer curves. Free still shows live readings plus threshold freeze and leak alerts.",
  integrations: {
    title: "Integrations on Pro",
    bodyHtml:
      'Free already includes one family live share link. Pro unlocks history/metrics scopes, never-expire links, inbound snooze webhooks, outbound alert hooks, and the <a class="text-link" href="/integrations/home-assistant">official Home Assistant HACS integration</a> at full power. Connect <a class="text-link" href="/about/thermostat-oauth">Nest or Ecobee</a> for house ambient and setpoint beside your garage probes, or push any indoor climate sensor as an <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">indoor reference</a>. Keep MQTT on your LAN; use ProbeHarbor for household freeze and leak SMS, history, and off-site alerts.',
    all: "All integrations",
    hacsGuide: "HACS install guide",
    nestEcobee: "Nest / Ecobee",
    httpApi: "HTTP API",
  },
  matrix: {
    title: "Full feature comparison",
    subtitleHtml:
      'Canonical plan matrix for Free / Member / Pro / Portfolio: device counts, retention, freeze and leak alerts, thermostat, and manager logins. Comparing ProbeHarbor against MQTT, Govee, or a weather station? <a class="text-link" href="/compare">See alternatives</a> (competitor guides, not a second copy of this table).',
    noteHtml: 'Portfolio includes everything under Pro, then raises the owned-property ceiling (Pro already allows up to {proMax}; Portfolio up to {portfolioMax}) and adds property-manager logins: see the Portfolio card above and <a class="text-link" href="/property-management">property management</a>.',
  },
  hosted: {
    title: "Hosted on Cloudflare’s edge",
    bodyHtml:
      'Dashboards and ingest APIs run on Cloudflare Workers, no home server for you to keep online. For live job and ingest health (not a borrowed uptime badge), see <a class="text-link" href="/system-status">system status</a>.',
  },
  faqLede: "Plan limits, upgrades, and billing: answered for freeze-season shoppers.",
  deciding: {
    title: "Still deciding?",
    bodyHtml:
      'Read the <a class="text-link" href="/stories/garage-freeze-alert">garage heater failure scenario</a>, build from the <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit</a> or <a class="text-link" href="/accessories">hardware accessories</a> (including the <a class="text-link" href="/claim-puck">claim puck</a>), compare against <a class="text-link" href="/compare">DIY MQTT, Govee, or Tempest</a>, see the <a class="text-link" href="/about/accounts-and-dashboard">accounts guide</a>, or <a class="text-link" href="/contact">contact us</a> if you\'re unsure which tier fits.',
  },
  table: {
    scrollHint: "Swipe sideways to compare Free, Member, Pro, and Portfolio.",
    feature: "Feature",
    save: "Save {pct}%",
    saveApprox: "Save ~20%",
  },
};

export type PricingMessages = typeof en;
export default en;
