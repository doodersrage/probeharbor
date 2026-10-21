
/** /about/mqtt-bridge body copy. Code blocks stay in the page. `*Html` keys are trusted inline HTML. */
import type { Messages } from "./en";

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

export default ptBr;
