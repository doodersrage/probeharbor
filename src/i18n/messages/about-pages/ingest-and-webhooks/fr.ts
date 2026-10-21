
/**
 * /about/ingest-and-webhooks body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Code samples stay in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const sketches = `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>`;
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer"><code>push_https_forward.py</code></a>`;
const kinds =
  "<code>temperature</code>, <code>humidity</code>, <code>co2</code>, <code>pressure</code>, <code>pm25</code>, <code>voc</code>, <code>level</code>, <code>energy</code>, <code>door</code>, <code>power</code>, <code>flood</code>, <code>motion</code>, <code>generic</code>";
const webhookKinds =
  "<code>threshold</code>, <code>rate</code>, <code>outage</code>, <code>forecast</code>, <code>rule</code>, <code>digest</code>";
import type { IngestAndWebhooksMessages } from "./en";

const fr: IngestAndWebhooksMessages = {
  introHtml:
    'En plus de récupérer des flux JSON en HTTPS, ProbeHarbor accepte l’ingestion push depuis des appareils ESP32, Pico W ou Arduino et peut diffuser les notifications d’alerte vers Discord, les SMS, les notifications push web et des webhooks HTTPS génériques pour IFTTT ou Home Assistant. Pour un résumé des endpoints et le téléchargement de l’OpenAPI, consultez la <a class="text-link" href="/docs/api">référence de l’API HTTP</a>.',
  push: {
    title: "Ingestion push",
    bodyHtml:
      'Dans <strong>Dashboard → Devices</strong>, créez un appareil push et copiez la clé d’ingestion depuis l’encadré (30 minutes, survit à un rechargement). Les capteurs <strong>s’importent automatiquement au premier POST</strong> ; le mappage manuel sous Advanced est facultatif. Guide complet : <a class="text-link" href="/about/adding-devices">Ajouter des appareils push et pull</a>. Envoyez les mesures avec :',
  },
  classicTitle: "JSON Arduino classique",
  typed: {
    title: "Charge utile multicapteur typée",
    kindsHtml: `Types pris en charge : ${kinds}. Les champs facultatifs de premier niveau <code>battery</code> / <code>battery_pct</code> et <code>rssi</code> mettent à jour les métadonnées d’état de l’appareil. Des sketches d’exemple en CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C et assembleur GNU AVR pour DS18B20 / MAX31855 / MAX6675, ainsi que Uno + W5100 (<code>ethernet_dht22_ingest</code>, JSON <code>temp</code> classique) : ${sketches}. Le shield Ethernet ne gère pas le TLS : associez-le à ${relay} sur une machine du LAN.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "Si votre firmware ou votre passerelle publie déjà du JSON SenML, envoyez directement le tableau en POST, sans objet englobant. ProbeHarbor détecte automatiquement le SenML en l’absence des formes natives <code>temp</code> / <code>sensors[]</code>. La température utilise l’unité <code>Cel</code> ou <code>degF</code> ; l’humidité, <code>%RH</code>. Les clés de sonde proviennent du nom SenML (dernier segment du chemin).",
    liveHtml:
      'Exemple en direct : <a class="text-link" href="/api/feeds/example?format=senml">flux SenML d’exemple</a>. Les flux pull acceptent le même tableau quand la racine JSON configurée est absente.',
  },
  ha: {
    title: "JSON de capteur REST Home Assistant",
    bodyHtml:
      "Une réponse de capteur REST unique (<code>state</code> plus <code>attributes.unit_of_measurement</code>) est elle aussi détectée automatiquement en ingestion push et dans les flux pull. Mappez la clé de sonde <code>state</code> (ou le suffixe d’entité pour les charges utiles à plusieurs entités) dans Devices.",
    liveHtml:
      'Exemple en direct : <a class="text-link" href="/api/feeds/example?format=homeassistant">flux HA REST d’exemple</a>. Pour une configuration HA complète (HACS, pont MQTT, référence intérieure), voir l’<a class="text-link" href="/integrations/home-assistant">intégration Home Assistant</a>.',
  },
  webhooks: {
    title: "Webhooks d’alerte sortants",
    introHtml: "Les comptes Pro peuvent activer un webhook sortant dans les réglages des alertes. Chaque alerte envoie ce JSON en POST :",
    kindsHtml: `<code>kind</code> peut valoir ${webhookKinds} ou <code>generic</code>. Quand un secret de webhook est défini, la requête inclut <code>X-Signature</code>, un HMAC-SHA256 hexadécimal du corps brut. Utilisez-le dans Home Assistant ou IFTTT Webhooks pour vérifier l’authenticité.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Installez l’<a class="text-link" href="/integrations/home-assistant">intégration HACS officielle</a> pour disposer de capteurs issus des liens de partage et des services de mise en sourdine/vacances. Pour <strong>recevoir les alertes dans HA</strong>, utilisez le webhook HTTPS sortant (Pro) ou importez le blueprint. Pour <strong>envoyer des mesures MQTT vers ProbeHarbor</strong>, voir la <a class="text-link" href="/about/mqtt-bridge">recette du pont MQTT</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>Télécharger le blueprint HA (YAML)</a>',
    pointHtml:
      "Faites pointer l’URL du webhook sortant ProbeHarbor vers <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (ou une URL Cloudflare Tunnel / Nabu Casa). Vérifiez <code>X-Signature</code> dans une condition de modèle si vous avez défini un secret.",
    mqttHtml:
      "Pour MQTT, laissez Home Assistant (ou Node-RED) recevoir le webhook et publier sur votre broker : MQTT reste local tandis que ProbeHarbor reste en HTTPS. Le blueprint comprend une entrée facultative de topic MQTT pour ce cas.",
  },
  metrics: {
    title: "Métriques Grafana / Prometheus",
    introHtml: "Les comptes Pro peuvent créer des clés d’API du tableau de bord (Dashboard → Share) et collecter :",
    shareHtml: "Ou utiliser un lien de partage Pro avec la portée <strong>Metrics</strong> :",
    grafanaHtml:
      "Ou <code>?format=grafana</code> pour un simple tableau JSON de points de données. La portée de partage Historique affiche un graphique sur 7 jours sur la page publique.",
  },
  channels: {
    title: "Canaux d’alerte",
    items: [
      "E-mail et Discord (toutes les offres)",
      "Jeton de bot Telegram + chat id (vos identifiants)",
      "URL d’Incoming Webhook Slack (vos identifiants)",
      "Push navigateur et Android (toutes les offres)",
      "SMS Twilio, webhook sortant (Pro)",
    ],
    rulesHtml:
      "Les alertes prennent aussi en charge le risque de gel prévu, les heures de silence et les règles composées en ET (par exemple porte ouverte + baisse de température). Voir Dashboard → Alerts.",
    emailHtml:
      'Les alertes par e-mail restent disponibles sur toutes les offres. Les récapitulatifs hebdomadaires s’activent indépendamment des alertes de seuil de gel/d’humidité. Les agrégats par ville (sur consentement) apparaissent sur <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Guides associés",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">Documentation de l’API HTTP</a> : téléchargement de l’OpenAPI, ingestion, métriques et webhooks entrants',
      '<a class="text-link" href="/about/kit-qr-onboarding">Mise en service par QR du kit</a> : encodez votre URL d’ingestion sur un autocollant matériel',
      '<a class="text-link" href="/about/esp32-ota-firmware">OTA de l’ESP32 et remontée de batterie</a> : mises à jour du firmware et champs <code>battery</code> / <code>rssi</code>',
      '<a class="text-link" href="/about/zapier-make-recipes">Recettes Zapier et Make.com</a> : webhooks d’alerte sortants et automatisations de mise en sourdine entrantes',
    ],
  },
};

export default fr;
