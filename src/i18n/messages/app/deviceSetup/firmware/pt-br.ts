import type { DeviceSetupFirmwareMessages } from "./en";

const ptBr: DeviceSetupFirmwareMessages = {
  srTitle: "Gravar firmware",
  esp32Heading: "Configure um ESP32 por este navegador",
  esp32Lede:
    "Sem Arduino IDE: instale o firmware por USB e depois envie o seu Wi‑Fi e a chave deste dispositivo (já preenchida). Chrome ou Edge em um computador. Funciona com um DS18B20, um DHT22 ou um sensor I²C nos pinos indicados.",
  preferCode: "Prefere código? Arduino IDE, MicroPython ou ESPHome",
  esp32StepsHtml: [
    "Instale o suporte às placas <strong>ESP32</strong> (ou ESP8266) no Arduino IDE / PlatformIO, não os exemplos de Uno Ethernet. O Pico W usa outro download, mais abaixo.",
    "Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code> (Gerenciador de Bibliotecas). O MicroPython precisa de <code>onewire</code> / <code>ds18x20</code> (geralmente já incluídas).",
    "Edite <code>WIFI_SSID</code> / <code>WIFI_PASS</code> no arquivo baixado e grave por USB.",
    "Monitor serial em <strong>115200</strong> baud: espere <code>WiFi ok</code> e depois <code>POST 200</code>.",
  ],
  downloadIno: "Baixar .ino do Arduino",
  downloadMicropython: "Baixar .py do MicroPython",
  downloadEsphome: "Baixar trecho do ESPHome",
  allSketches: "Todos os sketches ↗",
  presetsSummary: "Modelos de firmware (copiar e colar)",
  payloadCheckerHtml:
    'Escrevendo seu próprio payload? Cole no <a class="text-link" href="/payload-checker">verificador de payload</a> para ver no que cada campo se transforma antes de enviar.',
  copy: "Copiar",
  presets: {
    arduinoHttps: "Cliente HTTPS do Arduino (caminho + host da sua URL)",
    unoEthernet: "Uno + shield Ethernet (relay HTTP)",
    zephyr: "STM32 Zephyr Ethernet (relay HTTP)",
    ch32v: "CH32V307 WCHNET Ethernet (relay HTTP)",
    avr: "ATmega328P em assembly AVR, Ethernet (relay HTTP)",
    teensy: "Teensy 4.1 QNEthernet (relay HTTP)",
    pic18: "PIC18F67J60 MLA Ethernet (relay HTTP)",
    particle: "Particle Boron celular (webhook do Console)",
  },
  otherBoards:
    "Outras placas: Pico W, STM32, CH32V, AVR, Teensy, PIC18, celular",
  pico: {
    heading: "Gravar um Pico W",
    ledeHtml:
      "Raspberry Pi <strong>Pico W</strong> ou <strong>Pico 2 W</strong> (RP2040 / RP2350) com o mesmo DS18B20 no <strong>GP4</strong> → <code>temp1</code>. O CircuitPython é só arrastar e soltar na unidade <code>CIRCUITPY</code>. O MicroPython e o .ino do Arduino acima também compilam para o Pico W (core do Earle Philhower).",
    stepsHtml: [
      "Segure o BOOTSEL, conecte o USB e solte o UF2 do CircuitPython para Pico W ou Pico 2 W.",
      "Instale as bibliotecas: <code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>",
      "Edite <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, salve como <code>code.py</code> e aguarde <code>POST 200</code> no serial.",
    ],
    download: "Baixar code.py do CircuitPython",
    guide: "Guia do Pico W",
  },
  stm32: {
    heading: "Gravar um STM32 (Zephyr)",
    ledeHtml:
      "ST <strong>Nucleo-F767ZI</strong> em C no Zephyr: Ethernet integrada, ST-LINK, sem Arduino IDE e sem Python. O mesmo DS18B20 no pino Arduino <strong>D4</strong> (PF14) → <code>temp1</code>. HTTP para o relay TLS da rede local, como o shield Ethernet do Uno.",
    stepsHtml: [
      "Instale o SDK do Zephyr e o <code>west</code>. Conecte a Nucleo pelo USB ST-LINK.",
      "Execute <code>sketches/relay/push_https_forward.py</code> em um computador da rede local. Defina <code>INGEST_HOST</code> com esse computador.",
      "<code>west build -b nucleo_f767zi sketches/zephyr/ds18b20_ingest</code> e depois <code>west flash</code>. Serial em <strong>115200</strong>: <code>dhcp ok</code> e depois <code>POST 200</code>.",
    ],
    download: "Baixar main.c do Zephyr",
    guide: "Guia do STM32 Zephyr",
  },
  ch32v: {
    heading: "Gravar um CH32V (RISC-V)",
    ledeHtml:
      "WCH <strong>CH32V307V-EVT-R1</strong> em C no WCHNET: RISC-V QingKe, Ethernet 10M integrada, MounRiver Studio. Nada de Arduino, Python ou Zephyr. DS18B20 no <strong>PB12</strong> → <code>temp1</code>. HTTP para o relay TLS da rede local, como Uno / STM32 Ethernet.",
    stepsHtml: [
      "Instale o MounRiver Studio. Abra o projeto oficial EVT <code>ETH/DHCP</code>. Conecte o WCH-Link.",
      "Execute <code>sketches/relay/push_https_forward.py</code> em um computador da rede local. Defina <code>INGEST_HOST</code> com esse computador.",
      "Substitua <code>User/main.c</code> pelo download abaixo, compile e grave. Serial em <strong>115200</strong>: <code>dhcp ok</code> e depois <code>POST 200</code>.",
    ],
    download: "Baixar main.c do CH32V",
    guide: "Guia do CH32V RISC-V",
  },
  avr: {
    heading: "Gravar assembly AVR (Uno + W5100)",
    ledeHtml:
      "Arduino <strong>Uno / ATmega328P</strong> em assembly GNU AVR: sem C do Arduino e sem Python. O mesmo shield W5100 e relay TLS da rede local do sketch Ethernet do Uno. DS18B20 no <strong>D7</strong> (o D4 é o chip-select do SD do shield).",
    stepsHtml: [
      "Instale <code>avr-gcc</code>, <code>avr-libc</code> e <code>avrdude</code>. Conecte o Uno por USB.",
      "Execute <code>sketches/relay/push_https_forward.py</code> em um computador da rede local. Defina <code>ingest_ip</code> com esse computador.",
      "<code>make flash</code> em <code>sketches/avr/atmega328_w5100_ds18b20/</code>, ou monte o download abaixo. Serial em <strong>115200</strong>: <code>link ok</code> e depois <code>POST 200</code>.",
    ],
    download: "Baixar main.S do AVR",
    guide: "Guia de assembly AVR",
  },
  teensy: {
    heading: "Gravar uma Teensy 4.1",
    ledeHtml:
      "PJRC <strong>Teensy 4.1</strong> + kit Ethernet no Teensyduino com <strong>QNEthernet</strong>. DS18B20 no <strong>pino 4</strong> → <code>temp1</code>. HTTP para o relay TLS da rede local.",
    stepsHtml: [
      "Instale o Teensyduino. Bibliotecas: <code>QNEthernet</code>, <code>OneWire</code>, <code>DallasTemperature</code>.",
      "Execute <code>sketches/relay/push_https_forward.py</code> em um computador da rede local. Defina <code>INGEST_HOST</code> com esse computador.",
      "Grave o download abaixo. Serial em <strong>115200</strong>: <code>link ok</code> e depois <code>POST 200</code>.",
    ],
    download: "Baixar .ino da Teensy 4.1",
    guide: "Guia da Teensy 4.1",
  },
  pic18: {
    heading: "Gravar um PIC18F67J60",
    ledeHtml:
      "Microchip <strong>PIC18F67J60</strong> no MPLAB X / XC8 com a clássica TCP/IP Stack: MAC/PHY Ethernet integrado. DS18B20 no <strong>RD0</strong> → <code>temp1</code>. HTTP para o relay TLS da rede local.",
    stepsHtml: [
      "Instale o MPLAB X + XC8. Abra uma demo Ethernet da MLA para PIC18F67J60.",
      "Execute <code>sketches/relay/push_https_forward.py</code> em um computador da rede local. Defina <code>INGEST_HOST</code> com esse computador.",
      "Adicione o download abaixo, chame <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> no loop da demo, compile e grave com o PICkit.",
    ],
    download: "Baixar main.c do PIC18",
    guide: "Guia do PIC18 Ethernet",
  },
  cellular: {
    heading: "Gravar celular (Particle Boron)",
    ledeHtml:
      "<strong>Particle Boron</strong> / B-Series via LTE: sem Wi‑Fi na garagem. O firmware publica JSON; um webhook do Console faz POST para a sua URL de ingestão HTTPS. A detecção de sondas paradas cobre as quedas.",
    stepsHtml: [
      "Particle Workbench ou Web IDE, Device OS 5+. Bibliotecas: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
      "Grave o .ino abaixo. Crie um webhook do Console a partir do download JSON (URL já preenchida).",
      "Serial em <strong>115200</strong>: <code>publish ok</code>. Confirme o HTTP 200 no histórico do webhook.",
    ],
    download: "Baixar .ino do Particle Boron",
    downloadWebhook: "Baixar JSON do webhook",
    guide: "Guia celular",
  },
  moreHelp: "Mais ajuda:",
  helpLinks: {
    esp32: "Gravar ESP32",
    pico: "Ingestão com Pico W",
    stm32: "STM32 Zephyr",
    ch32v: "CH32V RISC-V",
    avr: "Assembly AVR",
    teensy: "Teensy 4.1",
    pic18: "PIC18 Ethernet",
    cellular: "Celular",
    addingDevices: "Adicionar dispositivos",
    kitQr: "QR do kit",
    apiIngest: "Ingestão por API",
    ota: "Notas de OTA",
    unoSketch: "Sketch Ethernet do Uno",
  },
};

export default ptBr;
