
/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32WebFlashMessages } from "./en";

const de: Esp32WebFlashMessages = {
  introHtml:
    'Am schnellsten geht es mit dem <a class="text-link" href="/flash">Browser-Flasher</a> (Beta): Er installiert eine fertige Firmware per USB und überträgt dein WLAN und den Geräteschlüssel auf das Board, ganz ohne IDE. Er funktioniert mit DS18B20-Fühlern (bis zu vier) oder einem DHT22/DHT11 für Temperatur und Luftfeuchtigkeit, alle an GPIO 4 angeschlossen. Wenn du den Code lesen oder ändern willst, leg ein Push-Gerät an → <strong>lade einen vorausgefüllten Sketch herunter</strong> → flashe ihn mit einem Werkzeug, dem du bereits vertraust.',
  devicesTitle: "1. Download über Devices (empfohlen)",
  devicesStep1Html:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und leg ein Push-Gerät an.',
  devicesStep2Html:
    "Lade im Ingest-Hinweis <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) oder <strong>ESPHome</strong> herunter: Die Ingest-URL ist bereits eingetragen, du musst nur noch das WLAN festlegen.",
  devicesStep3Html:
    "Arbeite die ESP32-Checkliste auf dieser Karte ab (Board-Paket, Bibliotheken, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Installiere die Board-Unterstützung für <strong>ESP32</strong> (Espressif), nicht den Weg über Uno Ethernet mit Garagen-LCD.",
  arduinoItem2Html: "Bibliotheken: <code>OneWire</code>, <code>DallasTemperature</code> (Bibliotheksverwalter).",
  arduinoItem3Html:
    "Öffne die heruntergeladene <code>.ino</code>, setze <code>WIFI_*</code>, wähle den Port und flashe.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'Das Beispiel im Repository <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> enthält eine <code>platformio.ini</code> mit festen Bibliotheksversionen und <code>monitor_speed = 115200</code>. Übergib die Ingest-URL per Build-Flags oder füge den in Devices erzeugten Sketch in <code>src/main.cpp</code> ein.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flashe einmalig ein MicroPython-Image und kopiere dann die heruntergeladene <code>main.py</code> (Ingest-URL bereits eingetragen). Kein Arduino-Board-Paket nötig.",
  esptoolTitle: "5. esptool im Browser (wenn du schon eine .bin hast)",
  esptoolBodyHtml:
    "Wenn du lokal ein Binary baust (PlatformIO <code>pio run</code>), kannst du es mit dem Web-Serial-Tool von Espressif aus Chrome/Edge flashen: praktisch auf abgeschotteten PCs ohne vollständige IDE:",
  esptoolNote:
    "Das Tool flasht nur, was du ihm gibst; deinen ProbeHarbor-Schlüssel kennt es nicht. Nutze weiterhin den Download aus Devices, damit die URL vor dem Bauen im Quellcode steht.",
  portalTitle: "6. WLAN über ein Captive Portal",
  portalBodyHtml:
    'Mit dem <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager-Beispiel</a> musst du SSID und Passwort nicht in den Quellcode schreiben: Verbinde dich einmal mit dem Konfigurations-AP, danach speichert der Fühler die Zugangsdaten. <code>INGEST_URL</code> setzt du trotzdem aus Devices (oder herunterladen und zusammenführen).',
  relatedTitle: "Verwandte Themen",
  related: {
    kit: "Teileliste für das ESP32-Frostkit",
    pico: "Ingest mit Raspberry Pi Pico W",
    stm32: "Ingest mit STM32 Zephyr",
    ch32v: "Ingest mit CH32V RISC-V",
    avr: "Ingest in AVR-Assembler",
    adding: "Geräte hinzufügen",
    ota: "OTA sowie Akku / RSSI",
    qr: "Kit-QR-Code",
    sketches: "Alle Sketches ↗",
  },
};

export default de;
