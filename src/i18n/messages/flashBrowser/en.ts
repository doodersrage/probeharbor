/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */

const en = {
  installTitle: "1. Install the firmware",
  installCopy:
    "Plug the ESP32 into this computer with a USB data cable, click Install, and pick the board's serial port. It takes about a minute. Tested on the original ESP32; the ESP32-S3 and ESP32-C3 images are built but not yet tested on hardware.",
  installButton: "Install firmware",
  unsupportedHtml:
    'This browser cannot talk to USB serial devices. Open this page in Chrome or Edge on a desktop or laptop, or use the <a class="text-link" href="/about/esp32-web-flash">other flashing options</a>.',
  notAllowed: "The installer needs a secure (https) page.",
  noPort: "No port in the list? Try another cable (many are charge-only) and install the CP210x or CH340 driver for your board.",
  connectTitle: "2. Connect it to Wi‑Fi and your account",
  connectCopy:
    "Close the installer, then send these settings over the same cable. They go straight to the board and are not stored on this page.",
  ssidLabel: "Wi‑Fi network name",
  ssidHint: "2.4 GHz network; ESP32 boards cannot join 5 GHz.",
  passwordLabel: "Wi‑Fi password",
  keyLabel: "Device key",
  keyHintPrefilled: "Filled in for the device you just created.",
  keyHint: "From Dashboard → Devices after you add a push device. Pasting the whole ingest URL works too.",
  extrasLegend: "Also wired to this board (optional)",
  extraLeak: "Leak / water contact",
  extraDoor: "Door reed switch",
  extraBattery: "Battery (1:1 divider)",
  extrasHint:
    "Tick only what you've connected: an unwired pin would read as \"dry\" or \"open\". Pins are in the table above. DS18B20, DHT22 and I²C sensors (BME280, SHT31, AHT20) are found automatically.",
  sendButton: "Send settings over USB",
  phoneSetupHtml:
    "No USB serial in your browser, or the board is already mounted somewhere else? Power it up and join the <strong>ProbeHarbor-Setup</strong> Wi‑Fi network from a phone to enter the same settings. Holding the BOOT button for five seconds erases them.",
  status: {
    noSerial: "This browser has no USB serial support. Use Chrome or Edge on a computer, or the phone setup below.",
    pickPort: "Pick the board's serial port…",
    waiting: "Waiting for the board to start…",
    sending: "Sending settings…",
    received: "Settings received. Joining Wi‑Fi…",
    wifiOk: "On Wi‑Fi. Sending the first reading…",
    liveWithSensor: "First reading delivered from your {sensor}, with humidity. It's live: you can unplug it and mount it.",
    live: "First reading delivered. The probe is live: you can unplug it and mount it.",
    postUnreachable: "The board is on Wi‑Fi but couldn't reach ProbeHarbor. It keeps retrying; check that this network allows outgoing HTTPS (some guest networks block it).",
    postRejected: "ProbeHarbor answered {code} to the board's reading. It keeps retrying; if this stays, check System status or try again in a few minutes.",
    noReading:
      "The board has the settings but no reading arrived yet. Check the sensor wiring (data to GPIO 4, 4.7kΩ to 3.3V), then try again.",
    noAnswer: "No answer from the board. Make sure the firmware install finished, then try again.",
    noPortSelected: "No port selected.",
    couldNotTalk: "Could not talk to the board: {error}",
  },
};

export type BrowserFlasherMessages = typeof en;
export default en;
