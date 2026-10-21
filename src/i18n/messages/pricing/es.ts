/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */
import type { PricingMessages } from "./en";

const es: PricingMessages = {
  meta: {
    title: "Planes y precios",
    description:
      "Compara ProbeHarbor Free, Member, Pro y Portfolio: dispositivos, historial, alertas de congelación e inundación, avisos del NWS y facturación anual.",
    breadcrumbHome: "Inicio",
    breadcrumbPricing: "Precios",
  },
  header: {
    kicker: "Precios",
    title: "Planes que crecen con tus sondas",
    lede: "Empieza gratis para ver si ProbeHarbor te encaja. Pasa a Member para tener el historial de toda una temporada de frío, o a Pro cuando quieras alertas serias de congelación e inundación, contexto del termostato y automatización. ¿Necesitas más que unas pocas propiedades o accesos para administradores in situ? Portfolio está más abajo.",
    signedInAs: "Sesión iniciada como",
    currentPlan: "Plan actual:",
    dashboard: "Panel",
    createAccount: "Crear cuenta gratis",
    signIn: "Iniciar sesión",
  },
  ladder: {
    label: "Escalera de planes",
    free: "Comprueba si ProbeHarbor te sirve: curvas en vivo, alertas de congelación y fugas, un enlace familiar en vivo.",
    member:
      "Sigue toda una temporada de frío, o de humedad en el sótano: 90 días de historial, CSV, más dispositivos y avisos de congelación según el pronóstico.",
    pro: "Alertas serias y automatización. NWS, SMS, contexto de la casa con Nest/Ecobee, paquete para reclamaciones, prueba de 14 días. Hasta {properties} propiedades.",
    portfolio: "Operaciones con muchas propiedades: hasta {properties} propiedades propias, vista del riesgo de congelación e inundación de todas ellas y accesos para administradores sin acceso a la facturación.",
  },
  billing: {
    label: "Periodo de facturación",
    monthly: "Mensual",
    annual: "Anual",
    perMonth: "/mes",
    perYear: "/año",
    contactUs: "Contáctanos",
    billedMonthly: "Facturación mensual",
    billedAnnually: "Facturación anual",
    perMonthBilledAnnually: "{monthly}/mes con facturación anual",
    annualNotConfigured: "Precio anual no configurado",
    customPricing: "Precio a medida",
    percent: "{pct} %",
    approxTwenty: "~20 %",
    aboutTwenty: "alrededor de un 20 %",
    saveUpTo: "Ahorra hasta un {pct}",
    saveApprox: "Ahorra ~20 %",
    saveVsMonthly: "Ahorra {pct} frente al pago mensual",
    switchToAnnual: "Pásate al plan anual y ahorra {pct}",
    monthlyHint: "Estás viendo los precios mensuales. El plan anual te asegura {pct} de descuento ({memberAnnual} / {proAnnual} al año).",
    annualHint: "Estás viendo los totales anuales. Cambia a Mensual para ver {memberMonthly} / {proMonthly} al mes.",
    withTrial: "{sub} · prueba gratis de 14 días",
  },
  cards: {
    devices: "{n} dispositivos push por propiedad",
    history: "{retention} de historial",
    historyPlus: "{retention} o más de historial",
    currentPlan: "Plan actual",
    includedInPlan: "Incluido en tu plan",
    signInToSubscribe: "Inicia sesión para suscribirte",
    free: {
      tagline: "Monitoreo en vivo para una propiedad, sin tarjeta",
      freezeLeak: "Alertas de congelación y fugas por umbral",
      channels: "Alertas por correo, push y apps de chat",
      getStarted: "Empezar",
    },
    member: {
      badge: "El más popular",
      tagline: "Exportación del historial, más margen y congelación según el pronóstico",
      forecast: "Avisos de congelación según el pronóstico",
      csv: "Exportación del historial en CSV",
      upgrade: "Pasar a Member",
    },
    pro: {
      taglineHtml:
        'Alertas oficiales del NWS (EE. UU.), contexto de la casa con Nest/Ecobee, <a class="text-link" href="/claims-pack">paquete para reclamaciones</a>',
      forecastNws: "Avisos de congelación según el pronóstico + alertas oficiales del NWS",
      thermostatHtml:
        'Conexión con termostato <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> (casa frente a sonda)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Paquete de pruebas para reclamaciones / seguros</a>',
      automationHtml:
        'SMS, webhooks, alcances de enlaces compartidos Pro y <a class="text-link" href="/docs/api">claves API</a>',
      properties: "Hasta {n} propiedades propias (casa de vacaciones, alquiler, taller)",
      startTrial: "Empezar la prueba de Pro",
      onPro: "Tienes Pro",
      signInForTrial: "Inicia sesión para probar Pro",
    },
    portfolio: {
      badge: "Para carteras",
      tagline: "Para operaciones que superan el límite de {proMax} propiedades de Pro: administradores sin acceso a la facturación",
      everythingInPro: "Todo lo de Pro, más: ",
      properties: "Hasta {max} propiedades propias (Pro ya cubre hasta {proMax})",
      crossProperty: "Panel de riesgo de congelación entre propiedades",
      managers:
        "Accesos para administradores de propiedades (solo dispositivos y alertas, sin facturación ni otras propiedades)",
      noteHtml:
        'Unos pocos alquileres o una casa de vacaciones suelen quedarse en Pro. Portfolio tiene precios pensados para grandes propietarios y equipos de administración de inmuebles: consulta <a class="text-link" href="/property-management">administración de propiedades</a>.',
      onPortfolio: "Tienes Portfolio",
      upgrade: "Pasar a Portfolio",
      contact: "Consúltanos sobre Portfolio",
    },
    manageBilling: "Gestionar facturación",
  },
  screenshotCaption:
    "Member y Pro conservan curvas más largas. Free sigue mostrando lecturas en vivo y alertas de congelación y fugas por umbral.",
  integrations: {
    title: "Integraciones en Pro",
    bodyHtml:
      'Free ya incluye un enlace familiar en vivo. Pro desbloquea los alcances de historial y métricas, enlaces que no caducan, webhooks entrantes para posponer alertas, hooks de alertas salientes y la <a class="text-link" href="/integrations/home-assistant">integración oficial de Home Assistant en HACS</a> al completo. Conecta <a class="text-link" href="/about/thermostat-oauth">Nest o Ecobee</a> para ver la temperatura ambiente y la consigna de la casa junto a las sondas del garaje, o envía cualquier sensor de clima interior como <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">referencia interior</a>. Mantén MQTT en tu red local y usa ProbeHarbor para los SMS de congelación y fugas del hogar, el historial y las alertas fuera de casa.',
    all: "Todas las integraciones",
    hacsGuide: "Guía de instalación de HACS",
    nestEcobee: "Nest / Ecobee",
    httpApi: "API HTTP",
  },
  matrix: {
    title: "Comparación completa de funciones",
    subtitleHtml:
      'La matriz de referencia de Free / Member / Pro / Portfolio: número de dispositivos, retención, alertas de congelación y fugas, termostato y accesos para administradores. ¿Comparas ProbeHarbor con MQTT, Govee o una estación meteorológica? <a class="text-link" href="/compare">Ver alternativas</a> (guías de la competencia, no otra copia de esta tabla).',
    noteHtml: 'Portfolio incluye todo lo de Pro, amplía el límite de propiedades propias (Pro ya permite hasta {proMax}; Portfolio hasta {portfolioMax}) y añade accesos para administradores de propiedades: consulta la tarjeta de Portfolio más arriba y <a class="text-link" href="/property-management">administración de propiedades</a>.',
  },
  hosted: {
    title: "Alojado en el edge de Cloudflare",
    bodyHtml:
      'Los paneles y las API de ingesta funcionan en Cloudflare Workers, sin un servidor en casa que mantener encendido. Para ver en vivo el estado de las tareas y de la ingesta (no una insignia de disponibilidad prestada), consulta el <a class="text-link" href="/system-status">estado del sistema</a>.',
  },
  faqLede:
    "Límites de los planes, cambios de plan y facturación: respuestas para quien compara antes de la temporada de heladas.",
  deciding: {
    title: "¿Aún lo estás pensando?",
    bodyHtml:
      'Lee el <a class="text-link" href="/stories/garage-freeze-alert">escenario de fallo del calefactor del garaje</a>, monta el <a class="text-link" href="/about/esp32-freeze-kit">kit de congelación con ESP32</a> o los <a class="text-link" href="/accessories">accesorios de hardware</a> (incluido el <a class="text-link" href="/claim-puck">Claim Puck</a>), compara con <a class="text-link" href="/compare">MQTT casero, Govee o Tempest</a>, consulta la <a class="text-link" href="/about/accounts-and-dashboard">guía de cuentas</a> o <a class="text-link" href="/contact">escríbenos</a> si no sabes qué plan te conviene.',
  },
  table: {
    scrollHint: "Desliza hacia los lados para comparar Free, Member, Pro y Portfolio.",
    feature: "Función",
    save: "Ahorra {pct} %",
    saveApprox: "Ahorra ~20 %",
  },
};

export default es;
