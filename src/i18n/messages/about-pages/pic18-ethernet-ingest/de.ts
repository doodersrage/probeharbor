
/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Der Microchip <strong>PIC18F67J60</strong> hat einen integrierten Ethernet-MAC und einen 10BASE-T-PHY. Dieses Beispiel ist C mit <strong>MPLAB X + XC8</strong> auf dem klassischen Microchip TCP/IP Stack (MLA-Ethernet-Demo), also weder Arduino noch Python noch Zephyr. Dasselbe Ingest-JSON über das HTTP→HTTPS-Relay im LAN.",
  relayHtml:
    'Der MLA-Stack bringt keinen gepflegten HTTPS-Client für Cloudflare mit. Lass den MCU per HTTP mit einem Relay auf einem Pi oder NAS sprechen, nach demselben Muster wie <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> und <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Teile",
  partsCaption: "Teile für eine PIC18-Ethernet-Frostsonde",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  boardPart: "PIC18F67J60-Board",
  boardWhy: "Integrierter MAC + PHY + RJ45. PICkit / ICD zum Flashen.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Standard-Pin im Beispiel: <strong>RD0</strong> (ändern, falls deine Demo ihn belegt).",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up auf die 1-Wire-VDD des Boards (Pegelwandler nutzen, wenn die IOs nur 5V können).",
  ethernetPart: "Ethernet-Anschluss",
  ethernetWhy: "DHCP oder statische IP in der MLA-Demo. Relay-Rechner im selben LAN.",
  ethernetBuy: "Cat5e-Kabel zu deinem Switch.",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Logik-VDD des Boards (oft 3.3V; prüfe den Schaltplan der Demo)",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>RD0</strong>, 4.7k-Pull-up (bei Bedarf die <code>OW_*</code>-Makros anpassen)",
    "RJ45 → LAN. PICkit zum Flashen; UART für Logs mit 115200",
  ],
  buildTitle: "Bauen und flashen",
  stepDownloadHtml:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>PIC18 main.c</strong> herunter (Ingest-Pfad bereits eingetragen).',
  stepRelayLead: "Auf einem Rechner im LAN:",
  stepHostHtml: "Setze <code>INGEST_HOST</code> auf diesen Rechner (IPv4 in Punktnotation).",
  stepMplabHtml: `Installiere <a class="text-link" href="{mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Öffne eine MLA-TCPIP-Ethernet-Demo für den PIC18F67J60, behalte die Stack-Quellen, füge dieses Modul hinzu, rufe <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> in der Hauptschleife der Demo neben <code>StackTask()</code> auf, baue und flashe.`,
  stepSerialHtml:
    "UART mit 115200: Link/DHCP ok, dann POST über das Relay. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST übernommen.",
  repoLead: "Fertige Dateien im Repo:",
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    teensy: "Ingest mit Teensy 4.1",
    ch32v: "Ingest mit CH32V RISC-V",
    stm32: "Ingest mit STM32 Zephyr",
    relay: "HTTPS-Relay in Python",
  },
};

export default de;
