/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */
import type { AppsMessages } from "./en";

const de: AppsMessages = {
  title: "Begleit-Apps",
  description: "Behalte {brand} per Android, Desktop, Bay Buddy oder PWA im Blick. Diese Clients melden sich bei deinem Konto an; sie messen keine Temperatur.",
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: "{brand}-Clients für Handy und Schreibtisch. Die Fühler bleiben am ESP/Arduino (oder an HTTPS-Feeds); die Apps melden sich an und zeigen das aktuelle Frost- und Wasserrisiko deines Haushalts.",
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware oder Apps",
  hardwareHtml:
    'Du brauchst einen Claim Puck, eine Leckmatte oder eine Halterung? Das <a class="text-link" href="/accessories">Hardware-Zubehör</a> deckt Begleitgeräte ab. Temperatur-Kits findest du in der <a class="text-link" href="/about/esp32-freeze-kit">Stückliste des ESP32-Frost-Kits</a>.',
  faqTitle: "Apps-FAQ",
  faqLede: "Welchen Client du installieren solltest und wie er mit Fühlern und dem Web-Dashboard zusammenhängt.",
};

export default de;
