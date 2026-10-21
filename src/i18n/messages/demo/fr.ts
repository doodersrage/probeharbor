/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const fr: DemoMessages = {
  title: "Démo des sondes en direct",
  description:
    "Essayez ProbeHarbor sans compte : simulateur de sondes interactif, vraies sondes de démo en direct et le même circuit d’alertes gel/inondation que votre matériel.",
  ogImageAlt: "Courbes de température en direct des sondes ProbeHarbor, sans compte",
  breadcrumbHome: "Accueil",
  breadcrumbDemo: "Démo en direct",
  schemaName: "Démo des sondes en direct ProbeHarbor",
  schemaDescription:
    "Démos ProbeHarbor sans compte : simulateur de sondes multizone interactif et sondes de démo en direct sur le circuit d’ingestion de production.",
  header: {
    kicker: "Essayez (sans compte)",
    title: "Démos : simulateur + flux en direct",
    lede: "Provoquez un épisode de gel dans le simulateur de sondes interactif, ou suivez de vraies sondes de démo à côté de la météo extérieure : le même circuit d’ingestion que votre ESP ou Arduino utilisera pour les alertes gel et inondation.",
    simulator: "Simulateur interactif",
    liveReadings: "Relevés en direct",
    connect: "Connecter mes sondes",
  },
  paths: {
    title: "Trois façons d’essayer ProbeHarbor",
    lede: "Commencez par le simulateur pour voir le risque de gel réagir à vos réglages, puis vérifiez avec le flux en direct et le circuit d’inondation déclenché automatiquement au contact de l’eau.",
    items: [
      {
        label: "Simulateur de sondes interactif",
        text: "Pratique (le meilleur point de départ). Réglez la porte ouverte ou fermée, l’ensoleillement, l’air extérieur et le seuil de gel. Provoquez une vague de froid et regardez les barres de chaque zone et le JSON push/pull se mettre à jour.",
      },
      {
        label: "Flux de démo en direct",
        text: "Pour observer. De vraies sondes de démo se mettent à jour ici via le circuit d’ingestion de production. Idéal pour répondre à « c’est truqué ? » avec des chiffres en direct.",
      },
      {
        label: "Mise en service du kit par QR",
        text: "Le circuit matériel. Après avoir créé un appareil push, scannez le QR d’ingestion (ou imprimez-le sur une étiquette du kit) pour que le firmware envoie par POST température, inondation et autres types de capteurs sans saisir la clé.",
      },
    ],
  },
  sim: {
    title: "Provoquez le changement : simulateur interactif",
    lede: "Les préréglages vague de froid, courant d’air de porte et ensoleillement réutilisent le même calcul d’état des espaces d’Overview qu’en production. Ouvrez la porte du garage et regardez la zone de la porte s’écarter de l’établi : c’est pour cela que placer plusieurs sondes compte.",
    doorDraft: "Essayer le courant d’air",
    coldSnap: "Essayer la vague de froid",
    openFull: "Ouvrir le simulateur complet",
  },
  live: {
    title: "Flux de démo en direct",
    ledeHtml:
      'De vrais relevés de sondes de démo et la météo extérieure, pas une maquette. Vous préférez manipuler les variables vous-même ? <a class="text-link" href="/about/probe-demo">Ouvrez le simulateur interactif</a>.',
    readingsLabel: "Relevés de démo en direct",
    historyNote:
      "Les courbes des sondes sont le modèle de l’atelier de démo appliqué à la météo horaire réelle de la semaine écoulée ; la ligne pointillée est la température extérieure.",
  },
  screenshotCaption:
    "La même interface une fois votre matériel connecté. Insights avec courbes sur 30 jours, seuil de gel et nuits à risque.",
  freeze: {
    title: "Les mêmes données qui déclenchent les alertes gel et inondation",
    lede: "Quand une sonde franchit votre seuil, ProbeHarbor peut vous prévenir par e-mail, notification push du navigateur, Discord, Telegram, Slack et, avec Pro, par SMS. Les contacts d’inondation ou de fuite alertent automatiquement au contact de l’eau, sur la même infrastructure. Fixez le seuil une fois, testez-le avant la prochaine nuit froide.",
    channelsLabel: "Canaux d’alerte",
    channels: [
      "E-mail · Discord · Telegram · Slack",
      "Push sur toutes les offres",
      "SMS · webhooks avec Pro",
      "Les capteurs de fuite ou d’inondation alertent automatiquement au contact de l’eau",
    ],
    startFree: "Commencer gratuitement : ouvrir Devices",
    story: "Histoire d’une fuite",
    cookbook: "Guide des canaux",
    imageAlt:
      "Tendance de température ProbeHarbor avec humidité, point de rosée et seuil de gel à 1 °C (34 °F)",
  },
  steps: {
    title: "À votre kit maintenant",
    ledeHtml:
      'Compte gratuit, sans carte bancaire : d’un tableau de bord vide à une courbe en direct en une seule séance. Les kits physiques peuvent utiliser la <a class="text-link" href="/about/kit-qr-onboarding">mise en service par QR</a> : l’URL d’ingestion est à un scan.',
    items: [
      {
        title: "Créez un appareil push",
        copyHtml:
          "Inscrivez-vous et choisissez un parcours dans Devices : Home Assistant, ESPHome ou MQTT reçoivent un extrait à copier-coller ; une carte reçoit un sketch pré-rempli ; sans matériel, un flux de démo en un clic.",
      },
      {
        title: "Envoyez du JSON en POST",
        copyHtml:
          "Faites un POST vers <code>/api/ingest/&lt;key&gt;</code>. Les capteurs sont importés automatiquement au premier POST : renommez-les ensuite dans Devices.",
      },
      {
        title: "Suivez Home et réglez les alertes",
        copyHtml:
          "Vérifiez les valeurs en direct, fixez un seuil de gel et sachez que les contacts d’inondation ou de fuite alertent automatiquement au contact de l’eau, sur le même compte.",
      },
    ],
    startFree: "Commencer gratuitement : ouvrir Devices",
    guide: "Guide d’ajout d’appareils",
    walkthrough: "Pas-à-pas QR du kit",
  },
  compat: {
    label: "Compatible avec",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Passerelle MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Gardez MQTT sur votre réseau local ; répliquez vers ProbeHarbor en HTTPS pour les alertes gel/inondation du foyer et l’historique. <a class="text-link" href="/about/mqtt-bridge">Recette de la passerelle MQTT</a>',
  },
  explore: {
    title: "Continuer l’exploration",
    lede: "Vous avez déjà provoqué une vague de froid simulée ? Vérifiez avec le flux en direct, puis lisez une histoire de fuite, cherchez une ville sur la carte ou configurez le QR du kit.",
    items: [
      { label: "Simulateur de sondes interactif", hint: "La démo pratique principale : porte, soleil, extérieur, seuil de gel" },
      { label: "Carte communautaire du gel", hint: "Agrégats par ville sur participation volontaire, sans compte" },
      { label: "Mise en service du kit par QR", hint: "Créer l’appareil → scanner le QR d’ingestion → premier POST" },
      { label: "Scénario de gel", hint: "Une panne de chauffage à 2 h du matin, alerte par alerte" },
    ],
  },
  faqLede:
    "Réponses propres à la démo ; pour les offres et les bases du produit, consultez Tarifs ou la FAQ de la page d’accueil.",
};

export default fr;
