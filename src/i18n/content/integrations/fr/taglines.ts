import type { IntegrationTaglinesOverlay } from "../index";

export default {
  haDescription:
    "Alertes gel et fuite externes pour Home Assistant : soyez prévenu quand il fait froid et quand Home Assistant ne répond plus. Intégration HACS officielle.",
  matterTagline:
    "Plugin Matterbridge qui reflète un lien de partage ProbeHarbor dans Apple Home, Google Home et Alexa — non certifié CSA, ce n’est pas une sonde.",
  automationTagline:
    "Recevez les webhooks d’alerte Pro dans IFTTT ou n8n, consignez le gel dans Google Sheets ou Notion et mettez en pause depuis d’autres flows.",
  influxTagline:
    "Collectez les métriques Prometheus Pro dans InfluxDB, VictoriaMetrics ou toute sortie Telegraf — même contrat /api/v1/metrics que Grafana.",
  nodeRedTagline:
    "Importez un flow prêt à l’emploi pour répliquer les topics Mosquitto vers ProbeHarbor en HTTPS — le broker reste local.",
  smartThingsTagline:
    "Le plugin Matterbridge de ProbeHarbor affiche vos capteurs du garage dans SmartThings (et Apple/Google), sans app Cloud-to-Cloud séparée.",
} satisfies IntegrationTaglinesOverlay;
