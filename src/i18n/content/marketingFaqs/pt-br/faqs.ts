import type { MarketingFaqOverlay } from "../index";

export default {
  home: [
    {
      question: "O que é o ProbeHarbor?",
      answer: `ProbeHarbor é monitoramento de congelamento e alagamento open source para garagens, oficinas e sótãos: ingestão ESP/Arduino, curvas ao vivo e alertas. Você monta com ESP32, Pico W ou Arduino; o ProbeHarbor cuida do painel hospedado, do histórico e dos alertas para a sua casa.`,
    },
    {
      question: "Como conecto sensores ESP32, Pico W ou Arduino?",
      answer:
        "Com um ESP32, o caminho mais rápido é o gravador web em probeharbor.dev/flash: conecte a placa via USB, instale o firmware pelo Chrome ou Edge e envie a ela o seu Wi-Fi e a chave do dispositivo. Ele lê sondas DS18B20, um DHT22 ou um sensor I²C (BME280, SHT31, AHT20), além de entradas opcionais de vazamento, porta e bateria. Para outras placas, crie um dispositivo push em Dashboard → Devices e faça POST de JSON para /api/ingest/<key>; os sensores são importados automaticamente no primeiro POST. Exemplos para Pico W e Arduino ficam em probeharbor.dev/about/adding-devices. Sem hardware? Experimente o início rápido de pull da demo no Overview.",
    },
    {
      question: "Preciso saber programar?",
      answer:
        "Não. Com um ESP32, o gravador web instala um firmware pronto direto do seu navegador e envia o seu Wi-Fi e a chave do dispositivo pelo cabo USB, sem Arduino IDE e sem nada para editar. O firmware é open source, caso você prefira ler ou alterar o código, e os sketches de exemplo continuam disponíveis para outras placas.",
    },
    {
      question: "O ProbeHarbor envia alertas de congelamento?",
      answer:
        "Sim. Defina um limite de congelamento e ative canais como e-mail, push no navegador ou no Android, Discord, Telegram, Slack ou (no Pro) SMS e WhatsApp. Os alertas de tempo até o congelamento, com as horas restantes, disparam antes de a sonda cruzar o ponto de congelamento, usando o atraso deste ambiente em relação à previsão externa (detalhes: probeharbor.dev/about/time-to-freeze). Alertas preditivos de congelamento pela previsão externa estão no Member; alertas oficiais de congelamento e frio do NWS (EUA) estão no Pro. Sensores de vazamento/alagamento também avisam automaticamente quando molhados; porta, movimento, energia e qualidade do ar usam regras personalizadas. Com um webhook de bot do Telegram, você pode responder /status, /snooze ou /vacation pelo chat.",
    },
    {
      question: "O ProbeHarbor é gratuito?",
      answer:
        "Sim, existe um plano gratuito com curvas ao vivo, 7 dias de histórico, alertas de limite de congelamento e de vazamento por e-mail e push, e um link de compartilhamento ao vivo para a família (válido por 7 dias). O Member adiciona 90 dias de histórico, exportação CSV, mais dispositivos e avisos de congelamento pela previsão; o Pro adiciona mais de 1 ano de histórico, alertas oficiais de congelamento e frio do NWS (EUA), SMS, escopos de compartilhamento ilimitados (histórico, métricas, sem expiração), um pacote de evidências imprimível para sinistros, webhooks e um período de teste. A cobrança anual do Member e do Pro sai mais barata que a mensal.",
    },
    {
      question: "Por que preciso de uma conta?",
      answer:
        "A conta vincula suas chaves de ingestão, seu histórico e seus alertas à sua casa: é assim que mantemos suas sondas privadas. O cadastro é gratuito e não pede cartão de crédito. Você pode testar o simulador interativo de sondas ou assistir à demo ao vivo sem se cadastrar; crie uma conta quando quiser conectar o seu próprio hardware.",
    },
    {
      question: "Existe um app do ProbeHarbor para Android?",
      answer:
        "Um app nativo para Android está disponível em acesso antecipado no GitHub enquanto a análise do Google Play é concluída. Você também pode usar o painel web completo ou instalar o Progressive Web App. Os apps complementares (Android, Desktop, Bay Buddy, PWA) estão listados em probeharbor.dev/apps. Os apps de celular e desktop não medem temperatura: eles se conectam à sua conta ProbeHarbor.",
    },
    {
      question: "O ProbeHarbor se chamava ThermalTrace?",
      answer:
        "Sim. O ThermalTrace passou a se chamar ProbeHarbor em outubro de 2026 para evitar confusão com um produto sem relação. Contas, sensores, histórico e alertas foram mantidos sem alterações. Os links antigos de thermaltrace.dev redirecionam para cá, e dispositivos que ainda enviam para URLs de ingestão em thermaltrace.dev continuam funcionando, mas novas instalações devem usar probeharbor.dev.",
    },
    {
      question: "Onde o ProbeHarbor é hospedado?",
      answer:
        "Na rede de borda da Cloudflare (Workers), então o site e as APIs de ingestão rodam perto dos visitantes sem que você precise manter um VPS. A saúde dos jobs e da ingestão em tempo real fica em probeharbor.dev/system-status: publicamos o que medimos, não um percentual de disponibilidade de marketing.",
    },
  ],
  demo: [
    {
      question: "Qual a diferença entre esta página e a demo da página inicial?",
      answer:
        "A página inicial leva você primeiro ao simulador interativo de sondas, com uma prévia curta das leituras ao vivo. Esta página tem as duas coisas: um destaque para o simulador e o feed ao vivo completo (sondas + clima externo), contexto sobre alertas de congelamento, passos do kit e onboarding por QR.",
    },
    {
      question: "Feed ao vivo ou simulador interativo: qual devo testar?",
      answer:
        "Comece pelo simulador interativo de sondas (/about/probe-demo) quando quiser provocar uma onda de frio ou uma corrente de ar pela porta e ver o risco em várias zonas reagir. Use o feed ao vivo desta página para ver sondas reais da demo no mesmo caminho de ingestão que o seu ESP/Arduino vai usar: prova observacional, não um ambiente de testes.",
    },
    {
      question: "O que é o onboarding por QR do kit?",
      answer:
        "Depois que você cria um dispositivo push, o ProbeHarbor mostra um QR code com a URL de ingestão completa (por cerca de 30 minutos). Escaneie com o celular ou imprima em uma etiqueta do kit para que o firmware ou o Home Assistant façam POST sem digitar a chave. Passo a passo: probeharbor.dev/about/kit-qr-onboarding.",
    },
    {
      question: "Os dados da demo ao vivo são falsos?",
      answer:
        "Não. As leituras vêm do feed público de demo do ProbeHarbor pelo mesmo caminho HTTPS de ingestão/pull que os dispositivos em produção usam. O simulador interativo é sintético de propósito, para que você possa mexer no ar externo, no sol e no estado da porta: ele reutiliza o mesmo auxiliar de status do ambiente do Overview para o risco de congelamento.",
    },
    {
      question: "Preciso de uma conta para testar?",
      answer:
        "Não para esta página nem para o simulador de sondas. Você precisa de uma conta gratuita (sem cartão de crédito) para criar a sua própria chave de dispositivo, guardar histórico e configurar alertas de congelamento. Detalhes dos planos: probeharbor.dev/pricing.",
    },
  ],
  pricing: [
    {
      question: "O que está incluído no plano Free?",
      answer: `Leituras ao vivo de temperatura, umidade, qualidade do ar, portas, vazamentos, energia e movimento em garagens, oficinas, sótãos, porões e galpões; 7 dias de histórico; alertas de limite de congelamento e de vazamento, além de um relógio de tempo até o congelamento; e-mail e canais estilo chat; um número limitado de dispositivos; um link de compartilhamento ao vivo para a família; e compartilhamento com a casa para que a família acompanhe os mesmos sensores.`,
    },
    {
      question: "Quando devo fazer upgrade para Member ou Pro?",
      answer:
        "Escolha o Member para 90 dias de histórico, exportação CSV, mais dispositivos e avisos preditivos de congelamento pela previsão. Escolha o Pro para mais de 1 ano de histórico, alertas oficiais de congelamento e frio do NWS (EUA), contexto da casa via Nest/Ecobee (ou referência interna), SMS/WhatsApp, push no navegador, links de compartilhamento ilimitados (histórico, métricas, incorporações, sem expiração), um pacote de evidências imprimível para sinistros/seguro, webhooks de entrada e saída, métricas do Prometheus, até 50 imóveis próprios e um teste de 14 dias. O Free já inclui um link de compartilhamento ao vivo para a família. A cobrança anual sai mais barata que pagar mês a mês.",
    },
    {
      question: "Quando preciso do Portfolio em vez do Pro?",
      answer:
        "O Pro já cobre até 50 imóveis próprios, o suficiente para uma casa de veraneio, alguns imóveis de aluguel ou uma oficina mais a casa. O Portfolio eleva esse limite para 500 e adiciona logins de administrador de imóveis, para que a equipe no local gerencie dispositivos e alertas dos imóveis atribuídos sem ver a cobrança nem outros locais. Veja probeharbor.dev/property-management.",
    },
    {
      question: "O que é o pacote de evidências para sinistros/seguro?",
      answer:
        "No Pro, o History pode exportar um resumo em PDF para sinistros no período que você escolher: exposição ao congelamento, dispositivos e linha do tempo dos alertas, com os CSVs correspondentes de leituras e eventos de alerta. São evidências de monitoramento para uso próprio, não uma avaliação jurídica ou de seguradora. Também há uma versão em HTML caso você precise editar ou reimprimir.",
    },
    {
      question: "Posso cancelar ou mudar de plano a qualquer momento?",
      answer:
        "Os planos pagos são cobrados pela Stripe. Você pode gerenciar ou cancelar pelo portal do cliente; a falta de pagamento pode fazer a conta voltar aos limites do Free. Os gráficos e o CSV seguem imediatamente a janela do plano atual (7 dias no Free). Leituras mais antigas não são apagadas no downgrade: elas continuam armazenadas no cronograma normal de retenção e voltam a aparecer se você fizer upgrade de novo antes que expirem.",
    },
    {
      question: "Qual é a política de reembolso do teste do Pro?",
      answer:
        "O teste do Pro é gratuito. Cancele antes do fim e você não é cobrado. Depois que o teste se converte em plano pago, o período de cobrança atual geralmente não é reembolsável. Fale com a gente se alguma cobrança parecer errada e vamos analisá-la.",
    },
    {
      question: "Quão confiável é a hospedagem do ProbeHarbor?",
      answer:
        "O app roda no Cloudflare Workers, na borda. Confira probeharbor.dev/system-status para ver a saúde do cron e da ingestão em tempo real e inscreva-se lá para receber avisos de degradação. Não apresentamos o SLA da plataforma da Cloudflare como o nosso percentual de disponibilidade.",
    },
  ],
  compare: [
    {
      question: "Qual a diferença entre o ProbeHarbor e um script caseiro?",
      answer:
        "O ProbeHarbor hospeda para você a ingestão, o histórico, as casas e os alertas de congelamento e vazamento em vários canais. Um script cron caseiro exige que você mesmo mantenha servidores, bancos de dados, a integração com a Twilio e a disponibilidade.",
    },
    {
      question: "Como o ProbeHarbor se compara ao Govee ou ao SmartThings?",
      answer: `Govee e SmartThings são apps gerais de consumo/casa inteligente. O ProbeHarbor é feito sob medida para garagens, oficinas, sótãos, porões e galpões: ingestão ESP/Arduino ou JSON, fluxos para congelamento, qualidade do ar, portas, vazamentos, energia e histórico em CSV, em vez de um painel genérico para qualquer dispositivo.`,
    },
    {
      question: "Preciso de um IP público para o meu Arduino?",
      answer:
        "Não para ingestão push: o dispositivo faz POST de saída para o ProbeHarbor. Feeds pull precisam de uma URL JSON HTTPS acessível se você usar esse caminho.",
    },
    {
      question: "Posso manter o Home Assistant ou o MQTT e ainda usar o ProbeHarbor?",
      answer:
        "Sim. Instale a integração oficial do HACS (github.com/doodersrage/probeharbor-home-assistant) para criar entidades automaticamente a partir de um link de compartilhamento, ou mantenha o MQTT na sua rede local e espelhe com POST /api/ingest/mqtt. Muita gente usa os dois: o HA localmente e o ProbeHarbor para o SMS de congelamento e vazamento da casa e para o histórico. Veja probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Por que o ProbeHarbor exige uma conta?",
      answer:
        "O ProbeHarbor é hospedado para que você não precise manter bancos de dados nem integração de SMS. Uma conta gratuita (sem cartão de crédito) vincula a sua chave de ingestão à sua casa. Você ainda pode usar o Home Assistant ou o MQTT na rede local em paralelo. O ProbeHarbor é a camada externa de alertas e histórico.",
    },
    {
      question: "Preciso manter um servidor ligado em casa?",
      answer:
        "Não. O ProbeHarbor roda na borda da Cloudflare; suas sondas só precisam de HTTPS de saída (push) ou de uma URL de pull acessível. A saúde do serviço em tempo real fica em probeharbor.dev/system-status.",
    },
    {
      question: "Já tenho um Govee ou um Tempest: ainda preciso disto?",
      answer: `O Govee é um sensor de ambiente para consumidores; o Tempest é uma estação de clima externo. O ProbeHarbor acompanha as curvas das sondas em garagens, oficinas, sótãos, porões e galpões, em hardware que você controla. Eles podem conviver: veja as páginas de comparação com Govee e Tempest para saber quando cada ferramenta se encaixa melhor.`,
    },
  ],
  "freeze-map": [
    {
      question: "O que é o mapa de congelamento do ProbeHarbor?",
      answer:
        "Um agregado opcional, por cidade, de amostras anonimizadas de temperatura das sondas de casas participantes: útil para ver o risco regional de congelamento, não um feed pessoal ao vivo. Incorpore o mapa ou use o selo em Markdown quando a sua região estiver no ar.",
    },
    {
      question: "Os dados do mapa de congelamento identificam pessoas?",
      answer:
        "Não. As contribuições são agregadas por cidade para exibição pública. Nenhum endereço, nome de dispositivo ou ID de casa aparece no mapa. O painel da sua conta continua privado para a sua casa.",
    },
    {
      question: "Posso remover a contribuição da minha casa depois de participar?",
      answer:
        "Sim. Desative a participação no mapa de congelamento em Dashboard → Household quando quiser. Suas sondas deixam de contribuir a partir do próximo snapshot horário; os agregados anteriores da cidade continuam anonimizados (nunca identificaram você).",
    },
    {
      question: "Quantas casas são necessárias para a minha cidade mostrar dados reais?",
      answer: `Uma cidade aparece no mapa padrão quando pelo menos 3 casas participantes com uma sonda de temperatura ativa contribuem na mesma janela de snapshot. Cidades com poucos dados (abaixo desse mínimo) ficam ocultas por padrão, mas podem ser exibidas com a opção de cidades esparsas. Enquanto nenhuma cidade atinge o mínimo, a página mostra uma prévia de exemplo claramente identificada.`,
    },
    {
      question: "E se eu tiver só uma sonda: ela conta?",
      answer:
        "Sim. Cada casa participante contribui com uma amostra para a sua cidade (a média das sondas de temperatura da casa, com o risco de congelamento baseado na mais fria). Uma sonda é suficiente.",
    },
    {
      question: "O que significa a parcela com risco de congelamento?",
      answer:
        "Para cada cidade, “Samples” é o número de casas participantes naquele snapshot. A parcela com risco de congelamento é o percentual (e a quantidade) dessas casas cuja sonda mais fria estava em 1 °C (34 °F) ou abaixo no momento da captura.",
    },
  ],
  contact: [
    {
      question: "O que devo verificar antes de falar com o suporte?",
      answer:
        "Fiação das sondas, payloads de ingestão, alertas de congelamento e vazamento e configuração do painel são explicados na central de guias e na biblioteca de artigos. Use este formulário para dúvidas sobre conta, cobrança, avisos de lançamento do Android ou perguntas que a documentação não responde.",
    },
    {
      question: "Devo usar o formulário ou o GitHub?",
      answer:
        "Dúvidas sobre conta, cobrança e casa vão neste formulário. Bugs, patches de firmware e ideias de recursos vão nas issues do GitHub, para que outros makers possam acompanhar.",
    },
    {
      question: "Em quanto tempo recebo resposta?",
      answer:
        "Normalmente respondemos em 1–2 dias úteis. O formulário é protegido pelo Cloudflare Turnstile; não divulgamos um e-mail de suporte para que essa caixa de entrada fique fora das listas de spam.",
    },
  ],
  docsApi: [
    {
      question: "Onde fica a especificação OpenAPI do ProbeHarbor?",
      answer:
        "Baixe o openapi.yaml em /openapi.yaml no probeharbor.dev (também espelhado na documentação para desenvolvedores no GitHub Pages). A página /docs/api dentro do app é a referência rápida para leitura humana, com exemplos de curl, limites de taxa e códigos de erro.",
    },
    {
      question: "Como me autentico na API HTTP?",
      answer:
        "O firmware dos dispositivos usa uma chave de ingestão por dispositivo na URL (ou X-Ingest-Key para a ponte MQTT). Integrações do Pro usam uma chave de API Bearer de Dashboard → Share. O painel no navegador usa cookies de sessão, não destinados a clientes de terceiros. As rotas de compartilhamento e de entrada usam tokens opacos no caminho.",
    },
    {
      question: "Quais são os limites de taxa da ingestão?",
      answer:
        "A ingestão push aceita um corpo de no máximo cerca de 64KB e cerca de 60 requisições por minuto por chave de dispositivo (por isolate do Worker). Corpos grandes demais retornam 413; o limite de taxa retorna 429. Mantenha o firmware abaixo desses tetos: sondas típicas de garagem fazem POST a cada 1–5 minutos.",
    },
    {
      question: "O que significa “cofre criptografado” no reveal-ingest-key?",
      answer:
        "Quando a implantação define INGEST_KEY_ENCRYPTION_SECRET, as novas chaves push são armazenadas criptografadas para que os donos possam usar Reveal ingest key depois, em Devices (com limite de taxa e auditoria). No probeharbor.dev isso está ativado. Se o segredo do cofre estiver ausente, crie/gire uma chave e copie-a do aviso de 30 minutos: não haverá nada para descriptografar depois.",
    },
    {
      question: "Onde encontro os schemas completos de requisição/resposta?",
      answer:
        "O openapi.yaml é a fonte de verdade. Guias mais longos ficam em probeharbor.dev/developers (ingestão, Grafana, webhooks). Tutoriais do produto: probeharbor.dev/about/ingest-and-webhooks e /about/adding-devices.",
    },
    {
      question: "O que é a API do claim puck?",
      answer:
        "Endpoints de sessão complementar em /api/pucks (register, claim/start, claim/finish), além de GET/PUT /api/bays/{bay}/mood. Usados pelo claim puck RP2040-Zero e pelo Bay Buddy. Configuração: probeharbor.dev/claim-puck. Detalhes em /docs/api#claim-puck.",
    },
  ],
  claimPuck: [
    {
      question: "O que é um claim puck do ProbeHarbor?",
      answer:
        "Um Waveshare RP2040-Zero rodando o firmware claim-puck. Ele comprova a presença física quando você reivindica uma baia (botão no GP4) e depois mostra os humores de congelamento/alagamento do Bay Buddy no LED. Não é uma sonda de temperatura. Para um DS18B20 com Wi-Fi no Pico W / Pico 2 W, veja probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Preciso do Bay Buddy?",
      answer:
        "O Bay Buddy é a forma mais fácil de reivindicar e controlar o puck depois de entrar na conta. Você também pode usar a CLI no repositório probeharbor-claim-puck com acesso complementar e tokens de atualização.",
    },
    {
      question: "É a mesma coisa que o Claims pack?",
      answer:
        "Não. O Claims pack é um PDF imprimível de evidências para o seguro, em probeharbor.dev/claims-pack. O claim puck é uma chave física de presença e uma luz de humor.",
    },
    {
      question: "Onde estão os outros acessórios?",
      answer:
        "Sinalizador de alerta, contatos de porta/vazamento/energia, etiquetas do kit, kit de fixação de sondas e case do puck: probeharbor.dev/accessories.",
    },
  ],
  accessories: [
    {
      question: "Os acessórios substituem uma sonda de congelamento?",
      answer:
        "Não. Os acessórios são complementos (luzes de humor, comprovação de presença), sensores de contato (porta, vazamento, energia) e peças do kit (etiquetas, suportes, cases). A temperatura ainda precisa de uma sonda, como o kit de congelamento ESP32 (DS18B20, DHT22 ou um sensor I²C), instalado pelo gravador web em probeharbor.dev/flash.",
    },
    {
      question: "Qual acessório devo comprar primeiro?",
      answer:
        "Depois de uma sonda de congelamento funcionando: claim puck + Bay Buddy para humores na mesa, ou um leak puck embaixo do aquecedor de água. As etiquetas do kit e o kit de fixação de sondas ajudam em qualquer instalação.",
    },
    {
      question: "Onde está a lista de peças do kit de congelamento?",
      answer:
        "Lista de materiais com ESP32 + DS18B20 à prova d'água e links de compra na Adafruit e na Amazon: probeharbor.dev/about/esp32-freeze-kit. Catálogo de acessórios: probeharbor.dev/accessories.",
    },
    {
      question: "Os links de compra da Amazon incluem tags de afiliado?",
      answer:
        "Quando configuradas, as URLs da Amazon podem incluir uma tag do programa Associados. Os links da Adafruit são diretos. O ProbeHarbor pode receber comissão por compras qualificadas na Amazon, sem custo extra para você.",
    },
  ],
  apps: [
    {
      question: "Os apps complementares medem temperatura?",
      answer:
        "Não. Android, Desktop, Bay Buddy e o PWA são clientes da sua conta ProbeHarbor. As sondas ESP/Arduino (ou feeds HTTPS) enviam as leituras; os apps entram na conta e as exibem.",
    },
    {
      question: "Qual app devo instalar primeiro?",
      answer:
        "Celular: o app complementar para Android ou o PWA. Painel completo na mesa: ProbeHarbor Desktop. Humor de congelamento/alagamento num relance em um segundo monitor: Bay Buddy. Catálogo: probeharbor.dev/apps.",
    },
    {
      question: "Onde estão os acessórios de hardware?",
      answer:
        "Claim puck, placas de vazamento, contatos de porta e suportes ficam em probeharbor.dev/accessories, separados dos apps complementares.",
    },
  ],
  alertBeacon: [
    {
      question: "O que é um sinalizador de alerta?",
      answer:
        "Uma luz de humor NeoPixel mais forte, controlada pela mesma API de humor da baia do Bay Buddy que o claim puck. Ela não mede temperatura. Configuração: probeharbor.dev/alert-beacon.",
    },
    {
      question: "Ainda preciso de um claim puck?",
      answer:
        "Use um claim puck (ou a CLI) uma vez para vincular a baia. Depois, o sinalizador pode compartilhar o caminho serial de controle do humor.",
    },
    {
      question: "O sinalizador pode substituir os alertas por SMS ou e-mail?",
      answer:
        "Não. Ele é uma luz de humor para ver num relance. As notificações de congelamento e alagamento continuam vindo dos canais em Dashboard → Alerts.",
    },
  ],
  doorPuck: [
    {
      question: "O que o puck de contato de porta envia?",
      answer:
        "JSON como {\"door1\":true} quando aberta. Sketch: sketches/arduino/door_contact_ingest. Guia: probeharbor.dev/door-puck.",
    },
    {
      question: "Uma porta aberta dispara o SMS de congelamento sozinha?",
      answer:
        "Não. Os sensores de porta alimentam o humor de corrente de ar e regras de alerta personalizadas opcionais. O SMS de congelamento continua vindo dos limites de temperatura de uma sonda.",
    },
    {
      question: "Qual microcontrolador o exemplo usa?",
      answer:
        "ESP32 com POST HTTPS via Wi-Fi, o mesmo caminho do kit de congelamento. Ligue um reed switch magnético ao GPIO4 usando o pull-up da placa.",
    },
  ],
  leakPuck: [
    {
      question: "O que o puck de contato de vazamento envia?",
      answer:
        "JSON como {\"leak1\":true} quando molhado. Chaves de alagamento/vazamento disparam alerta automaticamente quando molhadas, desde que os alertas estejam ativados. Guia: probeharbor.dev/leak-puck.",
    },
    {
      question: "Vazamento e temperatura podem usar a mesma chave de dispositivo?",
      answer:
        "Sim. Faça POST de temp1 e leak1 na mesma URL de ingestão, ou use dispositivos push separados por zona.",
    },
    {
      question: "Onde devo colocar as placas?",
      answer:
        "Embaixo de aquecedores de água, abrandadores ou bandejas de máquina de lavar. Mantenha o ESP32 seco e em local elevado; só as placas de contato ficam no chão.",
    },
  ],
  powerNudge: [
    {
      question: "O que o aviso de queda de energia envia?",
      answer:
        "JSON como {\"power1\":false} quando a energia da rede/USB monitorada cai. O ESP32 que reporta deve ficar ligado a um nobreak. Guia: probeharbor.dev/power-nudge.",
    },
    {
      question: "E se a sonda de congelamento também ficar sem energia?",
      answer:
        "A detecção de leituras desatualizadas cobre o silêncio. O aviso de energia serve para um evento power1 explícito enquanto o dispositivo que reporta continua online.",
    },
    {
      question: "Preciso de uma regra de alerta personalizada?",
      answer:
        "É opcional. Sensores de energia podem acionar regras personalizadas em Alerts; caso contrário, use os cartões de energia do Overview e os avisos de sonda desatualizada.",
    },
  ],
  kitLabels: [
    {
      question: "O ProbeHarbor vende adesivos com QR code?",
      answer:
        "Não. Baixe o SVG em Devices depois de criar/girar a chave, imprima em etiquetas à prova d'água ou grave a URL de ingestão em uma tag NFC. Guia: probeharbor.dev/kit-labels.",
    },
    {
      question: "NFC é seguro em uma porta de acesso público?",
      answer:
        "Não. A tag guarda a URL de ingestão. Mantenha as etiquetas junto ao kit ou dentro da área de serviço; gire a chave se uma se perder.",
    },
    {
      question: "Por quanto tempo o QR code na tela vale?",
      answer:
        "Cerca de 30 minutos depois de criar/girar a chave em Devices. Reabra o aviso ou baixe o SVG se ele expirar. Passo a passo: probeharbor.dev/about/kit-qr-onboarding.",
    },
  ],
  probeMountKit: [
    {
      question: "O que é o kit de fixação de sondas?",
      answer:
        "Uma lista de materiais com abraçadeiras, presilhas para cano, fitas adesivas, pull-up de 4,7k e fixação de um DS18B20 à prova d'água, não um kit de marca com envio direto. probeharbor.dev/probe-mount-kit.",
    },
    {
      question: "Ainda preciso da página do kit de congelamento ESP32?",
      answer:
        "Sim, para a fiação da placa + sonda e o download do sketch. O kit de fixação é a lista de materiais da instalação física; o kit de congelamento é o caminho da eletrônica: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Onde deve ficar a ponta da sonda?",
      answer:
        "Prefira contato com o metal do cano ou com a ponta isolada, em vez de deixá-la solta em uma porta ensolarada. Mantenha o microcontrolador seco; só a ponta de aço inox deve ficar em porões úmidos.",
    },
  ],
  claimPuckCase: [
    {
      question: "Preciso de um case para o claim puck?",
      answer:
        "É opcional. Um gabinete impresso, um botão tátil e um difusor de LED deixam o RP2040-Zero seguro para a mesa. O firmware e a API de claim continuam iguais. probeharbor.dev/claim-puck-case.",
    },
    {
      question: "Um case muda a API de claim?",
      answer:
        "Não. O mesmo fluxo de claim do Bay Buddy e os mesmos endpoints /api/pucks. O case só muda o acabamento físico e a difusão do LED.",
    },
    {
      question: "E se eu quiser uma luz mais forte no corredor?",
      answer:
        "Use um sinalizador de alerta com barra NeoPixel em vez de forçar o minúsculo LED do Zero: probeharbor.dev/alert-beacon.",
    },
  ],
  homeAssistant: [
    {
      question: "Existe uma integração oficial com o Home Assistant?",
      answer:
        "Sim: uma integração personalizada do HACS em github.com/doodersrage/probeharbor-home-assistant. Ela consulta um link de compartilhamento e cria sensores/sensores binários automaticamente. O Free inclui um link ao vivo para a família; o Pro adiciona escopos de histórico/métricas e webhooks de entrada para soneca. Guia de instalação: probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Preciso do Pro para a integração do HACS?",
      answer:
        "Um link de compartilhamento ao vivo basta para consultar os sensores. O Free inclui um link ao vivo para a família. O Pro libera escopos de histórico/métricas, links sem expiração e serviços de webhook de entrada (soneca, férias, status) em Dashboard → Share. O push via thermaltrace.push usa a chave de ingestão de qualquer dispositivo push.",
    },
    {
      question: "A consulta do HACS atrasa os alertas de congelamento ou vazamento?",
      answer:
        "Por padrão, o HACS consulta o link de compartilhamento a cada 5 minutos (configurável). Os SMS/e-mails/push de congelamento e vazamento do ProbeHarbor continuam disparando imediatamente pelo caminho de ingestão push da sua sonda. Use o push nativo do ESP/Arduino (ou uma ponte MQTT→HTTPS) para limites críticos e contatos molhados; mantenha o HACS para entidades e automações locais.",
    },
    {
      question: "O OAuth do Nest ou do Ecobee funciona para o contexto interno?",
      answer:
        "No probeharbor.dev, casas no Pro podem conectar o Nest em Dashboard → Temperature quando o OAuth do Nest está configurado. O cadastro de desenvolvedores do Ecobee costuma estar fechado: use o Plano B do HA (thermaltrace.push do current_temperature do climate + Indoor reference). Para quem hospeda por conta própria: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "Posso enviar o JSON de sensores REST do HA sem a integração do HACS?",
      answer:
        "Sim. O ProbeHarbor detecta automaticamente respostas REST do Home Assistant ({ state, attributes }) no POST /api/ingest/<key> e em feeds pull. Mapeie a chave de sonda state em Devices. Arrays JSON SenML também são aceitos. Exemplos: probeharbor.dev/api/feeds/example?format=homeassistant",
    },
    {
      question: "Posso usar o ProbeHarbor com MQTT e Home Assistant juntos?",
      answer:
        "Sim: o padrão comum mantém o Mosquitto/ESPHome na sua rede local e espelha tópicos selecionados para o ProbeHarbor via HTTPS (POST /api/ingest/mqtt). O ProbeHarbor cuida dos SMS/e-mails externos de congelamento e vazamento e do histórico; o HA mantém as automações locais. Receita: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "Como os alertas de congelamento e vazamento chegam ao Home Assistant?",
      answer:
        "Configure no ProbeHarbor um webhook de saída do Pro apontando para a URL de webhook do seu HA, ou importe o blueprint probeharbor_webhook.yaml de probeharbor.dev/ha/probeharbor_webhook.yaml. Se você definir um segredo de assinatura do webhook, verifique o cabeçalho HMAC X-Signature antes de agir sobre o payload.",
    },
  ],
  matter: [
    {
      question: "Este é um produto oficial do Apple Home / Matter?",
      answer:
        "Não. O probeharbor-matter é um plugin DIY para o Matterbridge e não tem certificação da CSA. Ele serve bem para uso doméstico; confirme isso ao parear. Guia: probeharbor.dev/integrations/matter.",
    },
    {
      question: "Preciso de um app para iPhone?",
      answer:
        "Não. Pareie o Matterbridge uma vez e o Apple Home (e o Google Home / Alexa) passam a mostrar os sensores. A ponte roda em um Pi, NAS ou PC sempre ligado na sua rede local, não no Cloudflare Workers.",
    },
    {
      question: "Preciso do Pro?",
      answer:
        "Um link de compartilhamento ao vivo para a família do Free basta para temperatura, umidade, vazamento, porta, energia e movimento. O Pro adiciona o interruptor opcional de soneca do Matter (webhook de entrada) e os escopos de compartilhamento de histórico/métricas.",
    },
    {
      question: "A consulta do Matter atrasa o SMS de congelamento?",
      answer:
        "Não. Os SMS/e-mails/push de congelamento e vazamento continuam disparando pela ingestão push do ProbeHarbor. A ponte Matter consulta o link de compartilhamento a cada 1–5 minutos para a visão rápida no Home e para automações, a mesma ideia da integração do HACS.",
    },
    {
      question: "Posso rodar o Matter e o Home Assistant juntos?",
      answer:
        "Sim. Os dois podem consultar o mesmo link de compartilhamento. Use o HACS para entidades do HA e o plugin do Matterbridge para o Apple Home: probeharbor.dev/integrations/home-assistant e probeharbor.dev/integrations/matter.",
    },
  ],
  nodeRed: [
    {
      question: "Preciso do Node-RED se já tenho o Home Assistant?",
      answer:
        "Não. O HACS pode consultar um link de compartilhamento para criar entidades. Use o Node-RED quando você já espelha tópicos do Mosquitto com flows e quer fazer POSTs HTTPS para o ProbeHarbor sem expor o broker. Guia: probeharbor.dev/integrations/node-red.",
    },
    {
      question: "Onde está o arquivo do flow?",
      answer:
        "Baixe probeharbor.dev/nodered/mqtt-to-probeharbor.json: uma aba de temperatura mais uma aba opcional de portão da garagem, limitada a cerca de um POST por minuto.",
    },
    {
      question: "O ProbeHarbor é um broker MQTT?",
      answer:
        "Não. Mantenha o Mosquitto local. O Node-RED (ou o rest_command do HA) faz POST para /api/ingest/mqtt com a chave do seu dispositivo push.",
    },
  ],
  automation: [
    {
      question: "IFTTT, Zapier ou n8n?",
      answer:
        "O mesmo JSON do webhook de saída do Pro. O IFTTT é o mais simples para notificações no celular e Sheets. Zapier/Make permitem Zaps mais ricos, com várias etapas. O n8n é auto-hospedado. Receitas: probeharbor.dev/integrations/automation e probeharbor.dev/about/zapier-make-recipes.",
    },
    {
      question: "Posso registrar os alertas de congelamento no Google Sheets?",
      answer:
        "Sim. Importe probeharbor.dev/n8n/probeharbor-alert-to-sheets.json ou use as ações do Sheets no IFTTT/Zapier com a URL do webhook de saída.",
    },
    {
      question: "O Notion pode receber os mesmos alertas?",
      answer:
        "Sim, pelo nó do Notion no n8n ou pelo Make: mapeie title, kind, body e sent_at a partir do payload do webhook.",
    },
  ],
  influx: [
    {
      question: "Preciso de uma nova API do ProbeHarbor para o Influx?",
      answer:
        "Não. O Telegraf coleta do endpoint Prometheus já existente do Pro, GET /api/v1/metrics. Configuração de exemplo: probeharbor.dev/telegraf/probeharbor.conf. Guia: probeharbor.dev/integrations/influx.",
    },
    {
      question: "Isso substitui o Grafana?",
      answer:
        "Não. Use o Grafana para painéis sobre o Prometheus; use Influx/VictoriaMetrics quando quiser um banco de séries temporais de longo prazo ou já tiver uma stack Influx. Mesmo nome de métrica: probeharbor_sensor_value.",
    },
    {
      question: "E os sensores booleanos de vazamento/porta?",
      answer:
        "As métricas do Prometheus são apenas numéricas. Para booleanos, use o JSON de compartilhamento, o HACS ou a ponte Matter.",
    },
  ],
  smartThings: [
    {
      question: "Existe um app oficial Cloud-to-Cloud para o SmartThings?",
      answer:
        "Não. Use o plugin do Matterbridge (probeharbor.dev/integrations/matter) para que o SmartThings adicione os sensores da garagem via Matter na sua rede local, o mesmo caminho do Apple Home.",
    },
    {
      question: "O SMS de congelamento continua funcionando?",
      answer:
        "Sim. Os alertas críticos continuam na ingestão push do ProbeHarbor e no SMS/e-mail do Pro. A consulta do Matter serve para a visão rápida e as automações do SmartThings.",
    },
    {
      question: "Devo trocar meus sensores Govee por isto?",
      answer:
        "Só se você quiser uma cobertura da garagem no nível de um ESP e histórico exportável. Para quartos, os sensores Govee/SmartThings ainda podem sair na frente no preço: veja probeharbor.dev/compare/govee.",
    },
  ],
  android: [
    {
      question: "O app para Android mede a temperatura das sondas?",
      answer:
        "Não. O celular é um cliente complementar. Os sensores ESP/Arduino (ou feeds JSON HTTPS) enviam as leituras ao ProbeHarbor; o app entra na conta e exibe esses dados.",
    },
    {
      question: "Quando o ProbeHarbor estará no Google Play?",
      answer:
        "A página no Google Play está em análise. Compile ou instale manualmente a partir de github.com/doodersrage/probeharbor-android, ou use o painel web / PWA no Chrome do Android até o link da loja ficar disponível.",
    },
    {
      question: "Minha conta web funciona no app para Android?",
      answer:
        "Sim. Valem o mesmo login do ProbeHarbor, as mesmas casas, dispositivos e configurações de alerta. O push no Android usa o Firebase Cloud Messaging, além do Web Push do navegador.",
    },
    {
      question: "Como fico sabendo quando o app for lançado?",
      answer:
        "Use o formulário de contato com topic=android (link em /android) e peça um aviso de lançamento. Também anunciamos novidades no site e nos repositórios do GitHub.",
    },
  ],
  bayBuddy: [
    {
      question: "O que é o Bay Buddy?",
      answer:
        "O Bay Buddy é o app complementar de desktop do ProbeHarbor (Windows, macOS, Linux). Ele mostra num relance os humores de congelamento e alagamento de um ambiente depois que você entra com a sua conta ProbeHarbor. Não é um segundo painel completo.",
    },
    {
      question: "Onde baixo o Bay Buddy?",
      answer:
        "Nas GitHub Releases do probeharbor-bay-buddy: Linux AppImage/deb/rpm, Windows MSI e macOS DMG. Comece em probeharbor.dev/bay-buddy.",
    },
    {
      question: "O Bay Buddy substitui o painel web?",
      answer:
        "Não. Dispositivos, alertas, histórico, sinistros e configurações da casa continuam no probeharbor.dev, no app para Android / PWA ou no ProbeHarbor Desktop (probeharbor.dev/desktop). O Bay Buddy é uma visão rápida do humor da baia que você já monitora.",
    },
    {
      question: "O Bay Buddy pode controlar um claim puck?",
      answer:
        "Sim. Depois de conectar, o painel Claim puck pode registrar e reivindicar um RP2040-Zero e então controlar o LED dele a partir de /api/bays/{bay}/mood. Configuração: probeharbor.dev/claim-puck.",
    },
  ],
  desktop: [
    {
      question: "O que é o ProbeHarbor Desktop?",
      answer:
        "O ProbeHarbor Desktop é o painel complementar nativo para Windows, macOS e Linux da sua conta ProbeHarbor. Ele cobre leituras ao vivo, histórico, alertas, dispositivos, casa, compartilhamento e portfólio, com a mesma conta dos apps web e Android. O PC não é um sensor.",
    },
    {
      question: "Onde baixo o ProbeHarbor Desktop?",
      answer:
        "Nas GitHub Releases do probeharbor-desktop: Linux AppImage/deb/rpm, Windows MSI e macOS DMG. Comece em probeharbor.dev/desktop.",
    },
    {
      question: "Qual a diferença entre o Desktop e o Bay Buddy?",
      answer:
        "O Bay Buddy é uma visão rápida do humor de congelamento/alagamento de um ambiente (e do claim puck). O ProbeHarbor Desktop é o cliente de painel completo. Mantenha os dois se quiser a visão rápida do humor e um painel nativo.",
    },
    {
      question: "Minha conta web funciona no ProbeHarbor Desktop?",
      answer:
        "Sim. Ao conectar, o probeharbor.dev abre no seu navegador, incluindo MFA se estiver ativado, e depois a sessão é devolvida ao app por um callback em localhost.",
    },
    {
      question: "O Desktop tem notificações e modo quiosque?",
      answer:
        "Sim. No Pro, o Desktop pode mostrar notificações do sistema para novos eventos de alerta enquanto o app está aberto (Account → Desktop notifications). O modo quiosque com leituras ao vivo em tela cheia fica disponível na barra superior, para telas na oficina.",
    },
  ],
} satisfies MarketingFaqOverlay;
