
/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */

const en = {
  introHtml:
    'Almost no Ethernet freeze probe <strong>requires</strong> assembly. PADAUK, PIC10F, and ATtiny10 are assembly-first (or assembly-only in practice), but they do not have a TCP stack or the RAM to POST JSON. The path we can actually support is <strong>GNU AVR assembly</strong> on an Arduino <strong>Uno / ATmega328P</strong> plus a <strong>W5100</strong> Ethernet shield: the same garage hardware as <a class="text-link" href="/about/arduino-sketches">Uno Ethernet</a>, without Arduino C.',
  relay: "W5100 cannot TLS. This sample uses the same LAN HTTP→HTTPS relay as Uno C, STM32 Zephyr, and CH32V WCHNET.",
  partsTitle: "Parts",
  partsCaption: "Parts for an AVR assembly freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  unoWhyHtml: "16 MHz AVR. Programmed with <code>avr-gcc</code> / <code>avrdude</code>, not the Arduino IDE.",
  shieldPart: "W5100 Ethernet shield",
  shieldWhy: "SPI socket chip. Same shield as the Arduino Ethernet DHT22 sample.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Data on <strong>D7</strong>. Do not use D4: the shield uses D4 as SD chip-select.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 5V (Uno is a 5V board).",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>D7</strong> (PD7), 4.7k to 5V",
    "Ethernet shield seated on the Uno. RJ45 → LAN. USB for flash and 115200 serial.",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>AVR main.S</strong> (ingest path filled in), or copy the <code>ingest_path</code> snippet from the ingest callout.',
  stepRelayLead: "On a LAN host:",
  stepHostHtml:
    "Set <code>ingest_ip</code> / <code>ingest_port</code> and the Host header string to that machine. Static Uno IP is <code>192.168.1.177</code> in <code>net_cfg</code>.",
  stepAssembleHtml:
    "Or assemble the downloaded <code>main.S</code> with the same <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code> flags.",
  stepSerialHtml:
    "Serial 115200: <code>link ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST (integer °F).",
  repoLead: "Repo listing:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "What we are not adding",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: assembly-first, but no Ethernet and too little RAM for HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: real assembly culture, but Ethernet add-ons vary and there is no one garage shield.",
    "<strong>PIC18F67J60</strong>: onboard Ethernet, but Microchip’s TCP stack is C, not MPASM.",
    "<strong>nRF / TI Wi‑Fi in Thumb asm</strong>: the SDKs are C. Hand-written TLS in assembly is not a freeze-kit path.",
  ],
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    arduino: "Arduino Ethernet (C)",
    ch32v: "CH32V RISC-V ingest",
    stm32: "STM32 Zephyr ingest",
    relay: "Python HTTPS relay",
  },
};

export type Messages = typeof en;
export default en;
