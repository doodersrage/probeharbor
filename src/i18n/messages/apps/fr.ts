/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */
import type { AppsMessages } from "./en";

const fr: AppsMessages = {
  title: "Applications compagnons",
  description: "Suivez {brand} sur Android, sur ordinateur, avec Bay Buddy ou la PWA. Ces clients se connectent à votre compte ; ils ne mesurent pas la température.",
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Applications",
  lede: "Les clients {brand} pour le téléphone et le bureau. Les sondes restent sur ESP/Arduino (ou des flux HTTPS) ; les applications se connectent et affichent en direct le risque de gel et d’inondation de votre foyer.",
  android: "Android",
  desktop: "Ordinateur",
  hardwareTitle: "Matériel ou applications",
  hardwareHtml:
    'Besoin d’un Claim puck, d’un tapis de détection de fuite ou d’un support ? Les <a class="text-link" href="/accessories">accessoires matériels</a> couvrent les appareils compagnons. Les kits de température se trouvent dans la <a class="text-link" href="/about/esp32-freeze-kit">nomenclature du kit antigel ESP32</a>.',
  faqTitle: "FAQ des applications",
  faqLede: "Quel client installer, et quel lien avec les sondes et le tableau de bord web.",
};

export default fr;
