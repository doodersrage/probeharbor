import type { AboutPageOverlay } from "../index";

/** Brazilian Portuguese about-page metadata, part 1 (core pages and probe/sensor guides). */
export default {
  "temperature-probes": {
    title: "Sondas de temperatura e seus usos",
    description:
      "Como as sondas de temperatura funcionam em garagens, oficinas, sótãos e porões rasos, onde instalá-las e por que vários sensores dão mais confiabilidade.",
    summary:
      "Tipos de sonda, estratégias de posicionamento e por que tirar a média de vários sensores faz diferença em espaços sem aquecimento.",
  },
  "temperature-changes": {
    title: "Variações de temperatura e suas causas",
    description:
      "Entenda as oscilações diárias, as mudanças de estação e as variações bruscas em espaços sem aquecimento, causadas pelo clima e pela física da construção.",
    summary:
      "Sol, infiltração de ar, portas, climatização e calor acumulado explicam a maior parte das variações em garagens, sótãos e oficinas.",
  },
  "historical-data": {
    title: "Como usar o histórico de temperatura",
    description:
      "Por que as leituras salvas importam para análise de tendências, proteção contra congelamento, checagem de equipamentos e exportação em CSV.",
    summary:
      "Transforme leituras pontuais em gráficos, alertas e registros de longo prazo para manutenção e planejamento sazonal.",
  },
  "arduino-sketches": {
    title: "Arduino e sketches para Arduino",
    description:
      "Arquitetura de firmware para sondas de temperatura conectadas à rede usando placas Arduino e sensores de umidade.",
    summary:
      "Os sketches leem as sondas, geram JSON e publicam as leituras via HTTPS, do espaço monitorado para a web.",
  },
  "arduino-circuit-wiring": {
    title: "Visão geral da fiação do circuito Arduino",
    description:
      "Fiação geral de um Arduino Uno com shield Ethernet, trilhas de alimentação da protoboard, contraste do LCD e dois sensores DHT22.",
    summary:
      "Como alimentação USB, protoboard, potenciômetro de contraste, LCD, sensores e shield Ethernet se encaixam.",
  },
  "arduino-pin-wiring": {
    title: "Fiação do Arduino pino a pino",
    description:
      "Atribuição exata de GPIO para o LCD 16×2, as linhas de dados dos DHT22, o transistor da luz de fundo e os pinos SPI reservados.",
    summary:
      "Mapa pino a pino que corresponde ao construtor LiquidCrystal e às linhas de dados dos sensores no firmware.",
  },
  "arduino-dht22-lcd": {
    title: "Sensores DHT22 e display LCD",
    description:
      "Leitura de dois DHT22, exibição local no LCD, controle da luz de fundo e como o shield Ethernet divide o conector.",
    summary:
      "Por que o LCD mostra as duas sondas separadamente enquanto os feeds JSON enviam ambas para o site.",
  },
  "python-feeds": {
    title: "Scripts Python e feeds JSON",
    description:
      "Serviços de relay em FastAPI, cache com Redis e ferramentas em Python que ficam entre as sondas e o dashboard.",
    summary:
      "Scripts de back-end padronizam o JSON das sondas, guardam respostas em cache e expõem endpoints HTTPS estáveis.",
  },
  "data-flow": {
    title: "Fluxo de dados de ponta a ponta",
    description:
      "Acompanhe uma leitura do fio da sonda, passando pelos feeds JSON e pelo armazenamento, até o dashboard de histórico após o login.",
    summary:
      "Hardware, relay, busca pelo site, armazenamento no Supabase e exportação em CSV em um único pipeline.",
  },
  "accounts-and-dashboard": {
    title: "Contas, assinaturas e ferramentas do dashboard",
    description:
      "Checklist de configuração após o login, dispositivos e sensores, alertas, residências, links de compartilhamento, planos Stripe e ferramentas de admin.",
    summary:
      "Crie uma conta, conecte o hardware, configure alertas, convide os moradores e faça upgrade quando precisar dos canais do Pro.",
  },
  "ingest-and-webhooks": {
    title: "API de ingestão e webhooks de alerta",
    description:
      "Envie leituras ao ProbeHarbor pela API de ingestão (JSON nativo, SenML ou Home Assistant REST) e mande alertas para Discord, IFTTT ou Home Assistant.",
    summary:
      "Chaves de API por dispositivo, payloads tipados, detecção automática de SenML e HA REST, webhooks HMAC de saída e canais de alerta do Pro.",
  },
  "thermostat-oauth": {
    title: "OAuth de termostatos Nest e Ecobee (operadores)",
    description:
      "Ative o OAuth do Nest e do Ecobee na sua instância do ProbeHarbor para que residências Pro conectem termostatos e tenham contexto interno nos alertas.",
    summary:
      "Device Access Console, app de desenvolvedor Ecobee, URIs de redirecionamento e secrets do Worker para NEST_* e ECOBEE_CLIENT_ID.",
  },
  "adding-devices": {
    title: "Adicionar dispositivos push e pull",
    description:
      "Passo a passo: crie um dispositivo de ingestão push ou um feed pull HTTPS, associe chaves JSON aos rótulos da Home e confira as leituras ao vivo.",
    summary:
      "Escolha push ou pull, crie o dispositivo ou feed, envie (POST) ou puxe as leituras e confirme que a Home mostra valores ao vivo.",
  },
  "mqtt-bridge": {
    title: "Receita de ponte MQTT",
    description:
      "Mantenha o Mosquitto ou o MQTT do Home Assistant na sua rede local e espelhe as leituras no ProbeHarbor via HTTPS para alertas de congelamento e vazamento.",
    summary:
      "POST /api/ingest/mqtt, rest_command do Home Assistant e fluxo no Node-RED: rode os dois em paralelo sem expor seu broker.",
  },
  "install-pwa": {
    title: "Instalar como app (PWA)",
    description:
      "Instale o ProbeHarbor como PWA no computador, Android ou iOS para abrir o dashboard mais rápido e receber, se quiser, alertas push no navegador.",
    summary:
      "Passos de instalação para computador, Android e iOS, além dos limites do Web Push em aparelhos Apple.",
  },
  "temperature-probe-case-study": {
    title: "Estudo de caso de sondas de temperatura",
    description:
      "Como duas sondas DHT22 em uma garagem de verdade viraram um sistema de monitoramento confiável, da primeira protoboard aos feeds JSON e gráficos.",
    summary:
      "Uma montagem real: decisões de posicionamento, versões do firmware e o que os dados mostraram depois da instalação.",
  },
  "dht22-sensor-overview": {
    title: "Visão geral do sensor DHT22",
    description:
      "Como funciona o sensor de umidade e temperatura DHT22, os limites da sua precisão e por que ele serve para garagens, oficinas e sótãos.",
    summary: "Sensor digital de um fio, precisão típica e intervalos mínimos entre leituras.",
  },
  "probe-mounting-enclosures": {
    title: "Fixação e caixas para sondas",
    description:
      "Instale as sondas para ter leituras estáveis em espaços sem aquecimento: altura, proteção contra sol e correntes de ar e caixas ventiladas.",
    summary: "Na altura dos ombros, longe de portas e fontes de calor, em caixas que deixam o ar circular.",
  },
  "multi-zone-garage-layout": {
    title: "Garagem dividida em várias zonas",
    description:
      "Planeje várias zonas de sondas para captar a diferença entre piso e teto, as oscilações perto da porta e a área da bancada.",
    summary:
      "Divida a garagem em zonas que façam sentido, em vez de diluir na média o sinal de que você precisa.",
  },
  "probe-mapping-labels": {
    title: "Mapeamento de sondas e rótulos no dashboard",
    description:
      "Associe as chaves JSON das sondas a nomes legíveis no dashboard para que os cards da página inicial correspondam aos locais reais.",
    summary:
      "Chaves JSON estáveis, rótulos amigáveis e organização por feed em instalações com várias sondas.",
  },
  "garage-door-temperature-swings": {
    title: "Oscilações de temperatura pelo portão da garagem",
    description:
      "Por que abrir o portão da garagem muda rapidamente a temperatura e a umidade, e como interpretar os picos nas sondas.",
    summary: "Infiltração de ar e estratificação térmica quando a maior abertura da parede se move.",
  },
  "sun-load-garage-walls": {
    title: "Sol nas paredes da garagem",
    description:
      "Como o sol nas paredes voltadas para sul e oeste atrasa o pico de calor da tarde, faz as sondas variarem e dá falsa segurança em relação ao clima externo.",
    summary:
      "Paredes aquecidas, picos internos atrasados e por que só o clima externo engana.",
  },
  "infiltration-wind-drafts": {
    title: "Infiltração, vento e correntes de ar",
    description:
      "Como vazamentos de ar e a pressão do vento movimentam o ar da garagem, e as leituras das sondas, mesmo com o portão fechado em uma noite fria.",
    summary:
      "Vazamentos constantes versus abertura do portão, e o que as sondas revelam sobre os caminhos das correntes de ar.",
  },
  "seasonal-garage-patterns": {
    title: "Padrões sazonais na garagem",
    description:
      "Leia meses de histórico no ProbeHarbor: mínimas de inverno, picos de verão e meia-estação, para que uma única noite fria não distorça suas decisões.",
    summary:
      "Contexto de longo prazo para que picos de um único dia não levem a decisões ruins.",
  },
  "history-dashboard-browsing": {
    title: "Navegar pelo dashboard de histórico",
    description:
      "Navegue pelo histórico paginado das sondas no ProbeHarbor, leia as colunas de feed e sonda e encontre lacunas antes de confiar em um CSV exportado.",
    summary:
      "Transforme as leituras salvas em uma linha do tempo fácil de ler dentro do dashboard, após o login.",
  },
  "csv-export-spreadsheet-analysis": {
    title: "Exportação CSV e análise em planilhas",
    description:
      "Exporte o histórico completo para gráficos, tabelas dinâmicas, auditorias de congelamento e comparações sazonais no Excel ou no Sheets.",
    summary: "Fluxos de CSV para assinantes e admins analisarem os dados fora do site.",
  },
  "freeze-protection-thresholds": {
    title: "Limites de proteção contra congelamento",
    description:
      "Use as mínimas da madrugada e a comparação entre zonas para proteger encanamentos e itens guardados antes que haja danos.",
    summary:
      "Defina as temperaturas de risco com base no histórico, em vez de adivinhar pela previsão do tempo.",
  },
  "arduino-ide-setup": {
    title: "Configurar a Arduino IDE e gravar o firmware",
    description:
      "Instale a Arduino IDE, selecione a placa e a porta, instale as bibliotecas e grave o sketch da sonda.",
    summary: "Montagem na bancada antes de instalar o hardware no espaço.",
  },
  "sketch-polling-main-loop": {
    title: "Leitura periódica e loop principal do sketch",
    description:
      "Veja como os timers do firmware Arduino leem as sondas DHT22, servem JSON por HTTP e atualizam o LCD sem travar o loop principal.",
    summary: "Loop não bloqueante para sensores, rede e display local.",
  },
  "json-probe-output-schema": {
    title: "Esquema JSON de saída das sondas",
    description:
      "Chaves JSON estáveis, unidades de temperatura, campos de umidade e cálculo da média para quem consome os dados no dashboard.",
    summary: "O contrato entre o firmware e todos os clientes que consomem os dados, incluindo este site.",
  },
  "firmware-watchdog-recovery": {
    title: "Watchdog e recuperação do firmware",
    description:
      "Recupere-se de raros travamentos de rede e erros no barramento do sensor sem subir na escada para reiniciar a placa.",
    summary: "Timers de watchdog, novas tentativas e estratégias de reinício para instalações sem supervisão.",
  },
  "breadboard-power-rails": {
    title: "Trilhas de alimentação da protoboard",
    description:
      "Distribua a alimentação USB ou de fonte P4 pela protoboard para sensores, LCD e resistores de pull-up, com terra comum.",
    summary: "Trilhas de alimentação limpas reduzem o ruído que aparece como picos falsos de umidade.",
  },
  "ethernet-shield-stacking": {
    title: "Encaixe do shield Ethernet",
    description:
      "Encaixe o shield W5100 no Uno, preserve o espaço do conector ICSP e afaste os cabos das fontes de calor.",
    summary: "Detalhes da montagem física antes de fechar a placa dentro da caixa.",
  },
  "circuit-wiring-troubleshooting": {
    title: "Solução de problemas na fiação",
    description:
      "Diagnostique LCD apagado, sondas DHT22 ausentes e leituras intermitentes com multímetro, logs seriais e um checklist da alimentação aos dados.",
    summary: "Verificações sistemáticas da alimentação às linhas de dados antes de trocar peças.",
  },
  "liquid-crystal-gpio-map": {
    title: "Mapa de GPIO do LiquidCrystal",
    description:
      "Faça os pinos RS, E e D4–D7 do LiquidCrystal baterem com o construtor do seu sketch Arduino para o LCD acender em vez de ficar em branco.",
    summary: "Os pinos do LCD precisam bater exatamente com o sketch, ou a tela fica em branco.",
  },
  "dht22-data-line-wiring": {
    title: "Fiação da linha de dados do DHT22",
    description:
      "Ligue cada DHT22 em seu próprio GPIO, com pull-up de 10 kΩ e terra comum, e afaste os cabos de motores de portão e cargas ruidosas para evitar erros.",
    summary: "Um pino de dados por sonda, com pull-up adequado e limite de comprimento.",
  },
  "spi-pins-ethernet-reserved": {
    title: "Pinos SPI reservados para Ethernet",
    description:
      "Quais pinos do Arduino um shield Ethernet W5100 reserva para SPI e quais GPIO ficam livres para o LiquidCrystal e as sondas DHT22.",
    summary: "Evite conflitos de pinos entre a pilha Ethernet e os periféricos locais.",
  },
  "dht22-read-errors-retries": {
    title: "Erros de leitura do DHT22 e novas tentativas",
    description:
      "Trate falhas de checksum e violações de tempo com backoff para que uma leitura ruim não deixe o feed em branco.",
    summary: "Lógica de novas tentativas e intervalos mínimos mantêm o JSON estável em locais com correntes de ar.",
  },
  "lcd-local-display-format": {
    title: "Formato do display LCD local",
    description:
      "Formate as linhas de temperatura e umidade do LCD para conferir as sondas no local sem precisar abrir um notebook.",
    summary: "Convenções de layout em duas linhas para controladores com duas sondas.",
  },
  "dual-probe-averaging": {
    title: "Lógica de média com duas sondas",
    description:
      "Calcule a média do JSON entre as sondas saudáveis e mantenha os valores de cada zona no LCD e nos feeds.",
    summary:
      "Quando tirar a média, quando descartar uma leitura com falha e como o histórico usa o avg.",
  },
  "fastapi-relay-setup": {
    title: "Configuração do relay FastAPI",
    description:
      "Instale e rode o relay FastAPI em Python que consulta o JSON do Arduino e expõe um feed HTTPS estável para o ProbeHarbor puxar.",
    summary: "Instale, configure a URL de origem e confira as respostas em cache com curl.",
  },
  "debugging-stale-readings": {
    title: "Depurar leituras desatualizadas",
    description:
      "Rastreie leituras antigas ou ausentes do firmware ao cache do relay e ao mapeamento no dashboard do ProbeHarbor, com checklist de curl e autenticação.",
    summary: "Checklist em ordem: curl, cache, autenticação e erros de digitação nas chaves.",
  },
} satisfies AboutPageOverlay;
