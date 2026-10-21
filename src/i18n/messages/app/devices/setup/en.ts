/**
 * Devices → Add device: first-run paths, the post-setup checklist, the first
 * alert card and other ways to connect (DevicesFirstRunCard, DeviceSetupWizard,
 * FirstAlertSetupCard, DeviceIntegrationsStrip).
 */
const en = {
  firstRun: {
    title: "Connect your first sensor",
    subtitle: "Pick what you have today. Each path ends with a live reading; freeze and leak alerts come right after.",
    viewOnly: "View-only, ask an owner to add a device.",
    limitReached: "Device limit reached.",
    limitUpgrade: "Upgrade for more devices",
    haveSensors: {
      title: "I already have sensors",
      copy: "Home Assistant, ESPHome, or an MQTT broker. We create a device and hand you a copy-paste snippet with its key. About 5 minutes.",
    },
    haveBoard: {
      title: "I have a board to flash",
      copy: "An ESP32 with a DS18B20, DHT22, or I²C sensor: install the firmware from this browser over USB, no Arduino IDE. Pico W and Arduino get a pre-filled sketch instead.",
      create: "Create device & flash it",
      otherBoards: "Other board guides",
      browserFlasher: "Browser flasher (beta)",
      espOptions: "ESP32 flashing options",
      cellular: "Cellular",
    },
    noHardware: {
      title: "No hardware yet",
      copy: "See the dashboard working now with a live example feed, then build the ESP32 freeze kit (about $25) when you're ready.",
      demo: "Try it with a demo feed",
      kitParts: "ESP32 freeze kit parts list",
    },
    also: "Also:",
    jsonFeed: "HTTPS JSON feed",
    leakPucks: "Leak pucks",
    httpApi: "HTTP API",
  },
  funnel: {
    title: "You're receiving data",
    firstPost: "First POST received",
    alertDone: "Freeze alert configured",
    alertTodo: "Set freeze °F + email, then send a test",
    shareLink: "Share a live link with family",
    optional: ": optional",
    renameHtml:
      'Sensor names look fine as-is. <a class="text-link" href="/dashboard/devices?view=setup&rename_sensors=1">Rename later</a> on the device card if you want.',
    setAlert: "Set freeze + email",
    sendTest: "Send a test alert",
    overview: "Overview",
    guides: "Hardware setup guides",
    kitQr: "Kit QR",
    cellular: "Cellular",
  },
  firstAlert: {
    title: "Set your first cold + water alert",
    subtitle:
      "One threshold and an email, no need to leave Devices. Wet flood/leak contacts auto-alert once alerts are on (and bypass snooze/vacation). Add Telegram, Discord, and more later.",
    savedAndTested: "Cold + water alert saved and test sent, check your inbox.",
    saved: "Cold + water alert saved.",
    testFailed:
      "Settings saved, but the test could not be delivered. Confirm the email address or try again from Alerts.",
    freezeLabel: "Freeze threshold (°F)",
    emailLabel: "Alert email",
    emailPlaceholder: "you@example.com",
    saveAndTest: "Save + send test",
    saveOnly: "Save only",
    fullSettings: "Full alert settings",
  },
  integrations: {
    title: "Other ways to connect",
    subtitle:
      "ESP32, Pico W, STM32, CH32V, or AVR assembly push ingest is the default. Expand a path below for copy-paste setup.",
    claimPuck: {
      summary: "Claim puck (RP2040-Zero)",
      stepsHtml: [
        "Flash claim-puck firmware and wire a button from GP4 to GND.",
        "Set device <code>space</code> labels to match the bay you will claim (e.g. garage).",
        'In <a class="text-link" href="/bay-buddy">Bay Buddy</a>, connect your account, plug in the puck, claim the bay, then optionally drive the mood LED.',
      ],
      productPage: "Product page",
      caseDiffuser: "Case / diffuser",
      claimApi: "Claim API",
    },
    contacts: {
      summary: "Door / leak / power contacts",
      stepsHtml: [
        "Flash ESP32 sketches under <code>sketches/arduino/door_contact_ingest</code>, <code>leak_contact_ingest</code>, or <code>power_sense_ingest</code>.",
        "POST <code>door1</code> / <code>leak1</code> / <code>power1</code> bools to your ingest URL.",
      ],
      doorPuck: "Door puck",
      leakPuck: "Leak puck",
      powerNudge: "Power nudge",
      allAccessories: "All accessories",
    },
    beacon: {
      summary: "Alert beacon & kit pieces",
      bodyHtml:
        'Mood NeoPixel <a class="text-link" href="/alert-beacon">alert beacon</a>, <a class="text-link" href="/kit-labels">QR / NFC labels</a>, and <a class="text-link" href="/probe-mount-kit">probe mount kit</a> — companions and merch, not freeze probes.',
    },
    homeAssistant: {
      summary: "Home Assistant REST",
      stepsHtml: [
        "Create a push device above and copy the ingest URL.",
        "In HA, use a <code>rest</code> sensor or automation with <code>resource: https://probeharbor.dev/api/ingest/YOUR_KEY</code>.",
        'POST entity JSON. ProbeHarbor reads <code>friendly_name</code> for labels. <a class="text-link" href="/integrations/home-assistant">Full HA guide</a>',
      ],
    },
    mqtt: {
      summary: "MQTT → HTTPS bridge",
      stepsHtml: [
        "Keep Mosquitto on your LAN. ProbeHarbor is not an MQTT broker.",
        'Import the Node-RED flow from <a class="text-link" href="/dashboard/share/integrations#node-red">Integrations → Node-RED</a> or run the Python bridge in <code>scripts/mqtt-bridge.py</code>.',
        "Set <code>PROBEHARBOR_INGEST_KEY</code> to your push device key.",
        '<a class="text-link" href="/about/mqtt-bridge">MQTT bridge docs</a>',
      ],
    },
    esphome: {
      summary: "ESPHome / Shelly LAN",
      bodyHtml:
        "Point ESPHome <code>rest</code> or Shelly HTTP at your ingest URL, or expose HTTPS JSON for a pull feed.",
      recipes: "ESPHome & Shelly recipes",
    },
    ingestFormats: "Ingest formats",
    allIntegrations: "All integrations",
  },
};

export type DevicesSetupMessages = typeof en;
export default en;
