
/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

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
  stepMounriverHtml: `Instale o <a class="text-link" href="{mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Abra o projeto oficial <a class="text-link" href="{evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, mantenha NetLib / <code>eth_driver</code>, substitua apenas <code>User/main.c</code>, compile e grave.`,
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

export default ptBr;
