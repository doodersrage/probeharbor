
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

export default ptBr;
