
/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32OtaFirmwareMessages } from "./en";

const fr: Esp32OtaFirmwareMessages = {
  introHtml:
    'Ce qui compte pour ProbeHarbor, ce sont les <strong>relevés en HTTPS</strong>, pas la façon dont vous mettez à jour le microcontrôleur. Gardez l’OTA sur votre réseau local et l’ingestion pointée vers <code>/api/ingest/&lt;key&gt;</code>. Téléchargez un sketch prérempli depuis <a class="text-link" href="/dashboard/devices">Devices</a> après avoir créé un appareil push.',
  firstFlashTitle: "Premier flash ou OTA",
  usbFlashHtml:
    '<strong>Premier flash par USB</strong> : suivez la check-list de l’encart Devices (paquet de cartes ESP32, bibliothèques, Serial 115200). Consultez les <a class="text-link" href="/about/esp32-web-flash">options de flashage</a> pour Arduino IDE, PlatformIO, MicroPython et l’esptool web d’Espressif.',
  lanOtaHtml:
    "<strong>OTA sur le réseau local ensuite</strong> : une fois le Wi‑Fi opérationnel, <code>ArduinoOTA</code> (ou l’OTA HTTPS d’ESP-IDF) vous permet d’envoyer un nouveau firmware sans retourner jusqu’à la sonde avec un câble.",
  arduinoOtaTitle: "ArduinoOTA (réseau local)",
  arduinoOtaBodyHtml:
    "Une fois <code>WiFi.begin</code> connecté, démarrez l’OTA et appelez <code>handle()</code> dans <code>loop</code>. Utilisez un mot de passe dans les ateliers en production. Le « port réseau » de PlatformIO / Arduino IDE affiche alors la carte.",
  independentNote:
    "L’OTA et l’ingestion sont indépendantes : un POST vers le cloud qui échoue ne bloque pas l’OTA, et une mise à jour OTA ne change pas la clé de votre appareil ProbeHarbor.",
  payloadTitle: "Charge utile d’ingestion avec batterie et RSSI",
  payloadIntro:
    "Des champs facultatifs au premier niveau garantissent la justesse de l’état de santé dans Devices et des alertes de batterie faible ou de signal faible :",
  payloadAfterHtml:
    'Les exemples DS18B20 envoient déjà <code>rssi</code>. Ajoutez <code>battery</code> ou <code>battery_pct</code> si vous disposez d’un pont diviseur de tension ou d’une jauge de batterie. Activez les alertes de santé dans <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi sans recompiler",
  wifiBodyHtml:
    '<code>WIFI_SSID</code> / <code>WIFI_PASS</code> codés en dur conviennent pour le point d’accès fixe d’un garage. Si le réseau change souvent, utilisez le portail captif du <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">sketch WiFiManager</a> au premier démarrage ; l’URL d’ingestion provient toujours du téléchargement Devices ou d’un <code>#define</code>.',
  relatedTitle: "Voir aussi",
  related: {
    adding: "Ajouter des appareils",
    flash: "Options de flashage de l’ESP32",
    qr: "Mise en service par QR du kit",
    api: "API HTTP : ingestion",
  },
};

export default fr;
