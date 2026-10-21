import { defineMessages } from "../../translate";

/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */
const en = {
  introHtml:
    "Microchip <strong>PIC18F67J60</strong> has an onboard Ethernet MAC and 10BASE-T PHY. This sample is <strong>MPLAB X + XC8</strong> C on the classic Microchip TCP/IP Stack (MLA Ethernet demo)—not Arduino, not Python, not Zephyr. Same ingest JSON over the LAN HTTP→HTTPS relay.",
  relayHtml:
    'The MLA stack does not ship a maintained HTTPS client for Cloudflare. Keep the MCU on HTTP to a Pi/NAS relay, same pattern as <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> and <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Parts",
  partsCaption: "Parts for a PIC18 Ethernet freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boardPart: "PIC18F67J60 board",
  boardWhy: "Onboard MAC + PHY + RJ45. PICkit / ICD for flash.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Default sample pin <strong>RD0</strong> (change if your demo uses it).",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up to the board’s 1-Wire VDD (level-shift if IO is 5V-only).",
  ethernetPart: "Ethernet drop",
  ethernetWhy: "DHCP or static IP in the MLA demo. Relay host on the same LAN.",
  ethernetBuy: "Cat5e to your switch.",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → board logic VDD (often 3.3V; check the demo schematic)",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>RD0</strong>, 4.7k pull-up (edit <code>OW_*</code> macros if needed)",
    "RJ45 → LAN. PICkit for flash; UART for 115200 logs",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>PIC18 main.c</strong> (ingest path filled in).',
  stepRelayLead: "On a LAN host:",
  stepHostHtml: "Set <code>INGEST_HOST</code> to that machine (dotted IPv4).",
  stepMplabHtml: (mplab: string) =>
    `Install <a class="text-link" href="${mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Open an MLA TCPIP Ethernet demo for PIC18F67J60, keep stack sources, add this module, call <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> from the demo main loop next to <code>StackTask()</code>, build, flash.`,
  stepSerialHtml:
    "UART 115200: link/DHCP ok, then POST through the relay. Sensor key <code>temp1</code> imports on first POST.",
  repoLead: "Repo drop-in:",
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    teensy: "Teensy 4.1 ingest",
    ch32v: "CH32V RISC-V ingest",
    stm32: "STM32 Zephyr ingest",
    relay: "Python HTTPS relay",
  },
};
type Messages = typeof en;

const es: Messages = {
  introHtml:
    "El Microchip <strong>PIC18F67J60</strong> tiene MAC Ethernet y PHY 10BASE-T integrados. Este ejemplo es C con <strong>MPLAB X + XC8</strong> sobre la clásica Microchip TCP/IP Stack (demo Ethernet de MLA): ni Arduino, ni Python, ni Zephyr. El mismo JSON de ingesta a través del relay HTTP→HTTPS en la LAN.",
  relayHtml:
    'La pila MLA no incluye un cliente HTTPS mantenido para Cloudflare. Deja el MCU en HTTP hacia un relay en una Raspberry Pi o un NAS, con el mismo patrón que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> y <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas PIC18 con Ethernet",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  boardPart: "Placa PIC18F67J60",
  boardWhy: "MAC + PHY + RJ45 integrados. PICkit / ICD para grabar.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Pin por defecto del ejemplo: <strong>RD0</strong> (cámbialo si tu demo lo usa).",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up al VDD de 1-Wire de la placa (usa un adaptador de nivel si las E/S son solo de 5V).",
  ethernetPart: "Toma Ethernet",
  ethernetWhy: "DHCP o IP estática en la demo de MLA. El equipo del relay en la misma LAN.",
  ethernetBuy: "Cable Cat5e hasta tu switch.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → VDD lógico de la placa (a menudo 3.3V; consulta el esquema de la demo)",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>RD0</strong>, pull-up de 4.7k (edita las macros <code>OW_*</code> si hace falta)",
    "RJ45 → LAN. PICkit para grabar; UART para los registros a 115200",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>PIC18 main.c</strong> (con la ruta de ingesta ya incluida).',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml: "Pon en <code>INGEST_HOST</code> la IP de ese equipo (IPv4 con puntos).",
  stepMplabHtml: (mplab: string) =>
    `Instala <a class="text-link" href="${mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Abre una demo Ethernet TCPIP de MLA para PIC18F67J60, conserva los fuentes de la pila, añade este módulo, llama a <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> desde el bucle principal de la demo junto a <code>StackTask()</code>, compila y graba.`,
  stepSerialHtml:
    "UART a 115200: enlace/DHCP ok y después POST a través del relay. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "Listo para usar en el repositorio:",
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    teensy: "Ingesta con Teensy 4.1",
    ch32v: "Ingesta con CH32V RISC-V",
    stm32: "Ingesta con STM32 Zephyr",
    relay: "Relay HTTPS en Python",
  },
};

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
  stepMplabHtml: (mplab: string) =>
    `Installez <a class="text-link" href="${mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Ouvrez une démo Ethernet TCPIP MLA pour PIC18F67J60, gardez les sources de la pile, ajoutez ce module, appelez <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> depuis la boucle principale de la démo à côté de <code>StackTask()</code>, compilez, flashez.`,
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
  stepMplabHtml: (mplab: string) =>
    `Installiere <a class="text-link" href="${mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Öffne eine MLA-TCPIP-Ethernet-Demo für den PIC18F67J60, behalte die Stack-Quellen, füge dieses Modul hinzu, rufe <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> in der Hauptschleife der Demo neben <code>StackTask()</code> auf, baue und flashe.`,
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

const ptBr: Messages = {
  introHtml:
    "O Microchip <strong>PIC18F67J60</strong> tem MAC Ethernet e PHY 10BASE-T integrados. Este exemplo é C com <strong>MPLAB X + XC8</strong> sobre a clássica Microchip TCP/IP Stack (demo Ethernet da MLA): nada de Arduino, Python ou Zephyr. O mesmo JSON de ingestão pelo relay HTTP→HTTPS na LAN.",
  relayHtml:
    'A pilha MLA não traz um cliente HTTPS mantido para a Cloudflare. Deixe o MCU em HTTP para um relay em um Raspberry Pi ou NAS, no mesmo padrão do <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> e do <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Peças",
  partsCaption: "Peças para uma sonda contra congelamento PIC18 com Ethernet",
  colPart: "Peça",
  colWhy: "Para quê",
  colBuy: "Comprar",
  boardPart: "Placa PIC18F67J60",
  boardWhy: "MAC + PHY + RJ45 integrados. PICkit / ICD para gravação.",
  probePart: "DS18B20 à prova d’água",
  probeWhyHtml: "Pino padrão do exemplo: <strong>RD0</strong> (troque se a sua demo usar esse pino).",
  resistorPart: "Resistor de 4.7kΩ",
  resistorWhy: "Pull-up para o VDD de 1-Wire da placa (use conversor de nível se as E/S forem só de 5V).",
  ethernetPart: "Ponto de rede",
  ethernetWhy: "DHCP ou IP estático na demo da MLA. Máquina do relay na mesma LAN.",
  ethernetBuy: "Cabo Cat5e até o seu switch.",
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → VDD lógico da placa (muitas vezes 3.3V; confira o esquema da demo)",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>RD0</strong>, pull-up de 4.7k (edite as macros <code>OW_*</code> se precisar)",
    "RJ45 → LAN. PICkit para gravação; UART para logs a 115200",
  ],
  buildTitle: "Compilar e gravar",
  stepDownloadHtml:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>PIC18 main.c</strong> (com o caminho de ingestão preenchido).',
  stepRelayLead: "Em uma máquina da LAN:",
  stepHostHtml: "Defina <code>INGEST_HOST</code> como essa máquina (IPv4 com pontos).",
  stepMplabHtml: (mplab: string) =>
    `Instale o <a class="text-link" href="${mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Abra uma demo Ethernet TCPIP da MLA para o PIC18F67J60, mantenha os fontes da pilha, adicione este módulo, chame <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> no loop principal da demo ao lado de <code>StackTask()</code>, compile e grave.`,
  stepSerialHtml:
    "UART a 115200: link/DHCP ok e depois POST pelo relay. A chave de sensor <code>temp1</code> é importada no primeiro POST.",
  repoLead: "Pronto para usar no repositório:",
  relatedTitle: "Veja também",
  related: {
    addingDevices: "Adicionar dispositivos",
    teensy: "Ingestão com Teensy 4.1",
    ch32v: "Ingestão com CH32V RISC-V",
    stm32: "Ingestão com STM32 Zephyr",
    relay: "Relay HTTPS em Python",
  },
};

export const pic18EthernetIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
