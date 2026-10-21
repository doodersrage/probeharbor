import { defineMessages } from "../translate";

/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */
const en = {
  title: "Companion apps",
  description: (brand: string) =>
    `Watch ${brand} from Android, desktop, Bay Buddy, or the PWA. These clients sign into your account; they do not sense temperature.`,
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: (brand: string) =>
    `${brand} clients for phone and desk. Probes stay on ESP/Arduino (or HTTPS feeds); apps sign in and show live freeze and flood risk for your household.`,
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware vs apps",
  hardwareHtml:
    'Need a claim puck, leak pad, or mount? <a class="text-link" href="/accessories">Hardware accessories</a> cover companion devices. Temperature kits stay on the <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit BOM</a>.',
  faqTitle: "Apps FAQ",
  faqLede: "Which client to install, and how they relate to probes and the web dashboard.",
};

type AppsMessages = typeof en;

const es: AppsMessages = {
  title: "Apps complementarias",
  description: (brand) =>
    `Sigue ${brand} desde Android, el escritorio, Bay Buddy o la PWA. Estos clientes inician sesión en tu cuenta; no miden la temperatura.`,
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: (brand) =>
    `Clientes de ${brand} para el móvil y el escritorio. Las sondas siguen en ESP/Arduino (o en feeds HTTPS); las apps inician sesión y muestran en vivo el riesgo de congelación e inundación de tu hogar.`,
  android: "Android",
  desktop: "Escritorio",
  hardwareTitle: "Hardware frente a apps",
  hardwareHtml:
    '¿Necesitas un Claim puck, una almohadilla de fugas o un soporte? Los <a class="text-link" href="/accessories">accesorios de hardware</a> cubren los dispositivos complementarios. Los kits de temperatura están en la <a class="text-link" href="/about/esp32-freeze-kit">lista de materiales del kit ESP32 contra heladas</a>.',
  faqTitle: "Preguntas frecuentes sobre las apps",
  faqLede: "Qué cliente instalar y cómo se relacionan con las sondas y el panel web.",
};

const fr: AppsMessages = {
  title: "Applications compagnons",
  description: (brand) =>
    `Suivez ${brand} sur Android, sur ordinateur, avec Bay Buddy ou la PWA. Ces clients se connectent à votre compte ; ils ne mesurent pas la température.`,
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Applications",
  lede: (brand) =>
    `Les clients ${brand} pour le téléphone et le bureau. Les sondes restent sur ESP/Arduino (ou des flux HTTPS) ; les applications se connectent et affichent en direct le risque de gel et d’inondation de votre foyer.`,
  android: "Android",
  desktop: "Ordinateur",
  hardwareTitle: "Matériel ou applications",
  hardwareHtml:
    'Besoin d’un Claim puck, d’un tapis de détection de fuite ou d’un support ? Les <a class="text-link" href="/accessories">accessoires matériels</a> couvrent les appareils compagnons. Les kits de température se trouvent dans la <a class="text-link" href="/about/esp32-freeze-kit">nomenclature du kit antigel ESP32</a>.',
  faqTitle: "FAQ des applications",
  faqLede: "Quel client installer, et quel lien avec les sondes et le tableau de bord web.",
};

const de: AppsMessages = {
  title: "Begleit-Apps",
  description: (brand) =>
    `Behalte ${brand} per Android, Desktop, Bay Buddy oder PWA im Blick. Diese Clients melden sich bei deinem Konto an; sie messen keine Temperatur.`,
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: (brand) =>
    `${brand}-Clients für Handy und Schreibtisch. Die Fühler bleiben am ESP/Arduino (oder an HTTPS-Feeds); die Apps melden sich an und zeigen das aktuelle Frost- und Wasserrisiko deines Haushalts.`,
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware oder Apps",
  hardwareHtml:
    'Du brauchst einen Claim Puck, eine Leckmatte oder eine Halterung? Das <a class="text-link" href="/accessories">Hardware-Zubehör</a> deckt Begleitgeräte ab. Temperatur-Kits findest du in der <a class="text-link" href="/about/esp32-freeze-kit">Stückliste des ESP32-Frost-Kits</a>.',
  faqTitle: "Apps-FAQ",
  faqLede: "Welchen Client du installieren solltest und wie er mit Fühlern und dem Web-Dashboard zusammenhängt.",
};

const ptBr: AppsMessages = {
  title: "Apps complementares",
  description: (brand) =>
    `Acompanhe o ${brand} pelo Android, desktop, Bay Buddy ou PWA. Esses clientes entram na sua conta; eles não medem temperatura.`,
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: (brand) =>
    `Clientes do ${brand} para o celular e a mesa. As sondas ficam no ESP/Arduino (ou em feeds HTTPS); os apps entram na conta e mostram ao vivo o risco de congelamento e alagamento da sua casa.`,
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware ou apps",
  hardwareHtml:
    'Precisa de um Claim puck, uma placa de vazamento ou um suporte? Os <a class="text-link" href="/accessories">acessórios de hardware</a> cobrem os dispositivos complementares. Os kits de temperatura ficam na <a class="text-link" href="/about/esp32-freeze-kit">lista de materiais do kit ESP32 contra congelamento</a>.',
  faqTitle: "Perguntas frequentes sobre os apps",
  faqLede: "Qual cliente instalar e como eles se relacionam com as sondas e o painel web.",
};

export const appsMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
