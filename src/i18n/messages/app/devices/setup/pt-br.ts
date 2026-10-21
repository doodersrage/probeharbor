import type { DevicesSetupMessages } from "./en";

const ptBr: DevicesSetupMessages = {
  firstRun: {
    title: "Conecte seu primeiro sensor",
    subtitle: "Escolha o que você tem hoje. Cada caminho termina com uma leitura ao vivo; os alertas de congelamento e vazamento vêm logo depois.",
    viewOnly: "Somente leitura: peça a um proprietário para adicionar um dispositivo.",
    limitReached: "Limite de dispositivos atingido.",
    limitUpgrade: "Faça upgrade para ter mais dispositivos",
    haveSensors: {
      title: "Já tenho sensores",
      copy: "Home Assistant, ESPHome ou um broker MQTT. Criamos um dispositivo e entregamos um trecho pronto para copiar e colar com a chave dele. Cerca de 5 minutos.",
    },
    haveBoard: {
      title: "Tenho uma placa para gravar",
      copy: "Um ESP32 com sensor DS18B20, DHT22 ou I²C: instale o firmware por USB direto deste navegador, sem Arduino IDE. Pico W e Arduino recebem um sketch já preenchido.",
      create: "Criar dispositivo e gravar",
      otherBoards: "Guias para outras placas",
      browserFlasher: "Gravador no navegador (beta)",
      espOptions: "Opções para gravar o ESP32",
      cellular: "Celular",
    },
    noHardware: {
      title: "Ainda não tenho hardware",
      copy: "Veja o painel funcionando agora com um feed de exemplo ao vivo e depois monte o kit anticongelamento ESP32 (cerca de US$ 25) quando estiver pronto.",
      demo: "Experimente com um feed de demonstração",
      kitParts: "Lista de peças do kit anticongelamento ESP32",
    },
    also: "Também:",
    jsonFeed: "Feed JSON via HTTPS",
    leakPucks: "Leak pucks",
    httpApi: "API HTTP",
  },
  funnel: {
    title: "Você está recebendo dados",
    firstPost: "Primeiro POST recebido",
    alertDone: "Alerta de congelamento configurado",
    alertTodo: "Defina o limite de congelamento em °F + e-mail e envie um teste",
    shareLink: "Compartilhe um link ao vivo com a família",
    optional: ": opcional",
    renameHtml:
      'Os nomes dos sensores estão bons assim. <a class="text-link" href="/dashboard/devices?view=setup&rename_sensors=1">Renomeie depois</a> no cartão do dispositivo, se quiser.',
    setAlert: "Definir congelamento + e-mail",
    sendTest: "Enviar um alerta de teste",
    overview: "Visão geral",
    guides: "Guias de configuração de hardware",
    kitQr: "QR do kit",
    cellular: "Celular",
  },
  firstAlert: {
    title: "Configure seu primeiro alerta de frio + água",
    subtitle:
      "Um limite e um e-mail, sem sair de Dispositivos. Contatos de alagamento/vazamento molhados disparam alerta automaticamente assim que os alertas estão ativados (e ignoram o adiamento e o modo férias). Adicione Telegram, Discord e outros depois.",
    savedAndTested: "Alerta de frio + água salvo e teste enviado, confira sua caixa de entrada.",
    saved: "Alerta de frio + água salvo.",
    testFailed:
      "Configurações salvas, mas não foi possível entregar o teste. Confirme o endereço de e-mail ou tente de novo em Alertas.",
    freezeLabel: "Limite de congelamento (°F)",
    emailLabel: "E-mail de alertas",
    emailPlaceholder: "voce@exemplo.com",
    saveAndTest: "Salvar + enviar teste",
    saveOnly: "Só salvar",
    fullSettings: "Todas as configurações de alertas",
  },
  integrations: {
    title: "Outras formas de conectar",
    subtitle:
      "A ingestão push de ESP32, Pico W, STM32, CH32V ou assembly AVR é o padrão. Expanda um caminho abaixo para ver a configuração pronta para copiar e colar.",
    claimPuck: {
      summary: "Claim puck (RP2040-Zero)",
      stepsHtml: [
        "Grave o firmware do claim-puck e ligue um botão do GP4 ao GND.",
        "Defina os rótulos <code>space</code> dos dispositivos com o nome da vaga que você vai reservar (ex.: garage).",
        'No <a class="text-link" href="/bay-buddy">Bay Buddy</a>, conecte sua conta, plugue o puck, reserve a vaga e, se quiser, controle o LED de ambiente.',
      ],
      productPage: "Página do produto",
      caseDiffuser: "Case / difusor",
      claimApi: "API de reserva",
    },
    contacts: {
      summary: "Contatos de porta / vazamento / energia",
      stepsHtml: [
        "Grave os sketches de ESP32 em <code>sketches/arduino/door_contact_ingest</code>, <code>leak_contact_ingest</code> ou <code>power_sense_ingest</code>.",
        "Envie os booleanos <code>door1</code> / <code>leak1</code> / <code>power1</code> por POST para sua URL de ingestão.",
      ],
      doorPuck: "Door puck",
      leakPuck: "Leak puck",
      powerNudge: "Power nudge",
      allAccessories: "Todos os acessórios",
    },
    beacon: {
      summary: "Sinalizador de alerta e peças do kit",
      bodyHtml:
        '<a class="text-link" href="/alert-beacon">Sinalizador de alerta</a> NeoPixel de ambiente, <a class="text-link" href="/kit-labels">etiquetas QR / NFC</a> e <a class="text-link" href="/probe-mount-kit">kit de suporte para sondas</a>: complementos e produtos, não sondas anticongelamento.',
    },
    homeAssistant: {
      summary: "REST do Home Assistant",
      stepsHtml: [
        "Crie um dispositivo push acima e copie a URL de ingestão.",
        "No HA, use um sensor <code>rest</code> ou uma automação com <code>resource: https://probeharbor.dev/api/ingest/YOUR_KEY</code>.",
        'Envie o JSON da entidade por POST. O ProbeHarbor lê <code>friendly_name</code> para os rótulos. <a class="text-link" href="/integrations/home-assistant">Guia completo do HA</a>',
      ],
    },
    mqtt: {
      summary: "Ponte MQTT → HTTPS",
      stepsHtml: [
        "Mantenha o Mosquitto na sua rede local. O ProbeHarbor não é um broker MQTT.",
        'Importe o fluxo do Node-RED em <a class="text-link" href="/dashboard/share/integrations#node-red">Integrações → Node-RED</a> ou rode a ponte em Python de <code>scripts/mqtt-bridge.py</code>.',
        "Defina <code>PROBEHARBOR_INGEST_KEY</code> com a chave do seu dispositivo push.",
        '<a class="text-link" href="/about/mqtt-bridge">Documentação da ponte MQTT</a>',
      ],
    },
    esphome: {
      summary: "ESPHome / Shelly na rede local",
      bodyHtml:
        "Aponte o <code>rest</code> do ESPHome ou o HTTP do Shelly para sua URL de ingestão, ou exponha JSON via HTTPS para um feed de busca.",
      recipes: "Receitas de ESPHome e Shelly",
    },
    ingestFormats: "Formatos de ingestão",
    allIntegrations: "Todas as integrações",
  },
};

export default ptBr;
