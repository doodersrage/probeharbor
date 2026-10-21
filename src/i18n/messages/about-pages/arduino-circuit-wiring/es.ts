
/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const es: Messages = {
  introHtml:
    "Este montaje se basa en un Arduino Uno con un shield Ethernet W5100 encima, una protoboard sin soldadura para repartir la alimentación y los componentes auxiliares del LCD, un LCD de caracteres de 16×2 para ver las lecturas en local y dos sensores de temperatura y humedad DHT22. Durante el desarrollo, el USB alimenta el banco de pruebas; en una instalación permanente se suele pasar a una fuente regulada de 5 V.",
  diagramAlt: "Esquema de cableado de un Arduino Uno con shield Ethernet, protoboard, LCD y dos sensores DHT22",
  diagramCaption:
    "Cableado general: la alimentación entra por el Uno y las señales pasan por la protoboard hasta el LCD y los dos sensores DHT22.",
  breadboardTitle: "Protoboard y líneas de alimentación",
  breadboardHtml:
    "La protoboard lleva sobre todo las líneas de alimentación de 5 V y GND, además del cableado de señal del LCD. Tener la alimentación y las señales ordenadas en la protoboard facilita cambiar el potenciómetro de contraste o el LCD sin tocar los cables de los sensores. Une la tierra del Arduino con la línea de tierra de la protoboard para que todos los componentes compartan la misma referencia.",
  contrastTitle: "Circuito de contraste del LCD",
  contrastHtml:
    "Un potenciómetro de ajuste en la protoboard fija la tensión de contraste en el pin V0 del LCD. Sin ese divisor, la pantalla puede verse en blanco o totalmente oscura aunque el sketch funcione bien. Ajusta el potenciómetro después de encender hasta que las dos líneas de texto se lean de un vistazo desde el otro lado del espacio.",
  dhtTitle: "Dos sensores DHT22",
  dhtHtml:
    "Cada DHT22 usa tres conexiones: datos, VCC y GND. Llevar los datos a pines distintos del Arduino permite al firmware consultar los sensores por separado; por eso el LCD puede mostrar dos pares de temperatura y humedad distintos, por ejemplo 21,75 °C / 71,15 % en una línea y la lectura de la segunda sonda en la siguiente.",
  ethernetTitle: "Ubicación del shield Ethernet",
  ethernetHtml:
    "El shield Ethernet va montado sobre el Uno y se comunica por SPI (pines 10–13 en la disposición clásica del Uno). No comparte pines de datos con el cableado del LCD ni de los DHT22, lo que deja sitio en el conector para los sensores y la pantalla. Esa separación es lo que hace viable esta combinación en una sola placa sin conflictos de pines.",
  nextHtml:
    'Para los números de GPIO exactos que usa el sketch, sigue con el <a class="text-link" href="/about/arduino-pin-wiring">cableado pin a pin del Arduino</a>. Para ver cómo se comportan el LCD y las sondas en el firmware, consulta <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 y pantalla LCD</a>.',
};

export default es;
