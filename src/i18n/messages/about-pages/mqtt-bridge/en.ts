
/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */

const en = {
  introHtml:
    "ProbeHarbor is not an MQTT broker. Keep Mosquitto, ESPHome, or Home Assistant MQTT on your LAN, then mirror selected topics over HTTPS so household freeze and leak SMS/email and history live in the cloud without exposing the broker.",
  curlTitle: "Quick bridge (curl)",
  curlHtml:
    "Create a <strong>push device</strong> under Dashboard → Devices, copy the ingest key, map JSON keys to match your MQTT payload, then POST:",
  devicesHtml:
    'Full device creation (push vs pull) is covered in <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. Payload shapes and outbound alert webhooks: <a class="text-link" href="/about/ingest-and-webhooks">Ingest API and alert webhooks</a>.',
  haTitleHtml: "Home Assistant <code>rest_command</code>",
  haHtml:
    'Prefer automatic entities from a share link? Use the <a class="text-link" href="/integrations/home-assistant">official HACS integration</a>. For MQTT-only mirroring:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Import <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, point MQTT nodes at your broker, set <code>PROBEHARBOR_INGEST_KEY</code>, and deploy. Product guide: <a class="text-link" href="/integrations/node-red">Node-RED integration</a>. Extended write-up: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">developer MQTT bridge docs</a>.',
  relatedTitle: "Related",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: dual-run with MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs DIY MQTT</a>',
    '<a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>',
    '<a class="text-link" href="/docs/api">HTTP API</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

export type Messages = typeof en;
export default en;
