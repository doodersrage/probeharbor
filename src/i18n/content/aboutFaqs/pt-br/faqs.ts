import type { AboutFaqOverlay } from "../index";

export default {
  "temperature-probes": [
    {
      question: "Quais sondas de temperatura funcionam com o ProbeHarbor?",
      answer:
        "Qualquer sensor que consiga publicar temperatura (e, opcionalmente, umidade) como JSON: geralmente DHT22, DS18B20 ou similares em Arduino/ESP32. Mapeie os índices das sondas no painel depois da ingestão.",
    },
    {
      question: "Quantas sondas preciso em uma garagem, oficina ou ambiente parecido?",
      answer:
        "Uma sonda é um começo; duas ou três zonas (área do portão, parede norte, bancada) pegam riscos de congelamento que uma média única deixa passar.",
    },
  ],
  "temperature-changes": [
    {
      question: "Por que a temperatura em um ambiente sem aquecimento oscila tão rápido?",
      answer:
        "Aberturas de porta, sol batendo nas paredes, infiltração de vento e o calor dos veículos mexem rapidamente com o ar interno. Acompanhe o histórico durante a noite para separar o efeito do clima do ruído do sensor.",
    },
  ],
  "historical-data": [
    {
      question: "Por quanto tempo o ProbeHarbor guarda o histórico?",
      answer:
        "A retenção depende do plano e da janela de retenção definida em Settings. O Free guarda janelas mais curtas; os planos pagos guardam mais histórico para gráficos e exportação CSV.",
    },
    {
      question: "Posso exportar as leituras para uma planilha?",
      answer:
        "Sim, no Member e no Pro: baixe o CSV em History e abra no Excel ou no Google Sheets para auditorias de congelamento e comparações entre estações.",
    },
  ],
  "arduino-sketches": [
    {
      question: "Onde estão os sketches de exemplo para Arduino?",
      answer:
        "No repositório probeharbor no GitHub, em sketches/, além dos guias de Arduino em About. Os exemplos para ESP32 fazem POST HTTPS diretamente. O Uno + Ethernet W5100 usa ethernet_dht22_ingest (JSON temp clássico em A4/A5) mais um relay HTTP→HTTPS na rede local: o shield não consegue fazer TLS com o probeharbor.dev.",
    },
  ],
  "arduino-pin-wiring": [
    {
      question: "Quais pinos devo usar para um DHT22?",
      answer:
        "Use um GPIO digital livre para a linha de dados, 3,3 V ou 5 V conforme a especificação da placa e do sensor, e um terra comum. Evite pinos reservados por shields Ethernet/SPI.",
    },
  ],
  "arduino-dht22-lcd": [
    {
      question: "Preciso de um LCD se usar o ProbeHarbor?",
      answer:
        "Não: o painel na nuvem basta. Um LCD local é opcional, para ter visibilidade na oficina quando o Wi-Fi cair.",
    },
  ],
  "dht22-sensor-overview": [
    {
      question: "Qual a precisão de um DHT22 em uma garagem ou oficina?",
      answer:
        "Cerca de ±0,5 °C e alguns pontos percentuais de umidade relativa com o ar estável. Correntes de ar e aberturas de porta geram picos reais, nem sempre erro do sensor. Compare as zonas antes de trocar o hardware.",
    },
    {
      question: "Com que frequência o firmware deve consultar o DHT22?",
      answer:
        "Respeite um intervalo de pelo menos dois segundos entre leituras. Requisições sobrepostas retornam valores antigos ou erros; por isso os sketches usam timers e novas tentativas.",
    },
    {
      question: "Um único DHT22 cobre uma garagem, sótão ou oficina inteira?",
      answer:
        "Um sensor só esconde as diferenças de temperatura. Áreas de portão, paredes norte e bancadas costumam diferir em vários graus; use várias sondas quando o risco de congelamento ou as ferramentas importam.",
    },
  ],
  "dht22-data-line-wiring": [
    {
      question: "Por que as leituras do DHT22 falham de vez em quando?",
      answer:
        "Cabos longos, falta de pull-ups, ruído em uma alimentação compartilhada e leituras frequentes demais são causas comuns. Encurte o cabo, confira a fiação e adicione novas tentativas com backoff.",
    },
  ],
  "freeze-protection-thresholds": [
    {
      question: "Com qual limite de congelamento devo começar?",
      answer:
        "Muitos ambientes sem aquecimento (garagens, oficinas, porões) começam por volta de 2–3 °C (35–38 °F), para você ser avisado antes de os canos chegarem ao congelamento de fato. Ajuste depois de ver as mínimas noturnas na sua zona mais fria.",
    },
    {
      question: "Devo receber alertas pela previsão externa ou pelas sondas internas?",
      answer:
        "Use os dois quando puder: as sondas monitoram o seu ambiente; a previsão e os alertas do NWS (EUA) pegam ondas de frio regionais antes de o ar interno esfriar.",
    },
  ],
  "cold-snap-playbook": [
    {
      question: "O que devo fazer quando um alerta de congelamento dispara?",
      answer:
        "Confirme o alerta, verifique a zona mais fria e o estado da porta, libere a exceção do horário silencioso se precisar e escale para outros canais se ninguém responder dentro do prazo do seu plano de ação.",
    },
    {
      question: "Como o horário silencioso interage com os alertas de congelamento?",
      answer:
        "Você pode silenciar o ruído rotineiro à noite e ainda receber alertas de congelamento, alagamento e previsão; mantenha a exceção ativada para os tipos críticos.",
    },
  ],
  "freeze-thaw-flood-playbook": [
    {
      question: "Preciso de uma regra personalizada para as placas de vazamento?",
      answer:
        "Não. Com os alertas ativados, contatos de alagamento/vazamento molhados avisam automaticamente. Use Rules → flood só para combinar a umidade com condições de porta, temperatura ou duração.",
    },
    {
      question: "O modo férias silencia os alertas de alagamento?",
      answer:
        "Não. Os alertas de alagamento sempre são entregues. O modo férias também deixa passar os alertas de limite de congelamento e de previsão/NWS, para que uma casa vazia ainda avise você; uma soneca curta pausa os alertas de limite de congelamento, mas não os de alagamento.",
    },
    {
      question: "Onde devo colocar os contatos de umidade para alagamentos no degelo?",
      answer:
        "Em bandejas de aquecedores de água, pontos baixos da lavanderia/área de serviço, bordas de poços de drenagem e poças no porão onde a água do degelo se acumula primeiro, não em uma prateleira seca. Veja a página do acessório leak puck para o modelo de lista de materiais das placas.",
    },
  ],
  "time-to-freeze": [
    {
      question: "Qual a diferença entre o tempo até o congelamento e um alerta de limite?",
      answer:
        "Um alerta de limite dispara quando a sonda já está no seu limite de congelamento ou abaixo dele. O tempo até o congelamento estima as horas restantes até esse cruzamento usando o atraso deste ambiente em relação ao ar externo.",
    },
    {
      question: "O que a previsão do Member e o NWS do Pro acrescentam?",
      answer:
        "Todo plano tem o alerta de limite mais o relógio de tempo até o congelamento do ambiente interno. O Member adiciona avisos de congelamento pela previsão externa; o Pro adiciona alertas oficiais de congelamento e frio do NWS (EUA).",
    },
    {
      question: "Onde ativo o tempo até o congelamento?",
      answer:
        "Dashboard → Alerts → When to alert: defina um limite de congelamento, ative os alertas e um canal de entrega e mantenha os alertas ligados para que os avisos de tempo até o congelamento possam disparar. Envie um alerta de teste enquanto estiver acordado.",
    },
  ],
  "alert-channel-cookbook": [
    {
      question: "Quais canais funcionam no plano gratuito?",
      answer:
        "E-mail, push no navegador e no Android e destinos estilo chat (Discord, Telegram, Slack, Teams, ntfy, Pushover). SMS, WhatsApp e webhooks de saída exigem o Pro.",
    },
    {
      question: "Por que um canal foi ignorado?",
      answer:
        "Um canal marcado sem destino (telefone, URL de webhook, ID do chat) é ignorado na hora do envio. Preencha os destinos, salve e envie um alerta de teste.",
    },
  ],
  "household-sharing-walkthrough": [
    {
      question: "Os membros da casa podem mudar as configurações de alerta?",
      answer:
        "Editores e donos podem; membros somente leitura veem os dados ao vivo sem alterar dispositivos, alertas ou compartilhamento.",
    },
    {
      question: "Os convites exigem um plano pago?",
      answer:
        "O compartilhamento com a casa está disponível em contas gratuitas, para que a família acompanhe junto as mesmas sondas e alertas.",
    },
  ],
  "accounts-and-dashboard": [
    {
      question: "O que devo configurar depois de criar uma conta?",
      answer:
        "Crie um dispositivo push (Workshop probe por padrão), faça um POST para que os sensores sejam importados automaticamente, defina o limite de congelamento + e-mail em Alerts → When to alert (ou direto em Devices depois da primeira ingestão), convide os membros da casa e, se quiser, compartilhe um link ao vivo gratuito com a família. Comece um teste do Pro quando precisar de SMS, push ou escopos de compartilhamento ampliados.",
    },
  ],
  "ingest-and-webhooks": [
    {
      question: "Preciso de um IP público no Arduino?",
      answer:
        "Não. A ingestão push envia para o ProbeHarbor em conexão de saída, com uma chave de dispositivo. Feeds pull precisam de uma URL JSON HTTPS acessível se você usar esse caminho.",
    },
    {
      question: "O que vai em um payload de ingestão?",
      answer:
        "Temperatura (e umidade) por índice de sonda, mais campos opcionais de porta/energia, bateria e RSSI. Os formatos nativos são chaves planas, um objeto temp ou sensors[]. Arrays SenML (RFC 8428) e o JSON de estado REST do Home Assistant também são detectados automaticamente. Mantenha as chaves estáveis para que os mapeamentos do painel continuem válidos.",
    },
  ],
  "adding-devices": [
    {
      question: "Devo usar push ou pull?",
      answer:
        "Use push para nós ESP/Arduino que conseguem fazer POST HTTPS de saída. Use pull quando você já tem um feed JSON HTTPS público (ou um relay TLS) que o ProbeHarbor pode buscar em intervalos programados.",
    },
    {
      question: "Por que as leituras não aparecem em Home depois que a ingestão funciona?",
      answer:
        "Faça POST do JSON primeiro: as chaves dos sensores são importadas automaticamente em Devices. Se Home continuar vazio, confirme que o dispositivo recebeu um POST e confira Devices → Device health. Feeds pull: raiz do JSON correta (padrão temp), a menos que a URL retorne SenML ou JSON REST do Home Assistant, que são detectados automaticamente.",
    },
  ],
  "json-probe-output-schema": [
    {
      question: "Qual formato de JSON o ProbeHarbor espera?",
      answer:
        "O formato padrão de pull é um objeto temp com chaves de sonda (f, c, h). O push também aceita chaves planas, sensors[], arrays JSON SenML e objetos de estado REST do Home Assistant. Os campos opcionais battery_pct e rssi ajudam a diagnosticar dispositivos fracos. Veja /about/ingest-and-webhooks ou o feed de exemplo em /api/feeds/example?format=document.",
    },
  ],
  "kit-qr-onboarding": [
    {
      question: "O que o QR code de um kit contém?",
      answer:
        "Normalmente a URL de ingestão ou um deep link de onboarding desse dispositivo, para que uma leitura com o celular conclua a configuração sem digitar chaves longas.",
    },
  ],
  "esp32-freeze-kit": [
    {
      question: "O ProbeHarbor vende um kit ESP32?",
      answer:
        "Não. O ProbeHarbor é software. Compre um ESP32 e um DS18B20 à prova d'água na Adafruit ou na Amazon e baixe um sketch de ingestão já preenchido em Dashboard → Devices. Lista de peças: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Um kit inicial com DHT11 basta para congelamento de canos?",
      answer:
        "Sozinho, não. O DHT11 é fraco abaixo de zero e normalmente não é à prova d'água. Use um DS18B20 à prova d'água para os canos; mantenha o DHT22 para o ar e a umidade da oficina se quiser medir a umidade relativa.",
    },
    {
      question: "Preciso especificamente da placa da Adafruit?",
      answer:
        "Não. Qualquer ESP32 DevKit que rode Arduino IDE ou MicroPython funciona com os sketches do ProbeHarbor. Os links da Adafruit são SKUs de referência estáveis; DevKits encontrados na Amazon servem bem para economizar.",
    },
  ],
  "esp32-ota-firmware": [
    {
      question: "Dispositivos ESP32 podem atualizar o firmware enquanto enviam para o ProbeHarbor?",
      answer:
        "Sim: faça o OTA do firmware na sua rede local e mantenha a ingestão push enviando leituras para a API na nuvem. Os campos de bateria e RSSI são opcionais no payload. Baixe um sketch já preenchido em Dashboard → Devices para a primeira gravação via USB.",
    },
    {
      question: "Preciso recompilar quando a senha do Wi-Fi mudar?",
      answer:
        "Não, se você usar o exemplo com WiFiManager (portal cativo). Caso contrário, edite WIFI_SSID / WIFI_PASS e grave de novo. A URL de ingestão continua vindo de Devices.",
    },
  ],
  "esp32-web-flash": [
    {
      question: "O ProbeHarbor tem um gravador no navegador?",
      answer:
        "Sim, em beta: probeharbor.dev/flash instala firmware pronto em um ESP32, ESP32-S3 ou ESP32-C3 pelo Chrome ou Edge e depois envia à placa o seu Wi-Fi e a chave do dispositivo via USB. Para editar o código, baixe um .ino/.py já preenchido em Devices e grave com Arduino IDE, PlatformIO ou Thonny. Guia: probeharbor.dev/about/esp32-web-flash.",
    },
  ],
  "pico-w-ingest": [
    {
      question: "Um Raspberry Pi Pico W pode enviar para o ProbeHarbor?",
      answer:
        "Sim. O Pico W e o Pico 2 W falam HTTPS no próprio chip. Baixe o code.py de CircuitPython (ou o sketch MicroPython / Arduino) em Dashboard → Devices, ligue um DS18B20 no GP4 com um pull-up de 4,7k para 3,3 V e acompanhe o Serial até ver POST 200. Guia: probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Um Pico W é a mesma coisa que o claim puck?",
      answer:
        "Não. O claim puck é um Waveshare RP2040-Zero via USB para presença na baia e LEDs de humor. O Pico W é uma sonda de temperatura com Wi-Fi. Não grave o firmware do claim puck em uma sonda de congelamento, nem o contrário.",
    },
    {
      question: "Devo comprar um Pico W ou um ESP32?",
      answer:
        "O ESP32 continua sendo o kit de congelamento padrão (DevKits mais baratos, ESPHome, exemplos de OTA). Escolha o Pico W se você já tiver um, preferir o arrastar e soltar do CircuitPython ou quiser RP2040/RP2350. Os dois fazem POST do mesmo JSON de ingestão.",
    },
  ],
  "stm32-zephyr-ingest": [
    {
      question: "Um STM32 pode enviar para o ProbeHarbor sem Arduino ou Python?",
      answer:
        "Sim. O exemplo para a Nucleo-F767ZI é em C com Zephyr: west build, gravação via ST-LINK, Ethernet na placa. DS18B20 no D4 do Arduino (PF14). HTTP para o relay TLS na rede local, igual ao caminho do Uno W5100. Guia: probeharbor.dev/about/stm32-zephyr-ingest.",
    },
    {
      question: "Por que não usar HTTPS direto da Nucleo?",
      answer:
        "Dá para fazer, com o mbedTLS do Zephyr e uma CA embutida. O ProbeHarbor fica atrás da Cloudflare, então essa CA pode mudar. O relay na rede local mantém o microcontrolador em HTTP e deixa o Pi/NAS cuidar do TLS, o mesmo padrão do Uno com Ethernet.",
    },
    {
      question: "O conector Arduino roda firmware Arduino?",
      answer:
        "Não. O D4 é só o pino no layout Arduino da Nucleo (PF14). O firmware é em C com Zephyr, não um .ino.",
    },
  ],
  "ch32v-riscv-ingest": [
    {
      question: "Um CH32V pode enviar para o ProbeHarbor sem Arduino ou Python?",
      answer:
        "Sim. O exemplo para a CH32V307V-EVT é em C com WCHNET no MounRiver Studio: basta colocar o User/main.c no projeto oficial ETH/DHCP, gravar via WCH-Link, Ethernet 10M na placa. DS18B20 no PB12. HTTP para o relay TLS na rede local, igual ao Uno W5100 e ao STM32 Zephyr. Guia: probeharbor.dev/about/ch32v-riscv-ingest.",
    },
    {
      question: "Por que não usar HTTPS direto do CH32V?",
      answer:
        "O WCHNET oferece TCP/UDP IPv4 sem um cliente TLS mantido. A ingestão do ProbeHarbor é HTTPS. O relay na rede local mantém o microcontrolador em HTTP e deixa um Pi/NAS cuidar do TLS, o mesmo padrão do Uno com Ethernet e do STM32 Zephyr.",
    },
    {
      question: "Isto é Arduino-CH32 ou PlatformIO Arduino?",
      answer:
        "Não. Alguns cores da comunidade adaptam o CH32V para a Arduino IDE. Este exemplo é em C do fabricante (QingKe RISC-V, WCHNET), não um .ino.",
    },
  ],
  "avr-asm-ingest": [
    {
      question: "Alguma placa do ProbeHarbor exige linguagem assembly?",
      answer:
        "Nenhuma sonda de congelamento Ethernet exige assembly. PADAUK e PIC10F são voltados a assembly, mas não conseguem fazer POST HTTP. O caminho em assembly suportado é GNU AVR em um Uno + W5100: avr-gcc, sem C do Arduino, DS18B20 no D7, HTTP para o relay TLS na rede local. Guia: probeharbor.dev/about/avr-asm-ingest.",
    },
    {
      question: "Por que não colocar o DS18B20 no D4, como no exemplo do ESP32?",
      answer:
        "O shield Ethernet W5100 usa o D4 como chip-select do cartão SD. Este firmware mantém o D4 em nível alto e lê a sonda no D7.",
    },
    {
      question: "Posso continuar usando o sketch Ethernet em C do Arduino?",
      answer:
        "Sim. sketches/arduino/ethernet_dht22_ingest é o caminho em C no mesmo shield (DHT22 em A4/A5). Use assembly só se quiser programar o 328P sem o C do Arduino.",
    },
  ],
  "cellular-ingest": [
    {
      question: "Uma placa celular pode enviar para o ProbeHarbor sem Wi-Fi?",
      answer:
        "Sim. O exemplo do Particle Boron publica JSON no evento probeharbor_ingest; um webhook do Particle Console faz POST desse corpo para a sua URL de ingestão HTTPS. DS18B20 no D2. Guia: probeharbor.dev/about/cellular-ingest.",
    },
    {
      question: "O que acontece quando o LTE cai?",
      answer:
        "Intervalos perdidos são esperados. O ProbeHarbor marca as sondas como desatualizadas quando os envios param, e os alertas de congelamento ainda disparam com base na última leitura fria conhecida mais o silêncio. Evite loops de reconexão apertados que esgotam a bateria.",
    },
    {
      question: "O Blues Notecard é suportado?",
      answer:
        "Como caminho alternativo: direcione o Notehub para a mesma URL de ingestão. Em Devices você baixa firmware e JSON de webhook com suporte completo para o Particle Boron.",
    },
  ],
  "pic18-ethernet-ingest": [
    {
      question: "Um PIC18F67J60 pode enviar para o ProbeHarbor?",
      answer:
        "Sim. Código em C pronto para o MLA TCP/IP Stack no MPLAB X: MAC/PHY Ethernet integrado, DS18B20 no RD0, HTTP para o relay TLS na rede local. Guia: probeharbor.dev/about/pic18-ethernet-ingest.",
    },
    {
      question: "Por que não usar HTTPS a partir do PIC?",
      answer:
        "O clássico Microchip TCP/IP Stack não traz um cliente HTTPS mantido para a Cloudflare. O relay na rede local mantém o microcontrolador em HTTP, igual ao Uno W5100 e ao STM32 Zephyr.",
    },
    {
      question: "Isto é Arduino ou XC8?",
      answer:
        "XC8 / MPLAB X sobre a demo Ethernet do MLA. Não é um .ino do Arduino.",
    },
  ],
  "teensy41-ingest": [
    {
      question: "Um Teensy 4.1 pode enviar para o ProbeHarbor?",
      answer:
        "Sim. Teensyduino + QNEthernet no Teensy 4.1 com o kit Ethernet: DS18B20 no pino 4, HTTP para o relay TLS na rede local. Guia: probeharbor.dev/about/teensy41-ingest.",
    },
    {
      question: "Por que não usar HTTPS direto do Teensy?",
      answer:
        "Você pode adicionar bibliotecas TLS, mas as CAs da Cloudflare podem mudar. O relay na rede local segue o mesmo caminho do Uno / STM32 / CH32V e evita embutir CAs no microcontrolador.",
    },
    {
      question: "Preciso do kit Ethernet da PJRC?",
      answer:
        "Para este exemplo, sim. O Teensy 4.1 tem o MAC no chip; o kit (ou uma fiação equivalente com MagJack) fornece os magnéticos e o RJ45.",
    },
  ],
  "install-pwa": [
    {
      question: "O PWA suporta alertas push de congelamento?",
      answer:
        "Sim, em todos os planos. O push funciona no navegador (PWA) e no app do ProbeHarbor para Android. Instale o PWA ou o app para Android, ative o Push em Alerts e permita notificações onde o sistema exigir (o Safari no iOS tem limites extras para web push).",
    },
  ],
  "data-flow": [
    {
      question: "Como as leituras chegam ao painel?",
      answer:
        "Os dispositivos enviam por push ou os feeds são buscados por pull, as leituras vão para o armazenamento, os gráficos consultam ou recebem atualizações em streaming, e os jobs de alerta avaliam os limites em intervalos programados.",
    },
  ],
  "debugging-stale-readings": [
    {
      question: "Por que as leituras das minhas sondas estão desatualizadas?",
      answer:
        "Verifique a alimentação e o Wi-Fi do dispositivo, confira a chave de ingestão, confirme os jobs de cron/histórico em System status e procure lacunas em History antes de trocar os sensores.",
    },
  ],
  "group-membership-model": [
    {
      question: "Qual a diferença entre editor e somente leitura?",
      answer:
        "Editores podem alterar dispositivos, alertas e compartilhamento. Membros somente leitura acompanham os dados ao vivo e o histórico sem mudar a configuração da casa.",
    },
  ],
  "temperature-probe-case-study": [
    {
      question: "Qual foi a conclusão do estudo de caso das sondas?",
      answer:
        "Sondas em várias zonas mais limites de congelamento pegam eventos de frio que sensores únicos deixam passar, principalmente perto de portas e paredes sem isolamento durante ondas de frio polar.",
    },
  ],
  "multi-zone-garage-layout": [
    {
      question: "Onde devo posicionar as sondas para o risco de congelamento?",
      answer:
        "Priorize as zonas que devem ser mais frias: paredes norte, trilhos do portão e cantos externos, não só a bancada onde você fica.",
    },
  ],
  "probe-demo": [
    {
      question: "A demo de sondas usa hardware real?",
      answer:
        "Não: ela simula três zonas para você ver como o ar externo, o sol, o estado da porta e o limite de congelamento mudam as leituras e o JSON, nos mesmos formatos que Devices e Overview usam.",
    },
    {
      question: "Alternar entre Garage / Workshop / Attic / Crawlspace muda o modelo?",
      answer:
        "Sim. Cada ambiente tem o seu próprio deslocamento de base, sensibilidade ao sol (sótãos amplificam a carga de calor; porões a atenuam), intensidade da mistura de ar pela porta e nomes de zona. Não é só uma troca de rótulo: experimente Sun load em Attic e em Crawlspace para sentir a diferença.",
    },
    {
      question: "Qual a diferença entre o JSON de push e o de pull?",
      answer:
        "A ingestão push é um objeto plano que o ESP/Arduino envia via POST para /api/ingest/<key>. O feed pull aninha as mesmas sondas nomeadas em temp (por exemplo north_wall, door_zone, workbench, mais avg) para JSON HTTPS buscado em intervalos programados.",
    },
    {
      question: "O status do ambiente bate com o do painel?",
      answer:
        "Sim, para o risco de congelamento e a observação perto do limite. O simulador reutiliza o mesmo auxiliar de status do ambiente do Overview, com o limite de congelamento que você escolher e a sonda simulada mais fria.",
    },
  ],
  "zapier-make-recipes": [
    {
      question: "Posso conectar o ProbeHarbor ao Zapier ou ao Make?",
      answer:
        "Sim, no Pro, por meio de webhooks de saída para alertas e tokens de entrada para ações como soneca. As receitas ficam nos guias de Zapier/Make em About.",
    },
  ],
  "csv-export-spreadsheet-analysis": [
    {
      question: "O que posso fazer com as exportações CSV?",
      answer:
        "Auditar as mínimas noturnas, comparar estações e documentar quase-congelamentos para o seguro ou para o planejamento da oficina, em qualquer programa de planilhas.",
    },
  ],
  "esphome-shelly-recipes": [
    {
      question: "Preciso parar de usar o MQTT do Home Assistant?",
      answer:
        "Não. Muitas casas usam os dois: o Mosquitto localmente para automações, mais a ingestão push via HTTPS para o SMS de congelamento e vazamento e o histórico do ProbeHarbor.",
    },
    {
      question: "Quais modelos Shelly funcionam?",
      answer:
        "Qualquer Shelly capaz de enviar um HTTP POST (Plus / Gen2 com scripts ou ações de webhook). Mapeie a chave da porta em Dashboard → Devices depois do primeiro POST.",
    },
  ],
  "garage-door-cold-playbook": [
    {
      question: "Posso receber alerta só por porta aberta?",
      answer:
        "Sim, com uma regra de porta aberta, mas combinar porta + temperatura abaixo do limite reduz os alarmes falsos quando você está trabalhando em uma garagem ou oficina aquecida.",
    },
    {
      question: "Onde crio a regra combinada?",
      answer:
        "Dashboard → Alerts → Rules. Adicione condições para porta aberta (ou duração da porta aberta) E temperatura abaixo do seu limite de congelamento, depois salve e envie um alerta de teste.",
    },
  ],
  "personal-weather-stations": [
    {
      question: "Ainda preciso do OpenWeather?",
      answer:
        "O OpenWeather é o padrão e a alternativa de reserva. Estações pessoais substituem o cartão de clima externo e melhoram o contexto do NWS/previsão no seu quintal.",
    },
    {
      question: "Onde ficam guardadas as minhas chaves do Ambient/WeatherFlow?",
      answer:
        "Nos metadados da sua conta (Dashboard → Settings), assim como as preferências de exibição, e não no repositório git público.",
    },
  ],
  "astro-server-side-rendering": [
    {
      question: "O ProbeHarbor usa Astro SSR?",
      answer:
        "Sim. As páginas de marketing, as páginas About e a estrutura do painel são renderizadas na borda do Cloudflare Workers pelo adaptador do Astro, para uma primeira exibição rápida.",
    },
    {
      question: "Tudo é HTML estático?",
      answer:
        "Não. Muitas rotas usam SSR. As partes interativas são hidratadas como ilhas; veja probeharbor.dev/about/astro-islands-and-hydration.",
    },
  ],
  "astro-islands-and-hydration": [
    {
      question: "O que é uma ilha do Astro no ProbeHarbor?",
      answer:
        "Um pequeno componente de cliente (gráficos, formulário de contato, demo de sondas) hidratado só onde é necessário, enquanto o restante da página continua renderizado no servidor.",
    },
    {
      question: "Preciso de uma SPA completa em React para monitoramento?",
      answer:
        "O ProbeHarbor não precisa. Prefira SSR + ilhas para páginas públicas; mantenha a interatividade localizada. Página do produto: probeharbor.dev.",
    },
  ],
  "nextjs-monitoring-dashboards": [
    {
      question: "Por que o ProbeHarbor não é feito em Next.js?",
      answer:
        "Astro no Cloudflare Workers se encaixa bem em SSR na borda e ilhas leves para este produto. O App Router do Next.js é uma ótima alternativa para painéis React com muita autenticação; veja as notas de comparação nesta página.",
    },
    {
      question: "Ainda posso usar o ProbeHarbor com um site em Next.js?",
      answer:
        "Sim, como cliente: as sondas fazem POST para a ingestão do ProbeHarbor independentemente dos seus outros apps. O ProbeHarbor continua sendo a camada hospedada de alertas e histórico.",
    },
  ],
  "node-express-api-patterns": [
    {
      question: "O ProbeHarbor roda em Express?",
      answer:
        "Não. As APIs e páginas públicas rodam no Cloudflare Workers com rotas do Astro. O Express é discutido aqui para comparação com APIs Node de execução contínua.",
    },
    {
      question: "Onde fica a API HTTP?",
      answer:
        "probeharbor.dev/docs/api e openapi.yaml: endpoints de ingestão, métricas, webhooks e claim puck.",
    },
  ],
  "comparing-full-stack-options": [
    {
      question: "Qual stack o ProbeHarbor usa?",
      answer:
        "Astro SSR no Cloudflare Workers, Supabase para os dados e ingestão das sondas via HTTPS. As alternativas (Next, Express) são comparadas nesta página.",
    },
    {
      question: "Devo reconstruir o ProbeHarbor por conta própria?",
      answer:
        "Só se você quiser cuidar da operação. A maioria dos proprietários usa o produto hospedado: probeharbor.dev/pricing.",
    },
  ],
  "relay-security-and-access": [
    {
      question: "Sondas de congelamento ESP32 precisam de um IP público?",
      answer:
        "Não para ingestão push: a placa faz POST HTTPS de saída para o ProbeHarbor. Feeds pull precisam de uma URL JSON HTTPS acessível se você usar esse caminho.",
    },
    {
      question: "Como proteger um relay JSON caseiro?",
      answer:
        "Termine o TLS, restrinja os IPs de origem quando possível e evite colocar chaves de ingestão em repositórios públicos. Prefira as chaves push do ProbeHarbor em Dashboard → Devices.",
    },
  ],
  "thermostat-oauth": [
    {
      question: "Quais termostatos se conectam ao ProbeHarbor?",
      answer:
        "Nest (Google Device Access / SDM) quando os secrets do Worker estão definidos, e Ecobee quando o cadastro de desenvolvedores está aberto. Guia: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "O Nest é necessário para os alertas de congelamento?",
      answer:
        "Não. Os alertas de congelamento usam as suas sondas. Nest/Ecobee adicionam o contexto do interior da casa no Overview quando o plano permite (Pro).",
    },
    {
      question: "E se o cadastro de desenvolvedores do Ecobee estiver fechado?",
      answer:
        "Use Home Assistant → ingestão → Indoor reference em Dashboard → Devices, para que a temperatura ambiente da casa continue aparecendo sobre o seu gráfico da semana.",
    },
  ],
  "mqtt-bridge": [
    {
      question: "Tenho que abandonar o MQTT para usar o ProbeHarbor?",
      answer:
        "Não. Mantenha o Mosquitto/Home Assistant para as automações locais e faça POST HTTPS na ingestão para os alertas de congelamento/vazamento e o histórico do ProbeHarbor.",
    },
    {
      question: "O que a ponte MQTT publica?",
      answer:
        "Ela converte os tópicos do broker em JSON de ingestão do ProbeHarbor (temperaturas, portas, vazamentos). Detalhes: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "O TLS até o probeharbor.dev é obrigatório?",
      answer:
        "Sim, para a ingestão na nuvem. O MQTT local pode ficar na sua rede local; a ponte ou o dispositivo precisa fazer POST HTTPS para a sua URL de ingestão.",
    },
  ],
  "probe-mounting-enclosures": [
    {
      question: "Onde devo instalar um DS18B20 à prova d'água?",
      answer:
        "No metal do cano ou em ar parado, longe de portas ensolaradas. Não esmague a gota de epóxi. Guia: probeharbor.dev/about/probe-mounting-enclosures.",
    },
    {
      question: "O ESP32 pode ficar no porão junto com a sonda?",
      answer:
        "Prefira um gabinete seco para o microcontrolador e leve só a ponta da sonda até as áreas úmidas. A umidade mata placas mais rápido que sensores.",
    },
    {
      question: "Existe uma lista de peças para a fixação?",
      answer:
        "Sim: abraçadeiras, presilhas, fitas e notas sobre o 4,7k em probeharbor.dev/probe-mount-kit, além da lista de materiais do kit de congelamento ESP32.",
    },
  ],
} satisfies AboutFaqOverlay;
