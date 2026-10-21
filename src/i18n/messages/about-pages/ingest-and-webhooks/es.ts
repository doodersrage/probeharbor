
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

export default es;
