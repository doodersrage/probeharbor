
/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "Leituras ao vivo respondem “o que está acontecendo agora?”. Dados históricos respondem “o que costuma acontecer aqui?”. O ProbeHarbor armazena as leituras dos sensores vindas de ingestão push e de feeds pull, coletadas <strong>a cada 15 minutos</strong> (e sempre que você atualiza o Live).",
  whyTitle: "Por que guardar histórico",
  whyHtml:
    "Verificações pontuais são fáceis de esquecer. Um registro com data e hora mostra as mínimas da madrugada em uma semana fria, o aumento lento da umidade depois de uma goteira no telhado ou o primeiro dia de primavera em que o interior fica acima de 0 °C (32 °F). Esse contexto ajuda na documentação para o seguro, no ajuste da climatização e na decisão de se as melhorias de isolamento valeram a pena.",
  storedTitle: "O que é armazenado",
  storedHtml:
    "Cada linha salva inclui temperaturas em Fahrenheit e Celsius, porcentagem de umidade, data e hora, nome do feed, rótulo e chave da sonda. Várias sondas em um mesmo carregamento geram várias linhas, e a média configurada continua oferecendo um resumo rápido. Os dados ficam associados à sua conta, então visitantes não gravam na tabela de histórico compartilhada.",
  browseTitle: "Navegando pelo histórico paginado",
  browseHtml:
    "A visão de histórico do painel lista as leituras recentes com colunas de feed e sonda, para você filtrar mentalmente por área. A paginação mantém grandes volumes de dados rápidos. Quando você precisa do registro completo fora do site, a exportação em CSV baixa todas as leituras salvas da sua conta: disponível para administradores e assinantes ativos.",
  csvTitle: "Usos da exportação em CSV",
  csvItems: [
    "Importe em planilhas para tabelas dinâmicas e gráficos personalizados.",
    "Cruze com contas de luz e gás ou arquivos de clima para estudos de correlação.",
    "Compartilhe trechos anonimizados com prestadores de serviço ao diagnosticar problemas de isolamento.",
    "Arquive um arquivo por ano como registro de longo prazo do imóvel.",
  ],
  analysisTitle: "Ideias de análise",
  analysisHtml:
    "Monte um gráfico da temperatura mínima diária ao longo de dezembro para ver com que frequência você chega perto do risco de congelamento dos canos. Compare a umidade média antes e depois de instalar um desumidificador. Sobreponha a sonda <code>0</code> à sonda <code>1</code> para medir a diferença entre paredes. Como as chaves dos feeds JSON são estáveis, os scripts que você escrever hoje continuam funcionando mesmo depois de renomear os rótulos no painel.",
  yoyTitle: "Comparações com o ano anterior",
  yoyHtml:
    "<strong>Overview</strong> mostra <em>This week vs last year</em> (esta semana comparada ao ano passado) quando você tem dados de sondas do mesmo período de um ano atrás. Em <strong>History</strong> (Pro, 365 dias ou mais de retenção), ative <strong>Compare to last year</strong> para ver uma sobreposição cinza no gráfico. Se você ainda não tem dados locais do ano passado, o ProbeHarbor pode mostrar uma <strong>estimativa externa</strong> do Open-Meteo para o local do seu clima ou do seu mapa de congelamento: claramente identificada e sem substituir o histórico das suas sondas.",
  limitsTitle: "Limites e boas práticas",
  limitsHtml:
    "A profundidade do histórico depende do seu plano (Free, Member ou Pro). Para uma análise detalhada minuto a minuto, adicione um registrador dedicado no local. Trate este armazenamento como um diário prático ligado à sua conta, não como um instrumento de laboratório.",
  outroHtml:
    'Os detalhes da assinatura para exportação em CSV estão em <a class="text-link" href="/about/accounts-and-dashboard">ferramentas de conta e painel</a>.',
};

export default ptBr;
