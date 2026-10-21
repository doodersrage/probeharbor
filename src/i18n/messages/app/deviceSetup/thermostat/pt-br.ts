import type { DeviceSetupThermostatMessages } from "./en";

const ptBr: DeviceSetupThermostatMessages = {
  indoor: {
    title: "Referência interna",
    introHtml:
      "Escolha uma sonda de temperatura para representar o ar interno da <strong>casa</strong> quando você não tiver o Nest conectado, por exemplo um ESP32 no corredor ou uma leitura enviada pelo Home Assistant (Ecobee, Honeywell etc.). Os gráficos de Visão geral e Histórico usam essa referência para comparar casa e sonda.",
    saved: "Referência interna salva.",
    sensorLabel: "Sensor de referência",
    noneOption: "Nenhum, usar só o termostato",
    optionLabel: "{label} ({device})",
    save: "Salvar",
    configured: "Esta casa tem uma sonda de referência interna configurada.",
    notSelected: "Nenhuma referência interna selecionada.",
    noOptionsHtml:
      'Adicione primeiro um sensor de temperatura, por exemplo enviando do Home Assistant com <code class="text-xs">thermaltrace.push</code> ou um ESP no corredor. Veja o <a class="text-link" href="/integrations/home-assistant#indoor-temperature">guia de temperatura interna do HA</a>.',
  },
  thermostat: {
    title: "Termostato",
    intro:
      "Conecte o termostato da casa para ver a leitura e o ponto de ajuste dele ao lado desta sonda e adicionar esse contexto aos alertas de congelamento.",
    connected: "{provider} conectado.",
    disconnected: "{provider} desconectado.",
    errors: {
      state_mismatch: "Essa tentativa de conexão expirou: tente de novo.",
      denied: "A conexão foi cancelada.",
      not_configured:
        "Este provedor ainda não está configurado nesta instalação.",
      exchange_failed: "Não foi possível concluir a conexão: tente de novo.",
      save_failed:
        "Conectado, mas não foi possível salvar a conexão: tente de novo.",
      generic: "Algo deu errado ao conectar seu termostato.",
    },
    sdmDisabledHtml:
      "O Nest está conectado, mas a <strong>Smart Device Management API</strong> não está ativada no seu projeto do Google Cloud. Ative em APIs e serviços, aguarde um minuto e recarregue esta página.",
    enableSdm: "Ativar a SDM API",
    readingUnavailable: "Leitura indisponível",
    setTo: ", ajustado para {temp}",
    modes: {
      heat: "Aquecimento",
      cool: "Resfriamento",
      heatcool: "Aquecimento/resfriamento",
      off: "Desligado",
      auto: "Automático",
      auxheatonly: "Só aquecimento auxiliar",
    },
    noLiveReading:
      "Conectado, mas não foi possível obter uma leitura ao vivo agora.",
    notConnected: "Não conectado",
    ecobeeClosedHtml:
      'O cadastro de desenvolvedores da Ecobee está fechado: use o <a class="text-link" href="/integrations/home-assistant#indoor-temperature">Home Assistant</a> para enviar a temperatura interna e depois escolha em <a class="text-link" href="#indoor-reference">Referência interna</a> acima.',
    disconnect: "Desconectar",
    connect: "Conectar",
    unavailable: "Indisponível",
    ownerOnly: "Só proprietário/membro",
  },
};

export default ptBr;
