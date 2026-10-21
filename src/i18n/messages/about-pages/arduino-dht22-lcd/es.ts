
/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoDht22LcdMessages } from "./en";

const es: ArduinoDht22LcdMessages = {
  heroAlt: "Placa de sonda Arduino con conectividad de red y conectores para el cableado de sensores",
  heroCaption: "Placa de sonda de ProbeHarbor con Ethernet, LCD y conectores para los DHT22.",
  intro:
    "El firmware trata el LCD y el feed JSON como dos vistas de los mismos datos. El LCD da una respuesta local inmediata mientras instalas sondas o resuelves problemas; la interfaz Ethernet publica las mismas lecturas en el sitio web y en cualquier otro cliente HTTP.",
  twoSensorsTitle: "Lectura independiente de dos sensores DHT22",
  twoSensorsBody:
    "Cada DHT22 ofrece temperatura y humedad relativa mediante un protocolo de datos de un solo hilo. Como cada sensor tiene su propio pin de datos (A4 y A5 en este montaje), el sketch puede consultarlos uno tras otro sin colisiones en el bus. Por eso el LCD muestra dos pares distintos, por ejemplo 21,75 °C con 71,15 % de humedad en una línea y otra temperatura en la siguiente, en lugar de un único valor local promediado.",
  keysHtml:
    "En el sitio web, esas mismas sondas corresponden a claves JSON (por ejemplo <code>0</code>, <code>1</code> y <code>avg</code>). Las etiquetas que asignes en el dashboard pueden renombrarlas como «Pared norte» y «Zona de la puerta» sin cambiar las claves del firmware.",
  wiresTitle: "Conexión de sensores de tres hilos",
  wiresItemsHtml: [
    "<strong>Datos</strong>: un pin digital por sensor, con una resistencia pull-up, como recomienda la hoja de datos del DHT22.",
    "<strong>VCC</strong>: 5 V desde el riel de la protoboard (una alimentación estable es clave para lecturas coherentes).",
    "<strong>GND</strong>: tierra común con el Arduino, el LCD y el shield Ethernet.",
  ],
  wiresBody:
    "Los tendidos de cable largos hasta sondas remotas pueden necesitar pares trenzados o apantallamiento; el montaje del taller mantiene los sensores cerca del controlador por sencillez, pero el mismo esquema de firmware sirve para sondas remotas cableadas.",
  lcdTitle: "Disposición y contraste del LCD",
  lcdBody1:
    "La pantalla 16×2 muestra valores en directo durante el arranque, la calibración y los cortes de red. El potenciómetro de contraste de la protoboard ajusta V0 para que el texto siga siendo legible con los cambios de temperatura del espacio. Si la pantalla parece vacía tras cargar el sketch, ajusta el contraste antes de depurar el código.",
  lcdBody2:
    "El modo de cuatro bits (solo D4–D7) usa menos pines que el cableado de ocho bits: importante cuando Ethernet ya ocupa los pines SPI y hay dos líneas de datos de DHT22 asignadas.",
  backlightTitle: "Control de la retroiluminación",
  backlightBody:
    "Alimentar la retroiluminación desde el pin 7 a través de un transistor evita que la corriente pase por el propio pin del Arduino. El firmware puede atenuarla o hacerla parpadear como aviso (útil cuando una sonda marca bajo cero) sin bloquear el servicio de red.",
  ethernetTitle: "Ethernet junto a los sensores",
  ethernetBodyHtml: `El shield Ethernet W5100 se apila sobre el Uno y usa SPI, de modo que deja libres los pines digitales y analógicos para el LCD y los DHT22 descritos en la <a class="text-link" href="/about/arduino-pin-wiring">guía pin a pin</a>. El shield básicamente «va montado» en la pila: una vez configurado, el sketch puede servir JSON por HTTP y enviar la misma carga por POST para la <a class="text-link" href="/about/ingest-and-webhooks">ingesta push</a> (consulta ${ETH_LINK}).`,
  jsonTitle: "De los números del LCD al JSON del sitio web",
  jsonBodyHtml:
    'Después de cada lectura correcta de los sensores, el sketch actualiza el LCD y genera el documento JSON que sirve a los clientes. El sitio web obtiene ese JSON, guarda un historial opcional si has iniciado sesión y muestra las mismas claves de sonda en la página de inicio. Prueba la <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> para ver cómo llegan las distintas claves y los promedios a los consumidores.',
};

export default es;
