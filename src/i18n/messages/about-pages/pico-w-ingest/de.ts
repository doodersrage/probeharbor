
/**
 * /about/pico-w-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Pin names, part numbers,
 * commands and dashboard UI labels stay as is.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoSample = `<a class="text-link" href="${GH}/blob/main/sketches/circuitpython/ds18b20_ingest.py" target="_blank" rel="noreferrer"><code>sketches/circuitpython/ds18b20_ingest.py</code></a>`;
const circup =
  "<code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>";
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { PicoWIngestMessages } from "./en";

const de: PicoWIngestMessages = {
  intro1Html:
    "Der ESP32 bleibt die Standardplatine des Frost-Kits, ist aber nicht der einzige WLAN-Mikrocontroller, der per POST an ProbeHarbor senden kann. Ein <strong>Raspberry Pi Pico W</strong> oder <strong>Pico 2 W</strong> spricht HTTPS direkt auf dem Chip, nutzt dieselbe DS18B20-Verdrahtung wie die ESP-Sketches und lässt sich ohne Arduino IDE flashen, wenn du das <code>CIRCUITPY</code>-Laufwerk von CircuitPython bevorzugst.",
  intro2Html:
    'Das hier ist ein Temperaturfühler. Der <a class="text-link" href="/claim-puck">Claim Puck</a> ist ein anderer RP2040 (Waveshare RP2040-Zero), der per USB Anwesenheit nachweist. Misch diese Firmwares nicht.',
  parts: {
    title: "Teile",
    caption: "Teile für einen Pico-W-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardPart: "Pico W oder Pico 2 W",
    boardWhy: "CYW43439-WLAN und TLS an Bord. Der Pico 2 W (RP2350) ist das direkte Upgrade.",
    probePart: "Wasserdichter DS18B20",
    probeWhyHtml: "Fühler für Rohr oder Kriechkeller; funktioniert unter dem Gefrierpunkt. Daten an <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "4,7-kΩ-Widerstand",
    resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3,3 V. Versorge den Fühler an einem Pico nicht mit 5 V.",
    amazonResistor: "4,7k bei Amazon",
  },
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (nicht VBUS / 5 V)",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>GP4</strong>, mit 4,7k zwischen Daten und 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 ist GPIO 4, also dieselbe Pin-Nummer wie in den ESP32-Sketches. Nach dem ersten POST importiert ProbeHarbor <code>temp1</code> automatisch.",
  circuitpythonTitle: "1. CircuitPython (empfohlen)",
  circuitpythonStepsHtml: [
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, lege ein Push-Gerät an und lade <strong>CircuitPython code.py</strong> herunter (Ingest-URL bereits eingetragen).',
    "Halte <strong>BOOTSEL</strong> gedrückt, steck USB ein und kopiere das CircuitPython-UF2 für Pico W oder Pico 2 W auf das Laufwerk RPI-RP2. Die Platine meldet sich danach als <code>CIRCUITPY</code> neu an.",
    `Bibliotheken installieren: ${circup}`,
    "Setze <code>WIFI_SSID</code> / <code>WIFI_PASS</code> und speichere als <code>code.py</code>.",
    "Der serielle Monitor sollte <code>wifi ok</code> und dann <code>POST 200</code> zeigen.",
  ],
  repoSampleHtml: `Beispiel im Repo: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashe ein MicroPython-UF2 für den Pico W und kopiere dann die <strong>MicroPython .py</strong> aus Devices als <code>main.py</code> (Thonny / mpremote). Dieselbe Datei läuft auch auf dem ESP32. Pin 4 ist GP4.",
  arduinoTitle: "3. Arduino IDE (Core von Earle Philhower)",
  arduinoHtml:
    "Installiere das Paket <strong>Raspberry Pi Pico/RP2040</strong> von Earle Philhower, nicht den mbed-RP2040-Core von Arduino. Wähle <strong>Pico W</strong> oder <strong>Pico 2 W</strong>, öffne die heruntergeladene <code>.ino</code>, trag dein WLAN ein und flashe. Bibliotheken: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Was wir (noch) nicht hinzufügen",
  notAddingHtml:
    "Alles, was HTTPS-JSON per POST senden kann, funktioniert schon ohne offiziellen Sketch: ein Raspberry Pi mit Linux und <code>requests</code>, ESPHome oder eine MQTT→HTTP-Bridge im LAN. Diese Familien brauchen zusätzliche Hardware oder ein Gateway und bleiben deshalb außerhalb des Flash-Bereichs unter Devices:",
  notAddingItemsHtml: [
    "<strong>Pico ohne W</strong> / RP2040-Zero: kein WLAN. Nutze Ethernet/ESP-01 plus ein TLS-Relay oder behalte den Zero als Claim Puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth oder Thread, kein natives HTTPS über WLAN.",
    '<strong>STM32 Nucleo-F767ZI</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Onboard-Ethernet</a> (TLS-Relay im LAN, kein Arduino, kein Python).',
    '<strong>CH32V307V-EVT</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Onboard-Ethernet</a> (QingKe RISC-V, TLS-Relay im LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: weiterhin Arduino; die ESP-/Pico-Beispiele decken TLS über WLAN bereits ab, wenn du die WiFi-Bibliothek anpasst.",
  ],
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Geräte hinzufügen</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Datenübertragung mit STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Datenübertragung mit CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Teileliste für das ESP32-Frost-Kit</a>',
      '<a class="text-link" href="/about/esp32-web-flash">ESP32-Flash-Optionen</a>',
      '<a class="text-link" href="/claim-puck">Claim Puck (RP2040-Zero, kein Fühler)</a>',
      `${allSketchesOpen}Alle Sketches ↗</a>`,
    ],
  },
};

export default de;
