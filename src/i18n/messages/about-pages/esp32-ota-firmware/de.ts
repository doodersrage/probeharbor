
/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32OtaFirmwareMessages } from "./en";

const de: Esp32OtaFirmwareMessages = {
  introHtml:
    'Für ProbeHarbor zählen die <strong>Messwerte über HTTPS</strong>, nicht wie du den Mikrocontroller aktualisierst. Lass OTA in deinem lokalen Netz und den Ingest auf <code>/api/ingest/&lt;key&gt;</code> zeigen. Lade einen vorausgefüllten Sketch unter <a class="text-link" href="/dashboard/devices">Devices</a> herunter, nachdem du ein Push-Gerät angelegt hast.',
  firstFlashTitle: "Erstes Flashen oder OTA",
  usbFlashHtml:
    '<strong>Erstes Flashen per USB</strong>: Nutze die Checkliste im Devices-Hinweis (ESP32-Board-Paket, Bibliotheken, Serial 115200). Unter <a class="text-link" href="/about/esp32-web-flash">Flash-Optionen</a> findest du Arduino IDE, PlatformIO, MicroPython und das Web-esptool von Espressif.',
  lanOtaHtml:
    "<strong>Später OTA im lokalen Netz</strong>: Sobald das WLAN läuft, kannst du mit <code>ArduinoOTA</code> (oder HTTPS-OTA von ESP-IDF) neue Firmware aufspielen, ohne mit einem Kabel zum Fühler klettern zu müssen.",
  arduinoOtaTitle: "ArduinoOTA (lokales Netz)",
  arduinoOtaBodyHtml:
    "Wenn <code>WiFi.begin</code> erfolgreich war, starte OTA und rufe <code>handle()</code> in <code>loop</code> auf. In produktiv genutzten Werkstätten solltest du ein Passwort setzen. Danach zeigt der „Netzwerkport“ in PlatformIO / Arduino IDE das Board an.",
  independentNote:
    "OTA und Ingest sind unabhängig voneinander: Ein fehlgeschlagener Cloud-POST blockiert OTA nicht, und ein OTA-Update ändert deinen ProbeHarbor-Geräteschlüssel nicht.",
  payloadTitle: "Ingest-Payload mit Akku und RSSI",
  payloadIntro:
    "Optionale Felder auf oberster Ebene halten den Gerätezustand in Devices und die Warnungen bei schwachem Akku oder Signal korrekt:",
  payloadAfterHtml:
    'Die DS18B20-Beispiele senden <code>rssi</code> bereits mit. Ergänze <code>battery</code> oder <code>battery_pct</code>, wenn du einen Spannungsteiler oder eine Akku-Füllstandsanzeige hast. Zustandswarnungen aktivierst du unter <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "WLAN ohne Neukompilieren",
  wifiBodyHtml:
    'Fest eingetragene <code>WIFI_SSID</code> / <code>WIFI_PASS</code> reichen für einen festen Garagen-AP. Wechselt das Netz häufig, nutze beim ersten Start das Captive Portal des <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager-Sketches</a>; die Ingest-URL kommt weiterhin aus dem Devices-Download oder einem <code>#define</code>.',
  relatedTitle: "Verwandte Themen",
  related: {
    adding: "Geräte hinzufügen",
    flash: "Flash-Optionen für den ESP32",
    qr: "Einrichtung per Kit-QR-Code",
    api: "HTTP-API: Ingest",
  },
};

export default de;
