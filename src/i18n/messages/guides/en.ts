import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */

const en = {
  title: "Guides",
  description:
    "ProbeHarbor guides by job: hardware setup, freeze and flood/leak alerts, household sharing, and the HTTP API, plus all articles in one library.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Guides",
  kicker: "Guides",
  headerTitle: "Set up probes, freeze/flood alerts, sharing, and the API",
  lede: "Start with the job you need done. Hardware, freeze and flood/leak alerts, household sharing, and ingest/API docs in one place, then browse all articles if you want every guide.",
  startFree: "Start free",
  allArticles: "All articles",
  esp32Kit: "ESP32 freeze kit",
  photoLabels: {
    "dht22-module": "Hardware setup",
    "arduino-uno-board": "Arduino & firmware",
    "attic-insulation": "Alerts & freeze",
    "ethernet-cable": "Integrations & API",
  } as Record<string, string>,
  alsoRelevant: "Also relevant to:",
  alsoUsefulTitle: "Also useful",
  alsoUsefulSubtitle: "Stories, comparisons, and integrations sit beside the how-to library.",
  alsoUseful: {
    "/stories": {
      label: "Scenarios",
      summary: "Illustrative freeze, leak, and heat walkthroughs, alert by alert.",
    },
    "/compare": {
      label: "Compare alternatives",
      summary: "ProbeHarbor vs DIY MQTT, Govee, Tempest, Nest, Ecobee, and others.",
    },
    "/integrations": {
      label: "Integrations",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT, and webhooks.",
    },
    "/accessories": {
      label: "Accessories",
      summary: "Claim puck, alert beacon, door/leak/power contacts, kit labels, mounts.",
    },
    "/gift": {
      label: "Gift / referral",
      summary: "Share an invite link: they get extra Pro trial days, and so do you when they subscribe.",
    },
  } as Record<string, { label: string; summary: string }>,
  itemListName: "ProbeHarbor guides by job",
  itemListDescription: "Hardware setup, freeze and flood alerts, household sharing, and API guides.",
  faqLede: "Quick answers before you dive into a category.",
  faqs: [
    {
      question: "Where should I start?",
      answer:
        "Pick a job below: hardware setup (ESP32 freeze kit), freeze/flood alerts, household sharing, or the HTTP API. Or open the full About library.",
    },
    {
      question: "Do you sell hardware kits?",
      answer:
        "No. ProbeHarbor is software. Buy parts from Adafruit or Amazon using the ESP32 freeze kit BOM and accessories pages, then flash a pre-filled sketch from Devices.",
    },
    {
      question: "Where are example scenarios and comparisons?",
      answer:
        "Illustrative freeze, leak, and heat scenarios: probeharbor.dev/stories. Versus DIY MQTT, Govee, Tempest, Nest, and Ecobee: probeharbor.dev/compare. Home Assistant: probeharbor.dev/integrations.",
    },
  ] as AboutFaqItem[],
};

export type GuidesMessages = typeof en;
export default en;
