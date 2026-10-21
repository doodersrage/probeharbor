
/** Body copy for /about/teensy41-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Der PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) mit dem offiziellen Ethernet-Kit ist eine schnelle Cortex-M7-Garagensonde mit <strong>Teensyduino + QNEthernet</strong>, ganz ohne STM32-Zephyr-Toolchain oder WCH MounRiver. DS18B20 an Pin 4 → <code>temp1</code>. HTTP zum TLS-Relay im LAN, beim Thema Zertifizierungsstellen genau wie bei Uno Ethernet.",
  partsTitle: "Teile",
  partsCaption: "Teile für eine Frostsonde mit Teensy 4.1",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  teensyWhy: "M7 mit 600 MHz, Flashen per USB, integrierter Ethernet-MAC (braucht das Magnetics-Kit).",
  kitPart: "Ethernet-Kit / MagJack",
  kitWhy: "Übertrager + RJ45, verdrahtet nach der Ethernet-Doku von PJRC für den Teensy 4.1.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Daten an <strong>Pin 4</strong>, 4.7k auf 3.3V.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "1-Wire-Pull-up auf 3.3V.",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>Pin 4</strong>, 4.7k auf 3.3V",
    "Ethernet-Kit → LAN. USB zum Flashen mit Teensyduino und für Serial mit 115200",
  ],
  buildTitle: "Bauen und flashen",
  stepDownloadHtml:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>Teensy 4.1 .ino</strong> herunter (Ingest-Pfad bereits eingetragen).',
  stepRelayLead: "Auf einem Rechner im LAN:",
  stepInstallHtml: `Installiere Teensyduino. Füge <a class="text-link" href="{qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> und <code>DallasTemperature</code> hinzu. Setze <code>INGEST_HOST</code> und flashe.`,
  stepSerialHtml:
    "Seriell mit 115200: <code>link ok</code>, <code>dhcp ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST übernommen.",
  repoLead: "Im Repo:",
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    pic18: "Ingest mit PIC18F67J60",
    stm32: "Ingest mit STM32 Zephyr",
    cellular: "Mobilfunk (Particle Boron)",
    relay: "HTTPS-Relay in Python",
  },
};

export default de;
