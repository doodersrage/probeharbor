
/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "Chalets, puits et dépendances ont souvent l’électricité, mais pas le Wi‑Fi du garage. Une carte LTE <strong>Particle Boron</strong> (ou B-Series) envoie en POST le même JSON d’ingestion via un <strong>webhook Particle Console</strong>. Les coupures du réseau mobile sont normales : ProbeHarbor signale déjà les sondes comme obsolètes quand les envois s’arrêtent, inutile donc de bombarder le réseau de nouvelles tentatives depuis l’appareil.",
  bluesHtml:
    "Vous préférez Blues ? Une route <strong>Notecard</strong> + Notehub peut relayer le même JSON ; le sketch Boron reste le téléchargement principal dans Devices.",
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel en réseau mobile",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  boronWhy: "LTE-M / NB-IoT (référence selon la région). Nano-SIM ou forfait SIM Particle requis.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Sonde pour tuyau ou vide sanitaire. Données sur <strong>D2</strong>.",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up de la ligne de données du DS18B20 vers 3.3V.",
  planPart: "Forfait mobile",
  planWhy: "Cloud Particle + données de l’opérateur. Prévoyez le budget pour les sites isolés qui ne se réveillent qu’une fois par heure.",
  planBuy: "Facturation Particle Console, ou votre propre nano-SIM si la référence le permet.",
  bluesPart: "En option : Blues Notecard",
  bluesWhy: "Autre voie mobile via une route webhook Notehub (même URL d’ingestion).",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>D2</strong>, 4.7k vers 3V3",
    "USB pour le flash et la liaison série à 115200 ; antenne branchée avant l’installation sur site",
  ],
  flashTitle: "Flash et webhook",
  stepsHtml: [
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>Particle Boron .ino</strong> ainsi que le JSON du webhook (URL d’ingestion déjà renseignée).',
    "Flashez avec Particle Workbench ou Web IDE (Device OS 5+). Bibliothèques : <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook : événement <code>probeharbor_ingest</code>, POST vers votre URL d’ingestion, utilisez le JSON du webhook téléchargé (ou définissez le corps sur la valeur de l’événement Particle), Content-Type <code>application/json</code>.",
    "Série à 115200 : <code>publish ok</code>. L’historique du webhook doit afficher HTTP 200. La clé de capteur <code>temp1</code> est importée au premier POST réussi.",
  ],
  repoLead: "Dans le dépôt :",
  dropoutsTitle: "Coupures et sondes obsolètes",
  dropoutsHtml:
    'Le LTE manquera des intervalles en cas d’intempéries, d’itinérance ou de coupure d’un forfait prépayé. Continuez d’envoyer environ une fois par minute quand la connexion est là ; laissez la <a class="text-link" href="/about/debugging-stale-readings">détection des relevés obsolètes</a> et les alertes de gel couvrir les silences. Ne videz pas la batterie dans des boucles de reconnexion serrées.',
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    stale: "Déboguer les relevés obsolètes",
    teensy: "Teensy 4.1 en Ethernet",
    pic18: "PIC18F67J60 en Ethernet",
    allSketches: "Tous les sketches ↗",
  },
};

export default fr;
