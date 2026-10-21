import type { AboutPageOverlay } from "../index";

/** Brazilian Portuguese about-page metadata, part 2 (feeds, firmware targets, alerts and playbooks). */
export default {
  "configuring-temperature-feeds": {
    title: "Configurar feeds de temperatura",
    description:
      "Adicione URLs de feeds pull HTTPS, defina a chave raiz do JSON, nomeie as sondas e confira a Home: complemento do guia “Adicionar dispositivos”.",
    summary: "URLs de feeds pull, chave raiz do JSON, rótulos das sondas e solução de problemas.",
  },
  "humidity-condensation-basics": {
    title: "Noções básicas de umidade e condensação",
    description:
      "Como umidade relativa, ponto de orvalho e superfícies frias interagem em espaços sem aquecimento, e o que as sondas DHT22 conseguem ou não informar.",
    summary:
      "O cálculo do ponto de orvalho em linguagem simples e por que só a temperatura do ar não mostra o risco de condensação.",
  },
  "probe-cable-length-limits": {
    title: "Limites de comprimento do cabo da sonda",
    description:
      "Como cabos DHT22 sem blindagem afetam a confiabilidade das leituras e os erros de tempo, e quando encurtar ou mudar o trajeto da fiação.",
    summary:
      "Mantenha as linhas de dados curtas, trançadas e longe do ruído de motores para ter feeds JSON estáveis.",
  },
  "thermal-mass-concrete-slab": {
    title: "Massa térmica e piso de concreto",
    description:
      "Por que o piso de concreto reage com atraso ao clima externo, acumula calor e faz as sondas perto do chão lerem diferente das que ficam na altura do peito.",
    summary:
      "O concreto amortece o ciclo dia-noite: espere picos atrasados e piso frio depois de tardes quentes.",
  },
  "hvac-duct-influence": {
    title: "Influência dos dutos de climatização nas sondas",
    description:
      "Quando dutos de aquecimento ou ar-condicionado passam por um espaço sem aquecimento, como fluxos de ar e vazamentos alteram as leituras.",
    summary:
      "Dutos com vazamento e saídas de ar próximas criam calor localizado que o clima externo não explica.",
  },
  "stored-vehicle-heat": {
    title: "Calor de veículos estacionados na garagem",
    description:
      "Como carros que acabaram de rodar irradiam calor, aumentam a umidade e distorcem temporariamente as sondas de temperatura próximas.",
    summary:
      "Motores e escapamentos quentes criam microclimas passageiros ao redor dos veículos estacionados.",
  },
  "spotting-data-gaps": {
    title: "Encontrar lacunas no histórico",
    description:
      "Identifique registros ausentes, quedas de feed e lacunas causadas por reinícios nos gráficos antes que distorçam as auditorias de congelamento.",
    summary:
      "Linhas retas, degraus e intervalos vazios geralmente indicam que a coleta parou, não que o clima ficou estável.",
  },
  "charting-with-spreadsheets": {
    title: "Gráficos do histórico em planilhas",
    description:
      "Monte gráficos dinâmicos, mínimas móveis da madrugada e gráficos de umidade com dois eixos a partir dos CSV do ProbeHarbor para auditar congelamentos.",
    summary:
      "Transforme linhas brutas com data e hora em auditorias de congelamento e comparações sazonais fora do site.",
  },
  "serial-debugging-tips": {
    title: "Dicas de depuração pela serial",
    description:
      "Use bem o monitor serial do Arduino para ver o tempo do DHT22, o status da Ethernet e logs de HTTP durante os testes na bancada.",
    summary:
      "Uma saída serial organizada acelera a depuração do firmware antes de a placa ir para o espaço monitorado.",
  },
  "library-dependencies": {
    title: "Dependências de bibliotecas do sketch",
    description:
      "Quais bibliotecas Arduino o firmware da sonda espera, armadilhas de versão e como reproduzir um build que funciona.",
    summary:
      "Fixar versões compatíveis de DHT, LiquidCrystal e Ethernet evita surpresas na compilação em notebooks novos.",
  },
  "static-ip-vs-dhcp": {
    title: "IP fixo ou DHCP no Arduino",
    description:
      "Escolha entre a praticidade do DHCP e IPs fixos reservados para ter endpoints JSON confiáveis nas sondas e regras de firewall simples.",
    summary:
      "Endereços estáveis simplificam a configuração do relay, o redirecionamento de portas e os testes com curl.",
  },
  "ground-loop-avoidance": {
    title: "Como evitar laços de terra",
    description:
      "Evite caminhos de terra duplicados e referências ruidosas quando a alimentação USB da bancada encontra a fonte P4 e cabos longos de sensor.",
    summary:
      "Um único ponto de terra em estrela, bem pensado, evita timeouts misteriosos do DHT22 causados por correntes de laço.",
  },
  "enclosure-ventilation": {
    title: "Ventilação da caixa dos eletrônicos",
    description:
      "Ventile as caixas do projeto para que LCD, shield Ethernet e reguladores fiquem frios sem aquecer o ar medido pelas sondas remotas.",
    summary:
      "A caixa do microcontrolador precisa de fluxo de ar; a da sonda, de aberturas que deixem o ar passar: não trate as duas igual.",
  },
  "backlight-pwm-options": {
    title: "Opções de PWM para a luz de fundo do LCD",
    description:
      "Diminua a luz de fundo do LCD 16×2 com transistor, pino PWM ou desligamento programado para reduzir o brilho e o consumo à noite.",
    summary:
      "O controle da luz de fundo é separado dos pinos de dados do LiquidCrystal: faça essa ligação com cuidado.",
  },
  "jumper-wire-standards": {
    title: "Padrões de jumpers para protoboard",
    description:
      "Escolha entre jumpers rígidos e flexíveis, convenções de cores e alívio de tensão mecânica para instalações sujeitas a vibração.",
    summary:
      "Cores consistentes e encaixe firme evitam sondas intermitentes quando o portão faz a parede tremer.",
  },
  "sensor-warm-up-time": {
    title: "Tempo de aquecimento do sensor DHT22",
    description:
      "Dê tempo para o sensor estabilizar depois de ligado antes de confiar na umidade para decisões sobre condensação ou mofo.",
    summary:
      "As primeiras leituras após o boot podem atrasar; os minutos de aquecimento pesam mais na umidade do que na temperatura.",
  },
  "lcd-i2c-alternative": {
    title: "Alternativa com LCD I²C",
    description:
      "Libere pinos GPIO trocando o LiquidCrystal paralelo por um módulo adaptador I²C quando o shield Ethernet esgota os pinos disponíveis.",
    summary:
      "LCDs I²C de dois fios economizam pinos, mas exigem outra biblioteca e planejamento de endereços.",
  },
  "weather-api-parallel-path": {
    title: "API de clima como caminho de dados paralelo",
    description:
      "Busque a previsão e as condições externas junto com o JSON das sondas para dar contexto na página inicial ou combinar em arquivos CSV.",
    summary:
      "Dados de clima externos explicam oscilações na garagem causadas por umidade e vento lá fora, não só pela abertura do portão.",
  },
  "group-membership-model": {
    title: "Modelo de associação a grupos",
    description:
      "Veja como os grupos default, member e admin no Supabase controlam a exportação CSV, as ferramentas de operador e os recursos do plano, sem e-mails fixos.",
    summary:
      "Os grupos representam papéis de assinatura e de operador sem deixar e-mails fixos no código-fonte.",
  },
  "display-preferences-deep-dive": {
    title: "Preferências de exibição em detalhe",
    description:
      "Escolha Fahrenheit ou Celsius como padrão, a ordem dos cards de status e a visibilidade de cada feed na página inicial após o login.",
    summary:
      "As preferências ficam salvas por conta, então os feeds JSON compartilhados aparecem nas unidades que você prefere.",
  },
  "kit-qr-onboarding": {
    title: "Configuração do kit por QR code",
    description:
      "Cole na caixa da sonda um QR code com a URL de ingestão e configure o dispositivo no ProbeHarbor com um só escaneamento, sem digitar chaves longas.",
    summary:
      "Grave a URL de ingestão em uma etiqueta para que configurar um hardware novo seja só escanear com o celular.",
  },
  "esp32-freeze-kit": {
    title: "Lista de peças do kit ESP32 contra congelamento",
    description:
      "Compre um ESP32 e um DS18B20 à prova d'água compatíveis com os sketches de ingestão push do ProbeHarbor. Páginas da Adafruit e Amazon, não um kit de marca.",
    summary:
      "Lista de materiais verificada de ESP32 + DS18B20 à prova d'água, com links estáveis da Adafruit e alternativas /dp/ da Amazon.",
  },
  "esp32-ota-firmware": {
    title: "OTA no ESP32 e envio do nível de bateria",
    description:
      "Mantenha o firmware das sondas ESP32 atualizado via OTA na rede local enquanto a ingestão push envia bateria e RSSI para a API HTTP do ProbeHarbor.",
    summary:
      "Mantenha o firmware do ESP32 atualizado na rede local enquanto a telemetria vai para a API de ingestão.",
  },
  "esp32-web-flash": {
    title: "Opções para gravar o ESP32",
    description:
      "Grave as sondas ESP32 com Arduino IDE, PlatformIO, MicroPython ou o esptool web da Espressif, depois de baixar um sketch preenchido em Devices.",
    summary:
      "Grave pelo navegador com firmware pronto (beta) ou baixe um sketch personalizado e grave com uma IDE, PlatformIO ou esptool-js.",
  },
  "pico-w-ingest": {
    title: "Ingestão com Raspberry Pi Pico W",
    description:
      "Envie leituras do DS18B20 a partir de um Pico W ou Pico 2 W com CircuitPython, MicroPython ou o core Arduino-Pico. Mesma ingestão HTTPS do ESP32.",
    summary:
      "Sondas Wi‑Fi com RP2040 / RP2350: CircuitPython code.py, MicroPython ou Arduino do Earle Philhower, DS18B20 no GP4.",
  },
  "stm32-zephyr-ingest": {
    title: "Ingestão com STM32 e Zephyr",
    description:
      "Envie leituras do DS18B20 a partir de uma Nucleo-F767ZI com Zephyr em C e Ethernet integrada. west, ST-LINK e o mesmo relay HTTPS local do Uno.",
    summary:
      "Sonda Ethernet Cortex-M7: Zephyr em C na Nucleo-F767ZI, DS18B20 no D4 do Arduino, HTTP para um relay TLS na rede local.",
  },
  "ch32v-riscv-ingest": {
    title: "Ingestão com CH32V (RISC-V)",
    description:
      "Envie leituras do DS18B20 a partir de um WCH CH32V307 com WCHNET em C e Ethernet integrada. MounRiver Studio e o mesmo relay HTTPS local do Uno.",
    summary:
      "Sonda Ethernet RISC-V: WCHNET em C no CH32V307, DS18B20 no PB12, HTTP para um relay TLS na rede local.",
  },
  "avr-asm-ingest": {
    title: "Ingestão em assembly AVR",
    description:
      "Envie leituras do DS18B20 a partir de um ATmega328P em assembly GNU AVR com shield W5100. avr-gcc, avrdude e o mesmo relay HTTPS local do Uno.",
    summary:
      "Uno + W5100 em assembly GNU AVR: DS18B20 no D7, HTTP para um relay TLS na rede local, sem Arduino C.",
  },
  "cellular-ingest": {
    title: "Ingestão por rede celular (Particle Boron)",
    description:
      "Envie leituras do DS18B20 a partir de um Particle Boron via LTE com um webhook do Console. Para locais remotos sem Wi-Fi na garagem.",
    summary:
      "Sonda LTE contra congelamento: Particle Boron + DS18B20 no D2, webhook da Particle para a ingestão HTTPS.",
  },
  "pic18-ethernet-ingest": {
    title: "Ingestão Ethernet com PIC18F67J60",
    description:
      "Envie leituras do DS18B20 a partir de um PIC18F67J60 com a pilha TCP/IP da Microchip no MPLAB X e o mesmo relay HTTPS local do Uno.",
    summary:
      "Sonda Ethernet Microchip: MLA em C no PIC18F67J60, DS18B20 no RD0, HTTP para um relay TLS na rede local.",
  },
  "teensy41-ingest": {
    title: "Ingestão Ethernet com Teensy 4.1",
    description:
      "Envie leituras do DS18B20 a partir de um Teensy 4.1 com QNEthernet. Sonda rápida i.MX RT1062 para a garagem, com o mesmo relay HTTPS local do Uno.",
    summary: "Teensy 4.1 + QNEthernet: DS18B20 no pino 4, HTTP para um relay TLS na rede local.",
  },
  "zapier-make-recipes": {
    title: "Receitas para Zapier e Make.com",
    description:
      "Conecte os webhooks de alerta e as ações de soneca do ProbeHarbor ao Zapier ou Make.com para automações no-code de congelamento, vazamento e férias.",
    summary:
      "Envie alertas para Zapier/Make e pause as notificações a partir de outros fluxos de casa inteligente.",
  },
  "cold-snap-playbook": {
    title: "Guia de ação para ondas de frio",
    description:
      "O que fazer antes, durante e depois de um alerta de congelamento: limites, horário de silêncio, confirmação e escalonamento.",
    summary: "Um checklist prático para que os alertas de congelamento virem ação, e não ruído.",
  },
  "alert-channel-cookbook": {
    title: "Guia prático de canais de alerta",
    description:
      "Ative e-mail, chat, SMS, push e webhooks: preencha os destinos, teste a entrega e escale quando ninguém confirmar.",
    summary:
      "Escolha canais que combinem com o jeito como sua casa realmente acorda nas ondas de frio.",
  },
  "household-sharing-walkthrough": {
    title: "Passo a passo do compartilhamento da residência",
    description:
      "Convide a família por e-mail, defina papéis de editor ou só visualização e compartilhe um dashboard de risco de congelamento sem dar a senha do ProbeHarbor.",
    summary: "Mantenha sondas e alertas em uma só residência sem compartilhar senha.",
  },
  "probe-demo": {
    title: "Demonstração interativa de sondas",
    description:
      "Simule temperaturas em várias zonas com limite de congelamento, status do espaço e JSON push/pull como em Devices e Overview no uso real.",
    summary:
      "Garagem, oficina, sótão ou porão raso: veja o risco de congelamento e vazamento e o JSON de ingestão mudarem ao vivo.",
  },
  "esphome-shelly-recipes": {
    title: "Receitas para ESPHome e Shelly",
    description:
      "Envie temperatura, umidade e sensor de porta do firmware ESPHome ou Shelly para a ingestão push do ProbeHarbor sem sketches Arduino personalizados.",
    summary:
      "Receitas de HTTP POST para copiar e colar com sensores comuns da rede local: rode em paralelo com o MQTT do Home Assistant.",
  },
  "garage-door-cold-playbook": {
    title: "Guia de ação: portão da garagem + alerta de frio",
    description:
      "Receba um alerta quando o portão fica aberto enquanto a temperatura cai: ingestão do sensor de porta, regras combinadas e o que a família deve fazer.",
    summary:
      "Evite perda de calor e risco de congelamento quando o portão da garagem fica aberto em uma noite fria.",
  },
  "home-assistant-notify-recipes": {
    title: "Receitas de notify no Home Assistant",
    description:
      "Leve os alertas do ProbeHarbor ao notify, TTS e push no celular do Home Assistant: webhooks de saída, serviços HACS e soneca de entrada.",
    summary:
      "Aviso por voz e no celular quando há risco de congelamento ou vazamento: em paralelo com e-mail/SMS do ProbeHarbor.",
  },
  "personal-weather-stations": {
    title: "Estações meteorológicas pessoais (Ambient e WeatherFlow)",
    description:
      "Use uma estação Ambient Weather ou WeatherFlow Tempest no quintal para contexto externo, alertas do NWS (EUA) e previsão do risco de congelamento.",
    summary:
      "Aponte o ProbeHarbor para a estação no seu terreno: contexto de congelamento mais preciso, no nível do quintal.",
  },
  "freeze-thaw-flood-playbook": {
    title: "Guia de ação: congelamento → degelo → alagamento",
    description:
      "Posicione sensores de água para alagamentos no degelo: como funcionam os alertas, por que disparam mesmo no modo férias e o que fazer se um sensor molhar.",
    summary:
      "Complemento do guia de ondas de frio: detecte alagamentos e gotejamentos sob aquecedores, lavanderia e poços de bomba no fim da temporada de frio.",
  },
  "time-to-freeze": {
    title: "Tempo até o congelamento, explicado",
    description:
      "Alerta por limite, horas restantes até congelar, previsão externa do Member e NWS do Pro: o que o modelo usa e como ativar o tempo até congelar em Alerts.",
    summary:
      "Entenda o relógio de horas até o congelamento para agir antes que a sonda passe do seu limite.",
  },
} satisfies AboutPageOverlay;
