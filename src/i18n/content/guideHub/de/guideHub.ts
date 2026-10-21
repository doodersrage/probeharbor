import type { GuideHubOverlay } from "..";

export default {
  categories: {
    hardware: {
      title: "Hardware einrichten",
      description: "Sensoren, Verkabelung, Firmware und das Anlegen von Push-/Pull-Geräten im Dashboard.",
    },
    alerts: {
      title: "Alarme",
      description: "Frostschwellenwerte, Leckalarme, Leitfäden für Kälteeinbrüche und Benachrichtigungskanäle.",
    },
    sharing: {
      title: "Teilen",
      description: "Haushaltszugriff, die Handy-App, die du heute schon installieren kannst, und öffentliche Statusseiten.",
    },
    integrations: {
      title: "Integrationen",
      description:
        "Home Assistant HACS, Matter / Apple Home, Node-RED, Influx, MQTT→HTTPS-Bridge, ESPHome/Shelly und Vergleichsratgeber. Payload-Schemas stehen unter API.",
    },
    api: {
      title: "API",
      description:
        "Ingest-Payloads, ausgehende Webhooks, OpenAPI und Zapier/Make. Das Anlegen von Geräten steht unter Hardware, HACS und MQTT unter Integrationen.",
    },
  },
  links: {
    "/accessories": {
      label: "Hardware-Zubehör",
      summary: "Claim Puck, Alarmleuchte, Tür-/Leck-/Stromkontakte, Kit-Etiketten, Halterungen.",
    },
    "/claim-puck": { label: "Claim Puck", summary: "RP2040-Zero-Anwesenheitsschlüssel und Stimmungs-LED für den Stellplatz." },
    "/leak-puck": {
      label: "Leak Puck (Leckkontakt)",
      summary: "Wassersensor-Pads, die Nass/Trocken-Hochwassersensoren per POST melden.",
    },
    "/stories/garage-freeze-alert": {
      label: "Frost-Szenario",
      summary: "Wie ein Ausfall der Garagenheizung um 2 Uhr nachts aussieht, Alarm für Alarm.",
    },
    "/stories/water-heater-pad-leak": {
      label: "Leck-Szenario",
      summary: "Wie ein Nässekontakt unter dem Warmwasserbereiter in der Garage ein Tropfen meldet, bevor es den Boden durchnässt.",
    },
    "/apps": { label: "Begleit-Apps", summary: "Android-, Desktop-, Bay-Buddy- und PWA-Clients für dein Konto." },
    "/android": {
      label: "Android-App (Early Access)",
      summary: "GitHub-Build zum manuellen Installieren, solange die Play-Prüfung läuft; die PWA funktioniert schon heute.",
    },
    "/integrations": {
      label: "Integrationsübersicht",
      summary: "Home Assistant HACS, Matter, Node-RED, Influx, MQTT, Grafana, Webhooks, Nest/Ecobee, Zapier, IFTTT/n8n.",
    },
    "/integrations/home-assistant": {
      label: "Home Assistant (HACS)",
      summary:
        "Offizielle Custom-Integration: Sensoren per Freigabelink, Dienste für Pause/Urlaub, optionaler Push-Ingest.",
    },
    "/integrations/matter": {
      label: "Matter / Apple Home",
      summary:
        "Matterbridge-Plugin: Sensoren per Freigabelink in Apple Home, Google Home und Alexa (nicht CSA-zertifiziert).",
    },
    "/integrations/node-red": { label: "Node-RED", summary: "MQTT→HTTPS-Flow importieren; Mosquitto bleibt lokal." },
    "/integrations/influx": {
      label: "InfluxDB & Telegraf",
      summary: "Pro-Prometheus-Metriken in Influx oder VictoriaMetrics abgreifen.",
    },
    "/integrations/automation": {
      label: "IFTTT, n8n & Sheets",
      summary: "Ausgehende Webhooks an IFTTT/n8n; Alarme in Sheets oder Notion protokollieren.",
    },
    "/compare/diy-mqtt": {
      label: "Im Vergleich zu DIY-MQTT",
      summary: "Wann gehostete Frost- und Leckalarme besser sind als selbst betriebenes Mosquitto mit Cron.",
    },
    "/docs/api": {
      label: "HTTP-API-Dokumentation",
      summary: "Ingest, Metriken, Webhooks und die OpenAPI-Spezifikation.",
    },
  },
} satisfies GuideHubOverlay;
