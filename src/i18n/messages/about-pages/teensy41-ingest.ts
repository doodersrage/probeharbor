import { defineMessages } from "../../translate";

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
  stepInstallHtml: (qneth: string) =>
    `Install Teensyduino. Add <a class="text-link" href="${qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code>, <code>DallasTemperature</code>. Set <code>INGEST_HOST</code>, flash.`,
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
type Messages = typeof en;

const es: Messages = {
  introHtml:
    "La PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) con el kit Ethernet oficial es una sonda de garaje rápida con Cortex-M7 en <strong>Teensyduino + QNEthernet</strong>: ni herramientas de STM32 Zephyr ni WCH MounRiver. DS18B20 en el pin 4 → <code>temp1</code>. HTTP hacia el relay TLS de la LAN, con la misma solución para las CA que Uno con Ethernet.",
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas con Teensy 4.1",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  teensyWhy: "M7 a 600 MHz, grabación por USB, MAC Ethernet integrada (necesita el kit de magnéticos).",
  kitPart: "Kit Ethernet / MagJack",
  kitWhy: "Magnéticos + RJ45 cableados según la documentación Ethernet de PJRC para Teensy 4.1.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Datos en el <strong>pin 4</strong>, 4.7k a 3.3V.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de 1-Wire a 3.3V.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>pin 4</strong>, 4.7k a 3.3V",
    "Kit Ethernet → LAN. USB para grabar con Teensyduino y para el puerto serie a 115200",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>Teensy 4.1 .ino</strong> (con la ruta de ingesta ya incluida).',
  stepRelayLead: "En un equipo de la LAN:",
  stepInstallHtml: (qneth: string) =>
    `Instala Teensyduino. Añade <a class="text-link" href="${qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> y <code>DallasTemperature</code>. Configura <code>INGEST_HOST</code> y graba.`,
  stepSerialHtml:
    "Serie a 115200: <code>link ok</code>, <code>dhcp ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "En el repositorio:",
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    pic18: "Ingesta con PIC18F67J60",
    stm32: "Ingesta con STM32 Zephyr",
    cellular: "Conexión móvil (Particle Boron)",
    relay: "Relay HTTPS en Python",
  },
};

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
  stepInstallHtml: (qneth: string) =>
    `Installez Teensyduino. Ajoutez <a class="text-link" href="${qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> et <code>DallasTemperature</code>. Réglez <code>INGEST_HOST</code>, flashez.`,
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
  stepInstallHtml: (qneth: string) =>
    `Installiere Teensyduino. Füge <a class="text-link" href="${qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> und <code>DallasTemperature</code> hinzu. Setze <code>INGEST_HOST</code> und flashe.`,
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

const ptBr: Messages = {
  introHtml:
    "A PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) com o kit Ethernet oficial é uma sonda de garagem rápida com Cortex-M7 em <strong>Teensyduino + QNEthernet</strong>: nada das ferramentas do STM32 Zephyr nem do WCH MounRiver. DS18B20 no pino 4 → <code>temp1</code>. HTTP para o relay TLS da LAN, com a mesma solução para as CAs do Uno com Ethernet.",
  partsTitle: "Peças",
  partsCaption: "Peças para uma sonda contra congelamento com Teensy 4.1",
  colPart: "Peça",
  colWhy: "Para quê",
  colBuy: "Comprar",
  teensyWhy: "M7 de 600 MHz, gravação via USB, MAC Ethernet integrada (precisa do kit de magnéticos).",
  kitPart: "Kit Ethernet / MagJack",
  kitWhy: "Magnéticos + RJ45 ligados conforme a documentação Ethernet da PJRC para a Teensy 4.1.",
  probePart: "DS18B20 à prova d’água",
  probeWhyHtml: "Dados no <strong>pino 4</strong>, 4.7k para 3.3V.",
  resistorPart: "Resistor de 4.7kΩ",
  resistorWhy: "Pull-up de 1-Wire para 3.3V.",
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>pino 4</strong>, 4.7k para 3.3V",
    "Kit Ethernet → LAN. USB para gravação com Teensyduino e serial a 115200",
  ],
  buildTitle: "Compilar e gravar",
  stepDownloadHtml:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>Teensy 4.1 .ino</strong> (com o caminho de ingestão preenchido).',
  stepRelayLead: "Em uma máquina da LAN:",
  stepInstallHtml: (qneth: string) =>
    `Instale o Teensyduino. Adicione <a class="text-link" href="${qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> e <code>DallasTemperature</code>. Defina <code>INGEST_HOST</code> e grave.`,
  stepSerialHtml:
    "Serial a 115200: <code>link ok</code>, <code>dhcp ok</code> e depois <code>POST 200</code>. A chave de sensor <code>temp1</code> é importada no primeiro POST.",
  repoLead: "No repositório:",
  relatedTitle: "Veja também",
  related: {
    addingDevices: "Adicionar dispositivos",
    pic18: "Ingestão com PIC18F67J60",
    stm32: "Ingestão com STM32 Zephyr",
    cellular: "Rede celular (Particle Boron)",
    relay: "Relay HTTPS em Python",
  },
};

export const teensy41IngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
