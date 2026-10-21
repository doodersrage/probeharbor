
/** Body copy for /about/teensy41-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

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
  stepInstallHtml: `Instale o Teensyduino. Adicione <a class="text-link" href="{qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> e <code>DallasTemperature</code>. Defina <code>INGEST_HOST</code> e grave.`,
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

export default ptBr;
