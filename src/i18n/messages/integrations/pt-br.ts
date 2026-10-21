import type { IntegrationsMessages } from "./en";

const ptBr: IntegrationsMessages = {
  breadcrumbHome: "Início",
  breadcrumbIntegrations: "Integrações",
  allIntegrations: "Todas as integrações",
  createShareLink: "Criar um link de compartilhamento",
  startFreeShareLink: "Comece grátis → link de compartilhamento",
  pluginOnGithub: "Plugin no GitHub",

  hub: {
    title: "Integrações",
    description:
      "Conecte o ProbeHarbor ao Home Assistant, Matter, MQTT, Grafana, Nest, Ecobee, webhooks e Zapier para alertas de congelamento e alagamento.",
    kicker: "Integrações",
    heading: "Conecte o ProbeHarbor ao seu ecossistema",
    lede: "Alertas hospedados de congelamento e de alagamento/vazamento, além de histórico, para sondas ESP/Arduino, com Home Assistant, Matter / SmartThings, Node-RED, Influx, métricas Prometheus, contexto do termostato e automações por webhook opcionais. Os guias abaixo ficam no probeharbor.dev; as explicações detalhadas de payload/Grafana ficam no site de documentação para desenvolvedores e vêm sinalizadas quando levam você para fora.",
    dashboardShare: "Dashboard → Share",
    startFree: "Comece grátis",
    hacsStatus: "Integração personalizada oficial do HACS: envio para a loja padrão em andamento.",
    devDocsHtml: (devDocsUrl: string) =>
      `Procurando esquemas OpenAPI ou detalhes do JSON do dashboard do Grafana? A <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">documentação para desenvolvedores (GitHub Pages)</a> abre em uma nova aba. Veja também: <a class="text-link" href="/integrations/influx">Influx / Telegraf</a>, <a class="text-link" href="/integrations/node-red">Node-RED</a>, <a class="text-link" href="/integrations/automation">IFTTT / n8n</a>.`,
    learnMore: "Saiba mais",
    more: "Mais",
    opensDevDocs: " (abre a documentação para desenvolvedores)",
    diyTitle: "Ainda no MQTT caseiro?",
    diyCopy:
      "Você pode manter o Mosquitto na rede local e espelhar as leituras para o ProbeHarbor e ter alertas de congelamento/alagamento, links de compartilhamento e comprovação para o seguro.",
    compareDiy: "Comparar com MQTT caseiro",
    guidesHub: "Central de guias",
    hacsInstallGuide: "Guia de instalação do HACS",
    ingestWebhooks: "Ingestão e webhooks",
    freezeMapEmbed: "Incorporar o mapa de congelamento",
  },

  ha: {
    title: "Alertas de congelamento externos para o Home Assistant",
    kicker: "Integração HACS",
    heading: "O alerta de congelamento que funciona mesmo com o Home Assistant fora do ar",
    lede: "Uma automação do Home Assistant não consegue avisar sobre a queda de energia ou de internet que deixa o próprio Home Assistant offline, e muitas vezes é esse mesmo evento que deixa a casa esfriar. Envie os sensores que você já tem para o ProbeHarbor e ele avisa você de fora da sua rede quando um ambiente se aproxima do congelamento, quando um sensor de vazamento fica molhado e quando as leituras param de chegar. Mantenha tudo local no Home Assistant; use isto para os alertas que precisam chegar até você.",
    hacsRepo: "Repositório HACS no GitHub",
    vsDiyMqtt: "vs MQTT caseiro",
    statusHtml:
      'Instale hoje como repositório personalizado do HACS. O <a class="text-link" href="https://github.com/hacs/default/pull/11756" target="_blank" rel="noreferrer">PR #11756 da loja padrão</a> está em análise. <a class="text-link" href="https://github.com/doodersrage/probeharbor/blob/main/docs/community/home-assistant-forum-post.md" target="_blank" rel="noreferrer">Rascunho do post no fórum</a>',
    addsTitle: "O que ele acrescenta a uma instalação do Home Assistant",
    addsItemsHtml: [
      "<strong>Um alerta quando a casa fica em silêncio.</strong> Se as leituras pararem por um número definido de horas, o ProbeHarbor avisa você. Silêncio no inverno geralmente significa que a energia ou a internet caiu, e o aquecimento pode ter caído junto.",
      "<strong>Alertas que não dependem da sua rede.</strong> E-mail, push e apps de mensagens no plano gratuito; SMS no Pro. Os moradores da casa recebem os alertas sem precisar de acesso ao seu Home Assistant.",
      "<strong>Aviso antes de o frio chegar.</strong> Uma estimativa de tempo até o congelamento em todos os planos, avisos de congelamento pela previsão no Member e alertas do National Weather Service (EUA) no Pro.",
      "<strong>Nenhum hardware novo.</strong> Envie qualquer entidade de temperatura ou de vazamento do Home Assistant. Dois dispositivos são grátis.",
    ],
    addsFootHtml:
      'Dois sentidos, use um ou os dois: envie entidades do Home Assistant para o ProbeHarbor e tenha alertas externos (o YAML é gerado com a sua chave em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> quando você escolhe Home Assistant) e traga as sondas do ProbeHarbor para o Home Assistant como entidades com a integração HACS abaixo. Contexto: <a class="text-link" href="/answers/home-assistant-freeze-alert">como configurar um alerta de congelamento no Home Assistant</a> e <a class="text-link" href="/answers/wifi-freeze-alarm-power-outage">o que acontece numa queda de energia</a>.',
    installTitle: "Instalar pelo HACS",
    installStep1Html: "No Home Assistant: <strong>HACS → Integrations → ⋮ → Custom repositories</strong>",
    installStep2Html: (repo: string) =>
      `Adicione o repositório <code class="text-xs break-all">${repo}</code> (categoria: Integration)`,
    installStep3Html: "Instale o <strong>ProbeHarbor</strong> e reinicie o Home Assistant",
    installStep4Html: "<strong>Settings → Devices &amp; services → Add integration → ProbeHarbor</strong>",
    installStep5Html:
      'Crie um link de compartilhamento <strong>ao vivo</strong> em <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> (o Free inclui um link ao vivo para a família; o Pro acrescenta histórico/métricas e links que nunca expiram) e cole o token de <code>/share/YOUR_TOKEN</code>',
    installFootHtml: (devDocsUrl: string) =>
      `Passo a passo completo para desenvolvedores: <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">guia do Home Assistant ↗</a> · As receitas manuais em YAML continuam funcionando se você preferir sensores REST ao HACS.`,
    showsTitle: "O que aparece no HA",
    showsItemsHtml: [
      "<strong>Sensores</strong>: temperatura, umidade, CO₂, pressão, PM2.5, VOC, nível, energia e sondas numéricas genéricas",
      "<strong>Sensores binários</strong>: estados de porta, alagamento/vazamento, movimento e energia",
      "<strong>Consulta periódica</strong>. Por padrão, o HACS consulta a cada 5 minutos (configurável de 60 a 3600 s). Isso basta para dashboards; para limites de congelamento e contatos molhados em que cada minuto conta, prefira a <strong>ingestão push nativa</strong> (ESP/Arduino → ProbeHarbor), para que os alertas disparem na leitura e não depois da próxima consulta do HA. Usar os dois em paralelo é normal: push para SMS de congelamento e vazamento, HACS para entidades locais.",
      "<strong>Serviços</strong> (webhook de entrada opcional + segredo em Dashboard → Share): <code>thermaltrace.snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>",
      "<strong>Serviço de push</strong> (chave de ingestão opcional): <code>thermaltrace.push</code> com um dicionário JSON <code>payload</code>",
    ],
    formatsTitle: "Formatos JSON nativos (push e pull)",
    formatsLede:
      "Além do caminho via link de compartilhamento do HACS, o ProbeHarbor detecta automaticamente o JSON que o seu HA talvez já emita, sem precisar de nenhum wrapper personalizado.",
    formatsItemsHtml: [
      '<strong>Sensor REST do Home Assistant</strong>. Envie (POST) ou busque <code>{ "state": "65.3", "attributes": { "unit_of_measurement": "°F" } }</code>; mapeie a chave de sonda <code>state</code> em Devices',
      "<strong>SenML (RFC 8428)</strong>. Array JSON com unidades <code>Cel</code> / <code>%RH</code>; comum em gateways de IoT",
      "<strong>thermaltrace.push</strong>: <code>sensors[]</code> nativo a partir de automações (veja temperatura interna abaixo)",
      "<strong>Ponte MQTT</strong>: desembrulhe payloads MQTT da rede local via <code>POST /api/ingest/mqtt</code>",
    ],
    liveSamples: "Exemplos ao vivo:",
    sampleHaRest: "HA REST",
    sampleSenml: "SenML",
    ingestFormatsGuide: "Guia de formatos de ingestão",
    indoorTitle: "Temperatura interna via Home Assistant",
    indoorLede:
      "Tenha o contexto da casa ao lado das sondas em Overview e History. Dois caminhos: Nest OAuth no Pro (quando disponível) ou, como plano B, enviar qualquer entidade climate do HA: útil quando os cadastros de desenvolvedor da Ecobee estão fechados ou quando você usa outra marca de termostato.",
    nestTitle: "Nest OAuth (Pro, preferido quando disponível)",
    nestCopyHtml:
      'No <strong>probeharbor.dev</strong>, residências Pro podem conectar o Nest em <a class="text-link" href="/dashboard/devices">Dashboard → Temperature</a> para ver temperatura interna, setpoint e modo do HVAC ao vivo ao lado das sondas do sótão/porão/oficina: os alertas de congelamento podem incluir esse contexto. O histórico guarda registros do termostato no mesmo cron de ~15 minutos dos outros coletores Pro.',
    nestCompareHtml: 'Comparação para usuários: <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>',
    nestOperatorHtml:
      'Operadores de instalações próprias que habilitam segredos OAuth: <a class="text-link" href="/about/thermostat-oauth">configuração de Nest &amp; Ecobee para operadores</a>',
    planBTitle: "Plano B: envie a temperatura interna pelo Home Assistant",
    planBCopyHtml:
      "Os cadastros no programa de desenvolvedores da Ecobee costumam ficar fechados, então o Ecobee OAuth pode não estar disponível nem no Pro. Qualquer termostato que já esteja no HA (Ecobee, Nest via HA, <code>climate.*</code> genérico) ainda pode alimentar o ProbeHarbor: envie a temperatura interna com <code>thermaltrace.push</code> e depois escolha essa sonda como sua <strong>Indoor reference</strong> em Dashboard → Devices.",
    planBStepsHtml: [
      "Exponha seu termostato no HA (por exemplo, <code>climate.living_room</code>).",
      "A cada 15 minutos, chame <code>thermaltrace.push</code> com um sensor <code>temperature</code> (chave <code>house_indoor</code>).",
      'No ProbeHarbor: <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=thermostat#indoor-reference">Devices → Indoor reference</a>: escolha esse sensor.',
    ],
    planBFootHtml:
      'Também é útil para o Ecobee via HA quando o OAuth não está disponível: veja <a class="text-link" href="/compare/ecobee">ProbeHarbor vs Ecobee</a>. Notas detalhadas de payload (GitHub Pages): <a class="text-link" href="https://probeharbor.dev/developers/integrations/home-assistant#indoor-temperature-ecobee--any-thermostat" target="_blank" rel="noreferrer">documentação para desenvolvedores ↗</a>',
    mqttTitle: "Em paralelo com MQTT (o padrão mais comum)",
    mqttLede:
      "O ProbeHarbor não é um broker MQTT. A maioria dos homelabbers mantém Mosquitto / ESPHome / HA MQTT na rede local e espelha tópicos selecionados por HTTPS quando quer alertas de congelamento e vazamento na nuvem, além de histórico.",
    mqttItemsHtml: [
      '<a class="text-link" href="/about/mqtt-bridge">Receita de ponte MQTT → HTTPS</a> <code>POST /api/ingest/mqtt</code> com a chave do seu dispositivo',
      '<a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>Fluxo do Node-RED</a> para assinantes do Mosquitto',
      '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs MQTT auto-hospedado</a>: quando alertas hospedados compensam mais do que manter sua própria infraestrutura',
    ],
    alertsTitle: "Alertas no Home Assistant",
    alertsLede:
      "Os webhooks de saída do Pro disparam quando o ProbeHarbor envia um alerta de congelamento, vazamento ou de regra personalizada. Aponte a URL para o endpoint de webhook do seu HA ou importe o blueprint.",
    downloadBlueprint: "Baixar o YAML do blueprint de webhook",
    entityYamlHtml: (href: string) =>
      `<a class="text-link" href="${href}" download>YAML de nomes de entidades</a> para dispositivos push`,
    productGuideHtml:
      'Guia do produto: <a class="text-link" href="/about/ingest-and-webhooks">Ingestão e webhooks</a>',
    configureTokensHtml:
      'Configure os tokens de saída e de entrada em <a class="text-link" href="/dashboard/share">Dashboard → Share</a>',
    verifyHtml:
      '<strong>Verifique o <code>X-Signature</code></strong> quando definir um segredo de assinatura de webhook no ProbeHarbor. O HA (ou qualquer receptor) deve rejeitar POSTs que falhem na verificação HMAC. O blueprint documenta o cabeçalho; detalhes no <a class="text-link" href="/about/ingest-and-webhooks">guia de ingestão e webhooks</a> e nas perguntas frequentes abaixo.',
    exampleTitle: "Exemplo de automação",
    exampleLede: "Silencie os alertas de congelamento e vazamento do ProbeHarbor enquanto uma porta fica aberta para manutenção:",
    faqLede: "Perguntas comuns sobre HACS, links de compartilhamento e uso em paralelo com MQTT.",
  },

  matter: {
    title: "Ponte Matter / Apple Home",
    breadcrumb: "Matter",
    kicker: "Ponte Matter",
    heading: "ProbeHarbor no Apple Home",
    lede: "Instale o plugin do Matterbridge em um Raspberry Pi, NAS ou PC sempre ligado, cole o token de um link ao vivo para a família (o Free inclui um) e tenha acessórios de temperatura, umidade, vazamento, porta, energia e movimento no Apple Home, Google Home ou Alexa. Sem certificação CSA. As sondas continuam no ESP/Arduino; esta ponte só consulta o seu link de compartilhamento.",
    vsHomeAssistant: "vs Home Assistant",
    whyTitle: "Por que Matter em vez de um app para iOS?",
    whyCopyHtml:
      'Quem na casa já vive no app Casa vê de relance o congelamento e o alagamento da garagem sem precisar de login no ProbeHarbor. Mesmo contrato de link de compartilhamento da <a class="text-link" href="/integrations/home-assistant">integração HACS</a>, pensado para quem nunca vai instalar o Home Assistant. O SMS crítico de congelamento continua vindo da ingestão push do ProbeHarbor — esta consulta serve para automações do app Casa e para ver de relance.',
    installTitle: "Instalação",
    installStep1Html:
      'Instale o <a class="text-link" href="https://matterbridge.io/" target="_blank" rel="noreferrer">Matterbridge</a> em um host da rede local (Raspberry Pi, NAS ou PC sempre ligado). O pareamento Matter precisa de mDNS local — não roda no Cloudflare Workers.',
    installStep2Html: (repo: string) =>
      `Clone <code class="text-xs break-all">${repo}</code>, rode <code>npm install &amp;&amp; npm run build</code> e depois <code>matterbridge --add .</code>`,
    installStep3Html:
      'Crie um link de compartilhamento <strong>ao vivo para a família</strong> em <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> e cole o token de <code>/share/YOUR_TOKEN</code> na configuração do plugin.',
    installStep4: "Reinicie o Matterbridge e leia o QR code no Apple Home / Google Home / Alexa.",
    readmeLead: "README completo e esquema de configuração:",
    mapTitle: "Mapa de sensores",
    mapCaption: "Tipos do ProbeHarbor mapeados para tipos de dispositivo Matter",
    mapKindHeader: "Tipo no ProbeHarbor",
    mapAccessoryHeader: "Acessório Matter",
    mapRows: [
      "Sensor de temperatura (°F → °C)",
      "Sensor de umidade",
      "Detector de vazamento de água",
      "Sensor de contato",
      "Sensor de contato (com energia = fechado)",
      "Sensor de ocupação",
    ],
    mapFootHtml:
      "Fora da v1: energia, nível, clusters de qualidade do ar e tempo até o congelamento (não há um tipo Matter nativo que represente isso com fidelidade). O interruptor opcional de <strong>Snooze</strong> do Pro faz POST no mesmo webhook de entrada do Home Assistant.",
    dualTitle: "Em paralelo com o Home Assistant",
    dualCopyHtml:
      'Homelabbers podem manter o <a class="text-link" href="/integrations/home-assistant">HACS</a> para entidades locais e adicionar esta ponte Matter para o Apple Home no mesmo link de compartilhamento. Consulte a cada 60–300 segundos; as leituras compartilhadas permitem cerca de 60 requisições por minuto.',
    faqTitle: "Perguntas frequentes sobre Matter",
    faqLede: "Certificação, host de instalação e a relação com as sondas e o Home Assistant.",
  },

  automation: {
    title: "IFTTT, n8n e Sheets",
    breadcrumb: "Automação",
    kicker: "Sem código e auto-hospedado",
    heading: "IFTTT, n8n, Sheets e Notion",
    alertsWebhooks: "Alerts → webhooks",
    startFreeTrial: "Comece grátis / teste do Pro",
    downloadN8n: "Baixar n8n → Sheets",
    zapierMake: "Zapier e Make",
    iftttStepsHtml: [
      "Crie um applet com o gatilho <strong>Webhooks → Receive a web request</strong> (nome do evento, por exemplo, <code>probeharbor_alert</code>).",
      "Copie a URL do IFTTT Maker para o ProbeHarbor em <strong>Pro → Alerts → Outbound webhook</strong>. Se quiser, defina um segredo de assinatura e verifique o <code>X-Signature</code> em uma etapa de filtro, se o seu plano permitir código.",
      "Ação: enviar uma notificação, ligar/desligar uma tomada inteligente ou adicionar uma linha a uma planilha do Google pelo serviço Sheets do IFTTT.",
    ],
    n8nStep1Html: (href: string) =>
      `Importe <a class="text-link" href="${href}" download>probeharbor-alert-to-sheets.json</a> (Webhook → Set → Google Sheets append).`,
    n8nStep2: "Ative o workflow e copie a URL de webhook de produção para o webhook de saída do ProbeHarbor.",
    n8nStep3Html:
      "Substitua <code>YOUR_GOOGLE_SHEET_ID</code>; cabeçalhos da planilha: <code>sent_at</code>, <code>kind</code>, <code>title</code>, <code>body</code>.",
    n8nFootHtml:
      "Mesmo payload do Zapier: <code>title</code>, <code>body</code>, <code>kind</code>, <code>sent_at</code>. <code>kind</code> pode ser <code>threshold</code>, <code>flood</code>, <code>runway</code>, <code>forecast</code>, entre outros.",
    sheetsTitle: "Google Sheets e Notion",
    sheetsLede: "Registro para locadores / seguro sem construir um conector de PMS:",
    sheetsItemHtml:
      "<strong>Sheets</strong> — use o fluxo do n8n acima, o IFTTT Sheets ou o “Create Spreadsheet Row” do Zapier.",
    notionItemHtml:
      "<strong>Notion</strong> — nó Notion do n8n ou “Create a database item” do Make a partir do mesmo Catch Hook; mapeie <code>title</code> → Name, <code>kind</code> → Select, <code>body</code> → Text, <code>sent_at</code> → Date.",
    inboundTitle: "Snooze de entrada (Pro)",
    inboundLede: "Pelo IFTTT/n8n quando você ativa o alarme ou sai de casa:",
    inboundFootHtml:
      'Crie o token em Dashboard → Share. Detalhes: <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a> · <a class="text-link" href="/about/zapier-make-recipes">receitas de Zapier e Make</a>.',
    faqTitle: "Perguntas frequentes sobre automação",
    faqLede: "IFTTT vs n8n vs Zapier e como registrar alertas no Sheets.",
  },

  influx: {
    title: "InfluxDB, Telegraf e VictoriaMetrics",
    breadcrumb: "InfluxDB",
    kicker: "Séries temporais",
    heading: "Colete o ProbeHarbor no Influx",
    downloadTelegraf: "Baixar a configuração do Telegraf",
    createApiKey: "Criar chave de API",
    startFreePro: "Comece grátis / Pro",
    httpApi: "API HTTP",
    howTitle: "Como funciona",
    howCopyHtml:
      'As chaves de API do Pro expõem texto Prometheus em <code>GET /api/v1/metrics</code>. O <code>inputs.prometheus</code> do Telegraf coleta esse endpoint e grava no InfluxDB 2.x, VictoriaMetrics ou em qualquer saída do Telegraf. Nenhuma API nova do ProbeHarbor — o mesmo contrato do <a class="text-link" href="https://probeharbor.dev/developers/integrations/grafana" target="_blank" rel="noreferrer">Grafana</a>.',
    quickTitle: "Início rápido",
    quickStep1Html:
      'Crie uma chave de API Pro em <a class="text-link" href="/dashboard/share">Dashboard → Share</a>.',
    quickStep2Html: (href: string) =>
      `Baixe <a class="text-link" href="${href}" download>telegraf/probeharbor.conf</a> e defina <code>PROBEHARBOR_API_KEY</code>, <code>INFLUX_TOKEN</code>, <code>INFLUX_ORG</code>, <code>INFLUX_BUCKET</code>.`,
    quickStep3Html:
      "<code>telegraf --config probeharbor.conf</code> — confirme que os pontos de <code>probeharbor_sensor_value</code> chegam ao bucket.",
    shapeTitle: "Formato das métricas",
    shapeCopyHtml:
      "Um único gauge <code>probeharbor_sensor_value</code> com os rótulos <code>device</code>, <code>key</code>, <code>kind</code> (<code>temperature</code>, <code>humidity</code>, <code>flood</code>, …). Apenas leituras numéricas — os booleanos ficam no JSON de compartilhamento / HACS / Matter.",
    shapeFoot:
      "Instalação própria: troque o host na URL do Telegraf. Quem usa VictoriaMetrics pode trocar a saída por Prometheus remote write (há um exemplo comentado na configuração).",
    grafanaTitle: "O Grafana continua funcionando",
    grafanaCopyHtml:
      'Prefere dashboards a um TSDB de longo prazo? Importe <a class="text-link" href="/grafana/probeharbor-dashboard.json" download>probeharbor-dashboard.json</a> com uma fonte de dados Prometheus apontando para a mesma URL de métricas.',
    faqTitle: "Perguntas frequentes sobre Influx",
    faqLede: "Coleta com Telegraf, chaves Pro e VictoriaMetrics.",
  },

  nodeRed: {
    title: "Ponte MQTT com Node-RED",
    kicker: "Node-RED",
    heading: "Espelhe o Mosquitto para o ProbeHarbor",
    downloadFlow: "Baixar o JSON do fluxo",
    createPushDevice: "Criar um dispositivo push",
    startFreeDevices: "Comece grátis → Devices",
    mqttBridgeRecipe: "Receita de ponte MQTT",
    installTitle: "Instalação",
    step1Html:
      'Crie um <strong>dispositivo push</strong> em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e copie a chave de ingestão.',
    step2Html: (href: string) =>
      `No Node-RED: <strong>Menu → Import</strong> → envie <a class="text-link" href="${href}" download>mqtt-to-probeharbor.json</a> (ou cole a URL).`,
    step3Html:
      "Defina a variável de ambiente <code>PROBEHARBOR_INGEST_KEY</code> (ou edite o nó function). Aponte os nós MQTT para o seu broker.",
    step4: "Faça o deploy e confirme o HTTP 200 no nó de debug. As leituras aparecem em Devices / Overview.",
    installFoot:
      "O fluxo limita o envio a cerca de 1 POST por minuto e inclui uma aba opcional para o portão da garagem. O ProbeHarbor não é um broker MQTT — mantenha o Mosquitto na rede local.",
    postsTitle: "O que ele envia",
    postsLedeHtml:
      "Envelope para <code>POST /api/ingest/mqtt</code> com o cabeçalho <code>X-Ingest-Key</code>:",
    relatedTitle: "Relacionados",
    relatedItemsHtml: [
      '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a> — entidades por link de compartilhamento sem Node-RED',
      '<a class="text-link" href="/integrations/matter">Matter / Apple Home</a> — sensores no app Casa para a mesma residência',
      '<a class="text-link" href="/about/garage-door-cold-playbook">Guia de portão + frio</a> — combine com a aba do portão',
    ],
    faqTitle: "Perguntas frequentes sobre Node-RED",
    faqLede: "Importação, chaves e a relação com o Home Assistant.",
  },

  smartThings: {
    title: "SmartThings via Matter",
    kicker: "SmartThings",
    heading: "Sensores da garagem no SmartThings",
    matterGuide: "Guia da ponte Matter",
    shareLink: "Link de compartilhamento",
    startFree: "Comece grátis",
    vsGovee: "vs Govee / sensores ST",
    noC2cTitle: "Sem app Cloud-to-Cloud (de propósito)",
    noC2cCopyHtml:
      "Um conector Cloud-to-Cloud do Samsung SmartThings significa revisão na loja, OAuth e um segundo salto entre nuvens. O ProbeHarbor já tem um plugin do <strong>Matterbridge</strong> que expõe temperatura, umidade, vazamento, porta, energia e movimento do link de compartilhamento na sua rede local. O SmartThings (assim como o Apple Home e o Google Home) pode adicionar essa ponte Matter — um único caminho de instalação para os três.",
    setupTitle: "Configuração",
    setupStep1Html:
      'Crie um link ao vivo para a família em <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a>.',
    setupStep2Html: (href: string) =>
      `Instale o Matterbridge + <a class="text-link" href="${href}" target="_blank" rel="noreferrer">probeharbor-matter</a> em um Raspberry Pi/NAS.`,
    setupStep3: "No app SmartThings: adicione um dispositivo Matter / leia o QR do Matterbridge (o mesmo fluxo de outras pontes Matter).",
    setupStep4: "Mantenha o SMS de congelamento na ingestão push do ProbeHarbor — a consulta via Matter serve para ver de relance e para automações locais.",
    aloneTitle: "Quando ficar só com o ProbeHarbor",
    aloneCopyHtml:
      'Sensores de consumo ST/Govee ganham no preço para quartos. Para garagens separadas da casa e oficinas, a ingestão via ESP + canais de alerta de congelamento/vazamento para a família ainda superam o alcance Bluetooth dos fabricantes. Veja <a class="text-link" href="/compare/govee">ProbeHarbor vs Govee / SmartThings</a>.',
    faqTitle: "Perguntas frequentes sobre SmartThings",
    faqLede: "Caminho via Matter vs um app de nuvem dedicado do SmartThings.",
  },
};

export default ptBr;
