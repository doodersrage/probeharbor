import type { DeviceDetailMessages } from "./en";

const ptBr: DeviceDetailMessages = {
  pushDevice: "Dispositivo push",
  pullFeed: "Feed consultado",
  subtitleWithSpace: "{space} · {source}",
  allDevices: "← Todos os dispositivos",
  notices: {
    deviceSaved: "Dispositivo salvo.",
    sensorsSaved: "Sensores salvos.",
    sensorDeleted: "Sensor excluído.",
    sensorAdded: "Sensor adicionado.",
    sensorReplaced: {
      one: "Sensor substituído: {count} leitura movida.",
      other: "Sensor substituído: {count} leituras movidas.",
    },
    saveError: "Não foi possível salvar. Confira o formulário e tente de novo.",
  },
  replaceErrors: {
    same_sensor: "Escolha dois sensores diferentes.",
    kind_mismatch: "Os dois sensores precisam ser do mesmo tipo (temperatura com temperatura).",
    sensor_not_found: "Um desses sensores não está mais neste imóvel.",
    failed: "Não foi possível substituir o sensor. Nada foi alterado.",
  },
  status: {
    title: "Status",
    health: "Saúde",
    healthHowSummary: "Como a pontuação é calculada",
    healthHow:
      "A pontuação mostra o problema mais grave encontrado, verificado nesta ordem: desativado (25) ou nunca visto (30); um sensor de vazamento molhado (10–20); sem envio há um dia (20) ou há 2 horas (45); leituras travadas (40); bateria em 15% ou menos (55) ou com previsão de 14 dias ou menos (60); Wi‑Fi no seu limite de sinal ou abaixo (65). Sem nada disso, está saudável (95).",
    batteryHow:
      "Os dias restantes supõem que a bateria continua caindo no ritmo dos últimos 7 dias. Só aparecem se ela caiu mais de 0,5% por dia em pelo menos meio dia.",
    lastSeen: "Visto por último",
    never: "Nunca",
    battery: "Bateria",
    wifiSignal: "Sinal do Wi-Fi",
    firmware: "Firmware",
    updateTo: "Atualizar para {version}",
    tlsUnverified:
      "Esta sonda não consegue verificar o certificado do ProbeHarbor, então a conexão dela não está protegida contra adulteração. As leituras continuam chegando. Normalmente a autoridade certificadora do site mudou; uma atualização de firmware resolve.",
    lastCrash: "Última falha",
    crashWhen: "Relatada {age}",
    crashIn: "Parou em {fn}",
    crashAt: "Parou em {addr}",
    crashCause: "Causa",
    crashTask: "Tarefa",
    crashHelp:
      "A sonda reiniciou depois disso e continuou funcionando. Se acontecer de novo, relate com os detalhes abaixo.",
    crashDetails: "Detalhes para um relato de erro",
    crashBuild: "Build que falhou: {version} ({elf})",
    crashBuildUnknown: "Build que falhou {elf}: sem nomes de funções",
    crashStackNote:
      "No ESP32-C3 estas são prováveis funções chamadoras encontradas na pilha, não uma cadeia de chamadas exata.",
    crashWatchdog: "Reiniciada pelo watchdog: a sonda parou de responder",
    crashWatchdogNote:
      "O watchdog reinicia a sonda quando o loop principal fica parado por um minuto. Os endereços abaixo mostram onde o chip estava quando o watchdog disparou (geralmente a tarefa ociosa), não o código que parou.",
    crashReport: "Relatar no GitHub",
    state: "Estado",
    disabled: "Desativado: as leituras são ignoradas",
    noReadingsYet:
      "Ainda não há leituras. Configure o dispositivo com a URL de ingestão dele (veja Conexão abaixo); os sensores aparecem no primeiro envio.",
  },
  chart: {
    title: "Últimas 24 horas",
    fullHistory: "Histórico completo",
    empty: "Nenhuma leitura de temperatura ou umidade nas últimas 24 horas.",
    error: "Não foi possível carregar o gráfico. O histórico completo pode funcionar.",
  },
  phoneSetup: {
    title: "Configurar pelo celular",
    intro:
      "Para uma sonda que mostra a rede ProbeHarbor-Setup (nova, ou depois de segurar BOOT por 5 segundos). Escaneie com a câmera do celular.",
    copyKey: "Abra esta página no celular, mostre a chave do dispositivo e toque em Copiar.",
    joinNetworkCode:
      "Entre na rede {network} da sonda. A página de configuração abre: escolha seu Wi-Fi, digite o código de pareamento onde ela pede a chave do dispositivo e Salve.",
    joinNetwork:
      "Entre na rede {network} da sonda. A página de configuração abre: escolha seu Wi-Fi, cole a chave e Salve.",
    hint: "Se a página não abrir, acesse 192.168.4.1. A sonda fecha a rede após 3 minutos sem uso; reinicie-a para tentar de novo.",
  },
  pairing: {
    button: "Parear uma sonda",
    newCode: "Novo código",
    making: "Criando um código…",
    hint: "Digite este código onde a sonda pede a chave do dispositivo: na página de configuração (celular) ou no /flash. Ele vale uma só vez.",
    validUntil: "Válido até {time}",
    expired: "Este código expirou. Crie um novo.",
    error: "Não foi possível criar um código. Tente de novo.",
    phoneStep: "Toque em Parear uma sonda acima e mantenha o código à vista.",
    waiting: "Aguardando a sonda usar o código…",
    paired: "Pareada ✓ com {chip} às {time}",
    pairedHint: "A sonda já usa a nova chave; a próxima leitura aparece aqui em até um minuto.",
    replaced: "Um código mais novo substituiu este.",
  },
  healthLabels: {
    healthy: "Saudável",
    watch: "Atenção",
    at_risk: "Em risco",
    offline: "Offline",
  },
  healthDetails: {
    disabled: "Dispositivo desativado",
    waiting: "Aguardando a primeira leitura",
    floodWet: "Contato de alagamento / vazamento molhado",
    noData: {
      one: "Sem dados há {count} dia, verifique a energia/Wi‑Fi",
      other: "Sem dados há {count} dias, verifique a energia/Wi‑Fi",
    },
    stale: "Dados da sonda desatualizados, verifique a energia/Wi‑Fi",
    batteryLow: "Bateria em {pct}% — troque em breve",
    batteryDays: "Bateria: ~{days} dias restantes",
    weakRssi: "Sinal fraco ({rssi} dBm)",
    healthy: "Enviando dados, contatos de alagamento secos",
  },
  batteryEta: {
    replaceSoon: "Troque em breve",
    days: "~{count} dias",
    weeks: "~{count} sem.",
  },
  sensors: {
    title: "Sensores ({count})",
    noneYetPush:
      "Nenhum ainda: eles são adicionados automaticamente a partir das chaves JSON do primeiro envio.",
    noneYetPull: "Nenhum ainda: eles aparecem depois da próxima consulta do feed.",
    intro: "Dê a eles o nome do que medem. Um único Salvar vale para todos os sensores.",
    name: "Nome",
    latest: "Última",
    type: "Tipo",
    showOnHome: "Mostrar no Início",
    moreJsonKey: "Mais: chave JSON",
    offsetSummary: " · ajuste {offset}",
    jsonKey: "Chave JSON",
    unit: "Unidade",
    unitPlaceholder: "Padrão do tipo",
    offset: "Ajuste de calibração",
    offsetHint: "Somado a cada leitura. As leituras brutas não mudam.",
    offsetHintFahrenheit: "Os ajustes de temperatura são em °F: 1 °C equivale a 1,8 °F.",
    deleteConfirm: 'Excluir o sensor "{name}" e o histórico dele?',
    deleteSensor: "Excluir sensor",
    saveSensors: "Salvar sensores",
    addByHand: "Adicionar um sensor manualmente",
    addHint:
      "Só é necessário para definir um nome antes do primeiro envio; caso contrário, as chaves são adicionadas automaticamente.",
    addLabelPlaceholder: "Cano da garagem",
    addSensor: "Adicionar sensor",
  },
  kinds: {
    temperature: "Temperatura",
    humidity: "Umidade",
    co2: "CO₂",
    pressure: "Pressão barométrica",
    pm25: "PM2.5",
    voc: "COV",
    level: "Nível de água / poço",
    energy: "Energia",
    door: "Porta",
    power: "Energia elétrica",
    flood: "Alagamento / vazamento",
    motion: "Movimento",
    generic: "Genérico",
  },
  boolValues: {
    open: "Aberta",
    closed: "Fechada",
    on: "Ligado",
    off: "Desligado",
    wet: "Molhado",
    dry: "Seco",
    detected: "Detectado",
    clear: "Nenhum",
  },
  settings: {
    title: "Configurações",
    name: "Nome",
    pullFeedHtml:
      'O nome e o liga/desliga deste feed ficam em <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=pull">Feeds consultados</a>.',
    space: "Espaço",
    spacePlaceholder: "Garagem, sótão, porão…",
    spaceHint: "Onde ele está. Usado na cobertura de proteção e no texto dos alertas.",
    enabled: "Ativado (desmarcado: os envios são ignorados e ele não gera alertas)",
    save: "Salvar",
  },
  connection: {
    title: "Conexão",
    sendsJsonHtml:
      "O dispositivo envia JSON para <code>{url}</code>. A chave dele começa com <code>{prefix}</code>.",
    checkPayload: "Verificar um payload",
    browserFlasher: "Gravador no navegador",
    ingestDocs: "Documentação de ingestão",
    accepted: {
      one: "Últimos 7 dias: {count} envio aceito",
      other: "Últimos 7 dias: {count} envios aceitos",
    },
    rejected: ", {count} rejeitados",
    end: ".",
  },
  maintenance: {
    title: "Manutenção",
    downloadDiagnostics: "Baixar diagnóstico",
    historyChart: "Gráfico do histórico",
    diagnosticsHint:
      "O diagnóstico é um arquivo JSON com dados sensíveis removidos, que você pode anexar a um relatório de bug ou a um e-mail para o suporte.",
    moveTo: "Mover para outro imóvel",
    moveDevice: "Mover dispositivo",
  },
  danger: {
    title: "Chave e remoção",
    rotateTitle: "Renovar a chave de ingestão",
    rotateBody:
      "Gera uma chave nova. A antiga para de funcionar na hora; grave o firmware de novo ou atualize o dispositivo.",
    rotateConfirm:
      "Renovar esta chave de ingestão? A chave antiga para de funcionar imediatamente.",
    rotateButton: "Renovar chave",
    deleteTitle: "Excluir dispositivo",
    deleteBody:
      "Remove o dispositivo, os sensores dele e o histórico deles. Não pode ser desfeito.",
    deleteConfirm: 'Excluir "{name}", os sensores e o histórico deles?',
    deleteButton: "Excluir dispositivo",
  },
  replace: {
    summary: "Substituir um sensor…",
    title: "Substituir um sensor",
    intro:
      "Trocou uma sonda com defeito ou uma placa inteira? Assim que o sensor novo enviar uma leitura, passe para ele o histórico do antigo, para que gráficos, relatórios e alertas continuem como um único sensor.",
    confirm:
      "Mover todo o histórico do sensor antigo para o novo e excluir o antigo? Isso não pode ser desfeito.",
    oldSensor: "Sensor antigo (aposentado)",
    newSensor: "Sensor novo",
    choose: "Escolha…",
    bullets: [
      "O sensor novo assume o nome do antigo, então as regras que usam o nome continuam funcionando.",
      "Os limites por sensor, a referência interna e o histórico da porta passam para ele.",
      "Cada sonda mantém o próprio ajuste de calibração; as leituras antigas são corrigidas para que os gráficos anteriores fiquem exatamente iguais.",
      "O sensor antigo é excluído. Se ele enviar dados de novo, volta como um sensor novo e vazio.",
    ],
    button: "Substituir sensor",
  },
};

export default ptBr;
