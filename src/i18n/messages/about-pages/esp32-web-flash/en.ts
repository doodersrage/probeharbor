
/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */

const en = {
  introHtml:
    'The quickest path is the <a class="text-link" href="/flash">browser flasher</a> (beta): it installs prebuilt firmware over USB and sends the board your Wi‑Fi and device key, with no IDE. It works with DS18B20 probes (up to four) or a DHT22/DHT11 for temperature and humidity, all wired to GPIO 4. If you want to read or change the code, create a push device → <strong>download a pre-filled sketch</strong> → flash with a tool you already trust.',
  devicesTitle: "1. Download from Devices (recommended)",
  devicesStep1Html:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and create a push device.',
  devicesStep2Html:
    "On the ingest callout, download <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W), or <strong>ESPHome</strong>: the ingest URL is already filled; set Wi‑Fi only.",
  devicesStep3Html:
    "Follow the ESP32 checklist on that card (board package, libraries, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Install <strong>ESP32</strong> board support (Espressif), not the Uno Ethernet garage-LCD path.",
  arduinoItem2Html: "Libraries: <code>OneWire</code>, <code>DallasTemperature</code> (Library Manager).",
  arduinoItem3Html: "Open the downloaded <code>.ino</code>, set <code>WIFI_*</code>, select the port, flash.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'Repo sample <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> includes a <code>platformio.ini</code> with pinned libs and <code>monitor_speed = 115200</code>. Pass ingest URL via build flags or paste the Devices-generated sketch into <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flash a MicroPython image once, then copy the downloaded <code>main.py</code> (ingest URL pre-filled). No Arduino board package required.",
  esptoolTitle: "5. Browser esptool (when you already have a .bin)",
  esptoolBodyHtml:
    "If you build a binary locally (PlatformIO <code>pio run</code>), you can flash it from Chrome/Edge with Espressif’s Web Serial tool: useful on locked-down PCs without a full IDE:",
  esptoolNote:
    "That tool flashes bits you provide; it does not know your ProbeHarbor key. Keep using the Devices download to bake the URL into source before you build.",
  portalTitle: "6. Wi‑Fi via captive portal",
  portalBodyHtml:
    'Avoid baking SSID/password into source with the <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager sample</a> join the config AP once, then the probe stores credentials. Still set <code>INGEST_URL</code> from Devices (or download and merge).',
  relatedTitle: "Related",
  related: {
    kit: "ESP32 freeze kit parts list",
    pico: "Raspberry Pi Pico W ingest",
    stm32: "STM32 Zephyr ingest",
    ch32v: "CH32V RISC-V ingest",
    avr: "AVR assembly ingest",
    adding: "Adding devices",
    ota: "OTA and battery / RSSI",
    qr: "Kit QR",
    sketches: "All sketches ↗",
  },
};

export type Esp32WebFlashMessages = typeof en;
export default en;
