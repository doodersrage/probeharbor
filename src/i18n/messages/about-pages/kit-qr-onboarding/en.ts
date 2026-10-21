
/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */

const en = {
  pathTitle: "Guided kit path",
  pathSteps: [
    'Buy an ESP32 + waterproof DS18B20. <a class="text-link" href="/about/esp32-freeze-kit">parts list</a> (Adafruit / Amazon; ProbeHarbor does not sell hardware).',
    'Create a push device on <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (one click: named Workshop probe by default).',
    "Copy or scan the ingest QR (visible for 30 minutes after create/rotate).",
    "Flash firmware or point Home Assistant at that URL: sensors auto-import on first POST.",
    'Set freeze °F + email on the inline first-alert card on Devices, or open <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, then send a test.',
    'Optional: <a class="text-link" href="/dashboard/share/links">Share a family live link</a> (included on Free).',
  ],
  encodeTitle: "What to encode",
  encodeHtml:
    'After creating or rotating a push key on <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, the key callout shows a QR for the full ingest URL (visible for 30 minutes, survives refresh):',
  encodeWarningHtml:
    "Anyone scanning the QR on a phone sees the URL, keep devices physically secure; rotate keys if a sticker is lost.",
  nfcTitle: "NFC tags (optional)",
  nfcHtml:
    'Write the same HTTPS ingest URL as an NDEF URI record on an NTAG213/215 sticker. Phones can tap to open the URL during setup. Keep tags with the kit — they are as sensitive as a printed QR. Parts and print tips: <a class="text-link" href="/kit-labels">Kit QR &amp; NFC labels</a>.',
  devicesQrTitle: "QR on the Devices page",
  devicesQrHtml:
    'The QR is generated in-app when you create or rotate a push key, no external QR generators required. You can download the SVG or print a simple label (device name + QR + URL) from that callout. See also the curl test payload in <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; webhooks</a>.',
  checklistTitle: "Onboarding checklist",
  checklistHtml:
    'Prefer to see readings before flashing firmware? Use <strong>Try without hardware</strong> on Overview for the demo pull feed, browse the public <a class="text-link" href="/demo">live demo</a>, then create a push device and scan the QR.',
  gettingStartedHtml:
    "The dashboard getting-started card tracks device creation, first POST, and alerts. Sensor keys auto-import when firmware POSTs JSON: pair the QR with payload keys like <code>temp1</code>, <code>door1</code>, then rename labels on Devices if needed.",
};

export type Messages = typeof en;
export default en;
