import type { IntegrationCardOverlay } from "../index";

export default {
  "home-assistant": {
    summary:
      "Offizielle Custom-Integration: Sensoren per Freigabelink, Dienste für Pausieren/Urlaub, optionaler Push-Ingest. Parallelbetrieb mit MQTT in deinem LAN.",
    tier: "Familien-Livelink (Free) · Pro für Verlauf/Metriken + eingehende Webhooks",
    cta: "Installationsanleitung",
    secondaryLabel: "Rezepte für Notify / TTS",
  },
  matter: {
    summary:
      "Matterbridge-Plugin, das einen Freigabelink abfragt und Temperatur, Luftfeuchte, Leck, Tür, Strom und Bewegung an Apple Home, Google Home und Alexa weitergibt. Läuft auf einem Rechner im LAN – nicht CSA-zertifiziert.",
    tier: "Familien-Livelink (Free) · Pro für den Snooze-Schalter",
    cta: "Anleitung zur Matter-Bridge",
    secondaryLabel: "Plugin auf GitHub",
  },
  smartthings: {
    title: "SmartThings (über Matter)",
    summary:
      "Keine Cloud-to-Cloud-App: Füge die ProbeHarbor-Matterbridge in deinem LAN hinzu, damit SmartThings dieselben Garagensensoren sieht wie Apple Home.",
    tier: "Familien-Livelink (Free)",
    cta: "Weg zu SmartThings",
    secondaryLabel: "Matter-Bridge",
  },
  "node-red": {
    summary:
      "Importiere einen fertigen Flow, der Mosquitto-Topics per HTTPS an ProbeHarbor spiegelt. Der Broker bleibt lokal; optionaler Tab für Türsensoren.",
    cta: "Node-RED-Anleitung",
    secondaryLabel: "Flow-JSON herunterladen",
  },
  "mqtt-bridge": {
    title: "MQTT-Bridge",
    summary:
      "Behalte Mosquitto lokal und spiegle Messwerte per HTTPS-JSON-Push oder Pull-Feeds – für Frost- und Leckalarme im ganzen Haushalt samt Verlauf.",
    cta: "Bridge-Rezept",
    secondaryLabel: "Entwicklerdoku",
  },
  webhooks: {
    title: "Webhooks für Alarme & Messwerte",
    summary: "Pro-Webhooks funktionieren in beide Richtungen: Einstellung unter Dashboard → Alerts / Share.",
    cta: "Anleitung in der App",
    bullets: [
      "Ausgehend: Alarm-POSTs (optional mit HMAC) und Messwert-Webhooks mit hohem Volumen beim Ingest",
      "Eingehend: Endpunkte für Pausieren / Urlaub / Status für HA, Zapier, n8n oder Make",
    ],
    secondaryLabel: "Payload-Referenz",
  },
  grafana: {
    summary:
      "Frag GET /api/v1/metrics mit einem Dashboard-API-Schlüssel ab; das mitgelieferte Grafana-Dashboard-JSON lädst du unter Dashboard → Share herunter.",
    tier: "Pro-API-Schlüssel",
    cta: "HTTP-API (Metriken)",
    secondaryLabel: "Doku zum Grafana-Dashboard",
  },
  influx: {
    summary:
      "Hol dieselben Pro-Prometheus-Metriken nach InfluxDB 2.x, VictoriaMetrics oder in jeden Telegraf-Output.",
    tier: "Pro-API-Schlüssel",
    cta: "Influx-/Telegraf-Anleitung",
    secondaryLabel: "Telegraf-Konfiguration herunterladen",
  },
  thermostat: {
    summary:
      "Auf probeharbor.dev verbinden Pro-Haushalte Nest oder Ecobee unter Dashboard → Temperature und sehen den Sollwert im Haus neben den Sensoren in Dachboden, Kriechkeller und Werkstatt. Bei selbst gehosteten Instanzen muss der Betreiber zuerst die OAuth-Client-Secrets aktivieren.",
    tier: "Pro (auf probeharbor.dev aktiviert)",
    cta: "vs. Nest / Ecobee",
    secondaryLabel: "OAuth-Einrichtung für Betreiber",
  },
  "esphome-shelly": {
    summary:
      "HTTP-POST-Rezepte für DHT-/BME-Sensoren und Shelly-Türkontakte, ganz ohne eigene Arduino-Firmware.",
    cta: "Rezepte für LAN-Sensoren",
  },
  "personal-weather": {
    summary:
      "Nutze deine Wetterstation im Garten für Außenwerte, NWS-Warnungen (USA) und das Frostrisiko laut Vorhersage.",
    cta: "Stationseinrichtung",
  },
  zapier: {
    summary:
      "Empfange ausgehende Alarm-Hooks oder sende eingehende Pausier-Aktionen per POST aus No-Code-Automationen.",
    cta: "Rezepte",
  },
  automation: {
    summary:
      "IFTTT-Maker-Webhooks, selbst gehostetes n8n, Alarmprotokolle in Google Sheets und Notion-Datenbanken – alles aus derselben ausgehenden Pro-Payload.",
    tier: "Ausgehender Pro-Webhook",
    cta: "IFTTT-/n8n-Anleitung",
    secondaryLabel: "Workflow n8n → Sheets",
  },
  "freeze-map-embed": {
    title: "Frostkarte einbetten & Badge",
    summary:
      "Bette die öffentliche Opt-in-Frostrisikokarte in einen Blog, ein Home-Assistant-Dashboard oder eine README ein: iframe-Einbettung plus Markdown-Badge.",
    tier: "Öffentlich (Opt-in-Aggregate)",
    cta: "Einbettung & Badge",
  },
} satisfies IntegrationCardOverlay;
