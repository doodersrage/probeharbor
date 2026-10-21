
/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */
import type { Esp32FreezeKitMessages } from "./en";

const fr: Esp32FreezeKitMessages = {
  howTo: {
    name: "Fabriquer une sonde antigel ESP32 pour ProbeHarbor",
    steps: [
      {
        name: "Acheter la nomenclature",
        text: "Procurez-vous un ESP32 avec Wi-Fi, un DS18B20 étanche et une résistance de pull-up de 4,7 kΩ si le lot de la sonde n’en contient pas. Privilégiez les fiches produit Adafruit ; les liens Amazon /dp/ sont des alternatives facultatives.",
      },
      {
        name: "Câbler le DS18B20",
        text: "Reliez VCC au 3,3 V, GND à GND et la donnée au GPIO 4, avec une pull-up de 4,7 kΩ entre la donnée et le 3,3 V. Fixez la pointe inox sur le tuyau le plus froid ou le mur nord.",
      },
      {
        name: "Créer un appareil push",
        text: "Créez un compte ProbeHarbor gratuit et un appareil push dans Dashboard → Devices, puis copiez sa clé d’appareil.",
      },
      {
        name: "Installer depuis le navigateur et vérifier",
        text: "Branchez l’ESP32 en USB, ouvrez le flasheur web dans Chrome ou Edge, installez le firmware et envoyez votre Wi-Fi et votre clé d’appareil. La page confirme l’arrivée de la première mesure. Pas besoin de l’Arduino IDE.",
      },
      {
        name: "Activer les alertes de gel",
        text: "Réglez le seuil de gel et l’e-mail dans Alerts → When to alert, envoyez une alerte de test et, si vous le souhaitez, activez l’avertissement de délai avant le gel.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor ne vend pas de matériel. Achetez les pièces ci-dessous, puis installez le firmware depuis votre navigateur avec le <a class="text-link" href="/flash">flasheur web</a> : ni Arduino IDE ni code, et il transmet à la carte votre Wi‑Fi et votre clé d’appareil par le même câble USB. Si vous préférez lire ou modifier le code, les sketches de <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> attendent un <strong>ESP32 avec Wi‑Fi</strong> et un <strong>DS18B20 étanche</strong>. Achetez les pièces ci-dessous (Adafruit pour les références connues, les liens produit Amazon si vous voulez un DevKit moins cher), puis créez un appareil push et flashez plutôt un sketch prérempli depuis <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Nomenclature antigel recommandée",
    caption: "Pièces pour une sonde antigel ESP32",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardPart: "Carte ESP32",
    boardWhy: "Envoi push en HTTPS via Wi‑Fi (TLS intégré à la puce)",
    amazonDevKit: "DevKit sur Amazon",
    probePart: "DS18B20 étanche",
    probeWhy: "Sonde pour tuyau ou vide sanitaire ; fonctionne sous zéro",
    includesPullupHtml: "(4,7&nbsp;kΩ inclus)",
    amazonProbe: "Sonde sur Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obligatoire sur la ligne de données 1-Wire si le lot de la sonde n’en contient pas",
    amazonResistor: "4,7k sur Amazon",
    powerPart: "Alimentation USB",
    powerWhy: "Bloc secteur ou câble USB-C ; si possible, gardez la carte plus au chaud que l’emplacement de la sonde",
    powerBuyHtml: "N’importe quelle alimentation USB 5&nbsp;V d’au moins 500&nbsp;mA",
  },
  bomNoteHtml:
    "Les fiches produit changent : considérez Adafruit comme la nomenclature de référence. Les liens Amazon <code>/dp/</code> de <code>bomLinks</code> sont des alternatives compatibles Partenaires tant que l’annonce existe. Les lots génériques « kit ESP32 + DS18B20 » livrent souvent un DHT11 au lieu d’une sonde étanche : évitez-les.",
  wire: {
    title: "Câblage",
    diagramAlt: "Schéma de câblage : ESP32 DevKit vers un DS18B20 étanche avec pull-up de 4,7 kiloohms sur le GPIO 4",
    captionHtml:
      "Rouge → 3,3&nbsp;V, noir → GND, donnée jaune/blanc → GPIO 4, avec une pull-up de 4,7&nbsp;kΩ entre la donnée et le 3,3&nbsp;V. Le sketch d’ingestion d’exemple utilise le GPIO 4 par défaut.",
    itemsHtml: [
      "<strong>Rouge</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Noir</strong> (GND) → GND",
      "<strong>Jaune / blanc</strong> (donnée) → GPIO 4 (valeur par défaut du sketch d’exemple ; tout GPIO numérique libre convient si vous changez la broche)",
      "4,7&nbsp;kΩ entre la donnée et le 3,3&nbsp;V",
    ],
    featherHtml:
      'Sur une Adafruit Feather (HUZZAH32 ou ESP32 Feather V2), le GPIO 4 est la broche marquée <strong>A5</strong>. Consultez les <a class="text-link" href="/flash#feather-pins">notes Feather de la page du flasheur</a> pour les détails supplémentaires.',
    strap:
      "Fixez la sonde inox sur le tuyau le plus froid ou le mur nord avec un collier de serrage, puis entourez la sonde et un court tronçon de tuyau d’isolant en mousse : vous mesurez ainsi la température du tuyau, pas celle de l’air ambiant.",
  },
  flash: {
    title: "Flasher et connecter",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte gratuit</a> et un appareil push dans Devices.',
      'Ouvrez le <a class="text-link" href="/flash">flasheur web</a> dans Chrome ou Edge, branchez l’ESP32, cliquez sur Install, puis envoyez votre Wi‑Fi et votre clé d’appareil. Il affiche « First reading delivered » quand la sonde est en ligne.',
      'Vous préférez le code ? Téléchargez le <code>.ino</code> Arduino ou le <code>.py</code> MicroPython prérempli depuis Devices et flashez-le selon les <a class="text-link" href="/about/esp32-web-flash">options de flashage de l’ESP32</a> (le moniteur série à 115200 doit afficher <code>POST 200</code>).',
      'Facultatif : imprimez le <a class="text-link" href="/about/kit-qr-onboarding">QR du kit</a> d’ingestion sur le boîtier.',
      'Réglez le seuil de gel et l’e-mail dans <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> et activez l’avertissement de délai avant le gel si vous voulez être prévenu avant que la sonde n’atteigne le gel.',
    ],
  },
  avoid: {
    title: "Ce qu’il ne faut pas acheter contre le gel des tuyaux",
    itemsHtml: [
      "<strong>Kits de démarrage avec DHT11 seul</strong> : peu fiables sous zéro, fils courts, pas étanches.",
      "<strong>Capteurs d’ambiance Bluetooth / Zigbee</strong> : ils ne parlent pas l’ingestion push de ProbeHarbor.",
      "<strong>Uno + Ethernet seul</strong> : nécessite un relais HTTPS sur le réseau local ; bien pour les montages avancés, pas pour un premier kit.",
    ],
    dhtNoteHtml: `Le DHT22 convient toujours pour l’air et l’humidité de l’atelier (votre étude de cas du garage en Ethernet). Pour les tuyaux, préférez le DS18B20. Câble PTFE haute température : {highTempLink} si la sonde se trouve près d’un chauffe-eau ou d’un câble chauffant.`,
  },
  extras: {
    title: "Extras facultatifs",
    itemsHtml: [
      "Un second DS18B20 sur le même bus 1-Wire pour comparer la zone de la porte et le mur du tuyau (multizone).",
      "Boîtier ABS ventilé + presse-étoupe pour l’ESP32 dans un garage poussiéreux.",
      "Les kits de démarrage ELEGOO ou ESP32 génériques conviennent <em>si</em> vous ajoutez quand même un DS18B20 étanche : leur DHT11 fourni n’est pas la sonde antigel.",
    ],
  },
  related: {
    title: "À lire aussi",
    labels: [
      "Ajouter des appareils push et pull",
      "Options de flashage de l’ESP32",
      "Ingestion avec le Raspberry Pi Pico W",
      "Mise en service par QR du kit",
      "Kit de fixation de sonde",
      "Accessoires matériels",
      "Fixation des sondes et boîtiers",
      "Check-list de la saison du gel",
    ],
  },
};

export default fr;
