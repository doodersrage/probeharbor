/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */
import type { BayBuddyMessages } from "./en";

const es: BayBuddyMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "App complementaria de escritorio",
  lede: "No es un segundo panel. {name} muestra el ambiente de un espacio de ProbeHarbor: acogedor, con corriente, tiritando, en pánico, sin conexión o héroe. Los dispositivos, las alertas, el historial y las reclamaciones siguen en {brand}.",
  download: "Descargar la última versión",
  freeAccount: "Cuenta gratuita de ProbeHarbor",
  sourceOnGithub: "Código en GitHub",
  showsTitle: "Qué muestra",
  doesHtml:
    "<strong>Sí hace:</strong> muestra el estado del garaje en vivo a partir de tus sondas actuales, el margen hasta la congelación, el tiempo hasta la congelación y las señales de puertas y fugas, después de pulsar Connect con la misma cuenta de ProbeHarbor.",
  doesNotHtml:
    '<strong>No hace:</strong> sustituir Overview, Devices, Alerts, History ni el paquete para reclamaciones. Todo eso sigue en probeharbor.dev (y en la <a class="text-link" href="/android">app complementaria de Android</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Instalación",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows y DMG para macOS se publican en GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda (o el feed de demostración).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Descarga Bay Buddy</a> para tu sistema operativo e instálalo.',
    "Haz clic en <strong>Connect</strong> en Bay Buddy, inicia sesión en probeharbor.dev en el navegador y vuelve a la ventana de escritorio cuando termine el traspaso.",
    'Opcional: <a class="text-link" href="/claim-puck">vincula un Claim puck</a> (RP2040-Zero) desde la ventana conectada para que el estado del espacio se ilumine en tu mesa.',
  ],
  openReleases: "Ver versiones",
  faqTitle: "Preguntas frecuentes sobre Bay Buddy",
  faqLede: "Respuestas sobre la app de escritorio: descarga, conexión y qué sigue en el panel web.",
  backToApps: "← Todas las apps complementarias",
};

export default es;
