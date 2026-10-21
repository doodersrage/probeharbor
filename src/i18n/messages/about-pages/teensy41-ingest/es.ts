
/** Body copy for /about/teensy41-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "La PJRC <strong>Teensy 4.1</strong> (NXP i.MX RT1062) con el kit Ethernet oficial es una sonda de garaje rápida con Cortex-M7 en <strong>Teensyduino + QNEthernet</strong>: ni herramientas de STM32 Zephyr ni WCH MounRiver. DS18B20 en el pin 4 → <code>temp1</code>. HTTP hacia el relay TLS de la LAN, con la misma solución para las CA que Uno con Ethernet.",
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas con Teensy 4.1",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  teensyWhy: "M7 a 600 MHz, grabación por USB, MAC Ethernet integrada (necesita el kit de magnéticos).",
  kitPart: "Kit Ethernet / MagJack",
  kitWhy: "Magnéticos + RJ45 cableados según la documentación Ethernet de PJRC para Teensy 4.1.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Datos en el <strong>pin 4</strong>, 4.7k a 3.3V.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de 1-Wire a 3.3V.",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>pin 4</strong>, 4.7k a 3.3V",
    "Kit Ethernet → LAN. USB para grabar con Teensyduino y para el puerto serie a 115200",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>Teensy 4.1 .ino</strong> (con la ruta de ingesta ya incluida).',
  stepRelayLead: "En un equipo de la LAN:",
  stepInstallHtml: `Instala Teensyduino. Añade <a class="text-link" href="{qneth}" target="_blank" rel="noreferrer">QNEthernet</a>, <code>OneWire</code> y <code>DallasTemperature</code>. Configura <code>INGEST_HOST</code> y graba.`,
  stepSerialHtml:
    "Serie a 115200: <code>link ok</code>, <code>dhcp ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
  repoLead: "En el repositorio:",
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    pic18: "Ingesta con PIC18F67J60",
    stm32: "Ingesta con STM32 Zephyr",
    cellular: "Conexión móvil (Particle Boron)",
    relay: "Relay HTTPS en Python",
  },
};

export default es;
