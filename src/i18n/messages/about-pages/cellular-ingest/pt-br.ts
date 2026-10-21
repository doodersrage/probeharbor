
/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "Cabanas, poços e anexos costumam ter energia, mas não o Wi‑Fi da garagem. Uma placa LTE <strong>Particle Boron</strong> (ou B-Series) envia por POST o mesmo JSON de ingestão por meio de um <strong>webhook do Particle Console</strong>. Quedas de sinal do celular são normais: o ProbeHarbor já marca as sondas como desatualizadas quando os envios param, então você não precisa de uma enxurrada agressiva de novas tentativas no dispositivo.",
  bluesHtml:
    "Prefere Blues? Uma rota <strong>Notecard</strong> + Notehub pode encaminhar o mesmo JSON; o sketch do Boron é o download principal em Devices.",
  partsTitle: "Peças",
  partsCaption: "Peças para uma sonda contra congelamento com rede celular",
  colPart: "Peça",
  colWhy: "Para quê",
  colBuy: "Comprar",
  boronWhy: "LTE-M / NB-IoT (SKU por região). Exige nano-SIM ou plano de SIM da Particle.",
  probePart: "DS18B20 à prova d’água",
  probeWhyHtml: "Sonda para cano ou porão baixo. Dados no <strong>D2</strong>.",
  resistorPart: "Resistor de 4.7kΩ",
  resistorWhy: "Pull-up da linha de dados do DS18B20 para 3.3V.",
  planPart: "Plano de dados celular",
  planWhy: "Nuvem da Particle + dados da operadora. Planeje o orçamento para locais remotos que só acordam de hora em hora.",
  planBuy: "Cobrança pelo Particle Console ou seu próprio nano-SIM, quando o SKU permitir.",
  bluesPart: "Opcional: Blues Notecard",
  bluesWhy: "Caminho celular alternativo por uma rota de webhook do Notehub (mesma URL de ingestão).",
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>D2</strong>, 4.7k para 3V3",
    "USB para gravação e serial a 115200; conecte a antena antes de instalar em campo",
  ],
  flashTitle: "Gravação e webhook",
  stepsHtml: [
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>Particle Boron .ino</strong> junto com o JSON do webhook (URL de ingestão preenchida).',
    "Grave com o Particle Workbench ou a Web IDE (Device OS 5+). Bibliotecas: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: evento <code>probeharbor_ingest</code>, POST para a sua URL de ingestão, use o JSON do webhook baixado (ou defina o corpo como o valor do evento da Particle), Content-Type <code>application/json</code>.",
    "Serial a 115200: <code>publish ok</code>. O histórico do webhook deve mostrar HTTP 200. A chave de sensor <code>temp1</code> é importada no primeiro POST bem-sucedido.",
  ],
  repoLead: "No repositório:",
  dropoutsTitle: "Quedas e sondas desatualizadas",
  dropoutsHtml:
    'O LTE vai perder intervalos com mau tempo, roaming ou falta de crédito pré-pago. Continue enviando cerca de uma vez por minuto enquanto houver conexão; deixe a <a class="text-link" href="/about/debugging-stale-readings">detecção de leituras desatualizadas</a> e os alertas de congelamento cobrirem o silêncio. Não gaste bateria com loops de reconexão apertados.',
  relatedTitle: "Veja também",
  related: {
    addingDevices: "Adicionar dispositivos",
    stale: "Depurar leituras desatualizadas",
    teensy: "Teensy 4.1 com Ethernet",
    pic18: "PIC18F67J60 com Ethernet",
    allSketches: "Todos os sketches ↗",
  },
};

export default ptBr;
