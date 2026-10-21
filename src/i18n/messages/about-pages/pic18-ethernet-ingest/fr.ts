
/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "Le Microchip <strong>PIC18F67J60</strong> intègre une MAC Ethernet et un PHY 10BASE-T. Cet exemple est écrit en C avec <strong>MPLAB X + XC8</strong> sur la Microchip TCP/IP Stack classique (démo Ethernet MLA) : ni Arduino, ni Python, ni Zephyr. Le même JSON d’ingestion via le relais HTTP→HTTPS du LAN.",
  relayHtml:
    'La pile MLA ne fournit pas de client HTTPS maintenu pour Cloudflare. Laissez le MCU en HTTP vers un relais sur un Raspberry Pi ou un NAS, selon le même principe que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> et <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel PIC18 en Ethernet",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  boardPart: "Carte PIC18F67J60",
  boardWhy: "MAC + PHY + RJ45 intégrés. PICkit / ICD pour le flash.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Broche par défaut de l’exemple : <strong>RD0</strong> (à changer si votre démo l’utilise).",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up vers le VDD 1-Wire de la carte (adaptez les niveaux si les E/S sont uniquement en 5V).",
  ethernetPart: "Prise Ethernet",
  ethernetWhy: "DHCP ou IP statique dans la démo MLA. Machine relais sur le même LAN.",
  ethernetBuy: "Câble Cat5e jusqu’à votre switch.",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → VDD logique de la carte (souvent 3.3V ; vérifiez le schéma de la démo)",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>RD0</strong>, pull-up 4.7k (modifiez les macros <code>OW_*</code> si besoin)",
    "RJ45 → LAN. PICkit pour le flash ; UART pour les journaux à 115200",
  ],
  buildTitle: "Compiler et flasher",
  stepDownloadHtml:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>PIC18 main.c</strong> (chemin d’ingestion déjà renseigné).',
  stepRelayLead: "Sur une machine du LAN :",
  stepHostHtml: "Réglez <code>INGEST_HOST</code> sur cette machine (IPv4 en notation pointée).",
  stepMplabHtml: `Installez <a class="text-link" href="{mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Ouvrez une démo Ethernet TCPIP MLA pour PIC18F67J60, gardez les sources de la pile, ajoutez ce module, appelez <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> depuis la boucle principale de la démo à côté de <code>StackTask()</code>, compilez, flashez.`,
  stepSerialHtml:
    "UART à 115200 : lien/DHCP ok, puis POST via le relais. La clé de capteur <code>temp1</code> est importée au premier POST.",
  repoLead: "Prêt à déposer dans le dépôt :",
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    teensy: "Ingestion Teensy 4.1",
    ch32v: "Ingestion CH32V RISC-V",
    stm32: "Ingestion STM32 Zephyr",
    relay: "Relais HTTPS en Python",
  },
};

export default fr;
