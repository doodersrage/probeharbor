import type { DevicesListMessages } from "./en";

const ptBr: DevicesListMessages = {
  list: {
    title: "Dispositivos ({count})",
    subtitle: "Do pior para o melhor. Abra um dispositivo para renomeá-lo, definir o espaço ou corrigir os sensores.",
    addDevice: "Adicionar dispositivo",
    warmHint:
      "marca {gap}°F a mais que suas outras sondas. Se esse sensor estiver colado na placa, afaste-o alguns centímetros pelos fios: placas ESP32 esquentam e distorcem a leitura.",
    unplaced: {
      one: "{count} dispositivo não tem espaço definido, então a cobertura e os alertas não conseguem dizer onde ele está.",
      other: "{count} dispositivos não têm espaço definido, então a cobertura e os alertas não conseguem dizer onde eles estão.",
    },
    unplacedBulk: "Use Selecionar vários abaixo para definir um lote de uma vez.",
    unplacedSingle: "Abra-o para definir um.",
    empty: "Nenhum dispositivo ainda.",
    emptyLink: "Conecte seu primeiro sensor",
    noSpace: "Sem espaço",
    push: "Push",
    pullFeed: "Feed de busca",
    disabled: "Desativado",
    health: {
      healthy: "Saudável",
      watch: "Atenção",
      at_risk: "Em risco",
      offline: "Offline",
    },
    noReading: "Sem leitura",
    firmwareUpdate: "Atualização de firmware disponível",
    never: "Nunca",
    battery: "{pct}% de bateria",
  },
  bulk: {
    summary: "Selecionar vários…",
    doThis: "Ação",
    ops: {
      set_space: "Definir espaço",
      enable: "Ativar",
      disable: "Desativar",
      delete: "Excluir",
    },
    space: "Espaço",
    spacePlaceholder: "Garagem",
    apply: "Aplicar aos selecionados",
    selectAll: "Selecionar todos",
    selectUnplaced: "Selecionar os sem espaço",
    selectSilent: "Selecionar {count} sem sinal há 30+ dias",
    noSpace: "sem espaço",
    disabled: "desativado",
    confirmDelete: {
      one: "Excluir {count} dispositivo? Isso não pode ser desfeito.",
      other: "Excluir {count} dispositivos? Isso não pode ser desfeito.",
    },
  },
  coverage: {
    title: "Cobertura de proteção",
    subtitle: "O que é monitorado em cada espaço, a partir dos sensores dos seus dispositivos.",
    noGaps: "Nenhuma lacuna encontrada.",
    gapCount: "{gaps} de {total} espaços têm uma lacuna.",
    caption: "Cobertura de monitoramento por espaço",
    spaceColumn: "Espaço",
    risks: {
      freeze: "Temperatura",
      leak: "Vazamento",
      door: "Porta",
      power: "Energia",
    },
    states: {
      live: "enviando dados",
      stale: "sem enviar dados",
      none: "não monitorado",
    },
    devices: { one: "{count} dispositivo", other: "{count} dispositivos" },
    legend:
      "✓ enviando dados · ! o sensor existe, mas não enviou dados recentemente · — não monitorado. Os espaços vêm da configuração de espaço de cada dispositivo.",
    unassigned: "Sem espaço definido",
    gaps: {
      unassigned: "Defina um espaço nesses dispositivos para acompanhar a cobertura por cômodo.",
      noTemperature: "Sem sonda de temperatura: os alertas de congelamento não cobrem este espaço.",
      staleTemperature: "A sonda de temperatura não enviou dados recentemente, então os alertas de congelamento não podem disparar aqui.",
      staleLeak: "O sensor de vazamento não enviou dados recentemente.",
      noLeakWetSpace: "Não há sensor de vazamento aqui, e esse tipo de espaço costuma ter encanamento.",
      staleDoor: "O sensor de porta não enviou dados recentemente.",
      stalePower: "O sensor de energia não enviou dados recentemente.",
    },
  },
};

export default ptBr;
