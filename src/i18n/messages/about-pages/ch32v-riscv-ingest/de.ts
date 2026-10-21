
/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "ESP32, Pico W und STM32 decken Arm und Xtensa ab. Wenn du eine <strong>QingKe-RISC-V</strong>-Sonde willst, die weder Arduino noch Python noch Zephyr ist, sendet ein <strong>CH32V307V-EVT-R1</strong> mit <strong>WCHNET C</strong> dasselbe Ingest-JSON per POST über das integrierte 10M-Ethernet. MounRiver Studio, WCH-Link. Kein WLAN-Modul.",
  relayHtml:
    'WCHNET ist IPv4-TCP ohne gepflegten TLS-Client. Dieses Beispiel nutzt dasselbe HTTP→HTTPS-Relay im LAN wie <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> und <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, damit Cloudflare die Zertifizierungsstellen wechseln kann, ohne dass du neu flashen musst.',
  partsTitle: "Teile",
  partsCaption: "Teile für eine CH32V-RISC-V-Frostsonde",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  boardWhy: "QingKe RISC-V, integrierter 10M-PHY + RJ45, WCH-Link. Der Gigabit-MAC bleibt hier ungenutzt.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Sonde für Rohr oder Kriechkeller. Daten an <strong>PB12</strong>.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3.3V. Versorge die Sonde nicht mit 5V.",
  ethernetPart: "Ethernet-Anschluss",
  ethernetWhy: "DHCP in deinem LAN. Ein Pi, NAS oder Laptop betreibt das TLS-Relay.",
  ethernetBuy: "Ein beliebiges Cat5e-Patchkabel zu deinem Switch.",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>PB12</strong>, 4.7k auf 3.3V",
    "RJ45 → LAN. WCH-Link-USB zum Flashen und für die serielle Ausgabe mit 115200.",
  ],
  buildTitle: "Bauen und flashen",
  stepDownloadHtml:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>CH32V main.c</strong> herunter (Ingest-Pfad bereits eingetragen), oder kopiere die Defines aus dem Ingest-Hinweis.',
  stepRelayLead: "Auf einem Rechner im LAN:",
  stepHostHtml:
    "Setze <code>INGEST_HOST</code> auf diesen Rechner (IPv4 in Punktnotation). Ersetze <code>User/main.c</code> durch die heruntergeladene Datei.",
  stepMounriverHtml: `Installiere <a class="text-link" href="{mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Öffne das offizielle Projekt <a class="text-link" href="{evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, behalte NetLib / <code>eth_driver</code>, ersetze nur <code>User/main.c</code>, baue und flashe.`,
  stepSerialHtml:
    "Seriell mit 115200: <code>dhcp ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST übernommen.",
  repoLead: "Fertige Dateien im Repo:",
  repoNote: "(Bit-Bang-1-Wire an PB12 + WCHNET-HTTP-Client).",
  otherTitle: "Andere CH32V-Boards",
  other:
    "Jeder CH32V307 mit dem Ethernet-PHY des EVT kann diesen C-Code ausführen. CH32V203 / CH32V003 haben keinen Ethernet-MAC. Es gibt Community-Cores für Arduino-CH32, aber die gehören nicht zu diesem Beispiel. Ein CH32V307 mit W5500 ist möglich, dann bist du aber wieder bei ioLibrary über SPI statt beim integrierten MAC.",
  whyNotTitle: "Warum nicht als Nächstes nRF oder TI?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth oder Thread, kein natives HTTPS über WLAN.",
    "<strong>nRF7002 DK</strong>: Nordics Wi‑Fi 6 funktioniert im nRF Connect SDK, aber das Pinnen von TLS-Zertifizierungsstellen unter Zephyr bleibt eine Wartungsfalle.",
    "<strong>TI SimpleLink / NXP RW612</strong>: leistungsfähige WLAN-SDKs in C, aber in der Bastlerszene weniger verbreitet als EVT + WCHNET.",
  ],
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    stm32: "Ingest mit STM32 Zephyr",
    pico: "Ingest mit Raspberry Pi Pico W",
    relay: "HTTPS-Relay in Python",
    avr: "Ingest in AVR-Assembler",
    allSketches: "Alle Sketches ↗",
  },
};

export default de;
