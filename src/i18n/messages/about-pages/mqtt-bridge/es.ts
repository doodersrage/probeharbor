
/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "ProbeHarbor no es un broker MQTT. Mantén Mosquitto, ESPHome o el MQTT de Home Assistant en tu red local y replica los topics que elijas por HTTPS, para que los SMS y correos de congelación y fugas del hogar y el historial vivan en la nube sin exponer el broker.",
  curlTitle: "Puente rápido (curl)",
  curlHtml:
    "Crea un <strong>dispositivo push</strong> en Dashboard → Devices, copia la clave de ingesta, asigna las claves JSON para que coincidan con tu payload MQTT y luego haz un POST:",
  devicesHtml:
    'La creación completa de dispositivos (push o pull) se explica en <a class="text-link" href="/about/adding-devices">Añadir dispositivos push y pull</a>. Formatos de payload y webhooks de alertas salientes: <a class="text-link" href="/about/ingest-and-webhooks">API de ingesta y webhooks de alertas</a>.',
  haTitleHtml: "<code>rest_command</code> de Home Assistant",
  haHtml:
    '¿Prefieres entidades automáticas a partir de un enlace compartido? Usa la <a class="text-link" href="/integrations/home-assistant">integración oficial de HACS</a>. Para replicar solo MQTT:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Importa <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, apunta los nodos MQTT a tu broker, define <code>PROBEHARBOR_INGEST_KEY</code> y despliega. Guía del producto: <a class="text-link" href="/integrations/node-red">integración con Node-RED</a>. Explicación ampliada: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">documentación para desarrolladores del puente MQTT</a>.',
  relatedTitle: "Relacionado",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: funcionamiento en paralelo con MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor frente a MQTT casero</a>',
    '<a class="text-link" href="/about/adding-devices">Añadir dispositivos push y pull</a>',
    '<a class="text-link" href="/docs/api">API HTTP</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

export default es;
