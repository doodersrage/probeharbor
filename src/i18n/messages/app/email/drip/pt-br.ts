import type { DripEmailMessages } from "./en";

const ptBr: DripEmailMessages = {
  day1: {
    subject: "Adicione sua primeira sonda ao ProbeHarbor",
    eyebrow: "Primeiros passos",
    preheader: "Crie uma chave de dispositivo, envie JSON por POST e os sensores são importados automaticamente — cerca de 10 minutos.",
    title: "Conecte sua primeira sonda",
    intro: "Boas-vindas ao ProbeHarbor. Sua conta gratuita está pronta — o próximo passo é ver uma leitura ao vivo na Visão geral.",
    paragraphs: [
      "Abra Dispositivos e escolha o que você tem. Cada caminho cria um dispositivo e entrega um trecho de código com a chave dele; os sensores são importados automaticamente na primeira leitura.",
    ],
    bullets: [
      "Sensores no Home Assistant, ESPHome ou MQTT: copie e cole o YAML ou um relay, cerca de 5 minutos",
      "Um ESP32, Pico W ou Arduino: baixe um sketch já preenchido com sua URL de ingestão",
      "Ainda sem hardware: com um clique você adiciona um feed de demonstração ao vivo para ver o painel funcionando",
    ],
    cta: "Abrir Dispositivos",
    secondaryCta: "Guia para adicionar dispositivos",
  },
  day3: {
    subject: "Ative os alertas de congelamento e vazamento antes da próxima surpresa",
    eyebrow: "Proteção contra congelamento e alagamento",
    preheader:
      "A maioria dos espaços sem climatização começa os alertas de congelamento por volta de 1 °C (34 °F) — e contatos de alagamento molhados avisam automaticamente quando os alertas estão ativos.",
    title: "Não espere a onda de frio ou um piso molhado",
    intro:
      "O ProbeHarbor avisa você quando a temperatura se aproxima do congelamento ou um contato de vazamento fica molhado — por e-mail e push agora, e também por SMS no Pro.",
    paragraphs: [
      "Defina um limite de congelamento na sua zona mais fria, ative os canais que você realmente confere e envie um teste enquanto está acordado. Quando puder, adicione um contato de alagamento (molhado/seco) na bandeja do aquecedor, na lavanderia ou no poço de drenagem.",
    ],
    bullets: [
      "Comece o alerta de congelamento entre 1–3 °C (34–38 °F) e ajuste depois de ver as mínimas da madrugada",
      "Ative a exceção ao horário silencioso para alertas de congelamento e alagamento",
      "Opcional: convide pessoas da casa para que mais alguém veja o aviso",
    ],
    cta: "Configurar alertas",
    secondaryCta: "Guia para ondas de frio",
  },
  day7: {
    subject: "Experimente o Pro grátis — SMS, webhooks e mais opções de compartilhamento",
    eyebrow: "Teste do Pro",
    preheader: "SMS, WhatsApp, compartilhamento do Pro e webhooks — teste grátis de 14 dias.",
    title: "Vá além com um teste grátis do Pro",
    intro:
      "Você já teve uma semana para conhecer o ProbeHarbor. O Pro adiciona os canais e as ferramentas de compartilhamento que fazem diferença às 2 da manhã. (O Free já inclui um link ao vivo para a família.)",
    paragraphs: ["Comece um teste de 14 dias em Preços — cancele quando quiser pelo portal de cobrança no painel."],
    bullets: [
      "Alertas de congelamento e vazamento por SMS e push no navegador",
      "Histórico, métricas e links de compartilhamento que nunca expiram, além de incorporações",
      "Webhooks de saída e até {maxDevices} dispositivos por imóvel",
    ],
    cta: "Comparar planos e começar o teste",
    secondaryCta: "Abrir painel",
  },
  day3Setup: {
    subject: "Ainda configurando? Três jeitos rápidos de chegar à primeira leitura",
    eyebrow: "Primeiros passos",
    preheader: "Home Assistant, um ESP32 gravado ou um feed de demonstração com um clique.",
    title: "Seu painel está esperando a primeira leitura",
    intro:
      "Nada foi enviado ainda. Escolha o que você tem hoje; cada opção leva poucos minutos em Dispositivos → Configuração.",
    paragraphs: [],
    bullets: [
      "Home Assistant, ESPHome ou MQTT: geramos o YAML ou o comando de relay com a sua chave",
      "ESP32 + DS18B20 (cerca de US$ 25): baixe um sketch com sua URL de ingestão já preenchida",
      "Ainda nada: adicione o feed de demonstração para ver gráficos e alertas funcionando antes de comprar peças",
    ],
    cta: "Abrir configuração de dispositivos",
    secondaryCta: "Peças do kit de congelamento com ESP32",
  },
  day7Setup: {
    subject: "O que você está tentando conectar?",
    eyebrow: "Ajuda na configuração",
    preheader: "Conte qual é seu sensor ou hub e indicamos o caminho mais curto.",
    title: "Travou na configuração? Conte o que você tem",
    intro:
      "Sua conta ainda não tem leituras. Se um sensor, hub ou placa não se encaixou em nenhum dos caminhos de configuração, mande uma mensagem contando o que você usa e ajudamos a fazer funcionar.",
    paragraphs: [
      "A temporada de congelamento está chegando. Uma única sonda perto do cano mais frio já basta para receber um alerta antes que seja tarde.",
    ],
    bullets: [],
    cta: "Pedir ajuda na configuração",
    secondaryCta: "Abrir configuração de dispositivos",
  },
  confirm: {
    subject: "Confirme seu e-mail para concluir a configuração do ProbeHarbor",
    eyebrow: "Falta um passo",
    preheader: "Sua conta aguarda a confirmação do e-mail; os links expiram, então peça um novo.",
    title: "Confirme seu e-mail para entrar",
    intro:
      "Você começou a criar uma conta ProbeHarbor, mas o endereço nunca foi confirmado, então o acesso continua bloqueado.",
    paragraphs: [
      "Os links de confirmação expiram. Peça um novo, clique nele e você chegará em Dispositivos, pronto para conectar o primeiro sensor (ou um feed de demonstração, se ainda não tiver hardware).",
    ],
    bullets: [],
    cta: "Enviar novo link de confirmação",
    secondaryCta: "Entrar",
  },
};

export default ptBr;
