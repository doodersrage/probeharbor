/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const fr: DemoMessages = {
  title: "Démo des sondes en direct",
  description:
    "Essayez ProbeHarbor sans compte : un simulateur de sondes interactif, un atelier de démonstration simulé piloté par la météo locale réelle, et la même configuration d’alertes gel et inondation que votre matériel utilisera.",
  ogImageAlt: "Courbes de température en direct des sondes ProbeHarbor, sans compte",
  breadcrumbHome: "Accueil",
  breadcrumbDemo: "Démo en direct",
  schemaName: "Démo des sondes en direct ProbeHarbor",
  schemaDescription:
    "Démos ProbeHarbor sans compte : un simulateur de sondes multizone interactif et un atelier de démonstration simulé piloté par la météo locale réelle.",
  header: {
    kicker: "Essayez (sans compte)",
    title: "Démos : simulateur + atelier piloté par la météo",
    lede: "Déclenchez un épisode de gel dans le simulateur de sondes interactif, ou regardez un atelier de démonstration simulé réagir à la vraie météo du jour, dans le même format de relevés que votre ESP ou Arduino enverra pour les alertes gel et inondation.",
    simulator: "Simulateur interactif",
    liveReadings: "Relevés de l’atelier de démo",
    connect: "Connecter mes sondes",
  },
  paths: {
    title: "Trois façons d’essayer ProbeHarbor",
    lede: "Commencez par le simulateur pour sentir le risque de gel réagir à vos actions, puis regardez l’atelier de démo piloté par la météo et le circuit d’alerte automatique en cas d’eau.",
    items: [
      {
        label: "Simulateur de sondes interactif",
        text: "Pratique (le meilleur point de départ). Réglez la porte ouverte ou fermée, l’ensoleillement, l’air extérieur et le seuil de gel. Provoquez une vague de froid et regardez les barres de chaque zone et le JSON push/pull se mettre à jour.",
      },
      {
        label: "Atelier de démo piloté par la météo",
        text: "Pour observer. Trois sondes d’atelier simulées, recalculées à partir de la météo locale réelle à chaque actualisation. Idéal pour voir les relevés suivre les conditions extérieures réelles avant de câbler quoi que ce soit.",
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
    title: "Atelier de démo piloté par la météo",
    ledeHtml:
      'Atelier de démonstration simulé, piloté par la météo locale réelle : les relevés des sondes viennent d’un modèle d’atelier, les conditions extérieures sont en direct. Vous préférez manipuler les variables vous-même ? <a class="text-link" href="/about/probe-demo">Ouvrir le simulateur interactif</a>.',
    readingsLabel: "Relevés de démo simulés",
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
    lede: "Vous avez déjà déclenché une vague de froid simulée ? Regardez l’atelier de démo piloté par la météo, puis essayez un scénario d’inondation ou de fuite, consultez la carte d’une ville ou configurez le QR du kit.",
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
