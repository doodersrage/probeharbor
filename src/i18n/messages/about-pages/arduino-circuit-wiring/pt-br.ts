
/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "Esta montagem gira em torno de um Arduino Uno com um shield Ethernet W5100 encaixado por cima, uma protoboard sem solda para distribuir a alimentação e os componentes de apoio do LCD, um LCD de caracteres 16×2 para mostrar as leituras no local e dois sensores de temperatura e umidade DHT22. Durante o desenvolvimento, o USB alimenta a bancada; em uma instalação permanente, normalmente se passa para uma fonte regulada de 5 V.",
  diagramAlt: "Diagrama de ligação de um Arduino Uno com shield Ethernet, protoboard, LCD e dois sensores DHT22",
  diagramCaption:
    "Ligação geral: a alimentação entra pelo Uno e os sinais passam pela protoboard até o LCD e os dois sensores DHT22.",
  breadboardTitle: "Protoboard e trilhas de alimentação",
  breadboardHtml:
    "A protoboard carrega principalmente as trilhas de alimentação de 5 V e GND, além da fiação de sinal do LCD. Manter alimentação e sinais organizados na protoboard facilita trocar o potenciômetro de contraste ou o LCD sem mexer nos fios dos sensores. Ligue o terra do Arduino à trilha de terra da protoboard para que todos os componentes compartilhem a mesma referência.",
  contrastTitle: "Circuito de contraste do LCD",
  contrastHtml:
    "Um trimpot na protoboard define a tensão de contraste no pino V0 do LCD. Sem esse divisor, a tela pode parecer vazia ou totalmente escura mesmo com o sketch funcionando direitinho. Ajuste o trimpot depois de ligar até que as duas linhas de texto fiquem legíveis num relance do outro lado do ambiente.",
  dhtTitle: "Dois sensores DHT22",
  dhtHtml:
    "Cada DHT22 usa três ligações: dados, VCC e GND. Levar os dados a pinos separados do Arduino permite que o firmware consulte os sensores de forma independente; é por isso que o LCD consegue mostrar dois pares diferentes de temperatura e umidade, por exemplo 21,75 °C / 71,15% em uma linha e a leitura da segunda sonda na seguinte.",
  ethernetTitle: "Posição do shield Ethernet",
  ethernetHtml:
    "O shield Ethernet fica encaixado sobre o Uno e se comunica por SPI (pinos 10–13 no layout clássico do Uno). Ele não compartilha pinos de dados com a fiação do LCD nem dos DHT22, deixando espaço no conector para os sensores e a tela. É essa separação que torna a combinação viável em uma única placa, sem conflito de pinos.",
  nextHtml:
    'Para os números exatos de GPIO usados no sketch, continue em <a class="text-link" href="/about/arduino-pin-wiring">ligação pino a pino do Arduino</a>. Para ver como o LCD e as sondas se comportam no firmware, veja <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 e tela LCD</a>.',
};

export default ptBr;
