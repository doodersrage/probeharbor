
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

const fr: PicoWIngestMessages = {
  intro1Html:
    "L’ESP32 reste la carte par défaut du kit antigel, mais ce n’est pas le seul microcontrôleur Wi‑Fi capable d’envoyer des POST à ProbeHarbor. Un <strong>Raspberry Pi Pico W</strong> ou <strong>Pico 2 W</strong> parle HTTPS directement sur la puce, reprend le même principe de câblage du DS18B20 que les sketches ESP, et se flashe sans Arduino IDE si vous préférez le lecteur <code>CIRCUITPY</code> de CircuitPython.",
  intro2Html:
    'Il s’agit d’une sonde de température. Le <a class="text-link" href="/claim-puck">claim puck</a> est un autre RP2040 (Waveshare RP2040-Zero) qui prouve une présence via USB. Ne mélangez pas ces firmwares.',
  parts: {
    title: "Pièces",
    caption: "Pièces pour une sonde antigel Pico W",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardPart: "Pico W ou Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 et TLS intégrés. Le Pico 2 W (RP2350) est la mise à niveau directe.",
    probePart: "DS18B20 étanche",
    probeWhyHtml: "Sonde pour tuyau ou vide sanitaire ; fonctionne sous zéro. Donnée sur <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Résistance de 4,7 kΩ",
    resistorWhy: "Pull-up entre la donnée du DS18B20 et le 3,3 V. N’alimentez pas la sonde en 5 V sur un Pico.",
    amazonResistor: "4,7k sur Amazon",
  },
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (pas VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Donnée du DS18B20 → <strong>GP4</strong>, avec 4,7k entre la donnée et le 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 correspond au GPIO 4, le même numéro de broche que dans les sketches ESP32. Après le premier POST, ProbeHarbor importe <code>temp1</code> automatiquement.",
  circuitpythonTitle: "1. CircuitPython (recommandé)",
  circuitpythonStepsHtml: [
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, créez un appareil push et téléchargez <strong>CircuitPython code.py</strong> (URL d’ingestion préremplie).',
    "Maintenez <strong>BOOTSEL</strong>, branchez l’USB et copiez l’UF2 CircuitPython pour Pico W ou Pico 2 W sur le lecteur RPI-RP2. La carte se remonte sous le nom <code>CIRCUITPY</code>.",
    `Installez les bibliothèques : ${circup}`,
    "Renseignez <code>WIFI_SSID</code> / <code>WIFI_PASS</code> et enregistrez sous <code>code.py</code>.",
    "Le moniteur série doit afficher <code>wifi ok</code> puis <code>POST 200</code>.",
  ],
  repoSampleHtml: `Exemple du dépôt : ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashez un UF2 MicroPython pour Pico W, puis copiez le <strong>MicroPython .py</strong> de Devices sous le nom <code>main.py</code> (Thonny / mpremote). Le même fichier fonctionne aussi sur ESP32. La broche 4 est GP4.",
  arduinoTitle: "3. Arduino IDE (cœur d’Earle Philhower)",
  arduinoHtml:
    "Installez le paquet <strong>Raspberry Pi Pico/RP2040</strong> d’Earle Philhower, et non le cœur mbed RP2040 d’Arduino. Sélectionnez <strong>Pico W</strong> ou <strong>Pico 2 W</strong>, ouvrez le <code>.ino</code> téléchargé, renseignez le Wi‑Fi et flashez. Bibliothèques : <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Ce que nous n’ajoutons pas (pour l’instant)",
  notAddingHtml:
    "Tout ce qui sait envoyer du JSON en POST HTTPS fonctionne déjà sans sketch officiel : un Raspberry Pi sous Linux avec <code>requests</code>, ESPHome, ou un pont MQTT→HTTP sur le LAN. Ces familles demandent du matériel supplémentaire ou une passerelle, elles restent donc absentes du panneau de flashage de Devices :",
  notAddingItemsHtml: [
    "<strong>Pico sans W</strong> / RP2040-Zero : pas de Wi‑Fi. Utilisez Ethernet/ESP-01 plus un relais TLS, ou gardez le Zero comme claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840) : Bluetooth ou Thread, pas de HTTPS natif en Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet intégré</a> (relais TLS sur le LAN, ni Arduino ni Python).',
    '<strong>CH32V307V-EVT</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet intégré</a> (RISC-V QingKe, relais TLS sur le LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong> : toujours de l’Arduino ; les exemples ESP/Pico couvrent déjà le Wi‑Fi en TLS si vous adaptez la bibliothèque WiFi.",
  ],
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Ajouter des appareils</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingestion avec STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestion avec CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Liste des pièces du kit antigel ESP32</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Options de flashage de l’ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, pas une sonde)</a>',
      `${allSketchesOpen}Tous les sketches ↗</a>`,
    ],
  },
};

export default fr;
