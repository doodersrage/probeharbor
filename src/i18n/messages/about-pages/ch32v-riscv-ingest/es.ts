
/** Body copy for /about/ch32v-riscv-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "ESP32, Pico W y STM32 cubren Arm y Xtensa. Si quieres una sonda <strong>QingKe RISC-V</strong> que no sea Arduino, ni Python, ni Zephyr, una <strong>CH32V307V-EVT-R1</strong> con <strong>WCHNET C</strong> envía por POST el mismo JSON de ingesta a través de su Ethernet 10M integrado. MounRiver Studio, WCH-Link. Sin módulo Wi‑Fi.",
  relayHtml:
    'WCHNET es TCP sobre IPv4 sin un cliente TLS mantenido. Este ejemplo usa el mismo relay HTTP→HTTPS en la LAN que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> y <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, así Cloudflare puede cambiar de CA sin que tengas que volver a grabar la placa.',
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas CH32V RISC-V",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  boardWhy: "QingKe RISC-V, PHY 10M + RJ45 integrados, WCH-Link. Aquí no se usa la MAC Gigabit.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Sonda para tuberías o espacio sanitario. Datos en <strong>PB12</strong>.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de la línea de datos del DS18B20 a 3.3V. No alimentes la sonda con 5V.",
  ethernetPart: "Toma Ethernet",
  ethernetWhy: "DHCP en tu LAN. Una Raspberry Pi, un NAS o un portátil ejecuta el relay TLS.",
  ethernetBuy: "Cualquier cable de red Cat5e hasta tu switch.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → EVT <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>PB12</strong>, 4.7k a 3.3V",
    "RJ45 → LAN. USB del WCH-Link para grabar y para el puerto serie a 115200.",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>CH32V main.c</strong> (con la ruta de ingesta ya incluida), o copia los defines del recuadro de ingesta.',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml:
    "Pon en <code>INGEST_HOST</code> la IP de ese equipo (IPv4 con puntos). Sustituye <code>User/main.c</code> por el archivo descargado.",
  stepMounriverHtml: `Instala <a class="text-link" href="{mounriver}" target="_blank" rel="noreferrer">MounRiver Studio</a>. Abre el proyecto oficial <a class="text-link" href="{evtDhcp}" target="_blank" rel="noreferrer">EVT ETH/DHCP</a>, conserva NetLib / <code>eth_driver</code>, sustituye solo <code>User/main.c</code>, compila y graba.`,
  stepSerialHtml:
    "Serie a 115200: <code>dhcp ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "Listo para usar en el repositorio:",
  repoNote: "(1-Wire por bit-bang en PB12 + cliente HTTP de WCHNET).",
  otherTitle: "Otras placas CH32V",
  other:
    "Cualquier CH32V307 con el PHY Ethernet de la EVT puede ejecutar este código C. Los CH32V203 / CH32V003 no tienen MAC Ethernet. Existen cores comunitarios Arduino-CH32, pero no son este ejemplo. Un CH32V307 con W5500 es posible, aunque entonces vuelves a ioLibrary por SPI en lugar de la MAC integrada.",
  whyNotTitle: "¿Por qué no nRF o TI a continuación?",
  whyNotHtml: [
    "<strong>nRF52</strong>: Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
    "<strong>nRF7002 DK</strong>: el Wi‑Fi 6 de Nordic funciona en nRF Connect SDK, pero fijar las CA de TLS en Zephyr sigue siendo una trampa de mantenimiento.",
    "<strong>TI SimpleLink / NXP RW612</strong>: SDK de Wi‑Fi en C muy capaces, pero con menos presencia entre aficionados que EVT + WCHNET.",
  ],
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    stm32: "Ingesta con STM32 Zephyr",
    pico: "Ingesta con Raspberry Pi Pico W",
    relay: "Relay HTTPS en Python",
    avr: "Ingesta en ensamblador AVR",
    allSketches: "Todos los sketches ↗",
  },
};

export default es;
