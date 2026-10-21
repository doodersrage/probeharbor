import type { DeviceSetupFirmwareMessages } from "./en";

const es: DeviceSetupFirmwareMessages = {
  srTitle: "Grabar firmware",
  esp32Heading: "Configura un ESP32 desde este navegador",
  esp32Lede:
    "Sin Arduino IDE: instala el firmware por USB y luego envíale tu Wi‑Fi y la clave de este dispositivo (ya rellenada). Chrome o Edge en un ordenador. Funciona con un DS18B20, un DHT22 o un sensor I²C en los pines indicados.",
  preferCode: "¿Prefieres código? Arduino IDE, MicroPython o ESPHome",
  esp32StepsHtml: [
    "Instala el soporte de placas <strong>ESP32</strong> (o ESP8266) en Arduino IDE / PlatformIO, no los ejemplos de Uno Ethernet. La Pico W usa otra descarga más abajo.",
    "Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code> (Gestor de bibliotecas). MicroPython necesita <code>onewire</code> / <code>ds18x20</code> (normalmente incluidas).",
    "Edita <code>WIFI_SSID</code> / <code>WIFI_PASS</code> en el archivo descargado y grábalo por USB.",
    "Monitor serie a <strong>115200</strong> baudios: deberías ver <code>WiFi ok</code> y luego <code>POST 200</code>.",
  ],
  downloadIno: "Descargar .ino de Arduino",
  downloadMicropython: "Descargar .py de MicroPython",
  downloadEsphome: "Descargar fragmento de ESPHome",
  allSketches: "Todos los sketches ↗",
  presetsSummary: "Plantillas de firmware (copiar y pegar)",
  payloadCheckerHtml:
    '¿Escribes tu propio payload? Pégalo en el <a class="text-link" href="/payload-checker">verificador de payload</a> para ver en qué se convierte cada campo antes de enviarlo.',
  copy: "Copiar",
  presets: {
    arduinoHttps: "Cliente HTTPS de Arduino (ruta + host de tu URL)",
    unoEthernet: "Uno + shield Ethernet (relé HTTP)",
    zephyr: "STM32 Zephyr Ethernet (relé HTTP)",
    ch32v: "CH32V307 WCHNET Ethernet (relé HTTP)",
    avr: "ATmega328P en ensamblador AVR, Ethernet (relé HTTP)",
    teensy: "Teensy 4.1 QNEthernet (relé HTTP)",
    pic18: "PIC18F67J60 MLA Ethernet (relé HTTP)",
    particle: "Particle Boron celular (webhook de Console)",
  },
  otherBoards:
    "Otras placas: Pico W, STM32, CH32V, AVR, Teensy, PIC18, celular",
  pico: {
    heading: "Grabar una Pico W",
    ledeHtml:
      "Raspberry Pi <strong>Pico W</strong> o <strong>Pico 2 W</strong> (RP2040 / RP2350) con el mismo DS18B20 en <strong>GP4</strong> → <code>temp1</code>. CircuitPython se instala arrastrando y soltando en la unidad <code>CIRCUITPY</code>. MicroPython y el .ino de Arduino de arriba también compilan para Pico W (núcleo de Earle Philhower).",
    stepsHtml: [
      "Mantén pulsado BOOTSEL, conecta el USB y suelta el UF2 de CircuitPython para Pico W o Pico 2 W.",
      "Instala las bibliotecas: <code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>",
      "Edita <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, guarda como <code>code.py</code> y espera <code>POST 200</code> en el monitor serie.",
    ],
    download: "Descargar code.py de CircuitPython",
    guide: "Guía de Pico W",
  },
  stm32: {
    heading: "Grabar un STM32 (Zephyr)",
    ledeHtml:
      "ST <strong>Nucleo-F767ZI</strong> en C sobre Zephyr: Ethernet integrado, ST-LINK, sin Arduino IDE ni Python. El mismo DS18B20 en el pin Arduino <strong>D4</strong> (PF14) → <code>temp1</code>. HTTP hacia el relé TLS de la LAN, como el shield Ethernet del Uno.",
    stepsHtml: [
      "Instala el SDK de Zephyr y <code>west</code>. Conecta la Nucleo por USB ST-LINK.",
      "Ejecuta <code>sketches/relay/push_https_forward.py</code> en un equipo de la LAN. Pon <code>INGEST_HOST</code> con la dirección de ese equipo.",
      "<code>west build -b nucleo_f767zi sketches/zephyr/ds18b20_ingest</code> y luego <code>west flash</code>. Serie a <strong>115200</strong>: <code>dhcp ok</code> y luego <code>POST 200</code>.",
    ],
    download: "Descargar main.c de Zephyr",
    guide: "Guía de STM32 Zephyr",
  },
  ch32v: {
    heading: "Grabar un CH32V (RISC-V)",
    ledeHtml:
      "WCH <strong>CH32V307V-EVT-R1</strong> en C sobre WCHNET: RISC-V QingKe, Ethernet 10M integrado, MounRiver Studio. Ni Arduino, ni Python, ni Zephyr. DS18B20 en <strong>PB12</strong> → <code>temp1</code>. HTTP hacia el relé TLS de la LAN, como Uno / STM32 Ethernet.",
    stepsHtml: [
      "Instala MounRiver Studio. Abre el proyecto oficial EVT <code>ETH/DHCP</code>. Conecta el WCH-Link.",
      "Ejecuta <code>sketches/relay/push_https_forward.py</code> en un equipo de la LAN. Pon <code>INGEST_HOST</code> con la dirección de ese equipo.",
      "Sustituye <code>User/main.c</code> por la descarga de abajo, compila y graba. Serie a <strong>115200</strong>: <code>dhcp ok</code> y luego <code>POST 200</code>.",
    ],
    download: "Descargar main.c de CH32V",
    guide: "Guía de CH32V RISC-V",
  },
  avr: {
    heading: "Grabar ensamblador AVR (Uno + W5100)",
    ledeHtml:
      "Arduino <strong>Uno / ATmega328P</strong> en ensamblador GNU AVR: sin C de Arduino ni Python. El mismo shield W5100 y relé TLS de la LAN que el sketch Ethernet del Uno. DS18B20 en <strong>D7</strong> (D4 es el chip-select de la SD del shield).",
    stepsHtml: [
      "Instala <code>avr-gcc</code>, <code>avr-libc</code> y <code>avrdude</code>. Conecta el Uno por USB.",
      "Ejecuta <code>sketches/relay/push_https_forward.py</code> en un equipo de la LAN. Pon <code>ingest_ip</code> con la dirección de ese equipo.",
      "<code>make flash</code> en <code>sketches/avr/atmega328_w5100_ds18b20/</code>, o ensambla la descarga de abajo. Serie a <strong>115200</strong>: <code>link ok</code> y luego <code>POST 200</code>.",
    ],
    download: "Descargar main.S de AVR",
    guide: "Guía de ensamblador AVR",
  },
  teensy: {
    heading: "Grabar una Teensy 4.1",
    ledeHtml:
      "PJRC <strong>Teensy 4.1</strong> + kit Ethernet en Teensyduino con <strong>QNEthernet</strong>. DS18B20 en el <strong>pin 4</strong> → <code>temp1</code>. HTTP hacia el relé TLS de la LAN.",
    stepsHtml: [
      "Instala Teensyduino. Bibliotecas: <code>QNEthernet</code>, <code>OneWire</code>, <code>DallasTemperature</code>.",
      "Ejecuta <code>sketches/relay/push_https_forward.py</code> en un equipo de la LAN. Pon <code>INGEST_HOST</code> con la dirección de ese equipo.",
      "Graba la descarga de abajo. Serie a <strong>115200</strong>: <code>link ok</code> y luego <code>POST 200</code>.",
    ],
    download: "Descargar .ino de Teensy 4.1",
    guide: "Guía de Teensy 4.1",
  },
  pic18: {
    heading: "Grabar un PIC18F67J60",
    ledeHtml:
      "Microchip <strong>PIC18F67J60</strong> en MPLAB X / XC8 con la clásica TCP/IP Stack: MAC/PHY Ethernet integrado. DS18B20 en <strong>RD0</strong> → <code>temp1</code>. HTTP hacia el relé TLS de la LAN.",
    stepsHtml: [
      "Instala MPLAB X + XC8. Abre una demo Ethernet de MLA para PIC18F67J60.",
      "Ejecuta <code>sketches/relay/push_https_forward.py</code> en un equipo de la LAN. Pon <code>INGEST_HOST</code> con la dirección de ese equipo.",
      "Añade la descarga de abajo, llama a <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> desde el bucle de la demo, compila y graba con PICkit.",
    ],
    download: "Descargar main.c de PIC18",
    guide: "Guía de PIC18 Ethernet",
  },
  cellular: {
    heading: "Grabar celular (Particle Boron)",
    ledeHtml:
      "<strong>Particle Boron</strong> / B-Series por LTE: sin Wi‑Fi en el garaje. El firmware publica JSON; un webhook de Console hace POST a tu URL de ingesta HTTPS. La detección de sondas inactivas cubre los cortes.",
    stepsHtml: [
      "Particle Workbench o Web IDE, Device OS 5+. Bibliotecas: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
      "Graba el .ino de abajo. Crea un webhook de Console a partir de la descarga JSON (URL ya rellenada).",
      "Serie a <strong>115200</strong>: <code>publish ok</code>. Comprueba HTTP 200 en el historial del webhook.",
    ],
    download: "Descargar .ino de Particle Boron",
    downloadWebhook: "Descargar JSON del webhook",
    guide: "Guía celular",
  },
  moreHelp: "Más ayuda:",
  helpLinks: {
    esp32: "Grabar ESP32",
    pico: "Ingesta con Pico W",
    stm32: "STM32 Zephyr",
    ch32v: "CH32V RISC-V",
    avr: "Ensamblador AVR",
    teensy: "Teensy 4.1",
    pic18: "PIC18 Ethernet",
    cellular: "Celular",
    addingDevices: "Añadir dispositivos",
    kitQr: "QR del kit",
    apiIngest: "Ingesta por API",
    ota: "Notas sobre OTA",
    unoSketch: "Sketch Ethernet para Uno",
  },
};

export default es;
