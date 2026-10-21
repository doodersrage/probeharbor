/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */
import type { FlashMessages } from "./en";

const ptBr: FlashMessages = {
  title: "Grave um sensor de congelamento ESP32 pelo navegador",
  description:
    "Transforme um ESP32 e uma sonda DS18B20 em sensor de congelamento sem instalar IDE: grave pelo navegador, informe o Wi-Fi e uma chave de dispositivo e pronto.",
  breadcrumbHome: "Início",
  breadcrumbFlash: "Gravador web",
  faqs: [
    {
      question: "Do que eu preciso?",
      answer:
        "Uma placa ESP32, ESP32-S3 ou ESP32-C3, uma sonda DS18B20 à prova d’água ou um sensor de temperatura e umidade DHT22 (ou DHT11) com um resistor pull-up de 4,7 kΩ no GPIO 4, um cabo USB de dados e o Chrome ou o Edge em um computador ou notebook.",
    },
    {
      question: "Preciso do Arduino IDE?",
      answer:
        "Não. O firmware vem pré-compilado e é instalado pelo navegador. O Wi-Fi e a chave do dispositivo são enviados para a placa depois da gravação, então não é preciso compilar nada.",
    },
    {
      question: "Posso adicionar mais de uma sonda?",
      answer:
        "Sim, até quatro sondas DS18B20 no mesmo pino. Elas aparecem como temp1 a temp4 e podem ser renomeadas no painel. Um DHT22 é um sensor por placa.",
    },
    {
      question: "O que mais posso conectar?",
      answer:
        "Um sensor I²C de temperatura e umidade (BME280, SHT31 ou AHT20, detectado automaticamente; o BME280 também informa a pressão do ar), um contato de vazamento ou de água para alertas de alagamento, um interruptor magnético de porta e uma bateria por um divisor resistivo 1:1 para estimar a autonomia. Marque as opções de vazamento, porta e bateria ao enviar as configurações para que a placa saiba que estão ligados.",
    },
    {
      question: "Funciona com um DHT22?",
      answer:
        "Sim. A ligação é a mesma (dados no GPIO 4, 4,7 kΩ para 3,3 V). O firmware procura primeiro sondas DS18B20 e, se não houver nenhuma, lê um DHT22 ou DHT11 nesse pino, informando temperatura e umidade. A DS18B20 é a melhor escolha encostada em um cano; o DHT22 serve para o ar do ambiente e a umidade de um porão ou vão sob o piso.",
    },
    {
      question: "Como passo a placa para outra rede?",
      answer:
        "Segure o botão BOOT por cinco segundos para apagar o Wi-Fi e a chave salvos e depois envie novas configurações por esta página ou pela rede ProbeHarbor-Setup.",
    },
    {
      question: "O firmware é open source?",
      answer:
        "Sim. O código-fonte está no repositório do ProbeHarbor, em firmware/probeharbor-probe, junto com sketches que você mesmo pode editar e gravar.",
    },
  ],
  buy: {
    board: "Placa (escolha uma)",
    s3c3: "Ou uma placa S3 / C3 (o estoque varia)",
    sensor: "Sensor no GPIO 4",
    i2c: "Ou um sensor de ar I²C (sem resistor)",
    extras: "Extras opcionais",
    ds18b20: "Sonda DS18B20 à prova d’água",
    resistor4k7: "Resistores de 4,7 kΩ",
    bme280: "BME280 (acrescenta pressão do ar)",
    reed: "Interruptor magnético de porta",
    resistor100k: "Resistores de 100 kΩ (divisor da bateria)",
  },
  kicker: "Instalação · Beta",
  heading: "Grave um sensor de congelamento pelo navegador",
  lede: "Sem Arduino IDE, sem mexer em código. Ligue uma sonda DS18B20 ou um DHT22 a um ESP32, instale o firmware por esta página e envie o Wi‑Fi e a chave do dispositivo pelo mesmo cabo USB.",
  getKey: "Pegue uma chave de dispositivo",
  startFreeGetKey: "Comece grátis → pegue uma chave de dispositivo",
  partsAndWiring: "Lista de peças e ligação",
  beforeTitle: "Antes de começar",
  wireHtml:
    'Ligue o sensor: alimentação em 3,3 V, terra em GND e dados no GPIO 4, com um resistor de 4,7 kΩ entre dados e 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">diagrama</a>). É igual para uma sonda DS18B20 (fios vermelho, preto e amarelo) e para um DHT22; o firmware detecta qual está conectado.',
  extrasIntro: "Extras opcionais, nestes pinos (cada interruptor ou contato fica entre o pino e o GND):",
  pinTable: {
    connect: "Ligação",
    data: "Dados do DS18B20 ou DHT22",
    i2c: "Sensor I²C SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Contato de vazamento / água",
    door: "Reed switch da porta",
    battery: "Bateria + por um divisor 1:1 (2 × 100 kΩ)",
  },
  i2cNote:
    "Os sensores I²C são detectados automaticamente; marque vazamento, porta ou bateria abaixo para que a placa saiba que estão ligados.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 ou ESP32 Feather V2):</strong> use a coluna ESP32. Os dados da sonda (GPIO 4) vão no pino marcado A5, o interruptor da porta (GPIO 26) no A0 e o contato de vazamento no pino 27. O divisor da bateria já está na placa: conecte uma LiPo no conector de bateria e marque bateria, sem resistores. Um sensor I²C vai nos pinos SDA/SCL da própria Feather ou na porta STEMMA QT; o firmware o encontra na inicialização (desligue e religue a alimentação depois de conectar). As Feather não têm botão BOOT no GPIO 0, então o reset de 5 segundos não funciona; para trocar o Wi-Fi, envie novas configurações por esta página.",
  deviceKeyHtml:
    'Adicione um dispositivo push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e copie a chave do dispositivo. O plano gratuito inclui dois dispositivos.',
  buyTitle: "O que comprar",
  buyIntro:
    "Peças que combinam com os pinos acima. Um ESP32 comum é a opção testada e faz tudo o que está aqui. Os links S3 e C3 são das placas de desenvolvimento da própria Espressif, para as quais o firmware foi compilado; se estiverem esgotadas, outra placa ESP32-S3-DevKitC-1 ou ESP32-C3-DevKitM-1 (ou um clone com a mesma pinagem) também funciona.",
  leakHtml:
    '<strong>Sensor de vazamento:</strong> a opção barata mais fácil é um módulo LM393 de “sensor de chuva / água” (vendido em muitas lojas): VCC no pino de 3,3 V da placa (nunca 5 V, para a saída continuar segura para o ESP32), GND no GND e DO no pino de vazamento. Gire o trimpot até uma gota de água indicar molhado e confira que ele volta a indicar seco. As trilhas expostas oxidam se ficarem molhadas, então considere-o uma peça para começar. Para uma instalação mais durável, use dois parafusos ou pontas de aço inox a cerca de 5&nbsp;mm um do outro, um no pino de vazamento e outro no GND. De qualquer forma, teste com a sua própria água: água muito limpa ou uma película fina podem não acioná-lo. Sensores cuja saída vai para nível alto quando molhados, como o sensor de água da Adafruit, precisam de outra entrada e não funcionam com este firmware.',
  afterTitle: "Depois que estiver funcionando",
  afterHtml:
    'As leituras chegam uma vez por minuto. Prenda a sonda no cano mais frio, defina um limite de congelamento de 1–3 °C (34–38 °F) em <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> e envie um alerta de teste. Veja <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">onde colocar o sensor</a> e <a class="text-link" href="/answers/freeze-alarm-temperature-setting">em que temperatura alertar</a>. Prefere editar o código você mesmo? As <a class="text-link" href="/about/esp32-web-flash">outras opções de gravação</a> cobrem Arduino, PlatformIO, MicroPython e ESPHome.',
};

export default ptBr;
