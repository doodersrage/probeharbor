import type { AboutFaqItem } from "../../../lib/aboutFaqs";
import { COLD_SNAP_CHECKLIST } from "../../../lib/coldSnapChecklist";

/**
 * /freeze-season page copy. `checklist` is a localized copy of
 * COLD_SNAP_CHECKLIST (src/lib/coldSnapChecklist.ts), same order and length;
 * English reuses the lib array so the two never drift.
 */

const en = {
  title: "Freeze season probe watch",
  description:
    "Set freeze alerts before the cold snap. Live community freeze map, ESP probe ingest, and email (SMS on Pro) when indoor temps drop toward 32°F.",
  breadcrumbHome: "Home",
  breadcrumb: "Freeze season",
  kicker: "Seasonal",
  seasonHere: "Freeze season is here",
  seasonAhead: "Get ready before freeze season",
  lede: "Pipe freezes happen in spaces you do not walk through every hour. Put a probe where the water is, set a threshold a few degrees above 32°F, and get a clock for when this space hits freeze, plus an alert while you still have hours to act.",
  openAlerts: "Open alert essentials",
  startFree: "Start free: connect a probe",
  communityMap: "Community freeze map",
  checklistTitle: "Tonight’s checklist",
  checklist: COLD_SNAP_CHECKLIST as string[],
  checklistOptionalHtml:
    'Optional: opt your city into the <a class="text-link" href="/freeze-map">public freeze map</a>.',
  sampleColdest: "Sample coldest cities",
  liveColdest: "Coldest opt-in cities",
  sampleNote: "Illustrative preview until enough households opt into the freeze map.",
  liveNote: "From the latest ProbeHarbor freeze-map snapshot.",
  /** "min 12.3°F" after a city name; `{temp}` from `freezeMapTemp`. */
  minTemp: "min {temp}",
  viewMap: "View full map",
  indoorTitle: "Why indoor probes beat outdoor weather alone",
  indoorBody:
    "A Tempest or airport reading says how cold the yard is. Your pipes care about the unheated bay, the leaky door, and the failed space heater. ProbeHarbor watches that space, and can sit next to outdoor weather on your dashboard for context.",
  vsWeather: "vs outdoor weather stations",
  partsList: "ESP32 + DS18B20 parts list",
  stories: "Read freeze stories",
  demo: "Try the live demo",
  faqLede: "Seasonal freeze prep for homeowners with probes in cold spaces.",
  howToName: "Prepare ProbeHarbor for a freeze night",
  howToStep: "Checklist step {step}",
  howToMapName: "Opt into the freeze map (optional)",
  howToMapText:
    "Share anonymized city-level probe samples on the public freeze map so neighbors see regional risk.",
  faqs: [
    {
      question: "When is freeze season for ProbeHarbor?",
      answer:
        "Treat November through March as primary freeze season in most of the contiguous US. Coastal and mountain climates vary; use your coldest nights and NWS freeze warnings as the real signal.",
    },
    {
      question: "Why not rely on outdoor weather alone?",
      answer:
        "Outdoor stations measure the yard. Pipes freeze in unheated bays, crawlspaces, and shops that lag outdoor air. Put a probe where the water is, then use outdoor weather for context.",
    },
    {
      question: "What should I do tonight before a cold snap?",
      answer:
        "Drip exterior-wall faucets if lines run cold, close propped doors, insulate spigots, confirm freeze alerts with a test, and verify a probe sits in the coldest corner near pipes. Checklist on this page.",
    },
    {
      question: "Where is the ESP32 parts list?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit — ESP32 + waterproof DS18B20 BOM, wiring, and flash steps.",
    },
  ] as AboutFaqItem[],
};

export type FreezeSeasonMessages = typeof en;
export default en;
