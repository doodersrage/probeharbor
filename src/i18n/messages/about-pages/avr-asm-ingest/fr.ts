
/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    'Presque aucune sonde antigel Ethernet n’<strong>exige</strong> l’assembleur. PADAUK, PIC10F et ATtiny10 se programment d’abord (voire uniquement, en pratique) en assembleur, mais ils n’ont ni pile TCP ni assez de RAM pour envoyer du JSON en POST. La voie que nous pouvons vraiment prendre en charge, c’est l’<strong>assembleur GNU AVR</strong> sur un Arduino <strong>Uno / ATmega328P</strong> avec un shield Ethernet <strong>W5100</strong> : le même matériel de garage que <a class="text-link" href="/about/arduino-sketches">Uno Ethernet</a>, sans Arduino C.',
  relay: "Le W5100 ne gère pas TLS. Cet exemple utilise le même relais HTTP→HTTPS sur le LAN que Uno en C, STM32 Zephyr et CH32V WCHNET.",
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel en assembleur AVR",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  unoWhyHtml: "AVR à 16 MHz. Programmé avec <code>avr-gcc</code> / <code>avrdude</code>, pas avec l’Arduino IDE.",
  shieldPart: "Shield Ethernet W5100",
  shieldWhy: "Puce de sockets en SPI. Le même shield que l’exemple Arduino Ethernet DHT22.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Données sur <strong>D7</strong>. N’utilisez pas D4 : le shield s’en sert comme chip-select de la carte SD.",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up de la ligne de données du DS18B20 vers 5V (l’Uno est une carte 5V).",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>D7</strong> (PD7), 4.7k vers 5V",
    "Shield Ethernet enfiché sur l’Uno. RJ45 → LAN. USB pour le flash et la liaison série à 115200.",
  ],
  buildTitle: "Compiler et flasher",
  stepDownloadHtml:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>AVR main.S</strong> (chemin d’ingestion déjà renseigné), ou copiez l’extrait <code>ingest_path</code> depuis l’encadré d’ingestion.',
  stepRelayLead: "Sur une machine du LAN :",
  stepHostHtml:
    "Réglez <code>ingest_ip</code> / <code>ingest_port</code> et la chaîne de l’en-tête Host sur cette machine. L’IP statique de l’Uno est <code>192.168.1.177</code> dans <code>net_cfg</code>.",
  stepAssembleHtml:
    "Ou assemblez le <code>main.S</code> téléchargé avec les mêmes options <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Série à 115200 : <code>link ok</code>, puis <code>POST 200</code>. La clé de capteur <code>temp1</code> est importée au premier POST (°F entier).",
  repoLead: "Dans le dépôt :",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "Ce que nous n’ajouterons pas",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong> : conçus pour l’assembleur, mais sans Ethernet et avec trop peu de RAM pour HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong> : une vraie culture de l’assembleur, mais les extensions Ethernet varient et il n’existe pas de shield de référence pour le garage.",
    "<strong>PIC18F67J60</strong> : Ethernet intégré, mais la pile TCP de Microchip est en C, pas en MPASM.",
    "<strong>Wi‑Fi nRF / TI en assembleur Thumb</strong> : les SDK sont en C. Écrire TLS à la main en assembleur n’a pas sa place dans un kit antigel.",
  ],
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    arduino: "Arduino Ethernet (C)",
    ch32v: "Ingestion CH32V RISC-V",
    stm32: "Ingestion STM32 Zephyr",
    relay: "Relais HTTPS en Python",
  },
};

export default fr;
