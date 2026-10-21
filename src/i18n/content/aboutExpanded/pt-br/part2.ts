import type { AboutExpandedOverlay } from "../index";

export default {
  "ethernet-shield-stacking": [
    { html: 'O shield Ethernet baseado no W5100 se encaixa sobre o Uno e ocupa os pinos SPI, além de uma linha de chip select. O empilhamento mecânico é simples; na parte elétrica, você precisa reservar esses pinos e passar os fios do DHT22 e do LCD contornando o conjunto alto.' },
    { text: "Ordem de empilhamento e barras de pinos" },
    { items: [
      "Encaixe o **shield Ethernet** por completo nas barras de pinos do Uno, sem pinos tortos atrás do conector RJ45.",
      "Puxe os jumpers do topo da pilha ou use uma **placa de prototipagem auxiliar** para os pinos do LCD.",
      "Mantenha um alívio de tensão no cabo Ethernet para que a flexão do RJ45 não levante o shield das barras de pinos.",
    ] },
    { text: "Compartilhamento do SPI" },
    { html: 'Só um dispositivo SPI deve controlar o barramento por vez; o W5100 assume o SPI durante a E/S de rede. Os GPIOs do DHT22 e do LCD paralelo são separados: detalhes em <a class="text-link" href="/about/spi-pins-ethernet-reserved">pinos SPI e linhas reservadas</a>.' },
    { text: "Caminho de rede" },
    { html: 'O DHCP do roteador da garagem atribui um IP à placa; o JSON é servido por HTTP na rede local. Para ter HTTPS na borda, encerre o TLS no <a class="text-link" href="/about/fastapi-relay-setup">relay FastAPI</a> em vez do microcontrolador. Para fazer <strong>ingestão por push</strong> com o mesmo shield, use <code>ethernet_dht22_ingest</code> junto com o encaminhador HTTP→HTTPS da rede local em <code>sketches/relay/</code>: veja <a class="text-link" href="/about/arduino-sketches">sketches do Arduino</a>.' },
  ],

  "circuit-wiring-troubleshooting": [
    { html: 'Leituras intermitentes quase sempre vêm da alimentação, do terra ou de jumpers soltos, não de azar. Trabalhe com método, dos trilhos até os sensores, antes de trocar o Arduino.' },
    { text: "Sintoma → causa provável" },
    { items: [
      "**LCD em branco:** potenciômetro de contraste, Vo desconectado ou pinos RS/E/D errados.",
      "**Timeout do DHT22:** falta de pull-up, dados/terra invertidos ou intervalo de leitura curto demais.",
      "**Ethernet morta:** shield mal encaixado, cabo ruim ou conflito de pinos SPI com a fiação do LCD.",
      "**LCD com caracteres embaralhados:** linha de dados flutuando ou LCD de 3,3 V em lógica de 5 V sem cuidar dos níveis.",
    ] },
    { text: "Ferramentas" },
    { html: 'O registro pela serial descrito em <a class="text-link" href="/about/arduino-ide-setup">configuração da Arduino IDE</a> confirma que o firmware está rodando. Medições com multímetro nos <a class="text-link" href="/about/breadboard-power-rails">trilhos de alimentação</a> confirmam os 5 V sob carga. Revisão pino a pino: <a class="text-link" href="/about/arduino-pin-wiring">fiação dos pinos</a>.' },
    { text: "Ajuda específica para sensores" },
    { html: 'Falhas persistentes do DHT22 depois de conferir a fiação: <a class="text-link" href="/about/dht22-read-errors-retries">erros de leitura e novas tentativas do DHT22</a> e <a class="text-link" href="/about/dht22-data-line-wiring">fiação da linha de dados</a>.' },
  ],

  "liquid-crystal-gpio-map": [
    { html: 'O LCD 16×2 usa o modo paralelo com fiação de 4 bits: RS, E e quatro linhas de dados vão para GPIOs específicos do Uno, de acordo com o construtor LiquidCrystal no firmware. A luz de fundo pode passar por um transistor para controle de brilho ou economia de energia.' },
    { text: "Atribuições típicas" },
    { html: 'Os pinos exatos seguem o sketch do repositório: documente sua montagem no papel. RS e E controlam o modo de comando ou de dados; D4–D7 carregam os nibbles. O contraste em Vo usa um potenciômetro de 10k entre 5 V e o terra.' },
    { items: [
      "**RS:** seleção de registrador: comandos ou dados de caracteres.",
      "**E:** pulso de habilitação para cada transferência de nibble.",
      "**D4–D7:** os quatro bits superiores da interface de 8 bits no modo de 4 bits.",
      "**Luz de fundo:** geralmente o pino LED+ chaveado por transistor, não uma linha de dados GPIO.",
    ] },
    { text: "Evitando conflitos" },
    { html: 'Não atribua linhas do LCD aos <a class="text-link" href="/about/spi-pins-ethernet-reserved">pinos SPI reservados</a> usados pelo shield Ethernet. Os pinos de dados do DHT22 também precisam ficar livres: veja <a class="text-link" href="/about/dht22-data-line-wiring">fiação de dados do DHT22</a>.' },
    { text: "Conteúdo do display" },
    { html: 'O que aparece em cada linha é definido pelo firmware, conforme <a class="text-link" href="/about/lcd-local-display-format">formato do display LCD local</a>.' },
  ],

  "dht22-data-line-wiring": [
    { html: 'Cada DHT22 usa um GPIO digital para o seu protocolo de fio único. A alimentação e o terra vêm dos trilhos da protoboard; um pull-up de 4,7k–10k entre os dados e 5 V mantém a linha em nível alto entre as leituras.' },
    { text: "Conexões por sensor" },
    { items: [
      "**VCC** no trilho de 5 V (alguns módulos têm regulador embutido para peças de 3,3 V: confira o seu).",
      "**DATA** em um GPIO exclusivo, com resistor de pull-up.",
      "**GND** no terra comum do Arduino.",
    ] },
    { text: "Cabos até sondas remotas" },
    { html: 'Fio curto, trançado ou em par, reduz o ruído. Evite passar os dados em paralelo com a rede elétrica. Se as leituras piorarem com a distância, a lógica de novas tentativas em <a class="text-link" href="/about/dht22-read-errors-retries">erros de leitura do DHT22</a> ajuda, mas a física sempre vence: mude o local ou encurte os cabos.' },
    { text: "Mapeamento no firmware" },
    { html: 'A ordem dos GPIOs define as chaves JSON <code>0</code> e <code>1</code>. Documente o mapeamento para os <a class="text-link" href="/about/probe-mapping-labels">rótulos do dashboard</a>. Noções básicas do sensor: <a class="text-link" href="/about/dht22-sensor-overview">visão geral do DHT22</a>.' },
  ],

  "spi-pins-ethernet-reserved": [
    { html: 'O shield Ethernet W5100 usa o SPI por hardware do Uno: MOSI, MISO, SCK, mais o chip select no pino 10. Nos layouts padrão, os pinos 10–13 e as linhas SPI não podem ser reaproveitados para o LCD ou os sensores.' },
    { text: "Linhas reservadas" },
    { items: [
      "**D10:** chip select (SS) do W5100.",
      "**D11–D13:** SPI MOSI, MISO e SCK no Uno.",
      "**Pino de interrupção:** depende do shield; siga a serigrafia do fabricante.",
    ] },
    { text: "Planejando o orçamento de GPIOs" },
    { html: 'O LCD no modo de 4 bits consome seis GPIOs; duas linhas de DHT22 consomem mais duas: planeje antes de adicionar recursos. Detalhes do empilhamento: <a class="text-link" href="/about/ethernet-shield-stacking">empilhamento do shield Ethernet</a>.' },
    { text: "Alternativas de montagem" },
    { html: 'Se faltarem pinos, considere módulos LCD I²C ou passar o HTTPS para os <a class="text-link" href="/about/python-feeds">feeds em Python</a>, mantendo o JSON em HTTP na rede local.' },
  ],

  "dht22-read-errors-retries": [
    { html: 'As leituras do DHT22 falham de vez em quando: violações de temporização, ruído elétrico ou uma disputa momentânea no barramento. O firmware deve tentar novamente algumas vezes, com espera entre as tentativas, antes de marcar uma sonda como com problema, em vez de publicar valores sem sentido no JSON.' },
    { text: "Estratégia de novas tentativas" },
    { items: [
      "Em caso de **erro de checksum ou timeout**, espere pelo menos dois segundos e tente de novo.",
      "Limite a **três a cinco** tentativas por ciclo de leitura.",
      "Se todas falharem, **omita ou mantenha o último valor bom**: documente sua escolha nas notas do esquema.",
    ] },
    { text: "Corrija o hardware primeiro" },
    { html: 'Confira os pull-ups e o aterramento em <a class="text-link" href="/about/dht22-data-line-wiring">fiação da linha de dados</a>. Cabos longos e o ruído do motor do portão automático agravam os erros. <a class="text-link" href="/about/circuit-wiring-troubleshooting">Solução de problemas no circuito</a> cobre as verificações na bancada.' },
    { text: "Impacto nos sistemas seguintes" },
    { html: 'Leituras ruins afetam a <a class="text-link" href="/about/dual-probe-averaging">média</a> e o histórico do dashboard. <a class="text-link" href="/about/debugging-stale-readings">Depurar leituras desatualizadas</a> no site ajuda a separar falhas do sensor de problemas de rede.' },
  ],

  "lcd-local-display-format": [
    { html: 'O LCD 16×2 dá a quem instala um retorno imediato, sem Wi-Fi nem notebook. Duas linhas são pouco espaço: o firmware geralmente alterna ou divide a sonda 0, a sonda 1 e a média entre as linhas ou em páginas temporizadas.' },
    { text: "Layout típico" },
    { items: [
      "**Linha 0:** temperatura e umidade da sonda 0, abreviadas (por exemplo, <code>P0 38F 41%</code>).",
      "**Linha 1:** sonda 1 ou média móvel, dependendo da versão do sketch.",
      "**Luz de fundo:** ligada durante as leituras; desligamento automático opcional para reduzir o brilho à noite.",
    ] },
    { text: "Unidades e atualização" },
    { html: 'Use as mesmas unidades que você espera ver no site ou identifique-as no LCD. Atualize só quando chegarem leituras novas e válidas: evite o piscar causado por atualizações parciais. Fiação dos GPIOs: <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO do LCD</a>.' },
    { text: "Quando o LCD discorda da web" },
    { html: 'Compare com o JSON ao vivo via curl: <a class="text-link" href="/about/json-probe-output-schema">esquema JSON</a>. Um cache antigo no <a class="text-link" href="/about/redis-cache-for-feeds">relay com Redis</a> pode ficar atrás do LCD; o display local costuma estar mais atualizado.' },
  ],

  "dual-probe-averaging": [
    { html: 'A chave <code>avg</code> resume as sondas saudáveis para consultas rápidas e linhas compactas de histórico. A média deve ignorar leituras com falha e, se você quiser, considerar só as sondas marcadas como ativas no firmware.' },
    { text: "Esboço do algoritmo" },
    { items: [
      "Colete os pares **válidos** de temperatura e umidade de cada índice de sonda.",
      "Calcule a **média aritmética** separadamente para °F, °C e umidade.",
      "Se só uma sonda estiver saudável, **avg pode ser igual a essa sonda** ou ser omitida: escolha uma política.",
    ] },
    { text: "Quando não confiar em avg" },
    { html: 'As zonas junto à porta e no interior podem diferir em cerca de 5,5 °C (10 °F): fazer a média às cegas esconde o risco de congelamento no canto frio. Use avg para linhas de tendência; use as chaves de cada zona para tomar decisões. Layout: <a class="text-link" href="/about/multi-zone-garage-layout">layout com várias zonas</a>.' },
    { text: "Tópicos relacionados" },
    { html: 'Frequência de leitura: <a class="text-link" href="/about/sketch-polling-main-loop">loop principal do sketch</a>. Formato da saída: <a class="text-link" href="/about/json-probe-output-schema">esquema JSON</a>.' },
  ],

  "fastapi-relay-setup": [
    { html: 'Um pequeno serviço FastAPI em um servidor doméstico ou VPS pode consultar o Arduino por HTTP na rede local e depois expor uma URL HTTPS estável para a internet. Assim, o TLS e a autenticação ficam fora do microcontrolador, e o JSON que o seu dashboard já entende continua o mesmo. Se o Uno deve fazer <strong>push</strong> em vez de esperar ser consultado, rode <code>sketches/relay/push_https_forward.py</code> e o exemplo <code>ethernet_dht22_ingest</code>: veja <a class="text-link" href="/about/python-feeds">feeds em Python</a>.' },
    { text: "Arquitetura mínima" },
    { items: [
      "**Agendador ou busca sob demanda** acessa <code>http://arduino.local/...</code> na rede local.",
      "**Rota FastAPI** retorna o último corpo em cache com o <code>Content-Type</code> correto.",
      "**Proxy reverso** (Caddy, nginx) encerra o TLS em um nome de host público.",
    ] },
    { text: "Dicas de configuração" },
    { items: [
      "Defina **timeouts razoáveis**: o link da garagem é mais lento que o RTT de um datacenter.",
      "Registre **erros de origem** separados dos 404 dos clientes.",
      "Versione o relay quando o <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema JSON</a> mudar.",
    ] },
    { text: "Camada de cache" },
    { html: 'Adicione um <a class="text-link" href="/about/redis-cache-for-feeds">cache Redis</a> para que os Cloudflare Workers e o site em Astro não sobrecarreguem o IP da sua casa a cada visualização de página. Segurança: <a class="text-link" href="/about/relay-security-and-access">segurança do relay</a>.' },
  ],

  "debugging-stale-readings": [
    { html: 'Leituras desatualizadas significam que o site mostra uma temperatura antiga enquanto o ambiente já mudou, ou não mostra nada enquanto o LCD continua atualizando. Trabalhe do sensor para fora: hardware, JSON, cache, busca SSR e, por fim, histórico.' },
    { text: "Checklist" },
    { items: [
      "**Teste a URL do feed com curl** de fora da sua rede local: o JSON está atualizado?",
      "Compare **LCD e JSON**; se o LCD estiver à frente, corrija o relay ou o <a class=\"text-link\" href=\"/about/redis-cache-for-feeds\">TTL do Redis</a>.",
      "Confirme que as **chaves das sondas** no dashboard batem com o esquema: <a class=\"text-link\" href=\"/about/probe-mapping-labels\">mapeamento das sondas</a>.",
      "Examine os **logs da Cloudflare / SSR** em busca de padrões de timeout.",
    ] },
    { text: "Causas do lado do hardware" },
    { html: 'As <a class="text-link" href="/about/firmware-watchdog-recovery">reinicializações por watchdog</a> causam lacunas curtas. Os <a class="text-link" href="/about/dht22-read-errors-retries">erros do DHT22</a> tiram chaves do JSON. Ethernet: <a class="text-link" href="/about/circuit-wiring-troubleshooting">solução de problemas na fiação</a>.' },
    { text: "Histórico versus ao vivo" },
    { html: 'Os gráficos podem ficar atrasados se as inserções pararem enquanto a página inicial ainda parece ao vivo: verifique as <a class="text-link" href="/about/supabase-history-inserts">inserções de histórico</a> separadamente da <a class="text-link" href="/about/home-page-probe-fetch">busca da página inicial</a>.' },
  ],

  "configuring-temperature-feeds": [
    { html: 'Os feeds por pull permitem que o ProbeHarbor busque JSON por HTTPS em um agendamento quando a sua sonda já serve uma URL pública (ou um relay com TLS). Para o passo a passo completo de push <em>e</em> pull que corresponde à tela Devices atual, comece por <a class="text-link" href="/about/adding-devices">adicionando dispositivos push e pull</a>.' },
    { text: "Passos de configuração" },
    { items: [
      "Confira o feed com **curl**: sondas aninhadas sob um objeto raiz (padrão <code>temp</code>).",
      "Abra a aba <strong>Dashboard → Devices → Pull feeds</strong>.",
      "Adicione a URL HTTPS e defina a <strong>JSON root key</strong> se o seu objeto não se chamar <code>temp</code> (por exemplo, <code>readings</code>).",
      "Use <strong>Test feed URL</strong> e depois <strong>Save pull setup</strong>: as chaves das sondas são importadas automaticamente.",
      "Renomeie os rótulos na mesma página ou clique em <strong>Accept suggested names</strong>.",
    ] },
    { text: "Chave raiz do JSON" },
    { html: 'A leitura por pull procura <code>{ "&lt;root&gt;": { "0": { "f": …, "h": … }, … } }</code>. A raiz padrão é <code>temp</code>. Chaves planas no estilo push e <code>sensors[]</code> tipados servem para a <a class="text-link" href="/about/ingest-and-webhooks">ingestão por push</a>, não para o caminho padrão de pull.' },
    { text: "SenML e Home Assistant REST" },
    { html: 'Quando a raiz configurada não existe, o ProbeHarbor detecta automaticamente <strong>SenML JSON</strong> (array RFC 8428) e JSON de <strong>sensor HA REST</strong> (<code>state</code> + <code>attributes</code>). Cole a URL HTTPS como está, sem precisar mudar a raiz do JSON. Mapeie as chaves das sondas a partir dos nomes SenML (por exemplo, <code>0</code>) ou de <code>state</code> em feeds REST de entidade única. Experimente o <a class="text-link" href="/api/feeds/example?format=senml">exemplo SenML</a> público ou o <a class="text-link" href="/api/feeds/example?format=homeassistant">exemplo HA REST</a>.' },
    { text: "Vários feeds" },
    { html: 'Você pode adicionar várias URLs de pull (respeitando os limites do plano). Documente qual URL é de produção e qual é de demonstração. Segurança: <a class="text-link" href="/about/relay-security-and-access">segurança do relay</a>. Comportamento da busca: <a class="text-link" href="/about/home-page-probe-fetch">busca das sondas na página inicial</a>.' },
    { text: "Solução de problemas" },
    { html: 'Uma chave raiz errada ou erros de digitação nas chaves das sondas escondem os cartões mesmo quando a URL retorna 200. Veja <a class="text-link" href="/about/debugging-stale-readings">depurando leituras desatualizadas</a>.' },
  ],

  "humidity-condensation-basics": [
    { html: 'O monitoramento da garagem combina temperatura e umidade relativa porque as duas influenciam o conforto, a corrosão e o risco de mofo. A condensação aparece quando o ar úmido toca uma superfície mais fria que o ponto de orvalho, e não quando uma porcentagem de umidade sozinha cruza uma linha arbitrária. As sondas medem o bolsão de ar ao redor do sensor; elas não detectam diretamente água no piso de concreto, a menos que essa superfície aqueça ou esfrie o ar próximo de forma mensurável.' },
    { alt: "Diagrama mostrando ar quente e úmido encontrando o piso frio da garagem e liberando condensação", caption: "A condensação se forma quando o ar esfria até o ponto de orvalho junto a uma superfície mais fria, como uma laje sem isolamento." },
    { text: "Umidade relativa versus ponto de orvalho" },
    { html: 'O DHT22 informa a **umidade relativa (%UR)** na temperatura atual do ar. A mesma quantidade de vapor parece “mais úmida” quando o ar está frio, porque a %UR sobe à medida que a temperatura cai. Para guardar coisas na temporada de congelamento, acompanhe temperatura e umidade juntas: a <a class="text-link" href="/about/dht22-sensor-overview">visão geral do DHT22</a> explica os limites de precisão.' },
    { html: 'Depois de <a class="text-link" href="/about/garage-door-temperature-swings">aberturas da porta</a> em dias úmidos de verão, espere um pico de umidade enquanto o ar externo se mistura. Se a laje continuar fria por causa da <a class="text-link" href="/about/thermal-mass-concrete-slab">massa térmica</a>, pode haver condensação mesmo quando a sonda marca uma %UR moderada na altura do peito.' },
    { text: "O que as sondas não captam" },
    { items: [
      "**Temperatura da superfície** de ferramentas, carros e canos, muitas vezes mais fria que o ar à noite.",
      "**Microclimas** atrás de prateleiras onde o ar fica parado: use o <a class=\"text-link\" href=\"/about/multi-zone-garage-layout\">layout com várias zonas</a>.",
      "**Picos curtos** durante aberturas da porta, que as médias suavizam no histórico.",
    ] },
    { text: "Hábitos práticos de monitoramento" },
    { html: 'Compare as zonas junto à porta e no interior pelos <a class="text-link" href="/about/probe-mapping-labels">rótulos das sondas</a>. Revise as mínimas noturnas nos <a class="text-link" href="/about/history-dashboard-browsing">gráficos de histórico</a> durante as meias-estações, quando a temperatura da laje e a do ar mais se distanciam.' },
  ],

  "probe-cable-length-limits": [
    { html: 'O DHT22 usa um protocolo lento de fio único, sensível à capacitância e ao ruído elétrico. Montagens de bancada com jumpers de 15 cm se comportam de forma diferente de cabos de 3 m estendidos ao longo dos trilhos da porta da garagem. Este guia traduz a física em regras práticas de comprimento e passagem de cabos para sondas remotas, com o Arduino perto da tomada de rede.' },
    { alt: "Vista lateral de cabos de sensor curtos e longos, com símbolos de ruído no cabo longo", caption: "Cabos longos sem blindagem aumentam a capacitância e captam interferência de motores de portão e reatores de lâmpadas fluorescentes." },
    { text: "Comprimentos recomendados" },
    { html: 'Muitos instaladores consideram **três a cinco metros** um limite aproximado para cabo de três vias sem blindagem (5 V, dados, GND) com um pull-up adequado do lado do microcontrolador. Além disso, espere mais falhas de checksum, tratadas pela <a class="text-link" href="/about/dht22-read-errors-retries">lógica de novas tentativas</a>.' },
    { items: [
      "**Trance os dados com o terra** por todo o trajeto; deixe a alimentação em par separado, se for prático.",
      "**Evite passar em paralelo** com a rede elétrica, os fios de alta tensão do motor do portão e fontes chaveadas.",
      "**Um único pull-up** perto do Arduino: não duplique na outra ponta, a menos que conheça os requisitos do barramento.",
    ] },
    { text: "Sintomas de um cabo longo demais" },
    { html: 'Timeouts intermitentes nos logs da serial, uma chave de sonda sumindo do JSON enquanto a outra continua saudável e a umidade travada no último valor bom costumam ser problemas de cabo, não de sensores com defeito. Confira a fiação em <a class="text-link" href="/about/dht22-data-line-wiring">fiação da linha de dados</a> antes de trocar o hardware.' },
    { text: "Alternativas quando a distância é fixa" },
    { html: 'Leve o microcontrolador para mais perto das sondas dentro de um <a class="text-link" href="/about/enclosure-ventilation">gabinete ventilado</a>, use <a class="text-link" href="/about/jumper-wire-standards">jumpers de qualidade</a> no trecho da bancada e valide as leituras depois do <a class="text-link" href="/about/sensor-warm-up-time">aquecimento do sensor</a> antes de confiar no histórico de longo prazo.' },
  ],

  "thermal-mass-concrete-slab": [
    { html: 'Garagens sem aquecimento muitas vezes ficam sobre uma laje grossa de concreto em contato com o solo. Essa massa absorve e libera calor devagar em comparação com o ar junto às paredes leves. Sondas montadas baixo ou perto do piso acompanham a influência da laje; sondas na altura dos ombros reagem mais rápido à porta e à climatização. Entender a massa térmica ajuda a explicar diferenças entre duas sondas que, de outra forma, parecem confusas.' },
    { alt: "Corte de uma garagem mostrando o calor armazenado na laje e o aquecimento atrasado do ar", caption: "A massa térmica da laje armazena o calor do dia e o libera durante a noite, com atraso em relação às variações da temperatura do ar." },
    { text: "Atraso entre dia e noite" },
    { html: 'Em tardes de sol, a <a class="text-link" href="/about/sun-load-garage-walls">carga solar</a> pode aquecer a vaga enquanto a laje ainda está fria ao toque. Depois do pôr do sol, a laje pode **irradiar o calor armazenado** por horas: o ar interno esfria mais devagar do que os modelos de previsão indicam. O <a class="text-link" href="/about/seasonal-garage-patterns">histórico sazonal</a> revela o atraso específico do seu local.' },
    { text: "Interação com o posicionamento das sondas" },
    { items: [
      "**Sondas montadas baixo** acompanham o ar junto ao piso, influenciado pela temperatura da laje.",
      "**Sondas na altura do peito** representam melhor onde as pessoas respiram e onde as ferramentas ficam nas bancadas.",
      "**A chave de média do JSON** mistura as duas: perigoso para verificar congelamento; veja <a class=\"text-link\" href=\"/about/dual-probe-averaging\">média com duas sondas</a>.",
    ] },
    { text: "Relação com a condensação" },
    { html: 'Ar quente e úmido sobre uma laje fria gera umidade na superfície: combine com as <a class="text-link" href="/about/humidity-condensation-basics">noções básicas de umidade</a>. O isolamento e a vedação da porta reduzem, mas não eliminam, os efeitos da massa; a <a class="text-link" href="/about/infiltration-wind-drafts">infiltração</a> ainda movimenta o ar rente ao piso.' },
  ],

  "hvac-duct-influence": [
    { html: 'Algumas garagens compartilham uma parede, o teto ou um shaft com os dutos de climatização da casa. Mesmo dutos vedados irradiam calor no inverno; derivações mal vedadas vazam ar quente para uma vaga que, de outra forma, seria fria. Sondas perto de grelhas ou dutos flexíveis podem variar vários graus independentemente da porta ou da temperatura externa: padrões que parecem falhas do sensor até você mapear o caminho da climatização.' },
    { alt: "Corte do teto da garagem com um duto de climatização vazando ar quente em direção a uma sonda na parede", caption: "Vazamentos nos dutos e o calor irradiado por dutos próximos criam zonas de sonda desligadas do clima externo." },
    { text: "Sinais nos dados" },
    { html: 'Subidas repentinas quando o aquecedor da casa liga, sobretudo à noite com a porta da garagem fechada, sugerem influência dos dutos. Compare com as <a class="text-link" href="/about/garage-door-temperature-swings">variações causadas pela porta</a>, que acompanham a atividade das pessoas em vez de ciclos de climatização de 15 minutos.' },
    { text: "Mapeando as zonas" },
    { items: [
      "Coloque uma sonda **longe dos shafts de dutos conhecidos** como referência.",
      "Anote os **tempos de ciclo** em uma planilha junto com o <a class=\"text-link\" href=\"/about/charting-with-spreadsheets\">histórico exportado</a>.",
      "Renomeie os mapeamentos nos <a class=\"text-link\" href=\"/about/probe-mapping-labels\">rótulos do dashboard</a> depois de mudanças, para que o histórico continue fácil de interpretar.",
    ] },
    { text: "Mitigação e monitoramento" },
    { html: 'Vedar as juntas dos dutos é uma correção na construção; o monitoramento continua valioso para confirmar a melhora. Use o <a class="text-link" href="/about/multi-zone-garage-layout">layout com várias zonas</a> e os <a class="text-link" href="/about/freeze-protection-thresholds">limites de congelamento</a> na zona mais fria, não no canto aquecido pelos dutos.' },
  ],
} satisfies AboutExpandedOverlay;
