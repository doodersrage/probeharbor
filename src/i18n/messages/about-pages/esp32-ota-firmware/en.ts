
/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */

const en = {
  introHtml:
    'ProbeHarbor cares about <strong>readings over HTTPS</strong>, not how you update the MCU. Keep OTA on your LAN; keep ingest pointed at <code>/api/ingest/&lt;key&gt;</code>. Download a pre-filled sketch from <a class="text-link" href="/dashboard/devices">Devices</a> after you create a push device.',
  firstFlashTitle: "First flash vs OTA",
  usbFlashHtml:
    '<strong>USB first flash</strong>, use the Devices callout checklist (ESP32 board package, libraries, Serial 115200). See <a class="text-link" href="/about/esp32-web-flash">flashing options</a> for Arduino IDE, PlatformIO, MicroPython, and Espressif’s web esptool.',
  lanOtaHtml:
    "<strong>LAN OTA later</strong>: once Wi‑Fi works, <code>ArduinoOTA</code> (or ESP-IDF HTTPS OTA) lets you push new firmware without climbing back to the probe with a cable.",
  arduinoOtaTitle: "ArduinoOTA (LAN)",
  arduinoOtaBodyHtml:
    "After <code>WiFi.begin</code> succeeds, start OTA and call <code>handle()</code> in <code>loop</code>. Use a password in production shops. PlatformIO / Arduino IDE “network port” then shows the board.",
  independentNote:
    "OTA and ingest are independent: a failed cloud POST does not block OTA, and an OTA update does not change your ProbeHarbor device key.",
  payloadTitle: "Ingest payload with battery and RSSI",
  payloadIntro: "Optional top-level fields keep Devices health and low-battery / weak-signal alerts accurate:",
  payloadAfterHtml:
    'The DS18B20 samples already send <code>rssi</code>. Add <code>battery</code> or <code>battery_pct</code> when you have a voltage divider or fuel gauge. Enable health alerts under <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi without recompiling",
  wifiBodyHtml:
    'Hardcoded <code>WIFI_SSID</code> / <code>WIFI_PASS</code> is fine for a fixed garage AP. If the network changes often, use the <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager sketch</a> captive portal on first boot; ingest URL still comes from the Devices download or a <code>#define</code>.',
  relatedTitle: "Related",
  related: {
    adding: "Adding devices",
    flash: "ESP32 flashing options",
    qr: "Kit QR onboarding",
    api: "HTTP API: ingest",
  },
};

export type Esp32OtaFirmwareMessages = typeof en;
export default en;
