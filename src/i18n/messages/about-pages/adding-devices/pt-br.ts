
/**
 * /about/adding-devices body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI labels
 * (Devices, Create push device, Reveal ingest key…) stay English because the
 * dashboard is English-only.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const DEV = "https://probeharbor.dev/developers";
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer">`;
const downloads =
  "<strong>Download Arduino .ino</strong> / <strong>MicroPython .py</strong> / <strong>CircuitPython code.py</strong> / <strong>Zephyr main.c</strong> / <strong>CH32V main.c</strong> / <strong>AVR main.S</strong> / <strong>Teensy 4.1 .ino</strong> / <strong>PIC18 main.c</strong> / <strong>Particle Boron .ino</strong> / <strong>ESPHome snippet</strong>";
const curlBlock = '<a class="text-link" href="/api/feeds/example?format=ingest">';
import type { AddingDevicesMessages } from "./en";

const ptBr: AddingDevicesMessages = {
  introHtml: [
    'O ProbeHarbor aceita leituras de duas formas: seu hardware <strong>envia</strong> (push) JSON para uma URL de ingestão, ou nós <strong>buscamos</strong> (pull) JSON via HTTPS de um feed público em intervalos programados. As duas são configuradas em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. Nós ESP ou a bateria novos devem usar push. Pull é para servidores na rede local sempre ligados ou relays que já expõem JSON via HTTPS.',
    'Uma conta gratuita (sem cartão de crédito) vincula sua chave de ingestão à sua casa, para que o histórico e os alertas continuem privados. Se quiser ver leituras sem se cadastrar, dê uma olhada antes na <a class="text-link" href="/demo">demo ao vivo</a>.',
  ],
  choose: {
    title: "Escolha push ou pull",
    colPush: "Ingestão push",
    colPull: "Feed pull",
    rowsHtml: [
      ["Quem inicia", "Seu dispositivo", "ProbeHarbor"],
      ["Rede", "O dispositivo precisa de HTTPS de saída (Uno Ethernet: HTTP para um relay TLS na rede local)", "A URL do feed precisa ser acessível publicamente"],
      ["Autenticação", "Chave por dispositivo na URL; aviso de gravação + Reveal ingest key", "URL HTTPS pública (TLS)"],
      [
        "Formato do JSON",
        "Chaves planas, objeto <code>temp</code>, <code>sensors[]</code>, SenML ou HA REST",
        "Raiz <code>temp</code> aninhada (padrão); SenML ou HA REST detectados automaticamente",
      ],
      [
        "Ideal para",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + relay HTTPS na rede local), Arduino Uno + Ethernet",
        "Servidores Ethernet, relays FastAPI",
      ],
    ],
  },
  push: {
    title: "Dispositivo push (recomendado)",
    stepsHtml: [
      'Entre na sua conta e abra <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Em <strong>Push devices</strong>, clique em <strong>Create push device</strong> (o nome padrão é Workshop probe; dá para renomear quando quiser).",
      `No aviso de ingestão: escaneie o QR ou use ${downloads} (URL ou caminho de ingestão já preenchido). A chave fica na página por 30 minutos e sobrevive a uma atualização até você fechá-la.`,
      "<strong>Perdeu a chave depois?</strong> No cartão do dispositivo, use <strong>Reveal ingest key</strong> (quando a recuperação de chaves estiver ativada no servidor) ou <strong>Rotate key</strong> para gerar uma nova. Dispositivos criados antes de a recuperação de chaves ser ativada precisam de uma rotação para guardar uma cópia criptografada recuperável.",
      'Grave um ESP32 (veja as <a class="text-link" href="/about/esp32-web-flash">opções de gravação</a>: Arduino IDE, PlatformIO, MicroPython ou o esptool web da Espressif), uma Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), uma STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), um CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), um Uno em assembly GNU AVR (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), uma Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), um PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) ou uma Particle Boron (<a class="text-link" href="/about/cellular-ingest">webhook LTE</a>). Precisa das peças antes? <a class="text-link" href="/about/esp32-freeze-kit">Lista de materiais do kit de congelamento ESP32</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">assembly AVR</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> ou <a class="text-link" href="/about/cellular-ingest">celular</a> (DS18B20 à prova d’água). O monitor serial a <strong>115200</strong> deve mostrar <code>POST 200</code> (ou <code>publish ok</code> na Boron). As chaves dos sensores são importadas automaticamente (chaves planas, objeto <code>temp</code>, SenML ou Home Assistant REST). Depois, renomeie os sensores na página Devices. O mapeamento manual em <strong>Advanced</strong> é opcional, para mapear as chaves antecipadamente.',
      `Mais exemplos (Uno Ethernet + DHT22, MAX31855, MAX6675 etc.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. O W5100 não faz TLS: envie um POST HTTP para um relay na rede local (<a class="text-link" href="/about/python-feeds">feeds em Python</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Faça um teste rápido com curl e abra <a class="text-link" href="/dashboard/live">Live</a> com a conta conectada. Depois de uns 30 minutos sem envios, o Live avisa que uma sonda pode estar off-line.',
    ],
  },
  curl: {
    title: "Exemplo com curl (push)",
    introHtml: `Pegue um corpo de exemplo ao vivo no ${curlBlock}feed de ingestão de exemplo</a> (baseado no clima) e envie com POST para a chave do seu dispositivo.`,
    payloadsHtml: `Formatos de payload: chaves planas, o objeto clássico <code>temp</code>, <code>sensors[]</code> tipado, <strong>SenML (RFC 8428)</strong> ou JSON <code>state</code> do <strong>Home Assistant REST</strong>. Eles estão documentados em <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a> e na referência para desenvolvedores de <a class="text-link" href="${DEV}/ingest/">ingestão push</a>. Teste exemplos ao vivo: ${curlBlock}nativo</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Feed pull",
    step1Html: "Confirme que seu feed retorna JSON via HTTPS. Formato clássico (chave raiz padrão <code>temp</code>):",
    stepsHtml: [
      'Abra <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Adicione um feed: nome, URL HTTPS e <strong>JSON root key</strong> (padrão <code>temp</code>). Use <strong>Test feed URL</strong> antes de salvar.",
      "Clique em <strong>Save pull setup</strong>: as chaves das sondas são importadas automaticamente do feed ao vivo. Renomeie os rótulos na mesma página ou clique em <strong>Accept suggested names</strong>.",
      'Clique em <strong>Fetch now</strong> para buscar leituras na hora, ou espere a próxima consulta programada e confira os cartões em <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Por padrão, os feeds pull esperam objetos de sonda aninhados sob a raiz configurada (não chaves planas no estilo push). <strong>Arrays JSON SenML</strong> e respostas do <strong>Home Assistant REST</strong> são detectados automaticamente quando essa raiz não existe: cole a URL como está e mapeie as chaves de sonda que o SenML ou o HA expõem (ex.: <code>0</code>, <code>state</code>). Se o microcontrolador não faz TLS (Uno + shield Ethernet W5100), use um relay HTTPS local (veja <a class="text-link" href="/about/python-feeds">feeds em Python</a> ou o ${relay}encaminhador HTTP→HTTPS</a> com a biblioteca padrão para ingestão push).`,
  },
  mqtt: {
    title: "Já usa MQTT?",
    bodyHtml:
      'Mantenha o Mosquitto ou o MQTT do Home Assistant na sua rede local e espelhe as leituras via HTTPS. O ProbeHarbor não é um broker MQTT. Receita completa (curl, <code>rest_command</code> do HA, Node-RED): <a class="text-link" href="/about/mqtt-bridge">guia da ponte MQTT</a>. Veja também <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs. MQTT caseiro</a>.',
  },
  verify: {
    title: "Confira se está tudo funcionando",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: os cartões se atualizam ao vivo; sondas atrasadas mostram um aviso amarelo de off-line depois de uns 30 minutos.',
      "<strong>Devices → Status</strong>: última conexão, bateria e RSSI quando o payload os inclui (depois da primeira leitura ao vivo).",
      "<strong>O essencial contra congelamento</strong>: defina o limite de congelamento e o e-mail em Devices após o primeiro POST, ou em Alerts → When to alert, e envie um teste (libera o Overview completo após a configuração inicial).",
      "<strong>Overview</strong>: status do espaço; depois do essencial, as métricas de Status (horas abaixo de zero, margem mais fria, ΔT interno−externo, dispersão entre sondas) e <strong>Insights</strong> (noites de risco, porta/energia/movimento, qualidade do ar). Os gráficos semanais podem sobrepor umidade e ponto de orvalho quando há UR.",
    ],
  },
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">API de ingestão e webhooks de alerta</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Ativação pelo QR do kit</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configurar feeds de temperatura</a> (pull em detalhes)',
      '<a class="text-link" href="/about/debugging-stale-readings">Depurar leituras desatualizadas</a>',
      `<a class="text-link" href="/about/mqtt-bridge">Receita da ponte MQTT</a> · <a class="text-link" href="/compare/diy-mqtt">vs. MQTT caseiro</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">documentação MQTT para desenvolvedores</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Desenvolvedores: ingestão push</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">feeds pull</a>`,
    ],
  },
};

export default ptBr;
