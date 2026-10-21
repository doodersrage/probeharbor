
/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const A = '<a class="text-link" target="_blank" rel="noreferrer" href=';
const ETH_INGEST = `${A}"${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>`;
const RELAY = `${A}"${REPO}/blob/main/sketches/relay/push_https_forward.py"><code>push_https_forward.py</code></a>`;
const SKETCHES = `${A}"${REPO}/tree/main/sketches">sketches/</a>`;
const FIRMWARE = `${A}"https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>`;
import type { Messages } from "./en";

const ptBr: Messages = {
  intro:
    "O hardware das sondas roda em microcontroladores compatíveis com Arduino. O firmware, normalmente chamado de sketch, lê os sensores em intervalos fixos, formata os resultados em JSON e os disponibiliza na rede para que o site e outros clientes busquem dados ao vivo sem cabo serial.",
  responsibilitiesTitle: "O que o sketch faz",
  responsibilities: [
    "Inicializa os barramentos dos sensores e o LCD local de 16×2 para leitura no local.",
    "Lê cada sonda DHT22 com novas tentativas em caso de erros temporários no barramento.",
    "Calcula a média das sondas em bom estado como valor-resumo rápido no JSON.",
    "Responde às requisições HTTP com um documento JSON compacto pelo shield Ethernet.",
    "Opcionalmente, registra erros na serial para depuração no local.",
  ],
  jsonTitle: "Formato JSON típico",
  jsonHtml:
    "Os clientes esperam um objeto <code>temp</code> no nível superior com chaves numéricas para cada sonda, além de <code>avg</code>. A umidade aparece ao lado da temperatura em cada sonda. Manter as chaves estáveis importa mais do que uma formatação bonita: os mapeamentos do dashboard fazem referência direta a essas chaves.",
  pushJsonHtml:
    'Para <a class="text-link" href="/about/ingest-and-webhooks">ingestão push</a>, o mesmo objeto de sonda pode ser enviado para <code>/api/ingest/&lt;key&gt;</code>. Os campos opcionais de nível superior <code>battery</code> (ou <code>battery_pct</code>) e <code>rssi</code> atualizam a saúde do dispositivo na página Devices sem exigir chaves de sensor extras.',
  pushTitle: "Ingestão push a partir do shield Ethernet",
  pushHtml: `A pilha W5100 de um Uno não suporta TLS, então não consegue fazer POST diretamente para <code>https://probeharbor.dev</code>. Use ${ETH_INGEST} para enviar o JSON <code>temp</code> clássico por HTTP (DHT22 em A4/A5, JSON opcional na porta 80 para leitura pela LAN). Rode ${RELAY} em um Raspberry Pi, NAS ou notebook para que esses POSTs cheguem ao ProbeHarbor por HTTPS. Os exemplos para ESP32 com Wi‑Fi que falam TLS ficam em ${SKETCHES}.`,
  wiringTitle: "Guias de ligação do hardware",
  wiringLede:
    "A montagem usa um Arduino Uno, um shield Ethernet W5100, uma protoboard, um potenciômetro de contraste, um LCD de 16×2 e dois sensores DHT22. Três páginas complementares documentam em detalhes os esquemas e o mapa de pinos:",
  networkTitle: "Escolhas da pilha de rede",
  networkHtml: `Esta revisão usa um shield Ethernet via SPI. O sketch cuida do DHCP, dos loops de reconexão e do envio do JSON enquanto o LCD continua mostrando os valores das sondas ao vivo. Quando o TLS é pesado demais para o MCU, um relay em Python pode terminar o HTTPS: veja <a class="text-link" href="/about/python-feeds">Scripts e feeds em Python</a>. Para ingestão push a partir do mesmo shield, veja ${ETH_INGEST}.`,
  rev2Alt: "Placa de sonda ProbeHarbor da segunda revisão com shield Ethernet, LCD e sensores DHT22",
  rev2Caption: "ProbeHarbor, revisão dois: Ethernet, leitura no LCD e duas entradas DHT22 em uma única montagem.",
  workflowTitle: "Fluxo de desenvolvimento",
  workflow:
    "Os sketches são editados no Arduino IDE ou no PlatformIO, gravados via USB e verificados com logs na serial antes de a placa ser instalada no espaço monitorado. Confira o formato do JSON com curl antes de adicionar a URL do feed ao dashboard do site.",
  samplesHtml: `Exemplos prontos para adaptar para DS18B20, MAX31855, MAX6675 e Uno + Ethernet ficam neste repositório, em ${SKETCHES}. O Raspberry Pi Pico W / Pico 2 W usa o mesmo JSON de ingestão com <a class="text-link" href="/about/pico-w-ingest">CircuitPython ou MicroPython</a>. Firmware completo de Ethernet + DHT + LCD: ${FIRMWARE}.`,
  tipsTitle: "Dicas de confiabilidade",
  tips: [
    "Reinicializações por watchdog recuperam a placa de travamentos raros de rede sem você precisar subir na escada.",
    "Separe o ruído da alimentação dos sensores da alimentação do MCU quando houver cabos longos.",
    "Versione seu esquema JSON na documentação ao adicionar campos.",
    "Documente quais pinos GPIO correspondem a quais etiquetas físicas de sonda; veja o guia de ligação dos pinos.",
  ],
};

export default ptBr;
