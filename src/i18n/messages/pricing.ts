import { formatPercent, formatRetention } from "../content/planComparison/format";
import { defineMessages } from "../translate";

/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */
const en = {
  meta: {
    title: "Plans & pricing",
    description:
      "Compare ProbeHarbor Free, Member, Pro, and Portfolio: devices, history, freeze and flood alerts, NWS warnings, and annual billing. Start free.",
    breadcrumbHome: "Home",
    breadcrumbPricing: "Pricing",
  },
  header: {
    kicker: "Pricing",
    title: "Plans that grow with your probes",
    lede: "Start free to see if ProbeHarbor fits. Upgrade to Member for a full cold season of history, or Pro when you want serious freeze and flood alerts, thermostat context, and automation. Need more than a handful of properties or on-site manager logins? Portfolio is below.",
    signedInAs: "Signed in as",
    currentPlan: "Current plan:",
    dashboard: "Dashboard",
    createAccount: "Create free account",
    signIn: "Sign in",
  },
  ladder: {
    label: "Plan ladder",
    free: "See if ProbeHarbor works for you: live curves, freeze and leak alerts, one family live share.",
    member:
      "Track a whole cold season, or a wet basement season: 90-day history, CSV, more devices, and forecast freeze warnings.",
    pro: (properties: number) =>
      `Serious alerts and automation. NWS, SMS, Nest/Ecobee house context, claims pack, 14-day trial. Up to ${properties} properties.`,
    portfolio: (properties: number) =>
      `Larger multi-property ops: up to ${properties} owned properties, cross-property freeze/flood risk view, property-manager logins without billing access.`,
  },
  billing: {
    label: "Billing interval",
    monthly: "Monthly",
    annual: "Annual",
    perMonth: "/mo",
    perYear: "/yr",
    contactUs: "Contact us",
    billedMonthly: "Billed monthly",
    billedAnnually: "Billed annually",
    perMonthBilledAnnually: (monthly: string) => `${monthly}/mo billed annually`,
    annualNotConfigured: "Annual pricing not configured",
    customPricing: "Custom pricing",
    percent: (pct: number) => `${pct}%`,
    approxTwenty: "~20%",
    aboutTwenty: "about 20%",
    saveUpTo: (pct: string) => `Save up to ${pct}`,
    saveApprox: "Save ~20%",
    saveVsMonthly: (pct: string) => `Save ${pct} vs monthly`,
    switchToAnnual: (pct: string) => `Switch to annual to save ${pct}`,
    monthlyHint: (pct: string, memberAnnual: string, proAnnual: string) =>
      `You’re viewing monthly prices. Annual locks in ${pct} off (${memberAnnual} / ${proAnnual} per year).`,
    annualHint: (memberMonthly: string, proMonthly: string) =>
      `You’re viewing yearly totals. Toggle Monthly to see ${memberMonthly} / ${proMonthly} per month.`,
    withTrial: (sub: string) => `${sub} · 14-day free trial`,
  },
  cards: {
    devices: (n: number) => `${n} push devices per property`,
    history: (days: number) => `${formatRetention(days, "en")} of history`,
    historyPlus: (days: number) => `${formatRetention(days, "en")}+ of history`,
    currentPlan: "Current plan",
    includedInPlan: "Included in your plan",
    signInToSubscribe: "Sign in to subscribe",
    free: {
      tagline: "Live monitoring for one property, no credit card",
      freezeLeak: "Threshold freeze and leak alerts",
      channels: "Email, push, and chat-app alerts",
      getStarted: "Get started",
    },
    member: {
      badge: "Most popular",
      tagline: "History export, more headroom, and forecast freeze",
      forecast: "Forecast freeze warnings",
      csv: "CSV history export",
      upgrade: "Upgrade to Member",
    },
    pro: {
      taglineHtml:
        'Official NWS alerts, Nest/Ecobee house context, <a class="text-link" href="/claims-pack">claims pack</a>',
      forecastNws: "Forecast freeze warnings + official NWS alerts",
      thermostatHtml:
        '<a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> thermostat connection (house vs probe)',
      claimsHtml: '<a class="text-link" href="/claims-pack">Claims / insurance evidence pack</a>',
      automationHtml:
        'SMS, webhooks, Pro share scopes &amp; <a class="text-link" href="/docs/api">API keys</a>',
      properties: (n: number) => `Up to ${n} owned properties (vacation home, rental, workshop)`,
      startTrial: "Start Pro trial",
      onPro: "You're on Pro",
      signInForTrial: "Sign in for Pro trial",
    },
    portfolio: {
      badge: "For portfolios",
      tagline: (proMax: number) =>
        `For ops past Pro’s ${proMax}-property ceiling: managers without billing access`,
      everythingInPro: "Everything in Pro, plus: ",
      properties: (max: number, proMax: number) =>
        `Up to ${max} owned properties (Pro already covers up to ${proMax})`,
      crossProperty: "Cross-property freeze-risk dashboard",
      managers: "Property-manager logins (devices & alerts only, no billing or other properties)",
      noteHtml:
        'A few rentals or a vacation place usually stay on Pro. Portfolio is priced for larger landlords and property-management teams: see <a class="text-link" href="/property-management">property management</a>.',
      onPortfolio: "You're on Portfolio",
      upgrade: "Upgrade to Portfolio",
      contact: "Contact us about Portfolio",
    },
    manageBilling: "Manage billing",
  },
  screenshotCaption:
    "Member and Pro keep longer curves. Free still shows live readings plus threshold freeze and leak alerts.",
  integrations: {
    title: "Integrations on Pro",
    bodyHtml:
      'Free already includes one family live share link. Pro unlocks history/metrics scopes, never-expire links, inbound snooze webhooks, outbound alert hooks, and the <a class="text-link" href="/integrations/home-assistant">official Home Assistant HACS integration</a> at full power. Connect <a class="text-link" href="/about/thermostat-oauth">Nest or Ecobee</a> for house ambient and setpoint beside your garage probes, or push any indoor climate sensor as an <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">indoor reference</a>. Keep MQTT on your LAN; use ProbeHarbor for household freeze and leak SMS, history, and off-site alerts.',
    all: "All integrations",
    hacsGuide: "HACS install guide",
    nestEcobee: "Nest / Ecobee",
    httpApi: "HTTP API",
  },
  matrix: {
    title: "Full feature comparison",
    subtitleHtml:
      'Canonical plan matrix for Free / Member / Pro / Portfolio: device counts, retention, freeze and leak alerts, thermostat, and manager logins. Comparing ProbeHarbor against MQTT, Govee, or a weather station? <a class="text-link" href="/compare">See alternatives</a> (competitor guides, not a second copy of this table).',
    noteHtml: (proMax: number, portfolioMax: number) =>
      `Portfolio includes everything under Pro, then raises the owned-property ceiling (Pro already allows up to ${proMax}; Portfolio up to ${portfolioMax}) and adds property-manager logins: see the Portfolio card above and <a class="text-link" href="/property-management">property management</a>.`,
  },
  hosted: {
    title: "Hosted on Cloudflare’s edge",
    bodyHtml:
      'Dashboards and ingest APIs run on Cloudflare Workers, no home server for you to keep online. For live job and ingest health (not a borrowed uptime badge), see <a class="text-link" href="/system-status">system status</a>.',
  },
  faqLede: "Plan limits, upgrades, and billing: answered for freeze-season shoppers.",
  deciding: {
    title: "Still deciding?",
    bodyHtml:
      'Read the <a class="text-link" href="/stories/garage-freeze-alert">garage heater failure scenario</a>, build from the <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit</a> or <a class="text-link" href="/accessories">hardware accessories</a> (including the <a class="text-link" href="/claim-puck">claim puck</a>), compare against <a class="text-link" href="/compare">DIY MQTT, Govee, or Tempest</a>, see the <a class="text-link" href="/about/accounts-and-dashboard">accounts guide</a>, or <a class="text-link" href="/contact">contact us</a> if you\'re unsure which tier fits.',
  },
  table: {
    scrollHint: "Swipe sideways to compare Free, Member, Pro, and Portfolio.",
    feature: "Feature",
    save: (pct: number) => `Save ${pct}%`,
    saveApprox: "Save ~20%",
  },
};

type PricingMessages = typeof en;

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
    pro: (properties) =>
      `Alertas serias y automatización. NWS, SMS, contexto de la casa con Nest/Ecobee, paquete para reclamaciones, prueba de 14 días. Hasta ${properties} propiedades.`,
    portfolio: (properties) =>
      `Operaciones con muchas propiedades: hasta ${properties} propiedades propias, vista del riesgo de congelación e inundación de todas ellas y accesos para administradores sin acceso a la facturación.`,
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
    perMonthBilledAnnually: (monthly) => `${monthly}/mes con facturación anual`,
    annualNotConfigured: "Precio anual no configurado",
    customPricing: "Precio a medida",
    percent: (pct) => formatPercent(pct, "es"),
    approxTwenty: "~20 %",
    aboutTwenty: "alrededor de un 20 %",
    saveUpTo: (pct) => `Ahorra hasta un ${pct}`,
    saveApprox: "Ahorra ~20 %",
    saveVsMonthly: (pct) => `Ahorra ${pct} frente al pago mensual`,
    switchToAnnual: (pct) => `Pásate al plan anual y ahorra ${pct}`,
    monthlyHint: (pct, memberAnnual, proAnnual) =>
      `Estás viendo los precios mensuales. El plan anual te asegura ${pct} de descuento (${memberAnnual} / ${proAnnual} al año).`,
    annualHint: (memberMonthly, proMonthly) =>
      `Estás viendo los totales anuales. Cambia a Mensual para ver ${memberMonthly} / ${proMonthly} al mes.`,
    withTrial: (sub) => `${sub} · prueba gratis de 14 días`,
  },
  cards: {
    devices: (n) => `${n} dispositivos push por propiedad`,
    history: (days) => `${formatRetention(days, "es")} de historial`,
    historyPlus: (days) => `${formatRetention(days, "es")} o más de historial`,
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
      properties: (n) => `Hasta ${n} propiedades propias (casa de vacaciones, alquiler, taller)`,
      startTrial: "Empezar la prueba de Pro",
      onPro: "Tienes Pro",
      signInForTrial: "Inicia sesión para probar Pro",
    },
    portfolio: {
      badge: "Para carteras",
      tagline: (proMax) =>
        `Para operaciones que superan el límite de ${proMax} propiedades de Pro: administradores sin acceso a la facturación`,
      everythingInPro: "Todo lo de Pro, más: ",
      properties: (max, proMax) =>
        `Hasta ${max} propiedades propias (Pro ya cubre hasta ${proMax})`,
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
    noteHtml: (proMax, portfolioMax) =>
      `Portfolio incluye todo lo de Pro, amplía el límite de propiedades propias (Pro ya permite hasta ${proMax}; Portfolio hasta ${portfolioMax}) y añade accesos para administradores de propiedades: consulta la tarjeta de Portfolio más arriba y <a class="text-link" href="/property-management">administración de propiedades</a>.`,
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
    save: (pct) => `Ahorra ${formatPercent(pct, "es")}`,
    saveApprox: "Ahorra ~20 %",
  },
};

const fr: PricingMessages = {
  meta: {
    title: "Offres et tarifs",
    description:
      "Comparez ProbeHarbor Free, Member, Pro et Portfolio : appareils, historique, alertes gel et inondation, alertes NWS et facturation annuelle.",
    breadcrumbHome: "Accueil",
    breadcrumbPricing: "Tarifs",
  },
  header: {
    kicker: "Tarifs",
    title: "Des offres qui grandissent avec vos sondes",
    lede: "Commencez gratuitement pour voir si ProbeHarbor vous convient. Passez à Member pour garder l’historique de toute une saison froide, ou à Pro pour des alertes gel et inondation sérieuses, le contexte du thermostat et l’automatisation. Besoin de plus que quelques propriétés ou d’accès pour des gestionnaires sur place ? Portfolio est présenté plus bas.",
    signedInAs: "Connecté en tant que",
    currentPlan: "Offre actuelle :",
    dashboard: "Tableau de bord",
    createAccount: "Créer un compte gratuit",
    signIn: "Se connecter",
  },
  ladder: {
    label: "Gamme des offres",
    free: "Vérifiez si ProbeHarbor vous convient : courbes en direct, alertes gel et fuite, un lien familial en direct.",
    member:
      "Suivez toute une saison froide, ou une saison humide au sous-sol : 90 jours d’historique, CSV, plus d’appareils et avertissements de gel selon les prévisions.",
    pro: (properties) =>
      `Alertes sérieuses et automatisation. NWS, SMS, contexte de la maison via Nest/Ecobee, dossier de sinistre, essai de 14 jours. Jusqu’à ${properties} propriétés.`,
    portfolio: (properties) =>
      `Parcs immobiliers plus importants : jusqu’à ${properties} propriétés détenues, vue du risque de gel et d’inondation sur l’ensemble du parc, accès gestionnaires sans accès à la facturation.`,
  },
  billing: {
    label: "Période de facturation",
    monthly: "Mensuel",
    annual: "Annuel",
    perMonth: "/mois",
    perYear: "/an",
    contactUs: "Nous contacter",
    billedMonthly: "Facturé mensuellement",
    billedAnnually: "Facturé annuellement",
    perMonthBilledAnnually: (monthly) => `${monthly}/mois, facturé annuellement`,
    annualNotConfigured: "Tarif annuel non configuré",
    customPricing: "Tarif sur mesure",
    percent: (pct) => formatPercent(pct, "fr"),
    approxTwenty: "~20 %",
    aboutTwenty: "environ 20 %",
    saveUpTo: (pct) => `Jusqu’à ${pct} d’économie`,
    saveApprox: "Économisez ~20 %",
    saveVsMonthly: (pct) => `${pct} d’économie par rapport au mensuel`,
    switchToAnnual: (pct) => `Passez à l’annuel pour économiser ${pct}`,
    monthlyHint: (pct, memberAnnual, proAnnual) =>
      `Vous voyez les prix mensuels. L’annuel vous garantit ${pct} de réduction (${memberAnnual} / ${proAnnual} par an).`,
    annualHint: (memberMonthly, proMonthly) =>
      `Vous voyez les totaux annuels. Passez sur Mensuel pour voir ${memberMonthly} / ${proMonthly} par mois.`,
    withTrial: (sub) => `${sub} · essai gratuit de 14 jours`,
  },
  cards: {
    devices: (n) => `${n} appareils push par propriété`,
    history: (days) => `${formatRetention(days, "fr")} d’historique`,
    historyPlus: (days) => `${formatRetention(days, "fr")} d’historique et plus`,
    currentPlan: "Offre actuelle",
    includedInPlan: "Inclus dans votre offre",
    signInToSubscribe: "Connectez-vous pour vous abonner",
    free: {
      tagline: "Surveillance en direct d’une propriété, sans carte bancaire",
      freezeLeak: "Alertes gel et fuite sur seuil",
      channels: "Alertes par e-mail, push et messageries",
      getStarted: "Commencer",
    },
    member: {
      badge: "Le plus populaire",
      tagline: "Export de l’historique, plus de marge et gel selon les prévisions",
      forecast: "Avertissements de gel selon les prévisions",
      csv: "Export de l’historique en CSV",
      upgrade: "Passer à Member",
    },
    pro: {
      taglineHtml:
        'Alertes officielles du NWS (États-Unis), contexte de la maison via Nest/Ecobee, <a class="text-link" href="/claims-pack">dossier de sinistre</a>',
      forecastNws: "Avertissements de gel selon les prévisions + alertes officielles du NWS",
      thermostatHtml:
        'Connexion au thermostat <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> (maison vs sonde)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Dossier de preuves sinistre / assurance</a>',
      automationHtml:
        'SMS, webhooks, portées de partage Pro et <a class="text-link" href="/docs/api">clés API</a>',
      properties: (n) =>
        `Jusqu’à ${n} propriétés détenues (résidence secondaire, location, atelier)`,
      startTrial: "Démarrer l’essai Pro",
      onPro: "Vous êtes sur Pro",
      signInForTrial: "Connectez-vous pour l’essai Pro",
    },
    portfolio: {
      badge: "Pour les parcs immobiliers",
      tagline: (proMax) =>
        `Au-delà du plafond de ${proMax} propriétés de Pro : des gestionnaires sans accès à la facturation`,
      everythingInPro: "Tout Pro, plus : ",
      properties: (max, proMax) =>
        `Jusqu’à ${max} propriétés détenues (Pro couvre déjà jusqu’à ${proMax})`,
      crossProperty: "Tableau de bord du risque de gel multi-propriétés",
      managers:
        "Accès gestionnaires immobiliers (appareils et alertes uniquement, ni facturation ni autres propriétés)",
      noteHtml:
        'Quelques locations ou une résidence secondaire restent généralement sur Pro. Portfolio est tarifé pour les grands bailleurs et les équipes de gestion immobilière : voir <a class="text-link" href="/property-management">gestion immobilière</a>.',
      onPortfolio: "Vous êtes sur Portfolio",
      upgrade: "Passer à Portfolio",
      contact: "Nous contacter pour Portfolio",
    },
    manageBilling: "Gérer la facturation",
  },
  screenshotCaption:
    "Member et Pro conservent des courbes plus longues. Free affiche toujours les relevés en direct et les alertes gel et fuite sur seuil.",
  integrations: {
    title: "Intégrations avec Pro",
    bodyHtml:
      'Free inclut déjà un lien familial en direct. Pro débloque les portées historique et métriques, les liens sans expiration, les webhooks entrants de mise en pause, les hooks d’alerte sortants et toute la puissance de l’<a class="text-link" href="/integrations/home-assistant">intégration officielle Home Assistant via HACS</a>. Connectez <a class="text-link" href="/about/thermostat-oauth">Nest ou Ecobee</a> pour afficher la température ambiante et la consigne de la maison à côté des sondes du garage, ou envoyez n’importe quel capteur de climat intérieur comme <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">référence intérieure</a>. Gardez MQTT sur votre réseau local ; utilisez ProbeHarbor pour les SMS gel et fuite du foyer, l’historique et les alertes hors site.',
    all: "Toutes les intégrations",
    hacsGuide: "Guide d’installation HACS",
    nestEcobee: "Nest / Ecobee",
    httpApi: "API HTTP",
  },
  matrix: {
    title: "Comparatif complet des fonctionnalités",
    subtitleHtml:
      'La matrice de référence Free / Member / Pro / Portfolio : nombre d’appareils, conservation, alertes gel et fuite, thermostat et accès gestionnaires. Vous comparez ProbeHarbor à MQTT, Govee ou une station météo ? <a class="text-link" href="/compare">Voir les alternatives</a> (guides comparatifs, pas une seconde copie de ce tableau).',
    noteHtml: (proMax, portfolioMax) =>
      `Portfolio inclut tout ce que propose Pro, relève ensuite le plafond de propriétés détenues (Pro en autorise déjà jusqu’à ${proMax} ; Portfolio jusqu’à ${portfolioMax}) et ajoute les accès gestionnaires immobiliers : voir la carte Portfolio ci-dessus et <a class="text-link" href="/property-management">gestion immobilière</a>.`,
  },
  hosted: {
    title: "Hébergé sur le réseau edge de Cloudflare",
    bodyHtml:
      'Les tableaux de bord et les API d’ingestion tournent sur Cloudflare Workers : aucun serveur à maintenir en ligne chez vous. Pour l’état en direct des tâches et de l’ingestion (pas un badge de disponibilité emprunté), consultez l’<a class="text-link" href="/system-status">état du système</a>.',
  },
  faqLede:
    "Limites des offres, changements d’offre et facturation : les réponses pour bien choisir avant la saison du gel.",
  deciding: {
    title: "Encore hésitant ?",
    bodyHtml:
      'Lisez le <a class="text-link" href="/stories/garage-freeze-alert">scénario de panne du chauffage du garage</a>, partez du <a class="text-link" href="/about/esp32-freeze-kit">kit antigel ESP32</a> ou des <a class="text-link" href="/accessories">accessoires matériels</a> (dont le <a class="text-link" href="/claim-puck">Claim Puck</a>), comparez avec <a class="text-link" href="/compare">MQTT maison, Govee ou Tempest</a>, consultez le <a class="text-link" href="/about/accounts-and-dashboard">guide des comptes</a> ou <a class="text-link" href="/contact">contactez-nous</a> si vous ne savez pas quelle offre choisir.',
  },
  table: {
    scrollHint: "Faites défiler horizontalement pour comparer Free, Member, Pro et Portfolio.",
    feature: "Fonctionnalité",
    save: (pct) => `Économisez ${formatPercent(pct, "fr")}`,
    saveApprox: "Économisez ~20 %",
  },
};

const de: PricingMessages = {
  meta: {
    title: "Tarife & Preise",
    description:
      "ProbeHarbor Free, Member, Pro und Portfolio im Vergleich: Geräte, Verlauf, Frost- und Wasseralarme, NWS-Warnungen und jährliche Abrechnung.",
    breadcrumbHome: "Start",
    breadcrumbPricing: "Preise",
  },
  header: {
    kicker: "Preise",
    title: "Tarife, die mit deinen Sensoren wachsen",
    lede: "Starte kostenlos und finde heraus, ob ProbeHarbor zu dir passt. Wechsle zu Member für den Verlauf einer ganzen Kältesaison oder zu Pro, wenn du ernsthafte Frost- und Wasseralarme, Thermostat-Kontext und Automatisierung willst. Du brauchst mehr als eine Handvoll Objekte oder Logins für Verwalter vor Ort? Portfolio findest du weiter unten.",
    signedInAs: "Angemeldet als",
    currentPlan: "Aktueller Tarif:",
    dashboard: "Dashboard",
    createAccount: "Kostenloses Konto erstellen",
    signIn: "Anmelden",
  },
  ladder: {
    label: "Tarifstufen",
    free: "Teste, ob ProbeHarbor für dich funktioniert: Live-Kurven, Frost- und Leckalarme, ein Live-Link für die Familie.",
    member:
      "Verfolge eine ganze Kältesaison – oder eine nasse Kellersaison: 90 Tage Verlauf, CSV, mehr Geräte und Frostwarnungen aus der Prognose.",
    pro: (properties) =>
      `Ernsthafte Alarme und Automatisierung. NWS, SMS, Hauskontext über Nest/Ecobee, Nachweispaket, 14 Tage Testphase. Bis zu ${properties} Objekte.`,
    portfolio: (properties) =>
      `Größere Bestände mit vielen Objekten: bis zu ${properties} eigene Objekte, objektübergreifende Ansicht des Frost- und Wasserrisikos, Logins für die Hausverwaltung ohne Zugriff auf die Abrechnung.`,
  },
  billing: {
    label: "Abrechnungszeitraum",
    monthly: "Monatlich",
    annual: "Jährlich",
    perMonth: "/Monat",
    perYear: "/Jahr",
    contactUs: "Kontakt aufnehmen",
    billedMonthly: "Monatliche Abrechnung",
    billedAnnually: "Jährliche Abrechnung",
    perMonthBilledAnnually: (monthly) => `${monthly}/Monat bei jährlicher Abrechnung`,
    annualNotConfigured: "Jahrespreis nicht konfiguriert",
    customPricing: "Individueller Preis",
    percent: (pct) => formatPercent(pct, "de"),
    approxTwenty: "~20 %",
    aboutTwenty: "rund 20 %",
    saveUpTo: (pct) => `Bis zu ${pct} sparen`,
    saveApprox: "~20 % sparen",
    saveVsMonthly: (pct) => `${pct} günstiger als monatlich`,
    switchToAnnual: (pct) => `Mit jährlicher Zahlung ${pct} sparen`,
    monthlyHint: (pct, memberAnnual, proAnnual) =>
      `Du siehst die Monatspreise. Bei jährlicher Zahlung sparst du ${pct} (${memberAnnual} / ${proAnnual} pro Jahr).`,
    annualHint: (memberMonthly, proMonthly) =>
      `Du siehst die Jahressummen. Wechsle zu Monatlich, um ${memberMonthly} / ${proMonthly} pro Monat zu sehen.`,
    withTrial: (sub) => `${sub} · 14 Tage kostenlos testen`,
  },
  cards: {
    devices: (n) => `${n} Push-Geräte pro Objekt`,
    history: (days) => `${formatRetention(days, "de")} Verlauf`,
    historyPlus: (days) => `Mindestens ${formatRetention(days, "de")} Verlauf`,
    currentPlan: "Aktueller Tarif",
    includedInPlan: "In deinem Tarif enthalten",
    signInToSubscribe: "Zum Abonnieren anmelden",
    free: {
      tagline: "Live-Überwachung für ein Objekt, ohne Kreditkarte",
      freezeLeak: "Frost- und Leckalarme per Schwellenwert",
      channels: "Alarme per E-Mail, Push und Chat-App",
      getStarted: "Loslegen",
    },
    member: {
      badge: "Am beliebtesten",
      tagline: "Verlaufsexport, mehr Spielraum und Frostwarnung aus der Prognose",
      forecast: "Frostwarnungen aus der Prognose",
      csv: "Verlaufsexport als CSV",
      upgrade: "Auf Member upgraden",
    },
    pro: {
      taglineHtml:
        'Offizielle NWS-Warnungen (USA), Hauskontext über Nest/Ecobee, <a class="text-link" href="/claims-pack">Nachweispaket</a>',
      forecastNws: "Frostwarnungen aus der Prognose + offizielle NWS-Warnungen",
      thermostatHtml:
        'Anbindung von <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a>-Thermostaten (Haus vs. Sensor)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Nachweispaket für die Versicherung</a>',
      automationHtml:
        'SMS, Webhooks, Pro-Freigabeumfänge &amp; <a class="text-link" href="/docs/api">API-Schlüssel</a>',
      properties: (n) => `Bis zu ${n} eigene Objekte (Ferienhaus, Mietobjekt, Werkstatt)`,
      startTrial: "Pro-Testphase starten",
      onPro: "Du nutzt Pro",
      signInForTrial: "Für die Pro-Testphase anmelden",
    },
    portfolio: {
      badge: "Für größere Bestände",
      tagline: (proMax) =>
        `Für Bestände über der Pro-Grenze von ${proMax} Objekten: Verwalter ohne Zugriff auf die Abrechnung`,
      everythingInPro: "Alles aus Pro, dazu: ",
      properties: (max, proMax) =>
        `Bis zu ${max} eigene Objekte (Pro deckt bereits bis zu ${proMax} ab)`,
      crossProperty: "Objektübergreifendes Frostrisiko-Dashboard",
      managers:
        "Logins für die Hausverwaltung (nur Geräte & Alarme, keine Abrechnung, keine anderen Objekte)",
      noteHtml:
        'Ein paar Mietobjekte oder ein Ferienhaus bleiben meist bei Pro. Portfolio ist für größere Vermieter und Hausverwaltungen kalkuliert: siehe <a class="text-link" href="/property-management">Hausverwaltung</a>.',
      onPortfolio: "Du nutzt Portfolio",
      upgrade: "Auf Portfolio upgraden",
      contact: "Kontakt wegen Portfolio",
    },
    manageBilling: "Abrechnung verwalten",
  },
  screenshotCaption:
    "Member und Pro behalten längere Kurven. Free zeigt weiterhin Live-Werte sowie Frost- und Leckalarme per Schwellenwert.",
  integrations: {
    title: "Integrationen mit Pro",
    bodyHtml:
      'Free enthält bereits einen Live-Link für die Familie. Pro schaltet Freigaben für Verlauf und Metriken, Links ohne Ablaufdatum, eingehende Webhooks zum Stummschalten, ausgehende Alarm-Hooks und die <a class="text-link" href="/integrations/home-assistant">offizielle Home-Assistant-Integration über HACS</a> mit vollem Funktionsumfang frei. Verbinde <a class="text-link" href="/about/thermostat-oauth">Nest oder Ecobee</a>, um Raumtemperatur und Sollwert im Haus neben deinen Garagensensoren zu sehen, oder sende einen beliebigen Innenraumsensor als <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">Innenreferenz</a>. Behalte MQTT in deinem LAN; nutze ProbeHarbor für Frost- und Leck-SMS im Haushalt, den Verlauf und Alarme von unterwegs.',
    all: "Alle Integrationen",
    hacsGuide: "HACS-Installationsanleitung",
    nestEcobee: "Nest / Ecobee",
    httpApi: "HTTP-API",
  },
  matrix: {
    title: "Vollständiger Funktionsvergleich",
    subtitleHtml:
      'Die maßgebliche Tarifübersicht für Free / Member / Pro / Portfolio: Geräteanzahl, Aufbewahrung, Frost- und Leckalarme, Thermostat und Verwalter-Logins. Du vergleichst ProbeHarbor mit MQTT, Govee oder einer Wetterstation? <a class="text-link" href="/compare">Alternativen ansehen</a> (Vergleichsratgeber, keine zweite Kopie dieser Tabelle).',
    noteHtml: (proMax, portfolioMax) =>
      `Portfolio enthält alles aus Pro, hebt dann die Grenze für eigene Objekte an (Pro erlaubt bereits bis zu ${proMax}, Portfolio bis zu ${portfolioMax}) und ergänzt Logins für die Hausverwaltung: siehe die Portfolio-Karte oben und <a class="text-link" href="/property-management">Hausverwaltung</a>.`,
  },
  hosted: {
    title: "Gehostet am Edge von Cloudflare",
    bodyHtml:
      'Dashboards und Ingest-APIs laufen auf Cloudflare Workers – du musst keinen Server zu Hause am Laufen halten. Den aktuellen Zustand von Jobs und Datenannahme (kein geliehenes Uptime-Badge) findest du unter <a class="text-link" href="/system-status">Systemstatus</a>.',
  },
  faqLede:
    "Tariflimits, Upgrades und Abrechnung: Antworten für alle, die vor der Frostsaison vergleichen.",
  deciding: {
    title: "Noch unentschlossen?",
    bodyHtml:
      'Lies das <a class="text-link" href="/stories/garage-freeze-alert">Szenario mit ausgefallener Garagenheizung</a>, baue mit dem <a class="text-link" href="/about/esp32-freeze-kit">ESP32-Frost-Kit</a> oder dem <a class="text-link" href="/accessories">Hardware-Zubehör</a> (darunter der <a class="text-link" href="/claim-puck">Claim Puck</a>), vergleiche mit <a class="text-link" href="/compare">DIY-MQTT, Govee oder Tempest</a>, sieh dir den <a class="text-link" href="/about/accounts-and-dashboard">Leitfaden zu Konten</a> an oder <a class="text-link" href="/contact">schreib uns</a>, wenn du unsicher bist, welcher Tarif passt.',
  },
  table: {
    scrollHint: "Seitlich wischen, um Free, Member, Pro und Portfolio zu vergleichen.",
    feature: "Funktion",
    save: (pct) => `${formatPercent(pct, "de")} sparen`,
    saveApprox: "~20 % sparen",
  },
};

const ptBr: PricingMessages = {
  meta: {
    title: "Planos e preços",
    description:
      "Compare o ProbeHarbor Free, Member, Pro e Portfolio: dispositivos, histórico, alertas de congelamento e alagamento, avisos do NWS e plano anual.",
    breadcrumbHome: "Início",
    breadcrumbPricing: "Preços",
  },
  header: {
    kicker: "Preços",
    title: "Planos que crescem com suas sondas",
    lede: "Comece grátis para ver se o ProbeHarbor serve para você. Mude para o Member para ter o histórico de uma temporada de frio inteira, ou para o Pro quando quiser alertas sérios de congelamento e alagamento, contexto do termostato e automação. Precisa de mais do que alguns imóveis ou de logins para administradores no local? O Portfolio está mais abaixo.",
    signedInAs: "Conectado como",
    currentPlan: "Plano atual:",
    dashboard: "Painel",
    createAccount: "Criar conta grátis",
    signIn: "Entrar",
  },
  ladder: {
    label: "Escada de planos",
    free: "Veja se o ProbeHarbor funciona para você: curvas ao vivo, alertas de congelamento e vazamento, um link familiar ao vivo.",
    member:
      "Acompanhe uma temporada de frio inteira, ou uma temporada de porão úmido: 90 dias de histórico, CSV, mais dispositivos e avisos de congelamento pela previsão.",
    pro: (properties) =>
      `Alertas sérios e automação. NWS, SMS, contexto da casa via Nest/Ecobee, pacote para sinistros, teste de 14 dias. Até ${properties} imóveis.`,
    portfolio: (properties) =>
      `Operações maiores com vários imóveis: até ${properties} imóveis próprios, visão do risco de congelamento e alagamento de todos eles, logins para administradores sem acesso à cobrança.`,
  },
  billing: {
    label: "Período de cobrança",
    monthly: "Mensal",
    annual: "Anual",
    perMonth: "/mês",
    perYear: "/ano",
    contactUs: "Fale conosco",
    billedMonthly: "Cobrança mensal",
    billedAnnually: "Cobrança anual",
    perMonthBilledAnnually: (monthly) => `${monthly}/mês com cobrança anual`,
    annualNotConfigured: "Preço anual não configurado",
    customPricing: "Preço sob consulta",
    percent: (pct) => formatPercent(pct, "pt-br"),
    approxTwenty: "~20%",
    aboutTwenty: "cerca de 20%",
    saveUpTo: (pct) => `Economize até ${pct}`,
    saveApprox: "Economize ~20%",
    saveVsMonthly: (pct) => `Economize ${pct} em relação ao mensal`,
    switchToAnnual: (pct) => `Mude para o anual e economize ${pct}`,
    monthlyHint: (pct, memberAnnual, proAnnual) =>
      `Você está vendo os preços mensais. O plano anual garante ${pct} de desconto (${memberAnnual} / ${proAnnual} por ano).`,
    annualHint: (memberMonthly, proMonthly) =>
      `Você está vendo os totais anuais. Mude para Mensal para ver ${memberMonthly} / ${proMonthly} por mês.`,
    withTrial: (sub) => `${sub} · teste grátis de 14 dias`,
  },
  cards: {
    devices: (n) => `${n} dispositivos push por imóvel`,
    history: (days) => `${formatRetention(days, "pt-br")} de histórico`,
    historyPlus: (days) => `${formatRetention(days, "pt-br")} ou mais de histórico`,
    currentPlan: "Plano atual",
    includedInPlan: "Incluído no seu plano",
    signInToSubscribe: "Entre para assinar",
    free: {
      tagline: "Monitoramento ao vivo de um imóvel, sem cartão de crédito",
      freezeLeak: "Alertas de congelamento e vazamento por limite",
      channels: "Alertas por e-mail, push e apps de chat",
      getStarted: "Começar",
    },
    member: {
      badge: "Mais popular",
      tagline: "Exportação do histórico, mais folga e congelamento pela previsão",
      forecast: "Avisos de congelamento pela previsão",
      csv: "Exportação do histórico em CSV",
      upgrade: "Mudar para o Member",
    },
    pro: {
      taglineHtml:
        'Alertas oficiais do NWS (EUA), contexto da casa via Nest/Ecobee, <a class="text-link" href="/claims-pack">pacote para sinistros</a>',
      forecastNws: "Avisos de congelamento pela previsão + alertas oficiais do NWS",
      thermostatHtml:
        'Conexão com termostato <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> (casa x sonda)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Pacote de evidências para sinistro / seguro</a>',
      automationHtml:
        'SMS, webhooks, escopos de compartilhamento Pro e <a class="text-link" href="/docs/api">chaves de API</a>',
      properties: (n) => `Até ${n} imóveis próprios (casa de veraneio, aluguel, oficina)`,
      startTrial: "Começar o teste do Pro",
      onPro: "Você está no Pro",
      signInForTrial: "Entre para testar o Pro",
    },
    portfolio: {
      badge: "Para carteiras de imóveis",
      tagline: (proMax) =>
        `Para operações acima do limite de ${proMax} imóveis do Pro: administradores sem acesso à cobrança`,
      everythingInPro: "Tudo do Pro, mais: ",
      properties: (max, proMax) =>
        `Até ${max} imóveis próprios (o Pro já cobre até ${proMax})`,
      crossProperty: "Painel de risco de congelamento entre imóveis",
      managers:
        "Logins para administradores de imóveis (só dispositivos e alertas, sem cobrança nem outros imóveis)",
      noteHtml:
        'Alguns imóveis de aluguel ou uma casa de veraneio costumam ficar no Pro. O Portfolio tem preço pensado para grandes proprietários e equipes de administração de imóveis: veja <a class="text-link" href="/property-management">administração de imóveis</a>.',
      onPortfolio: "Você está no Portfolio",
      upgrade: "Mudar para o Portfolio",
      contact: "Fale conosco sobre o Portfolio",
    },
    manageBilling: "Gerenciar cobrança",
  },
  screenshotCaption:
    "Member e Pro guardam curvas mais longas. O Free continua mostrando leituras ao vivo e alertas de congelamento e vazamento por limite.",
  integrations: {
    title: "Integrações no Pro",
    bodyHtml:
      'O Free já inclui um link familiar ao vivo. O Pro libera os escopos de histórico e métricas, links que não expiram, webhooks de entrada para silenciar alertas, hooks de alerta de saída e a <a class="text-link" href="/integrations/home-assistant">integração oficial do Home Assistant via HACS</a> com todos os recursos. Conecte <a class="text-link" href="/about/thermostat-oauth">Nest ou Ecobee</a> para ver a temperatura ambiente e o setpoint da casa ao lado das sondas da garagem, ou envie qualquer sensor de clima interno como <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">referência interna</a>. Mantenha o MQTT na sua rede local; use o ProbeHarbor para SMS de congelamento e vazamento da casa, histórico e alertas fora de casa.',
    all: "Todas as integrações",
    hacsGuide: "Guia de instalação do HACS",
    nestEcobee: "Nest / Ecobee",
    httpApi: "API HTTP",
  },
  matrix: {
    title: "Comparação completa de recursos",
    subtitleHtml:
      'A matriz oficial de planos Free / Member / Pro / Portfolio: número de dispositivos, retenção, alertas de congelamento e vazamento, termostato e logins de administradores. Comparando o ProbeHarbor com MQTT, Govee ou uma estação meteorológica? <a class="text-link" href="/compare">Veja as alternativas</a> (guias de concorrentes, não uma segunda cópia desta tabela).',
    noteHtml: (proMax, portfolioMax) =>
      `O Portfolio inclui tudo do Pro, depois aumenta o limite de imóveis próprios (o Pro já permite até ${proMax}; o Portfolio até ${portfolioMax}) e adiciona logins para administradores de imóveis: veja o cartão do Portfolio acima e <a class="text-link" href="/property-management">administração de imóveis</a>.`,
  },
  hosted: {
    title: "Hospedado na edge da Cloudflare",
    bodyHtml:
      'Os painéis e as APIs de ingestão rodam no Cloudflare Workers, sem servidor em casa para você manter ligado. Para ver ao vivo a saúde das tarefas e da ingestão (não um selo de uptime emprestado), confira o <a class="text-link" href="/system-status">status do sistema</a>.',
  },
  faqLede:
    "Limites dos planos, upgrades e cobrança: respostas para quem está escolhendo antes da temporada de frio.",
  deciding: {
    title: "Ainda decidindo?",
    bodyHtml:
      'Leia o <a class="text-link" href="/stories/garage-freeze-alert">cenário de falha do aquecedor da garagem</a>, monte o <a class="text-link" href="/about/esp32-freeze-kit">kit de congelamento com ESP32</a> ou os <a class="text-link" href="/accessories">acessórios de hardware</a> (incluindo o <a class="text-link" href="/claim-puck">Claim Puck</a>), compare com <a class="text-link" href="/compare">MQTT caseiro, Govee ou Tempest</a>, veja o <a class="text-link" href="/about/accounts-and-dashboard">guia de contas</a> ou <a class="text-link" href="/contact">fale conosco</a> se não souber qual plano escolher.',
  },
  table: {
    scrollHint: "Deslize para o lado para comparar Free, Member, Pro e Portfolio.",
    feature: "Recurso",
    save: (pct) => `Economize ${formatPercent(pct, "pt-br")}`,
    saveApprox: "Economize ~20%",
  },
};

export const pricingMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
