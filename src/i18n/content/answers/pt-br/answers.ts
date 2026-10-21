import type { AnswerOverlay } from "../index";

const redCross = "Canos congelados: prevenção e descongelamento (Cruz Vermelha Americana)";
const farmBureau = "Como os canos congelam e estouram (Farm Bureau Insurance)";
const tempStickFaq = "Perguntas frequentes da Temp Stick";

export default {
  "garage-pipe-freeze-temperature": {
    question: "Com que temperatura os canos congelam na garagem?",
    description:
      "A água congela a 0 °C (32 °F), mas canos de garagem costumam congelar com uns −7 °C (20 °F) lá fora. Por quê, o que acelera e onde configurar o alerta.",
    shortAnswer:
      "A água congela a 0 °C (32 °F), mas os canos raramente congelam no instante em que o ar chega a 0 °C. Uma pesquisa da University of Illinois mostrou que canos sem isolamento em ambientes sem aquecimento começam a congelar quando a temperatura externa cai para cerca de −7 °C (20 °F), e a garagem costuma ficar alguns graus mais quente que o lado de fora. O que importa é a temperatura no cano, então configure ali um alerta para 1–3 °C (34–38 °F) e tenha tempo para agir.",
    sections: [
      {
        heading: "Por que 0 °C não conta a história toda",
        paragraphs: [
          "O cano precisa perder calor por um tempo antes de a água dentro dele congelar, e a água pode esfriar alguns graus abaixo de 0 °C (32 °F) antes de o gelo começar a se formar. Quedas rápidas abaixo de zero muitas vezes passam sem estrago; uma noite longa e fria, não.",
          "O cano normalmente não estoura onde o gelo se forma. O gelo bloqueia o cano, e a pressão aumenta entre o bloqueio e uma torneira fechada até o cano rachar ali.",
        ],
      },
      {
        heading: "O que faz os canos da garagem congelarem antes",
        paragraphs: [
          "Canos em paredes externas, perto do portão basculante ou em cantos com corrente de ar ficam muito mais frios que o meio da garagem. O vento que entra pelas frestas pode congelar um cano exposto mesmo com mais de −7 °C (20 °F) lá fora.",
          "Portão aberto ou mal vedado, aquecedor que desarma o disjuntor e falta de isolamento nos canos são as causas mais comuns quando um cano congela na garagem.",
        ],
      },
      {
        heading: "Como saber antes de acontecer",
        paragraphs: [
          "Meça no cano, não no meio do ambiente: uma sonda à prova d'água (como um DS18B20) encostada no trecho de cano mais frio mostra o que o cano está de fato enfrentando.",
          "Configure o alerta alguns graus acima de 0 °C para ter tempo de fechar um portão, religar um aquecedor ou abrir uma torneira. Um aviso de previsão na véspera de uma geada forte dá ainda mais antecedência.",
        ],
      },
    ],
    faqs: [
      {
        question: "Os canos podem congelar a 0 °C?",
        answer:
          "Sim, se o próprio cano ficar a 0 °C (32 °F) ou menos por tempo suficiente, principalmente com vento ou sem isolamento. A maioria dos congelamentos acontece em noites longas bem abaixo de zero, e por isso a marca de −7 °C (20 °F) lá fora é um bom sinal de alerta.",
      },
      {
        question: "Uma garagem anexa à casa protege os canos do congelamento?",
        answer:
          "Não de forma confiável. Garagens anexas muitas vezes não têm aquecimento, e as paredes externas e portões podem ficar quase tão frios quanto o lado de fora numa noite de vento.",
      },
      {
        question: "Qual temperatura manter na garagem para proteger os canos?",
        answer:
          "O objetivo é manter o ar em volta dos canos acima de zero; muita gente mira 4 °C (40 °F) ou mais numa garagem com encanamento e configura um alerta para quando a temperatura cair para perto de 1–3 °C (34–38 °F).",
      },
    ],
    related: [
      { label: "Meus canos vão congelar hoje à noite? (previsão)" },
      { label: "Em que temperatura configurar um alarme de congelamento?" },
      { label: "Quanto tempo os canos levam para congelar?" },
      { label: "Lista de peças do kit de congelamento com ESP32" },
      { label: "Cenário: aquecedor da garagem falhou" },
    ],
    sources: [
      { label: "Com que temperatura os canos congelam? (KXAN, citando pesquisa da University of Illinois)" },
      { label: farmBureau },
    ],
  },
  "freeze-alarm-temperature-setting": {
    question: "Em que temperatura configurar um alarme de congelamento?",
    description:
      "Configure o alarme de congelamento para 1–3 °C (34–38 °F), medidos no cano. Quando baixar ou subir, e como evitar alarmes falsos sem perder tempo de aviso.",
    shortAnswer:
      "Configure para 1–3 °C (34–38 °F) se o sensor estiver no cano ou ao lado dele. Fique perto de 1 °C (34 °F) se você consegue reagir em até uma hora; vá para 3–4 °C (38–40 °F) se o sensor mede o ar do ambiente longe dos canos ou se você leva horas para chegar, como numa casa de campo vazia.",
    sections: [
      {
        heading: "O equilíbrio: tempo de aviso versus alarmes falsos",
        paragraphs: [
          "Um limite mais alto dá mais tempo, mas dispara em noites frias em que não há nada de errado. Um limite mais baixo incomoda menos, mas deixa menos tempo entre o alerta e o cano congelado.",
          "Comece com 2 °C (36 °F). Se disparar em noites normais, aproxime a sonda do cano antes de baixar o valor; o que importa é a leitura no cano.",
        ],
      },
      {
        heading: "Ajuste conforme a distância",
        paragraphs: [
          "Em casa, 1–2 °C (34–36 °F) costuma bastar: fechar um portão ou religar um aquecedor leva minutos.",
          "Para uma casa de campo, um imóvel de aluguel ou uma casa vazia, use 3–4 °C (38–40 °F) e inclua uma segunda pessoa que possa agir, porque alguém vai ter que ir até lá.",
        ],
      },
      {
        heading: "Adicione um aviso de previsão",
        paragraphs: [
          "Um alerta por limite avisa que está esfriando agora. Um aviso de previsão avisa na véspera que a noite vai ser perigosa, e é aí que vale conferir o aquecedor e fechar tudo.",
        ],
      },
    ],
    faqs: [
      {
        question: "0 °C é uma boa configuração para o alarme de congelamento?",
        answer:
          "Para a maioria das instalações é tarde demais. Quando o ar perto do sensor marca 0 °C (32 °F), um cano mais frio em outro ponto pode já estar congelando, e não sobra tempo para reagir.",
      },
      {
        question: "Por que meu alarme de congelamento dispara sem nada errado?",
        answer:
          "Normalmente o sensor está perto de uma porta, janela ou ventilação que esfria mais que os canos. Coloque-o ao lado do cano que interessa ou adicione um pequeno atraso para que quedas rápidas não gerem alerta.",
      },
    ],
    related: [
      { label: "Com que temperatura os canos congelam na garagem?" },
      { label: "Onde colocar um sensor de congelamento no porão baixo?" },
      { label: "Checklist da temporada de congelamento" },
    ],
  },
  "crawlspace-freeze-sensor-placement": {
    question: "Onde colocar um sensor de congelamento no porão baixo?",
    description:
      "Coloque o sensor no cano de água mais frio do porão baixo, em geral perto das aberturas de ventilação ou de onde o cano entra, não no alçapão. Como instalar.",
    shortAnswer:
      "No cano de abastecimento de água mais frio ou logo ao lado dele, não no alçapão de acesso. Isso costuma ser perto de uma abertura de ventilação da fundação, ao longo da viga de borda do lado do vento ou onde o cano de abastecimento atravessa a fundação. Uma sonda à prova d'água presa com fita ao cano mede o que o cano realmente sente.",
    sections: [
      {
        heading: "Encontre o cano mais frio",
        paragraphs: [
          "O ar frio entra pelas aberturas de ventilação, pelas frestas na viga de borda e em volta da passagem do cano. O cano de abastecimento mais próximo desses pontos congela primeiro.",
          "Se estiver em dúvida, deixe duas sondas instaladas por uma semana e compare as duas numa noite fria; a que cair primeiro mostra onde o sensor deve ficar.",
        ],
      },
      {
        heading: "Como instalar",
        paragraphs: [
          "Use uma sonda à prova d'água com cabo, como um DS18B20. Prenda-a ao cano com fita e enrole o isolamento do cano de volta por cima, para que ela meça o cano, e não o ar.",
          "Deixe a placa e a fonte longe do chão, num lugar seco; porões baixos são úmidos. Uma segunda sonda no ar livre dá um bom parâmetro de comparação.",
        ],
      },
      {
        heading: "Já que está lá embaixo, instale um contato de vazamento",
        paragraphs: [
          "Um contato molhado/seco no chão, embaixo da linha principal, detecta um vazamento lento ou o degelo depois de um congelamento, que é quando o estrago muitas vezes aparece.",
        ],
      },
    ],
    faqs: [
      {
        question: "Um sensor de umidade no porão baixo basta para detectar congelamento?",
        answer:
          "Não. A umidade ajuda a identificar problemas de infiltração, mas o risco de congelamento é a temperatura no cano. Use uma sonda de temperatura no cano.",
      },
      {
        question: "As aberturas de ventilação do porão baixo devem ser fechadas no inverno?",
        answer:
          "Em climas com congelamento, muitos proprietários fecham ou cobrem as aberturas de ventilação da fundação no inverno para manter o ar frio longe dos canos. Uma abertura emperrada aberta é uma causa comum de congelamento no porão baixo.",
      },
    ],
    related: [
      { label: "Cenário: ventilação do porão baixo" },
      { label: "DS18B20 ou DHT22: qual sensor é melhor para monitorar congelamento?" },
      { label: "Em que temperatura configurar um alarme de congelamento?" },
      { label: "Lista de peças do kit de congelamento com ESP32" },
    ],
  },
  "home-assistant-freeze-alert": {
    question: "Como configurar um alerta de congelamento no Home Assistant?",
    description:
      "Um alerta de congelamento no Home Assistant é uma automação: sensor abaixo de 2 °C (35 °F) por 10 minutos, notificação no celular. Com YAML.",
    shortAnswer:
      "Crie uma automação com um gatilho de estado numérico no seu sensor de temperatura, abaixo de 2 °C (35 °F) por 10 minutos, e uma ação de notificação para o seu celular. O problema: se o Home Assistant ou a internet da sua casa cair, o alerta nunca sai, então combine com algo que perceba quando as leituras param de chegar.",
    sections: [
      {
        heading: "A automação",
        paragraphs: [
          "Troque o sensor e o serviço de notificação pelos seus. O atraso de 10 minutos impede que uma corrente de ar passageira gere alerta. O exemplo considera o Home Assistant configurado em °F; se ele estiver em Celsius, use cerca de 2.",
        ],
      },
      {
        heading: "O ponto fraco: quando o próprio Home Assistant falha",
        paragraphs: [
          "Uma queda de energia ou de internet muitas vezes é justamente o que deixa um ambiente esfriar, e ela também derruba o Home Assistant ou a conexão dele. A automação não consegue avisar sobre a falha que a desativa.",
          "Um serviço externo cobre essa lacuna. O ProbeHarbor, por exemplo, pode receber as mesmas leituras do Home Assistant e avisa tanto quando esfria quanto quando as leituras param de chegar. Em Devices → Setup, ao escolher Home Assistant, o YAML é gerado com a sua chave.",
        ],
      },
    ],
    faqs: [
      {
        question: "O Home Assistant pode mandar SMS num alerta de congelamento?",
        answer:
          "Sim, por meio de uma integração de notificação com um provedor de SMS, como a Twilio, ou pelo aplicativo complementar, com notificações push.",
      },
      {
        question: "Qual sensor o Home Assistant deve usar para alertas de congelamento?",
        answer:
          "Qualquer sensor de temperatura perto dos canos funciona: ESPHome com um DS18B20, um sensor Zigbee ou um sensor Wi-Fi com integração. Posicionar perto do cano mais frio importa mais que a marca.",
      },
    ],
    related: [
      { label: "Integração do ProbeHarbor com o Home Assistant" },
      { label: "Como montar um alerta de congelamento com ESPHome?" },
      { label: "Um alarme de congelamento Wi-Fi funciona durante uma queda de energia?" },
      { label: "Em que temperatura configurar um alarme de congelamento?" },
      { label: "Ponte MQTT" },
    ],
  },
  "freeze-alarm-without-subscription": {
    question: "Dá para ter um alarme de congelamento sem assinatura mensal?",
    description:
      "Sim. Temp Stick, Govee, Home Assistant e o plano Free do ProbeHarbor avisam sem assinatura. Quanto cada um custa e do que você abre mão.",
    shortAnswer:
      "Sim. A Temp Stick vende sensores prontos (a partir de US$ 149) com alertas grátis por SMS, e-mail e aplicativo. Os sensores Wi-Fi da Govee (cerca de US$ 35–50 com o gateway) mandam alertas pelo aplicativo. O Home Assistant é gratuito se você mesmo o roda, e o plano Free do ProbeHarbor envia alertas por e-mail e chat a partir de um sensor DIY. SMS no ProbeHarbor exige o plano Pro.",
    sections: [
      {
        heading: "As opções",
        paragraphs: [
          "Temp Stick: um sensor Wi-Fi pronto, a bateria. É o mais caro por sensor, mas não exige configuração nem cobra taxas, e inclui alertas por SMS.",
          "Govee: gateway Wi-Fi barato mais sensores com notificações pelo aplicativo. Serve bem para um cômodo; confira se os alertas chegam com confiabilidade quando você está fora de casa.",
          "Home Assistant: gratuito e flexível se você já o usa, mas depende de a internet e a energia da sua casa continuarem funcionando (veja a resposta sobre alerta de congelamento no Home Assistant).",
          "ProbeHarbor: cerca de US$ 25 em peças DIY por sonda, alertas grátis por e-mail, chat e push, contatos de vazamento e histórico. SMS e histórico mais longo ficam nos planos pagos.",
        ],
      },
      {
        heading: "O que pesar",
        paragraphs: [
          "Configuração: sensores prontos ganham. Custo por zona: sondas DIY ganham quando você quer várias. Ser acordado de madrugada: SMS ou push importam mais que e-mail, então confira qual plano inclui.",
        ],
      },
    ],
    faqs: [
      {
        question: "A Temp Stick cobra mensalidade?",
        answer:
          "Não. A Temp Stick diz que o monitoramento, o histórico de dados e os alertas por SMS, e-mail e aplicativo são gratuitos durante toda a vida útil do sensor.",
      },
      {
        question: "O ProbeHarbor é gratuito?",
        answer:
          "Existe um plano Free com alertas por e-mail e chat, uma semana de histórico e até dois dispositivos. Member e Pro acrescentam histórico, exportação em CSV, avisos de previsão e SMS.",
      },
    ],
    related: [
      { label: "ProbeHarbor vs. Temp Stick" },
      { label: "ProbeHarbor vs. Govee" },
      { label: "Planos e preços" },
    ],
    sources: [{ label: tempStickFaq }, { label: "GoveeLife Smart Thermometer R1" }],
  },
  "how-long-for-pipes-to-freeze": {
    question: "Quanto tempo os canos levam para congelar?",
    description:
      "Não há um número fixo: os canos precisam de horas de frio contínuo, em geral com −7 °C (20 °F) ou menos lá fora. O que encurta esse tempo e como prever.",
    shortAnswer:
      "Não existe um número único. Os canos congelam depois de horas de frio contínuo, não no instante em que a temperatura chega a 0 °C (32 °F), e pesquisas de campo mostraram que canos sem isolamento em ambientes sem aquecimento começam a congelar quando faz cerca de −7 °C (20 °F) ou menos lá fora. Vento, correntes de ar e falta de isolamento encurtam o tempo; uma queda rápida abaixo de zero costuma passar sem estrago. A velocidade com que a temperatura no cano está caindo diz mais do que qualquer regra prática.",
    sections: [
      {
        heading: "O que define a rapidez com que um cano congela",
        paragraphs: [
          "Quão frio está e por quanto tempo: uma noite longa entre −12 e −7 °C (10–19 °F) é muito mais perigosa do que uma hora a −1 °C (30 °F).",
          "Movimento do ar: pesquisas da University of Illinois mostraram que vento e correntes de ar por frestas na parede têm papel importante em acelerar o bloqueio por gelo, então um cano exposto num canto com corrente de ar pode congelar mesmo com mais de −7 °C (20 °F) lá fora.",
          "Isolamento, diâmetro do cano e se a água está circulando: um cano fino, sem isolamento e com água parada congela primeiro.",
        ],
      },
      {
        heading: "Estime pela velocidade de resfriamento",
        paragraphs: [
          "Se o ar junto ao cano está a 7 °C (44 °F) e caindo cerca de 1,1 °C (2 °F) por hora, ele chega a 1 °C (34 °F) em umas cinco horas. Essa estimativa simples, refeita a cada nova leitura, é mais útil que um número genérico, porque reflete o seu ambiente naquela noite.",
          "O ProbeHarbor mostra isso como um relógio de tempo até o congelamento em todos os planos: as horas até o seu limite de congelamento no ritmo atual de resfriamento.",
        ],
      },
      {
        heading: "O que fazer com o tempo que você tem",
        paragraphs: [
          "Feche o portão da garagem, restabeleça o aquecimento, abra as portas dos armários embaixo das pias e deixe pingar uma torneira na linha exposta. Se você estiver fora, é aí que faz diferença ter um vizinho com a chave.",
        ],
      },
    ],
    faqs: [
      {
        question: "Os canos podem congelar em uma noite?",
        answer:
          "Podem. Uma única noite longa com temperatura externa entre −12 e −7 °C (10–19 °F) ou menos basta para um cano sem isolamento numa garagem, porão baixo ou sótão sem aquecimento.",
      },
      {
        question: "Os canos congelam mais rápido quando venta?",
        answer:
          "Sim. O ar em movimento tira calor do cano muito mais rápido que o ar parado, e é por isso que canos perto de aberturas de ventilação, frestas de portas e rachaduras em paredes externas congelam primeiro.",
      },
    ],
    related: [
      { label: "Meus canos vão congelar hoje à noite? (previsão)" },
      { label: "Com que temperatura os canos congelam na garagem?" },
      { label: "Calculadora de tempo de congelamento dos canos" },
      { label: "Tempo até o congelamento, explicado" },
      { label: "Devo deixar as torneiras pingando para evitar canos congelados?" },
    ],
    sources: [
      { label: "Como os canos congelam e estouram (Farm Bureau Insurance, citando pesquisa da University of Illinois)" },
    ],
  },
  "vacant-house-winter-thermostat-setting": {
    question: "Em que temperatura deixar a casa no inverno quando eu viajar?",
    description:
      "Deixe o aquecimento ligado, no mínimo em 13 °C (55 °F), segundo a Cruz Vermelha Americana. Por que isso não é garantia e como saber se o aquecimento falhar.",
    shortAnswer:
      "Deixe o aquecimento ligado e não programe abaixo de 13 °C (55 °F); é a recomendação da Cruz Vermelha Americana para quem viaja no frio. Mas o termostato só informa sobre o cômodo onde está. Canos na garagem, no porão baixo ou numa parede externa podem estar bem mais frios, e a configuração não adianta nada se o aquecedor ou a energia falhar, então alguém ou alguma coisa precisa estar de olho.",
    sections: [
      {
        heading: "Por que 13 °C e não menos",
        paragraphs: [
          "A casa perde calor pelas bordas. Com a área habitada a 13 °C (55 °F), os canos em paredes externas e áreas sem aquecimento ainda têm alguma margem acima de zero. Programe 7 °C (45 °F) e essa margem desaparece numa noite muito fria e com vento.",
          "Antes de sair, abra as portas dos armários embaixo das pias da cozinha e do banheiro para o ar mais quente do ambiente chegar ao encanamento, e mantenha o portão da garagem fechado se houver canos de água ali.",
        ],
      },
      {
        heading: "A configuração não ajuda se o aquecimento parar",
        paragraphs: [
          "Um aquecedor que desarmou, um tanque de gás ou óleo vazio ou uma queda de energia deixam a casa esfriar até perto da temperatura externa, não importa o que o termostato diga.",
          "Coloque um sensor de temperatura onde ficam os canos, configure o alerta para 3–4 °C (38–40 °F) para dar tempo de alguém chegar e garanta que uma segunda pessoa receba o alerta. Um alerta que dispara quando o sensor para de enviar dados cobre quedas de energia e de internet.",
        ],
      },
      {
        heading: "Para uma ausência longa",
        paragraphs: [
          "Se a casa vai ficar vazia por semanas, fechar o registro geral e esvaziar os canos elimina a maior parte do risco; um encanador pode preparar a casa para o inverno do jeito certo. Mesmo assim, mantenha o aquecimento ligado para proteger a construção e tudo o que não dá para esvaziar.",
        ],
      },
    ],
    faqs: [
      {
        question: "10 °C é suficiente para os canos não congelarem?",
        answer:
          "Muitas vezes sim, mas 10 °C (50 °F) deixam menos margem que os 13 °C (55 °F) recomendados pela Cruz Vermelha Americana. Quanto mais frio o clima e quanto mais encanamento em paredes externas ou ambientes sem aquecimento, mais essa margem importa.",
      },
      {
        question: "Devo desligar o aquecimento para economizar enquanto estou fora?",
        answer:
          "Não, não com temperaturas abaixo de zero. A orientação da Cruz Vermelha é deixar o aquecimento ligado; um cano estourado custa muito mais que a conta de aquecimento.",
      },
    ],
    related: [
      { label: "Como monitorar a temperatura de uma casa de campo a distância?" },
      { label: "Em que temperatura configurar um alarme de congelamento?" },
      { label: "Checklist da temporada de congelamento" },
    ],
    sources: [{ label: redCross }],
  },
  "drip-faucets-to-prevent-frozen-pipes": {
    question: "Devo deixar as torneiras pingando para evitar canos congelados?",
    description:
      "Sim, no frio intenso: deixe pingar água fria das torneiras ligadas a canos expostos. Quais torneiras, quanto e o que o gotejamento não resolve.",
    shortAnswer:
      "Sim. Quando estiver muito frio, deixe pingar água fria das torneiras abastecidas por canos expostos; a Cruz Vermelha Americana observa que água correndo, mesmo num fio, ajuda a evitar que os canos congelem. Isso só é necessário nas torneiras alimentadas por canos que passam por ambientes sem aquecimento ou paredes externas, não em todas as torneiras da casa.",
    sections: [
      {
        heading: "Por que o gotejamento ajuda",
        paragraphs: [
          "A água em movimento traz água mais quente da rede para o trecho frio do cano, o que retarda o congelamento.",
          "Ela também alivia a pressão. Os canos costumam estourar porque o gelo bloqueia a linha e a pressão aumenta entre o bloqueio e uma torneira fechada. Uma torneira aberta dá uma saída para essa pressão.",
        ],
      },
      {
        heading: "Quais torneiras e quanto",
        paragraphs: [
          "Escolha as torneiras no fim dos trechos de cano que passam pela garagem, porão baixo, sótão ou parede externa. Um gotejamento constante ou um fio da espessura de um grafite de lápis basta.",
          "Se a torneira tem linhas separadas de água quente e fria e as duas passam pelo ambiente frio, abra as duas um pouco.",
        ],
      },
      {
        heading: "O que o gotejamento não faz",
        paragraphs: [
          "Ele não salva um cano num ambiente que fica muito abaixo de zero por dias, e não ajuda quando você está fora e não há ninguém para abrir a torneira. Isolar o cano, vedar as correntes de ar e manter o ambiente acima de zero são as soluções de verdade; um alerta de temperatura avisa a hora de abrir a torneira.",
        ],
      },
    ],
    faqs: [
      {
        question: "A partir de que temperatura devo deixar as torneiras pingando?",
        answer:
          "Um gatilho comum é uma mínima prevista de cerca de −7 °C (20 °F) ou menos, o ponto em que pesquisas mostraram que canos sem isolamento em ambientes sem aquecimento começam a congelar. Comece antes se o cano estiver num lugar com corrente de ar.",
      },
      {
        question: "Deixar as torneiras pingando desperdiça muita água?",
        answer:
          "Um gotejamento lento gasta pouca água, e você só precisa dele nas poucas noites frias o bastante para ameaçar o cano. É pouco perto do custo de um cano estourado.",
      },
    ],
    related: [
      { label: "Meus canos vão congelar hoje à noite? (previsão)" },
      { label: "Quanto tempo os canos levam para congelar?" },
      { label: "Como descongelar um cano com segurança?" },
      { label: "Guia de alertas para ondas de frio" },
    ],
    sources: [{ label: redCross }, { label: farmBureau }],
  },
  "how-to-thaw-frozen-pipes": {
    question: "Como descongelar um cano com segurança?",
    description:
      "Deixe a torneira aberta e aqueça o cano com secador, almofada térmica ou toalhas quentes. Nunca use chama. Os passos e quando chamar um encanador.",
    shortAnswer:
      "Deixe a torneira aberta e aqueça o trecho congelado com um secador de cabelo elétrico, uma almofada térmica elétrica, um aquecedor portátil longe de qualquer material inflamável ou toalhas encharcadas em água quente. Nunca use maçarico nem qualquer chama aberta. Continue aquecendo até a pressão total da água voltar, e chame um encanador habilitado se não conseguir encontrar ou alcançar o trecho congelado. Esses passos seguem as orientações da Cruz Vermelha Americana.",
    sections: [
      {
        heading: "Encontre o trecho congelado",
        paragraphs: [
          "Se uma torneira só solta um fio de água no frio, suspeite de cano congelado. Os pontos mais prováveis são junto a paredes externas e onde a entrada de água passa pela fundação da casa.",
          "Confira as outras torneiras também. Se um cano congelou, outros podem ter congelado.",
        ],
      },
      {
        heading: "Descongele",
        paragraphs: [
          "Deixe a torneira aberta. Conforme o gelo derrete, a água começa a correr, e a água correndo ajuda a derreter o resto.",
          "Aplique calor suave no cano: um secador de cabelo, uma almofada térmica elétrica enrolada nele, um aquecedor portátil ou toalhas quentes e molhadas. Não use maçarico, aquecedor a querosene ou a gás, fogareiro a carvão nem qualquer outra chama aberta.",
        ],
      },
      {
        heading: "Fique atento a vazamentos durante o degelo",
        paragraphs: [
          "Um cano que rachou enquanto estava congelado muitas vezes só vaza quando o gelo derrete. Saiba onde fica o registro geral antes de começar e inspecione o cano quando a água voltar a correr.",
          "É aqui que um sensor de vazamento no chão, embaixo do trecho vulnerável, mostra seu valor: o alerta de congelamento avisa sobre o frio, e o alerta de vazamento avisa sobre o degelo.",
        ],
      },
    ],
    faqs: [
      {
        question: "Um cano congelado descongela sozinho?",
        answer:
          "Em algum momento, quando o ambiente esquentar, mas esperar deixa a pressão presa na linha e você pode não estar lá quando um cano rachado começar a vazar. Descongelar de propósito, com a torneira aberta, é mais seguro.",
      },
      {
        question: "Um cano congelado sempre estoura?",
        answer:
          "Não. Muitos canos congelados descongelam sem estrago. O risco vem da pressão presa entre o gelo e uma torneira fechada, e é por isso que a torneira deve ficar aberta.",
      },
    ],
    related: [
      { label: "Guia para inundação após congelamento e degelo" },
      { label: "Onde colocar sensores de vazamento de água?" },
      { label: "Devo deixar as torneiras pingando para evitar canos congelados?" },
    ],
    sources: [{ label: redCross }, { label: farmBureau }],
  },
  "wifi-freeze-alarm-power-outage": {
    question: "Um alarme de congelamento Wi-Fi funciona durante uma queda de energia?",
    description:
      "Normalmente não: a queda derruba o roteador mesmo que o sensor tenha bateria. Como alertas de silêncio, nobreak e sensores celulares cobrem essa falha.",
    shortAnswer:
      "Normalmente não. Mesmo um sensor a bateria precisa do seu roteador e do modem, e eles caem junto com a energia. A solução é um serviço que avise quando o sensor fica em silêncio, porque no inverno o silêncio já é um alerta: a mesma queda que interrompeu as leituras provavelmente desligou o aquecimento.",
    sections: [
      {
        heading: "Por que o alarme fica mudo justo quando você precisa",
        paragraphs: [
          "Um alerta de congelamento vai do sensor, pelo seu Wi-Fi e pela sua conexão de internet, até um servidor que envia a mensagem. Uma queda de energia quebra essa corrente no roteador, e o aquecedor também precisa de eletricidade, então a casa começa a esfriar no mesmo momento em que o alarme para de enviar dados.",
          "Tudo o que roda só dentro de casa, inclusive uma automação do Home Assistant, tem o mesmo ponto fraco.",
        ],
      },
      {
        heading: "Três formas de cobrir a falha",
        paragraphs: [
          "Alertar sobre o silêncio. Um serviço hospedado pode perceber que as leituras pararam e avisar você. O ProbeHarbor tem um alerta de queda que dispara quando um dispositivo fica em silêncio por um número definido de horas (duas, por padrão).",
          "Manter a rede no ar. Um pequeno nobreak (UPS) no modem, no roteador e no sensor mantém as leituras chegando em quedas curtas, desde que os equipamentos do seu provedor de internet fora da casa continuem com energia.",
          "Dispensar a rede de casa. Um sensor celular com bateria envia dados sem Wi-Fi. Custa mais e precisa de um plano de dados, mas é a escolha certa para uma casa de campo ou uma casa que fica sem energia com frequência.",
        ],
      },
      {
        heading: "Quem recebe a mensagem",
        paragraphs: [
          "Uma queda costuma afetar o bairro inteiro, inclusive o Wi-Fi do seu próprio celular. Envie alertas por SMS ou push além do e-mail e inclua uma segunda pessoa que possa dar uma olhada na casa.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sensores de temperatura Wi-Fi a bateria funcionam sem energia?",
        answer:
          "O sensor continua medindo, mas não consegue enviar nada até o roteador e a internet voltarem. Alguns guardam as leituras e enviam depois, o que ajuda o registro, mas não o aviso.",
      },
      {
        question: "Quanto tempo uma casa leva para esfriar depois que a energia cai?",
        answer:
          "Depende do isolamento e de quão frio está lá fora. Um sensor que estava enviando dados até a queda dá a última temperatura conhecida e a velocidade de resfriamento, uma base razoável para decidir com que urgência alguém precisa ir até lá.",
      },
    ],
    related: [
      { label: "Como monitorar a temperatura de uma casa de campo a distância?" },
      { label: "Envio de dados por rede celular (Particle Boron)" },
      { label: "Como configurar um alerta de congelamento no Home Assistant?" },
    ],
  },
  "remote-cabin-temperature-monitoring": {
    question: "Como monitorar a temperatura de uma casa de campo a distância?",
    description:
      "Com internet no local, um sensor Wi-Fi que avisa no celular. Sem internet, um sensor celular. O que medir, onde e quem deve receber o alerta.",
    shortAnswer:
      "Se a casa de campo tem internet, coloque um sensor de temperatura Wi-Fi perto do encanamento e configure alertas no seu celular. Se não tem, use um sensor celular com conexão de dados própria. Em qualquer caso, alerte cedo, a 3–4 °C (38–40 °F), alerte quando o sensor parar de enviar dados e inclua alguém que more perto o bastante para ir até lá.",
    sections: [
      {
        heading: "Escolha a conexão primeiro",
        paragraphs: [
          "Wi-Fi: o caminho mais barato se a casa mantém a internet durante o inverno. Um sensor pronto como o Temp Stick funciona logo de cara; uma sonda DIY com ESP32 custa cerca de US$ 25 em peças e envia dados para um serviço como o ProbeHarbor.",
          "Celular: para casas sem internet ou com energia instável. Uma placa celular com bateria de reserva (o ProbeHarbor tem um sketch para a Particle Boron) envia as leituras pela rede móvel.",
        ],
      },
      {
        heading: "O que medir",
        paragraphs: [
          "Meça nos canos, não só na sala: a área da bomba ou do tanque de pressão, o porão baixo e a parede mais fria do banheiro ou da cozinha. Um contato de vazamento no chão perto do aquecedor de água ou da bomba detecta o degelo depois de um congelamento.",
          "Adicione um alerta para quando as leituras pararem. Numa casa de campo vazia, um sensor em silêncio normalmente significa que a energia ou a internet caiu, e o aquecimento pode ter ido junto.",
        ],
      },
      {
        heading: "Planeje o deslocamento",
        paragraphs: [
          "Um alerta a 1 °C (34 °F) é tarde demais se você está a três horas de distância. Use 3–4 °C (38–40 °F), ative um aviso de previsão para saber de uma geada forte na véspera e dê a um vizinho ou caseiro próximo o próprio alerta e uma chave.",
          "Se ninguém puder agir no inverno, feche e esvazie a água antes de sair e monitore para proteger a construção, e não o encanamento.",
        ],
      },
    ],
    faqs: [
      {
        question: "Dá para monitorar uma casa de campo sem Wi-Fi?",
        answer:
          "Sim, com um sensor celular. Ele usa a rede móvel em vez da internet da casa, então precisa de sinal no local e normalmente de um pequeno plano de dados.",
      },
      {
        question: "Em que temperatura manter uma casa de campo no inverno?",
        answer:
          "Se a água estiver ligada, deixe o aquecimento ligado e não programe abaixo de 13 °C (55 °F), que é a recomendação da Cruz Vermelha Americana para uma casa em que você não está.",
      },
    ],
    related: [
      { label: "Cenário: casa de campo vigiada no inverno" },
      { label: "Em que temperatura deixar a casa no inverno quando eu viajar?" },
      { label: "Um alarme de congelamento Wi-Fi funciona durante uma queda de energia?" },
    ],
    sources: [{ label: redCross }, { label: tempStickFaq }],
  },
  "ds18b20-vs-dht22-freeze-sensor": {
    question: "DS18B20 ou DHT22: qual sensor é melhor para monitorar congelamento?",
    description:
      "O DS18B20: vem como sonda selada à prova d'água que você prende no cano, e vários dividem um pino. O DHT22 mede umidade, mas só o ar do ambiente.",
    shortAnswer:
      "O DS18B20, na maioria dos casos. Os dois têm precisão de cerca de ±0,5 °C perto de zero, mas o DS18B20 é vendido como uma sonda selada à prova d'água com cabo, que você prende direto no cano com fita, e vários deles podem dividir um mesmo pino do microcontrolador. Escolha o DHT22 quando também quiser umidade e só precisar da temperatura do ar do ambiente.",
    sections: [
      {
        heading: "Os números",
        paragraphs: [
          "DS18B20: mede de −55 a 125 °C (−67 a 257 °F), precisão de ±0,5 °C entre −10 e 85 °C, funciona com 3,0–5,5 V e usa o barramento 1-Wire, então várias sondas podem dividir um pino de dados, cada uma com um ID único.",
          "DHT22 (AM2302): mede de −40 a 80 °C com ±0,5 °C e umidade de 0–100% com ±2% (±5% no pior caso), funciona com 3,3–5,5 V e não deve ser lido mais de uma vez a cada dois segundos.",
        ],
      },
      {
        heading: "Por que o formato da sonda importa mais que a especificação",
        paragraphs: [
          "O risco de congelamento é a temperatura no cano. Uma sonda DS18B20 com cabo pode ficar sob o isolamento do cano num porão baixo úmido enquanto a placa fica num lugar seco. O DHT22 é uma caixinha plástica ventilada que mede o ar em volta da placa.",
          "Com 1-Wire você pode ligar uma sonda no cano e outra no ar livre no mesmo pino, o que mostra quanta margem o cano tem.",
        ],
      },
      {
        heading: "Quando o DHT22 é a escolha certa",
        paragraphs: [
          "Use-o onde a umidade importa tanto quanto o frio: um porão, uma oficina com ferramentas que enferrujam ou uma checagem de umidade no porão baixo. Muitas instalações usam os dois: um DS18B20 no cano e um DHT22 para o ambiente.",
        ],
      },
    ],
    faqs: [
      {
        question: "O DS18B20 precisa de resistor?",
        answer:
          "Sim. A linha de dados 1-Wire precisa de um resistor de pull-up para a tensão de alimentação, normalmente de 4,7 kΩ. Algumas placas breakout já vêm com ele.",
      },
      {
        question: "Os dois sensores são precisos o bastante para um alarme de congelamento?",
        answer:
          "Sim. Meio grau Celsius equivale a cerca de 1 °F, muito menos que os poucos graus de margem que você deve deixar entre o limite do alerta e 0 °C (32 °F).",
      },
    ],
    related: [
      { label: "Lista de peças do kit de congelamento com ESP32" },
      { label: "Onde colocar um sensor de congelamento no porão baixo?" },
      { label: "Como montar um alerta de congelamento com ESPHome?" },
    ],
    sources: [
      { label: "Sensor digital de temperatura DS18B20 à prova d'água: especificações técnicas (Adafruit)" },
      { label: "Datasheet do AM2302 / DHT22 (Aosong, hospedado pela Adafruit)" },
    ],
  },
  "esphome-freeze-alert": {
    question: "Como montar um alerta de congelamento com ESPHome?",
    description:
      "Ligue um DS18B20 a um ESP32 com o sensor dallas_temp do ESPHome e alerte pelo Home Assistant ou envie as leituras a um serviço externo. Com YAML.",
    shortAnswer:
      "Ligue uma sonda DS18B20 à prova d'água a um ESP32, adicione os componentes one_wire e dallas_temp do ESPHome e prenda a sonda no cano com fita. O ESPHome só mede; o alerta vem de quem recebe a leitura, seja uma automação do Home Assistant, seja um serviço externo para o qual o dispositivo envia os dados por HTTPS.",
    sections: [
      {
        heading: "O sensor",
        paragraphs: [
          "Ligue o fio de dados da sonda a um pino GPIO com um pull-up de 4,7 kΩ para 3,3 V. Com uma única sonda no barramento, não é preciso informar o endereço dela. O ESPHome informa em °C.",
        ],
      },
      {
        heading: "Opção 1: alerta pelo Home Assistant",
        paragraphs: [
          "Depois que o dispositivo é adotado, o sensor aparece no Home Assistant e uma automação de estado numérico pode notificar o seu celular. É o caminho mais rápido, mas o alerta depende de o Home Assistant e a internet da sua casa continuarem funcionando.",
        ],
      },
      {
        heading: "Opção 2: enviar as leituras para fora",
        paragraphs: [
          "O componente http_request do ESPHome pode fazer POST de cada leitura para um serviço hospedado, que cuida dos alertas, do histórico e de perceber quando o dispositivo fica em silêncio. O ProbeHarbor publica um snippet pronto em probeharbor.dev/esphome/probeharbor.yaml: crie um dispositivo push, coloque a URL de ingestão dele no secrets.yaml e aponte o snippet para o ID do seu sensor.",
          "Dá para fazer as duas coisas: manter o dispositivo no Home Assistant para automações locais e enviar para um serviço externo os alertas que precisam chegar até você.",
        ],
      },
    ],
    faqs: [
      {
        question: "O ESPHome consegue enviar uma notificação sozinho?",
        answer:
          "Não direto para o seu celular. Ele pode chamar uma ação do Home Assistant ou fazer uma requisição HTTP, então a notificação vem do Home Assistant ou do serviço que recebe a requisição.",
      },
      {
        question: "Que limite o alerta deve usar?",
        answer:
          "1–3 °C (34–38 °F) no cano; o ESPHome já trabalha em °C. Use o valor mais alto se você demora para reagir.",
      },
    ],
    related: [
      { label: "Receitas para ESPHome e Shelly" },
      { label: "Como configurar um alerta de congelamento no Home Assistant?" },
      { label: "DS18B20 ou DHT22: qual sensor é melhor para monitorar congelamento?" },
    ],
  },
  "water-leak-sensor-placement": {
    question: "Onde colocar sensores de vazamento de água?",
    description:
      "No chão, no ponto mais baixo ao lado de cada fonte de água: aquecedor, máquina de lavar, embaixo das pias, poço da bomba e sob canos que podem congelar.",
    shortAnswer:
      "No chão, no ponto mais baixo ao lado de tudo o que pode vazar: o aquecedor de água, a máquina de lavar, embaixo das pias da cozinha e do banheiro, ao lado do poço da bomba de drenagem e embaixo de qualquer trecho de cano que possa congelar. A água segue o piso, então um sensor a uns dois centímetros acima do ponto baixo pode continuar seco enquanto a poça cresce.",
    sections: [
      {
        heading: "Comece pelos pontos de maior risco",
        paragraphs: [
          "Aquecedor de água: na bandeja coletora, se houver; senão, no chão junto à base.",
          "Máquina de lavar roupa e lava-louças: atrás ou ao lado do aparelho, perto das mangueiras de entrada.",
          "Embaixo das pias: no fundo do piso do armário, abaixo dos registros e do sifão.",
          "Poço da bomba e ralos: um sensor logo acima do nível máximo normal da água avisa que a bomba falhou.",
        ],
      },
      {
        heading: "Inclua os trechos sujeitos a congelamento",
        paragraphs: [
          "Um cano que racha enquanto está congelado vaza quando descongela, muitas vezes horas depois do alerta de frio. Coloque um contato de vazamento no chão embaixo dos canos da garagem, do porão baixo ou junto às paredes externas para que o degelo não passe despercebido.",
        ],
      },
      {
        heading: "Instalação",
        paragraphs: [
          "Os contatos precisam encostar no chão, na horizontal, no ponto mais baixo. Despeje uma xícara de água ali perto uma vez para ver para onde ela escorre e teste o sensor com um pano úmido na instalação.",
          "O ProbeHarbor trata um sensor de vazamento molhado como alerta em todos os planos, sem precisar configurar regra.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quantos sensores de vazamento uma casa precisa?",
        answer:
          "Um por fonte de água cujo vazamento você não notaria rápido. Na maioria das casas são de quatro a seis: aquecedor de água, máquina de lavar, pia da cozinha, um ou dois banheiros e o poço da bomba ou o ralo mais baixo.",
      },
      {
        question: "Um sensor de vazamento pode fechar a água?",
        answer:
          "Sozinho, o sensor só alerta. Para fechar a água é preciso uma válvula motorizada na linha principal, acionada por uma automação ou webhook quando o sensor fica molhado.",
      },
    ],
    related: [
      { label: "Cenário: vazamento na bandeja do aquecedor de água" },
      { label: "Leak Puck" },
      { label: "Como descongelar um cano com segurança?" },
    ],
  },
  "landlord-vacant-rental-freeze-monitoring": {
    question: "Como um proprietário pode monitorar um imóvel de aluguel vazio contra canos congelados?",
    description:
      "Mantenha o aquecimento em 13 °C (55 °F) ou mais, um sensor de temperatura perto do encanamento de cada unidade e alertas para quem chega primeiro.",
    shortAnswer:
      "Deixe o aquecimento ligado em 13 °C (55 °F) ou mais, coloque um sensor de temperatura conectado à internet perto do encanamento de cada unidade vazia e envie os alertas para quem consegue chegar mais rápido, não só para você. Adicione um alerta para quando um sensor parar de enviar dados, já que uma unidade vazia com a energia ou a internet cortada é exatamente a que congela.",
    sections: [
      {
        heading: "O período de risco é entre um inquilino e outro",
        paragraphs: [
          "Não há ninguém para notar um aquecedor que parou, e as contas de consumo muitas vezes estão sendo transferidas. Confirme que o aquecimento e a energia continuam ligados no seu nome antes de terminar o serviço do inquilino.",
          "Se a unidade vai ficar vazia o inverno inteiro, fechar e esvaziar a água elimina a maior parte do risco.",
        ],
      },
      {
        heading: "O que instalar",
        paragraphs: [
          "Um sensor perto do encanamento mais exposto (muitas vezes a cozinha ou o banheiro numa parede externa, ou o porão) e um contato de vazamento junto ao aquecedor de água. A unidade precisa de uma conexão de internet funcionando, ou de um sensor celular se não tiver.",
          "Configure o alerta para 3–4 °C (38–40 °F) para dar tempo de mandar alguém e ative os avisos de previsão para poder verificar o imóvel na véspera de uma geada forte.",
        ],
      },
      {
        heading: "Gerenciando vários imóveis",
        paragraphs: [
          "Mantenha cada imóvel separado para que o alerta informe o endereço, e dê ao seu contato de manutenção os próprios alertas. Um registro de leituras e alertas também é uma prova útil para um pedido de indenização ao seguro se algo der errado.",
          "A página de gestão de imóveis do ProbeHarbor descreve como ele lida com vários imóveis.",
        ],
      },
    ],
    faqs: [
      {
        question: "Em que temperatura manter um imóvel de aluguel vazio?",
        answer:
          "Não abaixo de 13 °C (55 °F) enquanto a água estiver ligada, seguindo a recomendação da Cruz Vermelha Americana para uma casa sem ninguém.",
      },
      {
        question: "Dá para pedir ajuda aos inquilinos?",
        answer:
          "Nas unidades ocupadas, sim: peça aos inquilinos que deixem o aquecimento ligado quando viajarem e que avisem na hora sobre qualquer problema no aquecedor. O monitoramento cobre os casos em que não há ninguém em casa para perceber.",
      },
    ],
    related: [
      { label: "ProbeHarbor para proprietários e administradoras de imóveis" },
      { label: "Pacote de provas para sinistros" },
      { label: "Em que temperatura deixar a casa no inverno quando eu viajar?" },
    ],
    sources: [{ label: redCross }],
  },
} satisfies AnswerOverlay;
