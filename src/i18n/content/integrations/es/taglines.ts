import type { IntegrationTaglinesOverlay } from "../index";

export default {
  haDescription:
    "Alertas externas de heladas y fugas para Home Assistant: aviso cuando hace frío y cuando el propio Home Assistant deja de responder. Integración HACS oficial.",
  matterTagline:
    "Plugin de Matterbridge que lleva un enlace de ProbeHarbor a Apple Home, Google Home y Alexa. Sin certificación CSA; no es una sonda.",
  automationTagline:
    "Recibe los webhooks de alertas de Pro en IFTTT o n8n, registra heladas en Google Sheets o Notion y pospón alertas desde otros flujos.",
  influxTagline:
    "Recoge las métricas Prometheus de Pro en InfluxDB, VictoriaMetrics o cualquier salida de Telegraf, con el mismo /api/v1/metrics que Grafana.",
  nodeRedTagline:
    "Importa un flujo listo para usar que replica topics de Mosquitto en ProbeHarbor por HTTPS; el broker sigue en local.",
  smartThingsTagline:
    "Usa el plugin de Matterbridge de ProbeHarbor para ver los sensores del garaje en SmartThings (y Apple/Google), sin app Cloud-to-Cloud aparte.",
} satisfies IntegrationTaglinesOverlay;
