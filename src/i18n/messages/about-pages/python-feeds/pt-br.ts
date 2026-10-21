
/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { PythonFeedsMessages } from "./en";

const REPO_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>';
const RELAY_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a>';
const ETH_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>';

const ptBr: PythonFeedsMessages = {
  intro:
    "Microcontroladores são ótimos para ler sondas; o Python se destaca em cache, autenticação e em servir endpoints HTTPS estáveis. O projeto fast-api-relay fica entre o JSON do Arduino e o site em Astro, padronizando as respostas e reduzindo a carga sobre pilhas embarcadas frágeis.",
  relayTitle: "Por que uma camada de relay ajuda",
  relayBody:
    "Requisições diretas do navegador para um IP da rede local falham quando o DNS muda, os certificados expiram ou a internet de casa cai. Um relay em uma VPS ou em um worker na nuvem oferece uma única URL estável, adiciona cache com Redis para que os dashboards não sobrecarreguem a sonda e pode reunir vários locais se você expandir para além de um único imóvel.",
  fastapiTitle: "Responsabilidades do FastAPI",
  fastapiItemsHtml: [
    "Receber, em intervalos programados, os dados do Arduino ou do agente da rede local.",
    "Guardar o payload mais recente no Redis com um TTL curto.",
    "Servir na hora, a partir do cache, as respostas <code>GET /...</code> para o site.",
    "Registrar dados desatualizados quando a origem para de atualizar: útil para alertas.",
  ],
  consumerTitle: "Exemplo de consulta de um consumidor",
  consumerBodyHtml:
    "A camada de consultas do site em Astro acessa a URL HTTPS que você configurou, lê o objeto <code>temp</code> (ou detecta automaticamente JSON SenML / Home Assistant REST quando essa raiz não existe) e associa as chaves às sondas do dashboard. A mesma URL pode alimentar scripts Node, plugins JSON do Grafana ou sensores REST do Home Assistant.",
  figureAlt:
    "Visualizador de JSON do navegador mostrando as chaves de sonda temp 0, 1 e avg com Fahrenheit, Celsius e umidade",
  figureCaption: "Exemplo do formato de payload do relay que o site espera depois de armazenar em cache o JSON do Arduino.",
  scriptsTitle: "Scripts operacionais",
  scriptsBody:
    "Além da API, pequenos utilitários em Python validam o schema JSON, completam arquivos CSV históricos ou comparam as médias das sondas com as previsões do OpenWeather. Como as sondas expõem JSON simples, você pode prototipar análises em um notebook antes de levar a lógica para serviços em produção.",
  repoTitle: "Referência do repositório",
  repoBodyHtml: `Detalhes de implementação, configuração do Redis e notas de deploy do relay são mantidos em ${REPO_LINK}. Configure a URL pública do relay nas <a class="text-link" href="/dashboard/devices">configurações do feed de temperatura</a> depois de entrar.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS para ingestão push",
  unoBodyHtml: `Um shield W5100 não consegue fazer POST para <code>https://probeharbor.dev</code>. O relay feito só com a biblioteca padrão ${RELAY_LINK} escuta HTTP vindo do Arduino e repassa o mesmo caminho e corpo via HTTPS. Use-o junto com ${ETH_LINK} (DHT22 em A4/A5, JSON <code>temp</code> clássico).`,
};

export default ptBr;
