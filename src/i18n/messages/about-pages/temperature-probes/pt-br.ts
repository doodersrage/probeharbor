
/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    'As sondas de temperatura são a camada de medição de qualquer monitor ambiental. Em uma garagem, oficina, sótão, porão ou galpão, elas transformam calor e umidade em números que o resto do sistema pode armazenar, colocar em gráficos e usar para alertas. Este projeto usa sensores digitais de umidade e temperatura ligados a um Arduino, com vários canais de sonda para você comparar áreas em vez de confiar em uma única leitura. Para a história completa da montagem, leia o <a class="text-link" href="/about/temperature-probe-case-study">estudo de caso da sonda de temperatura</a>.',
  measureTitle: "O que as sondas medem na prática",
  measureHtml:
    "Cada sonda informa dois valores que importam nas decisões do dia a dia: a temperatura do ar e a umidade relativa. A temperatura mostra se canos, tinta ou itens guardados estão chegando perto de limites arriscados. A umidade ajuda a explicar a condensação em superfícies frias, a ferrugem nas ferramentas e se vale a pena ligar o desumidificador à noite.",
  jsonHtml:
    "Nesta montagem, as sondas expõem suas leituras em um objeto JSON indexado pelo número da sonda: <code>0</code>, <code>1</code> e um <code>avg</code> calculado a partir dos sensores ativos. Essa estrutura se encaixa facilmente em rótulos do painel como “Parede norte” ou “Área da bancada”.",
  usesTitle: "Usos comuns das sondas em espaços sem aquecimento",
  uses: [
    "<strong>Proteção contra congelamento:</strong> acompanhe as mínimas da madrugada perto das paredes externas antes que o encanamento corra risco.",
    "<strong>Comparação sazonal:</strong> compare as áreas perto do sótão com o nível do piso durante o calor do verão.",
    "<strong>Saúde dos equipamentos:</strong> fique de olho na umidade perto de ferramentas de metal, baterias ou papéis guardados.",
    "<strong>Conforto para trabalhar:</strong> confirme se mudanças no isolamento ou na ventilação realmente ajudam.",
    "<strong>Verificação remota:</strong> consulte as leituras ao vivo quando estiver fora, em vez de adivinhar só pelo clima lá fora.",
  ],
  placementTitle: "A posição importa mais que o preço do sensor",
  placementHtml:
    "Uma sonda perto de um portão sem isolamento vai oscilar muito toda vez que ele abrir. Uma em uma parede voltada para o norte pode ficar horas atrás da temperatura externa. Para ter tendências estáveis, instale as sondas longe de sol direto, do vento de ventiladores e de fontes de calor como freezers ou aquecedores de água. A altura dos ombros (1,2–1,5 m) costuma representar o ar que as pessoas e os itens guardados sentem.",
  multipleTitle: "Por que várias sondas são melhores que uma",
  multipleHtml:
    "Garagens, oficinas e sótãos não são caixas uniformes. Um único sensor pode marcar 7 °C (45 °F) perto do piso enquanto a parte de cima está a 14 °C (58 °F) em uma tarde ensolarada de inverno. Várias sondas revelam gradientes, pontos com isolamento ruim e qual área representa o risco que importa para você. O firmware tira a média das sondas ativas, então a página de histórico continua com um resumo por carregamento, enquanto a página inicial mantém o detalhe de cada sonda.",
  boardAlt: "Placa controladora de sondas do ProbeHarbor com conexão Ethernet e sensores DHT22",
  boardCaption: "Segunda revisão da placa de sondas do ProbeHarbor: Ethernet, LCD e duas entradas DHT22.",
  webTitle: "Do fio da sonda à página web",
  webHtml:
    'As sondas não falam diretamente com o site. O sketch do Arduino lê cada sensor em intervalos programados, valida as faixas e publica JSON via HTTPS. O site busca esse feed, associa as chaves aos rótulos que você configura no painel e, se você estiver conectado, pode salvar as leituras. Experimente a <a class="text-link" href="/about/probe-demo">demonstração interativa de sondas</a> para ver como várias áreas e as médias se comportam, ou leia o guia do <a class="text-link" href="/about/data-flow">fluxo de dados de ponta a ponta</a>.',
};

export default ptBr;
