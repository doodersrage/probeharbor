import { defineMessages } from "../../translate";

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

const en = {
  introHtml:
    'In addition to pulling HTTPS JSON feeds, ProbeHarbor accepts push ingest from ESP32, Pico W, or Arduino devices and can fan alert notifications out to Discord, SMS, web push, and generic HTTPS webhooks for IFTTT or Home Assistant. For endpoint summaries and OpenAPI download, see the <a class="text-link" href="/docs/api">HTTP API reference</a>.',
  push: {
    title: "Push ingest",
    bodyHtml:
      'From <strong>Dashboard → Devices</strong>, create a push device and copy the ingest key from the callout (30 minutes, survives refresh). Sensors <strong>auto-import on first POST</strong>; manual mapping under Advanced is optional. Full walkthrough: <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. Send readings with:',
  },
  classicTitle: "Classic Arduino JSON",
  typed: {
    title: "Typed multi-sensor payload",
    kindsHtml: `Supported kinds: ${kinds}. Optional top-level <code>battery</code> / <code>battery_pct</code> and <code>rssi</code> update device health metadata. Sample CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C, and GNU AVR assembly sketches for DS18B20 / MAX31855 / MAX6675, plus Uno + W5100 (<code>ethernet_dht22_ingest</code>, classic <code>temp</code> JSON): ${sketches}. The Ethernet shield cannot TLS: pair it with ${relay} on a LAN host.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "If your firmware or gateway already publishes SenML JSON, POST the array directly, no wrapper object required. ProbeHarbor auto-detects SenML when native <code>temp</code> / <code>sensors[]</code> shapes are absent. Temperature uses unit <code>Cel</code> or <code>degF</code>; humidity uses <code>%RH</code>. Probe keys come from the SenML name (last path segment).",
    liveHtml:
      'Live sample: <a class="text-link" href="/api/feeds/example?format=senml">example SenML feed</a>. Pull feeds accept the same array when the configured JSON root is missing.',
  },
  ha: {
    title: "Home Assistant REST sensor JSON",
    bodyHtml:
      "A single REST sensor response: <code>state</code> plus <code>attributes.unit_of_measurement</code>: is also auto-detected on push ingest and pull feeds. Map probe key <code>state</code> (or the entity suffix for multi-entity payloads) on Devices.",
    liveHtml:
      'Live sample: <a class="text-link" href="/api/feeds/example?format=homeassistant">example HA REST feed</a>. For full HA setup (HACS, MQTT bridge, indoor reference), see <a class="text-link" href="/integrations/home-assistant">Home Assistant integration</a>.',
  },
  webhooks: {
    title: "Outbound alert webhooks",
    introHtml: "Pro accounts can enable an outbound webhook in alert settings. Each alert POSTs JSON:",
    kindsHtml: `<code>kind</code> may be ${webhookKinds}, or <code>generic</code>. When a webhook secret is set, the request includes <code>X-Signature</code> as a hex HMAC-SHA256 of the raw body. Use that in Home Assistant or IFTTT Webhooks to verify authenticity.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Install the official <a class="text-link" href="/integrations/home-assistant">HACS integration</a> for share-link sensors and snooze/vacation services. For <strong>alerts into HA</strong>, use the outbound HTTPS webhook (Pro) or import the blueprint. For <strong>MQTT readings into ProbeHarbor</strong>, see the <a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>Download HA blueprint (YAML)</a>',
    pointHtml:
      "Point your ProbeHarbor outbound webhook URL at <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (or a Cloudflare Tunnel / Nabu Casa URL). Verify <code>X-Signature</code> in a template condition if you set a secret.",
    mqttHtml:
      "For MQTT, have Home Assistant (or Node-RED) receive the webhook and publish to your broker, that keeps MQTT local while ProbeHarbor stays on HTTPS. The blueprint includes an optional MQTT topic input for that path.",
  },
  metrics: {
    title: "Grafana / Prometheus metrics",
    introHtml: "Pro accounts can create dashboard API keys (Dashboard → Share) and scrape:",
    shareHtml: "Or use a Pro share link with the <strong>Metrics</strong> scope:",
    grafanaHtml:
      "Or <code>?format=grafana</code> for a simple JSON datapoints array. History share scope returns a 7-day chart on the public page.",
  },
  channels: {
    title: "Alert channels",
    items: [
      "Email and Discord (all plans)",
      "Telegram bot token + chat id (your credentials)",
      "Slack Incoming Webhook URL (your credentials)",
      "Browser and Android push (every plan)",
      "Twilio SMS, outbound webhook (Pro)",
    ],
    rulesHtml:
      "Alerts also support forecast freeze risk, quiet hours, and composite AND rules (for example door open + temperature drop). See Dashboard → Alerts.",
    emailHtml:
      'Email alerts remain available on all plans. Weekly digests can be enabled independently of freeze/humidity threshold alerts. Opt-in city aggregates appear on <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Related guides",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">HTTP API documentation</a> OpenAPI download, ingest, metrics, and inbound webhooks',
      '<a class="text-link" href="/about/kit-qr-onboarding">Kit QR onboarding</a> encode your ingest URL on a hardware sticker',
      '<a class="text-link" href="/about/esp32-ota-firmware">ESP32 OTA and battery reporting</a> firmware updates plus <code>battery</code> / <code>rssi</code> fields',
      '<a class="text-link" href="/about/zapier-make-recipes">Zapier and Make.com recipes</a> outbound alert webhooks and inbound snooze automations',
    ],
  },
};
type IngestAndWebhooksMessages = typeof en;

const es: IngestAndWebhooksMessages = {
  introHtml:
    'Además de extraer feeds JSON por HTTPS, ProbeHarbor acepta ingesta push desde dispositivos ESP32, Pico W o Arduino y puede repartir las notificaciones de alerta a Discord, SMS, notificaciones push web y webhooks HTTPS genéricos para IFTTT o Home Assistant. Para ver un resumen de los endpoints y descargar el OpenAPI, consulta la <a class="text-link" href="/docs/api">referencia de la API HTTP</a>.',
  push: {
    title: "Ingesta push",
    bodyHtml:
      'En <strong>Dashboard → Devices</strong>, crea un dispositivo push y copia la clave de ingesta del aviso (30 minutos; sobrevive a una recarga). Los sensores <strong>se importan automáticamente con el primer POST</strong>; la asignación manual en Advanced es opcional. Guía completa: <a class="text-link" href="/about/adding-devices">Añadir dispositivos push y pull</a>. Envía las lecturas con:',
  },
  classicTitle: "JSON clásico de Arduino",
  typed: {
    title: "Payload multisensor con tipos",
    kindsHtml: `Tipos admitidos: ${kinds}. Los campos opcionales de primer nivel <code>battery</code> / <code>battery_pct</code> y <code>rssi</code> actualizan los metadatos de estado del dispositivo. Sketches de ejemplo en CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C y ensamblador GNU AVR para DS18B20 / MAX31855 / MAX6675, además de Uno + W5100 (<code>ethernet_dht22_ingest</code>, JSON <code>temp</code> clásico): ${sketches}. El shield Ethernet no puede hacer TLS: combínalo con ${relay} en un equipo de la LAN.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "Si tu firmware o tu gateway ya publican JSON SenML, envía el array directamente con POST, sin objeto contenedor. ProbeHarbor detecta SenML automáticamente cuando no están presentes los formatos nativos <code>temp</code> / <code>sensors[]</code>. La temperatura usa la unidad <code>Cel</code> o <code>degF</code>; la humedad, <code>%RH</code>. Las claves de sonda salen del nombre SenML (último segmento de la ruta).",
    liveHtml:
      'Ejemplo en vivo: <a class="text-link" href="/api/feeds/example?format=senml">feed SenML de ejemplo</a>. Los feeds pull aceptan el mismo array cuando falta la raíz JSON configurada.',
  },
  ha: {
    title: "JSON de sensor REST de Home Assistant",
    bodyHtml:
      "Una respuesta de un único sensor REST (<code>state</code> más <code>attributes.unit_of_measurement</code>) también se detecta automáticamente en la ingesta push y en los feeds pull. Asigna la clave de sonda <code>state</code> (o el sufijo de la entidad en payloads con varias entidades) en Devices.",
    liveHtml:
      'Ejemplo en vivo: <a class="text-link" href="/api/feeds/example?format=homeassistant">feed HA REST de ejemplo</a>. Para la configuración completa de HA (HACS, puente MQTT, referencia interior), consulta la <a class="text-link" href="/integrations/home-assistant">integración con Home Assistant</a>.',
  },
  webhooks: {
    title: "Webhooks de alerta salientes",
    introHtml: "Las cuentas Pro pueden activar un webhook saliente en los ajustes de alertas. Cada alerta envía este JSON por POST:",
    kindsHtml: `<code>kind</code> puede ser ${webhookKinds} o <code>generic</code>. Si defines un secreto para el webhook, la petición incluye <code>X-Signature</code>, un HMAC-SHA256 en hexadecimal del cuerpo sin procesar. Úsalo en Home Assistant o en IFTTT Webhooks para verificar la autenticidad.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Instala la <a class="text-link" href="/integrations/home-assistant">integración oficial de HACS</a> para tener sensores de enlaces compartidos y servicios de posponer/vacaciones. Para <strong>recibir alertas en HA</strong>, usa el webhook HTTPS saliente (Pro) o importa el blueprint. Para <strong>enviar lecturas MQTT a ProbeHarbor</strong>, consulta la <a class="text-link" href="/about/mqtt-bridge">receta del puente MQTT</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>Descargar el blueprint de HA (YAML)</a>',
    pointHtml:
      "Apunta la URL del webhook saliente de ProbeHarbor a <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (o a una URL de Cloudflare Tunnel / Nabu Casa). Si defines un secreto, verifica <code>X-Signature</code> en una condición de plantilla.",
    mqttHtml:
      "Para MQTT, haz que Home Assistant (o Node-RED) reciba el webhook y lo publique en tu broker: así MQTT se queda en local mientras ProbeHarbor sigue en HTTPS. El blueprint incluye una entrada opcional de tema MQTT para esa opción.",
  },
  metrics: {
    title: "Métricas de Grafana / Prometheus",
    introHtml: "Las cuentas Pro pueden crear claves de API del panel (Dashboard → Share) y hacer scraping de:",
    shareHtml: "O usar un enlace compartido Pro con el alcance <strong>Metrics</strong>:",
    grafanaHtml:
      "O <code>?format=grafana</code> para un array JSON sencillo de puntos de datos. El alcance de historial de un enlace compartido muestra un gráfico de 7 días en la página pública.",
  },
  channels: {
    title: "Canales de alerta",
    items: [
      "Correo y Discord (todos los planes)",
      "Token de bot y chat id de Telegram (tus credenciales)",
      "URL de Incoming Webhook de Slack (tus credenciales)",
      "Notificaciones push en el navegador y Android (todos los planes)",
      "SMS de Twilio, webhook saliente (Pro)",
    ],
    rulesHtml:
      "Las alertas también admiten riesgo de congelación según el pronóstico, horas de silencio y reglas compuestas con AND (por ejemplo, puerta abierta + bajada de temperatura). Consulta Dashboard → Alerts.",
    emailHtml:
      'Las alertas por correo siguen disponibles en todos los planes. Los resúmenes semanales se pueden activar con independencia de las alertas de umbral de congelación o humedad. Los datos agregados por ciudad (opcionales) aparecen en <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Guías relacionadas",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">Documentación de la API HTTP</a>: descarga del OpenAPI, ingesta, métricas y webhooks entrantes',
      '<a class="text-link" href="/about/kit-qr-onboarding">Alta con el QR del kit</a>: codifica tu URL de ingesta en una pegatina para el hardware',
      '<a class="text-link" href="/about/esp32-ota-firmware">OTA del ESP32 e informe de batería</a>: actualizaciones de firmware y campos <code>battery</code> / <code>rssi</code>',
      '<a class="text-link" href="/about/zapier-make-recipes">Recetas para Zapier y Make.com</a>: webhooks de alerta salientes y automatizaciones de posponer entrantes',
    ],
  },
};

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

const de: IngestAndWebhooksMessages = {
  introHtml:
    'Neben dem Abrufen von HTTPS-JSON-Feeds nimmt ProbeHarbor Push-Daten von ESP32-, Pico-W- oder Arduino-Geräten an und kann Alarmbenachrichtigungen an Discord, SMS, Web-Push und generische HTTPS-Webhooks für IFTTT oder Home Assistant verteilen. Eine Übersicht der Endpunkte und den OpenAPI-Download findest du in der <a class="text-link" href="/docs/api">HTTP-API-Referenz</a>.',
  push: {
    title: "Push-Ingest",
    bodyHtml:
      'Lege unter <strong>Dashboard → Devices</strong> ein Push-Gerät an und kopiere den Ingest-Schlüssel aus dem Hinweis (30 Minuten, übersteht ein Neuladen). Sensoren werden <strong>beim ersten POST automatisch importiert</strong>; die manuelle Zuordnung unter Advanced ist optional. Komplette Anleitung: <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Sende Messwerte so:',
  },
  classicTitle: "Klassisches Arduino-JSON",
  typed: {
    title: "Typisierter Multisensor-Payload",
    kindsHtml: `Unterstützte Typen: ${kinds}. Optionale Felder auf oberster Ebene, <code>battery</code> / <code>battery_pct</code> und <code>rssi</code>, aktualisieren die Zustandsdaten des Geräts. Beispiel-Sketches in CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C und GNU-AVR-Assembler für DS18B20 / MAX31855 / MAX6675 sowie Uno + W5100 (<code>ethernet_dht22_ingest</code>, klassisches <code>temp</code>-JSON): ${sketches}. Das Ethernet-Shield kann kein TLS: Kombiniere es mit ${relay} auf einem Rechner im LAN.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "Wenn deine Firmware oder dein Gateway bereits SenML-JSON veröffentlicht, sende das Array direkt per POST, ohne umschließendes Objekt. ProbeHarbor erkennt SenML automatisch, wenn die nativen Formate <code>temp</code> / <code>sensors[]</code> fehlen. Temperatur nutzt die Einheit <code>Cel</code> oder <code>degF</code>, Luftfeuchte <code>%RH</code>. Die Fühlerschlüssel stammen aus dem SenML-Namen (letztes Pfadsegment).",
    liveHtml:
      'Live-Beispiel: <a class="text-link" href="/api/feeds/example?format=senml">Beispiel-SenML-Feed</a>. Pull-Feeds akzeptieren dasselbe Array, wenn der konfigurierte JSON-Stamm fehlt.',
  },
  ha: {
    title: "REST-Sensor-JSON von Home Assistant",
    bodyHtml:
      "Die Antwort eines einzelnen REST-Sensors (<code>state</code> plus <code>attributes.unit_of_measurement</code>) wird bei Push-Ingest und Pull-Feeds ebenfalls automatisch erkannt. Ordne auf Devices den Fühlerschlüssel <code>state</code> zu (oder bei Payloads mit mehreren Entitäten das Entitätssuffix).",
    liveHtml:
      'Live-Beispiel: <a class="text-link" href="/api/feeds/example?format=homeassistant">Beispiel-HA-REST-Feed</a>. Für die vollständige HA-Einrichtung (HACS, MQTT-Bridge, Innenreferenz) siehe die <a class="text-link" href="/integrations/home-assistant">Home-Assistant-Integration</a>.',
  },
  webhooks: {
    title: "Ausgehende Alarm-Webhooks",
    introHtml: "Pro-Konten können in den Alarmeinstellungen einen ausgehenden Webhook aktivieren. Jeder Alarm sendet dieses JSON per POST:",
    kindsHtml: `<code>kind</code> kann ${webhookKinds} oder <code>generic</code> sein. Ist ein Webhook-Secret gesetzt, enthält die Anfrage <code>X-Signature</code> als hexadezimalen HMAC-SHA256 des Roh-Bodys. Nutze ihn in Home Assistant oder IFTTT Webhooks, um die Echtheit zu prüfen.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Installiere die offizielle <a class="text-link" href="/integrations/home-assistant">HACS-Integration</a> für Sensoren aus Freigabelinks und Dienste zum Stummschalten/für den Urlaubsmodus. Für <strong>Alarme in HA</strong> nutzt du den ausgehenden HTTPS-Webhook (Pro) oder importierst den Blueprint. Für <strong>MQTT-Messwerte in ProbeHarbor</strong> siehe das <a class="text-link" href="/about/mqtt-bridge">MQTT-Bridge-Rezept</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>HA-Blueprint herunterladen (YAML)</a>',
    pointHtml:
      "Richte die URL deines ausgehenden ProbeHarbor-Webhooks auf <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (oder eine Cloudflare-Tunnel- bzw. Nabu-Casa-URL). Prüfe <code>X-Signature</code> in einer Template-Bedingung, wenn du ein Secret gesetzt hast.",
    mqttHtml:
      "Für MQTT lässt du Home Assistant (oder Node-RED) den Webhook empfangen und an deinen Broker veröffentlichen – so bleibt MQTT lokal, während ProbeHarbor bei HTTPS bleibt. Der Blueprint enthält dafür eine optionale Eingabe für das MQTT-Topic.",
  },
  metrics: {
    title: "Grafana-/Prometheus-Metriken",
    introHtml: "Pro-Konten können Dashboard-API-Schlüssel anlegen (Dashboard → Share) und Folgendes abfragen:",
    shareHtml: "Oder nutze einen Pro-Freigabelink mit dem Bereich <strong>Metrics</strong>:",
    grafanaHtml:
      "Oder <code>?format=grafana</code> für ein einfaches JSON-Array mit Datenpunkten. Der Freigabebereich für den Verlauf liefert ein 7-Tage-Diagramm auf der öffentlichen Seite.",
  },
  channels: {
    title: "Alarmkanäle",
    items: [
      "E-Mail und Discord (alle Tarife)",
      "Telegram-Bot-Token + Chat-ID (deine Zugangsdaten)",
      "Slack-Incoming-Webhook-URL (deine Zugangsdaten)",
      "Browser- und Android-Push (jeder Tarif)",
      "Twilio-SMS, ausgehender Webhook (Pro)",
    ],
    rulesHtml:
      "Alarme unterstützen außerdem prognostiziertes Frostrisiko, Ruhezeiten und kombinierte UND-Regeln (zum Beispiel Tor offen + Temperaturabfall). Siehe Dashboard → Alerts.",
    emailHtml:
      'E-Mail-Alarme bleiben in allen Tarifen verfügbar. Wöchentliche Zusammenfassungen lassen sich unabhängig von Frost- und Luftfeuchte-Schwellenalarmen aktivieren. Freiwillig geteilte Städtewerte erscheinen unter <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Verwandte Anleitungen",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">HTTP-API-Dokumentation</a>: OpenAPI-Download, Ingest, Metriken und eingehende Webhooks',
      '<a class="text-link" href="/about/kit-qr-onboarding">Einrichtung per Kit-QR-Code</a>: deine Ingest-URL auf einem Aufkleber für die Hardware',
      '<a class="text-link" href="/about/esp32-ota-firmware">ESP32-OTA und Akkustand</a>: Firmware-Updates plus die Felder <code>battery</code> / <code>rssi</code>',
      '<a class="text-link" href="/about/zapier-make-recipes">Rezepte für Zapier und Make.com</a>: ausgehende Alarm-Webhooks und eingehende Stummschalt-Automationen',
    ],
  },
};

const ptBr: IngestAndWebhooksMessages = {
  introHtml:
    'Além de buscar feeds JSON via HTTPS, o ProbeHarbor aceita ingestão push de dispositivos ESP32, Pico W ou Arduino e pode distribuir as notificações de alerta para Discord, SMS, push web e webhooks HTTPS genéricos para IFTTT ou Home Assistant. Para um resumo dos endpoints e o download do OpenAPI, veja a <a class="text-link" href="/docs/api">referência da API HTTP</a>.',
  push: {
    title: "Ingestão push",
    bodyHtml:
      'Em <strong>Dashboard → Devices</strong>, crie um dispositivo push e copie a chave de ingestão do aviso (30 minutos; sobrevive a uma atualização da página). Os sensores <strong>são importados automaticamente no primeiro POST</strong>; o mapeamento manual em Advanced é opcional. Passo a passo completo: <a class="text-link" href="/about/adding-devices">Adicionar dispositivos push e pull</a>. Envie as leituras com:',
  },
  classicTitle: "JSON clássico do Arduino",
  typed: {
    title: "Payload multissensor tipado",
    kindsHtml: `Tipos aceitos: ${kinds}. Os campos opcionais de primeiro nível <code>battery</code> / <code>battery_pct</code> e <code>rssi</code> atualizam os metadados de saúde do dispositivo. Sketches de exemplo em CircuitPython, MicroPython, Arduino, Zephyr C, WCHNET C e assembly GNU AVR para DS18B20 / MAX31855 / MAX6675, além de Uno + W5100 (<code>ethernet_dht22_ingest</code>, JSON <code>temp</code> clássico): ${sketches}. O shield Ethernet não faz TLS: use-o junto com ${relay} num computador da rede local.`,
  },
  senml: {
    title: "SenML (RFC 8428)",
    bodyHtml:
      "Se o seu firmware ou gateway já publica JSON SenML, envie o array direto via POST, sem objeto envolvendo. O ProbeHarbor detecta SenML automaticamente quando os formatos nativos <code>temp</code> / <code>sensors[]</code> não estão presentes. A temperatura usa a unidade <code>Cel</code> ou <code>degF</code>; a umidade, <code>%RH</code>. As chaves de sonda vêm do nome SenML (último segmento do caminho).",
    liveHtml:
      'Exemplo ao vivo: <a class="text-link" href="/api/feeds/example?format=senml">feed SenML de exemplo</a>. Os feeds pull aceitam o mesmo array quando a raiz JSON configurada não existe.',
  },
  ha: {
    title: "JSON de sensor REST do Home Assistant",
    bodyHtml:
      "A resposta de um único sensor REST (<code>state</code> mais <code>attributes.unit_of_measurement</code>) também é detectada automaticamente na ingestão push e nos feeds pull. Mapeie a chave de sonda <code>state</code> (ou o sufixo da entidade em payloads com várias entidades) em Devices.",
    liveHtml:
      'Exemplo ao vivo: <a class="text-link" href="/api/feeds/example?format=homeassistant">feed HA REST de exemplo</a>. Para a configuração completa do HA (HACS, ponte MQTT, referência interna), veja a <a class="text-link" href="/integrations/home-assistant">integração com o Home Assistant</a>.',
  },
  webhooks: {
    title: "Webhooks de alerta de saída",
    introHtml: "Contas Pro podem ativar um webhook de saída nas configurações de alerta. Cada alerta envia este JSON via POST:",
    kindsHtml: `<code>kind</code> pode ser ${webhookKinds} ou <code>generic</code>. Quando um segredo de webhook é definido, a requisição inclui <code>X-Signature</code>, um HMAC-SHA256 em hexadecimal do corpo bruto. Use-o no Home Assistant ou no IFTTT Webhooks para verificar a autenticidade.`,
  },
  homeAssistant: {
    title: "Home Assistant",
    bodyHtml:
      'Instale a <a class="text-link" href="/integrations/home-assistant">integração oficial do HACS</a> para ter sensores de links compartilhados e serviços de soneca/férias. Para <strong>receber alertas no HA</strong>, use o webhook HTTPS de saída (Pro) ou importe o blueprint. Para <strong>enviar leituras MQTT ao ProbeHarbor</strong>, veja a <a class="text-link" href="/about/mqtt-bridge">receita da ponte MQTT</a>.',
    blueprintHtml: '<a class="text-link" href="/ha/probeharbor_webhook.yaml" download>Baixar o blueprint do HA (YAML)</a>',
    pointHtml:
      "Aponte a URL do webhook de saída do ProbeHarbor para <code>https://&lt;your-ha-host&gt;/api/webhook/probeharbor_alerts</code> (ou uma URL do Cloudflare Tunnel / Nabu Casa). Verifique <code>X-Signature</code> numa condição de template se tiver definido um segredo.",
    mqttHtml:
      "Para MQTT, deixe o Home Assistant (ou o Node-RED) receber o webhook e publicar no seu broker: assim o MQTT fica local enquanto o ProbeHarbor continua em HTTPS. O blueprint inclui uma entrada opcional de tópico MQTT para esse caminho.",
  },
  metrics: {
    title: "Métricas do Grafana / Prometheus",
    introHtml: "Contas Pro podem criar chaves de API do painel (Dashboard → Share) e coletar:",
    shareHtml: "Ou usar um link de compartilhamento Pro com o escopo <strong>Metrics</strong>:",
    grafanaHtml:
      "Ou <code>?format=grafana</code> para um array JSON simples de pontos de dados. O escopo de compartilhamento de histórico mostra um gráfico de 7 dias na página pública.",
  },
  channels: {
    title: "Canais de alerta",
    items: [
      "E-mail e Discord (todos os planos)",
      "Token de bot + chat id do Telegram (suas credenciais)",
      "URL de Incoming Webhook do Slack (suas credenciais)",
      "Push no navegador e no Android (todos os planos)",
      "SMS via Twilio, webhook de saída (Pro)",
    ],
    rulesHtml:
      "Os alertas também aceitam risco de congelamento pela previsão, horários de silêncio e regras compostas com E (por exemplo, porta aberta + queda de temperatura). Veja Dashboard → Alerts.",
    emailHtml:
      'Os alertas por e-mail continuam disponíveis em todos os planos. Os resumos semanais podem ser ativados independentemente dos alertas de limite de congelamento/umidade. Os dados agregados por cidade (opcionais) aparecem em <a href="/freeze-map">/freeze-map</a>.',
  },
  related: {
    title: "Guias relacionados",
    itemsHtml: [
      '<a class="text-link" href="/docs/api">Documentação da API HTTP</a>: download do OpenAPI, ingestão, métricas e webhooks de entrada',
      '<a class="text-link" href="/about/kit-qr-onboarding">Ativação pelo QR do kit</a>: grave sua URL de ingestão num adesivo para o hardware',
      '<a class="text-link" href="/about/esp32-ota-firmware">OTA do ESP32 e relatório de bateria</a>: atualizações de firmware e os campos <code>battery</code> / <code>rssi</code>',
      '<a class="text-link" href="/about/zapier-make-recipes">Receitas para Zapier e Make.com</a>: webhooks de alerta de saída e automações de soneca de entrada',
    ],
  },
};

export const ingestAndWebhooksMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
