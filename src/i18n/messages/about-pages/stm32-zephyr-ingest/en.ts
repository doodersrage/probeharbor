
/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;

const en = {
  intro1Html:
    "ESP32 and Pico W cover Wi‑Fi. If you want a different silicon vendor and a toolchain that is neither Arduino nor Python, an <strong>ST Nucleo-F767ZI</strong> running <strong>Zephyr</strong> POSTs the same ingest JSON over onboard Ethernet. C, <code>west</code>, ST-LINK. The Arduino-compatible header is only a pinout: the firmware is not an Arduino sketch.",
  intro2Html:
    'Native HTTPS on Zephyr means baking a CDN CA into the image, which breaks when the edge certificate chain rotates. This sample uses the same LAN HTTP→HTTPS relay as the <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> path, so Cloudflare can change CAs without a reflash.',
  parts: {
    title: "Parts",
    caption: "Parts for an STM32 Zephyr freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardWhy: "Cortex-M7, onboard Ethernet MAC + PHY, ST-LINK debugger. No Wi‑Fi module.",
    probePart: "Waterproof DS18B20",
    probeWhyHtml: "Pipe / crawlspace probe. Data on Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "4.7kΩ resistor",
    resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from the 5V Arduino pin.",
    amazonResistor: "Amazon 4.7k",
    ethernetPart: "Ethernet drop",
    ethernetWhy: "DHCP on your LAN. A Pi, NAS, or laptop runs the TLS relay.",
    ethernetBuy: "Any Cat5e patch cable to your switch.",
  },
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4.7k to 3.3V",
    "RJ45 → LAN. ST-LINK USB for flash and 115200 serial.",
  ],
  build: {
    title: "Build and flash",
    step1Html:
      'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>Zephyr main.c</strong> (ingest path filled in), or copy the defines from the ingest callout.',
    relayLabel: "On a LAN host:",
    step3Html:
      "Set <code>INGEST_HOST</code> to that machine. Drop the downloaded file over <code>src/main.c</code> if you want the path baked in.",
    westLabel: "From a Zephyr workspace:",
    step5Html:
      "Serial 115200: <code>dhcp ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST.",
    repoHtml: `Repo app: ${repoApp} (<code>prj.conf</code>, D4 overlay, CMake).`,
  },
  otherBoardsTitle: "Other STM32 boards",
  otherBoardsHtml:
    "Any Zephyr Ethernet target can run the same C if you add a 1-Wire overlay for your GPIO. Nucleo-F429ZI and Nucleo-H743ZI are the usual cousins. A Blue Pill plus W5500 is C as well, but that is Cube HAL + ioLibrary, not this Zephyr app: use the LAN relay the same way.",
  whyNot: {
    title: "Why not Nordic / TI first?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth or Thread, not native Wi‑Fi HTTPS.",
      "<strong>nRF9160</strong>: LTE-M works, but a SIM and carrier plan is a worse first freeze kit than a garage Ethernet drop.",
      "<strong>TI SimpleLink / NXP RW612</strong>: capable Wi‑Fi C SDKs, smaller hobbyist footprint than Nucleo + Zephyr.",
      '<strong>CH32V307</strong> is first-class now: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + onboard Ethernet</a> (QingKe RISC-V, same LAN TLS relay).',
    ],
  },
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adding devices</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Raspberry Pi Pico W ingest</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V ingest</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit parts list</a>',
      '<a class="text-link" href="/about/python-feeds">Python HTTPS relay</a>',
      `${allSketchesOpen}All sketches ↗</a>`,
    ],
  },
};

export type Stm32ZephyrIngestMessages = typeof en;
export default en;
