
/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { Stm32ZephyrIngestMessages } from "./en";

const fr: Stm32ZephyrIngestMessages = {
  intro1Html:
    "L’ESP32 et le Pico W couvrent le Wi‑Fi. Si vous voulez un autre fondeur et une chaîne d’outils qui ne soit ni Arduino ni Python, une <strong>ST Nucleo-F767ZI</strong> sous <strong>Zephyr</strong> envoie en POST le même JSON d’ingestion via son Ethernet intégré. C, <code>west</code>, ST-LINK. Le connecteur compatible Arduino n’est qu’un brochage : le firmware n’est pas un sketch Arduino.",
  intro2Html:
    'Faire du HTTPS natif sous Zephyr implique d’embarquer une CA du CDN dans l’image, ce qui casse dès que la chaîne de certificats de l’edge change. Cet exemple utilise le même relais HTTP→HTTPS sur le LAN que la solution <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> : Cloudflare peut ainsi changer de CA sans reflashage.',
  parts: {
    title: "Pièces",
    caption: "Pièces pour une sonde antigel STM32 sous Zephyr",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet intégrés, débogueur ST-LINK. Pas de module Wi‑Fi.",
    probePart: "DS18B20 étanche",
    probeWhyHtml: "Sonde pour tuyau ou vide sanitaire. Donnée sur la broche Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Résistance de 4,7 kΩ",
    resistorWhy: "Pull-up entre la donnée du DS18B20 et le 3,3 V. N’alimentez pas la sonde depuis la broche 5 V Arduino.",
    amazonResistor: "4,7k sur Amazon",
    ethernetPart: "Prise Ethernet",
    ethernetWhy: "DHCP sur votre LAN. Un Pi, un NAS ou un portable fait tourner le relais TLS.",
    ethernetBuy: "N’importe quel câble de brassage Cat5e jusqu’à votre switch.",
  },
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Donnée du DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k vers le 3,3 V",
    "RJ45 → LAN. USB ST-LINK pour le flashage et le port série à 115200.",
  ],
  build: {
    title: "Compiler et flasher",
    step1Html:
      'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>Zephyr main.c</strong> (chemin d’ingestion prérempli), ou copiez les defines depuis l’encadré d’ingestion.',
    relayLabel: "Sur une machine du LAN :",
    step3Html:
      "Renseignez <code>INGEST_HOST</code> avec cette machine. Remplacez <code>src/main.c</code> par le fichier téléchargé si vous voulez que le chemin soit intégré.",
    westLabel: "Depuis un espace de travail Zephyr :",
    step5Html:
      "Port série à 115200 : <code>dhcp ok</code>, puis <code>POST 200</code>. La clé de capteur <code>temp1</code> s’importe au premier POST.",
    repoHtml: `Application du dépôt : ${repoApp} (<code>prj.conf</code>, overlay D4, CMake).`,
  },
  otherBoardsTitle: "Autres cartes STM32",
  otherBoardsHtml:
    "Toute cible Zephyr avec Ethernet peut exécuter le même C si vous ajoutez un overlay 1-Wire pour votre GPIO. Les Nucleo-F429ZI et Nucleo-H743ZI sont les cousines habituelles. Une Blue Pill avec W5500 se programme aussi en C, mais avec Cube HAL + ioLibrary, pas avec cette application Zephyr : utilisez le relais LAN de la même façon.",
  whyNot: {
    title: "Pourquoi pas Nordic ou TI d’abord ?",
    itemsHtml: [
      "<strong>nRF52</strong> : Bluetooth ou Thread, pas de HTTPS natif en Wi‑Fi.",
      "<strong>nRF9160</strong> : le LTE-M fonctionne, mais une carte SIM et un forfait opérateur font un moins bon premier kit antigel qu’une prise Ethernet dans le garage.",
      "<strong>TI SimpleLink / NXP RW612</strong> : des SDK C Wi‑Fi performants, mais une communauté amateur plus réduite que Nucleo + Zephyr.",
      '<strong>CH32V307</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet intégré</a> (RISC-V QingKe, même relais TLS sur le LAN).',
    ],
  },
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Ajouter des appareils</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingestion avec le Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestion avec CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Liste des pièces du kit antigel ESP32</a>',
      '<a class="text-link" href="/about/python-feeds">Relais HTTPS en Python</a>',
      `${allSketchesOpen}Tous les sketches ↗</a>`,
    ],
  },
};

export default fr;
