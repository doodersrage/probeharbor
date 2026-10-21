import type { DeviceSetupPushMessages } from "./en";

const ptBr: DeviceSetupPushMessages = {
  title: "Adicionar um dispositivo push",
  subtitleHtml:
    'ESP32, Pico W, ESPHome, Home Assistant ou qualquer coisa que envie JSON por POST. Você recebe uma URL de ingestão; os sensores são adicionados automaticamente no primeiro envio. Limite: {max} dispositivos por imóvel ({tier}). Veja a <a class="text-link" href="/about/ingest-and-webhooks">documentação de ingestão</a> · <a class="text-link" href="/docs/api">referência rápida da API</a>.',
  vaultOffHtml:
    "A recuperação da chave de ingestão (Revelar) não está ativada nesta instalação. Copie a chave do aviso de 30 minutos ao criar um dispositivo ou ao usar <strong>Trocar chave</strong> no cartão dele: depois não haverá nada para descriptografar.",
  atLimitHtml:
    'Você chegou ao limite de dispositivos push. <a class="text-link" href="/dashboard/plans">Mude de plano</a> para adicionar mais ou exclua um dispositivo abaixo.',
  name: "Nome",
  namePlaceholder: "Sonda do cano da garagem",
  space: "Espaço",
  spacePlaceholder: "Garagem",
  createDevice: "Criar dispositivo",
  commonSpacesLabel: "Espaços comuns",
  commonSpaces: [
    "Garagem",
    "Sótão",
    "Porão técnico",
    "Porão",
    "Oficina",
    "Área de serviço",
    "Depósito",
  ],
  firstRunHtml:
    'Use <a class="text-link" href="#devices-first-run">Conecte seu primeiro sensor</a> acima para escolher um caminho.',
  viewOnly:
    "Acesso somente leitura: a criação de dispositivos está desativada.",
  otherDevicesHtml: {
    one: 'Você tem mais {count} dispositivo na aba <a class="text-link" href="/dashboard/devices?view=ops">Dispositivos</a>.',
    other:
      'Você tem mais {count} dispositivos na aba <a class="text-link" href="/dashboard/devices?view=ops">Dispositivos</a>.',
  },
  keyPrefix: "prefixo da chave {prefix}…",
  neverSeen: "nunca visto",
  freshness: {
    offline: "Offline · visto pela última vez {age}",
    lagging: "Pode estar offline · visto pela última vez {age}",
    updated: "Atualizado {age}",
  },
  firmware: "firmware {version}",
  updateTo: "Atualizar para {version}",
  labelsFine: "Os rótulos estão bons assim.",
  renameLater: "Renomear depois",
  noPostsYet:
    "Nenhum envio ainda: o primeiro POST de JSON importa automaticamente as chaves dos sensores.",
  waitingKeys: "Aguardando o primeiro POST com as chaves",
  seeChecklist: "Ver checklist",
  manage: "Gerenciar",
  openDevice: "Abrir página do dispositivo →",
  rename: "Renomear",
  spaceExamplePlaceholder: "garagem, sótão, porão…",
  saveSpace: "Salvar espaço",
  rotateConfirm:
    "Trocar esta chave de ingestão? A chave antiga para de funcionar imediatamente.",
  rotateKey: "Trocar chave",
  moveTo: "Mover para",
  transferDevice: "Transferir dispositivo",
  deleteConfirm: "Excluir este dispositivo push e os sensores dele?",
  delete: "Excluir",
  noSensorsYet:
    "Nenhum sensor ainda: eles aparecem automaticamente depois do seu primeiro POST. Use Avançado abaixo só se precisar mapear chaves antes.",
  sensorsList: "Sensores: {list}.",
  editSensors: "Editar sensores, tipos e calibração →",
  advancedSummary: "Avançado: mapear chaves JSON manualmente",
  advancedHint:
    "Opcional: pule isto se você já envia JSON por POST e deixa a importação automática cuidar das chaves.",
  quickPairTitle: "Adição rápida: par de temperatura + umidade",
  quickPairHintHtml:
    "A mesma chave JSON para os dois (ex.: <code>0</code> ou <code>temp1</code>): a sonda típica estilo DHT.",
  device: "Dispositivo",
  jsonKey: "Chave JSON",
  nameOnHome: "Nome no Início",
  pairLabelDefault: "Oficina",
  addPair: "Adicionar par",
  orAddOne: "Ou adicione um sensor",
  sensorLabelPlaceholder: "Porta da oficina",
  type: "Tipo",
  addSensor: "Adicionar sensor",
  kindLabels: {
    temperature: "Temperatura",
    humidity: "Umidade",
    co2: "CO₂",
    pressure: "Pressão barométrica",
    pm25: "PM2,5",
    voc: "COV",
    level: "Nível de água / poço",
    energy: "Energia",
    door: "Porta",
    power: "Energia elétrica",
    flood: "Alagamento / vazamento",
    motion: "Movimento",
    generic: "Genérico",
  },
  client: {
    suggestedName: "Sonda {space}",
  },
  inlineRename: {
    renameImported: "Renomear sensores importados",
    quickRename: "Renomear rápido",
    acceptSuggested: "Aceitar sugestões",
    saving: "Salvando…",
    saveNames: "Salvar nomes",
    couldNotSave: "Não foi possível salvar.",
    saved: "Salvo.",
  },
  revealKey: {
    loading: "Carregando…",
    keyShown: "Chave exibida abaixo",
    reveal: "Revelar chave de ingestão",
    srKeyFor: "Chave de ingestão de {name}: ",
    copied: "Copiada",
    copyKey: "Copiar chave",
    errorDisabled:
      "Não foi possível revelar a chave. Se a recuperação estiver desativada neste servidor, use Trocar chave no cartão do dispositivo.",
    errorNetwork:
      "Não foi possível revelar a chave. Se a recuperação estiver desativada, use Trocar chave no cartão do dispositivo para ter uma nova URL de ingestão.",
    errorCopy: "Não foi possível copiar para a área de transferência.",
  },
};

export default ptBr;
