import type { IntegrationTaglinesOverlay } from "../index";

export default {
  haDescription:
    "Alertas externos de congelamento e vazamento para o Home Assistant, inclusive quando o próprio HA fica em silêncio. Integração oficial do HACS.",
  matterTagline:
    "Plugin do Matterbridge que espelha um link do ProbeHarbor no Apple Home, Google Home e Alexa — sem certificação CSA, não é uma sonda.",
  automationTagline:
    "Receba webhooks de alertas Pro no IFTTT ou n8n, registre congelamentos no Google Sheets ou Notion e envie snooze de entrada a partir de outros fluxos.",
  influxTagline:
    "Colete métricas Prometheus do Pro no InfluxDB, VictoriaMetrics ou qualquer saída do Telegraf — o mesmo contrato /api/v1/metrics do Grafana.",
  nodeRedTagline:
    "Importe um fluxo pronto para espelhar tópicos do Mosquitto para o ProbeHarbor por HTTPS — mantenha o broker local.",
  smartThingsTagline:
    "Use o plugin Matterbridge do ProbeHarbor para que o SmartThings (e Apple/Google) vejam os sensores da garagem — sem app Cloud-to-Cloud separado.",
} satisfies IntegrationTaglinesOverlay;
