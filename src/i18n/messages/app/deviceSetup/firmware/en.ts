/** Dashboard → Devices: "Flash firmware" panel (src/components/dashboard/IngestFirmwarePanel.astro). */
const en = {
  srTitle: "Flash firmware",
  esp32Heading: "Set up an ESP32 from this browser",
  esp32Lede:
    "No Arduino IDE: install the firmware over USB, then send it your Wi‑Fi and this device's key (already filled in). Chrome or Edge on a computer. Works with a DS18B20, a DHT22, or an I²C sensor on the pins shown.",
  preferCode: "Prefer code? Arduino IDE, MicroPython, or ESPHome",
  esp32StepsHtml: [
    "Install <strong>ESP32</strong> (or ESP8266) board support in Arduino IDE / PlatformIO, not the Uno Ethernet samples. Pico W uses a different download below.",
    "Libraries: <code>OneWire</code>, <code>DallasTemperature</code> (Library Manager). MicroPython needs <code>onewire</code> / <code>ds18x20</code> (usually bundled).",
    "Edit <code>WIFI_SSID</code> / <code>WIFI_PASS</code> in the downloaded file, then flash over USB.",
    "Serial Monitor at <strong>115200</strong> baud: expect <code>WiFi ok</code> then <code>POST 200</code>.",
  ],
  downloadIno: "Download Arduino .ino",
  downloadMicropython: "Download MicroPython .py",
  downloadEsphome: "Download ESPHome snippet",
  allSketches: "All sketches ↗",
  presetsSummary: "Firmware presets (copy-paste)",
  payloadCheckerHtml:
    'Writing your own payload? Paste it into the <a class="text-link" href="/payload-checker">payload checker</a> to see what each field becomes before you send it.',
  copy: "Copy",
  presets: {
    arduinoHttps: "Arduino HTTPS client (path + host from your URL)",
    unoEthernet: "Uno + Ethernet shield (HTTP relay)",
    zephyr: "STM32 Zephyr Ethernet (HTTP relay)",
    ch32v: "CH32V307 WCHNET Ethernet (HTTP relay)",
    avr: "ATmega328P AVR assembly Ethernet (HTTP relay)",
    teensy: "Teensy 4.1 QNEthernet (HTTP relay)",
    pic18: "PIC18F67J60 MLA Ethernet (HTTP relay)",
    particle: "Particle Boron cellular (Console webhook)",
  },
  otherBoards:
    "Other boards: Pico W, STM32, CH32V, AVR, Teensy, PIC18, cellular",
  pico: {
    heading: "Flash a Pico W",
    ledeHtml:
      "Raspberry Pi <strong>Pico W</strong> or <strong>Pico 2 W</strong> (RP2040 / RP2350) with the same DS18B20 on <strong>GP4</strong> → <code>temp1</code>. CircuitPython is drag-and-drop onto the <code>CIRCUITPY</code> drive. MicroPython and the Arduino .ino above also compile for Pico W (Earle Philhower core).",
    stepsHtml: [
      "Hold BOOTSEL, plug in USB, drop the CircuitPython UF2 for Pico W or Pico 2 W.",
      "Install libs: <code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>",
      "Edit <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, save as <code>code.py</code>, watch Serial for <code>POST 200</code>.",
    ],
    download: "Download CircuitPython code.py",
    guide: "Pico W guide",
  },
  stm32: {
    heading: "Flash an STM32 (Zephyr)",
    ledeHtml:
      "ST <strong>Nucleo-F767ZI</strong> in C on Zephyr: onboard Ethernet, ST-LINK, no Arduino IDE and no Python. Same DS18B20 on Arduino <strong>D4</strong> (PF14) → <code>temp1</code>. HTTP to the LAN TLS relay, like the Uno Ethernet shield.",
    stepsHtml: [
      "Install the Zephyr SDK and <code>west</code>. Plug the Nucleo in over ST-LINK USB.",
      "Run <code>sketches/relay/push_https_forward.py</code> on a LAN host. Set <code>INGEST_HOST</code> to that machine.",
      "<code>west build -b nucleo_f767zi sketches/zephyr/ds18b20_ingest</code> then <code>west flash</code>. Serial <strong>115200</strong>: <code>dhcp ok</code>, then <code>POST 200</code>.",
    ],
    download: "Download Zephyr main.c",
    guide: "STM32 Zephyr guide",
  },
  ch32v: {
    heading: "Flash a CH32V (RISC-V)",
    ledeHtml:
      "WCH <strong>CH32V307V-EVT-R1</strong> in C on WCHNET: QingKe RISC-V, onboard 10M Ethernet, MounRiver Studio. Not Arduino, not Python, not Zephyr. DS18B20 on <strong>PB12</strong> → <code>temp1</code>. HTTP to the LAN TLS relay, like Uno / STM32 Ethernet.",
    stepsHtml: [
      "Install MounRiver Studio. Open the official EVT <code>ETH/DHCP</code> project. Plug in WCH-Link.",
      "Run <code>sketches/relay/push_https_forward.py</code> on a LAN host. Set <code>INGEST_HOST</code> to that machine.",
      "Replace <code>User/main.c</code> with the download below, build, flash. Serial <strong>115200</strong>: <code>dhcp ok</code>, then <code>POST 200</code>.",
    ],
    download: "Download CH32V main.c",
    guide: "CH32V RISC-V guide",
  },
  avr: {
    heading: "Flash AVR assembly (Uno + W5100)",
    ledeHtml:
      "Arduino <strong>Uno / ATmega328P</strong> in GNU AVR assembly: no Arduino C, no Python. Same W5100 shield and LAN TLS relay as the Uno Ethernet sketch. DS18B20 on <strong>D7</strong> (D4 is the shield’s SD chip-select).",
    stepsHtml: [
      "Install <code>avr-gcc</code>, <code>avr-libc</code>, and <code>avrdude</code>. Plug the Uno in over USB.",
      "Run <code>sketches/relay/push_https_forward.py</code> on a LAN host. Set <code>ingest_ip</code> to that machine.",
      "<code>make flash</code> in <code>sketches/avr/atmega328_w5100_ds18b20/</code>, or assemble the download below. Serial <strong>115200</strong>: <code>link ok</code>, then <code>POST 200</code>.",
    ],
    download: "Download AVR main.S",
    guide: "AVR assembly guide",
  },
  teensy: {
    heading: "Flash a Teensy 4.1",
    ledeHtml:
      "PJRC <strong>Teensy 4.1</strong> + Ethernet kit in Teensyduino with <strong>QNEthernet</strong>. DS18B20 on <strong>pin 4</strong> → <code>temp1</code>. HTTP to the LAN TLS relay.",
    stepsHtml: [
      "Install Teensyduino. Libraries: <code>QNEthernet</code>, <code>OneWire</code>, <code>DallasTemperature</code>.",
      "Run <code>sketches/relay/push_https_forward.py</code> on a LAN host. Set <code>INGEST_HOST</code> to that machine.",
      "Flash the download below. Serial <strong>115200</strong>: <code>link ok</code>, then <code>POST 200</code>.",
    ],
    download: "Download Teensy 4.1 .ino",
    guide: "Teensy 4.1 guide",
  },
  pic18: {
    heading: "Flash a PIC18F67J60",
    ledeHtml:
      "Microchip <strong>PIC18F67J60</strong> in MPLAB X / XC8 on the classic TCP/IP Stack: onboard Ethernet MAC/PHY. DS18B20 on <strong>RD0</strong> → <code>temp1</code>. HTTP to the LAN TLS relay.",
    stepsHtml: [
      "Install MPLAB X + XC8. Open an MLA Ethernet demo for PIC18F67J60.",
      "Run <code>sketches/relay/push_https_forward.py</code> on a LAN host. Set <code>INGEST_HOST</code> to that machine.",
      "Add the download below, call <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> from the demo loop, build, PICkit flash.",
    ],
    download: "Download PIC18 main.c",
    guide: "PIC18 Ethernet guide",
  },
  cellular: {
    heading: "Flash cellular (Particle Boron)",
    ledeHtml:
      "<strong>Particle Boron</strong> / B-Series over LTE: no garage Wi‑Fi. Firmware publishes JSON; a Console webhook POSTs to your HTTPS ingest URL. Stale-probe detection covers dropouts.",
    stepsHtml: [
      "Particle Workbench or Web IDE, Device OS 5+. Libraries: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
      "Flash the .ino below. Create a Console webhook from the JSON download (URL already filled).",
      "Serial <strong>115200</strong>: <code>publish ok</code>. Confirm HTTP 200 in webhook history.",
    ],
    download: "Download Particle Boron .ino",
    downloadWebhook: "Download webhook JSON",
    guide: "Cellular guide",
  },
  moreHelp: "More help:",
  helpLinks: {
    esp32: "ESP32 flashing",
    pico: "Pico W ingest",
    stm32: "STM32 Zephyr",
    ch32v: "CH32V RISC-V",
    avr: "AVR assembly",
    teensy: "Teensy 4.1",
    pic18: "PIC18 Ethernet",
    cellular: "Cellular",
    addingDevices: "Adding devices",
    kitQr: "Kit QR",
    apiIngest: "API ingest",
    ota: "OTA notes",
    unoSketch: "Uno Ethernet sketch",
  },
};

export type DeviceSetupFirmwareMessages = typeof en;
export default en;
