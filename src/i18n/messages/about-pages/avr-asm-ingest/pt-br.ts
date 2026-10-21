
/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

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

export default ptBr;
