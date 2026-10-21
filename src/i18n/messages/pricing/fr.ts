/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */
import type { PricingMessages } from "./en";

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
    pro: "Alertes sérieuses et automatisation. NWS, SMS, contexte de la maison via Nest/Ecobee, dossier de sinistre, essai de 14 jours. Jusqu’à {properties} propriétés.",
    portfolio: "Parcs immobiliers plus importants : jusqu’à {properties} propriétés détenues, vue du risque de gel et d’inondation sur l’ensemble du parc, accès gestionnaires sans accès à la facturation.",
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
    perMonthBilledAnnually: "{monthly}/mois, facturé annuellement",
    annualNotConfigured: "Tarif annuel non configuré",
    customPricing: "Tarif sur mesure",
    percent: "{pct} %",
    approxTwenty: "~20 %",
    aboutTwenty: "environ 20 %",
    saveUpTo: "Jusqu’à {pct} d’économie",
    saveApprox: "Économisez ~20 %",
    saveVsMonthly: "{pct} d’économie par rapport au mensuel",
    switchToAnnual: "Passez à l’annuel pour économiser {pct}",
    monthlyHint: "Vous voyez les prix mensuels. L’annuel vous garantit {pct} de réduction ({memberAnnual} / {proAnnual} par an).",
    annualHint: "Vous voyez les totaux annuels. Passez sur Mensuel pour voir {memberMonthly} / {proMonthly} par mois.",
    withTrial: "{sub} · essai gratuit de 14 jours",
  },
  cards: {
    devices: "{n} appareils push par propriété",
    history: "{retention} d’historique",
    historyPlus: "{retention} d’historique et plus",
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
      properties: "Jusqu’à {n} propriétés détenues (résidence secondaire, location, atelier)",
      startTrial: "Démarrer l’essai Pro",
      onPro: "Vous êtes sur Pro",
      signInForTrial: "Connectez-vous pour l’essai Pro",
    },
    portfolio: {
      badge: "Pour les parcs immobiliers",
      tagline: "Au-delà du plafond de {proMax} propriétés de Pro : des gestionnaires sans accès à la facturation",
      everythingInPro: "Tout Pro, plus : ",
      properties: "Jusqu’à {max} propriétés détenues (Pro couvre déjà jusqu’à {proMax})",
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
    noteHtml: 'Portfolio inclut tout ce que propose Pro, relève ensuite le plafond de propriétés détenues (Pro en autorise déjà jusqu’à {proMax} ; Portfolio jusqu’à {portfolioMax}) et ajoute les accès gestionnaires immobiliers : voir la carte Portfolio ci-dessus et <a class="text-link" href="/property-management">gestion immobilière</a>.',
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
    save: "Économisez {pct} %",
    saveApprox: "Économisez ~20 %",
  },
};

export default fr;
