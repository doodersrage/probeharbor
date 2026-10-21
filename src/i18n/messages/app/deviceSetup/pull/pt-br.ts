import type { DeviceSetupPullMessages } from "./en";

const ptBr: DeviceSetupPullMessages = {
  title: "Feeds JSON consultados",
  subtitle:
    "JSON via HTTPS que buscamos periodicamente. As chaves das sondas são importadas ao salvar: renomeie abaixo se precisar.",
  exampleSummary:
    "Ainda não tem um feed próprio? Experimente o feed de exemplo",
  viewOnly:
    "Acesso somente leitura: as configurações de feeds e sondas estão ocultas.",
  feeds: {
    heading: "URLs dos feeds",
    introHtml:
      'Endpoints JSON via HTTPS que consultamos periodicamente. Os objetos de sonda ficam sob uma chave raiz (padrão <code>temp</code>). <a class="text-link" href="/about/json-probe-output-schema">documentação do esquema</a>.',
    selectAll: "Selecionar tudo",
    enable: "Ativar",
    disable: "Desativar",
    deleteSelected: "Excluir selecionados",
    selectFeed: "Selecionar {name}",
    name: "Nome",
    namePlaceholder: "Oficina",
    url: "URL HTTPS",
    jsonRoot: "Chave raiz JSON",
    jsonRootTitle:
      "Letra ou sublinhado, seguido de letras, números ou sublinhados",
    jsonRootHintHtml:
      "Objeto que contém as chaves das sondas (geralmente <code>temp</code>).",
    enabled: "Ativado",
    delete: "Excluir",
    deleteConfirm: "Excluir este feed?",
    addFeed: "Adicionar um feed",
  },
  client: {
    bulkDeleteConfirm: {
      one: "Excluir {count} feed? Não é possível desfazer.",
      other: "Excluir {count} feeds? Não é possível desfazer.",
    },
  },
  feedTest: {
    enterUrl: "Informe primeiro a URL de um feed.",
    ok: "Feed OK",
    failed: "O teste do feed falhou",
    unable: "Não foi possível testar o feed.",
    testing: "Testando…",
    test: "Testar URL do feed",
  },
  probeMapper: {
    importedAuto:
      "Chaves das sondas importadas do seu feed: renomeie abaixo e salve.",
    enterUrl: "Informe primeiro a URL de um feed.",
    noProbes: "Nenhuma sonda encontrada no feed.",
    imported: {
      one: "{count} sonda importada. Renomeie abaixo e salve.",
      other: "{count} sondas importadas. Renomeie abaixo e salve.",
    },
    unableRead: "Não foi possível ler o feed.",
    appliedSuggested: "Nomes sugeridos aplicados: edite abaixo e salve.",
    hiddenAvg:
      'Sondas "avg" ocultas no Início: salve a configuração para manter.',
    saveFailed: "Falha ao salvar a configuração de consulta.",
    unableSave: "Não foi possível salvar a configuração de consulta.",
    saveFeedFirst:
      "Salve primeiro a URL de um feed e depois detecte aqui as chaves das sondas.",
    heading: "Nomes das sondas",
    intro:
      "Detecte as sondas no JSON do seu feed e renomeie para o Início. As chaves continuam ligadas ao feed; você só edita os nomes exibidos.",
    readingFeed: "Lendo o feed…",
    discover: "Detectar no feed",
    feed: "Feed",
    jsonKey: "Chave JSON",
    nameOnHome: "Nome no Início",
    showOnHome: "Mostrar no Início",
    remove: "Remover",
    importing: "Lendo o feed e importando as chaves das sondas…",
    emptyHint:
      "Salve a URL de um feed para importar as chaves automaticamente ou clique em Detectar no feed.",
    savePullSetup: "Salvar configuração",
    acceptSuggested: "Aceitar nomes sugeridos",
    hideAvg: "Ocultar avg no Início",
  },
  saveBar: {
    saveFailed: "Falha ao salvar.",
    enterUrl: "Informe primeiro a URL de um feed.",
    saving: "Salvando…",
    save: "Salvar configuração",
    hintWithFeeds:
      "Alterações na URL do feed ou nos nomes das sondas só são salvas quando você clica em Salvar configuração.",
    hintNoFeeds:
      "Adicione a URL de um feed e salve para importar automaticamente as chaves das sondas.",
  },
  fetch: {
    fetching: "Buscando…",
    fetchFailed: "A busca falhou.",
    errorPrefix: "Erro: {message}",
    notFetched: "Não buscado",
    complete: "Busca concluída: atualize o Início para ver as novas leituras.",
    couldNotFetch: "Não foi possível buscar os feeds.",
    rowFailed: "A busca falhou",
    fetchNow: "Buscar agora",
    hint: "Busque as leituras agora em vez de esperar a próxima consulta programada.",
  },
  demo: {
    button: "Experimentar feed de demonstração",
    buttonFirstRun: "Experimente com um feed de demonstração",
    settingUp: "Configurando…",
    hint: "JSON de clima ao vivo, sem precisar de hardware.",
    couldNotSave: "Não foi possível salvar o feed de exemplo.",
  },
};

export default ptBr;
