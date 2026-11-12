/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */
import type { AboutMessages } from "./en";

const es: AboutMessages = {
  layoutTitle: "Acerca de",
  title: "Acerca de ProbeHarbor",
  description:
    "Guías sobre sondas de temperatura, alertas de congelación e inundación, firmware Arduino, ingesta ESP, uso compartido en el hogar y el stack de ProbeHarbor.",
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  kicker: "Acerca de",
  lede: "Guías sobre sondas, alertas de congelación e inundación, firmware y el stack de ProbeHarbor. ¿Prefieres una lista más corta? Empieza por el centro de guías.",
  startFree: "Empieza gratis",
  guidesHub: "Centro de guías",
  findTitle: "Busca una guía",
  findSubtitle: `Busca entre {count} artículos o explora por ruta de aprendizaje más abajo.`,
  probe: {
    eyebrow: "Simulación en vivo",
    title: "Tres sondas, un espacio",
    lede: "Mira cómo cambian la temperatura y la humedad zona por zona cuando varían el sol, el aire exterior y la ventilación, igual que en el feed JSON en vivo.",
  },
  repos: {
    title: "Repositorios de código",
    subtitleHtml:
      'Proyectos que puedes revisar, bifurcar o adaptar a tu propio montaje. Las integraciones programáticas empiezan por la <a class="text-link" href="/docs/api">API HTTP</a> y <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch de Arduino y firmware de los sensores",
    website: "Este sitio web (Astro en Cloudflare): incluye sketches de ejemplo para sensores",
    relay: "Relé del feed JSON (FastAPI con caché en Redis)",
  },
  faqLede: "Respuestas rápidas antes de sumergirte en una guía.",
  faqs: [
    {
      question: "¿Qué cubren las guías de Acerca de?",
      answer:
        "Ubicación de sondas, cableado del DHT22 y Arduino, umbrales de congelación, contactos de inundación y fugas, API de ingesta, uso compartido en el hogar, instalación de la PWA y cómo ProbeHarbor guarda y grafica las lecturas.",
    },
    {
      question: "¿Por dónde empiezo?",
      answer:
        "Elige en esta página una ruta según lo que necesitas (protección contra congelación, detección de inundaciones y fugas, cableado, ingesta, depuración o configuración del hogar) o busca en el índice completo de guías.",
    },
    {
      question: "¿ProbeHarbor es de código abierto?",
      answer:
        "El firmware y los sketches de ejemplo son de código abierto (MIT). La aplicación tiene el código fuente disponible bajo la FSL-1.1: puedes leerla, ejecutarla, alojarla tú mismo y modificarla, pero no ofrecerla como servicio de la competencia; cada versión pasa a Apache-2.0 a los dos años. Desde este centro enlazamos los repositorios.",
    },
    {
      question: "¿Dónde se ejecuta ProbeHarbor?",
      answer:
        "El sitio web y las API de ingesta se ejecutan en el edge de Cloudflare (Workers). El estado en vivo de las tareas y de la ingesta está en /system-status: publicamos el estado medido, no un porcentaje de disponibilidad de marketing. Detalles del stack: /about/astro-applications.",
    },
  ],
};

export default es;
