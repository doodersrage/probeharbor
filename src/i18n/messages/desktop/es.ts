/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */
import type { DesktopMessages } from "./en";

const es: DesktopMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbApps: "Apps",
  kicker: "App complementaria de escritorio",
  lede: "Panel nativo para tu cuenta de {brand} en Windows, macOS y Linux. Sondas en vivo, historial, alertas, dispositivos, hogar y herramientas para compartir: el ordenador no es un sensor.",
  download: "Descargar la última versión",
  freeAccount: "Cuenta gratuita de ProbeHarbor",
  sourceOnGithub: "Código en GitHub",
  doesTitle: "Qué hace (y qué no)",
  doesHtml:
    "<strong>Sí hace:</strong> inicia sesión con tu cuenta de ProbeHarbor y muestra lecturas en vivo y el tiempo hasta la congelación, gráficos del historial, ajustes de alertas, dispositivos, hogar, enlaces para compartir y cartera de propiedades. Con Pro puede mostrar notificaciones del sistema para nuevas alertas mientras la app está abierta; el modo quiosco muestra las lecturas en vivo a pantalla completa en pantallas de taller.",
  doesNotHtml:
    '<strong>No hace:</strong> medir la temperatura desde el PC. Las sondas siguen enviando datos a probeharbor.dev. Para ver de un vistazo el estado de congelación/inundación de un solo espacio (y usar el Claim puck), usa <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Instalación",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows y DMG para macOS se publican en GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita de ProbeHarbor</a> y conecta al menos una sonda (o el feed de demostración).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Descarga ProbeHarbor Desktop</a> para tu sistema operativo e instálalo.',
    "Haz clic en <strong>Connect</strong>, inicia sesión en probeharbor.dev en el navegador y vuelve a la ventana de escritorio cuando termine el traspaso.",
  ],
  openReleases: "Ver versiones",
  faqTitle: "Preguntas frecuentes sobre Desktop",
  faqLede: "Respuestas sobre la app de escritorio: descarga, conexión y en qué se diferencia de Bay Buddy.",
  backToApps: "← Todas las apps complementarias",
};

export default es;
