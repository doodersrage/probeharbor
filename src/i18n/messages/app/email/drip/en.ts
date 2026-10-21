/**
 * Onboarding drip emails (day 1/3/7, setup-help variants, confirm reminder).
 * Link URLs are added in code; only labels live here.
 */
const en = {
  day1: {
    subject: "Add your first probe to ProbeHarbor",
    eyebrow: "Getting started",
    preheader: "Create a device key, POST JSON, sensors auto-import — about 10 minutes.",
    title: "Connect your first probe",
    intro: "Welcome to ProbeHarbor. Your free account is ready — next step is a live reading on Home.",
    paragraphs: [
      "Open Devices and pick what you have. Each path creates a device and hands you a snippet with its key; sensors auto-import on the first reading.",
    ],
    bullets: [
      "Sensors in Home Assistant, ESPHome, or MQTT: copy-paste YAML or a relay, about 5 minutes",
      "An ESP32, Pico W, or Arduino: download a sketch pre-filled with your ingest URL",
      "No hardware yet: one click adds a live demo feed so you can see the dashboard work",
    ],
    cta: "Open Devices",
    secondaryCta: "Adding devices guide",
  },
  day3: {
    subject: "Turn on freeze and leak alerts before the next surprise",
    eyebrow: "Freeze and flood protection",
    preheader:
      "Most unconditioned spaces start freeze alerts around 34°F — and wet flood contacts notify automatically once alerts are on.",
    title: "Don’t wait for the cold snap or a wet pad",
    intro:
      "ProbeHarbor can reach you when temperatures drop toward freezing or a leak contact goes wet — email and push now, plus SMS on Pro.",
    paragraphs: [
      "Set a freeze threshold on your coldest zone, enable the channels you actually check, and send a test while you’re awake. Add a wet/dry flood contact on a heater pan, laundry, or sump when you have one.",
    ],
    bullets: [
      "Start freeze near 34–38°F, then tune after you see overnight lows",
      "Enable quiet-hour bypass for freeze and flood alerts",
      "Optional: invite household members so someone else sees the ping",
    ],
    cta: "Configure alerts",
    secondaryCta: "Cold-snap playbook",
  },
  day7: {
    subject: "Try Pro free — SMS, webhooks, and more share scopes",
    eyebrow: "Pro trial",
    preheader: "SMS, WhatsApp, Pro share scopes, and webhooks — 14-day free trial.",
    title: "Level up with a free Pro trial",
    intro:
      "You’ve had a week to explore ProbeHarbor. Pro adds the channels and sharing tools that matter at 2 a.m. (Free already includes one family live link.)",
    paragraphs: ["Start a 14-day trial from Pricing — cancel anytime from the dashboard billing portal."],
    bullets: [
      "SMS and browser push freeze and leak alerts",
      "History, metrics, and never-expire share links plus embeds",
      "Outbound webhooks plus up to {maxDevices} devices per property",
    ],
    cta: "Compare plans & start trial",
    secondaryCta: "Open dashboard",
  },
  day3Setup: {
    subject: "Still setting up? Three quick ways to a first reading",
    eyebrow: "Getting started",
    preheader: "Home Assistant, a flashed ESP32, or a one-click demo feed.",
    title: "Your dashboard is waiting for a first reading",
    intro:
      "Nothing has reported in yet. Pick whichever you have today; each takes a few minutes from Devices → Setup.",
    paragraphs: [] as string[],
    bullets: [
      "Home Assistant, ESPHome, or MQTT: we generate the YAML or relay command with your key",
      "ESP32 + DS18B20 (about $25): download a sketch with your ingest URL already filled in",
      "Nothing yet: add the demo feed to see charts and alerts work before buying parts",
    ],
    cta: "Open Devices setup",
    secondaryCta: "ESP32 freeze kit parts",
  },
  day7Setup: {
    subject: "What are you trying to connect?",
    eyebrow: "Setup help",
    preheader: "Tell us your sensor or hub and we'll point you at the shortest path.",
    title: "Stuck on setup? Tell us what you have",
    intro:
      "Your account still has no readings. If a sensor, hub, or board didn't fit one of the setup paths, send a note with what you're using and we'll help you get it reporting.",
    paragraphs: [
      "Freeze season is close. A single probe near the coldest pipe is enough to get an alert before it matters.",
    ],
    bullets: [] as string[],
    cta: "Ask for setup help",
    secondaryCta: "Open Devices setup",
  },
  confirm: {
    subject: "Confirm your email to finish setting up ProbeHarbor",
    eyebrow: "One step left",
    preheader: "Your account is waiting on email confirmation; links expire, so grab a fresh one.",
    title: "Confirm your email to sign in",
    intro:
      "You started a ProbeHarbor account but the address was never confirmed, so sign-in is still locked.",
    paragraphs: [
      "Confirmation links expire. Request a fresh one, click it, and you'll land on Devices ready to connect a first sensor (or a demo feed if you have no hardware yet).",
    ],
    bullets: [] as string[],
    cta: "Send a new confirmation link",
    secondaryCta: "Sign in",
  },
};

export type DripEmailMessages = typeof en;
export default en;
