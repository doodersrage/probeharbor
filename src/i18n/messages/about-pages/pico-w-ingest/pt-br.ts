
/**
 * /about/pico-w-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Pin names, part numbers,
 * commands and dashboard UI labels stay as is.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoSample = `<a class="text-link" href="${GH}/blob/main/sketches/circuitpython/ds18b20_ingest.py" target="_blank" rel="noreferrer"><code>sketches/circuitpython/ds18b20_ingest.py</code></a>`;
const circup =
  "<code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>";
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { PicoWIngestMessages } from "./en";

const ptBr: PicoWIngestMessages = {
  intro1Html:
    "O ESP32 continua sendo a placa padrão do kit de congelamento, mas não é o único microcontrolador com Wi‑Fi que consegue fazer POST para o ProbeHarbor. Uma <strong>Raspberry Pi Pico W</strong> ou <strong>Pico 2 W</strong> fala HTTPS no próprio chip, usa o mesmo esquema de ligação do DS18B20 dos sketches para ESP e pode ser gravada sem o Arduino IDE se você preferir a unidade <code>CIRCUITPY</code> do CircuitPython.",
  intro2Html:
    'Esta é uma sonda de temperatura. O <a class="text-link" href="/claim-puck">claim puck</a> é outro RP2040 (Waveshare RP2040-Zero) que comprova presença via USB. Não misture esses firmwares.',
  parts: {
    title: "Peças",
    caption: "Peças para uma sonda de congelamento com Pico W",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardPart: "Pico W ou Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 e TLS na placa. A Pico 2 W (RP2350) é o upgrade direto e compatível.",
    probePart: "DS18B20 à prova d’água",
    probeWhyHtml: "Sonda para cano ou porão; funciona abaixo de zero. Dados no <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Resistor de 4,7 kΩ",
    resistorWhy: "Pull-up dos dados do DS18B20 para 3,3 V. Numa Pico, não alimente a sonda com 5 V.",
    amazonResistor: "4,7k na Amazon",
  },
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (não VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>GP4</strong>, com 4,7k entre dados e 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 é o GPIO 4, o mesmo número de pino usado nos sketches para ESP32. Depois do primeiro POST, o ProbeHarbor importa <code>temp1</code> automaticamente.",
  circuitpythonTitle: "1. CircuitPython (recomendado)",
  circuitpythonStepsHtml: [
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, crie um dispositivo push e baixe <strong>CircuitPython code.py</strong> (com a URL de ingestão já preenchida).',
    "Segure <strong>BOOTSEL</strong>, conecte o USB e copie o UF2 do CircuitPython para Pico W ou Pico 2 W na unidade RPI-RP2. A placa volta a aparecer como <code>CIRCUITPY</code>.",
    `Instale as bibliotecas: ${circup}`,
    "Defina <code>WIFI_SSID</code> / <code>WIFI_PASS</code> e salve como <code>code.py</code>.",
    "O monitor serial deve mostrar <code>wifi ok</code> e depois <code>POST 200</code>.",
  ],
  repoSampleHtml: `Exemplo do repositório: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Grave um UF2 do MicroPython para Pico W e copie o <strong>MicroPython .py</strong> de Devices como <code>main.py</code> (Thonny / mpremote). O mesmo arquivo também roda no ESP32. O pino 4 é o GP4.",
  arduinoTitle: "3. Arduino IDE (core de Earle Philhower)",
  arduinoHtml:
    "Instale o pacote <strong>Raspberry Pi Pico/RP2040</strong> de Earle Philhower, não o core mbed RP2040 do Arduino. Selecione <strong>Pico W</strong> ou <strong>Pico 2 W</strong>, abra o <code>.ino</code> baixado, configure o Wi‑Fi e grave. Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "O que não vamos adicionar (por enquanto)",
  notAddingHtml:
    "Qualquer coisa que consiga fazer POST de JSON via HTTPS já funciona sem um sketch oficial: uma Raspberry Pi com Linux e <code>requests</code>, ESPHome ou uma ponte MQTT→HTTP na rede local. Essas famílias precisam de hardware extra ou de um gateway, então ficam fora do painel de gravação de Devices:",
  notAddingItemsHtml: [
    "<strong>Pico sem W</strong> / RP2040-Zero: sem Wi‑Fi. Use Ethernet/ESP-01 mais um relay TLS, ou mantenha a Zero como claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth ou Thread, sem HTTPS nativo por Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> agora tem suporte oficial: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet na placa</a> (relay TLS na rede local, sem Arduino, sem Python).',
    '<strong>CH32V307V-EVT</strong> agora tem suporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet na placa</a> (RISC-V QingKe, relay TLS na rede local).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: continuam sendo Arduino; os exemplos para ESP/Pico já cobrem Wi‑Fi com TLS se você adaptar a biblioteca WiFi.",
  ],
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adicionar dispositivos</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingestão com STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestão com CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de peças do kit de congelamento ESP32</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Opções de gravação do ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, não é uma sonda)</a>',
      `${allSketchesOpen}Todos os sketches ↗</a>`,
    ],
  },
};

export default ptBr;
