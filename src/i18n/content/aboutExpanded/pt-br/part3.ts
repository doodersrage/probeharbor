import type { AboutExpandedOverlay } from "../index";

export default {
  "stored-vehicle-heat": [
    { html: 'Estacionar um carro quente em uma garagem fechada depois de rodar despeja calor sensível no volume de ar e aquece as superfícies próximas. Sondas montadas na mesma parede do veículo ou acima do capô podem marcar valores altos por uma a três horas, enquanto o resto da vaga volta às temperaturas influenciadas pelo ambiente externo. Isso é física real, não erro de calibração.' },
    { alt: "Vista de cima de uma garagem com uma coluna de calor saindo de um carro recém-estacionado perto de uma sonda", caption: "Um veículo quente funciona como uma fonte de calor localizada que eleva as leituras das sondas próximas por horas." },
    { text: "Linha do tempo típica" },
    { items: [
      "**Primeiros 30 minutos:** o maior aumento de temperatura do ar perto do veículo.",
      "**1–3 horas:** queda gradual; o capô metálico continua irradiando depois que o ar se mistura.",
      "**Durante a noite:** o veículo entra em equilíbrio; as sondas devem voltar às <a class=\"text-link\" href=\"/about/seasonal-garage-patterns\">referências sazonais</a>.",
    ] },
    { text: "Separando de outros fatores" },
    { html: 'As aberturas da porta causam movimentos **bruscos e simultâneos** nas zonas; o calor do veículo é **localizado**, e só as sondas próximas sobem. A <a class="text-link" href="/about/sun-load-garage-walls">carga solar</a> atinge o pico à tarde sem relação com os horários de chegada. Anote os horários de chegada quando usar a <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportação CSV</a> para gráficos de investigação.' },
    { text: "Orientações de posicionamento" },
    { html: 'Monte uma sonda de referência na parede oposta ao lugar onde você costuma estacionar, seguindo a <a class="text-link" href="/about/probe-mounting-enclosures">montagem das sondas</a>. Evite pendurar sensores logo acima do compartimento do motor se você precisa de métricas noturnas de congelamento estáveis.' },
  ],

  "spotting-data-gaps": [
    { html: 'O histórico salvo só é tão completo quanto o pipeline de consulta. Falta de energia no Arduino, relay fora do ar, autenticação mal configurada ou falhas de inserção no Supabase deixam lacunas. Aprender a distinguir **dados ausentes** de **temperatura estável** evita uma falsa sensação de segurança durante ondas de frio e discussões de cobrança sobre a completude do CSV.' },
    { alt: "Gráfico com uma lacuna visível e um trecho de linha plana identificados de formas diferentes", caption: "Lacunas reais mostram horários ausentes; trechos planos podem ser leituras estáveis válidas: aprenda a diferença visual." },
    { text: "Causas comuns de lacunas" },
    { items: [
      "**Feed inacessível**: relay fora do ar ou mudança de IP; comece pela <a class=\"text-link\" href=\"/about/debugging-stale-readings\">depuração de leituras desatualizadas</a>.",
      "**Reinicialização do microcontrolador**: breve período em branco após um <a class=\"text-link\" href=\"/about/firmware-watchdog-recovery\">reset por watchdog</a>.",
      "**Inserção ignorada**: a busca na origem falhou, conforme as <a class=\"text-link\" href=\"/about/supabase-history-inserts\">regras de inserção no histórico</a>.",
      "**Conta/sessão**: carregamentos sem login não são salvos; veja <a class=\"text-link\" href=\"/about/cookie-session-lifecycle\">ciclo de vida da sessão</a>.",
    ] },
    { text: "Padrões visuais" },
    { items: [
      "**Espaço vertical em branco** nos gráficos quando o eixo do tempo pula para a frente.",
      "**Valores idênticos repetidos** podem indicar cache travado: confira o <a class=\"text-link\" href=\"/about/caching-feed-responses\">cache dos feeds</a>.",
      "**Uma zona plana enquanto as outras se movem** sugere falha de mapeamento ou do sensor.",
    ] },
    { text: "Fluxo de trabalho" },
    { html: 'Confira o JSON ao vivo com curl e depois navegue pelo <a class="text-link" href="/about/history-dashboard-browsing">histórico do dashboard</a>. Exporte pela <a class="text-link" href="/about/stripe-csv-subscription">assinatura de CSV</a> e filtre a coluna de horários em busca de descontinuidades: as técnicas estão em <a class="text-link" href="/about/charting-with-spreadsheets">gráficos em planilhas</a>.' },
  ],

  "charting-with-spreadsheets": [
    { html: 'Os gráficos embutidos no dashboard respondem às perguntas do dia a dia. Os gráficos em planilha respondem às perguntas de auditoria: “Quantas horas abaixo de 2 °C (35 °F) tivemos em janeiro passado?” ou “A umidade teve relação com as aberturas da porta?”. O CSV exportado pela <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportação CSV</a> é o ponto de partida; colunas bem organizadas fazem os gráficos serem refeitos rapidamente quando chegam dados novos.' },
    { alt: "Planilha com uma coluna de horários e um gráfico de linhas com as séries de duas sondas", caption: "Tabelas dinâmicas e gráficos de linhas transformam as linhas do CSV exportado em análises personalizadas de congelamento e umidade." },
    { text: "Cuidados na importação" },
    { items: [
      "Interprete os horários como **data e hora**, não como texto: ordene em ordem crescente antes de fazer o gráfico.",
      "Separe **probe_key** em séries distintas em vez de uma linha misturada.",
      "Mantenha as colunas de Fahrenheit e Celsius consistentes; escolha uma unidade para o eixo.",
    ] },
    { text: "Tipos de gráfico úteis" },
    { items: [
      "**Mínima móvel de 24 h** por zona para o <a class=\"text-link\" href=\"/about/freeze-protection-thresholds\">planejamento contra congelamento</a>.",
      "**Eixo duplo** com temperatura e umidade para identificar janelas de <a class=\"text-link\" href=\"/about/humidity-condensation-basics\">risco de condensação</a>.",
      "**Sobreposição semana a semana** depois de melhorias no isolamento.",
    ] },
    { text: "Cruzando dados externos" },
    { html: 'Junte o CSV de uma API de previsão do tempo pelos horários alinhados: veja <a class="text-link" href="/about/weather-api-parallel-path">caminho paralelo da API de clima</a>. Marque eventos manuais (porta aberta, carro estacionado) em uma coluna auxiliar para explicar picos causados por <a class="text-link" href="/about/garage-door-temperature-swings">variações da porta</a> ou pelo <a class="text-link" href="/about/stored-vehicle-heat">calor do veículo</a>.' },
  ],

  "serial-debugging-tips": [
    { html: 'A serial via USB é o ciclo de retorno mais rápido enquanto o Uno ainda está na bancada. Um registro bem pensado, sem inundar o monitor, mostra se há leituras com falha, atrasos no DHCP ou problemas de formatação do JSON antes de você culpar o site. Esses hábitos complementam a <a class="text-link" href="/about/arduino-ide-setup">configuração da IDE</a> e reduzem as subidas na escada depois da instalação.' },
    { alt: "Notebook conectado a um Arduino com o monitor serial mostrando linhas de log com horário", caption: "O monitor serial com a taxa de baud correta revela erros dos sensores e o estado da rede durante o desenvolvimento." },
    { text: "O que registrar" },
    { items: [
      "**Erros do DHT22** com o índice da sonda e o número de tentativas.",
      "**Link Ethernet** ativo/inativo e o IP atribuído após o DHCP.",
      "**Cliente HTTP** conectando/desconectando, não o JSON completo a cada segundo.",
      "**Alimentações do watchdog** só em builds de depuração, para verificar a saúde do loop.",
    ] },
    { text: "Temporização e baud" },
    { html: 'Ajuste o baud do monitor ao <code>Serial.begin</code> do firmware, geralmente 9600. Lembre-se da temporização do <a class="text-link" href="/about/sketch-polling-main-loop">loop principal</a>: prints excessivos deixam o loop lento e podem eles mesmos causar timeouts no DHT22. Desative os logs verbosos nos builds de produção.' },
    { text: "Depois da instalação" },
    { html: 'A serial fica indisponível no local de instalação a menos que você conecte o USB de novo: passe para as <a class="text-link" href="/about/json-probe-output-schema">verificações do JSON com curl</a> e para a <a class="text-link" href="/about/debugging-stale-readings">depuração de leituras desatualizadas no site</a>. Para problemas de rede, compare os logs de inicialização de <a class="text-link" href="/about/static-ip-vs-dhcp">IP fixo versus DHCP</a>.' },
  ],

  "library-dependencies": [
    { html: 'O sketch da garagem não é autossuficiente: ele usa drivers DHT da Adafruit ou da comunidade, a biblioteca LiquidCrystal padrão e a pilha Ethernet legada para shields W5100. Saltos de versão principal dessas bibliotecas já quebraram construtores e nomes de enum em montagens anteriores. Documentar as dependências torna possível refazer o build daqui a cinco anos, quando o notebook original já não existir.' },
    { alt: "Caixas de dependência ligando as bibliotecas DHT, LiquidCrystal e Ethernet ao sketch principal", caption: "As principais bibliotecas de terceiros cuidam do protocolo do sensor, do controle do LCD e da E/S de rede do W5100." },
    { text: "Bibliotecas principais" },
    { items: [
      "**DHT sensor library**: leituras de fio único com proteções de temporização.",
      "**LiquidCrystal**: modo LCD paralelo de 4 bits usado localmente.",
      "**Ethernet**. Pilha compatível com W5100 para servir HTTP.",
    ] },
    { text: "Fluxo de instalação" },
    { items: [
      "Use o **Library Manager** ou o ZIP do fornecedor, anotando as versões fixadas no README do seu repositório.",
      "Compile um **exemplo conhecido** de cada biblioteca antes de integrá-la ao sketch da sonda.",
      "Depois de atualizações, confira de novo o <a class=\"text-link\" href=\"/about/lcd-local-display-format\">layout do LCD</a> e o <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema JSON</a>.",
    ] },
    { text: "Alternativa com PlatformIO" },
    { html: 'O PlatformIO fixa as versões em <code>platformio.ini</code>: excelente para a reprodutibilidade. Os dois caminhos começam pela <a class="text-link" href="/about/arduino-ide-setup">configuração da Arduino IDE</a>. Detalhes do comportamento do sensor: <a class="text-link" href="/about/dht22-sensor-overview">visão geral do DHT22</a>.' },
  ],

  "static-ip-vs-dhcp": [
    { html: 'O shield Ethernet pode pedir um endereço por DHCP ao roteador da rede local ou usar um endereço fixo. O DHCP é mais fácil na primeira inicialização; um IP fixo ou uma reserva de DHCP impede que o Arduino mude de endereço depois de quedas de energia, o que quebra as URLs de origem fixadas nos <a class="text-link" href="/about/fastapi-relay-setup">relays FastAPI</a> até alguém notar leituras desatualizadas na página inicial.' },
    { alt: "Diagrama de roteador comparando a troca de concessões DHCP com um IP fixo reservado para o Arduino", caption: "Um DHCP reservado ou um IP fixo mantém a URL da sonda estável para relays e regras de firewall." },
    { text: "DHCP com reserva" },
    { html: 'Muitos roteadores associam **endereço MAC → IP fixo** e continuam usando DHCP por baixo. Isso combina a instalação plug-and-play com a estabilidade: é a opção preferida para a maioria das montagens de garagem. Anote o MAC do Uno nos logs de inicialização da serial durante a <a class="text-link" href="/about/serial-debugging-tips">depuração pela serial</a>.' },
    { text: "IP fixo de verdade no firmware" },
    { items: [
      "Fixe no sketch o IP, o gateway, a máscara de sub-rede e o DNS.",
      "Anote os valores na tampa do gabinete: o seu eu do futuro vai esquecer.",
      "Há risco de conflito se outro dispositivo assumir o mesmo IP.",
    ] },
    { text: "Impacto nos sistemas seguintes" },
    { html: 'Os relays e as <a class="text-link" href="/about/docker-relay-deployment">implantações em Docker</a> muitas vezes guardam URLs de origem da rede local. Combine IPs estáveis com <a class="text-link" href="/about/health-check-endpoints">verificações de saúde</a> e com a <a class="text-link" href="/about/firmware-watchdog-recovery">recuperação por watchdog</a> para que reinicializações breves não exijam mudanças na configuração.' },
  ],

  "ground-loop-avoidance": [
    { html: 'Terra não é “só ligar todos os fios pretos juntos”. Quando o terra do USB de programação, o retorno da fonte no conector P4, a carcaça do shield Ethernet e os terras das sondas remotas se encontram em vários pontos, pequenas correntes circulantes adicionam ruído à referência do fio único do DHT22. Um **terra em estrela único** e intencional no Uno mantém as leituras digitais estáveis e o contraste do LCD previsível.' },
    { alt: "Diagrama de fiação mostrando o terra em estrela no Arduino em comparação com laços de terra problemáticos", caption: "Leve todos os retornos a um único ponto de terra em estrela no microcontrolador, em vez de encadear os terras por vários caminhos." },
    { text: "Alimentação na bancada versus instalada" },
    { html: 'A alimentação USB na bancada compartilha o terra com o seu notebook; adicionar uma fonte no conector P4 sem planejar o terra comum pode criar laços. Antes de montar, confira os <a class="text-link" href="/about/breadboard-power-rails">trilhos de alimentação</a> em relação a uma única referência de potencial. Depois de montar, desconecte o USB quando estiver usando a fonte, se o projeto do gabinete permitir.' },
    { text: "Terra das sondas remotas" },
    { items: [
      "Passe o **GND junto com os dados** de cada sonda: não aterre as sondas localmente só na estrutura metálica da construção.",
      "Evite **aterrar as blindagens** nas duas pontas de cabos longos, a menos que siga as boas práticas de cabo blindado.",
      "Veja <a class=\"text-link\" href=\"/about/probe-cable-length-limits\">limites de comprimento de cabo</a> para a geometria dos trajetos.",
    ] },
    { text: "Diagnóstico" },
    { html: 'Se os erros desaparecem quando você toca em um fio, desconfie de problemas de referência. Depois de corrigir os terras, confira a <a class="text-link" href="/about/circuit-wiring-troubleshooting">solução de problemas no circuito</a> e as <a class="text-link" href="/about/dht22-read-errors-retries">novas tentativas do DHT22</a> antes de trocar os sensores.' },
  ],

  "enclosure-ventilation": [
    { html: 'Lacrar o Arduino em uma caixa NEMA protege da poeira, mas prende o calor do regulador linear e do chip W5100. As sondas, em uma caixa ventilada separada, precisam de aberturas para o ar ambiente sem deixar a chuva entrar. Confundir os dois tipos de gabinete causa resets da Ethernet por superaquecimento e leituras de umidade lentas: problemas diferentes com a mesma aparência de “tudo fechado na caixa”.' },
    { alt: "Dois gabinetes lado a lado: caixa ventilada da sonda e caixa do microcontrolador com venezianas e seta indicando o ventilador", caption: "As caixas das sondas respiram o ar ambiente; os gabinetes do microcontrolador expulsam o calor sem deixar a poeira entrar." },
    { text: "Orientações para a caixa do microcontrolador" },
    { items: [
      "**Venezianas ou fendas** em lados opostos para a ventilação cruzada.",
      "Mantenha o **conector P4 e o RJ45** acessíveis para manutenção.",
      "Não lacre o **shield Ethernet** contra uma parede quente voltada para o sol sem sombra.",
    ] },
    { text: "Orientações para a caixa da sonda" },
    { html: 'Siga a <a class="text-link" href="/about/probe-mounting-enclosures">montagem das sondas</a>: aberturas dimensionadas para a troca de ar, prensa-cabo voltado para baixo e sensor fora de áreas de sol direto. O calor do microcontrolador não pode dividir uma cavidade sem ventilação com o DHT22: veja <a class="text-link" href="/about/multi-zone-garage-layout">layout das zonas</a>.' },
    { text: "Interação térmica" },
    { html: 'A eletrônica quente aquece o ar próximo se for montada junto: coloque as sondas na parede externa e o microcontrolador perto do cabo do roteador. O <a class="text-link" href="/about/ground-loop-avoidance">planejamento do terra</a> continua valendo dentro da caixa.' },
  ],

  "backlight-pwm-options": [
    { html: 'A interface paralela do LCD usa RS, E e D4–D7 para o texto, conforme documentado no <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO do LCD</a>. A luz de fundo de LED é um circuito de potência, muitas vezes chaveado por um transistor, porque os pinos do Arduino não fornecem a corrente da luz de fundo diretamente. O PWM ou o escurecimento temporizado mantém o display legível à noite sem um brilho constante aquecendo o gabinete.' },
    { alt: "Esboço de circuito com um transistor NPN chaveando a luz de fundo do LCD, com pino PWM opcional", caption: "Um GPIO aciona um transistor para controlar por PWM ou ligar e desligar o circuito de LED da luz de fundo, independente das linhas de dados." },
    { text: "Padrões de fiação" },
    { items: [
      "**Pino digital direto**: só liga/desliga; o mais simples para testes na bancada.",
      "**Pino PWM**: escurecimento suave via <code>analogWrite</code> nos pinos compatíveis.",
      "**Desligamento por timer**: o firmware apaga a luz de fundo depois de alguns minutos sem atividade.",
    ] },
    { text: "Interação com o firmware" },
    { html: 'Mudanças na luz de fundo não exigem reinicializar o LiquidCrystal. Coordene com a atualização do <a class="text-link" href="/about/lcd-local-display-format">formato do display</a> para que o escurecimento não coincida com um contraste ilegível. O potenciômetro em Vo continua definindo a visibilidade dos caracteres pelos <a class="text-link" href="/about/breadboard-power-rails">trilhos de alimentação</a>.' },
    { text: "Orçamento de energia" },
    { html: 'Desligar à noite economiza pouca corrente, mas reduz o calor em <a class="text-link" href="/about/enclosure-ventilation">gabinetes fechados</a>. Garanta que os <a class="text-link" href="/about/spi-pins-ethernet-reserved">pinos SPI</a> continuem livres se escolher PWM em pinos que compartilham timers: confira o diagrama de pinos da sua placa.' },
  ],

  "jumper-wire-standards": [
    { html: 'Os jumpers de protoboard parecem todos iguais, mas a vibração na garagem causada pelo motor do portão e pelos compressores afrouxa conexões baratas. Fios dupont rígidos servem para a bancada; instalações finais se beneficiam de uma passagem de cabos contida, cores identificadas e, em alguns pontos, terminais tubulares onde os fios saem da protoboard para as sondas remotas.' },
    { alt: "Conjunto de jumpers com código de cores e pontas rígidas e flexíveis identificadas", caption: "Códigos de cores padrão e terminações mecanicamente firmes reduzem conexões intermitentes." },
    { text: "Convenções de cores" },
    { items: [
      "**Vermelho**: distribuição de 5 V.",
      "**Preto ou verde**: terra.",
      "**Amarelo/azul/verde**: linhas de dados de cada sonda: documente em <a class=\"text-link\" href=\"/about/dht22-data-line-wiring\">fiação do DHT22</a>.",
      "**Potenciômetro de contraste**: par separado; não compartilhe as cores dos dados dos sensores.",
    ] },
    { text: "Confiabilidade mecânica" },
    { html: 'Prenda os cabos com alívio de tensão antes de saírem da placa; evite forçar os soquetes do DHT22. Trajetos longos passam para par trançado, conforme o <a class="text-link" href="/about/probe-cable-length-limits">guia de comprimento de cabo</a>. Reencaixe as conexões depois de transportar tudo para o espaço monitorado.' },
    { text: "Quando deixar de usar protoboard" },
    { html: 'Instalações permanentes acabam merecendo uma placa perfurada ou uma PCB: veja a <a class="text-link" href="/about/arduino-circuit-wiring">visão geral da fiação do circuito</a>. Até lá, a <a class="text-link" href="/about/circuit-wiring-troubleshooting">solução de problemas sistemática</a> é melhor do que trocar jumpers ao acaso.' },
  ],

  "sensor-warm-up-time": [
    { html: 'Os sensores de umidade do DHT22 entram em equilíbrio com o ar ao redor depois de serem ligados. A temperatura reage mais rápido; a umidade pode levar vários minutos para chegar ao valor real, principalmente se o sensor estava guardado em um carro frio antes da instalação. O firmware e quem instala devem ignorar ou sinalizar as primeiras amostras, para que o JSON e o LCD não disparem alarmes por uma UR passageira.' },
    { alt: "Gráfico de linha do tempo mostrando a umidade se estabilizando após ligar, comparada à resposta mais rápida da temperatura", caption: "As leituras de umidade se estabilizam em alguns minutos depois de armazenamento no frio ou de uma mudança rápida de temperatura." },
    { text: "Comportamento na inicialização" },
    { html: 'Deixe de publicar a umidade nos primeiros **um a três minutos** após o reset, ou marque as leituras como em aquecimento nos logs da serial, como em <a class="text-link" href="/about/serial-debugging-tips">depuração pela serial</a>. Alinhe com o timer do <a class="text-link" href="/about/sketch-polling-main-loop">loop principal</a> para que o HTTP continue servindo a temperatura, se necessário.' },
    { text: "Gatilhos ambientais" },
    { items: [
      "**Onda de frio** depois de armazenamento em local quente: a umidade fica atrás do ar real.",
      "**Abertura da porta** misturando ar externo úmido: espere um ciclo de leitura antes de alertar.",
      "**Calor de veículo** por perto: veja <a class=\"text-link\" href=\"/about/stored-vehicle-heat\">calor de veículo estacionado</a>.",
    ] },
    { text: "Impacto para o usuário" },
    { html: 'O histórico do dashboard herda as oscilações do aquecimento se as inserções começarem imediatamente: combine com a <a class="text-link" href="/about/dht22-read-errors-retries">política de novas tentativas</a> e com as <a class="text-link" href="/about/humidity-condensation-basics">noções básicas de condensação</a> para interpretar, não para entrar em pânico.' },
  ],

  "lcd-i2c-alternative": [
    { html: 'O modo paralelo usa seis linhas GPIO, mais o acionamento da luz de fundo: pouco espaço em um Uno com o W5100 empilhado. Módulos adaptadores I²C (normalmente PCF8574) precisam só de SDA/SCL, liberando pinos para sondas extras ou para o <a class="text-link" href="/about/backlight-pwm-options">PWM da luz de fundo</a>. Em troca, você tem mais uma biblioteca, jumpers de endereço e temporização de barramento compartilhada com futuros sensores I²C.' },
    { alt: "Comparação da quantidade de pinos entre um LCD paralelo e um adaptador I²C no Arduino Uno", caption: "Os adaptadores I²C reduzem o uso de GPIO a duas linhas de dados mais a alimentação: útil quando os pinos SPI estão reservados." },
    { text: "Conta do orçamento de pinos" },
    { html: 'Revise os <a class="text-link" href="/about/spi-pins-ethernet-reserved">pinos SPI reservados</a> e o <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa do modo paralelo</a>: duas linhas de DHT22 mais seis linhas de LCD deixam pouca folga. O I²C recupera de quatro a seis pinos, dependendo da fiação.' },
    { text: "Notas de migração" },
    { items: [
      "Instale a biblioteca **LiquidCrystal I²C** e defina o endereço do adaptador (geralmente 0x27).",
      "Refaça a fiação de **SDA/SCL**. A4/A5 do Uno nas placas clássicas.",
      "Atualize os textos do display no <a class=\"text-link\" href=\"/about/lcd-local-display-format\">formato do LCD</a>: a largura em caracteres não muda.",
    ] },
    { text: "Quando continuar no paralelo" },
    { html: 'Se a sua pilha de shields já funciona e os pinos bastam, o modo paralelo continua mais simples: <a class="text-link" href="/about/arduino-dht22-lcd">visão geral do DHT22 e do LCD</a>. Considere o I²C ao adicionar uma terceira sonda ou <a class="text-link" href="/about/backlight-pwm-options">luz de fundo com PWM</a> em um mapa de pinos lotado.' },
  ],

  "weather-api-parallel-path": [
    { html: 'As sondas da garagem dizem o que aconteceu lá dentro. Um caminho paralelo por uma API de clima diz o que a atmosfera entregou: útil para relacionar a <a class="text-link" href="/about/infiltration-wind-drafts">infiltração por vento</a>, as mínimas previstas e as junções de planilha em <a class="text-link" href="/about/charting-with-spreadsheets">gráficos em planilhas</a>. Esse caminho não pode bloquear o SSR das sondas se o fornecedor de clima estiver lento.' },
    { alt: "Setas de busca em paralelo do servidor para o JSON das sondas e para a API de clima, se juntando no SSR", caption: "O servidor busca os feeds das sondas e a API de clima ao mesmo tempo, para que previsões lentas não bloqueiem as temperaturas ao vivo." },
    { text: "Estratégia de busca" },
    { html: 'Use <code>Promise.allSettled</code> ou algo equivalente: uma falha na busca das sondas ainda deve retornar a página com status 200 e um cartão de erro; uma falha do clima apenas omite a previsão na barra lateral. Os timeouts seguem os padrões da <a class="text-link" href="/about/home-page-probe-fetch">busca das sondas na página inicial</a>.' },
    { text: "Uso dos dados" },
    { items: [
      "**Só exibição**: contexto de temperatura/umidade externa no dashboard.",
      "**Enriquecimento do CSV**: junção por blocos de hora durante a análise da exportação.",
      "**Não para controle**: não dispare alertas de congelamento só com base na previsão.",
    ] },
    { text: "Segredos e cache" },
    { html: 'As chaves da API de clima ficam nos <a class="text-link" href="/about/env-secrets-cloudflare">secrets da Cloudflare</a>. Mantenha as respostas em cache por mais tempo que o TTL das sondas: o documento de <a class="text-link" href="/about/caching-feed-responses">cache dos feeds</a> compara as necessidades de atualização.' },
  ],
} satisfies AboutExpandedOverlay;
