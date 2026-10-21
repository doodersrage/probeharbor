import type { IntegrationTaglinesOverlay } from "../index";

export default {
  haDescription:
    "Externe Frost- und Leckalarme für Home Assistant: Warnung bei Kälte und wenn Home Assistant selbst verstummt. Offizielle HACS-Integration.",
  matterTagline:
    "Matterbridge-Plugin, das einen ProbeHarbor-Freigabelink in Apple Home, Google Home und Alexa spiegelt – nicht CSA-zertifiziert, kein Sensor.",
  automationTagline:
    "Ausgehende Pro-Alarm-Webhooks in IFTTT oder n8n empfangen, Frost in Google Sheets oder Notion protokollieren, Pausieren per POST aus anderen Flows.",
  influxTagline:
    "Pro-Prometheus-Metriken nach InfluxDB, VictoriaMetrics oder in jeden Telegraf-Output holen – derselbe /api/v1/metrics-Vertrag wie bei Grafana.",
  nodeRedTagline:
    "Importiere einen fertigen Flow, der Mosquitto-Topics per HTTPS an ProbeHarbor spiegelt – der Broker bleibt lokal.",
  smartThingsTagline:
    "Mit dem ProbeHarbor-Matterbridge-Plugin sehen SmartThings (und Apple/Google) deine Garagensensoren – ohne eigene Cloud-to-Cloud-App.",
} satisfies IntegrationTaglinesOverlay;
