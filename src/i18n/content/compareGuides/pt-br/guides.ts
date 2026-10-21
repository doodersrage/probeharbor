import type { CompareGuideOverlay } from "../index";

export default {
  "diy-mqtt": {
    competitor: "MQTT caseiro / Node-RED",
    title: "ProbeHarbor vs MQTT caseiro",
    seoTitle: "Alternativa hospedada a alertas de congelamento com MQTT caseiro",
    headline: "ProbeHarbor vs MQTT caseiro + Node-RED",
    description:
      "Compare os alertas de congelamento e vazamento do ProbeHarbor com MQTT, Node-RED e cron auto-hospedados: manutenção, SMS, histórico e acesso da família.",
    summary:
      "MQTT caseiro é poderoso se você gosta de manter brokers, dashboards e scripts de alerta. O ProbeHarbor entrega o mesmo resultado (sondas ao vivo, alertas de congelamento e vazamento, histórico) sem você precisar cuidar da infraestrutura às 2 da manhã.",
    lede:
      "Um broker Mosquitto, fluxos do Node-RED e uma tarefa cron conseguem avisar sobre congelamento na garagem. O custo é cuidar de atualizações, TLS, Twilio e de um Raspberry Pi que não pode desligar. O ProbeHarbor é a camada hospedada de alertas e histórico: mantenha o MQTT na rede local se quiser, envie as leituras por HTTPS e deixe os canais de alerta de congelamento e vazamento da casa na nuvem.",
    whenProbeHarbor: [
      "Você quer alertas de congelamento e vazamento por SMS, e-mail ou push sem configurar o Twilio",
      "As pessoas da casa precisam de acesso sem VPN para o seu Raspberry Pi",
      "Você continua usando ESP/Arduino: envio por HTTPS ou ponte MQTT→HTTP",
    ],
    whenOther: [
      "Você já roda um stack MQTT + Grafana robusto e gosta de mantê-lo",
      "Toda automação precisa ficar só na rede local, sem depender da nuvem",
      "Você precisa de protocolos industriais específicos que o ProbeHarbor não suporta",
    ],
    rows: [
      { capability: "Manutenção do broker / servidor", probeharbor: "Hospedado (nenhum Mosquitto para atualizar)", other: "Você atualiza o Mosquitto/HA" },
      { capability: "Alertas de congelamento e vazamento", probeharbor: "Canais integrados + relógio de horas restantes até congelar", other: "Node-RED + Twilio/e-mail" },
      { capability: "Envio de dados do ESP", probeharbor: "Chave de dispositivo via HTTPS ou ponte MQTT", other: "Projeto de tópicos MQTT" },
      { capability: "Histórico e CSV", probeharbor: "Nos planos pagos", other: "Influx/Postgres que você administra" },
      { capability: "Compartilhar com a família", probeharbor: "Convites para a casa", other: "VPN ou proxy reverso" },
    ],
    faqs: [
      {
        question: "Posso manter o MQTT e usar o ProbeHarbor também?",
        answer:
          "Sim. Mantenha o Mosquitto ou o Home Assistant na rede local para as automações locais e encaminhe os tópicos escolhidos por HTTPS. O ProbeHarbor é a camada externa de alertas de congelamento/vazamento e histórico.",
      },
      {
        question: "Preciso operar o Twilio por conta própria?",
        answer:
          "Não. Os canais de push e chat são hospedados em todos os planos, e o SMS no Pro. Com MQTT caseiro, normalmente você mesmo configura o Twilio ou o e-mail e mantém esse sistema no ar.",
      },
      {
        question: "Onde está a receita da ponte MQTT?",
        answer:
          "Em probeharbor.dev/about/mqtt-bridge, e a integração HACS em probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  govee: {
    title: "ProbeHarbor vs Govee",
    seoTitle: "Alternativa à Govee para alertas de congelamento na garagem",
    headline: "ProbeHarbor vs sensores Govee",
    description:
      "Govee vs ProbeHarbor para monitorar congelamento e vazamento em espaços sem aquecimento: alertas, envio de ESP, zonas com várias sondas e histórico exportável.",
    summary:
      "A Govee, e hubs de consumo como o SmartThings, são ótimos para sensores de ambiente baratos e um app caprichado. O ProbeHarbor é feito para monitorar congelamento e vazamento em garagens, oficinas, sótãos e galpões: suas próprias sondas ESP, alertas para a casa toda e histórico que você pode exportar.",
    lede:
      "Os higrômetros Govee (e hubs no estilo SmartThings que integram o mesmo tipo de sensor Bluetooth/Wi-Fi) ganham no preço e num app amigável para quartos e armários. Eles deixam a desejar numa garagem ou oficina separada da casa: alcance do Bluetooth, dependência do fabricante e alertas que ficam quase sempre no app. O ProbeHarbor parte do princípio de que você traz um ESP32 e oferece encaminhamento de alertas de congelamento e vazamento para a casa e uma temporada inteira de histórico exportável.",
    whenProbeHarbor: [
      "Você quer sondas ESP, Pico W, STM32, CH32V ou Arduino que você controla (não só sensores do fabricante)",
      "Os alertas de congelamento e vazamento precisam de SMS, webhooks ou encaminhamento para a casa",
      "Você quer CSV e histórico de uma temporada de frio inteira",
    ],
    whenOther: [
      "Você só precisa de alguns sensores Bluetooth a pilha em ambientes internos",
      "Você prefere um app de consumo completo, sem hardware caseiro",
      "Não dá para ter Wi-Fi na garagem e o alcance do Bluetooth é suficiente",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "O seu: ESP / Pico / Arduino", other: "Sensores Govee" },
      { capability: "Garagens / espaços separados", probeharbor: "Feito para isso", other: "Alcance irregular" },
      { capability: "Canais de alerta", probeharbor: "E-mail, SMS, push, chat, webhooks + relógio de tempo até congelar", other: "Principalmente push do app" },
      { capability: "Preço", probeharbor: "Cerca de US$ 25 em peças por sonda; plano Free, Member US$ 4/mês, Pro US$ 10/mês", other: "Cerca de US$ 35–50 por gateway Wi-Fi + sensor; sem assinatura" },
      { capability: "Exportação de dados", probeharbor: "CSV (Member+) e API (Pro)", other: "Exportação pelo app; 2 anos de dados armazenados em alguns modelos" },
      { capability: "Vários usuários por casa", probeharbor: "Incluído", other: "Compartilhar a conta é complicado" },
    ],
    faqs: [
      {
        question: "O ProbeHarbor substitui a Govee nos quartos?",
        answer:
          "Não é o foco principal. A Govee ganha com sensores Bluetooth baratos para ambientes internos e um app de consumo caprichado. O ProbeHarbor é para monitorar congelamento e vazamento em garagens, oficinas e outros espaços sem aquecimento, com hardware que você controla.",
      },
      {
        question: "Posso usar um ESP32 em vez dos sensores Govee?",
        answer:
          "Sim. O ProbeHarbor espera que você traga seu próprio ESP/Pico/Arduino (ou envie JSON). Essa é justamente a ideia para garagens separadas, onde o alcance do Bluetooth não chega.",
      },
      {
        question: "Qual tem os melhores canais de alerta de congelamento?",
        answer:
          "O ProbeHarbor: e-mail, push e apps de chat em todos os planos, SMS e webhooks no Pro, além de um relógio de tempo até congelar. Os alertas da Govee são notificações do app, e você precisa da versão com gateway Wi-Fi para recebê-los fora de casa.",
      },
    ],
    sources: {
      checkedOn: "setembro de 2026",
      links: [
        { label: "GoveeLife Smart Thermometer R1 (gateway + sensor)" },
        { label: "Govee Wi-Fi Thermo-Hygrometer" },
      ],
    },
  },
  tempest: {
    title: "ProbeHarbor vs Tempest",
    seoTitle: "Tempest vs sondas internas para alertas de cano congelado",
    headline: "ProbeHarbor vs WeatherFlow Tempest",
    description:
      "Estações meteorológicas externas como a Tempest vs sondas internas do ProbeHarbor, quando você precisa de alertas de congelamento onde a água realmente está.",
    summary:
      "A Tempest brilha no clima do quintal: vento, chuva, temperatura externa. Mas o risco de cano congelado está dentro de casa. O ProbeHarbor monitora a garagem, o porão ou a oficina por onde passa o encanamento.",
    lede:
      "Uma Tempest no telhado informa o ar externo, o vento e a chuva com excelente precisão. Os canos congelam onde está a água, geralmente numa garagem, num porão ou numa oficina que a estação nunca vê. Use a Tempest para o clima do quintal e o ProbeHarbor para a sonda interna ao lado do encanamento.",
    whenProbeHarbor: [
      "Você precisa da temperatura de espaços internos ou sem aquecimento para avaliar o risco nos canos",
      "Os alertas devem disparar pela temperatura do espaço, não só pela do ar externo",
      "Você já tem ou quer sensores caseiros no Wi-Fi",
    ],
    whenOther: [
      "Você quer uma estação meteorológica pessoal externa de primeira linha",
      "Seu objetivo é previsão hiperlocal e dados de tempestades",
      "Você não tem risco de congelamento no encanamento interno",
    ],
    rows: [
      { capability: "Função principal", probeharbor: "Monitoramento de congelamento / espaços internos", other: "Clima externo" },
      { capability: "Local da sonda", probeharbor: "Garagem, porão, armário", other: "Telhado / quintal" },
      { capability: "Alertas de congelamento nos canos", probeharbor: "Diretos + relógio de horas até congelar", other: "Só deduzidos do ar externo" },
      { capability: "Envio de ESP caseiro", probeharbor: "Sim", other: "Não se aplica" },
      { capability: "Um complementa o outro?", probeharbor: "Sim, use os dois", other: "Sim: contexto externo" },
    ],
    faqs: [
      {
        question: "A Tempest substitui uma sonda de congelamento interna?",
        answer:
          "Não. A Tempest mede o clima externo do quintal. O risco de cano congelado está dentro de casa (garagem, porão, oficina). Use a Tempest para o contexto externo e o ProbeHarbor para a sonda ao lado do encanamento.",
      },
      {
        question: "Posso usar a Tempest e o ProbeHarbor juntos?",
        answer:
          "Sim. Muitas casas mantêm a Tempest para o clima e o ProbeHarbor para alertas de temperatura do espaço onde a água realmente fica.",
      },
      {
        question: "Só o ar externo basta para detectar congelamento na garagem?",
        answer:
          "Não de forma confiável. A garagem reage ao ar externo com atraso e pode congelar enquanto o quintal parece mais ameno, ou continuar mais quente enquanto a temperatura lá fora despenca. Coloque uma sonda no espaço.",
      },
    ],
  },
  nest: {
    title: "ProbeHarbor vs termostato Nest",
    seoTitle: "Termostato Nest vs sensor de congelamento na garagem",
    headline: "ProbeHarbor vs um termostato Nest para proteger espaços sem aquecimento do congelamento",
    description:
      "Um termostato Nest não recebe sinal de uma garagem sem aquecimento. O ProbeHarbor monitora esse espaço e pode mostrar a leitura do Nest nos alertas.",
    summary:
      "O Nest é excelente para controlar a climatização e informar a temperatura onde ele (ou um Nest Temperature Sensor) está instalado, quase nunca a garagem, o porão ou a oficina onde os canos realmente congelam. O ProbeHarbor monitora esse espaço diretamente e, se você conectar sua conta Nest, traz a leitura e o status do aquecimento para cada alerta de congelamento como contexto.",
    lede:
      "O Nest faz uma coisa muito bem: controlar o aquecedor e acompanhar a temperatura do cômodo onde está. Uma garagem, porão ou oficina sem aquecimento não é climatizada por definição, então o Nest não tem nenhuma leitura de lá: não há nada para alertar. O ProbeHarbor coloca uma sonda dedicada nesse espaço e, se você conectar sua conta Nest (Pro), cada alerta de congelamento mostra a temperatura interna da casa e se o aquecimento está ligado, para você saber num relance se o frio é esperado (a garagem não é climatizada, a casa está bem) ou se algo realmente deu errado.",
    whenProbeHarbor: [
      "Você tem uma garagem, porão ou oficina fora do circuito de aquecimento do Nest",
      "Você quer um alerta do próprio espaço sem climatização, não uma dedução a partir do termostato",
      "Você já usa o Nest e quer ver a leitura dele ao lado dos alertas de congelamento, não substituí-lo",
    ],
    whenOther: [
      "Você só precisa da temperatura dos cômodos climatizados pelo Nest",
      "Você quer controlar horários de aquecimento e refrigeração, não só monitorar um espaço frio",
      "Você não tem um espaço separado sem climatização que precise de sonda própria",
    ],
    rows: [
      { capability: "Função principal", probeharbor: "Monitoramento de congelamento/vazamento em qualquer espaço", other: "Controle de climatização do espaço condicionado" },
      { capability: "Enxerga uma garagem / porão sem aquecimento", probeharbor: "Sim: sonda dedicada", other: "Não: espaços sem climatização ficam fora do circuito" },
      { capability: "Alertas de congelamento/vazamento (SMS, push, e-mail)", probeharbor: "Sim, além do tempo restante até congelar", other: "Não" },
      { capability: "Mostra a leitura do termostato nos alertas", probeharbor: "Sim, se conectado (Pro)", other: "Não se aplica" },
      { capability: "Controla horários de aquecimento", probeharbor: "Não", other: "Sim" },
      { capability: "Um complementa o outro?", probeharbor: "Sim: conecte os dois", other: "Sim: conecte os dois" },
    ],
    faqs: [
      {
        question: "O Nest enxerga minha garagem sem aquecimento?",
        answer:
          "Normalmente não. O Nest informa o espaço climatizado onde ele (ou um Nest Temperature Sensor) está instalado. Garagens e porões sem aquecimento ficam fora desse circuito.",
      },
      {
        question: "O ProbeHarbor pode mostrar leituras do Nest?",
        answer:
          "Sim, no Pro com o Nest conectado via OAuth: os alertas de congelamento e o Overview podem mostrar a temperatura interna da casa e o status do aquecimento ao lado da sonda da garagem.",
      },
      {
        question: "Devo trocar o Nest pelo ProbeHarbor?",
        answer:
          "Não. O Nest controla a climatização; o ProbeHarbor monitora espaços sem climatização. Conecte os dois se quiser o contexto do termostato nos alertas de congelamento.",
      },
    ],
  },
  ecobee: {
    title: "ProbeHarbor vs termostato Ecobee",
    seoTitle: "Termostato Ecobee vs sensor de congelamento na garagem",
    headline: "ProbeHarbor vs um termostato Ecobee para proteger espaços sem aquecimento do congelamento",
    description:
      "Um termostato Ecobee não recebe sinal de uma garagem sem aquecimento. O ProbeHarbor monitora esse espaço e pode mostrar a leitura do Ecobee nos alertas.",
    summary:
      "O Ecobee é excelente para controlar a climatização e informar a temperatura onde ele (ou um Ecobee SmartSensor) está instalado, quase nunca a garagem, o porão ou a oficina onde os canos realmente congelam. O ProbeHarbor monitora esse espaço diretamente e, se você conectar sua conta Ecobee, traz a leitura e o status do aquecimento para cada alerta de congelamento como contexto.",
    lede:
      "O Ecobee faz uma coisa muito bem: controlar o aquecedor e acompanhar a temperatura do cômodo onde está. Uma garagem, porão ou oficina sem aquecimento não é climatizada por definição, então o Ecobee não tem nenhuma leitura de lá: não há nada para alertar. O ProbeHarbor coloca uma sonda dedicada nesse espaço e, se você conectar sua conta Ecobee (Pro), cada alerta de congelamento mostra a temperatura interna da casa e se o aquecimento está ligado, para você saber num relance se o frio é esperado (a garagem não é climatizada, a casa está bem) ou se algo realmente deu errado.",
    whenProbeHarbor: [
      "Você tem uma garagem, porão ou oficina fora do circuito de aquecimento do Ecobee",
      "Você quer um alerta do próprio espaço sem climatização, não uma dedução a partir do termostato",
      "Você já usa o Ecobee e quer ver a leitura dele ao lado dos alertas de congelamento, não substituí-lo",
    ],
    whenOther: [
      "Você só precisa da temperatura dos cômodos climatizados pelo Ecobee",
      "Você quer controlar horários de aquecimento e refrigeração, não só monitorar um espaço frio",
      "Você não tem um espaço separado sem climatização que precise de sonda própria",
    ],
    rows: [
      { capability: "Função principal", probeharbor: "Monitoramento de congelamento/vazamento em qualquer espaço", other: "Controle de climatização do espaço condicionado" },
      { capability: "Enxerga uma garagem / porão sem aquecimento", probeharbor: "Sim: sonda dedicada", other: "Não: espaços sem climatização ficam fora do circuito" },
      { capability: "Alertas de congelamento/vazamento (SMS, push, e-mail)", probeharbor: "Sim, além do tempo restante até congelar", other: "Não" },
      { capability: "Mostra a leitura do termostato nos alertas", probeharbor: "Sim, se conectado (Pro)", other: "Não se aplica" },
      { capability: "Controla horários de aquecimento", probeharbor: "Não", other: "Sim" },
      { capability: "Um complementa o outro?", probeharbor: "Sim: conecte os dois", other: "Sim: conecte os dois" },
    ],
    faqs: [
      {
        question: "O Ecobee enxerga minha garagem sem aquecimento?",
        answer:
          "Normalmente não. O Ecobee informa os cômodos climatizados (ou os SmartSensors desse circuito), não uma garagem separada ou um porão por padrão.",
      },
      {
        question: "O ProbeHarbor pode mostrar leituras do Ecobee?",
        answer:
          "Sim, no Pro quando o OAuth do Ecobee está disponível e conectado. Se o cadastro de desenvolvedores do Ecobee estiver fechado, use Home Assistant → envio de dados → referência interna.",
      },
      {
        question: "Devo trocar o Ecobee pelo ProbeHarbor?",
        answer:
          "Não. O Ecobee controla a climatização; o ProbeHarbor monitora espaços sem climatização. Um complementa o outro.",
      },
    ],
  },
  tempstick: {
    title: "ProbeHarbor vs TempStick",
    seoTitle: "Alternativa ao Temp Stick: sensores de congelamento DIY",
    headline: "ProbeHarbor vs sensores Wi‑Fi Temp Stick",
    description:
      "Temp Stick vs ProbeHarbor: sensores de US$ 149–209 com SMS grátis, ou sondas DIY de US$ 25 com várias zonas, sensores de vazamento e Home Assistant.",
    summary:
      "O Temp Stick é a escolha mais fácil para um ou dois espaços: um sensor a pilha pronto, sem assinatura e com alertas grátis por SMS, e-mail e app. O ProbeHarbor sai mais barato por sensor e é mais flexível (várias sondas, sensores de vazamento, Home Assistant), mas você monta o sensor e o SMS exige o Pro.",
    lede:
      "O Temp Stick vende sensores Wi‑Fi prontos: US$ 149 o modelo padrão ou cerca de US$ 199 o PRO com sonda de braçadeira para cano, com alertas grátis por SMS, e-mail e app e sem assinatura. É difícil de bater se você quer um único sensor sem configurar nada. O ProbeHarbor é para quem quer várias sondas, um sensor de vazamento embaixo do aquecedor de água ou leituras dentro do Home Assistant: um ESP32 e uma sonda custam cerca de US$ 25, os alertas por e-mail e chat são grátis e o SMS fica no Pro.",
    whenProbeHarbor: [
      "Você quer sondas em vários pontos (canos, lado da porta, porão) sem comprar um sensor de US$ 149 ou mais para cada um",
      "Você quer contatos de vazamento molhado/seco e alertas de congelamento na mesma conta",
      "Você já usa Home Assistant, ESPHome ou MQTT e quer que as leituras circulem nos dois sentidos",
      "Você quer avisos de congelamento pela previsão, uma estimativa do tempo até congelar ou software de código aberto que você pode inspecionar",
    ],
    whenOther: [
      "Você quer um sensor pronto, sem solda, gravação de firmware ou configuração além do Wi‑Fi",
      "Você precisa de alimentação a pilha onde não há tomada",
      "Você quer alertas por SMS grátis, sem assinatura",
      "Um ou dois sensores cobrem tudo o que você precisa",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "DIY: ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Sensor pronto a pilha ou na tomada" },
      { capability: "Custo inicial", probeharbor: "Cerca de US$ 25 em peças por sonda", other: "US$ 149 o padrão; cerca de US$ 199 o PRO com braçadeira para cano" },
      { capability: "Custo recorrente", probeharbor: "Plano Free; Member US$ 4/mês; Pro US$ 10/mês para SMS", other: "Nenhum" },
      { capability: "Sonda presa ao cano", probeharbor: "Sim (DS18B20 à prova d’água no cano)", other: "Sim no PRO (braçadeira)" },
      { capability: "Contatos de vazamento / inundação", probeharbor: "Sim, alertam automaticamente quando molham", other: "Não consta no modelo com braçadeira" },
      { capability: "Canais de alerta", probeharbor: "E-mail, push e apps de chat grátis; SMS e webhooks no Pro", other: "SMS, e-mail e app, tudo grátis" },
      { capability: "Compartilhamento e dados", probeharbor: "Convites para a casa, CSV (Member+), API (Pro)", other: "Até 10 contatos de alerta, exportação CSV, API pública" },
      { capability: "Home Assistant", probeharbor: "Integração HACS oficial + envio a partir do HA", other: "Pela API deles" },
      { capability: "Avisos pela previsão", probeharbor: "Previsão de congelamento (Member+), alertas do NWS (Pro, EUA)", other: "Não consta; alertas por limite" },
    ],
    faqs: [
      {
        question: "O Temp Stick é mais fácil de configurar que o ProbeHarbor?",
        answer:
          "Sim. Um Temp Stick entra no Wi‑Fi e funciona pelo app. O ProbeHarbor precisa de um ESP32 ou placa parecida gravada com um sketch pré-preenchido, ou de um Home Assistant, ESPHome ou MQTT que você já tenha.",
      },
      {
        question: "Qual é mais barato?",
        answer:
          "Para um sensor com SMS, o Temp Stick: US$ 149–209 uma única vez contra cerca de US$ 25 em peças mais US$ 100/ano do ProbeHarbor Pro. Para várias zonas ou alertas só por e-mail, o ProbeHarbor: três sondas custam cerca de US$ 75 em peças e o plano Free inclui alertas por e-mail, contra US$ 447 ou mais por três Temp Sticks.",
      },
      {
        question: "O Temp Stick cobra assinatura?",
        answer:
          "Não. A Temp Stick diz que o monitoramento, o registro de dados e os alertas por SMS, e-mail e app são grátis durante toda a vida útil do sensor.",
      },
      {
        question: "O ProbeHarbor consegue monitorar uma casa de campo vazia como um Temp Stick?",
        answer:
          "Sim, se a casa tiver Wi‑Fi e energia para um ESP32. Coloque uma sonda à prova d’água no cano mais frio, adicione um contato de vazamento se quiser e escolha alertas por e-mail (grátis) ou SMS (Pro).",
      },
    ],
    sources: {
      checkedOn: "setembro de 2026",
      links: [
        { label: "Sensor Wi‑Fi Temp Stick (US$ 149)" },
        { label: "Temp Stick PRO com braçadeira para cano" },
        { label: "Perguntas frequentes da Temp Stick (taxas, contatos, exportação, API)" },
      ],
    },
  },
  yolink: {
    title: "ProbeHarbor vs YoLink",
    seoTitle: "Alternativa à YoLink para alertas de cano congelado",
    headline: "ProbeHarbor vs sensores de temperatura YoLink",
    description:
      "YoLink vs ProbeHarbor: um kit com hub de US$ 59,99, sensores a pilha prontos e SMS, ou sondas DIY no cano com software de código aberto.",
    summary:
      "A YoLink é a escolha mais fácil, e muitas vezes mais barata, em sensores prontos: um hub e dois sensores a pilha custam US$ 59,99 e alertam por push, e-mail e SMS. O ProbeHarbor é para quem quer uma sonda presa ao cano, sem hub, com hardware próprio ou com as leituras num sistema aberto.",
    lede:
      "A YoLink vende um hub com dois sensores de temperatura e umidade a pilha por US$ 59,99. Os sensores funcionam de −30 °C a 60 °C (−22 °F a 140 °F), duram dois anos ou mais com um par de pilhas e enviam alertas por push, e-mail e SMS. Para a maioria das pessoas que querem um produto pronto numa garagem fria, é uma opção forte. O ProbeHarbor é melhor quando você quer uma sonda à prova d’água direto no cano, contatos de vazamento e alertas de congelamento num só lugar, nenhum hub proprietário, ou software que você pode ler e auto-hospedar: um ESP32 e uma sonda custam cerca de US$ 25, os alertas por e-mail e chat são grátis e o SMS fica no Pro.",
    whenProbeHarbor: [
      "Você quer uma sonda à prova d’água presa ao próprio cano em vez de um sensor de ambiente na parede",
      "Você já usa Home Assistant, ESPHome ou MQTT e quer mais um destino, não mais um hub",
      "Você quer software de código aberto, uma API HTTP para enviar dados de qualquer placa e nenhum hardware do fabricante",
      "Você quer avisos de congelamento pela previsão e uma estimativa do tempo até congelar, além dos alertas por limite",
    ],
    whenOther: [
      "Você quer sensores a pilha prontos, sem fios nem gravação de firmware",
      "Não há tomada onde o sensor precisa ficar",
      "Você quer alertas por push, e-mail e SMS no app de um único fabricante",
      "O espaço fica longe do seu Wi‑Fi e um hub de longo alcance atende melhor",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "DIY: ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Sensor a pilha pronto; exige hub YoLink" },
      { capability: "Custo inicial", probeharbor: "Cerca de US$ 25 em peças por sonda", other: "US$ 59,99 por um hub e dois sensores" },
      { capability: "Custo recorrente", probeharbor: "Plano Free; Member US$ 4/mês; Pro US$ 10/mês para SMS", other: "Não informado na página do produto" },
      { capability: "Indicado para espaços abaixo de zero", probeharbor: "Sim (sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F))", other: "Sim (−30 °C a 60 °C (−22 °F a 140 °F))" },
      { capability: "Alimentação", probeharbor: "USB na placa", other: "Duas pilhas, 2+ anos previstos" },
      { capability: "Sonda presa ao cano", probeharbor: "Sim (DS18B20 à prova d’água no cano)", other: "Sensor externo separado com sonda (YS8005)" },
      { capability: "Canais de alerta", probeharbor: "E-mail, push e apps de chat grátis; SMS e webhooks no Pro", other: "Push, e-mail, SMS" },
      { capability: "Exportação de dados", probeharbor: "CSV (Member+), API (Pro)", other: "Exportação CSV" },
      { capability: "Home Assistant", probeharbor: "Integração HACS oficial + envio a partir do HA", other: "Listado como compatível" },
    ],
    faqs: [
      {
        question: "A YoLink é mais barata que o ProbeHarbor?",
        answer:
          "Em sensores prontos, normalmente sim. O hub da YoLink com dois sensores custa US$ 59,99. Duas sondas do ProbeHarbor custam cerca de US$ 50 em peças e o plano Free inclui alertas por e-mail, mas você mesmo as monta, e o SMS exige o Pro.",
      },
      {
        question: "A YoLink precisa de hub?",
        answer:
          "Sim. Os sensores YoLink se comunicam com um hub YoLink, que se conecta à sua rede. Os dispositivos do ProbeHarbor enviam direto para a internet por Wi‑Fi, Ethernet ou rede celular, sem hub.",
      },
      {
        question: "Os sensores YoLink funcionam numa garagem sem aquecimento?",
        answer:
          "Sim. A YoLink especifica o sensor YS8003 para −30 °C a 60 °C (−22 °F a 140 °F) e inclui freezers entre os usos.",
      },
      {
        question: "Por que escolher o ProbeHarbor em vez da YoLink?",
        answer:
          "Pela posição da sonda e pela abertura: uma sonda à prova d’água no cano mais frio, várias sondas numa só placa, contatos de vazamento na mesma conta e software de código aberto que recebe leituras de qualquer dispositivo capaz de enviar uma requisição HTTPS.",
      },
    ],
    sources: {
      checkedOn: "outubro de 2026",
      links: [
        { label: "Hub YoLink com dois sensores de temperatura e umidade (US$ 59,99)" },
        { label: "Ficha técnica do YoLink YS8003 (faixa, bateria, alertas)" },
      ],
    },
  },
  sensorpush: {
    title: "ProbeHarbor vs SensorPush",
    seoTitle: "Alternativa à SensorPush para alertas remotos de congelamento",
    headline: "ProbeHarbor vs sensores SensorPush",
    description:
      "SensorPush vs ProbeHarbor: sensores Bluetooth precisos que exigem um gateway de US$ 99,95 para alertas remotos, ou sondas Wi‑Fi DIY presas ao cano.",
    summary:
      "A SensorPush faz sensores Bluetooth pequenos e precisos, com um app caprichado e sem mensalidade, mas os alertas fora de casa exigem o gateway Wi‑Fi de US$ 99,95. As sondas do ProbeHarbor enviam direto pelo Wi‑Fi e podem ficar presas ao cano; você as monta, e o SMS exige o Pro.",
    lede:
      "Os sensores SensorPush são compactos e precisos: o HT1 custa US$ 54,95 e o HT.w resistente à água US$ 69,99, ambos especificados de −40 °C a 60 °C (−40 °F a 140 °F) com um ano ou mais de bateria. São sensores Bluetooth, então o celular precisa estar no alcance, a menos que você adicione o G1 Wi‑Fi Gateway de US$ 99,95, que inclui acesso à nuvem sem mensalidade e alertas no app e por e-mail. O ProbeHarbor começa pelo outro lado: um ESP32 com sonda à prova d’água (cerca de US$ 25 em peças) envia sozinho pelo Wi‑Fi, os alertas por e-mail e chat são grátis, e contatos de vazamento, avisos pela previsão e Home Assistant já vêm integrados. O SMS fica no Pro.",
    whenProbeHarbor: [
      "Você quer alertas remotos sem comprar um gateway",
      "Você quer uma sonda à prova d’água no cano, ou várias sondas numa só placa",
      "Você quer alertas por SMS, app de chat ou webhook, ou um contato de vazamento na mesma conta",
      "Você usa Home Assistant, ESPHome ou MQTT e quer que as leituras cheguem lá",
    ],
    whenOther: [
      "Você quer um sensor pequeno e pronto com um ano ou mais de bateria",
      "Você costuma estar em casa, então o alcance do Bluetooth até o celular basta",
      "Você quer temperatura e umidade do ar muito precisas (umidor de charutos, case de instrumento ou adega)",
      "Você prefere uma compra única, sem plano para gerenciar",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "DIY: ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Sensor Bluetooth pronto" },
      { capability: "Custo inicial", probeharbor: "Cerca de US$ 25 em peças por sonda", other: "US$ 54,95 (HT1) ou US$ 69,99 (HT.w) por sensor" },
      { capability: "Alertas fora de casa", probeharbor: "Sim, os sensores enviam pelo Wi‑Fi", other: "Exige o G1 Wi‑Fi Gateway (US$ 99,95)" },
      { capability: "Custo recorrente", probeharbor: "Plano Free; Member US$ 4/mês; Pro US$ 10/mês para SMS", other: "Nenhum; a nuvem do gateway não tem mensalidade" },
      { capability: "Indicado para espaços abaixo de zero", probeharbor: "Sim (sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F))", other: "Sim (−40 °C a 60 °C (−40 °F a 140 °F))" },
      { capability: "Canais de alerta", probeharbor: "E-mail, push e apps de chat grátis; SMS e webhooks no Pro", other: "No app e por e-mail; SMS não consta" },
      { capability: "Alimentação", probeharbor: "USB na placa", other: "Bateria: mais de 1 ano (HT1), mais de 2 anos (HT.w)" },
      { capability: "API", probeharbor: "Envio HTTP em todos os planos; chaves de API no Pro", other: "API para a nuvem do gateway" },
    ],
    faqs: [
      {
        question: "A SensorPush funciona sem o gateway?",
        answer:
          "Sim, por Bluetooth quando o celular está no alcance (a SensorPush indica cerca de 100 metros (325 pés) em linha de visada). Para ver leituras ou receber alertas quando você está fora, é preciso o G1 Wi‑Fi Gateway.",
      },
      {
        question: "A SensorPush cobra assinatura?",
        answer:
          "Não. A SensorPush diz que o serviço de nuvem incluído com o G1 Wi‑Fi Gateway não tem mensalidade.",
      },
      {
        question: "O que custa menos para alertas remotos de congelamento?",
        answer:
          "Para um sensor com alertas remotos, a SensorPush custa US$ 154,90 (HT1 mais gateway) uma única vez. Uma sonda do ProbeHarbor custa cerca de US$ 25 em peças com alertas por e-mail grátis, ou US$ 100 a mais por ano se você quiser SMS no Pro. Cada sensor SensorPush extra custa US$ 54,95; cada sonda extra do ProbeHarbor, cerca de US$ 25, ou menos se dividirem a mesma placa.",
      },
      {
        question: "A SensorPush é mais precisa?",
        answer:
          "Para a temperatura do ar, sim: a SensorPush indica ±0,3 °C (±0,5 °F) típico para o HT1, contra cerca de ±0,5 °C (±1 °F) de um DS18B20. Para um alarme de congelamento qualquer um dos dois sobra, já que o limite de alerta deve ficar alguns graus acima de 0 °C (32 °F) de qualquer forma.",
      },
    ],
    sources: {
      checkedOn: "outubro de 2026",
      links: [
        { label: "Sensor SensorPush HT1 (US$ 54,95)" },
        { label: "Sensor resistente à água SensorPush HT.w (US$ 69,99)" },
        { label: "SensorPush G1 Wi‑Fi Gateway (US$ 99,95; nuvem, alertas, API)" },
      ],
    },
  },
  shelly: {
    title: "ProbeHarbor vs Shelly H&T",
    seoTitle: "Shelly H&T para alertas de congelamento: limites e alternativas",
    headline: "ProbeHarbor vs Shelly H&T Gen3 para alertas de congelamento",
    description:
      "O Shelly H&T Gen3 é um bom sensor de ambiente de US$ 40,99, mas a faixa é de 0–40 °C: não serve para garagem que congela. Veja como uma sonda no cano difere.",
    summary:
      "O Shelly H&T Gen3 é um sensor Wi‑Fi de ambiente bem-feito de US$ 40,99, com tela, MQTT e webhooks. Mas a Shelly o especifica para 0 °C a 40 °C (32 °F a 105 °F), o que o descarta para espaços que realmente congelam. O ProbeHarbor usa uma sonda especificada bem abaixo de zero, presa ao cano.",
    lede:
      "O Shelly H&T Gen3 custa US$ 40,99, dura cerca de um ano com quatro pilhas AA ou funciona por USB‑C, mostra temperatura e umidade numa tela de e-paper e fala Wi‑Fi, MQTT e webhooks. É um bom sensor para um cômodo aquecido. A Shelly indica temperatura ambiente de operação de 0 °C a 40 °C (32 °F a 105 °F) e umidade de 30–70%, então uma garagem ou porão sem aquecimento numa onda de frio fica fora da especificação. O ProbeHarbor é feito para esses espaços: uma sonda DS18B20 à prova d’água especificada até −55 °C (−67 °F), presa ao cano, com alertas de congelamento, vazamento e queda de conexão, e avisos pela previsão. Se você já usa dispositivos Shelly dentro de casa, as leituras deles podem chegar ao ProbeHarbor pelo Home Assistant ou MQTT.",
    whenProbeHarbor: [
      "O espaço pode ficar abaixo de 0 °C (32 °F), fora da faixa especificada do Shelly H&T",
      "Você quer a leitura no cano, sob o isolamento, não a do ar do cômodo",
      "Você quer alertas de congelamento, vazamento e sensor offline, e um aviso pela previsão, sem criar automações",
      "Você quer que as pessoas da casa recebam os alertas por convites para a casa",
    ],
    whenOther: [
      "Você está monitorando um cômodo aquecido: porão, lavanderia ou área de convivência",
      "Você quer um sensor a pilha com tela e sem fios",
      "Você já usa o app da Shelly, Home Assistant ou MQTT e vai criar o alerta por conta própria",
      "A umidade de um espaço climatizado importa mais para você que a temperatura dos canos",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "DIY: ESP32 / Pico / Arduino + DS18B20 ou DHT22", other: "Sensor Wi‑Fi pronto com tela de e-paper" },
      { capability: "Custo inicial", probeharbor: "Cerca de US$ 25 em peças por sonda", other: "US$ 40,99" },
      { capability: "Temperatura de operação especificada", probeharbor: "Sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F)", other: "0 °C a 40 °C (32 °F a 105 °F)" },
      { capability: "Sonda presa ao cano", probeharbor: "Sim (DS18B20 à prova d’água no cano)", other: "Não; mede o ar junto ao aparelho" },
      { capability: "Alimentação", probeharbor: "USB na placa", other: "4 pilhas AA (cerca de 1 ano) ou USB‑C" },
      { capability: "Integrações locais", probeharbor: "Home Assistant (HACS), ESPHome, ponte MQTT", other: "MQTT e webhooks (ações de URL)" },
      { capability: "Contatos de vazamento / inundação", probeharbor: "Sim, alertam automaticamente quando molham", other: "Não neste aparelho" },
    ],
    faqs: [
      {
        question: "Dá para usar um Shelly H&T numa garagem sem aquecimento?",
        answer:
          "A Shelly indica para o H&T Gen3 uma temperatura ambiente de operação de 0 °C a 40 °C (32 °F a 105 °F). Uma garagem que fica abaixo de zero está fora dessa faixa, então ele é a ferramenta errada para um alarme de congelamento ali.",
      },
      {
        question: "Um dispositivo Shelly pode enviar leituras para o ProbeHarbor?",
        answer:
          "Sim. O caminho mais simples para um H&T é pelo Home Assistant ou MQTT, para os quais o ProbeHarbor tem uma integração e uma receita de ponte. O guia de receitas de ESPHome e Shelly em probeharbor.dev/about/esphome-shelly-recipes explica o envio direto a partir de módulos Shelly Plus e Gen2.",
      },
      {
        question: "Um Shelly H&T é mais barato que uma sonda do ProbeHarbor?",
        answer:
          "Não. O H&T Gen3 custa US$ 40,99; um ESP32 com um DS18B20 à prova d’água sai por cerca de US$ 25 em peças. O Shelly vem pronto e funciona a pilha, e é isso que a diferença paga.",
      },
    ],
    sources: {
      checkedOn: "outubro de 2026",
      links: [
        { label: "Página do produto e especificações do Shelly H&T Gen3 (US$ 40,99)" },
        { label: "Especificações técnicas do DS18B20 à prova d’água (Adafruit)" },
      ],
    },
  },
} satisfies CompareGuideOverlay;
