
/**
 * /about/ingest-and-webhooks body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Code samples stay in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const sketches = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>`;
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer"><code>push_https_forward.py</code></a>`;
const kinds =
  "<code>temperature</code>, <code>humidity</code>, <code>co2</code>, <code>pressure</code>, <code>pm25</code>, <code>voc</code>, <code>level</code>, <code>energy</code>, <code>door</code>, <code>power</code>, <code>flood</code>, <code>motion</code>, <code>generic</code>";
const webhookKinds =
  "<code>threshold</code>, <code>rate</code>, <code>outage</code>, <code>forecast</code>, <code>rule</code>, <code>digest</code>";

const en = {
  introHtml:
    'In addition to pulling HTTPS JSON feeds, ProbeHarbor accepts push ingest from ESP32, Pico W, or Arduino devices and can fan alert notifications out to Discord, SMS, web push, and generic HTTPS webhooks for IFTTT or Home Assistant. For endpoint summaries and OpenAPI download, see the <a class="text-link" href="/docs/api">HTTP API reference</a>.',
  push: {
    title: "Push ingest",
    bodyHtml:
      'From <strong>Dashboard → Devices</strong>, create a push device and copy the ingest key from the callout (30 minutes, survives refresh). Sensors <strong>auto-import on first POST</strong>; manual mapping under Advanced is optional. Full walkthrough: <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. Send readings with:',
  },
  classicTitle: "Classic Arduino JSON",
  typed: {
    title: "Typed multi-sensor payload",
    kindsHtml: `Supported kinds: ${kinds}. Optional top-level <code>battery</code> / <code>battery_pct</code> and <code>rssi</code> update device health metadata. Sample CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C, and GNU AVR assembly sketches for DS18B20 / MAX31855 / MAX6675, plus Uno + W5100 (<code>ethernet_dht22_ingest</code>, classic <code>temp</code> JSON): ${sketches}. The Ethernet shield cannot TLS: pair it with ${relay} on a LAN host.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "If your firmware or gateway already publishes SenML JSON, POST the array directly, no wrapper object required. ProbeHarbor auto-detects SenML when native <code>temp</code> / <code>sensors[]</code> shapes are absent. Temperature uses unit <code>Cel</code> or <code>degF</code>; humidity uses <code>%RH</code>. Probe keys come from the SenML name (last path segment).",
    liveHtml:
      'Live sample: <a class="text-link" href="/api/feeds/example?format=senml">example SenML feed</a>. Pull feeds accept the same array when the configured JSON root is missing.',
  },
  ha: {
    title: "Home Assistant REST sensor JSON",
    bodyHtml:
      "A single REST sensor response: <code>state</code> plus <code>attributes.unit_of_measurement</code>: is also auto-detected on push ingest and pull feeds. Map probe key <code>state</code> (or the entity suffix for multi-entity payloads) on Devices.",
    liveHtml:
      'Live sample: <a class="text-link" href="/api/feeds/example?format=homeassistant">example HA REST feed</a>. For full HA setup (HACS, MQTT bridge, indoor reference), see <a class="text-link" href="/integrations/home-assistant">Home Assistant integration</a>.',
  },
  webhooks: {
    title: "Outbound alert webhooks",
    introHtml: "Pro accounts can enable an outbound webhook in alert settings. Each alert POSTs JSON:",
    kindsHtml: `<code>kind</code> may be ${webhookKinds}, or <code>generic</code>. When a webhook secret is set, the request includes <code>X-Signature</code> as a hex HMAC-SHA256 of the raw body. Use that in Home Assistant or IFTTT Webhooks to verify authenticity.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Install the official <a class="text-link" href="/integrations/home-assistant">HACS integration</a> for share-link sensors and snooze/vacation services. For <strong>alerts into HA</strong>, use the outbound HTTPS webhook (Pro) or import the blueprint. For <strong>MQTT readings into ProbeHarbor</strong>, see the <a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>Download HA blueprint (YAML)</a>',
    pointHtml:
      "Point your ProbeHarbor outbound webhook URL at <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (or a Cloudflare Tunnel / Nabu Casa URL). Verify <code>X-Signature</code> in a template condition if you set a secret.",
    mqttHtml:
      "For MQTT, have Home Assistant (or Node-RED) receive the webhook and publish to your broker, that keeps MQTT local while ProbeHarbor stays on HTTPS. The blueprint includes an optional MQTT topic input for that path.",
  },
  metrics: {
    title: "Grafana / Prometheus metrics",
    introHtml: "Pro accounts can create dashboard API keys (Dashboard → Share) and scrape:",
    shareHtml: "Or use a Pro share link with the <strong>Metrics</strong> scope:",
    grafanaHtml:
      "Or <code>?format=grafana</code> for a simple JSON datapoints array. History share scope returns a 7-day chart on the public page.",
  },
  channels: {
    title: "Alert channels",
    items: [
      "Email and Discord (all plans)",
      "Telegram bot token + chat id (your credentials)",
      "Slack Incoming Webhook URL (your credentials)",
      "Browser and Android push (every plan)",
      "Twilio SMS, outbound webhook (Pro)",
    ],
    rulesHtml:
      "Alerts also support forecast freeze risk, quiet hours, and composite AND rules (for example door open + temperature drop). See Dashboard → Alerts.",
    emailHtml:
      'Email alerts remain available on all plans. Weekly digests can be enabled independently of freeze/humidity threshold alerts. Opt-in city aggregates appear on <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Related guides",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">HTTP API documentation</a> OpenAPI download, ingest, metrics, and inbound webhooks',
      '<a class="text-link" href="/about/kit-qr-onboarding">Kit QR onboarding</a> encode your ingest URL on a hardware sticker',
      '<a class="text-link" href="/about/esp32-ota-firmware">ESP32 OTA and battery reporting</a> firmware updates plus <code>battery</code> / <code>rssi</code> fields',
      '<a class="text-link" href="/about/zapier-make-recipes">Zapier and Make.com recipes</a> outbound alert webhooks and inbound snooze automations',
    ],
  },
};

export type IngestAndWebhooksMessages = typeof en;
export default en;
