import type { GuideHubOverlay } from "..";

export default {
  categories: {
    hardware: {
      title: "Configuración del hardware",
      description: "Sensores, cableado, firmware y creación de dispositivos push/pull en el panel.",
    },
    alerts: {
      title: "Alertas",
      description: "Umbrales de congelación, alertas de fugas, guías para olas de frío y canales de notificación.",
    },
    sharing: {
      title: "Compartir",
      description: "Acceso para el hogar, la app para el teléfono que puedes instalar hoy y páginas de estado públicas.",
    },
    integrations: {
      title: "Integraciones",
      description:
        "Home Assistant HACS, Matter / Apple Home, Node-RED, Influx, puente MQTT→HTTPS, ESPHome/Shelly y guías comparativas. Los esquemas de payload están en API.",
    },
    api: {
      title: "API",
      description:
        "Payloads de ingesta, webhooks salientes, OpenAPI y Zapier/Make. La creación de dispositivos está en Hardware; HACS y MQTT, en Integraciones.",
    },
  },
  links: {
    "/accessories": {
      label: "Accesorios de hardware",
      summary: "Claim puck, baliza de alerta, contactos de puerta/fuga/corriente, etiquetas del kit y soportes.",
    },
    "/claim-puck": { label: "Claim puck", summary: "Llave de presencia RP2040-Zero y LED de estado de la plaza." },
    "/leak-puck": {
      label: "Leak Puck (contacto de fugas)",
      summary: "Almohadillas de agua que envían por POST sensores de inundación mojado/seco.",
    },
    "/stories/garage-freeze-alert": {
      label: "Escenario de congelación",
      summary: "Cómo se ve, alerta por alerta, una falla del calefactor del garaje a las 2 de la madrugada.",
    },
    "/stories/water-heater-pad-leak": {
      label: "Escenario de fuga",
      summary: "Cómo un contacto de humedad bajo el calentador de agua del garaje detecta un goteo antes de que empape el piso.",
    },
    "/apps": { label: "Apps complementarias", summary: "Clientes Android, Desktop, Bay Buddy y PWA para tu cuenta." },
    "/android": {
      label: "App para Android (acceso anticipado)",
      summary: "Compilación en GitHub para instalar manualmente mientras termina la revisión de Play; la PWA funciona hoy.",
    },
    "/integrations": {
      label: "Centro de integraciones",
      summary: "Home Assistant HACS, Matter, Node-RED, Influx, MQTT, Grafana, webhooks, Nest/Ecobee, Zapier, IFTTT/n8n.",
    },
    "/integrations/home-assistant": {
      label: "Home Assistant (HACS)",
      summary:
        "Integración personalizada oficial: sensores por enlace compartido, servicios de pausa/vacaciones e ingesta push opcional.",
    },
    "/integrations/matter": {
      label: "Matter / Apple Home",
      summary:
        "Plugin de Matterbridge: sensores por enlace compartido en Apple Home, Google Home y Alexa (sin certificación CSA).",
    },
    "/integrations/node-red": { label: "Node-RED", summary: "Importa el flujo MQTT→HTTPS; mantén Mosquitto en local." },
    "/integrations/influx": {
      label: "InfluxDB y Telegraf",
      summary: "Recoge las métricas Prometheus de Pro en Influx o VictoriaMetrics.",
    },
    "/integrations/automation": {
      label: "IFTTT, n8n y Sheets",
      summary: "Webhooks salientes a IFTTT/n8n; registra alertas en Sheets o Notion.",
    },
    "/compare/diy-mqtt": {
      label: "Frente a MQTT casero",
      summary: "Cuándo las alertas alojadas de congelación y fugas superan a montar tu propio Mosquitto con cron.",
    },
    "/docs/api": {
      label: "Documentación de la API HTTP",
      summary: "Ingesta, métricas, webhooks y la especificación OpenAPI.",
    },
  },
} satisfies GuideHubOverlay;
