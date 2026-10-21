
/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */

const en = {
  howTo: {
    name: "Build an ESP32 freeze probe for ProbeHarbor",
    steps: [
      {
        name: "Buy the freeze BOM",
        text: "Get an ESP32 with Wi-Fi, a waterproof DS18B20, and a 4.7kΩ pull-up if the probe pack does not include one. Prefer Adafruit product pages; Amazon /dp/ links are optional alternatives.",
      },
      {
        name: "Wire the DS18B20",
        text: "Connect VCC to 3.3V, GND to GND, and data to GPIO 4 with a 4.7kΩ pull-up between data and 3.3V. Strap the stainless tip to the coldest pipe or north wall.",
      },
      {
        name: "Create a push device",
        text: "Create a free ProbeHarbor account and a push device on Dashboard → Devices, and copy its device key.",
      },
      {
        name: "Install from the browser and verify",
        text: "Plug the ESP32 into USB, open the web flasher in Chrome or Edge, install the firmware, and send your Wi-Fi and device key. The page confirms when the first reading arrives. No Arduino IDE needed.",
      },
      {
        name: "Enable freeze alerts",
        text: "Set freeze threshold and email under Alerts → When to alert, send a test alert, and optionally turn on the time-to-freeze warning.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor does not sell hardware. Buy the parts below, then install the firmware from your browser with the <a class="text-link" href="/flash">web flasher</a>: no Arduino IDE, no code, and it sends the board your Wi‑Fi and device key over the same USB cable. If you\'d rather read or edit the code, the sketches under <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> expect an <strong>ESP32 with Wi‑Fi</strong> and a <strong>waterproof DS18B20</strong>. Buy the parts below (Adafruit for known SKUs, Amazon product links when you want a cheaper DevKit), then create a push device and flash a pre-filled sketch from <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> instead.',
  bom: {
    title: "Recommended freeze BOM",
    caption: "Parts for an ESP32 freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardPart: "ESP32 board",
    boardWhy: "HTTPS push ingest over Wi‑Fi (TLS on-chip)",
    amazonDevKit: "Amazon DevKit",
    probePart: "Waterproof DS18B20",
    probeWhy: "Pipe / crawlspace probe; works below freezing",
    includesPullupHtml: "(includes 4.7&nbsp;kΩ)",
    amazonProbe: "Amazon probe",
    pullupPartHtml: "4.7&nbsp;kΩ pull-up",
    pullupWhy: "Required on the 1-Wire data line if the probe pack does not include one",
    amazonResistor: "Amazon 4.7k",
    powerPart: "USB power",
    powerWhy: "Wall wart or USB-C cable; keep the board warmer than the probe bay when you can",
    powerBuyHtml: "Any 5&nbsp;V USB supply rated ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Product listings rotate: treat Adafruit as the reference BOM. Amazon <code>/dp/</code> links in <code>bomLinks</code> are Associates-friendly alternatives when a listing is still live. Generic “ESP32 + DS18B20 kit” bundles often ship DHT11 instead of a waterproof probe — skip those.",
  wire: {
    title: "Wire it",
    diagramAlt: "Wiring diagram: ESP32 DevKit to waterproof DS18B20 with 4.7 kilohm pull-up on GPIO 4",
    captionHtml:
      "Red → 3.3&nbsp;V, black → GND, yellow/white data → GPIO 4, with a 4.7&nbsp;kΩ pull-up between data and 3.3&nbsp;V. The sample ingest sketch defaults to GPIO 4.",
    itemsHtml: [
      "<strong>Red</strong> (VCC) → ESP32 3.3&nbsp;V",
      "<strong>Black</strong> (GND) → GND",
      "<strong>Yellow / white</strong> (data) → GPIO 4 (sample sketch default; any free digital GPIO works if you change the pin)",
      "4.7&nbsp;kΩ between data and 3.3&nbsp;V",
    ],
    featherHtml:
      'On an Adafruit Feather (HUZZAH32 or ESP32 Feather V2), GPIO 4 is the pin labelled <strong>A5</strong>. See the <a class="text-link" href="/flash#feather-pins">Feather notes on the flasher page</a> for the extras.',
    strap:
      "Strap the stainless probe to the coldest pipe or north wall with a cable tie, then wrap foam insulation over probe + a short pipe segment so you read pipe temperature, not room air.",
  },
  flash: {
    title: "Flash and connect",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Create a free account</a> and a push device on Devices.',
      'Open the <a class="text-link" href="/flash">web flasher</a> in Chrome or Edge, plug in the ESP32, click Install, then send your Wi‑Fi and device key. It reports "First reading delivered" when the probe is live.',
      'Prefer code? Download the pre-filled Arduino <code>.ino</code> or MicroPython <code>.py</code> from Devices and flash it per <a class="text-link" href="/about/esp32-web-flash">ESP32 flashing options</a> (Serial 115200 should show <code>POST 200</code>).',
      'Optional: print the ingest <a class="text-link" href="/about/kit-qr-onboarding">kit QR</a> on the enclosure.',
      'Set freeze threshold + email under <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> and turn on the time-to-freeze warning if you want a heads-up before the probe crosses freeze.',
    ],
  },
  avoid: {
    title: "What not to buy for pipe freeze",
    itemsHtml: [
      "<strong>DHT11-only starter kits</strong>: weak below freezing; short leads; not waterproof.",
      "<strong>Bluetooth / Zigbee room pods</strong>: they do not speak ProbeHarbor push ingest.",
      "<strong>Uno + Ethernet alone</strong>: needs a LAN HTTPS relay; fine for advanced builds, not first kit.",
    ],
    dhtNoteHtml: `DHT22 still works for shop air + humidity (your Ethernet garage case study). For pipes, prefer DS18B20. High-temp PTFE cable: {highTempLink} if the probe sits near a water heater or heat tape.`,
  },
  extras: {
    title: "Optional extras",
    itemsHtml: [
      "Second DS18B20 on the same 1-Wire bus for door bay vs pipe wall (multi-zone).",
      "Ventilated ABS enclosure + cable gland for the ESP32 in a dusty garage.",
      "ELEGOO / generic ESP32 starter kits are fine <em>if</em> you still add a waterproof DS18B20: their bundled DHT11 is not the freeze probe.",
    ],
  },
  related: {
    title: "Related",
    labels: [
      "Adding push and pull devices",
      "ESP32 flashing options",
      "Raspberry Pi Pico W ingest",
      "Kit QR onboarding",
      "Probe mount kit",
      "Hardware accessories",
      "Probe mounting and enclosures",
      "Freeze season checklist",
    ],
  },
};

export type Esp32FreezeKitMessages = typeof en;
export default en;
