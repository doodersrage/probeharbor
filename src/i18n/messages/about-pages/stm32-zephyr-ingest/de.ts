
/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { Stm32ZephyrIngestMessages } from "./en";

const de: Stm32ZephyrIngestMessages = {
  intro1Html:
    "ESP32 und Pico W decken WLAN ab. Wenn du einen anderen Chiphersteller und eine Toolchain willst, die weder Arduino noch Python ist, sendet ein <strong>ST Nucleo-F767ZI</strong> mit <strong>Zephyr</strong> dasselbe Ingest-JSON per POST über das Onboard-Ethernet. C, <code>west</code>, ST-LINK. Die Arduino-kompatible Stiftleiste ist nur eine Pinbelegung: Die Firmware ist kein Arduino-Sketch.",
  intro2Html:
    'Natives HTTPS unter Zephyr heißt, eine CDN-CA fest ins Image einzubauen – und das bricht, sobald die Zertifikatskette am Edge wechselt. Dieses Beispiel nutzt dasselbe HTTP→HTTPS-Relay im LAN wie der Weg mit <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, sodass Cloudflare die CAs wechseln kann, ohne dass du neu flashen musst.',
  parts: {
    title: "Teile",
    caption: "Teile für einen STM32-Zephyr-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardWhy: "Cortex-M7, Ethernet-MAC + PHY an Bord, ST-LINK-Debugger. Kein WLAN-Modul.",
    probePart: "Wasserdichter DS18B20",
    probeWhyHtml: "Fühler für Rohr oder Kriechkeller. Daten an Arduino-Pin <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "4,7-kΩ-Widerstand",
    resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3,3 V. Versorge den Fühler nicht über den 5-V-Arduino-Pin.",
    amazonResistor: "4,7k bei Amazon",
    ethernetPart: "Ethernet-Anschluss",
    ethernetWhy: "DHCP in deinem LAN. Ein Pi, NAS oder Laptop betreibt das TLS-Relay.",
    ethernetBuy: "Beliebiges Cat5e-Patchkabel zu deinem Switch.",
  },
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k nach 3,3 V",
    "RJ45 → LAN. ST-LINK-USB zum Flashen und für die serielle Schnittstelle mit 115200.",
  ],
  build: {
    title: "Bauen und flashen",
    step1Html:
      'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>Zephyr main.c</strong> herunter (Ingest-Pfad bereits eingetragen), oder kopiere die Defines aus dem Ingest-Hinweis.',
    relayLabel: "Auf einem Rechner im LAN:",
    step3Html:
      "Setze <code>INGEST_HOST</code> auf diesen Rechner. Ersetze <code>src/main.c</code> durch die heruntergeladene Datei, wenn der Pfad fest eingebaut sein soll.",
    westLabel: "Aus einem Zephyr-Workspace:",
    step5Html:
      "Seriell mit 115200: <code>dhcp ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST importiert.",
    repoHtml: `App im Repo: ${repoApp} (<code>prj.conf</code>, D4-Overlay, CMake).`,
  },
  otherBoardsTitle: "Andere STM32-Boards",
  otherBoardsHtml:
    "Jedes Zephyr-Ziel mit Ethernet kann denselben C-Code ausführen, wenn du ein 1-Wire-Overlay für deinen GPIO ergänzt. Nucleo-F429ZI und Nucleo-H743ZI sind die üblichen Verwandten. Ein Blue Pill mit W5500 ist ebenfalls C, aber mit Cube HAL + ioLibrary, nicht mit dieser Zephyr-App: Nutze das LAN-Relay auf dieselbe Weise.",
  whyNot: {
    title: "Warum nicht zuerst Nordic oder TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth oder Thread, kein natives HTTPS über WLAN.",
      "<strong>nRF9160</strong>: LTE-M funktioniert, aber SIM-Karte und Mobilfunkvertrag sind ein schlechteres erstes Frost-Kit als ein Ethernet-Anschluss in der Garage.",
      "<strong>TI SimpleLink / NXP RW612</strong>: leistungsfähige WLAN-SDKs in C, aber eine kleinere Bastler-Community als Nucleo + Zephyr.",
      '<strong>CH32V307</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Onboard-Ethernet</a> (QingKe RISC-V, dasselbe TLS-Relay im LAN).',
    ],
  },
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Geräte hinzufügen</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Datenübertragung mit dem Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Datenübertragung mit CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Teileliste für das ESP32-Frost-Kit</a>',
      '<a class="text-link" href="/about/python-feeds">HTTPS-Relay in Python</a>',
      `${allSketchesOpen}Alle Sketches ↗</a>`,
    ],
  },
};

export default de;
