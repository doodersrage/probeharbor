
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

const en = {
  intro1Html:
    "ESP32 is still the default freeze-kit board, but it is not the only Wi‑Fi microcontroller that can POST to ProbeHarbor. A <strong>Raspberry Pi Pico W</strong> or <strong>Pico 2 W</strong> speaks HTTPS on-chip, uses the same DS18B20 wiring idea as the ESP sketches, and flashes without Arduino IDE if you prefer CircuitPython’s <code>CIRCUITPY</code> drive.",
  intro2Html:
    'This is a temperature probe. The <a class="text-link" href="/claim-puck">claim puck</a> is a different RP2040 (Waveshare RP2040-Zero) that proves presence over USB. Do not mix those firmwares.',
  parts: {
    title: "Parts",
    caption: "Parts for a Pico W freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardPart: "Pico W or Pico 2 W",
    boardWhy: "On-board CYW43439 Wi‑Fi and TLS. Pico 2 W (RP2350) is the drop-in upgrade.",
    probePart: "Waterproof DS18B20",
    probeWhyHtml: "Pipe / crawlspace probe; works below freezing. Data on <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "4.7kΩ resistor",
    resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from 5V on a Pico.",
    amazonResistor: "Amazon 4.7k",
  },
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (not VBUS / 5V)",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>GP4</strong>, with 4.7k between data and 3.3V",
  ],
  wiringNoteHtml:
    "GP4 is GPIO 4, the same numeric pin the ESP32 sketches use. After the first POST, ProbeHarbor imports <code>temp1</code> automatically.",
  circuitpythonTitle: "1. CircuitPython (recommended)",
  circuitpythonStepsHtml: [
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, create a push device, and download <strong>CircuitPython code.py</strong> (ingest URL filled in).',
    "Hold <strong>BOOTSEL</strong>, plug in USB, copy the CircuitPython UF2 for Pico W or Pico 2 W onto the RPI-RP2 drive. The board remounts as <code>CIRCUITPY</code>.",
    `Install libraries: ${circup}`,
    "Set <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, save as <code>code.py</code>.",
    "Serial should show <code>wifi ok</code> then <code>POST 200</code>.",
  ],
  repoSampleHtml: `Repo sample: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flash a Pico W MicroPython UF2, then copy the Devices <strong>MicroPython .py</strong> as <code>main.py</code> (Thonny / mpremote). The same file also runs on ESP32. Pin 4 is GP4.",
  arduinoTitle: "3. Arduino IDE (Earle Philhower core)",
  arduinoHtml:
    "Install the <strong>Raspberry Pi Pico/RP2040</strong> package by Earle Philhower, not Arduino’s mbed RP2040 core. Select <strong>Pico W</strong> or <strong>Pico 2 W</strong>, open the downloaded <code>.ino</code>, set Wi‑Fi, flash. Libraries: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "What we are not adding (yet)",
  notAddingHtml:
    "Anything that can POST HTTPS JSON already works without a first-class sketch: a Linux Raspberry Pi with <code>requests</code>, ESPHome, or a LAN MQTT→HTTP bridge. These families need extra hardware or a gateway, so they stay out of the Devices flash panel:",
  notAddingItemsHtml: [
    "<strong>Pico without W</strong> / RP2040-Zero: no Wi‑Fi. Use Ethernet/ESP-01 plus a TLS relay, or keep the Zero as a claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth or Thread, not native Wi‑Fi HTTPS.",
    '<strong>STM32 Nucleo-F767ZI</strong> is first-class now: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + onboard Ethernet</a> (LAN TLS relay, not Arduino, not Python).',
    '<strong>CH32V307V-EVT</strong> is first-class now: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + onboard Ethernet</a> (QingKe RISC-V, LAN TLS relay).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: still Arduino; the ESP/Pico samples already cover TLS Wi‑Fi if you adapt the WiFi library.",
  ],
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adding devices</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr ingest</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V ingest</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit parts list</a>',
      '<a class="text-link" href="/about/esp32-web-flash">ESP32 flashing options</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, not a probe)</a>',
      `${allSketchesOpen}All sketches ↗</a>`,
    ],
  },
};

export type PicoWIngestMessages = typeof en;
export default en;
