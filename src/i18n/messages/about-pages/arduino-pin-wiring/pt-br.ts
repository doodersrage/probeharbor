
/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoPinWiringMessages } from "./en";

const ptBr: ArduinoPinWiringMessages = {
  introHtml:
    "O diagrama de pinos abaixo corresponde ao construtor <code>LiquidCrystal</code> do firmware e às linhas de dados dos DHT22 usadas neste projeto. Use-o para conferir os jumpers com o sketch, principalmente quando pinos analógicos estiverem sendo usados como E/S digital.",
  diagramAlt: "Diagrama de ligação pino a pino de um Arduino Uno conectado a um LCD e a dois sensores DHT22",
  diagramCaption:
    "RS, RW, EN, linhas de dados, luz de fundo e os dois pinos de dados dos DHT22 mapeados para pinos específicos do Uno.",
  lcdTitle: "Mapa de pinos do LCD 16×2",
  lcdIntroHtml:
    "O sketch usa a forma de sete argumentos <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. Nesta montagem:",
  lcdItemsHtml: [
    "<strong>RS</strong> → pino digital 8",
    "<strong>RW</strong> → pino digital 9",
    "<strong>Enable</strong> → pino analógico A2 (usado como saída digital)",
    "<strong>D4–D7</strong> → pinos digitais 5, 6, 3 e pino analógico A3, respectivamente",
  ],
  lcdRw:
    "A maioria dos tutoriais liga o RW direto no terra e usa um construtor de seis argumentos. Ligar o RW ao pino 9 é menos comum, mas válido: permite que a biblioteca leia a flag de ocupado do LCD em vez de escrever cada caractere às cegas.",
  backlightTitle: "Luz de fundo no pino 7",
  backlightBody:
    "O pino 7 não é uma linha de dados do LCD. Ele aciona a luz de fundo por meio de um pequeno transistor na protoboard (visível perto do conector na montagem física). Controlar a luz de fundo separadamente economiza energia e permite piscar a tela nos alertas sem reescrever o texto do LCD.",
  dhtTitle: "Pinos de dados dos DHT22",
  dhtItemsHtml: [
    "<strong>Dados do sensor 1</strong> → pino analógico A4",
    "<strong>Dados do sensor 2</strong> → pino analógico A5",
    "Os dois sensores também são ligados a 5 V e GND",
  ],
  dhtBodyHtml:
    "Os pinos analógicos A4 e A5 funcionam perfeitamente como entradas digitais no Uno. No código, eles aparecem como <code>A4</code> e <code>A5</code>, e não pelos apelidos <code>D14</code>/<code>D15</code>: vale lembrar disso ao seguir os fios a olho.",
  spiTitle: "Pinos SPI reservados (Ethernet)",
  spiBody:
    "O shield Ethernet reserva os pinos 10–13 para SPI. Nenhuma ligação do LCD ou dos DHT22 pode usar essas linhas; na prática, elas estão proibidas no conector. É o planejamento em torno dessa reserva que torna possível usar Ethernet e sensores locais em um único Uno.",
  outroHtml: `Volte à <a class="text-link" href="/about/arduino-circuit-wiring">visão geral da ligação do circuito</a> para ver a disposição na protoboard, ou leia <a class="text-link" href="/about/arduino-dht22-lcd">Sensores DHT22 e display LCD</a> para entender o funcionamento. Exemplo de ingestão push (sem LCD): ${ETH_LINK}.`,
};

export default ptBr;
