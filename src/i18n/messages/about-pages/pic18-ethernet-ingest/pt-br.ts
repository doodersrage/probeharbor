
/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

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
  stepMplabHtml: `Instale o <a class="text-link" href="{mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Abra uma demo Ethernet TCPIP da MLA para o PIC18F67J60, mantenha os fontes da pilha, adicione este módulo, chame <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> no loop principal da demo ao lado de <code>StackTask()</code>, compile e grave.`,
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

export default ptBr;
