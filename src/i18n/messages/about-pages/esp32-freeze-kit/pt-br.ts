
/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */
import type { Esp32FreezeKitMessages } from "./en";

const ptBr: Esp32FreezeKitMessages = {
  howTo: {
    name: "Monte uma sonda de congelamento ESP32 para o ProbeHarbor",
    steps: [
      {
        name: "Compre a lista de materiais",
        text: "Arrume um ESP32 com Wi-Fi, um DS18B20 à prova d’água e um resistor pull-up de 4,7 kΩ se o pacote da sonda não incluir um. Prefira as páginas de produto da Adafruit; os links /dp/ da Amazon são alternativas opcionais.",
      },
      {
        name: "Ligue o DS18B20",
        text: "Ligue VCC em 3,3 V, GND em GND e dados no GPIO 4, com um pull-up de 4,7 kΩ entre dados e 3,3 V. Prenda a ponta de inox no cano mais frio ou na parede norte.",
      },
      {
        name: "Crie um dispositivo push",
        text: "Crie uma conta gratuita no ProbeHarbor e um dispositivo push em Dashboard → Devices, e copie a chave do dispositivo.",
      },
      {
        name: "Instale pelo navegador e confira",
        text: "Conecte o ESP32 via USB, abra o gravador web no Chrome ou Edge, instale o firmware e envie seu Wi-Fi e a chave do dispositivo. A página confirma quando a primeira leitura chega. Não precisa do Arduino IDE.",
      },
      {
        name: "Ative os alertas de congelamento",
        text: "Defina o limite de congelamento e o e-mail em Alerts → When to alert, envie um alerta de teste e, se quiser, ative o aviso de tempo até o congelamento.",
      },
    ],
  },
  introHtml:
    'O ProbeHarbor não vende hardware. Compre as peças abaixo e instale o firmware pelo navegador com o <a class="text-link" href="/flash">gravador web</a>: sem Arduino IDE, sem código, e ele envia à placa seu Wi‑Fi e a chave do dispositivo pelo mesmo cabo USB. Se preferir ler ou editar o código, os sketches em <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> esperam um <strong>ESP32 com Wi‑Fi</strong> e um <strong>DS18B20 à prova d’água</strong>. Compre as peças abaixo (Adafruit para SKUs conhecidos, links de produto da Amazon quando quiser um DevKit mais barato) e, em vez disso, crie um dispositivo push e grave um sketch já preenchido a partir de <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Lista de materiais recomendada",
    caption: "Peças para uma sonda de congelamento ESP32",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardPart: "Placa ESP32",
    boardWhy: "Envio push via HTTPS por Wi‑Fi (TLS no próprio chip)",
    amazonDevKit: "DevKit na Amazon",
    probePart: "DS18B20 à prova d’água",
    probeWhy: "Sonda para cano ou porão; funciona abaixo de zero",
    includesPullupHtml: "(inclui 4,7&nbsp;kΩ)",
    amazonProbe: "Sonda na Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obrigatório na linha de dados 1-Wire se o pacote da sonda não incluir um",
    amazonResistor: "4,7k na Amazon",
    powerPart: "Alimentação USB",
    powerWhy: "Fonte de tomada ou cabo USB-C; quando der, deixe a placa num lugar mais quente que o da sonda",
    powerBuyHtml: "Qualquer fonte USB de 5&nbsp;V com ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Os anúncios de produtos mudam: use a Adafruit como lista de referência. Os links <code>/dp/</code> da Amazon em <code>bomLinks</code> são alternativas compatíveis com o programa de Associados enquanto o anúncio estiver ativo. Kits genéricos “ESP32 + DS18B20” costumam vir com um DHT11 em vez de uma sonda à prova d’água — evite-os.",
  wire: {
    title: "Faça a ligação",
    diagramAlt: "Diagrama de ligação: ESP32 DevKit a um DS18B20 à prova d’água com pull-up de 4,7 quilo-ohms no GPIO 4",
    captionHtml:
      "Vermelho → 3,3&nbsp;V, preto → GND, dados amarelo/branco → GPIO 4, com um pull-up de 4,7&nbsp;kΩ entre dados e 3,3&nbsp;V. O sketch de exemplo usa o GPIO 4 por padrão.",
    itemsHtml: [
      "<strong>Vermelho</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Preto</strong> (GND) → GND",
      "<strong>Amarelo / branco</strong> (dados) → GPIO 4 (padrão do sketch de exemplo; qualquer GPIO digital livre funciona se você mudar o pino)",
      "4,7&nbsp;kΩ entre dados e 3,3&nbsp;V",
    ],
    featherHtml:
      'Numa Adafruit Feather (HUZZAH32 ou ESP32 Feather V2), o GPIO 4 é o pino marcado como <strong>A5</strong>. Veja as <a class="text-link" href="/flash#feather-pins">notas sobre a Feather na página do gravador</a> para os detalhes extras.',
    strap:
      "Prenda a sonda de inox no cano mais frio ou na parede norte com uma abraçadeira e envolva a sonda e um trecho curto do cano com isolamento de espuma, para medir a temperatura do cano e não a do ar do ambiente.",
  },
  flash: {
    title: "Grave e conecte",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita</a> e um dispositivo push em Devices.',
      'Abra o <a class="text-link" href="/flash">gravador web</a> no Chrome ou Edge, conecte o ESP32, clique em Install e envie seu Wi‑Fi e a chave do dispositivo. Ele mostra "First reading delivered" quando a sonda está ativa.',
      'Prefere código? Baixe o <code>.ino</code> do Arduino ou o <code>.py</code> do MicroPython já preenchidos em Devices e grave conforme as <a class="text-link" href="/about/esp32-web-flash">opções de gravação do ESP32</a> (o monitor serial a 115200 deve mostrar <code>POST 200</code>).',
      'Opcional: imprima o <a class="text-link" href="/about/kit-qr-onboarding">QR do kit</a> de ingestão na caixa.',
      'Defina o limite de congelamento e o e-mail em <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> e ative o aviso de tempo até o congelamento se quiser ser avisado antes de a sonda chegar ao ponto de congelamento.',
    ],
  },
  avoid: {
    title: "O que não comprar contra cano congelado",
    itemsHtml: [
      "<strong>Kits iniciais só com DHT11</strong>: fracos abaixo de zero, fios curtos, não são à prova d’água.",
      "<strong>Sensores de ambiente Bluetooth / Zigbee</strong>: não falam a ingestão push do ProbeHarbor.",
      "<strong>Uno + Ethernet sozinho</strong>: precisa de um relay HTTPS na rede local; bom para montagens avançadas, não para o primeiro kit.",
    ],
    dhtNoteHtml: `O DHT22 continua servindo para o ar e a umidade da oficina (seu estudo de caso da garagem com Ethernet). Para canos, prefira o DS18B20. Cabo de PTFE para alta temperatura: {highTempLink} se a sonda ficar perto de um aquecedor de água ou de um cabo de aquecimento.`,
  },
  extras: {
    title: "Extras opcionais",
    itemsHtml: [
      "Um segundo DS18B20 no mesmo barramento 1-Wire para comparar a área da porta com a parede do cano (multizona).",
      "Caixa de ABS ventilada + prensa-cabo para o ESP32 numa garagem empoeirada.",
      "Kits iniciais ELEGOO ou ESP32 genéricos servem <em>se</em> você ainda adicionar um DS18B20 à prova d’água: o DHT11 que vem junto não é a sonda de congelamento.",
    ],
  },
  related: {
    title: "Relacionados",
    labels: [
      "Adicionar dispositivos push e pull",
      "Opções de gravação do ESP32",
      "Ingestão com Raspberry Pi Pico W",
      "Ativação pelo QR do kit",
      "Kit de fixação de sondas",
      "Acessórios de hardware",
      "Fixação de sondas e caixas",
      "Checklist da temporada de frio",
    ],
  },
};

export default ptBr;
