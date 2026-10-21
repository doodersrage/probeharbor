
/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */

const en = {
  introHtml:
    "Every number on the home page travels through several layers. Understanding that pipeline helps when debugging stale readings, missing probes, or history gaps.",
  step1Title: "Step 1. Sensing in the space",
  step1Html:
    'Probes measure temperature and humidity. The Arduino sketch polls them every few seconds, discards obvious outliers, and prepares an in-memory JSON structure. Details: <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a> and <a class="text-link" href="/about/temperature-probes">temperature probes</a>.',
  step2Title: "Step 2. Publishing JSON",
  step2Html:
    'The board or a nearby relay exposes HTTPS JSON. A Python FastAPI service may cache responses in Redis so the wider internet never hits the residential uplink directly: see <a class="text-link" href="/about/python-feeds">Python scripts and feeds</a>.',
  jsonAlt: "Browser JSON viewer showing temp probe keys 0, 1, and avg with Fahrenheit Celsius and humidity",
  jsonCaption: "Live feed payload shape consumed by the website after leaving the local network.",
  step3Title: "Step 3. Website fetch and display",
  step3Html:
    "When you load the home page, server code retrieves each configured feed URL, parses probe keys, and renders stat cards. Signed-in users load feed and probe mappings from Supabase instead of defaults. Weather data follows a parallel path via OpenWeather using your optional city override.",
  step4Title: "Step 4. Persisting history",
  step4Html:
    'If you are authenticated, successful probe reads insert rows into Supabase with feed name, probe label, key, temperatures, humidity, and timestamp. Guests still see live data but do not append history. Learn more in <a class="text-link" href="/about/historical-data">historical data usage</a>.',
  step5Title: "Step 5. Dashboard and export",
  step5Html:
    'The history table paginates those rows. CSV export streams the full set for admins and subscribers. Stripe webhooks maintain membership in the export-capable group. Account tools are described in <a class="text-link" href="/about/accounts-and-dashboard">accounts and dashboard</a>.',
  failuresTitle: "Failure points to check",
  failures: [
    "Probe wiring or power: serial logs on the Arduino.",
    "Home network or certificate: curl the feed URL from a laptop on LTE.",
    "Relay cache stale: restart upstream pull in fast-api-relay.",
    "Dashboard mapping: probe key typos hide readings even when JSON is valid.",
    "Auth cookies: history saves only for signed-in sessions.",
  ],
};

export type Messages = typeof en;
export default en;
