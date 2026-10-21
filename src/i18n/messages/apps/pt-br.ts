/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */
import type { AppsMessages } from "./en";

const ptBr: AppsMessages = {
  title: "Apps complementares",
  description: "Acompanhe o {brand} pelo Android, desktop, Bay Buddy ou PWA. Esses clientes entram na sua conta; eles não medem temperatura.",
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: "Clientes do {brand} para o celular e a mesa. As sondas ficam no ESP/Arduino (ou em feeds HTTPS); os apps entram na conta e mostram ao vivo o risco de congelamento e alagamento da sua casa.",
  android: "Android",
  desktop: "Desktop",
  hardwareTitle: "Hardware ou apps",
  hardwareHtml:
    'Precisa de um Claim puck, uma placa de vazamento ou um suporte? Os <a class="text-link" href="/accessories">acessórios de hardware</a> cobrem os dispositivos complementares. Os kits de temperatura ficam na <a class="text-link" href="/about/esp32-freeze-kit">lista de materiais do kit ESP32 contra congelamento</a>.',
  faqTitle: "Perguntas frequentes sobre os apps",
  faqLede: "Qual cliente instalar e como eles se relacionam com as sondas e o painel web.",
};

export default ptBr;
