
/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketchesOpen = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">`;
import type { Stm32ZephyrIngestMessages } from "./en";

const es: Stm32ZephyrIngestMessages = {
  intro1Html:
    "El ESP32 y la Pico W cubren el Wi‑Fi. Si quieres otro fabricante de chips y una cadena de herramientas que no sea ni Arduino ni Python, una <strong>ST Nucleo-F767ZI</strong> con <strong>Zephyr</strong> envía por POST el mismo JSON de ingesta a través de su Ethernet integrado. C, <code>west</code>, ST-LINK. El conector compatible con Arduino es solo un patillaje: el firmware no es un sketch de Arduino.",
  intro2Html:
    'Usar HTTPS nativo en Zephyr implica incrustar en la imagen una CA de la CDN, y eso falla cuando rota la cadena de certificados del edge. Este ejemplo usa el mismo relé HTTP→HTTPS en la LAN que la opción <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, así Cloudflare puede cambiar de CA sin que tengas que volver a flashear.',
  parts: {
    title: "Piezas",
    caption: "Piezas para una sonda de congelación STM32 con Zephyr",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet integrados, depurador ST-LINK. Sin módulo Wi‑Fi.",
    probePart: "DS18B20 impermeable",
    probeWhyHtml: "Sonda para tuberías o sótano ventilado. Datos en el pin Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Resistencia de 4,7 kΩ",
    resistorWhy: "Pull-up desde los datos del DS18B20 a 3,3 V. No alimentes la sonda desde el pin de 5 V de Arduino.",
    amazonResistor: "4,7k en Amazon",
    ethernetPart: "Toma Ethernet",
    ethernetWhy: "DHCP en tu LAN. Una Pi, un NAS o un portátil ejecuta el relé TLS.",
    ethernetBuy: "Cualquier latiguillo Cat5e hasta tu switch.",
  },
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k a 3,3 V",
    "RJ45 → LAN. USB del ST-LINK para flashear y para el puerto serie a 115200.",
  ],
  build: {
    title: "Compilar y flashear",
    step1Html:
      'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>Zephyr main.c</strong> (con la ruta de ingesta ya rellenada), o copia los defines del aviso de ingesta.',
    relayLabel: "En un equipo de la LAN:",
    step3Html:
      "Define <code>INGEST_HOST</code> con esa máquina. Sustituye <code>src/main.c</code> por el archivo descargado si quieres llevar la ruta incrustada.",
    westLabel: "Desde un espacio de trabajo de Zephyr:",
    step5Html:
      "Puerto serie a 115200: <code>dhcp ok</code> y luego <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
    repoHtml: `Aplicación en el repositorio: ${repoApp} (<code>prj.conf</code>, overlay para D4, CMake).`,
  },
  otherBoardsTitle: "Otras placas STM32",
  otherBoardsHtml:
    "Cualquier placa Zephyr con Ethernet puede ejecutar el mismo C si añades un overlay 1-Wire para tu GPIO. Las Nucleo-F429ZI y Nucleo-H743ZI son las primas habituales. Una Blue Pill con W5500 también es C, pero eso es Cube HAL + ioLibrary, no esta aplicación de Zephyr: usa el relé de la LAN de la misma manera.",
  whyNot: {
    title: "¿Por qué no empezar por Nordic o TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
      "<strong>nRF9160</strong>: LTE-M funciona, pero una SIM y un plan con operador son peor primer kit de congelación que una toma Ethernet en el garaje.",
      "<strong>TI SimpleLink / NXP RW612</strong>: SDK en C con Wi‑Fi muy capaces, pero con menos comunidad aficionada que Nucleo + Zephyr.",
      '<strong>CH32V307</strong> ya tiene soporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet integrado</a> (RISC-V QingKe, el mismo relé TLS en la LAN).',
    ],
  },
  related: {
    title: "Relacionado",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Añadir dispositivos</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingesta con Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingesta con CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de piezas del kit ESP32 de congelación</a>',
      '<a class="text-link" href="/about/python-feeds">Relé HTTPS en Python</a>',
      `${allSketchesOpen}Todos los sketches ↗</a>`,
    ],
  },
};

export default es;
