import type { AboutPhotoId } from "../../../lib/aboutPhotos";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };
import type { CompareMessages } from "./en";

const fr: CompareMessages = {
  title: "Comparer les solutions de surveillance",
  description:
    "ProbeHarbor face à Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT maison, Tempest, Nest et Ecobee : alertes gel et fuite en local non chauffé.",
  breadcrumbHome: "Accueil",
  breadcrumbCompare: "Comparer",
  kicker: "Comparer",
  headerTitle: "Conçu pour les particuliers, pas pour les serveurs maison",
  headerLede:
    "ProbeHarbor vous offre des sondes en direct, des alertes gel et inondation/fuite, et des SMS en option, sans infrastructure à gérer vous-même. Les limites des forfaits et la grille Free/Member/Pro/Portfolio se trouvent sur la page Tarifs ; cette page compare ProbeHarbor aux autres approches.",
  seePlansPricing: "Voir les forfaits et tarifs",
  startFree: "Commencer gratuitement",
  photoLabels: {
    "network-switch": "vs MQTT maison",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparatifs détaillés",
    subtitle: "Des guides côte à côte pour les alternatives courantes : charge d’exploitation, alertes, et quand chaque option convient.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> peut ajouter des capteurs ProbeHarbor via la <a class="text-link" href="/integrations/smartthings">passerelle Matter</a> (sans application Cloud-to-Cloud). Les capteurs grand public restent regroupés avec Govee ci-dessous : <a class="text-link" href="/compare/govee">guide Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complémentaire, pas concurrent : gardez HA sur votre réseau local et utilisez ProbeHarbor pour les SMS gel et fuite du foyer, l’historique et les alertes à distance. Intégration HACS officielle et notes pour la faire cohabiter avec MQTT sur la <a class="text-link" href="/integrations/home-assistant">page Home Assistant</a> ; voir aussi <a class="text-link" href="/compare/diy-mqtt">vs MQTT maison</a> si vous envisagez une pile entièrement auto-hébergée.',
  },
  table: {
    title: "ProbeHarbor face aux alternatives",
    caption: "ProbeHarbor comparé aux scripts maison et à Govee ou SmartThings",
    capability: "Fonction",
    probeharbor: "ProbeHarbor",
    diy: "Script maison + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Délai avant le gel (dans ce local)", probeharborHtml: "Compte à rebours fondé sur la prévision + alerte d’heures restantes", diyHtml: "Vous écrivez le modèle", consumerHtml: "Seuil uniquement" },
      { capabilityHtml: "Alertes gel (e-mail/SMS/push)", probeharborHtml: "Intégrées, par foyer", diyHtml: "Vous branchez Twilio + cron", consumerHtml: "Push de l’app ; SMS en option ou absent" },
      { capabilityHtml: "Envoi depuis ESP/Arduino", probeharborHtml: "Clé d’appareil unique", diyHtml: "Point d’accès sur mesure", consumerHtml: "Capteurs Govee / appareils SmartThings" },
      { capabilityHtml: "Historique et export CSV", probeharborHtml: "Sur les forfaits payants", diyHtml: "Base de données auto-hébergée", consumerHtml: "Niveaux d’abonnement" },
      { capabilityHtml: "Liens de partage et Grafana", probeharborHtml: "1 lien en direct pour la famille ; Pro ajoute historique et métriques", diyHtml: "Configuration manuelle", consumerHtml: "Rare dans les apps grand public" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Intégration officielle</a> (lien de partage)', diyHtml: "Capteurs REST + webhooks", consumerHtml: "Selon le fabricant" },
      { capabilityHtml: "Plusieurs utilisateurs par foyer", probeharborHtml: "Gratuit", diyHtml: "Sans objet", consumerHtml: "Partage familial peu pratique" },
      { capabilityHtml: "Hébergement et disponibilité", probeharborHtml: 'Réseau Cloudflare ; <a class="text-link" href="/system-status">statut public</a>', diyHtml: "Vous gérez le VPS / cron", consumerHtml: "Cloud du fabricant (opaque)" },
    ],
  },
  screenshotCaption: "Ce que vous obtenez sans gérer votre propre infrastructure : les courbes des sondes face à votre seuil de gel.",
  audience: {
    title: "Pour qui ?",
    itemsHtml: [
      "<strong>Free</strong> : un logement, graphiques en direct, alertes par e-mail et messagerie, et un lien en direct pour la famille pendant votre essai.",
      "<strong>Member</strong> : historique CSV et davantage d’appareils pendant toute une saison froide.",
      '<strong>Pro</strong> : SMS, contexte de la maison via Nest/Ecobee, partages illimités, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">dossier de sinistre</a> et webhooks quand quelqu’un doit se réveiller à 2 h du matin. Free inclut déjà un lien en direct pour la famille. Consultez l’<a class="text-link" href="/docs/api">API HTTP</a> pour l’envoi de données et les métriques.',
      '<strong>Portfolio</strong> : pour les parcs de plusieurs biens qui dépassent le plafond de Pro, avec des accès pour gestionnaires immobiliers. Détails sur <a class="text-link" href="/pricing#portfolio">Tarifs</a> et <a class="text-link" href="/property-management">gestion immobilière</a>.',
    ],
    startFree: "Commencer gratuitement, sans carte",
    seePrices: "Voir les prix des forfaits",
    readScenario: "Lire un scénario de gel",
  },
  limits: {
    title: "Les limites des forfaits sont sur la page Tarifs",
    subtitle:
      "Nombre d’appareils, conservation, Nest/Ecobee, accès gestionnaires et comparaison Free, Member, Pro et Portfolio figurent sur la page Tarifs, afin que cette page reste centrée sur les alternatives plutôt que sur une seconde grille de forfaits.",
    openComparison: "Ouvrir la comparaison des forfaits",
    createAccount: "Créer un compte gratuit",
  },
};

export default fr;
