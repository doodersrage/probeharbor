import type { AboutPhotoId } from "../../../lib/aboutPhotos";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };

const en = {
  title: "Compare monitoring options",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, DIY MQTT, Tempest, Nest, and Ecobee for freeze and leak alerts in unheated spaces.",
  breadcrumbHome: "Home",
  breadcrumbCompare: "Compare",
  kicker: "Compare",
  headerTitle: "Built for homeowners, not home servers",
  headerLede:
    "ProbeHarbor is for live probe sensors, freeze and flood/leak alerts, and optional SMS, without running your own infrastructure. Plan limits and the Free/Member/Pro/Portfolio matrix live on Pricing; this page compares ProbeHarbor to other approaches.",
  seePlansPricing: "See plans & pricing",
  startFree: "Start free",
  /** Photo strip labels keyed by `compareHubPhotos` id. */
  photoLabels: {
    "network-switch": "vs DIY MQTT",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  } as Partial<Record<AboutPhotoId, string>>,
  guides: {
    title: "Detailed comparisons",
    subtitle: "Side-by-side guides for common alternatives: ops burden, alerts, and when each option fits.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> can add ProbeHarbor sensors via the\n        <a class="text-link" href="/integrations/smartthings">Matter bridge path</a>\n        (no Cloud-to-Cloud app). Consumer pods still sit with Govee below:\n        <a class="text-link" href="/compare/govee">Govee guide</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementary, not a rival: keep HA on the LAN and use ProbeHarbor for household freeze and leak SMS, history, and off-site alerts. Official HACS integration + MQTT dual-run notes on the\n          <a class="text-link" href="/integrations/home-assistant">Home Assistant page</a>\n, and see\n          <a class="text-link" href="/compare/diy-mqtt">vs DIY MQTT</a>\n          if you’re weighing a full self-hosted stack.',
  },
  table: {
    title: "ProbeHarbor vs alternatives",
    caption: "ProbeHarbor compared to DIY scripts and Govee or SmartThings",
    capability: "Capability",
    probeharbor: "ProbeHarbor",
    diy: "DIY script + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Time to freeze (this space)", probeharborHtml: "Forecast-backed clock + remaining-hours alert", diyHtml: "You write the model", consumerHtml: "Threshold only" },
      { capabilityHtml: "Freeze alerts (email/SMS/push)", probeharborHtml: "Built-in, per-household", diyHtml: "You wire Twilio + cron", consumerHtml: "App push; SMS extra or absent" },
      { capabilityHtml: "ESP/Arduino push ingest", probeharborHtml: "One-time device key", diyHtml: "Custom endpoint", consumerHtml: "Govee pods / SmartThings devices" },
      { capabilityHtml: "History &amp; CSV export", probeharborHtml: "On paid plans", diyHtml: "Self-hosted DB", consumerHtml: "Subscription tiers" },
      { capabilityHtml: "Share links &amp; Grafana", probeharborHtml: "1 family live link; Pro adds history/metrics", diyHtml: "Manual setup", consumerHtml: "Rare on consumer apps" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Official integration</a> (share link)', diyHtml: "REST sensors + webhooks", consumerHtml: "Varies by vendor" },
      { capabilityHtml: "Household multi-user", probeharborHtml: "Free", diyHtml: "N/A", consumerHtml: "Family sharing is awkward" },
      { capabilityHtml: "Hosting &amp; uptime ops", probeharborHtml: 'Cloudflare edge; <a class="text-link" href="/system-status">public status</a>', diyHtml: "You own the VPS / cron", consumerHtml: "Vendor cloud (opaque)" },
    ] as Row[],
  },
  screenshotCaption: "What you get without running your own stack: probe curves against your freeze threshold.",
  audience: {
    title: "Who it's for",
    itemsHtml: [
      "<strong>Free</strong>, one property, live charts, email/chat alerts, and one family live share link while you evaluate.",
      "<strong>Member</strong>. CSV history and more devices through a cold season.",
      '<strong>Pro</strong>. SMS, Nest/Ecobee house context, unlimited share scopes, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">claims pack</a>, and webhooks when someone needs to wake up at 2 a.m. Free already includes one family live link. See the <a class="text-link" href="/docs/api">HTTP API</a> for ingest and metrics.',
      '<strong>Portfolio</strong>, for larger multi-property ops past Pro’s property ceiling, with property-manager logins. Details on <a class="text-link" href="/pricing#portfolio">Pricing</a> and <a class="text-link" href="/property-management">property management</a>.',
    ],
    startFree: "Start free, no card required",
    seePrices: "See plan prices",
    readScenario: "Read a freeze scenario",
  },
  limits: {
    title: "Plan limits live on pricing",
    subtitle:
      "Device counts, retention, Nest/Ecobee, property-manager logins, and Free vs Member vs Pro vs Portfolio are compared on the pricing page so this page can stay focused on alternatives, not a second plan matrix.",
    openComparison: "Open the plan comparison",
    createAccount: "Create free account",
  },
};

export type CompareMessages = typeof en;
export default en;
