
/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "ESP32, Pico W et STM32 couvrent Arm et Xtensa. Si vous voulez une sonde <strong>QingKe RISC-V</strong> qui ne soit ni Arduino, ni Python, ni Zephyr, une <strong>CH32V307V-EVT-R1</strong> sous <strong>WCHNET C</strong> envoie en POST le même JSON d’ingestion via son Ethernet 10M intégré. MounRiver Studio, WCH-Link. Pas de module Wi‑Fi.",
  relayHtml:
    'WCHNET fait du TCP sur IPv4 sans client TLS maintenu. Cet exemple utilise le même relais HTTP→HTTPS sur le LAN que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> et <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a> : Cloudflare peut ainsi changer d’autorité de certification sans reflasher la carte.',
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel CH32V RISC-V",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  boardWhy: "QingKe RISC-V, PHY 10M + RJ45 intégrés, WCH-Link. La MAC Gigabit n’est pas utilisée ici.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Sonde pour tuyau ou vide sanitaire. Données sur <strong>PB12</strong>.",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up de la ligne de données du DS18B20 vers 3.3V. N’alimentez pas la sonde en 5V.",
  ethernetPart: "Prise Ethernet",
  ethernetWhy: "DHCP sur votre LAN. Un Raspberry Pi, un NAS ou un ordinateur portable fait tourner le relais TLS.",
  ethernetBuy: "N’importe quel câble réseau Cat5e jusqu’à votre switch.",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>PB12</strong>, 4.7k vers 3.3V",
    "RJ45 → LAN. USB du WCH-Link pour le flash et la liaison série à 115200.",
  ],
  buildTitle: "Compiler et flasher",
  stepDownloadHtml:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>CH32V main.c</strong> (chemin d’ingestion déjà renseigné), ou copiez les defines depuis l’encadré d’ingestion.',
  stepRelayLead: "Sur une machine du LAN :",
  stepHostHtml:
    "Réglez <code>INGEST_HOST</code> sur cette machine (IPv4 en notation pointée). Remplacez <code>User/main.c</code> par le fichier téléchargé.",
  stepMounriverHtml: `Installez <a class="text-link" href="{mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Ouvrez le projet officiel <a class="text-link" href="{evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, gardez NetLib / <code>eth_driver</code>, remplacez uniquement <code>User/main.c</code>, compilez, flashez.`,
  stepSerialHtml:
    "Série à 115200 : <code>dhcp ok</code>, puis <code>POST 200</code>. La clé de capteur <code>temp1</code> est importée au premier POST.",
  repoLead: "Prêt à déposer dans le dépôt :",
  repoNote: "(1-Wire en bit-bang sur PB12 + client HTTP WCHNET).",
  otherTitle: "Autres cartes CH32V",
  other:
    "Tout CH32V307 doté du PHY Ethernet de l’EVT peut exécuter ce code C. Les CH32V203 / CH32V003 n’ont pas de MAC Ethernet. Il existe des cores communautaires Arduino-CH32, mais ce n’est pas cet exemple. Un CH32V307 avec un W5500 est possible, mais vous revenez alors à ioLibrary en SPI au lieu de la MAC intégrée.",
  whyNotTitle: "Pourquoi pas nRF ou TI ensuite ?",
  whyNotHtml: [
    "<strong>nRF52</strong> : Bluetooth ou Thread, pas de HTTPS natif en Wi‑Fi.",
    "<strong>nRF7002 DK</strong> : le Wi‑Fi 6 de Nordic fonctionne dans nRF Connect SDK, mais l’épinglage des AC TLS sous Zephyr reste un piège de maintenance.",
    "<strong>TI SimpleLink / NXP RW612</strong> : SDK Wi‑Fi en C performants, mais bien moins répandus chez les amateurs qu’EVT + WCHNET.",
  ],
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    stm32: "Ingestion STM32 Zephyr",
    pico: "Ingestion Raspberry Pi Pico W",
    relay: "Relais HTTPS en Python",
    avr: "Ingestion en assembleur AVR",
    allSketches: "Tous les sketches ↗",
  },
};

export default fr;
