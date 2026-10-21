
/** Body copy for /about/cellular-ingest. Hrefs stay English; middleware localizes them. */
import type { Messages } from "./en";

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

export default es;
