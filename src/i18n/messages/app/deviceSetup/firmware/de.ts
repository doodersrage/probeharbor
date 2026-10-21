import type { DeviceSetupFirmwareMessages } from "./en";

const de: DeviceSetupFirmwareMessages = {
  srTitle: "Firmware flashen",
  esp32Heading: "ESP32 direkt im Browser einrichten",
  esp32Lede:
    "Ohne Arduino IDE: Firmware per USB installieren, dann WLAN-Daten und den Schlüssel dieses Geräts (schon eingetragen) übertragen. Chrome oder Edge auf einem Computer. Funktioniert mit einem DS18B20, einem DHT22 oder einem I²C-Sensor an den angezeigten Pins.",
  preferCode: "Lieber Code? Arduino IDE, MicroPython oder ESPHome",
  esp32StepsHtml: [
    "Installiere die Board-Unterstützung für <strong>ESP32</strong> (oder ESP8266) in Arduino IDE / PlatformIO, nicht die Uno-Ethernet-Beispiele. Für den Pico W gibt es unten einen eigenen Download.",
    "Bibliotheken: <code>OneWire</code>, <code>DallasTemperature</code> (Bibliotheksverwalter). MicroPython braucht <code>onewire</code> / <code>ds18x20</code> (meist schon enthalten).",
    "Trage <code>WIFI_SSID</code> / <code>WIFI_PASS</code> in der heruntergeladenen Datei ein und flashe sie per USB.",
    "Serieller Monitor mit <strong>115200</strong> Baud: erst <code>WiFi ok</code>, dann <code>POST 200</code>.",
  ],
  downloadIno: "Arduino-.ino herunterladen",
  downloadMicropython: "MicroPython-.py herunterladen",
  downloadEsphome: "ESPHome-Snippet herunterladen",
  allSketches: "Alle Sketches ↗",
  presetsSummary: "Firmware-Vorlagen (zum Kopieren)",
  payloadCheckerHtml:
    'Schreibst du deinen eigenen Payload? Füge ihn in den <a class="text-link" href="/payload-checker">Payload-Checker</a> ein und sieh vor dem Senden, was aus jedem Feld wird.',
  copy: "Kopieren",
  presets: {
    arduinoHttps: "Arduino-HTTPS-Client (Pfad + Host aus deiner URL)",
    unoEthernet: "Uno + Ethernet-Shield (HTTP-Relay)",
    zephyr: "STM32 Zephyr Ethernet (HTTP-Relay)",
    ch32v: "CH32V307 WCHNET Ethernet (HTTP-Relay)",
    avr: "ATmega328P in AVR-Assembler, Ethernet (HTTP-Relay)",
    teensy: "Teensy 4.1 QNEthernet (HTTP-Relay)",
    pic18: "PIC18F67J60 MLA Ethernet (HTTP-Relay)",
    particle: "Particle Boron Mobilfunk (Console-Webhook)",
  },
  otherBoards:
    "Weitere Boards: Pico W, STM32, CH32V, AVR, Teensy, PIC18, Mobilfunk",
  pico: {
    heading: "Pico W flashen",
    ledeHtml:
      "Raspberry Pi <strong>Pico W</strong> oder <strong>Pico 2 W</strong> (RP2040 / RP2350) mit demselben DS18B20 an <strong>GP4</strong> → <code>temp1</code>. CircuitPython wird per Drag-and-drop auf das Laufwerk <code>CIRCUITPY</code> kopiert. MicroPython und die Arduino-.ino von oben lassen sich ebenfalls für den Pico W kompilieren (Earle-Philhower-Core).",
    stepsHtml: [
      "BOOTSEL gedrückt halten, USB einstecken, die CircuitPython-UF2 für Pico W oder Pico 2 W draufziehen.",
      "Bibliotheken installieren: <code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>",
      "<code>WIFI_SSID</code> / <code>WIFI_PASS</code> eintragen, als <code>code.py</code> speichern und im seriellen Monitor auf <code>POST 200</code> achten.",
    ],
    download: "CircuitPython-code.py herunterladen",
    guide: "Anleitung Pico W",
  },
  stm32: {
    heading: "STM32 flashen (Zephyr)",
    ledeHtml:
      "ST <strong>Nucleo-F767ZI</strong> in C unter Zephyr: Ethernet an Bord, ST-LINK, keine Arduino IDE und kein Python. Derselbe DS18B20 an Arduino-Pin <strong>D4</strong> (PF14) → <code>temp1</code>. HTTP an das TLS-Relay im LAN, wie beim Uno-Ethernet-Shield.",
    stepsHtml: [
      "Zephyr SDK und <code>west</code> installieren. Das Nucleo über ST-LINK-USB anschließen.",
      "<code>sketches/relay/push_https_forward.py</code> auf einem Rechner im LAN starten. <code>INGEST_HOST</code> auf diesen Rechner setzen.",
      "<code>west build -b nucleo_f767zi sketches/zephyr/ds18b20_ingest</code>, dann <code>west flash</code>. Seriell mit <strong>115200</strong>: <code>dhcp ok</code>, dann <code>POST 200</code>.",
    ],
    download: "Zephyr-main.c herunterladen",
    guide: "Anleitung STM32 Zephyr",
  },
  ch32v: {
    heading: "CH32V flashen (RISC-V)",
    ledeHtml:
      "WCH <strong>CH32V307V-EVT-R1</strong> in C mit WCHNET: QingKe-RISC-V, 10M-Ethernet an Bord, MounRiver Studio. Kein Arduino, kein Python, kein Zephyr. DS18B20 an <strong>PB12</strong> → <code>temp1</code>. HTTP an das TLS-Relay im LAN, wie bei Uno / STM32 Ethernet.",
    stepsHtml: [
      "MounRiver Studio installieren. Das offizielle EVT-Projekt <code>ETH/DHCP</code> öffnen. WCH-Link anschließen.",
      "<code>sketches/relay/push_https_forward.py</code> auf einem Rechner im LAN starten. <code>INGEST_HOST</code> auf diesen Rechner setzen.",
      "<code>User/main.c</code> durch den Download unten ersetzen, bauen, flashen. Seriell mit <strong>115200</strong>: <code>dhcp ok</code>, dann <code>POST 200</code>.",
    ],
    download: "CH32V-main.c herunterladen",
    guide: "Anleitung CH32V RISC-V",
  },
  avr: {
    heading: "AVR-Assembler flashen (Uno + W5100)",
    ledeHtml:
      "Arduino <strong>Uno / ATmega328P</strong> in GNU-AVR-Assembler: kein Arduino-C, kein Python. Dasselbe W5100-Shield und TLS-Relay im LAN wie beim Uno-Ethernet-Sketch. DS18B20 an <strong>D7</strong> (D4 ist der SD-Chip-Select des Shields).",
    stepsHtml: [
      "<code>avr-gcc</code>, <code>avr-libc</code> und <code>avrdude</code> installieren. Den Uno per USB anschließen.",
      "<code>sketches/relay/push_https_forward.py</code> auf einem Rechner im LAN starten. <code>ingest_ip</code> auf diesen Rechner setzen.",
      "<code>make flash</code> in <code>sketches/avr/atmega328_w5100_ds18b20/</code> ausführen oder den Download unten assemblieren. Seriell mit <strong>115200</strong>: <code>link ok</code>, dann <code>POST 200</code>.",
    ],
    download: "AVR-main.S herunterladen",
    guide: "Anleitung AVR-Assembler",
  },
  teensy: {
    heading: "Teensy 4.1 flashen",
    ledeHtml:
      "PJRC <strong>Teensy 4.1</strong> + Ethernet-Kit in Teensyduino mit <strong>QNEthernet</strong>. DS18B20 an <strong>Pin 4</strong> → <code>temp1</code>. HTTP an das TLS-Relay im LAN.",
    stepsHtml: [
      "Teensyduino installieren. Bibliotheken: <code>QNEthernet</code>, <code>OneWire</code>, <code>DallasTemperature</code>.",
      "<code>sketches/relay/push_https_forward.py</code> auf einem Rechner im LAN starten. <code>INGEST_HOST</code> auf diesen Rechner setzen.",
      "Den Download unten flashen. Seriell mit <strong>115200</strong>: <code>link ok</code>, dann <code>POST 200</code>.",
    ],
    download: "Teensy-4.1-.ino herunterladen",
    guide: "Anleitung Teensy 4.1",
  },
  pic18: {
    heading: "PIC18F67J60 flashen",
    ledeHtml:
      "Microchip <strong>PIC18F67J60</strong> in MPLAB X / XC8 mit dem klassischen TCP/IP Stack: Ethernet-MAC/PHY an Bord. DS18B20 an <strong>RD0</strong> → <code>temp1</code>. HTTP an das TLS-Relay im LAN.",
    stepsHtml: [
      "MPLAB X + XC8 installieren. Eine MLA-Ethernet-Demo für PIC18F67J60 öffnen.",
      "<code>sketches/relay/push_https_forward.py</code> auf einem Rechner im LAN starten. <code>INGEST_HOST</code> auf diesen Rechner setzen.",
      "Den Download unten hinzufügen, <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> aus der Demo-Schleife aufrufen, bauen, mit PICkit flashen.",
    ],
    download: "PIC18-main.c herunterladen",
    guide: "Anleitung PIC18 Ethernet",
  },
  cellular: {
    heading: "Mobilfunk flashen (Particle Boron)",
    ledeHtml:
      "<strong>Particle Boron</strong> / B-Series über LTE: kein WLAN in der Garage nötig. Die Firmware veröffentlicht JSON; ein Console-Webhook sendet es per POST an deine HTTPS-Ingest-URL. Die Erkennung verstummter Fühler fängt Ausfälle ab.",
    stepsHtml: [
      "Particle Workbench oder Web IDE, Device OS 5+. Bibliotheken: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
      "Die .ino unten flashen. Einen Console-Webhook aus dem JSON-Download anlegen (URL schon eingetragen).",
      "Seriell mit <strong>115200</strong>: <code>publish ok</code>. HTTP 200 im Webhook-Verlauf prüfen.",
    ],
    download: "Particle-Boron-.ino herunterladen",
    downloadWebhook: "Webhook-JSON herunterladen",
    guide: "Anleitung Mobilfunk",
  },
  moreHelp: "Weitere Hilfe:",
  helpLinks: {
    esp32: "ESP32 flashen",
    pico: "Pico-W-Ingest",
    stm32: "STM32 Zephyr",
    ch32v: "CH32V RISC-V",
    avr: "AVR-Assembler",
    teensy: "Teensy 4.1",
    pic18: "PIC18 Ethernet",
    cellular: "Mobilfunk",
    addingDevices: "Geräte hinzufügen",
    kitQr: "Kit-QR-Code",
    apiIngest: "API-Ingest",
    ota: "OTA-Hinweise",
    unoSketch: "Uno-Ethernet-Sketch",
  },
};

export default de;
