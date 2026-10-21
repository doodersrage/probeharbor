import type { GuideHubOverlay } from "..";

export default {
  categories: {
    hardware: {
      title: "Configuração do hardware",
      description: "Sensores, fiação, firmware e criação de dispositivos push/pull no painel.",
    },
    alerts: {
      title: "Alertas",
      description: "Limites de congelamento, alertas de vazamento, guias para ondas de frio e canais de notificação.",
    },
    sharing: {
      title: "Compartilhamento",
      description: "Acesso da residência, o app para celular que você pode instalar hoje e páginas de status públicas.",
    },
    integrations: {
      title: "Integrações",
      description:
        "Home Assistant HACS, Matter / Apple Home, Node-RED, Influx, ponte MQTT→HTTPS, ESPHome/Shelly e guias comparativos. Os esquemas de payload ficam em API.",
    },
    api: {
      title: "API",
      description:
        "Payloads de ingestão, webhooks de saída, OpenAPI e Zapier/Make. A criação de dispositivos fica em Hardware; HACS e MQTT, em Integrações.",
    },
  },
  links: {
    "/accessories": {
      label: "Acessórios de hardware",
      summary: "Claim puck, sinalizador de alerta, contatos de porta/vazamento/energia, etiquetas do kit e suportes.",
    },
    "/claim-puck": { label: "Claim puck", summary: "Chave de presença RP2040-Zero e LED de status da vaga." },
    "/leak-puck": {
      label: "Leak Puck (contato de vazamento)",
      summary: "Pads de água que enviam por POST sensores de inundação molhado/seco.",
    },
    "/stories/garage-freeze-alert": {
      label: "Cenário de congelamento",
      summary: "Como é, alerta por alerta, uma falha do aquecedor da garagem às 2 da manhã.",
    },
    "/stories/water-heater-pad-leak": {
      label: "Cenário de vazamento",
      summary: "Como um contato de umidade embaixo do aquecedor de água da garagem detecta um gotejamento antes de encharcar o piso.",
    },
    "/apps": { label: "Apps complementares", summary: "Clientes Android, Desktop, Bay Buddy e PWA para a sua conta." },
    "/android": {
      label: "App Android (acesso antecipado)",
      summary: "Build no GitHub para instalar manualmente enquanto a revisão da Play termina; a PWA já funciona hoje.",
    },
    "/integrations": {
      label: "Central de integrações",
      summary: "Home Assistant HACS, Matter, Node-RED, Influx, MQTT, Grafana, webhooks, Nest/Ecobee, Zapier, IFTTT/n8n.",
    },
    "/integrations/home-assistant": {
      label: "Home Assistant (HACS)",
      summary:
        "Integração personalizada oficial: sensores por link compartilhado, serviços de pausa/férias e ingestão push opcional.",
    },
    "/integrations/matter": {
      label: "Matter / Apple Home",
      summary:
        "Plugin Matterbridge: sensores por link compartilhado no Apple Home, Google Home e Alexa (sem certificação CSA).",
    },
    "/integrations/node-red": { label: "Node-RED", summary: "Importe o fluxo MQTT→HTTPS; mantenha o Mosquitto local." },
    "/integrations/influx": {
      label: "InfluxDB e Telegraf",
      summary: "Colete as métricas Prometheus do Pro no Influx ou no VictoriaMetrics.",
    },
    "/integrations/automation": {
      label: "IFTTT, n8n e Sheets",
      summary: "Webhooks de saída para IFTTT/n8n; registre alertas no Sheets ou no Notion.",
    },
    "/compare/diy-mqtt": {
      label: "Comparado ao MQTT caseiro",
      summary: "Quando alertas hospedados de congelamento e vazamento são melhores que manter seu próprio Mosquitto com cron.",
    },
    "/docs/api": {
      label: "Documentação da API HTTP",
      summary: "Ingestão, métricas, webhooks e a especificação OpenAPI.",
    },
  },
} satisfies GuideHubOverlay;
