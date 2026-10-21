
/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';
import type { Messages } from "./en";

const es: Messages = {
  heroAlt:
    "Controlador de sondas de temperatura para garaje, segunda revisión, con conexión Ethernet y varias entradas de sensores",
  heroCaption: "Revisión dos de la placa de sondas ProbeHarbor. Ethernet, LCD y dos entradas DHT22.",
  intro:
    "Este caso práctico sigue la construcción de la sonda de temperatura que impulsa ProbeHarbor: por qué un solo termómetro exterior no bastaba, cómo se eligieron dos zonas DHT22 más un resumen promediado y qué cambió entre la primera instalación en protoboard y la revisión conectada a la red que hoy sirve JSON en vivo a este sitio.",
  challengeTitle: "El reto",
  challenge: [
    "El objetivo era práctico, no académico: saber si un garaje adosado se acercaba al riesgo de helada, si la humedad subía lo bastante como para oxidar las herramientas y si las condiciones eran distintas junto a la puerta que en la pared del fondo. Las apps meteorológicas solo informan del aire exterior en la estación más cercana, que puede diferir unos 5 °C (10 °F) o más del interior de un garaje aislado en una tarde soleada de invierno.",
    "Un solo sensor habría ocultado los gradientes que importan. Abrir la puerta seccional, aparcar un vehículo caliente o el sol de la tarde sobre una pared orientada al oeste cambian distintas partes del espacio a distintas velocidades. La necesidad de varias sondas estaba clara antes de soldar el primer cable.",
  ],
  environmentTitle: "El entorno",
  environment:
    "El espacio vigilado es un garaje adosado típico: una gran puerta seccional, suelo de losa de hormigón, menos aislamiento que la vivienda y variaciones estacionales que dependen tanto de la radiación solar y las infiltraciones de aire como de la temperatura exterior. En verano, la zona junto a la puerta está más caliente; en invierno, la losa y la pared norte van horas por detrás de las mínimas exteriores.",
  zonesHtml: [
    "<strong>Zona de la pared norte:</strong> cambia más despacio; útil para ver la tendencia de las mínimas nocturnas.",
    "<strong>Zona de la puerta:</strong> se dispara al abrir la puerta; delata las entradas rápidas de aire.",
    "<strong>Zona del banco de trabajo:</strong> representa el lugar donde realmente se trabaja, a la altura de los hombros.",
  ],
  demoHtml:
    'La <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> simula estas tres zonas para que veas cómo el sol y el estado de la puerta separan las lecturas sin instalar hardware.',
  approachTitle: "Enfoque y hardware",
  approachHtml: [
    "Cada sonda usa un sensor digital de humedad y temperatura DHT22 con un cable corto hasta un Arduino Uno. El firmware lee ambos sensores a intervalos fijos, reintenta ante errores transitorios del bus, calcula un <code>avg</code> de las sondas en buen estado y sirve JSON compacto por la red local mediante un shield Ethernet. Una pantalla LCD de 16×2 en la placa muestra los valores en vivo para comprobarlos in situ sin portátil.",
    'La colocación siguió las reglas de la <a class="text-link" href="/about/temperature-probes">guía de sondas de temperatura</a>: lejos de zonas con sol directo y de extractores, más o menos a la altura de los hombros y con un montaje ventilado para que el aire circule por la cabeza del sensor. Las etiquetas del dashboard asignan las claves JSON <code>0</code> y <code>1</code> a nombres de zona legibles.',
  ],
  rev1Alt: "Placa de sonda de primera revisión en una protoboard con sensores DHT22 y LCD",
  rev1Caption: "La revisión uno validó en el banco el cableado, los intervalos de lectura y la estructura del JSON antes de montarla en el garaje.",
  timelineTitle: "Cronología del montaje",
  timelineHtml: [
    "<strong>Puesta en marcha en el banco:</strong> los registros por serie confirmaron las lecturas del DHT22, el formato de la LCD y unas claves JSON <code>temp</code> estables antes de que la placa saliera del escritorio.",
    "<strong>Revisión uno en el garaje:</strong> demostró que los gradientes entre sondas eran reales: la zona de la puerta se separaba habitualmente de la pared norte a las horas de ir y volver del trabajo.",
    "<strong>Feed JSON por red:</strong> Ethernet eliminó la necesidad de llevar un portátil para cada comprobación; el sitio podía obtener el mismo documento que ya mostraba la LCD.",
    "<strong>Revisión dos:</strong> montaje más limpio del shield Ethernet, conectores de sonda mejorados y lógica de reinicio compatible con watchdog para los raros bloqueos de red.",
    "<strong>Integración con el sitio web:</strong> las páginas de Astro asignan los feeds a tarjetas; el historial de los usuarios con sesión guarda instantáneas para revisar tendencias y exportar a CSV.",
  ],
  dataTitle: "Qué mostraron los datos",
  dataLede: "Tras un ciclo completo de invierno y verano, las sondas compensaron con creces de formas que una sola lectura no habría captado:",
  data: [
    "La temperatura junto a la puerta podía variar entre 4 y 7 °C (8–12 °F) a los pocos minutos de abrir la puerta seccional, mientras la pared del fondo apenas se movía.",
    "Las mínimas nocturnas junto a la pared norte seguían el riesgo de helada con más fiabilidad que las previsiones exteriores por sí solas.",
    "La humedad subía tras olas de frío prolongadas, cuando la losa tardaba en calentarse: útil para decidir cuándo encender un deshumidificador.",
    "El promedio calculado suavizaba el ruido en los gráficos históricos, mientras que las tarjetas por sonda de la página de inicio conservaban el detalle de cada zona.",
  ],
  flowHtml:
    'Las lecturas viajan de la sonda al dashboard por el camino documentado en <a class="text-link" href="/about/data-flow">flujo de datos de extremo a extremo</a>. Cuando hizo falta TLS en el borde, un <a class="text-link" href="/about/python-feeds">relay en Python</a> almacenó en caché el JSON de origen sin cargar esa complejidad en el microcontrolador.',
  lessonsTitle: "Lecciones aprendidas",
  lessonsHtml: [
    "<strong>La ubicación importa más que el precio del sensor:</strong> un DHT22 bien montado superó siempre a un sensor premium mal colocado.",
    "<strong>Etiqueta las zonas en el software:</strong> unas claves JSON estables con etiquetas en el dashboard mantuvieron el firmware y el sitio web poco acoplados.",
    "<strong>Cuenta con huecos:</strong> los reinicios y los cortes de red crean huecos breves; distínguelos de una mala configuración con las guías de lecturas desactualizadas.",
    "<strong>Construye para iterar:</strong> la revisión uno en protoboard ahorró subir a la escalera cuando cambiaron las asignaciones de pines.",
  ],
  relatedTitle: "Lecturas relacionadas",
  relatedHtml: `Sigue con la <a class="text-link" href="/about/temperature-probes">introducción a las sondas de temperatura</a>, la guía de <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>, <a class="text-link" href="/about/temperature-changes">qué hace que cambien las lecturas</a> y el <a class="text-link" href="/about/historical-data">uso de los datos históricos</a> en el dashboard. Código del firmware: ${FIRMWARE_LINK}.`,
};

export default es;
