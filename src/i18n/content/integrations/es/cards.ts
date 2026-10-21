import type { IntegrationCardOverlay } from "../index";

export default {
  "home-assistant": {
    summary:
      "Integración personalizada oficial: sensores por enlace para compartir, servicios para posponer/vacaciones e ingesta push opcional. Úsala junto a MQTT en tu red local.",
    tier: "Enlace familiar en vivo (Free) · Pro para historial/métricas + entrantes",
    cta: "Guía de instalación",
    secondaryLabel: "Recetas de notificaciones / TTS",
  },
  matter: {
    summary:
      "Plugin de Matterbridge que consulta un enlace para compartir y expone temperatura, humedad, fugas, puerta, alimentación y movimiento en Apple Home, Google Home y Alexa. Funciona en un equipo de la red local; sin certificación CSA.",
    tier: "Enlace familiar en vivo (Free) · Pro para el interruptor de posponer",
    cta: "Guía del puente Matter",
    secondaryLabel: "Plugin en GitHub",
  },
  smartthings: {
    title: "SmartThings (a través de Matter)",
    summary:
      "Sin app Cloud-to-Cloud: añade el Matterbridge de ProbeHarbor en tu red local para que SmartThings vea los mismos sensores del garaje que Apple Home.",
    tier: "Enlace familiar en vivo (Free)",
    cta: "Vía SmartThings",
    secondaryLabel: "Puente Matter",
  },
  "node-red": {
    summary:
      "Importa un flujo listo para usar que replica topics de Mosquitto en ProbeHarbor por HTTPS. Mantén el broker en local; pestaña opcional para sensor de puerta.",
    cta: "Guía de Node-RED",
    secondaryLabel: "Descargar el flujo JSON",
  },
  "mqtt-bridge": {
    title: "Puente MQTT",
    summary:
      "Mantén Mosquitto en local; replica las lecturas por HTTPS con push JSON o feeds de consulta para las alertas de heladas y fugas del hogar y el historial.",
    cta: "Receta del puente",
    secondaryLabel: "Documentación para desarrolladores",
  },
  webhooks: {
    title: "Webhooks de alertas y lecturas",
    summary: "Los webhooks de Pro funcionan en ambos sentidos: configúralos en Dashboard → Alerts / Share.",
    cta: "Guía en el sitio",
    bullets: [
      "Salientes: POST de alertas (HMAC opcional) y webhooks de lecturas de alto volumen en la ingesta",
      "Entrantes: endpoints para posponer / vacaciones / estado desde HA, Zapier, n8n o Make",
    ],
    secondaryLabel: "Referencia del payload",
  },
  grafana: {
    title: "Grafana y Prometheus",
    summary:
      "Consulta GET /api/v1/metrics con una clave de API del dashboard; descarga el JSON del dashboard de Grafana incluido desde Dashboard → Share.",
    tier: "Clave de API Pro",
    cta: "API HTTP (métricas)",
    secondaryLabel: "Documentación del dashboard de Grafana",
  },
  influx: {
    title: "InfluxDB y Telegraf",
    summary:
      "Recoge las mismas métricas Prometheus de Pro en InfluxDB 2.x, VictoriaMetrics o cualquier salida de Telegraf.",
    tier: "Clave de API Pro",
    cta: "Guía de Influx / Telegraf",
    secondaryLabel: "Descargar la configuración de Telegraf",
  },
  thermostat: {
    title: "Nest y Ecobee",
    summary:
      "En probeharbor.dev, los hogares Pro conectan Nest o Ecobee desde Dashboard → Temperature para ver la consigna de la casa junto a las sondas del ático, el sótano técnico y el taller. En instalaciones autoalojadas, el operador debe activar antes los secretos de cliente OAuth.",
    tier: "Pro (activo en probeharbor.dev)",
    cta: "vs Nest / Ecobee",
    secondaryLabel: "Configuración OAuth para operadores",
  },
  "esphome-shelly": {
    title: "ESPHome y Shelly",
    summary:
      "Recetas HTTP POST para sondas DHT/BME y contactos de puerta Shelly, sin firmware de Arduino personalizado.",
    cta: "Recetas de sensores locales",
  },
  "personal-weather": {
    title: "Ambient y WeatherFlow",
    summary:
      "Usa la estación meteorológica de tu patio para el contexto exterior, las alertas del NWS (EE. UU.) y el riesgo de helada según el pronóstico.",
    cta: "Configurar la estación",
  },
  zapier: {
    title: "Zapier y Make",
    summary:
      "Recibe los hooks de alertas salientes o envía por POST acciones de posponer desde automatizaciones sin código.",
    cta: "Recetas",
  },
  automation: {
    title: "IFTTT, n8n y Sheets",
    summary:
      "Webhooks de IFTTT Maker, n8n autoalojado, registros de alertas en Google Sheets y bases de datos de Notion a partir del mismo payload saliente de Pro.",
    tier: "Webhook saliente Pro",
    cta: "Guía de IFTTT / n8n",
    secondaryLabel: "Workflow n8n → Sheets",
  },
  "freeze-map-embed": {
    title: "Mapa de heladas insertable e insignia",
    summary:
      "Inserta el mapa público de riesgo de heladas (con datos agregados voluntarios) en un blog, un dashboard de Home Assistant o un README: iframe más insignia en Markdown.",
    tier: "Público (agregados voluntarios)",
    cta: "Insertar e insignia",
  },
} satisfies IntegrationCardOverlay;
