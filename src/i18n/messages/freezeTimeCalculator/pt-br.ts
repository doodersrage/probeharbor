import type { FreezeTimeCalculatorMessages } from "./en";

const ptBr: FreezeTimeCalculatorMessages = {
  title: "Calculadora de tempo até o congelamento",
  description:
    "Com duas leituras de temperatura e um limite, estime quantas horas faltam até uma garagem, porão ou cabana ficar fria o bastante para congelar os canos.",
  breadcrumbHome: "Início",
  kicker: "Ferramenta",
  heading: "Quanto tempo até este espaço chegar ao congelamento?",
  lede: "Leia agora um termômetro no espaço, compare com uma leitura anterior e veja aproximadamente quantas horas faltam até ele chegar ao seu limite de congelamento no ritmo atual de resfriamento.",
  startFree: "Comece grátis",
  howLongLink: "Quanto tempo os canos levam para congelar",
  readingTitle: "Como ler o resultado",
  readingIntro:
    "A estimativa supõe que o espaço continua esfriando no ritmo que você mediu. Use-a para decidir o quanto esta noite é urgente: uma ou duas horas significa agir agora; um dia ou mais significa conferir de novo mais tarde.",
  readingLinksHtml:
    'Canos em paredes externas e perto de portas ficam mais frios que o ambiente, então meça o mais perto possível do cano. Veja <a class="text-link" href="/answers/garage-pipe-freeze-temperature">quando os canos da garagem congelam</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">em que temperatura configurar um alarme de congelamento</a> e <a class="text-link" href="/about/time-to-freeze">como funciona o relógio de tempo até o congelamento</a> no painel.',
  sensorTitle: "Deixe um sensor fazer a conta",
  sensorBody:
    "Uma sonda no cano envia leituras a cada poucos minutos, então a estimativa se atualiza sozinha e um alerta chega até você antes do limite. O plano gratuito inclui alertas por e-mail; use uma sonda ESP32 ou conecte o Home Assistant.",
  seeDemo: "Veja a demo ao vivo",
  faqs: [
    {
      question: "Como a calculadora funciona?",
      answer:
        "Ela pega o ritmo de resfriamento entre suas duas leituras e o prolonga em linha reta até o seu limite. Se o espaço caiu 1 °C (2 °F) na última hora e está 5,5 °C (10 °F) acima do limite, a estimativa é de cinco horas.",
    },
    {
      question: "Qual a precisão da estimativa?",
      answer:
        "É uma margem, não um cronômetro. Um espaço esfria mais devagar à medida que se aproxima da temperatura externa e mais rápido se o vento aumentar ou uma porta abrir, então refaça a conta com leituras novas mais ou menos a cada hora.",
    },
    {
      question: "Que limite devo usar?",
      answer:
        "De 1 a 3 °C (34–38 °F), medidos no cano. Chegar ao limite não significa que o cano congelou; significa que ainda há tempo para restabelecer o aquecimento, fechar uma porta ou abrir uma torneira.",
    },
    {
      question: "Dá para fazer isso automaticamente?",
      answer:
        "Sim. O ProbeHarbor faz o mesmo cálculo continuamente com as leituras do seu sensor em todos os planos e mostra o resultado como um relógio de tempo até o congelamento, com um alerta quando o espaço chega ao seu limite.",
    },
  ],
  calculator: {
    heading: "Calculadora",
    unitLegend: "Unidade de temperatura",
    nowLabel: "Temperatura agora (°{unit})",
    nowHint: "No cano, se der; senão, o ar perto dele.",
    earlierLabel: "Temperatura anterior (°{unit})",
    earlierHint: "Mesmo sensor, mesmo lugar.",
    minutesLabel: "Minutos entre as leituras",
    minutesHint: "15 ou mais; uma hora dá uma tendência mais estável.",
    thresholdLabel: "Limite de congelamento (°{unit})",
    thresholdHint: "{low}–{high} deixa tempo para agir antes de {freezing}.",
    resultLabel: "Tempo até o limite",
    headlineEmpty: "Informe quatro números",
    headlineAtThreshold: "Já no limite",
    headlineNotCooling: "Não está esfriando rumo ao congelamento",
    headlineNeedGap: "Precisa de um intervalo maior",
    detailEmpty: "Preencha todos os campos com um número para ver uma estimativa.",
    detailCooling: "Esfriando ~{rate}: cerca de {duration} até {threshold} neste ritmo.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} minutos",
    hours: "{n} horas",
    days: "{n} dias",
    msgAtThreshold: "Já está no seu limite de congelamento ou abaixo dele.",
    msgNeedReadings: "São necessárias leituras mais recentes para estimar uma tendência.",
    msgTooClose: "As leituras estão próximas demais para indicar uma tendência.",
    msgRising: "A temperatura está subindo: a tendência atual não indica risco de congelamento.",
    msgStable: "A temperatura está estável: a tendência não indica congelamento iminente.",
    reset: "Restaurar exemplo",
  },
};

export default ptBr;
