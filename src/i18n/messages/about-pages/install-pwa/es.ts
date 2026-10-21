
/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "ProbeHarbor incluye un manifiesto de Progressive Web App y un service worker. En los navegadores compatibles puedes instalarlo como una app para tener una ventana independiente, la interfaz en caché sin conexión y alertas Web Push.",
  androidAppHtml:
    'También hay una <strong>app nativa para Android</strong>: <a href="/android">acceso anticipado para Android en GitHub</a>, con la misma cuenta que el panel web y sin sensores en el teléfono. En el escritorio, <a class="text-link" href="/bay-buddy">Bay Buddy</a> es un compañero que te muestra de un vistazo el estado de congelación e inundación (no es un segundo panel). ¿Prefieres un acceso directo en la pantalla de inicio ya? Sigue los pasos para Chrome en Android que verás abajo o <a class="text-link" href="/contact?topic=android">pide que te avisemos del lanzamiento en Play</a>.',
  desktopTitle: "Escritorio (Chrome / Edge)",
  desktopSteps: [
    "Abre el sitio con la sesión iniciada.",
    "Busca el icono de instalación en la barra de direcciones o usa el menú del navegador → <strong>Instalar app</strong>.",
    "Confirma. La app se abre sin la interfaz del navegador y empieza en el panel.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Abre el sitio en Chrome.",
    "Toca el menú → <strong>Instalar app</strong> / <strong>Añadir a pantalla de inicio</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS no admite las mismas API de Web Push e instalación que Chrome de escritorio. Aun así, puedes añadir un acceso directo a la pantalla de inicio:",
  iosSteps: [
    "Abre el sitio en <strong>Safari</strong> (no en Chrome ni en navegadores integrados en otras apps).",
    "Toca el botón Compartir → <strong>Añadir a pantalla de inicio</strong>.",
    "Abre el icono para usarlo a pantalla completa.",
  ],
  iosPushHtml:
    "Las <strong>notificaciones push en iOS</strong> requieren iOS 16.4 o posterior y haber instalado el sitio con Añadir a pantalla de inicio; después hay que activar push en los ajustes de alertas del panel (Pro). Los resultados varían según la versión de iOS; el correo y Discord siguen siendo los canales más fiables en dispositivos Apple.",
  afterTitle: "Después de instalar",
  afterItems: [
    "Activa las notificaciones push del navegador en <strong>Dashboard → Alerts</strong> (Pro).",
    "Visita el sitio de vez en cuando para que el service worker se mantenga actualizado.",
    "Las lecturas en vivo siguen necesitando conexión; la caché sin conexión solo sirve para la interfaz y los últimos datos guardados.",
  ],
};

export default es;
