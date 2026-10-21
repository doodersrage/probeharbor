
/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "ProbeHarbor ist kein MQTT-Broker. Behalte Mosquitto, ESPHome oder das MQTT von Home Assistant in deinem LAN und spiegle ausgewählte Topics über HTTPS, damit Frost- und Leckage-SMS/-E-Mails für den Haushalt und der Verlauf in der Cloud liegen, ohne dass der Broker offen im Netz steht.",
  curlTitle: "Schnelle Brücke (curl)",
  curlHtml:
    "Lege unter Dashboard → Devices ein <strong>Push-Gerät</strong> an, kopiere den Ingest-Schlüssel, ordne die JSON-Schlüssel deinem MQTT-Payload zu und sende dann einen POST:",
  devicesHtml:
    'Das vollständige Anlegen von Geräten (Push oder Pull) beschreibt <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Payload-Formate und ausgehende Alarm-Webhooks: <a class="text-link" href="/about/ingest-and-webhooks">Ingest-API und Alarm-Webhooks</a>.',
  haTitleHtml: "Home Assistant <code>rest_command</code>",
  haHtml:
    'Lieber automatische Entitäten über einen Freigabelink? Nutze die <a class="text-link" href="/integrations/home-assistant">offizielle HACS-Integration</a>. Für reines MQTT-Spiegeln:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Importiere <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, richte die MQTT-Nodes auf deinen Broker, setze <code>PROBEHARBOR_INGEST_KEY</code> und deploye. Produktleitfaden: <a class="text-link" href="/integrations/node-red">Node-RED-Integration</a>. Ausführliche Beschreibung: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">Entwicklerdoku zur MQTT-Brücke</a>.',
  relatedTitle: "Weiterführend",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: Parallelbetrieb mit MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor oder MQTT im Eigenbau</a>',
    '<a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>',
    '<a class="text-link" href="/docs/api">HTTP-API</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

export default de;
