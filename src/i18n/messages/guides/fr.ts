import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /guides hub copy. Category/link text lives in `src/i18n/content/guideHub/`.
 * `photoLabels` are keyed by `guidesHubPhotos` id (src/lib/aboutPhotos.ts);
 * `alsoUseful` is keyed by href.
 */
import type { GuidesMessages } from "./en";

const fr: GuidesMessages = {
  title: "Guides",
  description:
    "Guides ProbeHarbor par besoin : matériel, alertes de gel et d’inondation/fuite, partage du foyer et API HTTP, plus tous les articles dans une bibliothèque.",
  breadcrumbHome: "Accueil",
  breadcrumbPage: "Guides",
  kicker: "Guides",
  headerTitle: "Installer les sondes, les alertes gel/inondation, le partage et l’API",
  lede: "Commencez par ce que vous avez à faire. Matériel, alertes de gel et d’inondation/fuite, partage du foyer et documentation ingestion/API au même endroit, puis parcourez tous les articles si vous voulez voir chaque guide.",
  startFree: "Commencer gratuitement",
  allArticles: "Tous les articles",
  esp32Kit: "Kit antigel ESP32",
  photoLabels: {
    "dht22-module": "Installation du matériel",
    "arduino-uno-board": "Arduino et firmware",
    "attic-insulation": "Alertes et gel",
    "ethernet-cable": "Intégrations et API",
  },
  alsoRelevant: "Concerne aussi :",
  alsoUsefulTitle: "À voir aussi",
  alsoUsefulSubtitle: "Scénarios, comparatifs et intégrations, à côté de la bibliothèque de guides pratiques.",
  alsoUseful: {
    "/stories": {
      label: "Scénarios",
      summary: "Des déroulés illustratifs de gel, de fuite et de chaleur, alerte après alerte.",
    },
    "/compare": {
      label: "Comparer les alternatives",
      summary: "ProbeHarbor face au MQTT maison, Govee, Tempest, Nest, Ecobee et d’autres.",
    },
    "/integrations": {
      label: "Intégrations",
      summary: "Home Assistant, Matter, Node-RED, Influx, MQTT et webhooks.",
    },
    "/accessories": {
      label: "Accessoires",
      summary: "Claim puck, balise d’alerte, contacts porte/fuite/courant, étiquettes de kit, supports.",
    },
    "/gift": {
      label: "Cadeau / parrainage",
      summary: "Partagez un lien d’invitation : la personne invitée obtient des jours d’essai Pro en plus, et vous aussi quand elle s’abonne.",
    },
  },
  itemListName: "Guides ProbeHarbor par besoin",
  itemListDescription:
    "Guides d’installation du matériel, d’alertes de gel et d’inondation, de partage du foyer et de l’API.",
  faqLede: "Des réponses rapides avant de plonger dans une catégorie.",
  faqs: [
    {
      question: "Par où commencer ?",
      answer:
        "Choisissez un besoin ci-dessous : installation du matériel (kit antigel ESP32), alertes de gel/inondation, partage du foyer ou API HTTP. Ou ouvrez la bibliothèque About complète.",
    },
    {
      question: "Vendez-vous des kits matériels ?",
      answer:
        "Non. ProbeHarbor est un logiciel. Achetez les composants chez Adafruit ou Amazon à l’aide de la nomenclature du kit antigel ESP32 et des pages d’accessoires, puis flashez un sketch prérempli depuis Devices.",
    },
    {
      question: "Où trouver des scénarios d’exemple et des comparatifs ?",
      answer:
        "Scénarios illustratifs de gel, de fuite et de chaleur : probeharbor.dev/stories. Face au MQTT maison, Govee, Tempest, Nest et Ecobee : probeharbor.dev/compare. Home Assistant : probeharbor.dev/integrations.",
    },
  ],
};

export default fr;
