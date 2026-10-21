import { defineMessages } from "../../translate";

/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */
const en = {
  introHtml:
    "Cabins, wells, and outbuildings often have power but no garage Wi‑Fi. A <strong>Particle Boron</strong> (or B-Series) LTE board POSTs the same ingest JSON through a <strong>Particle Console webhook</strong>. Cellular dropouts are normal: ProbeHarbor already marks probes stale when posts stop, so you do not need an aggressive on-device retry storm.",
  bluesHtml:
    "Prefer Blues? A <strong>Notecard</strong> + Notehub route can forward the same JSON; the Boron sketch is the first-class download from Devices.",
  partsTitle: "Parts",
  partsCaption: "Parts for a cellular freeze probe",
  colPart: "Part",
  colWhy: "Why",
  colBuy: "Buy",
  boronWhy: "LTE-M / NB-IoT (region SKU). Nano-SIM or Particle SIM plan required.",
  probePart: "Waterproof DS18B20",
  probeWhyHtml: "Pipe / crawlspace probe. Data on <strong>D2</strong>.",
  resistorPart: "4.7kΩ resistor",
  resistorWhy: "Pull-up from DS18B20 data to 3.3V.",
  planPart: "Cellular plan",
  planWhy: "Particle cloud + carrier data. Budget for remote sites that only wake hourly.",
  planBuy: "Particle Console billing or your own nano-SIM where the SKU allows it.",
  bluesPart: "Optional: Blues Notecard",
  bluesWhy: "Alternate cellular path via Notehub webhook route (same ingest URL).",
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>D2</strong>, 4.7k to 3V3",
    "USB for flash and 115200 serial; antenna attached before field deploy",
  ],
  flashTitle: "Flash and webhook",
  stepsHtml: [
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>Particle Boron .ino</strong> plus the webhook JSON (ingest URL filled in).',
    "Flash with Particle Workbench or Web IDE (Device OS 5+). Libraries: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: event <code>probeharbor_ingest</code>, POST to your ingest URL, use the downloaded webhook JSON (or set the body to the Particle event value), Content-Type <code>application/json</code>.",
    "Serial 115200: <code>publish ok</code>. Webhook history should show HTTP 200. Sensor key <code>temp1</code> imports on first successful POST.",
  ],
  repoLead: "Repo listing:",
  dropoutsTitle: "Dropouts and stale probes",
  dropoutsHtml:
    'LTE will miss intervals in weather, roaming, or prepaid outages. Keep posting about once a minute when connected; let <a class="text-link" href="/about/debugging-stale-readings">stale-reading detection</a> and freeze alerts cover silence. Do not burn battery on tight reconnect loops.',
  relatedTitle: "Related",
  related: {
    addingDevices: "Adding devices",
    stale: "Debugging stale readings",
    teensy: "Teensy 4.1 Ethernet",
    pic18: "PIC18F67J60 Ethernet",
    allSketches: "All sketches ↗",
  },
};
type Messages = typeof en;

const es: Messages = {
  introHtml:
    "Cabañas, pozos y construcciones anexas suelen tener electricidad, pero no llega el Wi‑Fi del garaje. Una placa LTE <strong>Particle Boron</strong> (o B-Series) envía por POST el mismo JSON de ingesta a través de un <strong>webhook de Particle Console</strong>. Los cortes de cobertura móvil son normales: ProbeHarbor ya marca las sondas como desactualizadas cuando dejan de llegar envíos, así que no necesitas una avalancha agresiva de reintentos en el dispositivo.",
  bluesHtml:
    "¿Prefieres Blues? Una ruta <strong>Notecard</strong> + Notehub puede reenviar el mismo JSON; el sketch de Boron es la descarga principal en Devices.",
  partsTitle: "Componentes",
  partsCaption: "Componentes para una sonda antiheladas con conexión móvil",
  colPart: "Componente",
  colWhy: "Para qué",
  colBuy: "Comprar",
  boronWhy: "LTE-M / NB-IoT (SKU según región). Requiere una nano-SIM o un plan de SIM de Particle.",
  probePart: "DS18B20 resistente al agua",
  probeWhyHtml: "Sonda para tuberías o espacio sanitario. Datos en <strong>D2</strong>.",
  resistorPart: "Resistencia de 4.7kΩ",
  resistorWhy: "Pull-up de la línea de datos del DS18B20 a 3.3V.",
  planPart: "Plan de datos móviles",
  planWhy: "Nube de Particle + datos del operador. Calcula el presupuesto para sitios remotos que solo se activan cada hora.",
  planBuy: "Facturación en Particle Console o tu propia nano-SIM si el SKU lo permite.",
  bluesPart: "Opcional: Blues Notecard",
  bluesWhy: "Vía móvil alternativa mediante una ruta webhook de Notehub (la misma URL de ingesta).",
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>D2</strong>, 4.7k a 3V3",
    "USB para grabar y para el puerto serie a 115200; conecta la antena antes de instalarla en campo",
  ],
  flashTitle: "Grabación y webhook",
  stepsHtml: [
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>Particle Boron .ino</strong> junto con el JSON del webhook (con la URL de ingesta ya incluida).',
    "Graba con Particle Workbench o Web IDE (Device OS 5+). Bibliotecas: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: evento <code>probeharbor_ingest</code>, POST a tu URL de ingesta, usa el JSON del webhook descargado (o define el cuerpo como el valor del evento de Particle), Content-Type <code>application/json</code>.",
    "Serie a 115200: <code>publish ok</code>. El historial del webhook debería mostrar HTTP 200. La clave de sensor <code>temp1</code> se importa con el primer POST correcto.",
  ],
  repoLead: "En el repositorio:",
  dropoutsTitle: "Cortes y sondas desactualizadas",
  dropoutsHtml:
    'El LTE perderá intervalos por mal tiempo, roaming o cortes del prepago. Sigue enviando más o menos una vez por minuto mientras haya conexión; deja que la <a class="text-link" href="/about/debugging-stale-readings">detección de lecturas desactualizadas</a> y las alertas de helada cubran los silencios. No gastes batería en bucles de reconexión apretados.',
  relatedTitle: "Relacionado",
  related: {
    addingDevices: "Añadir dispositivos",
    stale: "Depurar lecturas desactualizadas",
    teensy: "Teensy 4.1 con Ethernet",
    pic18: "PIC18F67J60 con Ethernet",
    allSketches: "Todos los sketches ↗",
  },
};

const fr: Messages = {
  introHtml:
    "Chalets, puits et dépendances ont souvent l’électricité, mais pas le Wi‑Fi du garage. Une carte LTE <strong>Particle Boron</strong> (ou B-Series) envoie en POST le même JSON d’ingestion via un <strong>webhook Particle Console</strong>. Les coupures du réseau mobile sont normales : ProbeHarbor signale déjà les sondes comme obsolètes quand les envois s’arrêtent, inutile donc de bombarder le réseau de nouvelles tentatives depuis l’appareil.",
  bluesHtml:
    "Vous préférez Blues ? Une route <strong>Notecard</strong> + Notehub peut relayer le même JSON ; le sketch Boron reste le téléchargement principal dans Devices.",
  partsTitle: "Composants",
  partsCaption: "Composants pour une sonde antigel en réseau mobile",
  colPart: "Composant",
  colWhy: "Rôle",
  colBuy: "Acheter",
  boronWhy: "LTE-M / NB-IoT (référence selon la région). Nano-SIM ou forfait SIM Particle requis.",
  probePart: "DS18B20 étanche",
  probeWhyHtml: "Sonde pour tuyau ou vide sanitaire. Données sur <strong>D2</strong>.",
  resistorPart: "Résistance 4.7kΩ",
  resistorWhy: "Pull-up de la ligne de données du DS18B20 vers 3.3V.",
  planPart: "Forfait mobile",
  planWhy: "Cloud Particle + données de l’opérateur. Prévoyez le budget pour les sites isolés qui ne se réveillent qu’une fois par heure.",
  planBuy: "Facturation Particle Console, ou votre propre nano-SIM si la référence le permet.",
  bluesPart: "En option : Blues Notecard",
  bluesWhy: "Autre voie mobile via une route webhook Notehub (même URL d’ingestion).",
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "Données DS18B20 → <strong>D2</strong>, 4.7k vers 3V3",
    "USB pour le flash et la liaison série à 115200 ; antenne branchée avant l’installation sur site",
  ],
  flashTitle: "Flash et webhook",
  stepsHtml: [
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>Particle Boron .ino</strong> ainsi que le JSON du webhook (URL d’ingestion déjà renseignée).',
    "Flashez avec Particle Workbench ou Web IDE (Device OS 5+). Bibliothèques : <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook : événement <code>probeharbor_ingest</code>, POST vers votre URL d’ingestion, utilisez le JSON du webhook téléchargé (ou définissez le corps sur la valeur de l’événement Particle), Content-Type <code>application/json</code>.",
    "Série à 115200 : <code>publish ok</code>. L’historique du webhook doit afficher HTTP 200. La clé de capteur <code>temp1</code> est importée au premier POST réussi.",
  ],
  repoLead: "Dans le dépôt :",
  dropoutsTitle: "Coupures et sondes obsolètes",
  dropoutsHtml:
    'Le LTE manquera des intervalles en cas d’intempéries, d’itinérance ou de coupure d’un forfait prépayé. Continuez d’envoyer environ une fois par minute quand la connexion est là ; laissez la <a class="text-link" href="/about/debugging-stale-readings">détection des relevés obsolètes</a> et les alertes de gel couvrir les silences. Ne videz pas la batterie dans des boucles de reconnexion serrées.',
  relatedTitle: "À voir aussi",
  related: {
    addingDevices: "Ajouter des appareils",
    stale: "Déboguer les relevés obsolètes",
    teensy: "Teensy 4.1 en Ethernet",
    pic18: "PIC18F67J60 en Ethernet",
    allSketches: "Tous les sketches ↗",
  },
};

const de: Messages = {
  introHtml:
    "Hütten, Brunnen und Nebengebäude haben oft Strom, aber kein WLAN aus der Garage. Ein <strong>Particle Boron</strong> (oder B-Series) mit LTE sendet dasselbe Ingest-JSON per POST über einen <strong>Particle-Console-Webhook</strong>. Mobilfunkaussetzer sind normal: ProbeHarbor markiert Sonden ohnehin als veraltet, wenn keine Daten mehr kommen, du brauchst also keine aggressive Wiederholungsflut auf dem Gerät.",
  bluesHtml:
    "Lieber Blues? Eine Route mit <strong>Notecard</strong> + Notehub kann dasselbe JSON weiterleiten; der Boron-Sketch ist aber der Standard-Download unter Devices.",
  partsTitle: "Teile",
  partsCaption: "Teile für eine Frostsonde mit Mobilfunk",
  colPart: "Teil",
  colWhy: "Wozu",
  colBuy: "Kaufen",
  boronWhy: "LTE-M / NB-IoT (SKU je nach Region). Nano-SIM oder Particle-SIM-Tarif erforderlich.",
  probePart: "Wasserdichter DS18B20",
  probeWhyHtml: "Sonde für Rohr oder Kriechkeller. Daten an <strong>D2</strong>.",
  resistorPart: "4.7kΩ-Widerstand",
  resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3.3V.",
  planPart: "Mobilfunktarif",
  planWhy: "Particle Cloud + Datenvolumen des Netzbetreibers. Plane das Budget für abgelegene Standorte, die nur stündlich aufwachen.",
  planBuy: "Abrechnung über die Particle Console oder deine eigene Nano-SIM, sofern die SKU das erlaubt.",
  bluesPart: "Optional: Blues Notecard",
  bluesWhy: "Alternativer Mobilfunkweg über eine Notehub-Webhook-Route (gleiche Ingest-URL).",
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Boron <strong>3V3</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>D2</strong>, 4.7k auf 3V3",
    "USB zum Flashen und für die serielle Ausgabe mit 115200; Antenne vor dem Einsatz vor Ort anschließen",
  ],
  flashTitle: "Flashen und Webhook",
  stepsHtml: [
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>Particle Boron .ino</strong> sowie das Webhook-JSON herunter (Ingest-URL bereits eingetragen).',
    "Flashe mit Particle Workbench oder der Web IDE (Device OS 5+). Bibliotheken: <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
    "Console → Integrations → Webhook: Event <code>probeharbor_ingest</code>, POST an deine Ingest-URL, das heruntergeladene Webhook-JSON verwenden (oder den Body auf den Wert des Particle-Events setzen), Content-Type <code>application/json</code>.",
    "Seriell mit 115200: <code>publish ok</code>. Der Webhook-Verlauf sollte HTTP 200 zeigen. Der Sensorschlüssel <code>temp1</code> wird beim ersten erfolgreichen POST übernommen.",
  ],
  repoLead: "Im Repo:",
  dropoutsTitle: "Aussetzer und veraltete Sonden",
  dropoutsHtml:
    'LTE verpasst bei Unwetter, Roaming oder leerem Prepaid-Guthaben Intervalle. Sende bei bestehender Verbindung etwa einmal pro Minute; lass die <a class="text-link" href="/about/debugging-stale-readings">Erkennung veralteter Messwerte</a> und die Frostalarme die Funkstille abdecken. Verschwende keinen Akku mit engen Wiederverbindungsschleifen.',
  relatedTitle: "Weiterlesen",
  related: {
    addingDevices: "Geräte hinzufügen",
    stale: "Veraltete Messwerte debuggen",
    teensy: "Teensy 4.1 mit Ethernet",
    pic18: "PIC18F67J60 mit Ethernet",
    allSketches: "Alle Sketches ↗",
  },
};

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

export const cellularIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
