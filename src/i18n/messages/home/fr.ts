/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */
import type { HomeMessages } from "./en";

const fr: HomeMessages = {
  title: "Surveillance du gel et des inondations au garage",
  ogImageAlt:
    "Graphique de télémétrie en direct ProbeHarbor : courbes des sondes avec humidité, point de rosée, alertes de gel et contacts d’inondation",
  breadcrumbHome: "Accueil",
  brandDefinition:
    "ProbeHarbor surveille les capteurs de température et de fuite dans les garages, ateliers, combles, vides sanitaires et hangars, avec graphiques en direct, historique et alertes de gel, de fuite et de chaleur. Open source, avec une offre gratuite.",
  hero: {
    promise: "Soyez prévenu avant que vos tuyaux ne gèlent ou que votre garage ne soit inondé.",
    openDashboard: "Ouvrir le tableau de bord",
    liveReadings: "Mesures en direct",
    startFree: "Commencer gratuitement",
    seeDemo: "Voir la démo en direct",
    signedInHtml:
      'Connecté : Vue d’ensemble pour le suivi, Direct pour un coup d’œil aux sondes, ou <a class="text-link" href="/dashboard/devices">Appareils</a> pour gérer l’ingestion.',
    guestHtml:
      'Sans carte bancaire. Pas encore de matériel ? <a class="text-link" href="/pipe-freeze-forecast">Recevez des alertes de gel gratuites pour votre secteur</a>.',
    freeForever: "Gratuit pour toujours · sans carte bancaire",
    planPrice: "{plan} {price}/mois",
    visualAlt:
      "Insights ProbeHarbor : courbes des sondes sur sept jours avec la ligne de gel, contacts d’inondation, prévision des nuits à risque et compte à rebours avant le gel",
    visualCaption:
      "Vrai tableau de bord ProbeHarbor : courbes des sondes sur 30 jours, seuil de gel et comparaison d’une année sur l’autre. Pas une maquette.",
  },
  live: {
    title: "Deux façons d’essayer (sans compte)",
    lede: "Ouvrez la porte du garage et déclenchez une vague de froid dans le simulateur, ou suivez ci-dessous les vraies sondes de démonstration.",
    coldSnap: "Simuler une vague de froid",
    demoFeed: "Flux de démo en direct",
    readingsLabel: "Mesures de démo en direct",
  },
  steps: {
    title: "Comment ça marche",
    lede: "Un parcours recommandé : ESP32 + sonde étanche → ProbeHarbor → alerte sur le téléphone. Les autres cartes et flux restent pris en charge une fois en service.",
    buildTitle: "Montez une sonde",
    buildCopy:
      "ESP32 + DS18B20 étanche, c’est le kit par défaut (environ 20–30 $ US de pièces) : trois fils et une résistance. Un DHT22 ajoute l’humidité sur la même broche.",
    installTitle: "Installez depuis le navigateur",
    installCopyHtml:
      'Branchez l’ESP32 en USB, installez le firmware avec l’<a class="text-link" href="/flash">outil de flashage web</a> dans Chrome ou Edge, puis envoyez-lui votre Wi‑Fi et la clé de l’appareil par le même câble. Sans Arduino IDE ni code.',
    alertsTitle: "Recevez les alertes de gel",
    alertsCopy:
      "Réglez la température de gel et une adresse e-mail, envoyez un test, puis suivez Direct et Vue d’ensemble. Ajoutez un contact d’inondation quand vous êtes prêt.",
    partsHtml:
      "<strong>Il vous faut :</strong> un compte gratuit, une carte ESP32 (environ 8–15 $ US), une DS18B20 étanche (environ 2–5 $ US), votre Wi‑Fi et un câble USB avec Chrome ou Edge. Moins de 25 $ US environ, sans abonnement, pour essayer les alertes de gel.",
    startFree: "Commencer gratuitement",
    partsList: "Liste des pièces ESP32",
    otherBoards: "Autres cartes et intégrations",
  },
  maker: {
    title: "Fan de DIY ? Inutile de tout faire vous-même.",
    lede: "Gardez votre installation ESP32, Arduino, MQTT ou Home Assistant. ProbeHarbor ajoute un historique hébergé et des alertes de gel et d’inondation pour tout le foyer, sans serveur de plus à surveiller.",
    tagline: "Votre capteur. Vos données. Vos alertes.",
    mqttBridge: "Passerelle MQTT",
    vsDiy: "vs MQTT fait maison",
  },
  story: {
    kicker: "Scénario",
    title: "1 °C (34 °F). C’est là que l’alerte compte.",
    copyHtml:
      'Imaginez un garage attenant dont un coin descend sous 1 °C (34 °F) chaque nuit claire. L’alerte signale un problème ; l’historique montre où, en pointant un joint de porte qui laisse passer l’air avant que les canalisations ne gèlent. C’est exactement le type de chronologie qu’un <a class="text-link" href="/claims-pack">dossier de preuves pour sinistre</a> documenterait si des dégâts du gel devaient un jour être discutés avec l’assureur.',
    shotCaption: "La même ligne de gel que chaque foyer règle dans Alertes, visible sur les courbes de l’historique.",
    read: "Lire le scénario",
    more: "Plus de scénarios",
  },
  features: {
    label: "Points forts du produit",
    protectTitle: "Protégez les espaces vulnérables",
    protectCopyHtml:
      'Alertes de gel et de fuite dans toutes les offres, plus un compte à rebours avant le gel pour chaque espace : vous savez quand les tuyaux vont geler, pas seulement après. Member ajoute les avertissements de prévision extérieure ; Pro ajoute les alertes officielles du NWS (États-Unis) et les SMS. <a class="text-link" href="/about/cold-snap-playbook">Guide vague de froid</a>',
    leaksTitle: "Repérez les fuites avant qu’elles ne s’étendent",
    leaksCopyHtml:
      'Les contacts d’inondation alertent automatiquement dès qu’ils sont mouillés, même en sourdine ou en vacances. Ajoutez un capteur de <code>level</code> sur un puisard ou une cuve pour des règles d’alerte précoce avant que l’eau n’atteigne le sol. <a class="text-link" href="/about/ingest-and-webhooks">Guide d’ingestion inondation et niveau</a>',
    stackTitle: "Vos capteurs, votre stack",
    stackCopyHtml:
      'Température, humidité, qualité de l’air, portes, fuites, électricité et mouvement, sur du matériel que vous maîtrisez. <a class="text-link" href="/about/ingest-and-webhooks">Guide d’ingestion</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "Des foyers aux parcs immobiliers",
    portfolioCopyHtml:
      'Invitez votre famille et partagez un lien en direct sans communiquer de mot de passe. Pro ajoute un <a class="text-link" href="/claims-pack">dossier de preuves pour sinistre</a> ; Portfolio ajoute des <a class="text-link" href="/property-management">accès gestionnaire</a> pour les locations et les immeubles.',
  },
  pricing: {
    title: "Gratuit pour commencer",
    lede: "Choisissez votre palier selon le besoin : nuits de gel, alertes de fuite ou surveillance d’un parc. Toutes les limites sont sur la page des tarifs.",
    free: "Voyez si ProbeHarbor vous convient",
    member: "Suivez toute une saison froide",
    pro: "Alertes sérieuses et automatisation",
    perMonth: " · {price}/mois",
    startFree: "Commencer gratuitement",
    compare: "Comparer les offres",
  },
  guides: {
    label: "Guides",
    heading: "Guides :",
    hardware: "Installation du matériel",
    freeze: "Alertes de gel",
    flood: "Alertes d’inondation et de fuite",
    sharing: "Partage et API",
    hub: "Ouvrir le centre des guides",
  },
  ossHtml:
    'Tableau de bord open source et exemples de sketches pour capteurs. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Voir le code sur GitHub</a>.',
  faqLede:
    "Des réponses claires pour ceux qui câblent des sondes et des contacts d’humidité, et règlent des alertes de gel ou d’inondation.",
};

export default fr;
