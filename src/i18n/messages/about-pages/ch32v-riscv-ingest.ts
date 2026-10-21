import { defineMessages } from "../../translate";

/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */
const en = {
  introHtml:
    "ESP32, Pico W, and STM32 cover Arm and Xtensa. If you want a <strong>QingKe RISC-V</strong> probe that is neither Arduino nor Python nor Zephyr, a <strong>CH32V307V-EVT-R1</strong> running <strong>WCHNET C</strong> POSTs the same ingest JSON over onboard 10M Ethernet. MounRiver Studio, WCH-Link. No Wi‑Fi module.",
  relayHtml:
    'WCHNET is IPv4 TCP without a maintained TLS client. This sample uses the same LAN HTTP→HTTPS relay as <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> and <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, so Cloudflare can change CAs without a reflash.',
  partsTitle: "Parts",
  partsCaption: "Parts for a CH32V RISC-V freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boardWhy: "QingKe RISC-V, onboard 10M PHY + RJ45, WCH-Link. Gigabit MAC is unused here.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Pipe / crawlspace probe. Data on <strong>PB12</strong>.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from 5V.",
  ethernetPart: "Ethernet drop",
  ethernetWhy: "DHCP on your LAN. A Pi, NAS, or laptop runs the TLS relay.",
  ethernetBuy: "Any Cat5e patch cable to your switch.",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>PB12</strong>, 4.7k to 3.3V",
    "RJ45 → LAN. WCH-Link USB for flash and 115200 serial.",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>CH32V main.c</strong> (ingest path filled in), or copy the defines from the ingest callout.',
  stepRelayLead: "On a LAN host:",
  stepHostHtml:
    "Set <code>INGEST_HOST</code> to that machine (dotted IPv4). Drop the downloaded file over <code>User/main.c</code>.",
  stepMounriverHtml: (mounriver: string, evtDhcp: string) =>
    `Install <a class="text-link" href="${mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Open the official <a class="text-link" href="${evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a> project, keep NetLib / <code>eth_driver</code>, replace only <code>User/main.c</code>, build, flash.`,
  stepSerialHtml:
    "Serial 115200: <code>dhcp ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST.",
  repoLead: "Repo drop-in:",
  repoNote: "(bit-bang 1-Wire on PB12 + WCHNET HTTP client).",
  otherTitle: "Other CH32V boards",
  other:
    "Any CH32V307 with the EVT Ethernet PHY can run this C. CH32V203 / CH32V003 do not have the Ethernet MAC. Community Arduino-CH32 cores exist; they are not this sample. A CH32V307 plus W5500 is possible, but then you are back to SPI ioLibrary instead of the onboard MAC.",
  whyNotTitle: "Why not nRF / TI next?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth or Thread, not native Wi‑Fi HTTPS.",
    "<strong>nRF7002 DK</strong>: Nordic Wi‑Fi 6 works in nRF Connect SDK, but TLS CA pinning on Zephyr is still a maintenance trap.",
    "<strong>TI SimpleLink / NXP RW612</strong>: capable Wi‑Fi C SDKs, smaller hobbyist footprint than EVT + WCHNET.",
  ],
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    stm32: "STM32 Zephyr ingest",
    pico: "Raspberry Pi Pico W ingest",
    relay: "Python HTTPS relay",
    avr: "AVR assembly ingest",
    allSketches: "All sketches ↗",
  },
};
type Messages = typeof en;

const es: Messages = {
  introHtml:
    "ESP32, Pico W y STM32 cubren Arm y Xtensa. Si quieres una sonda <strong>QingKe RISC-V</strong> que no sea Arduino, ni Python, ni Zephyr, una <strong>CH32V307V-EVT-R1</strong> con <strong>WCHNET C</strong> envía por POST el mismo JSON de ingesta a través de su Ethernet 10M integrado. MounRiver Studio, WCH-Link. Sin módulo Wi‑Fi.",
  relayHtml:
    'WCHNET es TCP sobre IPv4 sin un cliente TLS mantenido. Este ejemplo usa el mismo relay HTTP→HTTPS en la LAN que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> y <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, así Cloudflare puede cambiar de CA sin que tengas que volver a grabar la placa.',
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas CH32V RISC-V",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  boardWhy: "QingKe RISC-V, PHY 10M + RJ45 integrados, WCH-Link. Aquí no se usa la MAC Gigabit.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Sonda para tuberías o espacio sanitario. Datos en <strong>PB12</strong>.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de la línea de datos del DS18B20 a 3.3V. No alimentes la sonda con 5V.",
  ethernetPart: "Toma Ethernet",
  ethernetWhy: "DHCP en tu LAN. Una Raspberry Pi, un NAS o un portátil ejecuta el relay TLS.",
  ethernetBuy: "Cualquier cable de red Cat5e hasta tu switch.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>PB12</strong>, 4.7k a 3.3V",
    "RJ45 → LAN. USB del WCH-Link para grabar y para el puerto serie a 115200.",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>CH32V main.c</strong> (con la ruta de ingesta ya incluida), o copia los defines del recuadro de ingesta.',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml:
    "Pon en <code>INGEST_HOST</code> la IP de ese equipo (IPv4 con puntos). Sustituye <code>User/main.c</code> por el archivo descargado.",
  stepMounriverHtml: (mounriver: string, evtDhcp: string) =>
    `Instala <a class="text-link" href="${mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Abre el proyecto oficial <a class="text-link" href="${evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, conserva NetLib / <code>eth_driver</code>, sustituye solo <code>User/main.c</code>, compila y graba.`,
  stepSerialHtml:
    "Serie a 115200: <code>dhcp ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "Listo para usar en el repositorio:",
  repoNote: "(1-Wire por bit-bang en PB12 + cliente HTTP de WCHNET).",
  otherTitle: "Otras placas CH32V",
  other:
    "Cualquier CH32V307 con el PHY Ethernet de la EVT puede ejecutar este código C. Los CH32V203 / CH32V003 no tienen MAC Ethernet. Existen cores comunitarios Arduino-CH32, pero no son este ejemplo. Un CH32V307 con W5500 es posible, aunque entonces vuelves a ioLibrary por SPI en lugar de la MAC integrada.",
  whyNotTitle: "¿Por qué no nRF o TI a continuación?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
    "<strong>nRF7002 DK</strong>: el Wi‑Fi 6 de Nordic funciona en nRF Connect SDK, pero fijar las CA de TLS en Zephyr sigue siendo una trampa de mantenimiento.",
    "<strong>TI SimpleLink / NXP RW612</strong>: SDK de Wi‑Fi en C muy capaces, pero con menos presencia entre aficionados que EVT + WCHNET.",
  ],
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    stm32: "Ingesta con STM32 Zephyr",
    pico: "Ingesta con Raspberry Pi Pico W",
    relay: "Relay HTTPS en Python",
    avr: "Ingesta en ensamblador AVR",
    allSketches: "Todos los sketches ↗",
  },
};

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
  stepMounriverHtml: (mounriver: string, evtDhcp: string) =>
    `Installez <a class="text-link" href="${mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Ouvrez le projet officiel <a class="text-link" href="${evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, gardez NetLib / <code>eth_driver</code>, remplacez uniquement <code>User/main.c</code>, compilez, flashez.`,
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
  stepMounriverHtml: (mounriver: string, evtDhcp: string) =>
    `Installiere <a class="text-link" href="${mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Öffne das offizielle Projekt <a class="text-link" href="${evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, behalte NetLib / <code>eth_driver</code>, ersetze nur <code>User/main.c</code>, baue und flashe.`,
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

const ptBr: Messages = {
  introHtml:
    "ESP32, Pico W e STM32 cobrem Arm e Xtensa. Se você quer uma sonda <strong>QingKe RISC-V</strong> que não seja Arduino, nem Python, nem Zephyr, uma <strong>CH32V307V-EVT-R1</strong> rodando <strong>WCHNET C</strong> envia por POST o mesmo JSON de ingestão pela Ethernet 10M integrada. MounRiver Studio, WCH-Link. Sem módulo Wi‑Fi.",
  relayHtml:
    'WCHNET é TCP sobre IPv4 sem um cliente TLS mantido. Este exemplo usa o mesmo relay HTTP→HTTPS na LAN que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> e <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, para que a Cloudflare possa trocar de CA sem você precisar regravar a placa.',
  partsTitle: "Peças",
  partsCaption: "Peças para uma sonda contra congelamento CH32V RISC-V",
  colPart: "Peça",
  colWhy: "Para quê",
  colBuy: "Comprar",
  boardWhy: "QingKe RISC-V, PHY 10M + RJ45 integrados, WCH-Link. A MAC Gigabit não é usada aqui.",
  probePart: "DS18B20 à prova d’água",
  probeWhyHtml: "Sonda para cano ou porão baixo. Dados no <strong>PB12</strong>.",
  resistorPart: "Resistor de 4.7kΩ",
  resistorWhy: "Pull-up da linha de dados do DS18B20 para 3.3V. Não alimente a sonda com 5V.",
  ethernetPart: "Ponto de rede",
  ethernetWhy: "DHCP na sua LAN. Um Raspberry Pi, NAS ou notebook roda o relay TLS.",
  ethernetBuy: "Qualquer cabo de rede Cat5e até o seu switch.",
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>PB12</strong>, 4.7k para 3.3V",
    "RJ45 → LAN. USB do WCH-Link para gravação e serial a 115200.",
  ],
  buildTitle: "Compilar e gravar",
  stepDownloadHtml:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>CH32V main.c</strong> (com o caminho de ingestão preenchido), ou copie os defines do quadro de ingestão.',
  stepRelayLead: "Em uma máquina da LAN:",
  stepHostHtml:
    "Defina <code>INGEST_HOST</code> como essa máquina (IPv4 com pontos). Substitua <code>User/main.c</code> pelo arquivo baixado.",
  stepMounriverHtml: (mounriver: string, evtDhcp: string) =>
    `Instale o <a class="text-link" href="${mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Abra o projeto oficial <a class="text-link" href="${evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, mantenha NetLib / <code>eth_driver</code>, substitua apenas <code>User/main.c</code>, compile e grave.`,
  stepSerialHtml:
    "Serial a 115200: <code>dhcp ok</code> e depois <code>POST 200</code>. A chave de sensor <code>temp1</code> é importada no primeiro POST.",
  repoLead: "Pronto para usar no repositório:",
  repoNote: "(1-Wire por bit-bang no PB12 + cliente HTTP do WCHNET).",
  otherTitle: "Outras placas CH32V",
  other:
    "Qualquer CH32V307 com o PHY Ethernet da EVT roda este código C. Os CH32V203 / CH32V003 não têm MAC Ethernet. Existem cores Arduino-CH32 da comunidade, mas eles não são este exemplo. Um CH32V307 com W5500 é possível, mas aí você volta à ioLibrary via SPI em vez da MAC integrada.",
  whyNotTitle: "Por que não nRF ou TI em seguida?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth ou Thread, sem HTTPS nativo por Wi‑Fi.",
    "<strong>nRF7002 DK</strong>: o Wi‑Fi 6 da Nordic funciona no nRF Connect SDK, mas fixar CAs de TLS no Zephyr ainda é uma armadilha de manutenção.",
    "<strong>TI SimpleLink / NXP RW612</strong>: SDKs de Wi‑Fi em C competentes, mas com menos presença entre hobbistas do que EVT + WCHNET.",
  ],
  relatedTitle: "Veja também",
  related: {
    addingDevices: "Adicionar dispositivos",
    stm32: "Ingestão com STM32 Zephyr",
    pico: "Ingestão com Raspberry Pi Pico W",
    relay: "Relay HTTPS em Python",
    avr: "Ingestão em assembly AVR",
    allSketches: "Todos os sketches ↗",
  },
};

export const ch32vRiscvIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
