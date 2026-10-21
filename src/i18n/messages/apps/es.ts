/**
 * /apps hub copy. App cards come from `getLocalizedCompanionApps`
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML.
 */
import type { AppsMessages } from "./en";

const es: AppsMessages = {
  title: "Apps complementarias",
  description: "Sigue {brand} desde Android, el escritorio, Bay Buddy o la PWA. Estos clientes inician sesión en tu cuenta; no miden la temperatura.",
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "Apps",
  lede: "Clientes de {brand} para el móvil y el escritorio. Las sondas siguen en ESP/Arduino (o en feeds HTTPS); las apps inician sesión y muestran en vivo el riesgo de congelación e inundación de tu hogar.",
  android: "Android",
  desktop: "Escritorio",
  hardwareTitle: "Hardware frente a apps",
  hardwareHtml:
    '¿Necesitas un Claim puck, una almohadilla de fugas o un soporte? Los <a class="text-link" href="/accessories">accesorios de hardware</a> cubren los dispositivos complementarios. Los kits de temperatura están en la <a class="text-link" href="/about/esp32-freeze-kit">lista de materiales del kit ESP32 contra heladas</a>.',
  faqTitle: "Preguntas frecuentes sobre las apps",
  faqLede: "Qué cliente instalar y cómo se relacionan con las sondas y el panel web.",
};

export default es;
