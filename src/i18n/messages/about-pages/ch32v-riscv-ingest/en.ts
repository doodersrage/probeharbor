
/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */

const en = {
  introHtml:
    "ESP32, Pico W, and STM32 cover Arm and Xtensa. If you want a <strong>QingKe RISC-V</strong> probe that is neither Arduino nor Python nor Zephyr, a <strong>CH32V307V-EVT-R1</strong> running <strong>WCHNET C</strong> POSTs the same ingest JSON over onboard 10M Ethernet. MounRiver Studio, WCH-Link. No Wi‑Fi module.",
  relayHtml:
    'WCHNET is IPv4 TCP without a maintained TLS client. This sample uses the same LAN HTTP→HTTPS relay as <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> and <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, so Cloudflare can change CAs without a reflash.',
  partsTitle: "Parts",
  partsCaption: "Parts for a CH32V RISC-V freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boardWhy: "QingKe RISC-V, onboard 10M PHY + RJ45, WCH-Link. Gigabit MAC is unused here.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Pipe / crawlspace probe. Data on <strong>PB12</strong>.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from 5V.",
  ethernetPart: "Ethernet drop",
  ethernetWhy: "DHCP on your LAN. A Pi, NAS, or laptop runs the TLS relay.",
  ethernetBuy: "Any Cat5e patch cable to your switch.",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>PB12</strong>, 4.7k to 3.3V",
    "RJ45 → LAN. WCH-Link USB for flash and 115200 serial.",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>CH32V main.c</strong> (ingest path filled in), or copy the defines from the ingest callout.',
  stepRelayLead: "On a LAN host:",
  stepHostHtml:
    "Set <code>INGEST_HOST</code> to that machine (dotted IPv4). Drop the downloaded file over <code>User/main.c</code>.",
  stepMounriverHtml: `Install <a class="text-link" href="{mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Open the official <a class="text-link" href="{evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a> project, keep NetLib / <code>eth_driver</code>, replace only <code>User/main.c</code>, build, flash.`,
  stepSerialHtml:
    "Serial 115200: <code>dhcp ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST.",
  repoLead: "Repo drop-in:",
  repoNote: "(bit-bang 1-Wire on PB12 + WCHNET HTTP client).",
  otherTitle: "Other CH32V boards",
  other:
    "Any CH32V307 with the EVT Ethernet PHY can run this C. CH32V203 / CH32V003 do not have the Ethernet MAC. Community Arduino-CH32 cores exist; they are not this sample. A CH32V307 plus W5500 is possible, but then you are back to SPI ioLibrary instead of the onboard MAC.",
  whyNotTitle: "Why not nRF / TI next?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth or Thread, not native Wi‑Fi HTTPS.",
    "<strong>nRF7002 DK</strong>: Nordic Wi‑Fi 6 works in nRF Connect SDK, but TLS CA pinning on Zephyr is still a maintenance trap.",
    "<strong>TI SimpleLink / NXP RW612</strong>: capable Wi‑Fi C SDKs, smaller hobbyist footprint than EVT + WCHNET.",
  ],
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    stm32: "STM32 Zephyr ingest",
    pico: "Raspberry Pi Pico W ingest",
    relay: "Python HTTPS relay",
    avr: "AVR assembly ingest",
    allSketches: "All sketches ↗",
  },
};

export type Messages = typeof en;
export default en;
