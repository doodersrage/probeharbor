
/** Body copy for /about/pic18-ethernet-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "El Microchip <strong>PIC18F67J60</strong> tiene MAC Ethernet y PHY 10BASE-T integrados. Este ejemplo es C con <strong>MPLAB X + XC8</strong> sobre la clásica Microchip TCP/IP Stack (demo Ethernet de MLA): ni Arduino, ni Python, ni Zephyr. El mismo JSON de ingesta a través del relay HTTP→HTTPS en la LAN.",
  relayHtml:
    'La pila MLA no incluye un cliente HTTPS mantenido para Cloudflare. Deja el MCU en HTTP hacia un relay en una Raspberry Pi o un NAS, con el mismo patrón que <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> y <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>.',
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas PIC18 con Ethernet",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  boardPart: "Placa PIC18F67J60",
  boardWhy: "MAC + PHY + RJ45 integrados. PICkit / ICD para grabar.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Pin por defecto del ejemplo: <strong>RD0</strong> (cámbialo si tu demo lo usa).",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up al VDD de 1-Wire de la placa (usa un adaptador de nivel si las E/S son solo de 5V).",
  ethernetPart: "Toma Ethernet",
  ethernetWhy: "DHCP o IP estática en la demo de MLA. El equipo del relay en la misma LAN.",
  ethernetBuy: "Cable Cat5e hasta tu switch.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → VDD lógico de la placa (a menudo 3.3V; consulta el esquema de la demo)",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>RD0</strong>, pull-up de 4.7k (edita las macros <code>OW_*</code> si hace falta)",
    "RJ45 → LAN. PICkit para grabar; UART para los registros a 115200",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>PIC18 main.c</strong> (con la ruta de ingesta ya incluida).',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml: "Pon en <code>INGEST_HOST</code> la IP de ese equipo (IPv4 con puntos).",
  stepMplabHtml: `Instala <a class="text-link" href="{mplab}" target="_blank" rel="noreferrer">MPLAB X</a> + XC8. Abre una demo Ethernet TCPIP de MLA para PIC18F67J60, conserva los fuentes de la pila, añade este módulo, llama a <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> desde el bucle principal de la demo junto a <code>StackTask()</code>, compila y graba.`,
  stepSerialHtml:
    "UART a 115200: enlace/DHCP ok y después POST a través del relay. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "Listo para usar en el repositorio:",
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    teensy: "Ingesta con Teensy 4.1",
    ch32v: "Ingesta con CH32V RISC-V",
    stm32: "Ingesta con STM32 Zephyr",
    relay: "Relay HTTPS en Python",
  },
};

export default es;
