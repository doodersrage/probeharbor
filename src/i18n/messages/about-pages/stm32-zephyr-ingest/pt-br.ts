
/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { Stm32ZephyrIngestMessages } from "./en";

const ptBr: Stm32ZephyrIngestMessages = {
  intro1Html:
    "O ESP32 e a Pico W cobrem o Wi‑Fi. Se você quer outro fabricante de chips e uma toolchain que não seja nem Arduino nem Python, uma <strong>ST Nucleo-F767ZI</strong> rodando <strong>Zephyr</strong> envia via POST o mesmo JSON de ingestão pela Ethernet da placa. C, <code>west</code>, ST-LINK. O conector compatível com Arduino é só uma pinagem: o firmware não é um sketch de Arduino.",
  intro2Html:
    'HTTPS nativo no Zephyr significa embutir uma CA da CDN na imagem, o que quebra quando a cadeia de certificados do edge muda. Este exemplo usa o mesmo relay HTTP→HTTPS na rede local do caminho <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, assim a Cloudflare pode trocar de CA sem você precisar regravar a placa.',
  parts: {
    title: "Peças",
    caption: "Peças para uma sonda de congelamento STM32 com Zephyr",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet na placa, depurador ST-LINK. Sem módulo Wi‑Fi.",
    probePart: "DS18B20 à prova d’água",
    probeWhyHtml: "Sonda para cano ou porão. Dados no pino Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Resistor de 4,7 kΩ",
    resistorWhy: "Pull-up dos dados do DS18B20 para 3,3 V. Não alimente a sonda pelo pino de 5 V do Arduino.",
    amazonResistor: "4,7k na Amazon",
    ethernetPart: "Ponto de rede",
    ethernetWhy: "DHCP na sua rede local. Uma Pi, um NAS ou um notebook roda o relay TLS.",
    ethernetBuy: "Qualquer cabo de rede Cat5e até o seu switch.",
  },
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k para 3,3 V",
    "RJ45 → rede local. USB do ST-LINK para gravar e para a serial a 115200.",
  ],
  build: {
    title: "Compilar e gravar",
    step1Html:
      'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>Zephyr main.c</strong> (com o caminho de ingestão já preenchido), ou copie os defines do aviso de ingestão.',
    relayLabel: "Num computador da rede local:",
    step3Html:
      "Defina <code>INGEST_HOST</code> como essa máquina. Substitua <code>src/main.c</code> pelo arquivo baixado se quiser o caminho embutido.",
    westLabel: "A partir de um workspace do Zephyr:",
    step5Html:
      "Serial a 115200: <code>dhcp ok</code> e depois <code>POST 200</code>. A chave de sensor <code>temp1</code> é importada no primeiro POST.",
    repoHtml: `App no repositório: ${repoApp} (<code>prj.conf</code>, overlay do D4, CMake).`,
  },
  otherBoardsTitle: "Outras placas STM32",
  otherBoardsHtml:
    "Qualquer placa Zephyr com Ethernet roda o mesmo C se você adicionar um overlay 1-Wire para o seu GPIO. A Nucleo-F429ZI e a Nucleo-H743ZI são as primas mais comuns. Uma Blue Pill com W5500 também é C, mas com Cube HAL + ioLibrary, não com este app Zephyr: use o relay da rede local do mesmo jeito.",
  whyNot: {
    title: "Por que não começar por Nordic ou TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth ou Thread, sem HTTPS nativo por Wi‑Fi.",
      "<strong>nRF9160</strong>: o LTE-M funciona, mas um chip e um plano de operadora são um primeiro kit de congelamento pior do que um ponto de rede na garagem.",
      "<strong>TI SimpleLink / NXP RW612</strong>: SDKs em C com Wi‑Fi bem capazes, mas com uma comunidade hobbista menor que a de Nucleo + Zephyr.",
      '<strong>CH32V307</strong> agora tem suporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet na placa</a> (RISC-V QingKe, o mesmo relay TLS na rede local).',
    ],
  },
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adicionar dispositivos</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingestão com Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestão com CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de peças do kit de congelamento ESP32</a>',
      '<a class="text-link" href="/about/python-feeds">Relay HTTPS em Python</a>',
      `${allSketchesOpen}Todos os sketches ↗</a>`,
    ],
  },
};

export default ptBr;
