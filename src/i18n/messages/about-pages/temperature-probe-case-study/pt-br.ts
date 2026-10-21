
/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';
import type { Messages } from "./en";

const ptBr: Messages = {
  heroAlt:
    "Controlador de sondas de temperatura para garagem, segunda revisão, com conexão Ethernet e várias entradas de sensores",
  heroCaption: "Revisão dois da placa de sondas ProbeHarbor. Ethernet, LCD e duas entradas DHT22.",
  intro:
    "Este estudo de caso acompanha a construção da sonda de temperatura por trás do ProbeHarbor: por que um único termômetro externo não bastava, como foram escolhidas duas zonas DHT22 mais um resumo com a média e o que mudou entre a primeira instalação em protoboard e a revisão conectada à rede que hoje envia JSON ao vivo para este site.",
  challengeTitle: "O desafio",
  challenge: [
    "O objetivo era prático, não acadêmico: saber se uma garagem anexa à casa estava chegando perto do risco de congelamento, se a umidade estava subindo a ponto de enferrujar as ferramentas e se as condições eram diferentes perto do portão e na parede do fundo. Os apps de previsão do tempo só informam o ar externo na estação mais próxima, que pode diferir uns 5 °C (10 °F) ou mais do interior de uma garagem isolada numa tarde ensolarada de inverno.",
    "Um único sensor esconderia as diferenças que importam. Abrir o portão basculante, estacionar um carro ainda quente ou o sol da tarde numa parede voltada para o oeste mexem com partes diferentes do espaço em velocidades diferentes. A necessidade de várias sondas ficou clara antes de soldar o primeiro fio.",
  ],
  environmentTitle: "O ambiente",
  environment:
    "O espaço monitorado é uma garagem anexa típica: um grande portão basculante, piso de laje de concreto, menos isolamento que a área da casa e variações sazonais causadas tanto pela insolação e pelas infiltrações de ar quanto pela temperatura externa. No verão, a zona do portão fica mais quente; no inverno, a laje e a parede norte acompanham as mínimas externas com horas de atraso.",
  zonesHtml: [
    "<strong>Zona da parede norte:</strong> muda mais devagar; útil para acompanhar a tendência das mínimas da madrugada.",
    "<strong>Zona do portão:</strong> dá picos quando o portão abre; denuncia entradas rápidas de ar.",
    "<strong>Área da bancada:</strong> representa onde o trabalho realmente acontece, na altura dos ombros.",
  ],
  demoHtml:
    'A <a class="text-link" href="/about/probe-demo">demo interativa de sondas</a> simula essas três zonas para você ver como o sol e o estado do portão afastam as leituras, sem instalar hardware.',
  approachTitle: "Abordagem e hardware",
  approachHtml: [
    "Cada sonda usa um sensor digital de umidade e temperatura DHT22 com um cabo curto até um Arduino Uno. O firmware lê os dois sensores em intervalos fixos, tenta de novo em caso de erros temporários no barramento, calcula um <code>avg</code> das sondas em bom estado e envia JSON compacto pela rede local por meio de um shield Ethernet. Um LCD de 16×2 na placa mostra os valores ao vivo para conferir no local sem notebook.",
    'O posicionamento seguiu as regras do <a class="text-link" href="/about/temperature-probes">guia de sondas de temperatura</a>: longe de pontos de sol direto e exaustores, mais ou menos na altura dos ombros e com montagem ventilada para o ar passar pela cabeça do sensor. Rótulos no dashboard associam as chaves JSON <code>0</code> e <code>1</code> a nomes de zona legíveis.',
  ],
  rev1Alt: "Placa de sonda da primeira revisão em uma protoboard com sensores DHT22 e LCD",
  rev1Caption: "A revisão um validou na bancada a ligação, os intervalos de leitura e o formato do JSON antes da instalação na garagem.",
  timelineTitle: "Linha do tempo da montagem",
  timelineHtml: [
    "<strong>Primeiros testes na bancada:</strong> os logs na serial confirmaram as leituras do DHT22, a formatação do LCD e chaves JSON <code>temp</code> estáveis antes de a placa sair da mesa.",
    "<strong>Revisão um na garagem:</strong> provou que as diferenças entre as sondas eram reais: a zona do portão se afastava com frequência da parede norte nos horários de ida e volta do trabalho.",
    "<strong>Feed JSON pela rede:</strong> a Ethernet acabou com a necessidade de levar um notebook a cada conferência; o site podia buscar o mesmo documento que o LCD já mostrava.",
    "<strong>Revisão dois:</strong> encaixe mais limpo do shield Ethernet, conectores de sonda aprimorados e lógica de reinicialização compatível com watchdog para os raros travamentos de rede.",
    "<strong>Integração com o site:</strong> as páginas em Astro associam os feeds a cards; o histórico de quem está logado guarda snapshots para análise de tendências e exportação em CSV.",
  ],
  dataTitle: "O que os dados mostraram",
  dataLede: "Depois de um ciclo completo de inverno e verão, as sondas valeram a pena de formas que uma única leitura teria deixado passar:",
  data: [
    "A temperatura perto do portão podia variar de 4 a 7 °C (8–12 °F) poucos minutos depois de abrir o portão basculante, enquanto a parede do fundo mudava pouco.",
    "As mínimas da madrugada perto da parede norte acompanhavam o risco de congelamento com mais confiabilidade do que apenas as previsões externas.",
    "A umidade subia depois de períodos longos de frio, quando a laje demorava a esquentar: útil para decidir quando ligar um desumidificador.",
    "A média calculada suavizava o ruído nos gráficos de histórico, enquanto os cards por sonda na página inicial preservavam o detalhe de cada zona.",
  ],
  flowHtml:
    'As leituras vão da sonda ao dashboard pelo caminho documentado em <a class="text-link" href="/about/data-flow">fluxo de dados de ponta a ponta</a>. Quando foi preciso TLS na borda, um <a class="text-link" href="/about/python-feeds">relay em Python</a> fez cache do JSON de origem sem jogar essa complexidade para o microcontrolador.',
  lessonsTitle: "Lições aprendidas",
  lessonsHtml: [
    "<strong>Posição vale mais que o preço do sensor:</strong> um DHT22 bem instalado superou sempre um sensor premium mal posicionado.",
    "<strong>Nomeie as zonas no software:</strong> chaves JSON estáveis com rótulos no dashboard mantiveram firmware e site pouco acoplados.",
    "<strong>Conte com lacunas:</strong> reinicializações e quedas rápidas de rede criam lacunas curtas; diferencie-as de erros de configuração usando os guias de leituras desatualizadas.",
    "<strong>Construa pensando em iterar:</strong> a revisão um em protoboard poupou uma subida na escada quando a atribuição dos pinos mudou.",
  ],
  relatedTitle: "Leitura relacionada",
  relatedHtml: `Continue com a <a class="text-link" href="/about/temperature-probes">visão geral das sondas de temperatura</a>, o guia de <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>, <a class="text-link" href="/about/temperature-changes">o que faz as leituras mudarem</a> e o <a class="text-link" href="/about/historical-data">uso dos dados históricos</a> no dashboard. Código-fonte do firmware: ${FIRMWARE_LINK}.`,
};

export default ptBr;
