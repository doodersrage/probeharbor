import { defineMessages } from "../../translate";

/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */
const en = {
  introHtml:
    'Almost no Ethernet freeze probe <strong>requires</strong> assembly. PADAUK, PIC10F, and ATtiny10 are assembly-first (or assembly-only in practice), but they do not have a TCP stack or the RAM to POST JSON. The path we can actually support is <strong>GNU AVR assembly</strong> on an Arduino <strong>Uno / ATmega328P</strong> plus a <strong>W5100</strong> Ethernet shield: the same garage hardware as <a class="text-link" href="/about/arduino-sketches">Uno Ethernet</a>, without Arduino C.',
  relay: "W5100 cannot TLS. This sample uses the same LAN HTTP→HTTPS relay as Uno C, STM32 Zephyr, and CH32V WCHNET.",
  partsTitle: "Parts",
  partsCaption: "Parts for an AVR assembly freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  unoWhyHtml: "16 MHz AVR. Programmed with <code>avr-gcc</code> / <code>avrdude</code>, not the Arduino IDE.",
  shieldPart: "W5100 Ethernet shield",
  shieldWhy: "SPI socket chip. Same shield as the Arduino Ethernet DHT22 sample.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Data on <strong>D7</strong>. Do not use D4: the shield uses D4 as SD chip-select.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 5V (Uno is a 5V board).",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>D7</strong> (PD7), 4.7k to 5V",
    "Ethernet shield seated on the Uno. RJ45 → LAN. USB for flash and 115200 serial.",
  ],
  buildTitle: "Build and flash",
  stepDownloadHtml:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>AVR main.S</strong> (ingest path filled in), or copy the <code>ingest_path</code> snippet from the ingest callout.',
  stepRelayLead: "On a LAN host:",
  stepHostHtml:
    "Set <code>ingest_ip</code> / <code>ingest_port</code> and the Host header string to that machine. Static Uno IP is <code>192.168.1.177</code> in <code>net_cfg</code>.",
  stepAssembleHtml:
    "Or assemble the downloaded <code>main.S</code> with the same <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code> flags.",
  stepSerialHtml:
    "Serial 115200: <code>link ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST (integer °F).",
  repoLead: "Repo listing:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "What we are not adding",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: assembly-first, but no Ethernet and too little RAM for HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: real assembly culture, but Ethernet add-ons vary and there is no one garage shield.",
    "<strong>PIC18F67J60</strong>: onboard Ethernet, but Microchip’s TCP stack is C, not MPASM.",
    "<strong>nRF / TI Wi‑Fi in Thumb asm</strong>: the SDKs are C. Hand-written TLS in assembly is not a freeze-kit path.",
  ],
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    arduino: "Arduino Ethernet (C)",
    ch32v: "CH32V RISC-V ingest",
    stm32: "STM32 Zephyr ingest",
    relay: "Python HTTPS relay",
  },
};
type Messages = typeof en;

const es: Messages = {
  introHtml:
    'Casi ninguna sonda antiheladas con Ethernet <strong>requiere</strong> ensamblador. PADAUK, PIC10F y ATtiny10 se programan sobre todo (o en la práctica solo) en ensamblador, pero no tienen pila TCP ni RAM suficiente para enviar JSON por POST. La opción que sí podemos soportar es <strong>ensamblador GNU AVR</strong> en un Arduino <strong>Uno / ATmega328P</strong> con un shield Ethernet <strong>W5100</strong>: el mismo hardware de garaje que <a class="text-link" href="/about/arduino-sketches">Uno con Ethernet</a>, sin Arduino C.',
  relay: "El W5100 no admite TLS. Este ejemplo usa el mismo relay HTTP→HTTPS en la LAN que Uno en C, STM32 Zephyr y CH32V WCHNET.",
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas en ensamblador AVR",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  unoWhyHtml: "AVR a 16 MHz. Se programa con <code>avr-gcc</code> / <code>avrdude</code>, no con el Arduino IDE.",
  shieldPart: "Shield Ethernet W5100",
  shieldWhy: "Chip de sockets por SPI. El mismo shield que el ejemplo Arduino Ethernet DHT22.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Datos en <strong>D7</strong>. No uses D4: el shield usa D4 como chip-select de la SD.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de la línea de datos del DS18B20 a 5V (el Uno es una placa de 5V).",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>D7</strong> (PD7), 4.7k a 5V",
    "Shield Ethernet montado sobre el Uno. RJ45 → LAN. USB para grabar y para el puerto serie a 115200.",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>AVR main.S</strong> (con la ruta de ingesta ya incluida), o copia el fragmento <code>ingest_path</code> del recuadro de ingesta.',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml:
    "Configura <code>ingest_ip</code> / <code>ingest_port</code> y la cadena de la cabecera Host con los datos de ese equipo. La IP estática del Uno es <code>192.168.1.177</code> en <code>net_cfg</code>.",
  stepAssembleHtml:
    "O ensambla el <code>main.S</code> descargado con los mismos flags <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Serie a 115200: <code>link ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST (°F entero).",
  repoLead: "En el repositorio:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "Lo que no vamos a añadir",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: pensados para ensamblador, pero sin Ethernet y con demasiada poca RAM para HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: tienen una auténtica cultura de ensamblador, pero los accesorios Ethernet varían y no hay un shield único para el garaje.",
    "<strong>PIC18F67J60</strong>: Ethernet integrado, pero la pila TCP de Microchip está en C, no en MPASM.",
    "<strong>Wi‑Fi de nRF / TI en ensamblador Thumb</strong>: los SDK están en C. Escribir TLS a mano en ensamblador no es camino para un kit antiheladas.",
  ],
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    arduino: "Arduino con Ethernet (C)",
    ch32v: "Ingesta con CH32V RISC-V",
    stm32: "Ingesta con STM32 Zephyr",
    relay: "Relay HTTPS en Python",
  },
};

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

const de: Messages = {
  introHtml:
    'Kaum eine Ethernet-Frostsonde <strong>erfordert</strong> Assembler. PADAUK, PIC10F und ATtiny10 werden vorrangig (oder praktisch nur) in Assembler programmiert, haben aber weder einen TCP-Stack noch genug RAM, um JSON per POST zu senden. Was wir tatsächlich unterstützen können, ist <strong>GNU-AVR-Assembler</strong> auf einem Arduino <strong>Uno / ATmega328P</strong> mit einem <strong>W5100</strong>-Ethernet-Shield: dieselbe Garagenhardware wie bei <a class="text-link" href="/about/arduino-sketches">Uno Ethernet</a>, nur ohne Arduino-C.',
  relay: "Der W5100 beherrscht kein TLS. Dieses Beispiel nutzt dasselbe HTTP→HTTPS-Relay im LAN wie Uno in C, STM32 Zephyr und CH32V WCHNET.",
  partsTitle: "Teile",
  partsCaption: "Teile für eine Frostsonde in AVR-Assembler",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  unoWhyHtml: "AVR mit 16 MHz. Programmiert mit <code>avr-gcc</code> / <code>avrdude</code>, nicht mit der Arduino IDE.",
  shieldPart: "W5100-Ethernet-Shield",
  shieldWhy: "Socket-Chip über SPI. Dasselbe Shield wie im Beispiel Arduino Ethernet DHT22.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Daten an <strong>D7</strong>. Nicht D4 verwenden: Das Shield nutzt D4 als Chip-Select für die SD-Karte.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 5V (der Uno ist ein 5V-Board).",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>D7</strong> (PD7), 4.7k auf 5V",
    "Ethernet-Shield auf den Uno gesteckt. RJ45 → LAN. USB zum Flashen und für die serielle Ausgabe mit 115200.",
  ],
  buildTitle: "Bauen und flashen",
  stepDownloadHtml:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>AVR main.S</strong> herunter (Ingest-Pfad bereits eingetragen), oder kopiere das <code>ingest_path</code>-Snippet aus dem Ingest-Hinweis.',
  stepRelayLead: "Auf einem Rechner im LAN:",
  stepHostHtml:
    "Setze <code>ingest_ip</code> / <code>ingest_port</code> und den Host-Header-String auf diesen Rechner. Die statische IP des Uno ist <code>192.168.1.177</code> in <code>net_cfg</code>.",
  stepAssembleHtml:
    "Oder assembliere die heruntergeladene <code>main.S</code> mit denselben Flags <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Seriell mit 115200: <code>link ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST übernommen (ganzzahlige °F).",
  repoLead: "Im Repo:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "Was wir nicht aufnehmen",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: auf Assembler ausgelegt, aber ohne Ethernet und mit zu wenig RAM für HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: echte Assembler-Kultur, aber Ethernet-Erweiterungen sind uneinheitlich, und es gibt nicht das eine Garagen-Shield.",
    "<strong>PIC18F67J60</strong>: integriertes Ethernet, aber Microchips TCP-Stack ist in C geschrieben, nicht in MPASM.",
    "<strong>nRF / TI WLAN in Thumb-Assembler</strong>: Die SDKs sind in C. Handgeschriebenes TLS in Assembler ist kein Weg für ein Frost-Kit.",
  ],
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    arduino: "Arduino Ethernet (C)",
    ch32v: "Ingest mit CH32V RISC-V",
    stm32: "Ingest mit STM32 Zephyr",
    relay: "HTTPS-Relay in Python",
  },
};

const ptBr: Messages = {
  introHtml:
    'Quase nenhuma sonda contra congelamento com Ethernet <strong>exige</strong> assembly. PADAUK, PIC10F e ATtiny10 são programados principalmente (ou, na prática, apenas) em assembly, mas não têm pilha TCP nem RAM para enviar JSON por POST. O caminho que realmente conseguimos suportar é <strong>assembly GNU AVR</strong> em um Arduino <strong>Uno / ATmega328P</strong> com um shield Ethernet <strong>W5100</strong>: o mesmo hardware de garagem do <a class="text-link" href="/about/arduino-sketches">Uno com Ethernet</a>, sem Arduino C.',
  relay: "O W5100 não suporta TLS. Este exemplo usa o mesmo relay HTTP→HTTPS na LAN que o Uno em C, o STM32 Zephyr e o CH32V WCHNET.",
  partsTitle: "Peças",
  partsCaption: "Peças para uma sonda contra congelamento em assembly AVR",
  colPart: "Peça",
  colWhy: "Para quê",
  colBuy: "Comprar",
  unoWhyHtml: "AVR de 16 MHz. Programado com <code>avr-gcc</code> / <code>avrdude</code>, não com o Arduino IDE.",
  shieldPart: "Shield Ethernet W5100",
  shieldWhy: "Chip de sockets via SPI. O mesmo shield do exemplo Arduino Ethernet DHT22.",
  probePart: "DS18B20 à prova d’água",
  probeWhyHtml: "Dados no <strong>D7</strong>. Não use o D4: o shield usa o D4 como chip-select do cartão SD.",
  resistorPart: "Resistor de 4.7kΩ",
  resistorWhy: "Pull-up da linha de dados do DS18B20 para 5V (o Uno é uma placa de 5V).",
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>D7</strong> (PD7), 4.7k para 5V",
    "Shield Ethernet encaixado no Uno. RJ45 → LAN. USB para gravação e serial a 115200.",
  ],
  buildTitle: "Compilar e gravar",
  stepDownloadHtml:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>AVR main.S</strong> (com o caminho de ingestão preenchido), ou copie o trecho <code>ingest_path</code> do quadro de ingestão.',
  stepRelayLead: "Em uma máquina da LAN:",
  stepHostHtml:
    "Defina <code>ingest_ip</code> / <code>ingest_port</code> e a string do cabeçalho Host com os dados dessa máquina. O IP estático do Uno é <code>192.168.1.177</code> em <code>net_cfg</code>.",
  stepAssembleHtml:
    "Ou monte o <code>main.S</code> baixado com as mesmas flags <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Serial a 115200: <code>link ok</code> e depois <code>POST 200</code>. A chave de sensor <code>temp1</code> é importada no primeiro POST (°F inteiro).",
  repoLead: "No repositório:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "O que não vamos adicionar",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: feitos para assembly, mas sem Ethernet e com RAM pouca demais para HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: uma verdadeira cultura de assembly, mas os complementos Ethernet variam e não existe um shield padrão para a garagem.",
    "<strong>PIC18F67J60</strong>: Ethernet integrada, mas a pilha TCP da Microchip é em C, não em MPASM.",
    "<strong>Wi‑Fi nRF / TI em assembly Thumb</strong>: os SDKs são em C. Escrever TLS à mão em assembly não é caminho para um kit contra congelamento.",
  ],
  relatedTitle: "Veja também",
  related: {
    addingDevices: "Adicionar dispositivos",
    arduino: "Arduino com Ethernet (C)",
    ch32v: "Ingestão com CH32V RISC-V",
    stm32: "Ingestão com STM32 Zephyr",
    relay: "Relay HTTPS em Python",
  },
};

export const avrAsmIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
