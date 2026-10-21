
/**
 * /about/adding-devices body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI labels
 * (Devices, Create push device, Reveal ingest key…) stay English because the
 * dashboard is English-only.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const DEV = "https://probeharbor.dev/developers";
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer">`;
const downloads =
  "<strong>Download Arduino .ino</strong> / <strong>MicroPython .py</strong> / <strong>CircuitPython code.py</strong> / <strong>Zephyr main.c</strong> / <strong>CH32V main.c</strong> / <strong>AVR main.S</strong> / <strong>Teensy 4.1 .ino</strong> / <strong>PIC18 main.c</strong> / <strong>Particle Boron .ino</strong> / <strong>ESPHome snippet</strong>";
const curlBlock = '<a class="text-link" href="/api/feeds/example?format=ingest">';
import type { AddingDevicesMessages } from "./en";

const fr: AddingDevicesMessages = {
  introHtml: [
    'ProbeHarbor reçoit les mesures de deux façons : votre matériel <strong>envoie</strong> (push) du JSON vers une URL d’ingestion, ou nous <strong>récupérons</strong> (pull) du JSON en HTTPS depuis un flux public à intervalles réguliers. Les deux se configurent dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. Les nouveaux nœuds ESP ou sur batterie devraient utiliser le push. Le pull s’adresse aux serveurs LAN toujours allumés ou aux relais qui exposent déjà du JSON en HTTPS.',
    'Un compte gratuit (sans carte bancaire) associe votre clé d’ingestion à votre foyer, pour que l’historique et les alertes restent privés. Parcourez d’abord la <a class="text-link" href="/demo">démo en direct</a> si vous voulez voir des mesures sans vous inscrire.',
  ],
  choose: {
    title: "Choisir entre push et pull",
    colPush: "Ingestion push",
    colPull: "Flux pull",
    rowsHtml: [
      ["Qui initie", "Votre appareil", "ProbeHarbor"],
      ["Réseau", "L’appareil a besoin de HTTPS sortant (Uno Ethernet : HTTP vers un relais TLS sur le LAN)", "L’URL du flux doit être accessible publiquement"],
      ["Authentification", "Clé par appareil dans l’URL ; encadré de flashage + Reveal ingest key", "URL HTTPS publique (TLS)"],
      [
        "Forme du JSON",
        "Clés plates, objet <code>temp</code>, <code>sensors[]</code>, SenML ou HA REST",
        "Racine <code>temp</code> imbriquée (par défaut) ; SenML ou HA REST détectés automatiquement",
      ],
      [
        "Idéal pour",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + relais HTTPS sur le LAN), Arduino Uno + Ethernet",
        "Serveurs Ethernet, relais FastAPI",
      ],
    ],
  },
  push: {
    title: "Appareil push (recommandé)",
    stepsHtml: [
      'Connectez-vous et ouvrez <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Sous <strong>Push devices</strong>, cliquez sur <strong>Create push device</strong> (nommé Workshop probe par défaut : renommable à tout moment).",
      `Dans l’encadré d’ingestion : scannez le QR, ou utilisez ${downloads} (URL ou chemin d’ingestion prérempli). La clé reste affichée 30 minutes et survit à un rechargement jusqu’à ce que vous la fermiez.`,
      "<strong>Clé perdue plus tard ?</strong> Sur la carte de l’appareil, utilisez <strong>Reveal ingest key</strong> (si la récupération des clés est activée sur le serveur) ou <strong>Rotate key</strong> pour en émettre une nouvelle. Les appareils créés avant l’activation de la récupération des clés doivent faire une rotation pour enregistrer une copie chiffrée récupérable.",
      'Flashez un ESP32 (voir les <a class="text-link" href="/about/esp32-web-flash">options de flashage</a> : Arduino IDE, PlatformIO, MicroPython ou l’esptool web d’Espressif), un Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), une STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), un CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), un Uno en assembleur GNU AVR (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), une Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), un PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) ou une Particle Boron (<a class="text-link" href="/about/cellular-ingest">webhook LTE</a>). Il vous faut d’abord les pièces ? <a class="text-link" href="/about/esp32-freeze-kit">Nomenclature du kit antigel ESP32</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">assembleur AVR</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> ou <a class="text-link" href="/about/cellular-ingest">cellulaire</a> (DS18B20 étanche). Le moniteur série à <strong>115200</strong> doit afficher <code>POST 200</code> (ou <code>publish ok</code> sur la Boron). Les clés des capteurs s’importent automatiquement (clés plates, objet <code>temp</code>, SenML ou Home Assistant REST). Renommez ensuite les capteurs sur la page Devices. Le mappage manuel sous <strong>Advanced</strong> est facultatif, pour mapper les clés à l’avance.',
      `D’autres exemples (Uno Ethernet + DHT22, MAX31855, MAX6675, etc.) : <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. Le W5100 ne gère pas le TLS : envoyez un POST HTTP vers un relais sur le LAN (<a class="text-link" href="/about/python-feeds">flux Python</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Faites un test rapide avec curl, puis ouvrez <a class="text-link" href="/dashboard/live">Live</a> en étant connecté. Après environ 30 minutes sans envoi, Live signale qu’une sonde est peut-être hors ligne.',
    ],
  },
  curl: {
    title: "Exemple curl (push)",
    introHtml: `Récupérez un corps d’exemple en direct depuis le ${curlBlock}flux d’ingestion d’exemple</a> (basé sur la météo), puis envoyez-le en POST à votre clé d’appareil.`,
    payloadsHtml: `Formats de charge utile : clés plates, objet <code>temp</code> classique, <code>sensors[]</code> typé, <strong>SenML (RFC 8428)</strong> ou JSON <code>state</code> <strong>Home Assistant REST</strong>. Ils sont documentés dans <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a> et dans la référence développeur <a class="text-link" href="${DEV}/ingest/">ingestion push</a>. Essayez des exemples en direct : ${curlBlock}natif</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Flux pull",
    step1Html: "Vérifiez que votre flux renvoie du JSON en HTTPS. Forme classique (clé racine par défaut <code>temp</code>) :",
    stepsHtml: [
      'Ouvrez <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Ajoutez un flux : nom, URL HTTPS et <strong>JSON root key</strong> (par défaut <code>temp</code>). Utilisez <strong>Test feed URL</strong> avant d’enregistrer.",
      "Cliquez sur <strong>Save pull setup</strong> : les clés des sondes s’importent automatiquement depuis le flux en direct. Renommez les libellés sur la même page, ou cliquez sur <strong>Accept suggested names</strong>.",
      'Cliquez sur <strong>Fetch now</strong> pour récupérer les mesures tout de suite, ou attendez la prochaine interrogation planifiée et vérifiez les cartes sur <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Par défaut, les flux pull attendent des objets de sonde imbriqués sous la racine configurée (pas des clés plates façon push). Les <strong>tableaux JSON SenML</strong> et les réponses <strong>Home Assistant REST</strong> sont détectés automatiquement quand cette racine est absente : collez l’URL telle quelle et mappez les clés de sonde exposées par SenML ou HA (par ex. <code>0</code>, <code>state</code>). Si le microcontrôleur ne gère pas le TLS (Uno + shield Ethernet W5100), utilisez un relais HTTPS local (voir <a class="text-link" href="/about/python-feeds">flux Python</a> ou le ${relay}redirecteur HTTP→HTTPS</a> en bibliothèque standard pour l’ingestion push).`,
  },
  mqtt: {
    title: "Déjà sur MQTT ?",
    bodyHtml:
      'Gardez Mosquitto ou le MQTT de Home Assistant sur votre LAN et répliquez les mesures en HTTPS. ProbeHarbor n’est pas un broker MQTT. Recette complète (curl, <code>rest_command</code> de HA, Node-RED) : <a class="text-link" href="/about/mqtt-bridge">guide du pont MQTT</a>. Voir aussi <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor face au MQTT fait maison</a>.',
  },
  verify: {
    title: "Vérifier que tout fonctionne",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong> : les cartes se mettent à jour en direct ; les sondes en retard affichent un avertissement jaune « hors ligne » au bout d’environ 30 minutes.',
      "<strong>Devices → Status</strong> : dernière connexion, batterie et RSSI quand la charge utile les contient (après la première mesure en direct).",
      "<strong>L’essentiel antigel</strong> : réglez le seuil de gel et l’e-mail dans Devices après le premier POST, ou dans Alerts → When to alert, puis envoyez un test (débloque l’Overview complet après la première configuration).",
      "<strong>Overview</strong> : état de l’espace ; après l’essentiel, les indicateurs Status (heures de gel, marge la plus froide, ΔT intérieur−extérieur, écart entre sondes) et <strong>Insights</strong> (nuits à risque, porte/alimentation/mouvement, qualité de l’air). Les graphiques hebdomadaires peuvent superposer l’humidité et le point de rosée quand l’HR est disponible.",
    ],
  },
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">API d’ingestion et webhooks d’alerte</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Mise en service par QR du kit</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configurer les flux de température</a> (le pull en détail)',
      '<a class="text-link" href="/about/debugging-stale-readings">Diagnostiquer des mesures figées</a>',
      `<a class="text-link" href="/about/mqtt-bridge">Recette du pont MQTT</a> · <a class="text-link" href="/compare/diy-mqtt">face au MQTT fait maison</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">docs MQTT développeur</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Développeurs : ingestion push</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">flux pull</a>`,
    ],
  },
};

export default fr;
