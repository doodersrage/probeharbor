
/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const A = '<a class="text-link" target="_blank" rel="noreferrer" href=';
const ETH_INGEST = `${A}"${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>`;
const RELAY = `${A}"${REPO}/blob/main/sketches/relay/push_https_forward.py"><code>push_https_forward.py</code></a>`;
const SKETCHES = `${A}"${REPO}/tree/main/sketches">sketches/</a>`;
const FIRMWARE = `${A}"https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>`;

const en = {
  intro:
    "The probe hardware runs on Arduino-compatible microcontrollers. Firmware: commonly called a sketch: reads sensors on a timer, formats the results as JSON, and serves them over the network so the website and other clients can fetch live data without serial cables.",
  responsibilitiesTitle: "Sketch responsibilities",
  responsibilities: [
    "Initialize sensor buses and the local 16×2 LCD for on-site readouts.",
    "Read each DHT22 probe with retry logic for transient bus errors.",
    "Compute an average across healthy probes for a quick summary value in JSON.",
    "Respond to HTTP requests with a compact JSON document via the Ethernet shield.",
    "Optionally log errors to serial for on-site debugging.",
  ],
  jsonTitle: "Typical JSON shape",
  jsonHtml:
    "Consumers expect a top-level <code>temp</code> object with numeric keys for each probe plus <code>avg</code>. Humidity appears alongside temperature per probe. Keeping keys stable matters more than pretty printing: dashboard mappings reference those keys directly.",
  pushJsonHtml:
    'For <a class="text-link" href="/about/ingest-and-webhooks">push ingest</a>, the same probe object can be posted to <code>/api/ingest/&lt;key&gt;</code>. Optional top-level <code>battery</code> (or <code>battery_pct</code>) and <code>rssi</code> fields update device health on the Devices page without requiring extra sensor keys.',
  pushTitle: "Push ingest from the Ethernet shield",
  pushHtml: `The W5100 stack on an Uno cannot TLS, so it cannot POST directly to <code>https://probeharbor.dev</code>. Use ${ETH_INGEST} to POST the classic <code>temp</code> JSON over HTTP (DHT22 on A4/A5, optional JSON on port 80 for LAN pull). Run ${RELAY} on a Pi, NAS, or laptop so those POSTs reach ProbeHarbor over HTTPS. ESP32 Wi‑Fi samples that speak TLS live in ${SKETCHES}.`,
  wiringTitle: "Hardware wiring guides",
  wiringLede:
    "The physical build uses an Arduino Uno, W5100 Ethernet shield, breadboard, contrast potentiometer, 16×2 LCD, and two DHT22 sensors. Three companion pages document the schematics and pin map in detail:",
  networkTitle: "Network stack choices",
  networkHtml: `This revision uses an Ethernet shield on SPI. The sketch handles DHCP, reconnect loops, and JSON serving while the LCD continues to show live probe values. When TLS is too heavy for the MCU, a Python relay can terminate HTTPS: see <a class="text-link" href="/about/python-feeds">Python scripts and feeds</a>. For push ingest from the same shield, see ${ETH_INGEST}.`,
  rev2Alt: "ProbeHarbor revision-two probe board with Ethernet shield, LCD, and DHT22 sensors",
  rev2Caption: "ProbeHarbor revision two: Ethernet, LCD readout, and dual DHT22 inputs in one stack.",
  workflowTitle: "Development workflow",
  workflow:
    "Sketches are edited in the Arduino IDE or PlatformIO, flashed over USB, then verified with serial logging before the board is mounted in the monitored space. Confirm JSON shape with curl before adding the feed URL to the website dashboard.",
  samplesHtml: `Ready-to-adapt samples for DS18B20, MAX31855, MAX6675, and Uno + Ethernet live in this repo under ${SKETCHES}. Raspberry Pi Pico W / Pico 2 W uses the same ingest JSON with <a class="text-link" href="/about/pico-w-ingest">CircuitPython or MicroPython</a>. Full Ethernet + DHT + LCD firmware: ${FIRMWARE}.`,
  tipsTitle: "Reliability tips",
  tips: [
    "Watchdog resets recover from rare network hangs without climbing a ladder.",
    "Separate sensor power noise from MCU power where long cable runs exist.",
    "Version your JSON schema in documentation when adding fields.",
    "Document which GPIO pins map to which physical probe labels, see the pin wiring guide.",
  ],
};

export type Messages = typeof en;
export default en;
