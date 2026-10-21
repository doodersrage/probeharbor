
/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "ProbeHarbor n’est pas un broker MQTT. Gardez Mosquitto, ESPHome ou le MQTT de Home Assistant sur votre réseau local, puis répliquez les topics choisis en HTTPS : les SMS et e-mails d’alerte gel et fuite du foyer ainsi que l’historique vivent dans le cloud, sans exposer le broker.",
  curlTitle: "Pont rapide (curl)",
  curlHtml:
    "Créez un <strong>appareil push</strong> dans Dashboard → Devices, copiez la clé d’ingestion, faites correspondre les clés JSON à votre payload MQTT, puis envoyez un POST :",
  devicesHtml:
    'La création complète d’appareils (push ou pull) est décrite dans <a class="text-link" href="/about/adding-devices">Ajouter des appareils push et pull</a>. Formats de payload et webhooks d’alerte sortants : <a class="text-link" href="/about/ingest-and-webhooks">API d’ingestion et webhooks d’alerte</a>.',
  haTitleHtml: "<code>rest_command</code> dans Home Assistant",
  haHtml:
    'Vous préférez des entités automatiques à partir d’un lien de partage ? Utilisez l’<a class="text-link" href="/integrations/home-assistant">intégration HACS officielle</a>. Pour une simple réplication MQTT :',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Importez <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, pointez les nœuds MQTT vers votre broker, définissez <code>PROBEHARBOR_INGEST_KEY</code> et déployez. Guide produit : <a class="text-link" href="/integrations/node-red">intégration Node-RED</a>. Version détaillée : <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">documentation développeur du pont MQTT</a>.',
  relatedTitle: "À lire aussi",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a> : fonctionnement en parallèle avec MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor ou MQTT fait maison</a>',
    '<a class="text-link" href="/about/adding-devices">Ajouter des appareils push et pull</a>',
    '<a class="text-link" href="/docs/api">API HTTP</a> : <code>POST /api/ingest/mqtt</code>',
  ],
};

export default fr;
