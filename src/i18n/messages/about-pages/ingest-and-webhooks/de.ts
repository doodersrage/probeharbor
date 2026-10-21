
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
import type { IngestAndWebhooksMessages } from "./en";

const de: IngestAndWebhooksMessages = {
  introHtml:
    'Neben dem Abrufen von HTTPS-JSON-Feeds nimmt ProbeHarbor Push-Daten von ESP32-, Pico-W- oder Arduino-Geräten an und kann Alarmbenachrichtigungen an Discord, SMS, Web-Push und generische HTTPS-Webhooks für IFTTT oder Home Assistant verteilen. Eine Übersicht der Endpunkte und den OpenAPI-Download findest du in der <a class="text-link" href="/docs/api">HTTP-API-Referenz</a>.',
  push: {
    title: "Push-Ingest",
    bodyHtml:
      'Lege unter <strong>Dashboard → Devices</strong> ein Push-Gerät an und kopiere den Ingest-Schlüssel aus dem Hinweis (30 Minuten, übersteht ein Neuladen). Sensoren werden <strong>beim ersten POST automatisch importiert</strong>; die manuelle Zuordnung unter Advanced ist optional. Komplette Anleitung: <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Sende Messwerte so:',
  },
  classicTitle: "Klassisches Arduino-JSON",
  typed: {
    title: "Typisierter Multisensor-Payload",
    kindsHtml: `Unterstützte Typen: ${kinds}. Optionale Felder auf oberster Ebene, <code>battery</code> / <code>battery_pct</code> und <code>rssi</code>, aktualisieren die Zustandsdaten des Geräts. Beispiel-Sketches in CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C und GNU-AVR-Assembler für DS18B20 / MAX31855 / MAX6675 sowie Uno + W5100 (<code>ethernet_dht22_ingest</code>, klassisches <code>temp</code>-JSON): ${sketches}. Das Ethernet-Shield kann kein TLS: Kombiniere es mit ${relay} auf einem Rechner im LAN.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "Wenn deine Firmware oder dein Gateway bereits SenML-JSON veröffentlicht, sende das Array direkt per POST, ohne umschließendes Objekt. ProbeHarbor erkennt SenML automatisch, wenn die nativen Formate <code>temp</code> / <code>sensors[]</code> fehlen. Temperatur nutzt die Einheit <code>Cel</code> oder <code>degF</code>, Luftfeuchte <code>%RH</code>. Die Fühlerschlüssel stammen aus dem SenML-Namen (letztes Pfadsegment).",
    liveHtml:
      'Live-Beispiel: <a class="text-link" href="/api/feeds/example?format=senml">Beispiel-SenML-Feed</a>. Pull-Feeds akzeptieren dasselbe Array, wenn der konfigurierte JSON-Stamm fehlt.',
  },
  ha: {
    title: "REST-Sensor-JSON von Home Assistant",
    bodyHtml:
      "Die Antwort eines einzelnen REST-Sensors (<code>state</code> plus <code>attributes.unit_of_measurement</code>) wird bei Push-Ingest und Pull-Feeds ebenfalls automatisch erkannt. Ordne auf Devices den Fühlerschlüssel <code>state</code> zu (oder bei Payloads mit mehreren Entitäten das Entitätssuffix).",
    liveHtml:
      'Live-Beispiel: <a class="text-link" href="/api/feeds/example?format=homeassistant">Beispiel-HA-REST-Feed</a>. Für die vollständige HA-Einrichtung (HACS, MQTT-Bridge, Innenreferenz) siehe die <a class="text-link" href="/integrations/home-assistant">Home-Assistant-Integration</a>.',
  },
  webhooks: {
    title: "Ausgehende Alarm-Webhooks",
    introHtml: "Pro-Konten können in den Alarmeinstellungen einen ausgehenden Webhook aktivieren. Jeder Alarm sendet dieses JSON per POST:",
    kindsHtml: `<code>kind</code> kann ${webhookKinds} oder <code>generic</code> sein. Ist ein Webhook-Secret gesetzt, enthält die Anfrage <code>X-Signature</code> als hexadezimalen HMAC-SHA256 des Roh-Bodys. Nutze ihn in Home Assistant oder IFTTT Webhooks, um die Echtheit zu prüfen.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Installiere die offizielle <a class="text-link" href="/integrations/home-assistant">HACS-Integration</a> für Sensoren aus Freigabelinks und Dienste zum Stummschalten/für den Urlaubsmodus. Für <strong>Alarme in HA</strong> nutzt du den ausgehenden HTTPS-Webhook (Pro) oder importierst den Blueprint. Für <strong>MQTT-Messwerte in ProbeHarbor</strong> siehe das <a class="text-link" href="/about/mqtt-bridge">MQTT-Bridge-Rezept</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>HA-Blueprint herunterladen (YAML)</a>',
    pointHtml:
      "Richte die URL deines ausgehenden ProbeHarbor-Webhooks auf <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (oder eine Cloudflare-Tunnel- bzw. Nabu-Casa-URL). Prüfe <code>X-Signature</code> in einer Template-Bedingung, wenn du ein Secret gesetzt hast.",
    mqttHtml:
      "Für MQTT lässt du Home Assistant (oder Node-RED) den Webhook empfangen und an deinen Broker veröffentlichen – so bleibt MQTT lokal, während ProbeHarbor bei HTTPS bleibt. Der Blueprint enthält dafür eine optionale Eingabe für das MQTT-Topic.",
  },
  metrics: {
    title: "Grafana-/Prometheus-Metriken",
    introHtml: "Pro-Konten können Dashboard-API-Schlüssel anlegen (Dashboard → Share) und Folgendes abfragen:",
    shareHtml: "Oder nutze einen Pro-Freigabelink mit dem Bereich <strong>Metrics</strong>:",
    grafanaHtml:
      "Oder <code>?format=grafana</code> für ein einfaches JSON-Array mit Datenpunkten. Der Freigabebereich für den Verlauf liefert ein 7-Tage-Diagramm auf der öffentlichen Seite.",
  },
  channels: {
    title: "Alarmkanäle",
    items: [
      "E-Mail und Discord (alle Tarife)",
      "Telegram-Bot-Token + Chat-ID (deine Zugangsdaten)",
      "Slack-Incoming-Webhook-URL (deine Zugangsdaten)",
      "Browser- und Android-Push (jeder Tarif)",
      "Twilio-SMS, ausgehender Webhook (Pro)",
    ],
    rulesHtml:
      "Alarme unterstützen außerdem prognostiziertes Frostrisiko, Ruhezeiten und kombinierte UND-Regeln (zum Beispiel Tor offen + Temperaturabfall). Siehe Dashboard → Alerts.",
    emailHtml:
      'E-Mail-Alarme bleiben in allen Tarifen verfügbar. Wöchentliche Zusammenfassungen lassen sich unabhängig von Frost- und Luftfeuchte-Schwellenalarmen aktivieren. Freiwillig geteilte Städtewerte erscheinen unter <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Verwandte Anleitungen",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">HTTP-API-Dokumentation</a>: OpenAPI-Download, Ingest, Metriken und eingehende Webhooks',
      '<a class="text-link" href="/about/kit-qr-onboarding">Einrichtung per Kit-QR-Code</a>: deine Ingest-URL auf einem Aufkleber für die Hardware',
      '<a class="text-link" href="/about/esp32-ota-firmware">ESP32-OTA und Akkustand</a>: Firmware-Updates plus die Felder <code>battery</code> / <code>rssi</code>',
      '<a class="text-link" href="/about/zapier-make-recipes">Rezepte für Zapier und Make.com</a>: ausgehende Alarm-Webhooks und eingehende Stummschalt-Automationen',
    ],
  },
};

export default de;
