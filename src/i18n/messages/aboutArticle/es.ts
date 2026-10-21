type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */
import type { AboutArticleMessages } from "./en";

const es: AboutArticleMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  breadcrumbLabel: "Ruta de navegación",
  ogSectionFallback: "Guías",
  faqHeading: "Preguntas frecuentes",
  paginationLabel: "Páginas de la sección Acerca de",
  aboutOverview: "Resumen de Acerca de",
  backToOverview: "Volver al resumen",
  convertBar: {
    label: "Prueba ProbeHarbor",
    copyHtml: "<strong>Demo en vivo</strong>, sin cuenta. ¿Listo para conectar tus sondas? Gratis para siempre, sin tarjeta.",
    demo: "Probar la demo en vivo",
    startFree: "Empieza gratis",
  },
  sidebar: {
    label: "Guías de este tema",
    inThisTopic: "En este tema",
    relatedLabel: "Guías relacionadas",
    backToOverview: "← Volver al resumen",
    guidesHub: "Centro de guías",
    allArticles: "Todos los artículos",
  },
  related: {
    title: "Guías relacionadas",
    moreUnder: "Más en",
  },
  journeyStrip: {
    label: "Ruta de aprendizaje",
    path: "Ruta:",
    step: `Paso {n} de {total}`,
    next: `Siguiente: {label} →`,
  },
  journeys: {
    title: "Elige una ruta",
    subtitle:
      "Recorridos por las guías según lo que quieres lograr: empieza por el resultado que te importa y luego profundiza en los temas.",
    startFree: "Empieza gratis",
  },
  quickStart: {
    title: "Empieza aquí",
    lead: "Puntos de partida populares: planes de acción, demo, ingesta, canales y uso compartido en el hogar.",
  },
  hubNav: {
    label: "Temas de la sección Acerca de",
    title: "Explora por tema",
    lead: `{core} resúmenes de temas y {guides} guías en profundidad repartidos en cinco rutas de aprendizaje. Busca arriba o salta a una sección más abajo.`,
    topics: { one: "tema", other: "temas" },
    guides: "guías",
    readOverview: "Leer el resumen",
    deepDive: "Guías en profundidad",
  },
  productCta: {
    liveDemo: "Demo en vivo",
    seePlans: "Ver planes",
    fallback: {
      title: "Configúralo en ProbeHarbor",
      body: "Gratis para siempre, sin tarjeta de crédito: sigue tus sondas, alertas de congelación y fugas, e historial sin mantener tu propio servidor.",
      label: "Crear cuenta gratis",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Pon el plan en práctica",
        body: "Configura el umbral de congelación en °F y el correo en Alerts → When to alert, o completa la tarjeta en Devices tras la primera ingesta.",
        label: "Abrir ajustes de alertas",
      },
      "alert-channel-cookbook": {
        title: "Conecta tus canales",
        body: "Empieza por el correo en Alerts → How you're told y añade apps de chat o SMS de Pro cuando necesites avisos más contundentes de noche.",
        label: "Abrir ajustes de alertas",
      },
      "household-sharing-walkthrough": {
        title: "Invita a tu hogar",
        body: "Comparte las sondas en vivo con invitaciones o envía un enlace familiar en vivo gratuito a cualquiera, sin cuenta.",
        label: "Abrir enlaces para compartir",
      },
      "freeze-protection-thresholds": {
        title: "Define tu umbral de congelación",
        body: "Empieza a monitorizar con un umbral adaptado a tu zona más fría.",
        label: "Definir umbral",
      },
      "ingest-and-webhooks": {
        title: "Añade una clave de dispositivo",
        body: "Crea credenciales de ingesta push en la página Devices y envía una lectura de prueba.",
        label: "Abrir dispositivos",
      },
      "adding-devices": {
        title: "Crea tu clave de dispositivo gratis",
        body: "Gratis para siempre, sin tarjeta de crédito: entra en Devices, crea una clave push y haz POST de una lectura de prueba.",
        label: "Empieza gratis",
      },
      "dht22-sensor-overview": {
        title: "Míralo en un panel en vivo",
        body: "Crea una cuenta gratis (sin tarjeta), asigna las claves de tus sondas y vigila el riesgo de congelación y fugas durante la noche.",
        label: "Empieza gratis",
      },
    },
  },
  search: {
    label: "Buscar guías",
    placeholder: "Cableado de sondas, exportar CSV, API de ingesta, alertas…",
    featured: "Puntos de partida populares",
    noMatchBefore: "Ninguna guía coincide con «",
    noMatchAfter: "».",
  },
  probeActivity: {
    northWall: "Pared norte",
    doorZone: "Zona de la puerta",
    workbench: "Banco de trabajo",
    sunLoad: "Sol {n} %",
    bayInterior: "Interior del garaje",
    outside: "{t} fuera",
    humidity: "{n} % HR",
    feed: "Feed JSON → panel del sitio web",
    staticPreview: "Vista estática",
    simulated: "Actividad simulada de sondas",
    ariaLabel:
      "Corte animado de un garaje con tres sondas de temperatura que envían lecturas en vivo, una puerta que se abre y se cierra, el sol que cambia y pulsos de datos que viajan al panel del sitio web.",
    caption:
      "Las sondas de la pared norte, la zona de la puerta y el banco de trabajo se actualizan cada pocos segundos, al mismo ritmo que el feed del panel en vivo.",
    celsius: true,
  },
};

export default es;
