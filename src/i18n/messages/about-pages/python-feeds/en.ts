
/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */

const en = {
  intro:
    "Microcontrollers excel at reading probes; Python excels at caching, authentication, and serving stable HTTPS endpoints. The fast-api-relay project sits between Arduino JSON and the Astro site, normalizing responses and reducing load on fragile embedded stacks.",
  relayTitle: "Why a relay layer helps",
  relayBody:
    "Direct browser fetches to a LAN IP address break when DNS changes, certificates expire, or the home uplink drops. A relay on a VPS or cloud worker presents one consistent URL, adds Redis caching so dashboards do not hammer the probe, and can aggregate multiple sites if you expand beyond a single property.",
  fastapiTitle: "FastAPI responsibilities",
  fastapiItemsHtml: [
    "Accept upstream fetches from the Arduino or local network agent on a schedule.",
    "Store the latest payload in Redis with a short TTL.",
    "Serve <code>GET /...</code> responses instantly from cache for the website.",
    "Log stale data when upstream stops updating: useful for alerting.",
  ],
  consumerTitle: "Example consumer fetch",
  consumerBodyHtml:
    "The Astro site’s fetch layer requests your configured HTTPS URL, parses the <code>temp</code> object (or auto-detects SenML / Home Assistant REST JSON when that root is missing), and maps keys to dashboard probes. The same URL can power Node scripts, Grafana JSON plugins, or Home Assistant REST sensors.",
  figureAlt: "Browser JSON viewer showing temp probe keys 0, 1, and avg with Fahrenheit Celsius and humidity",
  figureCaption: "Example relay payload shape the website expects after caching upstream Arduino JSON.",
  scriptsTitle: "Operational scripts",
  scriptsBody:
    "Beyond the API, small Python utilities validate JSON schema, backfill CSV archives, or compare probe averages against OpenWeather forecasts. Because probes expose plain JSON, you can prototype analytics in a notebook before promoting logic into production services.",
  repoTitle: "Repository reference",
  repoBodyHtml:
    'Implementation details, Redis configuration, and deployment notes for the relay are maintained in <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>. Configure the public relay URL in your <a class="text-link" href="/dashboard/devices">temperature feed settings</a> after signing in.',
  unoTitle: "Uno Ethernet: HTTP→HTTPS for push ingest",
  unoBodyHtml:
    'A W5100 shield cannot POST to <code>https://probeharbor.dev</code>. The stdlib relay <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a> listens for HTTP from the Arduino and forwards the same path and body over HTTPS. Pair it with <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a> (DHT22 on A4/A5, classic <code>temp</code> JSON).',
};


export type PythonFeedsMessages = typeof en;
export default en;
