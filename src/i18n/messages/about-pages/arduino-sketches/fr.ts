
/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const A = '<a class="text-link" target="_blank" rel="noreferrer" href=';
const ETH_INGEST = `${A}"${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>`;
const RELAY = `${A}"${REPO}/blob/main/sketches/relay/push_https_forward.py"><code>push_https_forward.py</code></a>`;
const SKETCHES = `${A}"${REPO}/tree/main/sketches">sketches/</a>`;
const FIRMWARE = `${A}"https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>`;
import type { Messages } from "./en";

const fr: Messages = {
  intro:
    "Le matériel des sondes tourne sur des microcontrôleurs compatibles Arduino. Le firmware, qu’on appelle couramment un sketch, lit les capteurs à intervalle régulier, met les résultats au format JSON et les sert sur le réseau, pour que le site web et d’autres clients récupèrent les données en direct sans câble série.",
  responsibilitiesTitle: "Rôle du sketch",
  responsibilities: [
    "Initialiser les bus des capteurs et l’écran LCD 16×2 local pour une lecture sur place.",
    "Lire chaque sonde DHT22, avec nouvelles tentatives en cas d’erreur passagère du bus.",
    "Calculer une moyenne des sondes en bon état, comme valeur de synthèse rapide dans le JSON.",
    "Répondre aux requêtes HTTP avec un document JSON compact via le shield Ethernet.",
    "En option, journaliser les erreurs sur le port série pour le débogage sur place.",
  ],
  jsonTitle: "Structure JSON type",
  jsonHtml:
    "Les clients attendent un objet <code>temp</code> au premier niveau, avec une clé numérique par sonde plus <code>avg</code>. L’humidité figure à côté de la température pour chaque sonde. Garder des clés stables compte plus qu’une mise en forme soignée : les correspondances du dashboard font directement référence à ces clés.",
  pushJsonHtml:
    'Pour l’<a class="text-link" href="/about/ingest-and-webhooks">ingestion push</a>, le même objet sonde peut être envoyé à <code>/api/ingest/&lt;key&gt;</code>. Les champs optionnels de premier niveau <code>battery</code> (ou <code>battery_pct</code>) et <code>rssi</code> mettent à jour l’état de l’appareil sur la page Devices sans clé de capteur supplémentaire.',
  pushTitle: "Ingestion push depuis le shield Ethernet",
  pushHtml: `La pile W5100 d’un Uno ne gère pas TLS : elle ne peut donc pas envoyer de POST directement à <code>https://probeharbor.dev</code>. Utilisez ${ETH_INGEST} pour envoyer en HTTP le JSON <code>temp</code> classique (DHT22 sur A4/A5, JSON optionnel sur le port 80 pour une lecture depuis le LAN). Lancez ${RELAY} sur un Raspberry Pi, un NAS ou un ordinateur portable pour que ces POST atteignent ProbeHarbor en HTTPS. Les exemples ESP32 en Wi‑Fi qui parlent TLS se trouvent dans ${SKETCHES}.`,
  wiringTitle: "Guides de câblage du matériel",
  wiringLede:
    "Le montage utilise un Arduino Uno, un shield Ethernet W5100, une platine d’essai, un potentiomètre de contraste, un écran LCD 16×2 et deux capteurs DHT22. Trois pages associées détaillent les schémas et le brochage :",
  networkTitle: "Choix de la pile réseau",
  networkHtml: `Cette révision utilise un shield Ethernet en SPI. Le sketch gère le DHCP, les boucles de reconnexion et la diffusion du JSON pendant que l’écran LCD continue d’afficher les valeurs des sondes en direct. Quand TLS est trop lourd pour le MCU, un relais Python peut terminer le HTTPS : voir <a class="text-link" href="/about/python-feeds">Scripts et flux Python</a>. Pour l’ingestion push depuis le même shield, voir ${ETH_INGEST}.`,
  rev2Alt: "Carte de sonde ProbeHarbor révision deux avec shield Ethernet, écran LCD et capteurs DHT22",
  rev2Caption: "ProbeHarbor révision deux : Ethernet, affichage LCD et deux entrées DHT22 dans un seul empilement.",
  workflowTitle: "Méthode de développement",
  workflow:
    "Les sketches sont modifiés dans l’Arduino IDE ou PlatformIO, flashés en USB, puis vérifiés grâce aux journaux série avant de fixer la carte dans l’espace surveillé. Vérifiez la structure du JSON avec curl avant d’ajouter l’URL du flux au dashboard du site.",
  samplesHtml: `Des exemples prêts à adapter pour DS18B20, MAX31855, MAX6675 et Uno + Ethernet se trouvent dans ce dépôt, sous ${SKETCHES}. Le Raspberry Pi Pico W / Pico 2 W utilise le même JSON d’ingestion avec <a class="text-link" href="/about/pico-w-ingest">CircuitPython ou MicroPython</a>. Firmware complet Ethernet + DHT + LCD : ${FIRMWARE}.`,
  tipsTitle: "Conseils de fiabilité",
  tips: [
    "Les redémarrages par watchdog rattrapent les rares blocages réseau sans avoir à monter sur une échelle.",
    "Séparez le bruit d’alimentation des capteurs de celle du MCU quand les câbles sont longs.",
    "Versionnez votre schéma JSON dans la documentation quand vous ajoutez des champs.",
    "Notez quelles broches GPIO correspondent à quelles étiquettes de sonde physiques ; voir le guide de câblage des broches.",
  ],
};

export default fr;
