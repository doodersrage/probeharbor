
/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    'Kaum eine Ethernet-Frostsonde <strong>erfordert</strong> Assembler. PADAUK, PIC10F und ATtiny10 werden vorrangig (oder praktisch nur) in Assembler programmiert, haben aber weder einen TCP-Stack noch genug RAM, um JSON per POST zu senden. Was wir tatsächlich unterstützen können, ist <strong>GNU-AVR-Assembler</strong> auf einem Arduino <strong>Uno / ATmega328P</strong> mit einem <strong>W5100</strong>-Ethernet-Shield: dieselbe Garagenhardware wie bei <a class="text-link" href="/about/arduino-sketches">Uno Ethernet</a>, nur ohne Arduino-C.',
  relay: "Der W5100 beherrscht kein TLS. Dieses Beispiel nutzt dasselbe HTTP→HTTPS-Relay im LAN wie Uno in C, STM32 Zephyr und CH32V WCHNET.",
  partsTitle: "Teile",
  partsCaption: "Teile für eine Frostsonde in AVR-Assembler",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  unoWhyHtml: "AVR mit 16 MHz. Programmiert mit <code>avr-gcc</code> / <code>avrdude</code>, nicht mit der Arduino IDE.",
  shieldPart: "W5100-Ethernet-Shield",
  shieldWhy: "Socket-Chip über SPI. Dasselbe Shield wie im Beispiel Arduino Ethernet DHT22.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Daten an <strong>D7</strong>. Nicht D4 verwenden: Das Shield nutzt D4 als Chip-Select für die SD-Karte.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 5V (der Uno ist ein 5V-Board).",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>D7</strong> (PD7), 4.7k auf 5V",
    "Ethernet-Shield auf den Uno gesteckt. RJ45 → LAN. USB zum Flashen und für die serielle Ausgabe mit 115200.",
  ],
  buildTitle: "Bauen und flashen",
  stepDownloadHtml:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>AVR main.S</strong> herunter (Ingest-Pfad bereits eingetragen), oder kopiere das <code>ingest_path</code>-Snippet aus dem Ingest-Hinweis.',
  stepRelayLead: "Auf einem Rechner im LAN:",
  stepHostHtml:
    "Setze <code>ingest_ip</code> / <code>ingest_port</code> und den Host-Header-String auf diesen Rechner. Die statische IP des Uno ist <code>192.168.1.177</code> in <code>net_cfg</code>.",
  stepAssembleHtml:
    "Oder assembliere die heruntergeladene <code>main.S</code> mit denselben Flags <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Seriell mit 115200: <code>link ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST übernommen (ganzzahlige °F).",
  repoLead: "Im Repo:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "Was wir nicht aufnehmen",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: auf Assembler ausgelegt, aber ohne Ethernet und mit zu wenig RAM für HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: echte Assembler-Kultur, aber Ethernet-Erweiterungen sind uneinheitlich, und es gibt nicht das eine Garagen-Shield.",
    "<strong>PIC18F67J60</strong>: integriertes Ethernet, aber Microchips TCP-Stack ist in C geschrieben, nicht in MPASM.",
    "<strong>nRF / TI WLAN in Thumb-Assembler</strong>: Die SDKs sind in C. Handgeschriebenes TLS in Assembler ist kein Weg für ein Frost-Kit.",
  ],
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    arduino: "Arduino Ethernet (C)",
    ch32v: "Ingest mit CH32V RISC-V",
    stm32: "Ingest mit STM32 Zephyr",
    relay: "HTTPS-Relay in Python",
  },
};

export default de;
