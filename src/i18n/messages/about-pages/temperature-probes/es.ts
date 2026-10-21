
/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    'Las sondas de temperatura son la capa de medición de cualquier monitor ambiental. En un garaje, taller, ático, sótano ventilado o nave, convierten el calor y la humedad en números que el resto del sistema puede guardar, graficar y usar para alertar. Este proyecto usa sensores digitales de humedad y temperatura conectados a un Arduino, con varios canales de sonda para que puedas comparar zonas en lugar de fiarte de una sola lectura. Para la historia completa del montaje, lee el <a class="text-link" href="/about/temperature-probe-case-study">caso práctico de la sonda de temperatura</a>.',
  measureTitle: "Qué miden las sondas en la práctica",
  measureHtml:
    "Cada sonda informa de dos valores que importan para las decisiones del día a día: la temperatura del aire y la humedad relativa. La temperatura te dice si las tuberías, la pintura o lo que tienes guardado se acercan a límites de riesgo. La humedad ayuda a explicar la condensación en superficies frías, el óxido en las herramientas y si merece la pena deshumidificar por la noche.",
  jsonHtml:
    "En este montaje, las sondas publican sus lecturas en un objeto JSON indexado por número de sonda: <code>0</code>, <code>1</code> y un <code>avg</code> calculado con los sensores activos. Esa estructura encaja sin problemas con etiquetas del panel como «Pared norte» o «Zona del banco de trabajo».",
  usesTitle: "Usos habituales de las sondas en espacios sin calefacción",
  uses: [
    "<strong>Protección contra heladas:</strong> sigue las mínimas nocturnas junto a las paredes exteriores antes de que las tuberías corran peligro.",
    "<strong>Comparación estacional:</strong> compara las zonas junto al ático con el nivel del suelo durante el calor del verano.",
    "<strong>Estado del equipo:</strong> vigila la humedad alrededor de herramientas metálicas, baterías o papeles almacenados.",
    "<strong>Comodidad para trabajar:</strong> comprueba si los cambios de aislamiento o ventilación sirven de verdad.",
    "<strong>Consultas a distancia:</strong> echa un vistazo a las lecturas en vivo cuando no estás, en vez de adivinar solo por el tiempo exterior.",
  ],
  placementTitle: "La ubicación importa más que el precio del sensor",
  placementHtml:
    "Una sonda junto a un portón sin aislar oscilará mucho cada vez que se abra. Una en una pared orientada al norte puede ir horas por detrás de la temperatura exterior. Para obtener tendencias estables, monta las sondas lejos de zonas de sol directo, de corrientes de ventiladores y de fuentes de calor como congeladores o calentadores de agua. A la altura de los hombros (1,2–1,5 m) suele representarse bien el aire que notan las personas y los objetos guardados.",
  multipleTitle: "Por qué varias sondas son mejores que una",
  multipleHtml:
    "Garajes, talleres y áticos no son cajas uniformes. Un solo sensor puede marcar 7 °C (45 °F) cerca del suelo mientras la zona del techo está a 14 °C (58 °F) en una tarde soleada de invierno. Con varias sondas ves los gradientes, los puntos con mal aislamiento y qué zona representa el riesgo que te importa. El firmware promedia las sondas activas, así que la página de historial sigue teniendo una instantánea resumen por carga y la página principal conserva el detalle de cada sonda.",
  boardAlt: "Placa controladora de sondas de ProbeHarbor con conexión Ethernet y sensores DHT22",
  boardCaption: "Segunda revisión de la placa de sondas de ProbeHarbor: Ethernet, LCD y dos entradas DHT22.",
  webTitle: "Del cable de la sonda a la página web",
  webHtml:
    'Las sondas no hablan directamente con el sitio web. El sketch de Arduino lee cada sensor según un horario, valida los rangos y publica JSON por HTTPS. El sitio obtiene ese feed, asigna las claves a las etiquetas legibles que configuras en el panel y, si has iniciado sesión, puede guardar las lecturas. Prueba la <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> para ver cómo se comportan varias zonas y los promedios, o lee la guía del <a class="text-link" href="/about/data-flow">flujo de datos de principio a fin</a>.',
};

export default es;
