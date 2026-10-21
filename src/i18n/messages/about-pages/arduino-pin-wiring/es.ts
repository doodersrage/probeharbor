
/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoPinWiringMessages } from "./en";

const es: ArduinoPinWiringMessages = {
  introHtml:
    "El diagrama de pines de abajo coincide con el constructor <code>LiquidCrystal</code> del firmware y con las líneas de datos de los DHT22 usadas en este proyecto. Úsalo para comprobar los cables puente frente al sketch, sobre todo si hay pines analógicos funcionando como E/S digitales.",
  diagramAlt: "Diagrama de conexiones pin a pin de un Arduino Uno con una pantalla LCD y dos sensores DHT22",
  diagramCaption:
    "RS, RW, EN, líneas de datos, retroiluminación y los dos pines de datos de los DHT22 asignados a pines concretos del Uno.",
  lcdTitle: "Mapa de pines del LCD 16×2",
  lcdIntroHtml:
    "El sketch usa la forma de siete argumentos <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. En este montaje:",
  lcdItemsHtml: [
    "<strong>RS</strong> → pin digital 8",
    "<strong>RW</strong> → pin digital 9",
    "<strong>Enable</strong> → pin analógico A2 (usado como salida digital)",
    "<strong>D4–D7</strong> → pines digitales 5, 6, 3 y pin analógico A3, respectivamente",
  ],
  lcdRw:
    "La mayoría de los tutoriales conectan RW directamente a tierra y usan un constructor de seis argumentos. Conectar RW al pin 9 es menos habitual pero válido: permite que la biblioteca lea el indicador de ocupado del LCD en lugar de escribir cada carácter a ciegas.",
  backlightTitle: "Retroiluminación en el pin 7",
  backlightBody:
    "El pin 7 no es una línea de datos del LCD. Controla la retroiluminación a través de un pequeño transistor en la protoboard (visible junto al conector en el montaje físico). Encender y apagar la retroiluminación por separado ahorra energía y permite hacer parpadear la pantalla para las alertas sin reescribir el texto del LCD.",
  dhtTitle: "Pines de datos de los DHT22",
  dhtItemsHtml: [
    "<strong>Datos del sensor 1</strong> → pin analógico A4",
    "<strong>Datos del sensor 2</strong> → pin analógico A5",
    "Ambos sensores se conectan también a 5 V y GND",
  ],
  dhtBodyHtml:
    "Los pines analógicos A4 y A5 funcionan perfectamente como entradas digitales en el Uno. En el código aparecen como <code>A4</code> y <code>A5</code>, no con los alias <code>D14</code>/<code>D15</code>: conviene recordarlo al seguir los cables a simple vista.",
  spiTitle: "Pines SPI reservados (Ethernet)",
  spiBody:
    "El shield Ethernet reserva los pines 10–13 para SPI. Ninguna conexión del LCD ni de los DHT22 puede usar esas líneas; en la práctica están vetadas en el conector. Planificar en torno a esa reserva es lo que hace posible combinar Ethernet y sensores locales en un solo Uno.",
  outroHtml: `Vuelve a la <a class="text-link" href="/about/arduino-circuit-wiring">vista general del cableado del circuito</a> para ver la disposición en la protoboard, o lee <a class="text-link" href="/about/arduino-dht22-lcd">Sensores DHT22 y pantalla LCD</a> para conocer el comportamiento en funcionamiento. Ejemplo de ingesta push (sin LCD): ${ETH_LINK}.`,
};

export default es;
