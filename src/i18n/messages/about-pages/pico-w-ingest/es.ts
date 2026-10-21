
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

const es: PicoWIngestMessages = {
  intro1Html:
    "El ESP32 sigue siendo la placa por defecto del kit de congelación, pero no es el único microcontrolador con Wi‑Fi que puede hacer POST a ProbeHarbor. Una <strong>Raspberry Pi Pico W</strong> o <strong>Pico 2 W</strong> habla HTTPS desde el propio chip, usa el mismo esquema de cableado del DS18B20 que los sketches para ESP y se flashea sin Arduino IDE si prefieres la unidad <code>CIRCUITPY</code> de CircuitPython.",
  intro2Html:
    'Esto es una sonda de temperatura. El <a class="text-link" href="/claim-puck">claim puck</a> es otro RP2040 (Waveshare RP2040-Zero) que demuestra presencia por USB. No mezcles esos firmwares.',
  parts: {
    title: "Piezas",
    caption: "Piezas para una sonda de congelación con Pico W",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardPart: "Pico W o Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 y TLS integrados. La Pico 2 W (RP2350) es la mejora directa y compatible.",
    probePart: "DS18B20 impermeable",
    probeWhyHtml: "Sonda para tuberías o sótano ventilado; funciona bajo cero. Datos en <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Resistencia de 4,7 kΩ",
    resistorWhy: "Pull-up desde los datos del DS18B20 a 3,3 V. En una Pico, no alimentes la sonda con 5 V.",
    amazonResistor: "4,7k en Amazon",
  },
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (no VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>GP4</strong>, con 4,7k entre datos y 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 es GPIO 4, el mismo número de pin que usan los sketches para ESP32. Tras el primer POST, ProbeHarbor importa <code>temp1</code> automáticamente.",
  circuitpythonTitle: "1. CircuitPython (recomendado)",
  circuitpythonStepsHtml: [
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, crea un dispositivo push y descarga <strong>CircuitPython code.py</strong> (con la URL de ingesta ya rellenada).',
    "Mantén pulsado <strong>BOOTSEL</strong>, conecta el USB y copia el UF2 de CircuitPython para Pico W o Pico 2 W en la unidad RPI-RP2. La placa se vuelve a montar como <code>CIRCUITPY</code>.",
    `Instala las bibliotecas: ${circup}`,
    "Define <code>WIFI_SSID</code> / <code>WIFI_PASS</code> y guarda como <code>code.py</code>.",
    "El monitor serie debería mostrar <code>wifi ok</code> y luego <code>POST 200</code>.",
  ],
  repoSampleHtml: `Ejemplo del repositorio: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashea un UF2 de MicroPython para Pico W y copia el <strong>MicroPython .py</strong> de Devices como <code>main.py</code> (Thonny / mpremote). El mismo archivo también funciona en el ESP32. El pin 4 es GP4.",
  arduinoTitle: "3. Arduino IDE (núcleo de Earle Philhower)",
  arduinoHtml:
    "Instala el paquete <strong>Raspberry Pi Pico/RP2040</strong> de Earle Philhower, no el núcleo mbed RP2040 de Arduino. Selecciona <strong>Pico W</strong> o <strong>Pico 2 W</strong>, abre el <code>.ino</code> descargado, configura el Wi‑Fi y flashea. Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Lo que no vamos a añadir (por ahora)",
  notAddingHtml:
    "Cualquier cosa que pueda hacer POST de JSON por HTTPS ya funciona sin un sketch oficial: una Raspberry Pi con Linux y <code>requests</code>, ESPHome o un puente MQTT→HTTP en la LAN. Estas familias necesitan hardware adicional o una pasarela, así que se quedan fuera del panel de flasheo de Devices:",
  notAddingItemsHtml: [
    "<strong>Pico sin W</strong> / RP2040-Zero: sin Wi‑Fi. Usa Ethernet/ESP-01 más un relé TLS, o deja la Zero como claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> ya tiene soporte oficial: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet integrado</a> (relé TLS en la LAN, ni Arduino ni Python).',
    '<strong>CH32V307V-EVT</strong> ya tiene soporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet integrado</a> (RISC-V QingKe, relé TLS en la LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: siguen siendo Arduino; los ejemplos para ESP/Pico ya cubren Wi‑Fi con TLS si adaptas la biblioteca WiFi.",
  ],
  related: {
    title: "Relacionado",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Añadir dispositivos</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingesta con STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingesta con CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de piezas del kit ESP32 de congelación</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Opciones de flasheo del ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, no es una sonda)</a>',
      `${allSketchesOpen}Todos los sketches ↗</a>`,
    ],
  },
};

export default es;
