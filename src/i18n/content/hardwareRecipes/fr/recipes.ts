import type { HardwareRecipeOverlay } from "..";

const flash = { label: "Outil de flashage web" };
const checker = { label: "Vérificateur de payload" };

export default {
  "esp32-ds18b20": {
    title: "Sonde antigel pour le garage",
    hardware: "Carte de développement ESP32 + sonde étanche DS18B20 + résistance de 4,7 kΩ",
    path: "Outil de flashage web (sans code)",
    notes:
      "Données sur GPIO 4, résistance entre les données et le 3,3 V. Fixez la sonde sur le tuyau, pas dans l’air. Plusieurs sondes peuvent partager le même fil.",
    links: [flash, { label: "Kit antigel ESP32" }],
  },
  "esp32-dht22": {
    title: "Température + humidité",
    hardware: "Carte de développement ESP32 + module DHT22 (AM2302)",
    path: "Outil de flashage web (sans code)",
    notes:
      "Même GPIO 4 que le DS18B20. Montez-le à l’écart de la carte : l’ESP32 réchauffe un capteur placé juste à côté. Un DHT11 est aussi détecté, mais il n’a pas été testé sur du matériel et mesure moins finement.",
    links: [flash, { label: "Câblage du DHT22" }],
  },
  "esp32-bme280": {
    title: "Température, humidité + pression",
    hardware: "Carte de développement ESP32 + BME280 en I²C",
    path: "Outil de flashage web (sans code)",
    notes:
      "Détecté automatiquement au démarrage : SDA sur le GPIO 21, SCL sur le GPIO 22, plus 3,3 V et GND. Indique aussi la pression de l'air. Un BMP280 lui ressemble mais ne mesure pas l'humidité : vérifiez l'annonce.",
    links: [flash],
  },
  "esp32-i2c": {
    title: "Autres capteurs d'air I²C",
    hardware: "ESP32 + SHT31 ou AHT20 en I²C",
    path: "Outil de flashage web (sans code)",
    notes:
      "Câblés comme le BME280 (SDA 21, SCL 22 sur un ESP32 classique) et détectés automatiquement.",
    links: [flash],
  },
  "esp32-leak-door": {
    title: "Contacts de fuite et de porte",
    hardware: "ESP32 + un capteur d’eau à deux fils ou un interrupteur magnétique (reed)",
    path: "Outil de flashage web, option extras",
    notes:
      "Activez Fuite ou Porte dans les extras de l’outil de flashage. Sur un ESP32 classique, le contact de fuite va de GPIO 27 à GND et l’interrupteur reed de GPIO 26 à GND. Un contact mouillé déclenche une alerte de fuite sans autre réglage.",
    links: [flash],
  },
  "esp32-battery": {
    title: "Sonde sur batterie",
    hardware: "ESP32 avec une LiPo via un pont diviseur 1:1 (GPIO 35 sur un ESP32 classique)",
    path: "Outil de flashage web, option extras",
    notes:
      "Remonte le pourcentage de batterie pour que Devices vous prévienne avant qu’elle ne soit vide. En Wi-Fi, comptez des semaines, pas des mois.",
    links: [flash],
  },
  "esp32-s3-c3": {
    title: "Cartes ESP32 plus récentes",
    hardware: "Carte de développement ESP32-S3 ou ESP32-C3",
    path: "Outil de flashage web (sans code)",
    notes:
      "L’outil de flashage propose des images pour les deux ; seul l’ESP32 d’origine a été testé sur du matériel pour l’instant.",
    links: [flash],
  },
  "home-assistant": {
    title: "Capteurs déjà dans Home Assistant",
    hardware: "Tout capteur Zigbee, Z-Wave ou Wi-Fi visible par Home Assistant",
    path: "Intégration HACS",
    notes:
      "Une automatisation envoie l’état des entités à ProbeHarbor, pour que les alertes vous parviennent même si Home Assistant ou le courant tombe. Demande un peu de YAML.",
    links: [{ label: "Home Assistant" }, { label: "Recettes de notification" }],
  },
  "esphome-shelly": {
    title: "Appareils ESPHome ou Shelly",
    hardware: "Firmware ESPHome, ou un Shelly H&T / Flood",
    path: "http_request / webhook",
    notes:
      "Pointez l’action HTTP de l’appareil vers votre URL d’ingestion. Copiez l’extrait ESPHome depuis la page de votre appareil.",
    links: [{ label: "Recettes ESPHome et Shelly" }, checker],
  },
  mqtt: {
    title: "Un flux MQTT",
    hardware: "Tout ce qui publie déjà sur un broker MQTT",
    path: "Pont MQTT ou Node-RED",
    notes:
      "Transférez les topics vers le point d’ingestion. Vérifiez un message avec le vérificateur de payload avant de câbler le flux.",
    links: [{ label: "Pont MQTT" }, { label: "Node-RED" }, checker],
  },
  arduino: {
    title: "Sketches Arduino",
    hardware: "Arduino avec Ethernet/Wi-Fi, ESP8266 ou ESP32 dans l’Arduino IDE",
    path: "Sketch Arduino qui envoie du JSON",
    notes: "Partez d’un sketch d’exemple et changez la clé et les broches.",
    links: [{ label: "Sketches Arduino" }, checker],
  },
  "pico-w": {
    title: "Raspberry Pi Pico W",
    hardware: "Pico W + DS18B20 ou DHT22, MicroPython",
    path: "Script MicroPython",
    notes: "Un court script lit le capteur et envoie du JSON en Wi-Fi.",
    links: [{ label: "Guide Pico W" }, checker],
  },
  "https-feed": {
    title: "Votre propre flux JSON en HTTPS",
    hardware: "Un serveur, un script ou un appareil qui expose déjà ses relevés en JSON",
    path: "Flux interrogé (nous allons le chercher)",
    notes: "Ajoutez l’URL dans Devices → Pull feeds ; nous l’interrogeons à intervalles réguliers.",
    links: [{ label: "Flux Python" }, { label: "Ajouter des appareils" }],
  },
  cellular: {
    title: "Pas de Wi-Fi sur place",
    hardware: "Carte modem cellulaire (par ex. SIM7000 / LTE-M)",
    path: "POST via réseau cellulaire",
    notes:
      "Pour les chalets et dépendances sans Wi-Fi. Le forfait data et l’alimentation sont les points délicats.",
    links: [{ label: "Ingestion cellulaire" }, checker],
  },
} satisfies HardwareRecipeOverlay;
