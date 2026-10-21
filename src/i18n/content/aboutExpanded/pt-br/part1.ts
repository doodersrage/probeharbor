import type { AboutExpandedOverlay } from "../index";

export default {
  "dht22-sensor-overview": [
    { html: 'O DHT22 (também vendido como AM2302) é o sensor digital no coração deste projeto de garagem. Ele informa a umidade relativa e a temperatura do ar por uma única linha de dados, o que mantém a fiação simples quando você precisa de várias zonas. Entender o comportamento dele ajuda a interpretar leituras ruidosas e a ter expectativas realistas em comparação com equipamentos de laboratório.' },
    { text: "O que o DHT22 mede" },
    { html: 'Cada leitura retorna a umidade (0–100 %UR) e a temperatura (faixa especificada normalmente de −40 a 80 °C). O firmware converte os valores para Fahrenheit para quem consome o JSON, enquanto o LCD pode mostrar qualquer uma das escalas. As leituras representam o bolsão de ar ao redor do corpo do sensor, não a temperatura da superfície de um cano ou de uma laje de concreto, a menos que você monte a sonda encostada nessa superfície de propósito.' },
    { html: 'A precisão do datasheet é de aproximadamente ±0,5 °C e ±2–5 %UR em condições estáveis. Em garagens com correntes de ar, aberturas rápidas da porta podem gerar picos curtos que são movimento real de ar, não falha do sensor. Confira as <a class="text-link" href="/about/probe-mounting-enclosures">orientações de posicionamento da sonda</a> antes de trocar o hardware.' },
    { text: "Temporização e comportamento do barramento" },
    { html: 'Os sensores DHT22 exigem um intervalo mínimo entre leituras, geralmente de dois segundos. O sketch faz a leitura com um timer e ignora solicitações sobrepostas. Desrespeitar o intervalo retorna valores antigos ou de erro, e é por isso que o firmware inclui a lógica de novas tentativas descrita em <a class="text-link" href="/about/dht22-read-errors-retries">erros de leitura e novas tentativas do DHT22</a>.' },
    { items: [
      "**Alimentação:** 3,3–5 V CC; compartilhe o terra com o Arduino.",
      "**Dados:** um GPIO por sensor, com um resistor de pull-up na linha.",
      "**Comprimento do cabo:** mantenha os trechos curtos; fios longos sem blindagem captam ruído.",
      "**Gabinete:** uma caixa ventilada evita ar parado aquecido pelo sol; veja o guia de montagem.",
    ] },
    { text: "Onde ele se encaixa na arquitetura" },
    { html: 'As sondas alimentam o <a class="text-link" href="/about/arduino-sketches">sketch do Arduino</a>, que publica o JSON consumido pelo site. Siga o <a class="text-link" href="/about/data-flow">fluxo de dados de ponta a ponta</a> ao investigar diferenças entre os valores do LCD e da web. A fiação pino a pino está documentada em <a class="text-link" href="/about/dht22-data-line-wiring">fiação da linha de dados do DHT22</a>.' },
  ],

  "probe-mounting-enclosures": [
    { html: 'Um sensor perfeito no lugar errado mente. As sondas da garagem devem medir o volume de ar onde os objetos guardados e as pessoas realmente sentem as condições, e não o ponto mais quente de sol no chão ou o ar mais frio que entra por baixo da porta.' },
    { text: "Altura e localização" },
    { html: 'Monte a cerca de 1,2 a 1,5 m de altura em uma parede interna, longe do plano da porta da garagem e da luz direta do sol pelas janelas. Paredes voltadas para o sul e o oeste costumam acompanhar as variações externas mais devagar, o que pode ser útil para monitorar o risco de congelamento. Veja <a class="text-link" href="/about/multi-zone-garage-layout">layout com várias zonas</a> ao instalar mais de uma sonda.' },
    { text: "Gabinetes e circulação de ar" },
    { items: [
      "Use **caixas de projeto ventiladas** para que o sensor respire o ar ambiente.",
      "Evite lacrar as sondas em caixas à prova d'água sem ventilação: a umidade fica atrasada em relação à realidade.",
      "Passe os cabos saindo por baixo da caixa para que a condensação não pingue na eletrônica.",
      "Identifique cada cabo nas duas pontas antes de subir na escada duas vezes.",
    ] },
    { text: "Erros comuns" },
    { html: 'Sondas presas com abraçadeira nos trilhos metálicos da porta, apoiadas em freezers ou penduradas na frente de exaustores produzem gráficos dramáticos, mas enganosos. A <a class="text-link" href="/about/probe-demo">demonstração interativa de sondas</a> mostra como a porta e o sol afetam as zonas de forma diferente; use-a ao validar o posicionamento. Para o contexto sazonal, leia <a class="text-link" href="/about/seasonal-garage-patterns">padrões sazonais da garagem</a>.' },
  ],

  "multi-zone-garage-layout": [
    { html: 'Garagens grandes se comportam como vários microclimas. Uma média única esconde o canto mais frio, por onde passam os canos, e a vaga mais quente sob um telhado ensolarado. Várias sondas transformam um número vago em dados de zona que permitem agir.' },
    { text: "Exemplo de mapa de zonas" },
    { items: [
      "**Zona 0. Junto à porta:** capta a infiltração quando a porta abre; espere grandes variações.",
      "**Zona 1. Bancada interna:** representa onde você fica e onde as ferramentas ficam guardadas.",
      "**Terceira opcional. Teto ou parede baixa do sótão:** detecta a estratificação de ar quente no verão.",
    ] },
    { text: "Alinhamento entre firmware e dashboard" },
    { html: 'As chaves JSON <code>0</code>, <code>1</code> e <code>avg</code> correspondem a rótulos do dashboard que você configura depois de entrar: veja <a class="text-link" href="/about/probe-mapping-labels">mapeamento e rótulos das sondas</a>. A média é um retrato prático para o histórico, não um substituto para conferir cada zona durante ondas de frio.' },
    { html: 'A fiação com duas sondas e o layout do LCD são abordados em <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 e display LCD</a> e <a class="text-link" href="/about/dual-probe-averaging">lógica de média com duas sondas</a>.' },
    { text: "Quando adicionar outra sonda" },
    { items: [
      "**Garagem em dois níveis:** o piso e o mezanino podem diferir em 5,5 °C (10 °F) em noites calmas de inverno.",
      "**Parede compartilhada com a casa:** a divisória interna pode ficar mais quente que a vaga externa.",
      "**Canto de oficina com uso de soprador térmico:** isole picos ocasionais das tendências da garagem inteira.",
    ] },
  ],

  "probe-mapping-labels": [
    { html: 'O JSON bruto expõe as sondas como chaves numéricas. O dashboard traduz essas chaves em rótulos como “Parede norte” ou “Vaga da porta”, para que os visitantes entendam o que estão lendo sem decorar os índices do firmware.' },
    { text: "Configurando os mapeamentos" },
    { html: 'Usuários conectados adicionam URLs de feed HTTPS nas configurações de feeds de temperatura do dashboard, detalhadas em <a class="text-link" href="/about/configuring-temperature-feeds">configurando feeds de temperatura</a>. Cada chave de sonda ativada recebe um nome de exibição. Erros de digitação nas chaves escondem leituras sem aviso mesmo com o feed funcionando, então confira com a saída do curl ou com o <a class="text-link" href="/about/json-probe-output-schema">esquema de saída JSON das sondas</a>.' },
    { text: "Convenções de nomes" },
    { items: [
      "Inclua **local e altura** se as zonas forem parecidas (“Parede leste, alto”).",
      "Mantenha os nomes curtos para os cartões de estatística no celular.",
      "Documente o mapeamento de GPIO para chave na bancada, pensando no seu eu do futuro.",
      "Use a chave de média só para o histórico resumido, não como rótulo de zona.",
    ] },
    { text: "Guias relacionados" },
    { html: 'Comece por <a class="text-link" href="/about/temperature-probes">sondas de temperatura e seus usos</a> e depois siga <a class="text-link" href="/about/home-page-probe-fetch">busca das sondas na página inicial</a> para ver como os mapeamentos chegam à página inicial pública.' },
  ],

  "garage-door-temperature-swings": [
    { html: 'A porta da garagem é o maior buraco no envelope térmico. Abri-la troca um grande volume de ar interno pelas condições externas em segundos, muitas vezes mais rápido do que o resto da estrutura reage. As sondas perto da porta registram isso com clareza; as mais distantes podem mal perceber uma única abertura curta.' },
    { text: "O que as sondas mostram" },
    { html: 'Espere quedas bruscas no inverno ou saltos de umidade no verão quando o ar externo frio ou úmido entra. Picos curtos durante saídas rápidas são normais. Sessões de trabalho prolongadas com a porta aberta podem levar a vaga inteira para perto do ponto de orvalho externo: fique de olho na condensação nas ferramentas de metal depois.' },
    { text: "Separando o sinal de erros de posicionamento" },
    { html: 'Se todos os picos diários coincidem com os horários de ida e volta do trabalho, sua sonda junto à porta está fazendo o trabalho dela. Se a sonda interna repete a mesma amplitude, considere mudá-la de lugar: veja <a class="text-link" href="/about/probe-mounting-enclosures">montagem das sondas</a>. Compare os padrões com a <a class="text-link" href="/about/temperature-changes">visão geral das mudanças de temperatura</a> e com a opção de porta da <a class="text-link" href="/about/probe-demo">demonstração de sondas</a>.' },
    { text: "Mitigação sem hardware novo" },
    { items: [
      "**Vedação** na porta reduz a infiltração entre uma abertura e outra.",
      "Uma **sonda interna** na parede oposta mostra até onde a onda chega.",
      "**Gráficos de histórico** ajudam a distinguir eventos isolados de perda de calor crônica: veja <a class=\"text-link\" href=\"/about/history-dashboard-browsing\">navegação no histórico do dashboard</a>.",
    ] },
  ],

  "sun-load-garage-walls": [
    { html: 'A carga solar aquece paredes opacas mesmo quando a temperatura do ar externo é moderada. Revestimentos escuros, chapas sem isolamento e portas metálicas armazenam calor que vaza para dentro por horas depois do pico de temperatura externa. As sondas em paredes voltadas para o sol muitas vezes atingem o pico mais tarde do que o aplicativo de previsão do tempo sugere.' },
    { text: "Padrões sazonais" },
    { items: [
      "**Verão:** a temperatura interna da garagem pode passar da máxima externa no fim da tarde.",
      "**Inverno:** o sol baixo ainda pode aquecer as paredes voltadas para o sol em dias limpos.",
      "**Meia-estação:** grande variação entre dia e noite, com máxima interna atrasada.",
    ] },
    { text: "Implicações para o monitoramento" },
    { html: 'Combine sondas junto à parede com uma zona interna mais protegida para separar a deriva causada pelo sol das tendências da garagem inteira. <a class="text-link" href="/about/seasonal-garage-patterns">Padrões sazonais</a> explica como ler um histórico de vários meses sem exagerar na reação a uma única tarde quente.' },
    { text: "Dicas de posicionamento das sondas" },
    { html: 'Evite montar direto em drywall castigado pelo sol voltado para o sul ou o oeste. Alguns centímetros de afastamento dentro de uma caixa ventilada ainda acompanham a influência da parede sem cozinhar o sensor. O <a class="text-link" href="/about/multi-zone-garage-layout">layout com várias zonas</a> ajuda a dedicar uma sonda à parede ensolarada e outra a uma referência na sombra.' },
  ],

  "infiltration-wind-drafts": [
    { html: 'Vazamentos de ar e diferenças de pressão causadas pelo vento movimentam o ar da garagem mesmo quando o portão fica fechado. Frestas ao redor da porta, aberturas de ventilação no beiral e entradas de serviço mal vedadas deixam o ar externo entrar rente ao chão e por trás das prateleiras.' },
    { text: "Vento versus aberturas da porta" },
    { html: 'As aberturas da porta produzem picos curtos e acentuados ligados à atividade das pessoas. Um vento constante numa noite fria cria uma deriva mais lenta, sobretudo nas sondas perto da base da porta ou da parede externa. Compare com <a class="text-link" href="/about/garage-door-temperature-swings">variações causadas pela porta da garagem</a> para saber qual fator domina.' },
    { text: "O que observar nos dados" },
    { items: [
      "**Patamares durante a noite** mais frios que a previsão costumam indicar infiltração crônica.",
      "**A umidade sobe** quando o ar externo quente e úmido substitui o ar interno seco do inverno.",
      "**Diferença entre zonas** nas sondas da porta e do interior revela caminhos de corrente de ar.",
    ] },
    { text: "Próximos passos" },
    { html: 'Use os <a class="text-link" href="/about/historical-data">dados históricos</a> para relacionar semanas de vento com as temperaturas mínimas. O planejamento contra congelamento fica em <a class="text-link" href="/about/freeze-protection-thresholds">limites de proteção contra congelamento</a>, depois que você conhecer o piso típico causado pelas infiltrações.' },
  ],

  "seasonal-garage-patterns": [
    { html: 'As garagens acompanham as estações com atraso e amortecimento. Vagas sem climatização seguem mais de perto os extremos externos no inverno e ficam atrás do pico de calor do verão quando o isolamento e a massa térmica suavizam as variações. Um histórico longo deixa esses ritmos evidentes.' },
    { text: "Risco de congelamento no inverno" },
    { html: 'Canos e produtos químicos se importam com mínimas prolongadas, não com uma única hora fria. Revise as mínimas semanais no histórico do dashboard em vez de olhar as leituras do meio-dia. Combine com os <a class="text-link" href="/about/freeze-protection-thresholds">limites de proteção contra congelamento</a> para ter pontos de corte que permitam agir.' },
    { text: "Acúmulo de calor no verão" },
    { items: [
      "**Picos da tarde** muitas vezes chegam depois da máxima externa quando a <a class=\"text-link\" href=\"/about/sun-load-garage-walls\">carga solar</a> domina.",
      "**O resfriamento noturno** pode travar se a vaga nunca expulsa totalmente o ar quente.",
      "**A umidade** pode subir quando o ar quente retém mais vapor perto dos objetos guardados.",
    ] },
    { text: "Usando bem o histórico" },
    { html: 'Exporte em CSV para comparar ano a ano: veja <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportação CSV e análise em planilha</a>. Planejar por estação é melhor do que reagir a cada pequena oscilação diária na página inicial.' },
  ],

  "history-dashboard-browsing": [
    { html: 'As leituras ao vivo respondem “como está agora?”. O histórico responde “quão ruim foi a semana passada?”. O dashboard para usuários conectados mostra em gráficos as linhas armazenadas no Supabase, para que você vá das últimas horas a tendências de vários meses sem consultar a sonda de novo a cada carregamento de página.' },
    { text: "O que é armazenado" },
    { html: 'Cada registro guarda as chaves das sondas, temperatura, umidade e horários sempre que o site consulta os feeds configurados. As inserções são descritas em <a class="text-link" href="/about/supabase-history-inserts">inserções de histórico no Supabase</a>. Nem toda visualização de página chega às suas sondas: a consulta roda em um agendamento no servidor.' },
    { text: "Lendo os gráficos" },
    { items: [
      "**Compare as zonas** para ver se um canto é sempre o mais frio.",
      "**Olhe as noites** para avaliar o risco de congelamento, em vez dos picos do dia.",
      "**Identifique lacunas** que podem indicar falhas no feed: veja <a class=\"text-link\" href=\"/about/debugging-stale-readings\">depurando leituras desatualizadas</a>.",
    ] },
    { text: "Exportar para uma análise mais profunda" },
    { html: 'Assinantes liberam a exportação CSV para tabelas dinâmicas e gráficos personalizados em planilhas. Detalhes: <a class="text-link" href="/about/stripe-csv-subscription">assinatura de CSV via Stripe</a> e <a class="text-link" href="/about/csv-export-spreadsheet-analysis">análise da exportação CSV</a>.' },
  ],

  "csv-export-spreadsheet-analysis": [
    { html: 'Os gráficos no navegador são práticos; a exportação CSV serve para as perguntas que a interface embutida não responde. Planilhas permitem calcular graus-hora, cruzar com arquivos de dados meteorológicos e compartilhar conjuntos de dados enxutos com prestadores de serviço ou seguradoras.' },
    { text: "Colunas típicas da exportação" },
    { html: 'As exportações incluem horários, identificadores das sondas, valores em Fahrenheit e Celsius e umidade, quando disponível. Agrupe por intervalos de tempo ao juntar com arquivos CSV meteorológicos externos. O acesso por assinatura é gerenciado pela <a class="text-link" href="/about/stripe-csv-subscription">cobrança via Stripe</a>.' },
    { text: "Ideias de análise" },
    { items: [
      "**Temperatura mínima semanal** por zona para planejar contra congelamento.",
      "**Detecção de aberturas da porta** cruzando quedas bruscas com o seu próprio registro de atividades.",
      "**Comparação antes/depois do isolamento** usando o mesmo período, ano a ano.",
    ] },
    { text: "Dicas de fluxo de trabalho" },
    { items: [
      "Importe no **LibreOffice Calc** ou no Excel; congele os painéis na coluna de horário.",
      "Use tabelas dinâmicas para agregar por **hora do dia** e encontrar janelas crônicas de frio.",
      "Guarde as exportações brutas: refaça os gráficos quando as perguntas mudarem.",
    ] },
  ],

  "freeze-protection-thresholds": [
    { html: 'Danos por congelamento acontecem quando o ar ou as zonas perto dos canos ficam abaixo de 0 °C (32 °F) por tempo suficiente para a água se expandir. As sondas da garagem medem o ar, que normalmente está alguns graus mais quente do que o líquido dentro de uma parede externa, então inclua uma margem em qualquer limite de alerta.' },
    { text: "Escolhendo os limites" },
    { html: 'Muitos proprietários observam temperaturas do ar prolongadas abaixo de 2–3 °C (35–38 °F) em vez de reagir a uma única queda para −0,5 °C (31 °F) durante uma abertura da porta. Use a <a class="text-link" href="/about/history-dashboard-browsing">navegação no histórico</a> para procurar patamares durante a noite, não picos.' },
    { text: "Regras por zona" },
    { items: [
      "**Sonda junto à porta:** espere quedas breves; não trate cada pico como emergência.",
      "**Sonda interna / na parede dos canos:** limite mais rigoroso; esta zona é a que melhor representa o risco.",
      "**Chave de média:** um resumo útil, mas pode esconder um canto frio: confira cada zona.",
    ] },
    { text: "Monitoramento relacionado" },
    { html: 'Entenda os fatores com <a class="text-link" href="/about/seasonal-garage-patterns">padrões sazonais</a> e <a class="text-link" href="/about/infiltration-wind-drafts">infiltração</a>. A confiabilidade do hardware também importa: as <a class="text-link" href="/about/dht22-read-errors-retries">novas tentativas do DHT22</a> evitam alarmes falsos por leituras ruins. Os sensores de vazamento / inundação avisam automaticamente quando detectam água; porta, movimento, energia e qualidade do ar precisam de uma regra personalizada em Dashboard → Alerts. Para saber quantas horas faltam até a sonda chegar ao congelamento, veja <a class="text-link" href="/about/time-to-freeze">tempo até o congelamento</a>.' },
  ],

  "arduino-ide-setup": [
    { html: 'O desenvolvimento do firmware começa na bancada, com alimentação USB e registro pela serial. A Arduino IDE (ou o PlatformIO) compila os sketches em C++, grava o Uno e abre um monitor serial para as primeiras verificações antes de a placa ir para o espaço monitorado.' },
    { text: "Placa e bibliotecas" },
    { items: [
      "**Placa:** Arduino Uno (ou compatível) com flash suficiente para as pilhas de Ethernet + LCD.",
      "**Bibliotecas:** DHT sensor library, LiquidCrystal e a pilha Ethernet/W5100, como no sketch do repositório.",
      "**Porta:** selecione a porta serial USB correta depois de conectar o cabo de programação.",
    ] },
    { text: "Checklist da primeira gravação" },
    { items: [
      "Confirme que a compilação sai **sem erros** antes de desconectar a fiação da bancada.",
      "Abra o monitor serial a **9600 baud** (ou o padrão do sketch) e confirme as mensagens de inicialização.",
      "Confirme que o LCD mostra valores ao vivo: veja <a class=\"text-link\" href=\"/about/lcd-local-display-format\">formato do display LCD</a>.",
      "Teste o endpoint JSON com curl antes de montar: o esquema está em <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema de saída JSON das sondas</a>.",
    ] },
    { text: "Código-fonte e contexto da fiação" },
    { html: 'O firmware de referência fica no repositório do projeto no GitHub, com link na <a class="text-link" href="/about/arduino-sketches">visão geral dos sketches do Arduino</a>. Monte a protoboard primeiro seguindo os guias de <a class="text-link" href="/about/arduino-circuit-wiring">fiação do circuito</a> e <a class="text-link" href="/about/arduino-pin-wiring">fiação dos pinos</a>.' },
  ],

  "sketch-polling-main-loop": [
    { html: 'O loop principal equilibra a leitura dos sensores, a atualização do LCD e o serviço HTTP sem bloquear nenhuma tarefa por tempo demais. As leituras do DHT22 levam centenas de milissegundos; o tratamento da Ethernet precisa continuar ágil o bastante para que as consultas do dashboard não expirem.' },
    { text: "Estrutura típica do loop" },
    { items: [
      "**Verificar o timer:** se o intervalo de leitura passou, leia cada DHT22 com novas tentativas.",
      "**Atualizar o LCD:** atualize as linhas da sonda 0, da sonda 1 e da média opcional.",
      "**Servir HTTP:** interprete as requisições dos clientes e retorne o JSON em cache.",
      "**Watchdog / reconexão:** reinicie ou reinicialize a Ethernet se o link cair.",
    ] },
    { text: "Restrições de tempo" },
    { html: 'Respeite o mínimo de dois segundos entre leituras do DHT22 em cada sensor. Escalone as sondas, se necessário. A lógica de média está documentada em <a class="text-link" href="/about/dual-probe-averaging">média com duas sondas</a>. Quando uma leitura falhar, deixe de atualizar aquela chave em vez de publicar NaN.' },
    { text: "Depuração pela serial" },
    { html: 'Registre falhas de leitura e o estado da Ethernet durante o desenvolvimento. Depois da instalação, conte com o <a class="text-link" href="/about/debugging-stale-readings">diagnóstico de leituras desatualizadas</a> do lado do site. Caminhos de recuperação: <a class="text-link" href="/about/firmware-watchdog-recovery">recuperação por watchdog no firmware</a>.' },
  ],

  "json-probe-output-schema": [
    { html: 'Os sistemas que consomem os dados (relays em Python, rotas de busca do Astro e mapeamentos do dashboard) todos esperam um formato JSON estável. Mudar as chaves sem atualizar quem as consome quebra os rótulos das sondas e as inserções no histórico sem nenhum aviso.' },
    { text: "Documento canônico" },
    {},
    { text: "Significado dos campos" },
    { items: [
      "**Chaves numéricas** correspondem aos índices das sondas no firmware e às entradas de mapeamento do dashboard.",
      "**f / c:** Fahrenheit e Celsius da mesma amostra.",
      "**h:** umidade relativa, em porcentagem, daquela sonda.",
      "**avg:** média apenas das sondas saudáveis; omita ou congele se um sensor estiver offline.",
    ] },
    { text: "Formatos alternativos (detectados automaticamente)" },
    { html: 'A ingestão por push e os feeds por pull também aceitam <strong>SenML JSON</strong> (array RFC 8428 com unidades <code>Cel</code> / <code>%RH</code>) e respostas <strong>Home Assistant REST</strong> (<code>state</code> + <code>attributes.unit_of_measurement</code>) quando a raiz nativa <code>temp</code> não existe. Exemplos ao vivo: <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>. Detalhes: <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a>.' },
    { text: "Consumidores" },
    { html: 'A <a class="text-link" href="/about/home-page-probe-fetch">busca da página inicial</a> lê essa estrutura para os cartões públicos. Os <a class="text-link" href="/about/python-feeds">feeds em Python</a> podem manter o mesmo payload em cache. Mapeie os rótulos pelo <a class="text-link" href="/about/probe-mapping-labels">mapeamento das sondas</a>.' },
  ],

  "firmware-watchdog-recovery": [
    { html: 'O hardware da garagem roda sem supervisão por meses. Travamentos raros (paradas do driver Ethernet, fragmentação de memória ou bloqueios no barramento dos sensores) saem mais baratos de resolver com um reset por watchdog do que com uma subida na escada. Um reset temporizado reinicia o microcontrolador e reinicializa os shields e os sensores.' },
    { text: "Quando o watchdog ajuda" },
    { items: [
      "**Travamento da pilha de rede** depois de piscadas de energia no roteador.",
      "**Loop infinito de novas tentativas** com a linha de dados do DHT22 desconectada.",
      "**Fila de clientes HTTP** acumulada no W5100 após consultas constantes da nuvem.",
    ] },
    { text: "Notas de implementação" },
    { html: 'Alimente o watchdog só quando o loop principal completar um ciclo inteiro: leitura dos sensores, atualização do LCD e manutenção do HTTP. Alimentá-lo com frequência demais mascara travamentos reais. Combine com a renovação de DHCP e a lógica de envio do JSON descritas em <a class="text-link" href="/about/sketch-polling-main-loop">loop principal de leitura do sketch</a>.' },
    { text: "O que esperar na operação" },
    { html: 'Espere uma breve interrupção do JSON durante a reinicialização: segundos, não minutos. A <a class="text-link" href="/about/debugging-stale-readings">depuração de leituras desatualizadas</a> distingue as lacunas de reinicialização de erros de configuração do feed. Notas sobre empilhamento: <a class="text-link" href="/about/ethernet-shield-stacking">empilhamento do shield Ethernet</a>.' },
  ],

  "breadboard-power-rails": [
    { html: 'A protoboard sem solda distribui 5 V e terra do Arduino para o LCD, os pull-ups do DHT22, o potenciômetro de contraste e os componentes de apoio do shield Ethernet. Trilhos de alimentação limpos reduzem caracteres estranhos no LCD e timeouts dos sensores.' },
    { text: "Layout dos trilhos" },
    { items: [
      "**Trilho vermelho:** 5 V do pino 5V do Arduino (USB ou fonte no conector P4 quando instalada).",
      "**Trilho azul:** terra comum ligado ao GND do Arduino.",
      "**Jumpers:** fios curtos e do mesmo comprimento quando possível; um único ponto de terra em estrela na placa.",
    ] },
    { text: "Alimentação do LCD e dos sensores" },
    { html: 'O LCD 16×2 consome pouca corrente; o DHT22 tem picos durante a conversão. Se os cabos forem longos até sondas remotas, considere uma fonte de 5 V dedicada com terra comum em vez de sobrecarregar o regulador do Uno. A fiação do potenciômetro de contraste compartilha o terra: veja <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO do LCD</a>.' },
    { text: "Verificação na bancada" },
    { html: 'Meça a tensão dos trilhos sob carga antes de fechar um gabinete. Os passos de diagnóstico estão em <a class="text-link" href="/about/circuit-wiring-troubleshooting">solução de problemas na fiação do circuito</a>. Visão geral completa: <a class="text-link" href="/about/arduino-circuit-wiring">fiação do circuito Arduino</a>.' },
  ],
} satisfies AboutExpandedOverlay;
