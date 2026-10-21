
/**
 * /about/adding-devices body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI labels
 * (Devices, Create push device, Reveal ingest key…) stay English because the
 * dashboard is English-only.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const DEV = "https://probeharbor.dev/developers";
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer">`;
const downloads =
  "<strong>Download Arduino .ino</strong> / <strong>MicroPython .py</strong> / <strong>CircuitPython code.py</strong> / <strong>Zephyr main.c</strong> / <strong>CH32V main.c</strong> / <strong>AVR main.S</strong> / <strong>Teensy 4.1 .ino</strong> / <strong>PIC18 main.c</strong> / <strong>Particle Boron .ino</strong> / <strong>ESPHome snippet</strong>";
const curlBlock = '<a class="text-link" href="/api/feeds/example?format=ingest">';

const en = {
  introHtml: [
    'ProbeHarbor accepts readings two ways: your hardware <strong>pushes</strong> JSON to an ingest URL, or we <strong>pull</strong> HTTPS JSON from a public feed on a schedule. Both are configured under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. New ESP / battery nodes should use push. Pull is for always-on LAN servers or relays that already expose HTTPS JSON.',
    'A free account (no credit card) ties your ingest key to your household so history and alerts stay private. Browse the <a class="text-link" href="/demo">live demo</a> first if you want to see readings without signing up.',
  ],
  choose: {
    title: "Choose push or pull",
    colPush: "Push ingest",
    colPull: "Pull feed",
    rowsHtml: [
      ["Who initiates", "Your device", "ProbeHarbor"],
      ["Network", "Device needs outbound HTTPS (Uno Ethernet: HTTP to a LAN TLS relay)", "Feed URL must be publicly reachable"],
      ["Auth", "Per-device key in URL; flash callout + Reveal ingest key", "Public HTTPS URL (TLS)"],
      [
        "JSON shape",
        "Flat keys, <code>temp</code> object, <code>sensors[]</code>, SenML, or HA REST",
        "Nested <code>temp</code> root (default); SenML or HA REST auto-detected",
      ],
      [
        "Best for",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + LAN HTTPS relay), Arduino Uno + Ethernet",
        "Ethernet servers, FastAPI relays",
      ],
    ] as [string, string, string][],
  },
  push: {
    title: "Push device (recommended)",
    stepsHtml: [
      'Sign in and open <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Under <strong>Push devices</strong>, click <strong>Create push device</strong> (named Workshop probe by default: rename anytime).",
      `On the ingest callout: scan the QR, or use ${downloads} (ingest URL or path pre-filled). The key stays on the page for 30 minutes and survives refresh until you dismiss it.`,
      "<strong>Lost the key later?</strong> On the device card use <strong>Reveal ingest key</strong> (when key recovery is enabled on the server) or <strong>Rotate key</strong> to issue a new one. Devices created before key recovery was enabled need one rotate to store a recoverable encrypted copy.",
      'Flash an ESP32 (see <a class="text-link" href="/about/esp32-web-flash">flashing options</a>: Arduino IDE, PlatformIO, MicroPython, or Espressif web esptool) or a Pico W ( <a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>) or an STM32 Nucleo ( <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>) or a CH32V307 ( <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>) or an Uno in GNU AVR assembly ( <a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>) or a Teensy 4.1 ( <a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>) or a PIC18F67J60 ( <a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) or a Particle Boron ( <a class="text-link" href="/about/cellular-ingest">LTE webhook</a>). Need parts first? <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit BOM</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">AVR assembly</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a>, or <a class="text-link" href="/about/cellular-ingest">cellular</a> (waterproof DS18B20). Serial at <strong>115200</strong> should show <code>POST 200</code> (or <code>publish ok</code> on Boron). Sensor keys import automatically (flat keys, <code>temp</code> object, SenML, or Home Assistant REST). Rename sensors on the Devices page afterward. Manual mapping under <strong>Advanced</strong> is optional for pre-mapping keys.',
      `More samples (Uno Ethernet + DHT22, MAX31855, MAX6675, etc.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. W5100 cannot TLS. POST HTTP to a LAN relay (<a class="text-link" href="/about/python-feeds">Python feeds</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Smoke-test with curl, then open <a class="text-link" href="/dashboard/live">Live</a> while signed in. Within about 30 minutes without a post, Live warns that a probe may be offline.',
    ],
  },
  curl: {
    title: "Example curl (push)",
    introHtml: `Fetch a live sample body from the ${curlBlock}example ingest feed</a> (weather-driven), then POST it to your device key.`,
    payloadsHtml: `Payload styles: flat keys, classic <code>temp</code> object, typed <code>sensors[]</code>, <strong>SenML (RFC 8428)</strong>, or <strong>Home Assistant REST</strong> <code>state</code> JSON: are documented in <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks</a> and the developer <a class="text-link" href="${DEV}/ingest/">push ingest</a> reference. Try live samples: ${curlBlock}native</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Pull feed",
    step1Html: "Confirm your feed returns HTTPS JSON. Classic shape (default root key <code>temp</code>):",
    stepsHtml: [
      'Open <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Add a feed: name, HTTPS URL, and <strong>JSON root key</strong> (default <code>temp</code>). Use <strong>Test feed URL</strong> before saving.",
      "Click <strong>Save pull setup</strong>: probe keys auto-import from the live feed. Rename labels on the same page, or click <strong>Accept suggested names</strong>.",
      'Click <strong>Fetch now</strong> to pull readings immediately, or wait for the next scheduled poll and confirm cards on <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Pull feeds expect nested probe objects under the configured root by default (not flat push-style keys). <strong>SenML JSON arrays</strong> and <strong>Home Assistant REST</strong> responses are auto-detected when that root is missing: paste the URL as-is and map the probe keys SenML or HA expose (e.g. <code>0</code>, <code>state</code>). If the MCU cannot do TLS (Uno + W5100 Ethernet shield), use a local HTTPS relay (see <a class="text-link" href="/about/python-feeds">Python feeds</a> or the stdlib ${relay}HTTP→HTTPS forwarder</a> for push ingest).`,
  },
  mqtt: {
    title: "Already on MQTT?",
    bodyHtml:
      'Keep Mosquitto or Home Assistant MQTT on your LAN and mirror readings over HTTPS.    ProbeHarbor is not an MQTT broker. Full recipe (curl, HA <code>rest_command</code>, Node-RED): <a class="text-link" href="/about/mqtt-bridge">MQTT bridge guide</a>. See also <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs DIY MQTT</a>.',
  },
  verify: {
    title: "Verify you’re live",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: live cards update; lagging probes show a yellow offline warning after ~30 minutes.',
      "<strong>Devices → Status</strong>: last seen, battery, and RSSI when the payload includes them (after first live reading).",
      "<strong>Freeze essentials</strong>: set freeze °F + email on Devices after first POST, or under Alerts → When to alert, then send a test (unlocks full Overview after first-run).",
      "<strong>Overview</strong>: space status; after essentials, Status metrics (freeze hours, coldest margin, indoor−outdoor ΔT, probe spread) and <strong>Insights</strong> (nights-at-risk, door/power/motion, air quality). Week charts can overlay humidity and dew point when RH is present.",
    ],
  },
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">Ingest API and alert webhooks</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Kit QR onboarding</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configuring temperature feeds</a> (pull deep-dive)',
      '<a class="text-link" href="/about/debugging-stale-readings">Debugging stale readings</a>',
      `<a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a> · <a class="text-link" href="/compare/diy-mqtt">vs DIY MQTT</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">developer MQTT docs</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Developer: push ingest</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">pull feeds</a>`,
    ],
  },
};

export type AddingDevicesMessages = typeof en;
export default en;
