
/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */

const en = {
  introHtml:
    "Cabins, wells, and outbuildings often have power but no garage Wi‑Fi. A <strong>Particle Boron</strong> (or B-Series) LTE board POSTs the same ingest JSON through a <strong>Particle Console webhook</strong>. Cellular dropouts are normal: ProbeHarbor already marks probes stale when posts stop, so you do not need an aggressive on-device retry storm.",
  bluesHtml:
    "Prefer Blues? A <strong>Notecard</strong> + Notehub route can forward the same JSON; the Boron sketch is the first-class download from Devices.",
  partsTitle: "Parts",
  partsCaption: "Parts for a cellular freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boronWhy: "LTE-M / NB-IoT (region SKU). Nano-SIM or Particle SIM plan required.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Pipe / crawlspace probe. Data on <strong>D2</strong>.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 3.3V.",
  planPart: "Cellular plan",
  planWhy: "Particle cloud + carrier data. Budget for remote sites that only wake hourly.",
  planBuy: "Particle Console billing or your own nano-SIM where the SKU allows it.",
  bluesPart: "Optional: Blues Notecard",
  bluesWhy: "Alternate cellular path via Notehub webhook route (same ingest URL).",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>D2</strong>, 4.7k to 3V3",
    "USB for flash and 115200 serial; antenna attached before field deploy",
  ],
  flashTitle: "Flash and webhook",
  stepsHtml: [
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>Particle Boron .ino</strong> plus the webhook JSON (ingest URL filled in).',
    "Flash with Particle Workbench or Web IDE (Device OS 5+). Libraries: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: event <code>probeharbor_ingest</code>, POST to your ingest URL, use the downloaded webhook JSON (or set the body to the Particle event value), Content-Type <code>application/json</code>.",
    "Serial 115200: <code>publish ok</code>. Webhook history should show HTTP 200. Sensor key <code>temp1</code> imports on first successful POST.",
  ],
  repoLead: "Repo listing:",
  dropoutsTitle: "Dropouts and stale probes",
  dropoutsHtml:
    'LTE will miss intervals in weather, roaming, or prepaid outages. Keep posting about once a minute when connected; let <a class="text-link" href="/about/debugging-stale-readings">stale-reading detection</a> and freeze alerts cover silence. Do not burn battery on tight reconnect loops.',
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    stale: "Debugging stale readings",
    teensy: "Teensy 4.1 Ethernet",
    pic18: "PIC18F67J60 Ethernet",
    allSketches: "All sketches ↗",
  },
};

export type Messages = typeof en;
export default en;
