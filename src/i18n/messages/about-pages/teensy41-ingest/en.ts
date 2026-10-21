
/** Body copy for /about/teensy41-ingest. Hrefs stay English; middleware localizes them. */

const en = {
  introHtml:
    "PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) with the official Ethernet kit is a fast Cortex-M7 garage probe in <strong>Teensyduino + QNEthernet</strong>—not STM32 Zephyr tooling, not WCH MounRiver. DS18B20 on pin 4 → <code>temp1</code>. HTTP to the LAN TLS relay, same CA story as Uno Ethernet.",
  partsTitle: "Parts",
  partsCaption: "Parts for a Teensy 4.1 freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  teensyWhy: "600 MHz M7, USB flash, onboard Ethernet MAC (needs magnetics kit).",
  kitPart: "Ethernet kit / MagJack",
  kitWhy: "Magnetics + RJ45 wired per PJRC Teensy 4.1 Ethernet docs.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Data on <strong>pin 4</strong>, 4.7k to 3.3V.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "1-Wire pull-up to 3.3V.",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>pin 4</strong>, 4.7k to 3.3V",
    "Ethernet kit → LAN. USB for Teensyduino flash and Serial 115200",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>Teensy 4.1 .ino</strong> (ingest path filled in).',
  stepRelayLead: "On a LAN host:",
  stepInstallHtml: `Install Teensyduino. Add <a class="text-link" href="{qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code>, <code>DallasTemperature</code>. Set <code>INGEST_HOST</code>, flash.`,
  stepSerialHtml:
    "Serial 115200: <code>link ok</code>, <code>dhcp ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST.",
  repoLead: "Repo listing:",
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    pic18: "PIC18F67J60 ingest",
    stm32: "STM32 Zephyr ingest",
    cellular: "Cellular (Particle Boron)",
    relay: "Python HTTPS relay",
  },
};

export type Messages = typeof en;
export default en;
