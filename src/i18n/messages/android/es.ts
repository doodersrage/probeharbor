/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */
import type { AndroidMessages } from "./en";

const es: AndroidMessages = {
  title: "App para Android",
  descriptionLive: "App de {brand} para Android en Google Play: sondas en vivo, alertas de congelación e inundación, MFA y herramientas del hogar. El móvil no es un sensor.",
  descriptionPwa: "Usa {brand} en Android con la app web instalable; la nativa está en revisión en Play. Sondas en vivo, alertas de helada e inundación. El móvil no es sensor.",
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "App para Android",
  schemaName: "{brand} para Android",
  kickerLive: "Google Play",
  kickerPwa: "Funciona hoy · app nativa en camino",
  heading: "ProbeHarbor para Android",
  ledeLive:
    "App complementaria nativa en Google Play: lecturas en vivo, historial, alertas de congelación/inundación, dispositivos, MFA y herramientas del hogar para tu cuenta de ProbeHarbor.",
  ledePwa:
    "Usa ProbeHarbor en Android hoy mismo con la app web instalable: la misma cuenta, lecturas en vivo y alertas. La ficha nativa de Play está en revisión; compilar o instalar manualmente desde GitHub es opcional para quienes quieran probarla antes.",
  getOnPlay: "Descárgala en Google Play",
  installPwa: "Instala la app web (PWA)",
  githubSideload: "GitHub · compilar o instalar manualmente",
  sourceOnGithub: "Código en GitHub",
  requestLaunchNote: "Avísame del lanzamiento en Play",
  imageAlt: "Foto de ambiente de {brand}: consultando lecturas de sondas en el móvil y el portátil junto a una instalación casera cerca de tuberías de cobre",
  imageCaption:
    "Ambiente de instalación casera: el móvil y el portátil acompañan a tus propias sondas. Las pantallas de esta ilustración son estilizadas, no una captura del producto.",
  phoneTitle: "Qué hace el móvil (y qué no)",
  doesHtml:
    "<strong>Sí hace:</strong> inicia sesión en tu cuenta de ProbeHarbor, muestra curvas en vivo, el historial y la misma cuenta atrás hasta la congelación basada en el pronóstico que verás en Overview, gestiona alertas, dispositivos y ajustes del hogar, y recibe notificaciones push de congelación/inundación mediante Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>No hace:</strong> medir la temperatura con el teléfono. Tu ESP/Arduino (o tus feeds JSON) siguen enviando datos a probeharbor.dev; la app es un cliente que se conecta por HTTPS.",
  bayBuddyNoteHtml:
    '¿Prefieres un vistazo desde el escritorio? <a class="text-link" href="/bay-buddy">Bay Buddy</a> muestra el estado de congelación e inundación de un espacio sin abrir el panel completo.',
  playTitle: "Google Play",
  playCopy:
    "Instálala desde Play Store con la misma cuenta de ProbeHarbor que usas en la web. En Android, las alertas push usan Firebase Cloud Messaging y están incluidas en todos los planes.",
  openInPlay: "Abrir en Google Play",
  pwaTitle: "Usa Android hoy (PWA)",
  pwaCopy:
    "Instala probeharbor.dev desde Chrome: icono en la pantalla de inicio, lecturas en vivo y alertas con tu cuenta actual. La ficha nativa de Play llega pronto; compilar o instalar manualmente desde GitHub sigue siendo opcional para quienes quieran probarla antes.",
  pwaSteps: "Pasos para instalar la PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda.',
    "Instala la PWA (o compila e instala manualmente la app nativa) e inicia sesión con las mismas credenciales.",
    'Activa las alertas push en <a class="text-link" href="/dashboard/alerts">Ajustes de alertas</a> para recibir avisos de congelación por Firebase cuando tengas instalada la app nativa.',
  ],
  pendingTitle: "Mientras se revisa en Play",
  pendingCopy:
    "Ya tienes una experiencia completa en el móvil con la PWA. La app nativa se vinculará a la misma cuenta cuando la ficha esté publicada.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita</a> y conecta un dispositivo que envíe datos o un feed HTTPS.',
    'Define los umbrales de congelación en <a class="text-link" href="/dashboard/alerts">Ajustes de alertas</a> (correo, push y chat en todos los planes; SMS en Pro).',
    'En Chrome para Android, <a class="text-link" href="/about/install-pwa">instala la PWA</a> para tener un acceso directo en la pantalla de inicio y, si quieres, Web Push en el navegador.',
    '¿Prefieres un correo cuando se lance? <a class="text-link" href="/contact?topic=android">Cuéntanos que esperas la versión de Play</a>: leemos todos los mensajes.',
  ],
  deepLinksHtml:
    "Los enlaces profundos coinciden con los de la app web (<code>/dashboard</code>, alertas, hogar), así que el cliente nativo y la PWA te resultarán familiares.",
  ossTitle: "Código abierto",
  ossHtml: 'Repositorio de la app: <a class="text-link" href="{repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacidad: <a class="text-link" href="/privacy">cómo se gestionan los tokens push de Android</a> · API: <a class="text-link" href="/docs/api">referencia HTTP</a>',
  faqLede: "Respuestas directas para los revisores de Play y para quienes esperan la ficha.",
  backToApps: "← Todas las apps complementarias",
};

export default es;
