/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */

const en = {
  title: "Companion apps",
  description: "Watch {brand} from Android, desktop, Bay Buddy, or the PWA. These clients sign into your account; they do not sense temperature.",
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: "{brand} clients for phone and desk. Probes stay on ESP/Arduino (or HTTPS feeds); apps sign in and show live freeze and flood risk for your household.",
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware vs apps",
  hardwareHtml:
    'Need a claim puck, leak pad, or mount? <a class="text-link" href="/accessories">Hardware accessories</a> cover companion devices. Temperature kits stay on the <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit BOM</a>.',
  faqTitle: "Apps FAQ",
  faqLede: "Which client to install, and how they relate to probes and the web dashboard.",
};

export type AppsMessages = typeof en;
export default en;
