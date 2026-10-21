import type { PipeForecastMessages } from "./en";

const ptBr: PipeForecastMessages = {
  title: "Meus canos vão congelar hoje à noite? Previsão de congelamento",
  description:
    "Informe uma cidade ou CEP (ZIP) dos EUA: mínimas de cinco noites, horas abaixo de zero e risco de congelamento em garagens, porões e sótãos sem aquecimento.",
  appName: "Previsão de congelamento de canos",
  breadcrumbHome: "Início",
  breadcrumb: "Previsão de congelamento de canos",
  kicker: "Ferramenta grátis",
  heading: "Meus canos vão congelar hoje à noite?",
  lede: "Confira as próximas cinco noites na sua região: a mínima, quantas horas fica abaixo de zero, o vento e se os canos de uma garagem, porão ou sótão sem aquecimento correm risco.",
  getAlerts: "Receba alertas de congelamento grátis por e-mail",
  whenGaragePipes: "Quando os canos da garagem congelam",
  alertsConfirmed: "Os alertas de congelamento estão ativados. Enviaremos um e-mail na tarde anterior a uma noite de congelamento.",
  alertsInvalid: "Esse link de confirmação não é mais válido. Procure sua região abaixo e cadastre-se de novo.",
  levelsTitle: "Como ler os níveis de risco",
  levelsHtml: [
    "<strong>Risco alto:</strong> a mínima externa é de −7 °C (20 °F) ou menos, o ponto mais citado a partir do qual os canos congelam em espaços sem aquecimento.",
    "<strong>Atenção:</strong> abaixo de zero, mas acima de −7 °C (20 °F). Canos expostos ainda podem congelar numa noite longa ou com vento.",
    "<strong>Risco baixo:</strong> a noite fica acima de 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'Numa noite de risco alto ou de atenção: abra as portas dos armários em paredes externas, mantenha a porta da garagem fechada, deixe pingar uma torneira de uma linha exposta e saiba onde fica o registro geral. Veja <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">se deixar a torneira pingando ajuda</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">quanto tempo os canos levam para congelar</a> e a <a class="text-link" href="/freeze-time-calculator">calculadora de tempo até o congelamento</a> se você tiver um termômetro no espaço.',
  insideTitle: "A previsão é do lado de fora. Seus canos estão do lado de dentro.",
  insideBody:
    "Uma sonda ao lado do cano mostra o que está realmente acontecendo no espaço e avisa você antes do congelamento, enquanto ainda há tempo para agir. O plano gratuito inclui alertas por e-mail; use uma sonda ESP32 (cerca de US$ 25 em peças) ou sensores que você já tem no Home Assistant.",
  startFree: "Comece grátis",
  kitParts: "Peças do kit de congelamento ESP32",
  sourcesTitle: "Fontes",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, em inglês, citando pesquisa da Universidade de Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, em inglês)",
  sourceNws: "API do National Weather Service",
  sourceNwsNote: ": dados de previsão por hora",
  faqs: [
    {
      question: "Em que temperatura externa os canos congelam?",
      answer:
        "A água congela a 0 °C (32 °F), mas os canos dentro de um imóvel geralmente precisam de um ar externo mais frio para congelar. Uma pesquisa da Universidade de Illinois, muito citada por seguradoras, coloca o ponto de perigo para canos em espaços sem aquecimento numa temperatura externa de cerca de −7 °C (20 °F). Por isso esta previsão marca como risco alto as noites a −7 °C (20 °F) ou menos.",
    },
    {
      question: "Os canos podem congelar quando a mínima fica acima de −7 °C (20 °F)?",
      answer:
        "Sim. Uma noite longa abaixo de 0 °C (32 °F) pode congelar um cano sem isolamento, numa parede externa, perto da porta da garagem ou num porão ventilado, principalmente com vento. Por isso as noites entre −6 °C e 0 °C (21–32 °F) são marcadas como Atenção.",
    },
    {
      question: "Por que o vento importa?",
      answer:
        "O ar em movimento tira calor de um cano muito mais rápido que o ar parado, então canos perto de respiros, frestas de portas e rachaduras em paredes externas congelam primeiro. A previsão destaca ventos de 24 km/h (15 mph) ou mais durante as horas de congelamento.",
    },
    {
      question: "Isso me diz o quanto minha garagem vai esfriar?",
      answer:
        "Não. A previsão é do ar externo. Uma garagem anexa ou com isolamento pode ficar bem acima da mínima externa, e uma cheia de frestas pode ficar quase tão fria quanto lá fora. O único jeito de saber é um termômetro perto dos canos, de preferência um que avise você antes de eles chegarem ao congelamento.",
    },
    {
      question: "De onde vem a previsão?",
      answer:
        "Da previsão por hora do National Weather Service (o serviço meteorológico dos EUA) para a sua localização, atualizada mais ou menos a cada 30 minutos. Ela cobre os Estados Unidos e seus territórios.",
    },
  ],
  tool: {
    riskHigh: "Risco alto",
    riskWatch: "Atenção",
    riskLow: "Risco baixo",
    errorUsOnly: "Esta previsão usa o National Weather Service, então só cobre locais nos EUA.",
    errorRateLimited: "Pesquisas demais em um minuto. Tente de novo daqui a pouco.",
    errorService: "O serviço de previsão não respondeu. Tente de novo em um minuto.",
    errorNoGeolocation: "Este navegador não consegue compartilhar a localização. Pesquise uma cidade ou CEP (ZIP).",
    errorGeoDeclined: "A permissão de localização foi negada. Pesquise uma cidade ou CEP (ZIP).",
    tonight: "Hoje à noite",
    weekdayNight: "Noite de {weekday}",
    headlineNone: "Nenhuma noite de previsão recebida",
    headlineHigh: "Hoje à noite: risco alto de congelamento em espaços sem aquecimento (mínima {low})",
    headlineWatch: "Hoje à noite: abaixo de zero (mínima {low}), fique de olho nos canos expostos",
    headlineColderLater: "Hoje à noite não congela, mas vêm noites mais frias",
    headlineClear: "Nenhuma noite de congelamento na previsão",
    describeHigh:
      "Mínima de {low}, no limite de {mark} ou abaixo dele, ponto em que canos de garagens, porões e sótãos sem aquecimento costumam correr risco.",
    describeWatchOne:
      "Abaixo de zero por cerca de {hours} hora, mínima {low}. Canos expostos em paredes externas, perto da porta da garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
    describeWatchMany:
      "Abaixo de zero por cerca de {hours} horas, mínima {low}. Canos expostos em paredes externas, perto da porta da garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
    describeAbove: "Fica acima de zero (mínima {low}).",
    describeWind: "Vento de até {wind} abaixo de zero tira calor mais rápido dos canos expostos.",
    describeNextDay: "O dia seguinte também fica abaixo de zero, então os espaços sem aquecimento não vão se aquecer de novo.",
    signupTitle: "Avise-me por e-mail antes das noites de congelamento em {place}",
    signupLede:
      "Grátis, sem hardware. Um e-mail na tarde anterior à primeira noite de congelamento de uma onda de frio, e antes de cada noite a {temp} ou menos. Cancele com um clique.",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    sending: "Enviando…",
    submit: "Receber alertas de congelamento",
    genericError: "Algo deu errado. Tente de novo.",
    heading: "Confira sua região",
    unitLegend: "Unidade de temperatura",
    searchLabel: "Cidade ou CEP (ZIP) dos EUA",
    searchPlaceholder: "ex.: 23219 ou Richmond, VA",
    useMyLocation: "Usar minha localização",
    myLocation: "Minha localização",
    resultsLabel: "Locais encontrados",
    loading: "Carregando a previsão para {place}…",
    source: " · previsão externa do National Weather Service",
    updated: ", atualizada em {time}",
    nightLow: "mínima · {hours} h a {temp} ou menos",
    nightBelow20: " · {hours} h a {temp} ou menos",
    embedSummary: "Incorpore esta previsão no seu site",
    embedLede:
      "Um pequeno widget ao vivo para o site de um encanador, de uma administradora de imóveis ou de um bairro. Mostra hoje à noite e as duas noites seguintes, e se atualiza sozinho.",
    copied: "Copiado",
    copyEmbed: "Copiar código de incorporação",
  },
};

export default ptBr;
