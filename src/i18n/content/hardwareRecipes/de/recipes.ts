import type { HardwareRecipeOverlay } from "..";

const flash = { label: "Web-Flasher" };
const checker = { label: "Payload-Prüfer" };

export default {
  "esp32-ds18b20": {
    title: "Frostfühler für die Garage",
    hardware: "ESP32-Entwicklerboard + wasserdichter DS18B20-Fühler + 4,7-kΩ-Widerstand",
    path: "Web-Flasher (ohne Code)",
    notes:
      "Daten an GPIO 4, Widerstand zwischen Daten und 3,3 V. Befestige den Fühler am Rohr, nicht frei in der Luft. Mehrere Fühler können sich eine Leitung teilen.",
    links: [flash, { label: "ESP32-Frostkit" }],
  },
  "esp32-dht22": {
    title: "Temperatur + Luftfeuchtigkeit",
    hardware: "ESP32-Entwicklerboard + DHT22-Modul (AM2302)",
    path: "Web-Flasher (ohne Code)",
    notes:
      "Derselbe GPIO 4 wie beim DS18B20. Montiere ihn mit Abstand zum Board, denn der ESP32 wärmt einen Sensor direkt daneben auf. Ein DHT11 wird ebenfalls erkannt, ist aber nicht auf Hardware getestet und misst gröber.",
    links: [flash, { label: "DHT22-Verkabelung" }],
  },
  "esp32-bme280": {
    title: "Temperatur, Luftfeuchtigkeit + Luftdruck",
    hardware: "ESP32-Entwicklerboard + BME280 per I²C",
    path: "Web-Flasher (ohne Code)",
    notes:
      "Wird beim Start automatisch erkannt: SDA an GPIO 21, SCL an GPIO 22, dazu 3,3 V und GND. Liefert zusätzlich den Luftdruck. Ein BMP280 sieht gleich aus, misst aber keine Luftfeuchtigkeit – prüfe also das Angebot.",
    links: [flash],
  },
  "esp32-i2c": {
    title: "Weitere I²C-Luftsensoren",
    hardware: "ESP32 + SHT31 oder AHT20 per I²C",
    path: "Web-Flasher (ohne Code)",
    notes:
      "Genauso verkabelt wie der BME280 (SDA 21, SCL 22 auf einem klassischen ESP32) und automatisch erkannt.",
    links: [flash],
  },
  "esp32-leak-door": {
    title: "Leck- und Türkontakte",
    hardware: "ESP32 + ein zweiadriger Wassersensor oder ein magnetischer Reedschalter",
    path: "Web-Flasher, Extras-Option",
    notes:
      "Aktiviere Leck oder Tür in den Extras des Flashers. Auf einem klassischen ESP32 geht der Leckkontakt von GPIO 27 an GND und der Reedschalter von GPIO 26 an GND. Ein nasser Kontakt löst ohne weitere Einrichtung einen Leckalarm aus.",
    links: [flash],
  },
  "esp32-battery": {
    title: "Akkubetriebener Fühler",
    hardware: "ESP32 mit LiPo-Akku über einen 1:1-Spannungsteiler (GPIO 35 auf einem klassischen ESP32)",
    path: "Web-Flasher, Extras-Option",
    notes:
      "Meldet den Akkustand in Prozent, damit Devices dich warnt, bevor er leer ist. Mit WLAN reicht er Wochen, nicht Monate.",
    links: [flash],
  },
  "esp32-s3-c3": {
    title: "Neuere ESP32-Boards",
    hardware: "ESP32-S3- oder ESP32-C3-Entwicklerboard",
    path: "Web-Flasher (ohne Code)",
    notes: "Der Flasher hat Images für beide; bisher lief nur der ursprüngliche ESP32 auf echter Hardware.",
    links: [flash],
  },
  "home-assistant": {
    title: "Sensoren, die schon in Home Assistant sind",
    hardware: "Jeder Zigbee-, Z-Wave- oder WLAN-Sensor, den Home Assistant sieht",
    path: "HACS-Integration",
    notes:
      "Eine Automation schickt Entitätszustände an ProbeHarbor, sodass Alarme dich auch dann erreichen, wenn Home Assistant oder der Strom ausfällt. Braucht ein wenig YAML.",
    links: [{ label: "Home Assistant" }, { label: "Benachrichtigungsrezepte" }],
  },
  "esphome-shelly": {
    title: "ESPHome- oder Shelly-Geräte",
    hardware: "ESPHome-Firmware oder ein Shelly H&T / Flood",
    path: "http_request / Webhook",
    notes:
      "Richte die HTTP-Aktion des Geräts auf deine Ingest-URL. Das ESPHome-Snippet kopierst du von der Seite deines Geräts.",
    links: [{ label: "Rezepte für ESPHome und Shelly" }, checker],
  },
  mqtt: {
    title: "Ein MQTT-Feed",
    hardware: "Alles, was bereits an einen MQTT-Broker veröffentlicht",
    path: "MQTT-Bridge oder Node-RED",
    notes:
      "Leite Topics an den Ingest-Endpunkt weiter. Prüfe eine Nachricht mit dem Payload-Prüfer, bevor du den Flow verdrahtest.",
    links: [{ label: "MQTT-Bridge" }, { label: "Node-RED" }, checker],
  },
  arduino: {
    title: "Arduino-Sketches",
    hardware: "Arduino mit Ethernet/WLAN, ESP8266 oder ESP32 in der Arduino IDE",
    path: "Arduino-Sketch, der JSON sendet",
    notes: "Starte mit einem Beispiel-Sketch und ändere Schlüssel und Pins.",
    links: [{ label: "Arduino-Sketches" }, checker],
  },
  "pico-w": {
    title: "Raspberry Pi Pico W",
    hardware: "Pico W + DS18B20 oder DHT22, MicroPython",
    path: "MicroPython-Skript",
    notes: "Ein kurzes Skript liest den Sensor aus und sendet JSON per WLAN.",
    links: [{ label: "Pico-W-Anleitung" }, checker],
  },
  "https-feed": {
    title: "Dein eigener HTTPS-JSON-Feed",
    hardware: "Ein Server, Skript oder Gerät, das Messwerte bereits als JSON bereitstellt",
    path: "Pull-Feed (wir fragen ihn ab)",
    notes: "Trage die URL unter Devices → Pull feeds ein; wir rufen sie regelmäßig ab.",
    links: [{ label: "Python-Feeds" }, { label: "Geräte hinzufügen" }],
  },
  cellular: {
    title: "Kein WLAN vor Ort",
    hardware: "Mobilfunkmodem-Board (z. B. SIM7000 / LTE-M)",
    path: "POST über Mobilfunk",
    notes:
      "Für Hütten und Nebengebäude ohne WLAN. Datentarif und Stromversorgung sind die schwierigen Teile.",
    links: [{ label: "Mobilfunk-Ingest" }, checker],
  },
} satisfies HardwareRecipeOverlay;
