import type { GuideHubOverlay } from "..";

export default {
  categories: {
    hardware: {
      title: "Installation du matériel",
      description: "Capteurs, câblage, firmware et création d’appareils push/pull dans le tableau de bord.",
    },
    alerts: {
      title: "Alertes",
      description: "Seuils de gel, alertes de fuite, guides pour vagues de froid et canaux de notification.",
    },
    sharing: {
      title: "Partage",
      description: "Accès du foyer, l’application mobile à installer dès aujourd’hui et pages de statut publiques.",
    },
    integrations: {
      title: "Intégrations",
      description:
        "Home Assistant HACS, Matter / Apple Home, Node-RED, Influx, passerelle MQTT→HTTPS, ESPHome/Shelly et guides comparatifs. Les schémas de payload sont dans API.",
    },
    api: {
      title: "API",
      description:
        "Payloads d’ingestion, webhooks sortants, OpenAPI et Zapier/Make. La création d’appareils est sous Matériel ; HACS et MQTT sous Intégrations.",
    },
  },
  links: {
    "/accessories": {
      label: "Accessoires matériels",
      summary: "Claim puck, balise d’alerte, contacts porte/fuite/courant, étiquettes de kit, supports.",
    },
    "/claim-puck": { label: "Claim puck", summary: "Clé de présence RP2040-Zero et LED d’humeur de l’emplacement." },
    "/leak-puck": {
      label: "Leak Puck (contact de fuite)",
      summary: "Des pastilles de détection d’eau qui envoient en POST des capteurs d’inondation humide/sec.",
    },
    "/stories/garage-freeze-alert": {
      label: "Scénario de gel",
      summary: "À quoi ressemble, alerte après alerte, une panne du chauffage du garage à 2 h du matin.",
    },
    "/stories/water-heater-pad-leak": {
      label: "Scénario de fuite",
      summary: "Comment un contact humide sous le chauffe-eau du garage repère un goutte-à-goutte avant qu’il ne détrempe la dalle.",
    },
    "/apps": { label: "Applications compagnons", summary: "Clients Android, Desktop, Bay Buddy et PWA pour votre compte." },
    "/android": {
      label: "Application Android (accès anticipé)",
      summary: "Build GitHub à installer manuellement en attendant la validation sur Play ; la PWA fonctionne dès aujourd’hui.",
    },
    "/integrations": {
      label: "Hub des intégrations",
      summary: "Home Assistant HACS, Matter, Node-RED, Influx, MQTT, Grafana, webhooks, Nest/Ecobee, Zapier, IFTTT/n8n.",
    },
    "/integrations/home-assistant": {
      label: "Home Assistant (HACS)",
      summary:
        "Intégration personnalisée officielle : capteurs par lien de partage, services de pause/vacances, ingestion push facultative.",
    },
    "/integrations/matter": {
      label: "Matter / Apple Home",
      summary:
        "Plugin Matterbridge : capteurs par lien de partage dans Apple Home, Google Home et Alexa (sans certification CSA).",
    },
    "/integrations/node-red": { label: "Node-RED", summary: "Importez le flux MQTT→HTTPS ; gardez Mosquitto en local." },
    "/integrations/influx": {
      label: "InfluxDB et Telegraf",
      summary: "Collectez les métriques Prometheus de Pro dans Influx ou VictoriaMetrics.",
    },
    "/integrations/automation": {
      label: "IFTTT, n8n et Sheets",
      summary: "Webhooks sortants vers IFTTT/n8n ; journalisez les alertes dans Sheets ou Notion.",
    },
    "/compare/diy-mqtt": {
      label: "Face au MQTT maison",
      summary: "Quand des alertes de gel et de fuite hébergées valent mieux qu’un Mosquitto et un cron auto-hébergés.",
    },
    "/docs/api": {
      label: "Documentation de l’API HTTP",
      summary: "Ingestion, métriques, webhooks et spécification OpenAPI.",
    },
  },
} satisfies GuideHubOverlay;
