
/** Body copy for /about/avr-asm-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    'Casi ninguna sonda antiheladas con Ethernet <strong>requiere</strong> ensamblador. PADAUK, PIC10F y ATtiny10 se programan sobre todo (o en la práctica solo) en ensamblador, pero no tienen pila TCP ni RAM suficiente para enviar JSON por POST. La opción que sí podemos soportar es <strong>ensamblador GNU AVR</strong> en un Arduino <strong>Uno / ATmega328P</strong> con un shield Ethernet <strong>W5100</strong>: el mismo hardware de garaje que <a class="text-link" href="/about/arduino-sketches">Uno con Ethernet</a>, sin Arduino C.',
  relay: "El W5100 no admite TLS. Este ejemplo usa el mismo relay HTTP→HTTPS en la LAN que Uno en C, STM32 Zephyr y CH32V WCHNET.",
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas en ensamblador AVR",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  unoWhyHtml: "AVR a 16 MHz. Se programa con <code>avr-gcc</code> / <code>avrdude</code>, no con el Arduino IDE.",
  shieldPart: "Shield Ethernet W5100",
  shieldWhy: "Chip de sockets por SPI. El mismo shield que el ejemplo Arduino Ethernet DHT22.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Datos en <strong>D7</strong>. No uses D4: el shield usa D4 como chip-select de la SD.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de la línea de datos del DS18B20 a 5V (el Uno es una placa de 5V).",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Uno <strong>5V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>D7</strong> (PD7), 4.7k a 5V",
    "Shield Ethernet montado sobre el Uno. RJ45 → LAN. USB para grabar y para el puerto serie a 115200.",
  ],
  buildTitle: "Compilar y grabar",
  stepDownloadHtml:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>AVR main.S</strong> (con la ruta de ingesta ya incluida), o copia el fragmento <code>ingest_path</code> del recuadro de ingesta.',
  stepRelayLead: "En un equipo de la LAN:",
  stepHostHtml:
    "Configura <code>ingest_ip</code> / <code>ingest_port</code> y la cadena de la cabecera Host con los datos de ese equipo. La IP estática del Uno es <code>192.168.1.177</code> en <code>net_cfg</code>.",
  stepAssembleHtml:
    "O ensambla el <code>main.S</code> descargado con los mismos flags <code>avr-gcc -mmcu=atmega328p -nostartfiles -nostdlib</code>.",
  stepSerialHtml:
    "Serie a 115200: <code>link ok</code> y después <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST (°F entero).",
  repoLead: "En el repositorio:",
  repoNoteHtml: "(<code>main.S</code>, Makefile).",
  notAddingTitle: "Lo que no vamos a añadir",
  notAddingHtml: [
    "<strong>PADAUK / PIC10F / ATtiny4–10</strong>: pensados para ensamblador, pero sin Ethernet y con demasiada poca RAM para HTTP.",
    "<strong>Parallax Propeller PASM / PASM2</strong>: tienen una auténtica cultura de ensamblador, pero los accesorios Ethernet varían y no hay un shield único para el garaje.",
    "<strong>PIC18F67J60</strong>: Ethernet integrado, pero la pila TCP de Microchip está en C, no en MPASM.",
    "<strong>Wi‑Fi de nRF / TI en ensamblador Thumb</strong>: los SDK están en C. Escribir TLS a mano en ensamblador no es camino para un kit antiheladas.",
  ],
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    arduino: "Arduino con Ethernet (C)",
    ch32v: "Ingesta con CH32V RISC-V",
    stm32: "Ingesta con STM32 Zephyr",
    relay: "Relay HTTPS en Python",
  },
};

export default es;
