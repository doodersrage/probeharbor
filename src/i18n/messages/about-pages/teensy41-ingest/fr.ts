
/** Body copy for /about/teensy41-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "La PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) avec le kit Ethernet officiel fait une sonde de garage rapide en Cortex-M7 sous <strong>Teensyduino + QNEthernet</strong> : ni outillage STM32 Zephyr, ni WCH MounRiver. DS18B20 sur la broche 4 → <code>temp1</code>. HTTP vers le relais TLS du LAN, même approche pour les autorités de certification qu’avec l’Uno Ethernet.",
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel Teensy 4.1",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  teensyWhy: "M7 à 600 MHz, flash en USB, MAC Ethernet intégrée (nécessite le kit magnétique).",
  kitPart: "Kit Ethernet / MagJack",
  kitWhy: "Transformateurs + RJ45 câblés selon la documentation Ethernet PJRC de la Teensy 4.1.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Données sur la <strong>broche 4</strong>, 4.7k vers 3.3V.",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up 1-Wire vers 3.3V.",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>broche 4</strong>, 4.7k vers 3.3V",
    "Kit Ethernet → LAN. USB pour le flash Teensyduino et la liaison série à 115200",
  ],
  buildTitle: "Compiler et flasher",
  stepDownloadHtml:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>Teensy 4.1 .ino</strong> (chemin d’ingestion déjà renseigné).',
  stepRelayLead: "Sur une machine du LAN :",
  stepInstallHtml: `Installez Teensyduino. Ajoutez <a class="text-link" href="{qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> et <code>DallasTemperature</code>. Réglez <code>INGEST_HOST</code>, flashez.`,
  stepSerialHtml:
    "Série à 115200 : <code>link ok</code>, <code>dhcp ok</code>, puis <code>POST 200</code>. La clé de capteur <code>temp1</code> est importée au premier POST.",
  repoLead: "Dans le dépôt :",
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    pic18: "Ingestion PIC18F67J60",
    stm32: "Ingestion STM32 Zephyr",
    cellular: "Réseau mobile (Particle Boron)",
    relay: "Relais HTTPS en Python",
  },
};

export default fr;
