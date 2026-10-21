import type { IntegrationCardOverlay } from "../index";

export default {
  "home-assistant": {
    summary:
      "Intégration personnalisée officielle : capteurs via lien de partage, services de mise en pause et de mode vacances, ingestion push optionnelle. Fonctionne en parallèle avec MQTT sur votre réseau local.",
    tier: "Lien live familial (Free) · Pro pour l’historique/les métriques et l’entrant",
    cta: "Guide d’installation",
    secondaryLabel: "Recettes notifications / TTS",
  },
  matter: {
    summary:
      "Plugin Matterbridge qui interroge un lien de partage et expose température, humidité, fuite, porte, alimentation et mouvement dans Apple Home, Google Home et Alexa. Tourne sur une machine du réseau local — non certifié CSA.",
    tier: "Lien live familial (Free) · Pro pour l’interrupteur de mise en pause",
    cta: "Guide du pont Matter",
    secondaryLabel: "Plugin GitHub",
  },
  smartthings: {
    summary:
      "Pas d’app Cloud-to-Cloud : ajoutez le Matterbridge ProbeHarbor sur votre réseau local pour que SmartThings voie les mêmes capteurs du garage qu’Apple Home.",
    tier: "Lien live familial (Free)",
    cta: "Méthode SmartThings",
    secondaryLabel: "Pont Matter",
  },
  "node-red": {
    summary:
      "Importez un flow prêt à l’emploi pour répliquer les topics Mosquitto vers ProbeHarbor en HTTPS. Le broker reste local ; onglet optionnel pour capteur de porte.",
    cta: "Guide Node-RED",
    secondaryLabel: "Télécharger le flow JSON",
  },
  "mqtt-bridge": {
    title: "Pont MQTT",
    summary:
      "Gardez Mosquitto en local ; répliquez les relevés via push JSON en HTTPS ou flux en pull pour les alertes gel et fuite du foyer et l’historique.",
    cta: "Recette de pont",
    secondaryLabel: "Documentation développeur",
  },
  webhooks: {
    title: "Webhooks d’alertes et de relevés",
    summary: "Les webhooks Pro fonctionnent dans les deux sens : à configurer dans Dashboard → Alerts / Share.",
    cta: "Guide dans l’app",
    bullets: [
      "Sortant : POST d’alertes (HMAC optionnel) et webhooks de relevés à fort volume à l’ingestion",
      "Entrant : endpoints de mise en pause / vacances / statut pour HA, Zapier, n8n ou Make",
    ],
    secondaryLabel: "Référence des payloads",
  },
  grafana: {
    title: "Grafana et Prometheus",
    summary:
      "Collectez GET /api/v1/metrics avec une clé API du dashboard ; téléchargez le JSON du tableau de bord Grafana fourni depuis Dashboard → Share.",
    tier: "Clé API Pro",
    cta: "API HTTP (métriques)",
    secondaryLabel: "Documentation du tableau de bord Grafana",
  },
  influx: {
    title: "InfluxDB et Telegraf",
    summary:
      "Collectez les mêmes métriques Prometheus Pro dans InfluxDB 2.x, VictoriaMetrics ou n’importe quelle sortie Telegraf.",
    tier: "Clé API Pro",
    cta: "Guide Influx / Telegraf",
    secondaryLabel: "Télécharger la configuration Telegraf",
  },
  thermostat: {
    title: "Nest et Ecobee",
    summary:
      "Sur probeharbor.dev, les foyers Pro connectent Nest ou Ecobee depuis Dashboard → Temperature pour afficher la consigne de la maison à côté des sondes du grenier, du vide sanitaire et de l’atelier. Les installations auto-hébergées nécessitent d’abord que l’opérateur active les secrets client OAuth.",
    tier: "Pro (activé sur probeharbor.dev)",
    cta: "vs Nest / Ecobee",
    secondaryLabel: "Configuration OAuth opérateur",
  },
  "esphome-shelly": {
    title: "ESPHome et Shelly",
    summary:
      "Recettes HTTP POST pour sondes DHT/BME et contacts de porte Shelly, sans firmware Arduino personnalisé.",
    cta: "Recettes capteurs locaux",
  },
  "personal-weather": {
    title: "Ambient et WeatherFlow",
    summary:
      "Utilisez votre station météo de jardin pour le contexte extérieur, les alertes NWS (États-Unis) et le risque de gel prévu.",
    cta: "Configuration de la station",
  },
  zapier: {
    title: "Zapier et Make",
    summary:
      "Recevez les hooks d’alertes sortants ou envoyez (POST) des actions de mise en pause entrantes depuis vos automatisations sans code.",
    cta: "Recettes",
  },
  automation: {
    title: "IFTTT, n8n et Sheets",
    summary:
      "Webhooks IFTTT Maker, n8n auto-hébergé, journaux d’alertes Google Sheets et bases Notion à partir du même payload sortant Pro.",
    tier: "Webhook sortant Pro",
    cta: "Guide IFTTT / n8n",
    secondaryLabel: "Workflow n8n → Sheets",
  },
  "freeze-map-embed": {
    title: "Carte du gel à intégrer et badge",
    summary:
      "Intégrez la carte publique du risque de gel (participation volontaire) dans un blog, un tableau de bord Home Assistant ou un README : iframe plus badge Markdown.",
    tier: "Public (données agrégées volontaires)",
    cta: "Intégration et badge",
  },
} satisfies IntegrationCardOverlay;
