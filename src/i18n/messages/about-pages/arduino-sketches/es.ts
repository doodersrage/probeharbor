
/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const A = '<a class="text-link" target="_blank" rel="noreferrer" href=';
const ETH_INGEST = `${A}"${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>`;
const RELAY = `${A}"${REPO}/blob/main/sketches/relay/push_https_forward.py"><code>push_https_forward.py</code></a>`;
const SKETCHES = `${A}"${REPO}/tree/main/sketches">sketches/</a>`;
const FIRMWARE = `${A}"https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>`;
import type { Messages } from "./en";

const es: Messages = {
  intro:
    "El hardware de las sondas funciona con microcontroladores compatibles con Arduino. El firmware, que suele llamarse sketch, lee los sensores a intervalos fijos, da formato JSON a los resultados y los sirve por la red para que el sitio web y otros clientes obtengan datos en vivo sin cables serie.",
  responsibilitiesTitle: "Qué hace el sketch",
  responsibilities: [
    "Inicializa los buses de sensores y la pantalla LCD local de 16×2 para lecturas in situ.",
    "Lee cada sonda DHT22 con reintentos ante errores transitorios del bus.",
    "Calcula un promedio de las sondas en buen estado como valor resumen rápido en el JSON.",
    "Responde a las solicitudes HTTP con un documento JSON compacto a través del shield Ethernet.",
    "Opcionalmente, registra errores por serie para depurar in situ.",
  ],
  jsonTitle: "Estructura JSON típica",
  jsonHtml:
    "Los clientes esperan un objeto <code>temp</code> en el nivel superior con claves numéricas para cada sonda, además de <code>avg</code>. La humedad aparece junto a la temperatura en cada sonda. Mantener las claves estables importa más que un formato bonito: las asignaciones del dashboard hacen referencia directa a esas claves.",
  pushJsonHtml:
    'Para la <a class="text-link" href="/about/ingest-and-webhooks">ingesta push</a>, el mismo objeto de sonda puede enviarse a <code>/api/ingest/&lt;key&gt;</code>. Los campos opcionales de nivel superior <code>battery</code> (o <code>battery_pct</code>) y <code>rssi</code> actualizan el estado del dispositivo en la página Devices sin necesidad de claves de sensor adicionales.',
  pushTitle: "Ingesta push desde el shield Ethernet",
  pushHtml: `La pila W5100 de un Uno no admite TLS, así que no puede hacer POST directamente a <code>https://probeharbor.dev</code>. Usa ${ETH_INGEST} para enviar por HTTP el JSON <code>temp</code> clásico (DHT22 en A4/A5, JSON opcional en el puerto 80 para consultas desde la LAN). Ejecuta ${RELAY} en una Raspberry Pi, un NAS o un portátil para que esos POST lleguen a ProbeHarbor por HTTPS. Los ejemplos para ESP32 con Wi‑Fi que hablan TLS están en ${SKETCHES}.`,
  wiringTitle: "Guías de cableado del hardware",
  wiringLede:
    "El montaje físico usa un Arduino Uno, un shield Ethernet W5100, una protoboard, un potenciómetro de contraste, una pantalla LCD de 16×2 y dos sensores DHT22. Tres páginas complementarias documentan en detalle los esquemas y el mapa de pines:",
  networkTitle: "Opciones de pila de red",
  networkHtml: `Esta revisión usa un shield Ethernet por SPI. El sketch gestiona DHCP, los bucles de reconexión y el servicio del JSON mientras la LCD sigue mostrando los valores de las sondas en vivo. Cuando TLS es demasiado pesado para el MCU, un relay en Python puede terminar HTTPS: consulta <a class="text-link" href="/about/python-feeds">Scripts y feeds en Python</a>. Para la ingesta push desde el mismo shield, consulta ${ETH_INGEST}.`,
  rev2Alt: "Placa de sonda ProbeHarbor de segunda revisión con shield Ethernet, LCD y sensores DHT22",
  rev2Caption: "ProbeHarbor, revisión dos: Ethernet, lectura en LCD y dos entradas DHT22 en un solo montaje.",
  workflowTitle: "Flujo de desarrollo",
  workflow:
    "Los sketches se editan en el Arduino IDE o en PlatformIO, se graban por USB y se verifican con registros por serie antes de montar la placa en el espacio vigilado. Comprueba la estructura del JSON con curl antes de añadir la URL del feed al dashboard del sitio.",
  samplesHtml: `En este repositorio, dentro de ${SKETCHES}, hay ejemplos listos para adaptar para DS18B20, MAX31855, MAX6675 y Uno + Ethernet. La Raspberry Pi Pico W / Pico 2 W usa el mismo JSON de ingesta con <a class="text-link" href="/about/pico-w-ingest">CircuitPython o MicroPython</a>. Firmware completo de Ethernet + DHT + LCD: ${FIRMWARE}.`,
  tipsTitle: "Consejos de fiabilidad",
  tips: [
    "Los reinicios por watchdog se recuperan de los raros bloqueos de red sin tener que subir a una escalera.",
    "Separa el ruido de la alimentación de los sensores de la del MCU cuando haya tiradas de cable largas.",
    "Versiona tu esquema JSON en la documentación cuando añadas campos.",
    "Documenta qué pines GPIO corresponden a qué etiquetas físicas de sonda; consulta la guía de cableado de pines.",
  ],
};

export default es;
