import type { IntegrationCardOverlay } from "../index";

export default {
  "home-assistant": {
    summary:
      "Integração personalizada oficial: sensores via link de compartilhamento, serviços de snooze/férias e ingestão push opcional. Rode em paralelo com MQTT na sua rede local.",
    tier: "Link ao vivo para a família (Free) · Pro para histórico/métricas + entrada",
    cta: "Guia de instalação",
    secondaryLabel: "Receitas de notificação / TTS",
  },
  matter: {
    summary:
      "Plugin do Matterbridge que consulta um link de compartilhamento e expõe temperatura, umidade, vazamento, porta, energia e movimento ao Apple Home, Google Home e Alexa. Roda em um host da rede local — sem certificação CSA.",
    tier: "Link ao vivo para a família (Free) · Pro para o interruptor de snooze",
    cta: "Guia da ponte Matter",
    secondaryLabel: "Plugin no GitHub",
  },
  smartthings: {
    summary:
      "Sem app Cloud-to-Cloud: adicione o Matterbridge do ProbeHarbor na sua rede local para que o SmartThings veja os mesmos sensores da garagem que o Apple Home.",
    tier: "Link ao vivo para a família (Free)",
    cta: "Caminho para SmartThings",
    secondaryLabel: "Ponte Matter",
  },
  "node-red": {
    summary:
      "Importe um fluxo pronto para espelhar tópicos do Mosquitto para o ProbeHarbor por HTTPS. Mantenha o broker local; aba opcional para sensor de porta.",
    cta: "Guia do Node-RED",
    secondaryLabel: "Baixar o JSON do fluxo",
  },
  "mqtt-bridge": {
    title: "Ponte MQTT",
    summary:
      "Mantenha o Mosquitto local; espelhe as leituras por HTTPS com push de JSON ou feeds pull e tenha alertas de congelamento e vazamento para a família, além de histórico.",
    cta: "Receita da ponte",
    secondaryLabel: "Documentação para desenvolvedores",
  },
  webhooks: {
    title: "Webhooks de alertas e leituras",
    summary: "Os webhooks do Pro funcionam nos dois sentidos: configure em Dashboard → Alerts / Share.",
    cta: "Guia no app",
    bullets: [
      "Saída: POSTs de alerta (HMAC opcional) e webhooks de leituras de alto volume na ingestão",
      "Entrada: endpoints de snooze / férias / status para HA, Zapier, n8n ou Make",
    ],
    secondaryLabel: "Referência de payload",
  },
  grafana: {
    title: "Grafana e Prometheus",
    summary:
      "Colete GET /api/v1/metrics com uma chave de API do dashboard; baixe o JSON do dashboard do Grafana incluído em Dashboard → Share.",
    tier: "Chave de API Pro",
    cta: "API HTTP (métricas)",
    secondaryLabel: "Documentação do dashboard do Grafana",
  },
  influx: {
    title: "InfluxDB e Telegraf",
    summary:
      "Colete as mesmas métricas Prometheus do Pro no InfluxDB 2.x, VictoriaMetrics ou em qualquer saída do Telegraf.",
    tier: "Chave de API Pro",
    cta: "Guia Influx / Telegraf",
    secondaryLabel: "Baixar a configuração do Telegraf",
  },
  thermostat: {
    title: "Nest e Ecobee",
    summary:
      "No probeharbor.dev, residências Pro conectam o Nest ou o Ecobee em Dashboard → Temperature para ter o setpoint da casa como contexto ao lado das sondas do sótão, do porão e da oficina. Instalações próprias precisam que o operador habilite antes os segredos de cliente OAuth.",
    tier: "Pro (habilitado no probeharbor.dev)",
    cta: "vs Nest / Ecobee",
    secondaryLabel: "Configuração OAuth para operadores",
  },
  "esphome-shelly": {
    title: "ESPHome e Shelly",
    summary:
      "Receitas de HTTP POST para sondas DHT/BME e contatos de porta Shelly, sem precisar de firmware Arduino personalizado.",
    cta: "Receitas de sensores na rede local",
  },
  "personal-weather": {
    title: "Ambient e WeatherFlow",
    summary:
      "Use a estação meteorológica do seu quintal para ter contexto externo, alertas do NWS (EUA) e risco de congelamento pela previsão.",
    cta: "Configurar a estação",
  },
  zapier: {
    title: "Zapier e Make",
    summary:
      "Receba os hooks de alertas de saída ou envie ações de snooze de entrada a partir de automações sem código.",
    cta: "Receitas",
  },
  automation: {
    title: "IFTTT, n8n e Sheets",
    summary:
      "Webhooks do IFTTT Maker, n8n auto-hospedado, registros de alertas no Google Sheets e bancos de dados do Notion a partir do mesmo payload de saída do Pro.",
    tier: "Webhook de saída Pro",
    cta: "Guia IFTTT / n8n",
    secondaryLabel: "Workflow n8n → Sheets",
  },
  "freeze-map-embed": {
    title: "Mapa de congelamento incorporável e selo",
    summary:
      "Coloque o mapa público (opt-in) de risco de congelamento em um blog, dashboard do Home Assistant ou README: iframe incorporado e selo em Markdown.",
    tier: "Público (dados agregados com opt-in)",
    cta: "Incorporar e selo",
  },
} satisfies IntegrationCardOverlay;
