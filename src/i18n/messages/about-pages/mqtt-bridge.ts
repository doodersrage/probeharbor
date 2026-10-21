import { defineMessages } from "../../translate";

/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */
const en = {
  introHtml:
    "ProbeHarbor is not an MQTT broker. Keep Mosquitto, ESPHome, or Home Assistant MQTT on your LAN, then mirror selected topics over HTTPS so household freeze and leak SMS/email and history live in the cloud without exposing the broker.",
  curlTitle: "Quick bridge (curl)",
  curlHtml:
    "Create a <strong>push device</strong> under Dashboard → Devices, copy the ingest key, map JSON keys to match your MQTT payload, then POST:",
  devicesHtml:
    'Full device creation (push vs pull) is covered in <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. Payload shapes and outbound alert webhooks: <a class="text-link" href="/about/ingest-and-webhooks">Ingest API and alert webhooks</a>.',
  haTitleHtml: "Home Assistant <code>rest_command</code>",
  haHtml:
    'Prefer automatic entities from a share link? Use the <a class="text-link" href="/integrations/home-assistant">official HACS integration</a>. For MQTT-only mirroring:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Import <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, point MQTT nodes at your broker, set <code>PROBEHARBOR_INGEST_KEY</code>, and deploy. Product guide: <a class="text-link" href="/integrations/node-red">Node-RED integration</a>. Extended write-up: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">developer MQTT bridge docs</a>.',
  relatedTitle: "Related",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: dual-run with MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs DIY MQTT</a>',
    '<a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>',
    '<a class="text-link" href="/docs/api">HTTP API</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

type Messages = typeof en;

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

const de: Messages = {
  introHtml:
    "ProbeHarbor ist kein MQTT-Broker. Behalte Mosquitto, ESPHome oder das MQTT von Home Assistant in deinem LAN und spiegle ausgewählte Topics über HTTPS, damit Frost- und Leckage-SMS/-E-Mails für den Haushalt und der Verlauf in der Cloud liegen, ohne dass der Broker offen im Netz steht.",
  curlTitle: "Schnelle Brücke (curl)",
  curlHtml:
    "Lege unter Dashboard → Devices ein <strong>Push-Gerät</strong> an, kopiere den Ingest-Schlüssel, ordne die JSON-Schlüssel deinem MQTT-Payload zu und sende dann einen POST:",
  devicesHtml:
    'Das vollständige Anlegen von Geräten (Push oder Pull) beschreibt <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Payload-Formate und ausgehende Alarm-Webhooks: <a class="text-link" href="/about/ingest-and-webhooks">Ingest-API und Alarm-Webhooks</a>.',
  haTitleHtml: "Home Assistant <code>rest_command</code>",
  haHtml:
    'Lieber automatische Entitäten über einen Freigabelink? Nutze die <a class="text-link" href="/integrations/home-assistant">offizielle HACS-Integration</a>. Für reines MQTT-Spiegeln:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Importiere <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, richte die MQTT-Nodes auf deinen Broker, setze <code>PROBEHARBOR_INGEST_KEY</code> und deploye. Produktleitfaden: <a class="text-link" href="/integrations/node-red">Node-RED-Integration</a>. Ausführliche Beschreibung: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">Entwicklerdoku zur MQTT-Brücke</a>.',
  relatedTitle: "Weiterführend",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: Parallelbetrieb mit MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor oder MQTT im Eigenbau</a>',
    '<a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>',
    '<a class="text-link" href="/docs/api">HTTP-API</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

const ptBr: Messages = {
  introHtml:
    "O ProbeHarbor não é um broker MQTT. Mantenha o Mosquitto, o ESPHome ou o MQTT do Home Assistant na sua rede local e espelhe os tópicos escolhidos via HTTPS, para que os SMS e e-mails de congelamento e vazamento da casa e o histórico fiquem na nuvem sem expor o broker.",
  curlTitle: "Ponte rápida (curl)",
  curlHtml:
    "Crie um <strong>dispositivo push</strong> em Dashboard → Devices, copie a chave de ingestão, mapeie as chaves JSON para combinar com o seu payload MQTT e então faça um POST:",
  devicesHtml:
    'A criação completa de dispositivos (push ou pull) está em <a class="text-link" href="/about/adding-devices">Adicionar dispositivos push e pull</a>. Formatos de payload e webhooks de alerta de saída: <a class="text-link" href="/about/ingest-and-webhooks">API de ingestão e webhooks de alerta</a>.',
  haTitleHtml: "<code>rest_command</code> do Home Assistant",
  haHtml:
    'Prefere entidades automáticas a partir de um link de compartilhamento? Use a <a class="text-link" href="/integrations/home-assistant">integração oficial do HACS</a>. Para espelhar apenas via MQTT:',
  noderedTitle: "Node-RED",
  noderedHtml:
    'Importe <a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>mqtt-to-probeharbor.json</a>, aponte os nós MQTT para o seu broker, defina <code>PROBEHARBOR_INGEST_KEY</code> e faça o deploy. Guia do produto: <a class="text-link" href="/integrations/node-red">integração com Node-RED</a>. Texto completo: <a class="text-link" href="https://probeharbor.dev/developers/integrations/mqtt-bridge">documentação para desenvolvedores da ponte MQTT</a>.',
  relatedTitle: "Relacionados",
  related: [
    '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: funcionamento em paralelo com o MQTT',
    '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs MQTT caseiro</a>',
    '<a class="text-link" href="/about/adding-devices">Adicionar dispositivos push e pull</a>',
    '<a class="text-link" href="/docs/api">API HTTP</a>: <code>POST /api/ingest/mqtt</code>',
  ],
};

export const mqttBridgeMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
