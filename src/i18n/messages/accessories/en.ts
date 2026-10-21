import { BRAND_NAME } from "../../../lib/brand";
import { BAYBUDDY_NAME } from "../../../lib/bayBuddy";
import { CLAIM_PUCK_REPO_URL } from "../../../lib/claimPuck";

/**
 * /accessories hub, the AccessoryProduct layout, and the eight accessory
 * product pages. `*Html` keys are trusted inline HTML rendered with
 * `set:html`; internal hrefs stay English (middleware localizes them).
 * Dashboard screen and button labels (Devices, Alerts, Claim this bay,
 * Drive puck mood) stay English because the dashboard is English-only.
 * Buy-link URLs live in the pages; only their labels are here.
 */

const BB = BAYBUDDY_NAME;
const repo = (label: string) =>
  `<a class="text-link" href="${CLAIM_PUCK_REPO_URL}" target="_blank" rel="noreferrer">${label}</a>`;

const en = {
  common: {
    breadcrumbHome: "Home",
    breadcrumbAccessories: "Accessories",
    defaultKicker: "Hardware accessory",
    kitKicker: "Kit / merch",
    faqTitle: (title: string) => `${title} FAQ`,
    faqLede: "What it does, what it does not replace, and how it fits ProbeHarbor.",
    relatedTitle: "Related accessories",
    allAccessories: "All accessories",
    claimPuck: "Claim puck",
    esp32FreezeKit: "ESP32 freeze kit",
    whatItIs: "What it is",
    parts: "Parts",
    setup: "Setup",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    does: "Does:",
    doesNot: "Does not:",
    devices: "Devices",
    alerts: "Alerts",
    sketch: "Sketch ↗",
    getBayBuddy: `Get ${BB}`,
    alertBeacon: "Alert beacon",
    momentaryButton: "Momentary button",
    buttonWhy: "GP4 to GND for claim confirm.",
    adafruitButton: "Adafruit button",
    adafruitEsp32: "Adafruit ESP32",
  },
  hub: {
    title: "Hardware accessories",
    description: `Companion devices and kit pieces for ${BRAND_NAME}: mood lights, door and leak contacts, labels, and mounts.`,
    kicker: "Hardware",
    lede: `Companion devices and kit pieces for ${BRAND_NAME}. Temperature probes stay on the freeze-kit path — these prove presence, show moods, POST contacts, or finish a garage install.`,
    freezeKitBom: "Freeze kit BOM",
    companionApps: "Companion apps",
    catalog: "Catalog",
    caption: "ProbeHarbor hardware accessories",
    colAccessory: "Accessory",
    colRole: "Role",
    colKind: "Kind",
    kindCompanion: "Companion",
    kindContact: "Contact sensor",
    kindKit: "Kit / merch",
    faqTitle: "Accessories FAQ",
    faqLede: "How accessories relate to probes, Bay Buddy, and the claim puck.",
  },
  claimPuck: {
    firmware: "Firmware on GitHub",
    claimApi: "HTTP claim API",
    doesHtml:
      "HMAC challenge–response over USB (press GP4 to confirm), binds the puck to a bay, then shows live freeze/flood mood on the onboard LED.",
    doesNotHtml:
      "replace probes, Overview, Alerts, or the insurance claims pack. It is a presence key and mood light for a bay you already monitor.",
    caption: "Claim puck parts",
    zeroWhy: "USB MCU with onboard RGB LED for claim + mood.",
    casePart: "Case / diffuser (optional)",
    caseWhy: "Desk-safe enclosure and softer mood glow.",
    caseBuy: "Claim puck case",
    stepsHtml: [
      `Flash ${repo("claim-puck CircuitPython")} onto an RP2040-Zero. Wire a momentary button from <strong>GP4</strong> to GND.`,
      'Connect at least one probe (or demo feed) on <a class="text-link" href="/dashboard/devices">Devices</a> so the bay has readings. Give devices a matching <code>space</code> label (e.g. garage).',
      `Install <a class="text-link" href="/bay-buddy">${BB}</a>, sign in, plug in the puck, then use <strong>Claim this bay</strong> and press the button when the LED turns yellow.`,
      "Optionally <strong>Drive puck mood</strong> so the LED follows <code>GET /api/bays/&lt;bay&gt;/mood</code>.",
    ],
    openBayBuddy: "Open Bay Buddy page",
    claimApiReference: "Claim API reference",
    caseDiffuser: "Case / diffuser",
  },
  claimPuckCase: {
    title: "Claim puck case",
    description: `Enclosure, claim button, and optional LED diffuser for the RP2040-Zero ${BRAND_NAME} claim puck — finish the bare-board build.`,
    firmware: "Firmware ↗",
    doesHtml:
      "Turns the Waveshare RP2040-Zero + GP4 button into a desk-safe presence key with a softer mood glow.",
    doesNotHtml:
      'Change the claim API. Same firmware and <a class="text-link" href="/bay-buddy">Bay Buddy</a> flow as the naked board.',
    caption: "Claim puck case parts",
    zeroWhy: "Claim puck MCU.",
    casePart: "3D-printed or laser case",
    caseWhy: "USB cutout, button hole, LED window. Publish your STL next to the firmware repo if you share one.",
    caseBuy: "DIY / local print shop.",
    diffuserPart: "LED diffuser (optional)",
    diffuserWhy: "Softer mood color for the onboard RGB.",
    diffuserBuy: "Adafruit diffuser",
    buildNotes: "Build notes",
    notesHtml: [
      "Leave USB clear for claim and mood drive from the host.",
      "Debounce is in firmware — a cheap tactile switch is enough.",
      'For a brighter hallway light, use an <a class="text-link" href="/alert-beacon">alert beacon</a> NeoPixel stick instead of overdriving the Zero LED.',
    ],
  },
  alertBeacon: {
    title: "Alert beacon",
    description: `A desk or hallway mood light that mirrors ${BRAND_NAME} freeze and flood moods. Same Bay Buddy mood API as the claim puck — not a temperature probe.`,
    moodApi: "Mood API",
    doesHtml: `Shows live bay mood (cozy, drafty, shiver, panic, offline, hero) on a brighter NeoPixel stick or ring, driven from <code>GET /api/bays/&lt;bay&gt;/mood</code> via ${BB}.`,
    doesNotHtml:
      'Sense temperature, replace Alerts SMS/email, or claim a bay by itself. Pair with a freeze probe and optionally a <a class="text-link" href="/claim-puck">claim puck</a> for presence.',
    caption: "Alert beacon parts",
    mcuPart: "RP2040-Zero (or Pico)",
    mcuWhy: "USB companion MCU; same host path as claim puck.",
    zeroBuy: "Amazon RP2040-Zero",
    picoBuy: "Adafruit Pico W",
    neopixelPart: "NeoPixel stick / ring",
    neopixelWhy: "Brighter hallway-visible mood than the Zero’s tiny LED.",
    stickBuy: "Adafruit stick",
    powerPart: "5V USB power",
    powerWhy: "Desk or wall wart; keep data wire short.",
    powerBuy: "Any quality USB supply.",
    stepsHtml: [
      `Flash ${repo("claim-puck firmware")} (or the alert-beacon pin map in that repo) and wire NeoPixel data to the documented GPIO.`,
      `Claim the bay once with a <a class="text-link" href="/claim-puck">claim puck</a> (or CLI), then enable <strong>Drive puck mood</strong> in ${BB} for the beacon serial port.`,
      'Confirm moods change when freeze margin drops or a <a class="text-link" href="/leak-puck">leak puck</a> goes wet.',
    ],
  },
  doorPuck: {
    title: "Door contact puck",
    description: `Magnetic reed or button contact that POSTs door open/closed to ${BRAND_NAME}. Feeds drafty-bay moods and optional custom alerts — not a freeze probe.`,
    addingDevices: "Adding devices",
    doesHtml:
      'POSTs <code>{ "door1": true }</code> (open) / <code>false</code> (closed) to your push ingest URL about once a minute or on change.',
    doesNotHtml:
      "Measure °F. Pair with a DS18B20 on the same or another device for freeze alerts. Bay mood uses door-open as <em>drafty</em> when wired into the bay sensors.",
    caption: "Door contact puck parts",
    esp32Why: "Wi‑Fi HTTPS POST (same as freeze kit).",
    reedPart: "Magnetic reed switch",
    reedWhy: "Garage / man-door. Wire to GPIO4 + GND (internal pull-up).",
    reedBuy: "Adafruit reed",
    stepsHtml: [
      "Create a push device on Devices (or reuse an existing garage device key).",
      "Download or copy <code>sketches/arduino/door_contact_ingest/</code>, set Wi‑Fi + <code>INGEST_URL</code>, flash.",
      "Open/close the door once; Serial 115200 should show <code>POST 200</code>. Rename <code>door1</code> on Devices.",
      "Optional: add a custom alert rule under Alerts for prolonged open, or rely on Bay Buddy <em>drafty</em> mood.",
    ],
  },
  leakPuck: {
    title: "Leak contact puck",
    description: `Water-contact pads that POST wet/dry flood sensors to ${BRAND_NAME}. Flood/leak contacts auto-alert when wet once alerts are enabled — not a freeze probe.`,
    doesHtml:
      'POSTs <code>{ "leak1": true }</code> when wet (or <code>flood1</code>). Keys containing leak/flood import as flood sensors.',
    doesNotHtml:
      "Replace a temperature probe. Place pads under water heaters, softeners, or laundry pans; keep the ESP32 dry and elevated.",
    caption: "Leak contact puck parts",
    esp32Why: "Wi‑Fi HTTPS POST.",
    probesPart: "Leak / moisture probes",
    probesWhy: "Two conductors on the floor; GPIO4 with pull-up, wet pulls low.",
    probesBuyHtml:
      'An LM393 "rain / water sensor" module powered from 3.3V, DO to the pin (easy starter part; its pads corrode if left wet), or two stainless screws about 5&nbsp;mm apart, one to the pin and one to GND (longer-lasting). Test with your own water: a thin film of clean water may not trip either.',
    stepsHtml: [
      "Create or reuse a push device. Flash <code>sketches/arduino/leak_contact_ingest/</code>.",
      "Bridge the pads with a damp cloth to test; expect <code>POST 200</code> and a wet reading.",
      "Enable alerts on Devices / Alerts essentials. Flood contacts auto-notify when wet — no separate rule required.",
    ],
  },
  powerNudge: {
    title: "Power outage nudge",
    description: `USB-mains or UPS sense contact that POSTs power lost/restored to ${BRAND_NAME}. Know when the bay went dark — not a freeze probe.`,
    staleReadings: "Stale readings",
    doesHtml:
      'POSTs <code>{ "power1": true }</code> while mains/USB sense is present, <code>false</code> when lost (keys with power/relay import as power sensors).',
    doesNotHtml:
      'Keep your ESP32 alive through a blackout by itself. Power the reporter from a UPS or always-on circuit if you need an “outage started” POST; otherwise <a class="text-link" href="/about/debugging-stale-readings">stale probe detection</a> covers silence when the freeze probe also dies.',
    caption: "Power nudge parts",
    esp32Part: "ESP32 on UPS / always-on",
    esp32Why: "Must stay up to report mains loss on another circuit.",
    sensePart: "USB / mains sense input",
    senseWhy: "Optocoupler or relay module: GPIO4 low = power present (active-low in sample).",
    senseBuy: "Electronics supplier; isolated USB or mains-sense module.",
    stepsHtml: [
      "Flash <code>sketches/arduino/power_sense_ingest/</code> with Wi‑Fi + ingest URL.",
      "Unplug the sensed USB/mains feed; confirm <code>power1</code> flips and POSTs.",
      "Combine with freeze probes: outage + cold snap is when pipes are most at risk. Use custom alert rules if you want SMS on power loss alone.",
    ],
  },
  kitLabels: {
    title: "Kit QR & NFC labels",
    description: `Printable QR stickers and optional NFC tags encoding your ${BRAND_NAME} push ingest URL — onboard firmware without typing the key.`,
    kitQrGuide: "Kit QR guide",
    claimsPack: "Claims pack",
    doesHtml:
      "Puts the full ingest URL on a sticker (QR) or NFC tag (NTAG213/215 URL record) so phone or laptop can scan during flash / HA setup.",
    doesNotHtml:
      "Sell branded drop-ship labels from ProbeHarbor. Print from the Devices QR callout (SVG download) or write NFC with any NDEF URL writer. Rotate the key if a sticker is lost.",
    caption: "Kit label parts",
    stockPart: "Waterproof label stock",
    stockWhy: "Garage / utility room stickers for device name + QR.",
    stockBuy: "Outdoor-rated sticker stock; print from the Devices QR SVG.",
    nfcPart: "NFC NTAG stickers",
    nfcWhy: "Optional tap-to-open ingest URL on Android / iPhone.",
    nfcBuy: "Adafruit NTAG213 sticker",
    stepsHtml: [
      'Create or rotate a push key on <a class="text-link" href="/dashboard/devices">Devices</a> — QR is visible about 30 minutes.',
      "Download the SVG or print device name + QR + URL on waterproof stock.",
      "Optional: write the same HTTPS ingest URL as an NDEF URI record on an NFC tag. Keep tags with the kit, not on a public door.",
      'Full walkthrough: <a class="text-link" href="/about/kit-qr-onboarding">Kit QR onboarding</a>.',
    ],
  },
  probeMountKit: {
    title: "Probe mount kit",
    description: `Zip-ties, pipe clips, adhesive pads, 4.7k pull-up, and waterproof DS18B20 mounting notes for a reliable ${BRAND_NAME} freeze probe.`,
    mountingGuide: "Mounting guide",
    picoIngest: "Pico W ingest",
    doesHtml:
      "Names the physical bits that make a garage probe stay put and read pipe/air temperature honestly.",
    doesNotHtml:
      'A ProbeHarbor-branded drop-ship box. Buy parts from Adafruit / Amazon using the lists below and the <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit BOM</a>.',
    bom: "BOM",
    caption: "Probe mount kit BOM",
    ds18b20Part: "Waterproof DS18B20",
    ds18b20Why: "1m+ lead, stainless tip for pipe / crawlspace.",
    ds18b20Buy: "Adafruit DS18B20",
    resistorPart: "4.7kΩ resistor",
    resistorWhy: "1-Wire pull-up to 3.3V.",
    resistorBuy: "Amazon 4.7k",
    zipPart: "UV zip-ties",
    zipWhy: "Secure probe to pipe or strut without crushing the tip.",
    zipBuy: "McMaster UV zip-ties",
    clipPart: "Pipe clip / cable mount",
    clipWhy: "Optional rigid hold on copper / PEX.",
    clipBuy: "McMaster cable-tie mounts",
    padsPart: "Adhesive pads",
    padsWhy: "Mount the ESP32 enclosure on painted drywall or joists.",
    padsBuy: "Adafruit foam tape",
    placementTips: "Placement tips",
    tipsHtml: [
      "Prefer pipe metal or insulated tip contact over dangling in a sunny doorway.",
      "Keep the ESP32 dry; only the probe tip belongs in damp crawlspaces.",
      'Validate swings with the <a class="text-link" href="/about/probe-demo">probe demo</a> and <a class="text-link" href="/about/probe-mounting-enclosures">mounting enclosures</a> article.',
    ],
  },
};

export type AccessoriesMessages = typeof en;
export default en;
