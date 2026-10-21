
/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoDht22LcdMessages } from "./en";

const ptBr: ArduinoDht22LcdMessages = {
  heroAlt: "Placa de sonda Arduino com conectividade de rede e conectores para a ligação dos sensores",
  heroCaption: "Placa de sonda do ProbeHarbor com Ethernet, LCD e conectores para os DHT22.",
  intro:
    "O firmware trata o LCD e o feed JSON como duas visões dos mesmos dados. O LCD dá um retorno local imediato enquanto você instala sondas ou resolve problemas; a interface Ethernet publica as mesmas leituras no site e em qualquer outro cliente HTTP.",
  twoSensorsTitle: "Lendo dois sensores DHT22 de forma independente",
  twoSensorsBody:
    "Cada DHT22 fornece temperatura e umidade relativa por um protocolo de dados de um fio. Como cada sensor tem o próprio pino de dados (A4 e A5 nesta montagem), o sketch consegue consultá-los em sequência sem colisões no barramento. É por isso que o LCD mostra dois pares distintos, como 21,75 °C com 71,15% de umidade em uma linha e outra temperatura na seguinte, em vez de um único valor local médio.",
  keysHtml:
    "No site, essas mesmas sondas correspondem a chaves JSON (por exemplo <code>0</code>, <code>1</code> e <code>avg</code>). Os rótulos que você define no dashboard podem renomeá-las para “Parede norte” e “Zona da porta” sem mudar as chaves do firmware.",
  wiresTitle: "Ligação de sensores de três fios",
  wiresItemsHtml: [
    "<strong>Dados</strong>: um pino digital por sensor, com resistor de pull-up, como recomenda o datasheet do DHT22.",
    "<strong>VCC</strong>: 5 V do barramento da protoboard (uma alimentação estável faz diferença para leituras consistentes).",
    "<strong>GND</strong>: terra comum com o Arduino, o LCD e o shield Ethernet.",
  ],
  wiresBody:
    "Cabos longos até sondas distantes podem exigir pares trançados ou blindagem; a montagem da oficina mantém os sensores perto do controlador por simplicidade, mas o mesmo padrão de firmware funciona com sondas remotas cabeadas.",
  lcdTitle: "Layout e contraste do LCD",
  lcdBody1:
    "O display 16×2 mostra valores ao vivo durante a inicialização, a calibração e as quedas de rede. O potenciômetro de contraste na protoboard ajusta o V0 para que o texto continue legível com as variações de temperatura do ambiente. Se a tela parecer vazia depois do upload, ajuste o contraste antes de depurar o código.",
  lcdBody2:
    "O modo de quatro bits (só D4–D7) usa menos pinos que a ligação de oito bits: importante quando o Ethernet já ocupa os pinos SPI e duas linhas de dados de DHT22 estão alocadas.",
  backlightTitle: "Controle da luz de fundo",
  backlightBody:
    "Acionar a luz de fundo pelo pino 7 por meio de um transistor evita que a corrente passe pelo próprio pino do Arduino. O firmware pode diminuir ou piscar a luz de fundo como aviso (útil quando uma sonda marca abaixo de zero) sem travar o atendimento da rede.",
  ethernetTitle: "Ethernet junto com os sensores",
  ethernetBodyHtml: `O shield Ethernet W5100 encaixa sobre o Uno e usa SPI, deixando os pinos digitais e analógicos livres para a ligação do LCD e dos DHT22 descrita no <a class="text-link" href="/about/arduino-pin-wiring">guia pino a pino</a>. O shield basicamente “vai junto” na pilha: depois de configurado, o sketch pode servir JSON via HTTP e enviar o mesmo payload por POST para a <a class="text-link" href="/about/ingest-and-webhooks">ingestão push</a> (veja ${ETH_LINK}).`,
  jsonTitle: "Dos números do LCD ao JSON do site",
  jsonBodyHtml:
    'Depois de cada leitura bem-sucedida dos sensores, o sketch atualiza o LCD e monta o documento JSON servido aos clientes. O site busca esse JSON, guarda um histórico opcional quando você está conectado e mostra as mesmas chaves de sonda na página inicial. Experimente a <a class="text-link" href="/about/probe-demo">demo interativa de sondas</a> para ver como várias chaves e médias chegam aos consumidores.',
};

export default ptBr;
