
/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */

const en = {
  introHtml:
    "Microchip <strong>PIC18F67J60</strong> has an onboard Ethernet MAC and 10BASE-T PHY. This sample is <strong>MPLAB X + XC8</strong> C on the classic Microchip TCP/IP Stack (MLA Ethernet demo)—not Arduino, not Python, not Zephyr. Same ingest JSON over the LAN HTTP→HTTPS relay.",
  relayHtml:
    'The MLA stack does not ship a maintained HTTPS client for Cloudflare. Keep the MCU on HTTP to a Pi/NAS relay, same pattern as <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> and <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Parts",
  partsCaption: "Parts for a PIC18 Ethernet freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boardPart: "PIC18F67J60 board",
  boardWhy: "Onboard MAC + PHY + RJ45. PICkit / ICD for flash.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Default sample pin <strong>RD0</strong> (change if your demo uses it).",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up to the board’s 1-Wire VDD (level-shift if IO is 5V-only).",
  ethernetPart: "Ethernet drop",
  ethernetWhy: "DHCP or static IP in the MLA demo. Relay host on the same LAN.",
  ethernetBuy: "Cat5e to your switch.",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → board logic VDD (often 3.3V; check the demo schematic)",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>RD0</strong>, 4.7k pull-up (edit <code>OW_*</code> macros if needed)",
    "RJ45 → LAN. PICkit for flash; UART for 115200 logs",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>PIC18 main.c</strong> (ingest path filled in).',
  stepRelayLead: "On a LAN host:",
  stepHostHtml: "Set <code>INGEST_HOST</code> to that machine (dotted IPv4).",
  stepMplabHtml: `Install <a class="text-link" href="{mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Open an MLA TCPIP Ethernet demo for PIC18F67J60, keep stack sources, add this module, call <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> from the demo main loop next to <code>StackTask()</code>, build, flash.`,
  stepSerialHtml:
    "UART 115200: link/DHCP ok, then POST through the relay. Sensor key <code>temp1</code> imports on first POST.",
  repoLead: "Repo drop-in:",
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    teensy: "Teensy 4.1 ingest",
    ch32v: "CH32V RISC-V ingest",
    stm32: "STM32 Zephyr ingest",
    relay: "Python HTTPS relay",
  },
};

export type Messages = typeof en;
export default en;
