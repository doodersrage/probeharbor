import type { StoryOverlay } from "..";

export default {
  "garage-freeze-alert": {
    headline: "Cenário: aquecedor da garagem falha",
    title: "O aquecedor da garagem desarma às 2h da manhã",
    description:
      "Cenário: o aquecedor da garagem falha de madrugada numa onda de frio. Sensor ESP32, limite de 1 °C (34 °F) e SMS dão tempo antes de os canos congelarem.",
    setting: "Garagem aquecida com encanamento, clima frio",
    setup: [
      "ESP32 + DHT22 enviando leituras a cada 5 minutos para o ingest do ProbeHarbor",
      "Limite de congelamento em 1 °C (34 °F) com SMS (Pro) e envio para o Telegram",
      "Resumo semanal para a casa; link ao vivo da família para um vizinho que fica de olho na casa",
    ],
    timeline: [
      { time: "2h14", detail: "A garagem cai abaixo de 1 °C (34 °F); o ProbeHarbor manda SMS para os dois donos e publica num canal da família no Telegram." },
      { time: "2h22", detail: "Um dos donos reinicia o aquecedor por uma tomada inteligente." },
      { time: "3h05", detail: "O gráfico mostra a temperatura se recuperando, bem antes de os canos chegarem a 0 °C (32 °F)." },
    ],
    outcome:
      "Uma falha no aquecedor só vira desastre se ninguém perceber até de manhã. O limite fica alguns graus acima do ponto de congelamento para dar tempo de reagir, e é o SMS que acorda você às 2h da manhã; um e-mail passa fácil enquanto você dorme.",
    faqs: [
      {
        question: "Quais canais de alerta acordam você de madrugada?",
        answer:
          "SMS (Pro) e notificações push (em todos os planos) são os que realmente acordam. E-mail e canais de chat como o Telegram também estão em todos os planos e funcionam bem como segunda via.",
      },
      {
        question: "Que hardware é preciso?",
        answer:
          "Um ESP32 com um DHT22 ou um DS18B20 à prova d’água enviando leituras a cada poucos minutos para o ingest do ProbeHarbor, e um limite de congelamento por volta de 1 °C (34 °F).",
      },
    ],
  },
  "cabin-winter-watch": {
    headline: "Cenário: aquecimento de cabana vazia para",
    title: "O aquecimento da cabana para no meio da semana",
    description:
      "Cenário: uma queda de energia reinicia o aquecimento de uma cabana vazia no inverno. Um sensor no porão e alertas por e-mail e push avisam dias antes.",
    setting: "Cabana de férias, vazia quase a semana toda",
    setup: [
      "ESP8266 com Wi-Fi perto da casa de máquinas, dois sensores (área de convivência + porão)",
      "E-mail mais push no navegador; limite de congelamento de 2 °C (36 °F)",
      "Um amigo da região convidado para a casa como contato reserva",
    ],
    timeline: [
      { time: "Ter., 11h40", detail: "Uma queda rápida de energia reinicia o aquecimento; o porão cai abaixo de 2 °C (36 °F)." },
      { time: "Ter., 11h41", detail: "O push e o e-mail saem; o dono liga para o amigo da região." },
      { time: "Ter., 13h10", detail: "O amigo religa o aquecimento e o gráfico sobe antes do frio da noite." },
    ],
    outcome:
      "Imóveis vazios falham em silêncio. O valor está na antecedência: um alerta na terça em vez de descobrir canos congelados na sexta.",
    faqs: [
      {
        question: "Uma cabana precisa de SMS?",
        answer:
          "Nem sempre. E-mail e push funcionam quando alguém consegue agir em algumas horas. O SMS (Pro) ajuda quando você pode ficar sem conexão de dados.",
      },
      {
        question: "Quantos sensores?",
        answer:
          "Dois: um na área de convivência como referência e outro no porão, onde os canos realmente correm risco de congelar.",
      },
    ],
  },
  "server-closet-heat": {
    headline: "Cenário: armário de servidores superaquece",
    title: "O ventilador do armário morre antes do fim de semana",
    description:
      "Cenário: o ventilador do armário do homelab falha com você fora. Uma regra de calor e um webhook para o Home Assistant desligam os equipamentos a tempo.",
    setting: "Armário de homelab ao lado de uma garagem",
    setup: [
      "Um ESP32 que já monitora a garagem; um segundo sensor no armário",
      "Regra de calor a 35 °C (95 °F) (Alerts → Rules → Add heat rule) junto com o monitoramento de congelamento na garagem",
      "Webhook de saída (Pro) para o Home Assistant desligar uma tomada inteligente",
    ],
    timeline: [
      { time: "Sex., 18h05", detail: "O armário chega a 36 °C (96 °F) depois que um ventilador falha; a regra de calor dispara e o webhook chega ao Home Assistant." },
      { time: "Sex., 18h06", detail: "Uma automação desliga os equipamentos não críticos; um SMS confirma o alerta." },
      { time: "Sábado de manhã", detail: "O dono troca o ventilador; o histórico mostra a rapidez com que o armário esquentou." },
    ],
    outcome:
      "Os mesmos sensores e o mesmo caminho de ingest cobrem os dois tipos de falha: congelamento na garagem, calor no armário.",
    faqs: [
      {
        question: "O ProbeHarbor é só para o frio?",
        answer:
          "Não. Os alertas de congelamento já vêm prontos, e o calor usa uma regra (“Temperature above”, padrão de 35 °C/95 °F) que você adiciona com um clique em Alerts → Rules.",
      },
      {
        question: "Onde entra o Home Assistant?",
        answer:
          "Os webhooks de saída do Pro enviam o JSON do alerta via POST para o Home Assistant, onde uma automação pode desligar uma tomada inteligente. A integração oficial do HACS também expõe as leituras como sensores e adiciona serviços para adiar alertas; veja probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  "pipe-near-miss": {
    headline: "Cenário: canto frio da garagem anexa",
    title: "O mesmo canto cai abaixo de 1 °C (34 °F) toda noite limpa",
    description:
      "Cenário: alertas de congelamento repetidos numa garagem anexa. O histórico e o CSV do ProbeHarbor apontam uma vedação de porta ruim antes do gelo.",
    setting: "Garagem anexa com aquecedor de água",
    setup: [
      "Arduino + DHT22 numa prateleira acima do aquecedor de água",
      "Alertas por e-mail a 1 °C (34 °F) no plano Free; Member para exportar CSV",
      "Temperatura da garagem comparada com o clima externo no dashboard",
    ],
    timeline: [
      { time: "Semana 1", detail: "Os alertas disparam em noites limpas e sem vento; parece frio comum." },
      { time: "Semana 2", detail: "O histórico e o CSV mostram que o sensor do lado da porta sempre cai primeiro." },
      { time: "Semana 3", detail: "Depois de vedar a porta, as noites ficam acima do limite." },
    ],
    outcome:
      "Um alerta diz que algo está errado; o histórico diz onde. Uma vedação barata é melhor do que esperar a noite fria o bastante para rachar um cano.",
    faqs: [
      {
        question: "O plano Free basta para isso?",
        answer:
          "Os alertas por e-mail do Free detectam o problema. O Member adiciona exportação CSV e histórico mais longo, o que deixa um padrão repetido fácil de ver.",
      },
      {
        question: "Garagens anexas congelam?",
        answer:
          "Sim, principalmente junto às paredes externas e portas com frestas. Anexa não é o mesmo que aquecida.",
      },
    ],
  },
  "crawlspace-pipe-watch": {
    headline: "Cenário: ventilação do porão travada",
    title: "Uma abertura de ventilação do porão trava aberta à noite",
    description:
      "Cenário: uma abertura de ventilação trava aberta numa noite fria. Um DS18B20 à prova d’água no cano e os alertas do ProbeHarbor dão tempo de fechá-la.",
    setting: "Porão baixo sob a casa, clima frio",
    setup: [
      "ESP32 + DS18B20 à prova d’água preso com abraçadeira perto da tubulação principal de entrada",
      "Limite de congelamento de 2 °C (36 °F) com e-mail e SMS (Pro)",
      "Link ao vivo da família para um parente que mora perto",
    ],
    timeline: [
      { time: "Dom., 4h05", detail: "O porão cai abaixo de 2 °C (36 °F) com uma abertura de ventilação da fundação travada aberta." },
      { time: "Dom., 4h06", detail: "SMS e e-mail saem; o parente que mora perto confere o link ao vivo e vai até lá." },
      { time: "Dom., 5h20", detail: "A abertura é fechada e o gráfico começa a subir antes da mínima da manhã." },
    ],
    outcome:
      "Ninguém confere o porão às 4h da manhã. Um sensor no cano, não na entrada de acesso, é o que transforma uma ventilação travada num conserto rápido.",
    faqs: [
      {
        question: "Onde fica o sensor do porão?",
        answer:
          "Sobre o cano de entrada mais frio ou ao lado dele, não na entrada de acesso. Adicione um sensor na área de convivência se quiser uma referência do andar de cima.",
      },
      {
        question: "Um sensor de umidade basta?",
        answer:
          "Não. A umidade ajuda a notar excesso de água, mas o risco de congelamento é a temperatura nos canos. Use um sensor à prova d’água e um limite alguns graus acima de 0 °C (32 °F).",
      },
    ],
  },
  "detached-garage-winter": {
    headline: "Cenário: aquecedor de oficina separada",
    title: "Um aviso de previsão, depois um aquecedor desarmado",
    description:
      "Cenário: o aquecedor de uma oficina desarma o DR numa noite fria prevista. O aviso de previsão cobre a véspera; o alerta de limite cobre a própria noite.",
    setting: "Oficina separada da casa com tanque de serviço",
    setup: [
      "ESP32 com Wi-Fi acima do tanque; segundo sensor perto do portão seccional",
      "Avisos de congelamento pela previsão do tempo (Member) mais e-mail",
      "Modo férias desligado antes de uma viagem, para os alertas continuarem chegando",
    ],
    timeline: [
      { time: "Quarta", detail: "Um aviso de previsão aponta a mínima da madrugada de quinta; o dono confirma que o aquecedor está ligado." },
      { time: "Qui., 1h50", detail: "O aquecedor desarma o DR; a oficina cai abaixo de 1 °C (34 °F) e o e-mail sai." },
      { time: "Qui., 2h15", detail: "O dono religa o circuito por uma tomada inteligente antes de o cano do tanque congelar." },
    ],
    outcome:
      "Construções separadas perdem calor rápido. O aviso de previsão cobre a janela de planejamento; o alerta de limite cobre a falha em si.",
    faqs: [
      {
        question: "Uma garagem separada precisa de dois sensores?",
        answer:
          "Um perto dos canos ou do tanque basta para começar. Um segundo perto da porta pega correntes de ar que a parede do fundo nunca sente.",
      },
      {
        question: "O Free basta para uma oficina separada?",
        answer:
          "Os alertas por e-mail do Free funcionam. O Member adiciona avisos pela previsão, que ajudam quando você está fora e quer saber antes da mínima da madrugada.",
      },
    ],
  },
  "water-heater-pad-leak": {
    headline: "Cenário: aquecedor de água pingando",
    title: "O aquecedor de água pinga às 3h da manhã",
    description:
      "Cenário: a válvula de dreno do aquecedor de água da garagem pinga de madrugada. Um contato de alagamento na bandeja avisa antes de o piso encharcar.",
    setting: "Garagem com aquecedor de água e área de depósito",
    setup: [
      "O ESP32 que já envia a temperatura da garagem; um contato seco/molhado adicionado na bandeja do aquecedor",
      "Tipo de ingest flood: alerta automaticamente quando molha, sem regra personalizada",
      "E-mail mais SMS (Pro); o limite de congelamento continua monitorando o mesmo espaço",
    ],
    timeline: [
      { time: "3h08", detail: "O contato de alagamento detecta água; SMS e e-mail saem mesmo com o modo férias ativado." },
      { time: "3h20", detail: "Um vizinho com o link ao vivo da família dá uma olhada e encontra um pingo na válvula de dreno." },
      { time: "De manhã", detail: "Um encanador aperta a válvula enquanto o piso ainda está quase seco." },
    ],
    outcome:
      "Vazamentos não esperam o congelamento. Os contatos de alagamento usam o mesmo dispositivo e o mesmo caminho de ingest, e os alertas de água chegam mesmo quando o modo férias silencia os de rotina.",
    faqs: [
      {
        question: "Alertas de alagamento precisam de regra personalizada?",
        answer:
          "Não. Com os alertas ativados, contatos de alagamento ou vazamento molhados avisam automaticamente. Use uma regra só para combinar alagamento com condições de porta ou temperatura.",
      },
      {
        question: "Onde o contato deve ficar?",
        answer:
          "No fundo da bandeja, longe dos pingos normais de condensação. Teste com um pano úmido e depois seque-o para ele não ficar em estado molhado.",
      },
    ],
  },
} satisfies StoryOverlay;
