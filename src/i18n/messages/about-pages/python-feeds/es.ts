
/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { PythonFeedsMessages } from "./en";

const REPO_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>';
const RELAY_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a>';
const ETH_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>';

const es: PythonFeedsMessages = {
  intro:
    "Los microcontroladores son excelentes leyendo sondas; Python destaca en caché, autenticación y en servir endpoints HTTPS estables. El proyecto fast-api-relay se sitúa entre el JSON del Arduino y el sitio Astro, normaliza las respuestas y reduce la carga sobre pilas embebidas frágiles.",
  relayTitle: "Por qué ayuda una capa de relay",
  relayBody:
    "Las peticiones directas del navegador a una IP de la red local fallan cuando cambia el DNS, caducan los certificados o se cae la conexión de casa. Un relay en un VPS o en un worker en la nube ofrece una única URL estable, añade caché con Redis para que los dashboards no saturen la sonda y puede agrupar varios sitios si te amplías más allá de una sola propiedad.",
  fastapiTitle: "Responsabilidades de FastAPI",
  fastapiItemsHtml: [
    "Recibir de forma programada los datos del Arduino o del agente de la red local.",
    "Guardar la carga más reciente en Redis con un TTL corto.",
    "Servir al instante desde la caché las respuestas <code>GET /...</code> para el sitio web.",
    "Registrar los datos obsoletos cuando el origen deja de actualizarse: útil para las alertas.",
  ],
  consumerTitle: "Ejemplo de consulta de un consumidor",
  consumerBodyHtml:
    "La capa de consultas del sitio Astro solicita la URL HTTPS que hayas configurado, analiza el objeto <code>temp</code> (o detecta automáticamente JSON de SenML / Home Assistant REST si falta esa raíz) y asigna las claves a las sondas del dashboard. La misma URL puede alimentar scripts de Node, plugins JSON de Grafana o sensores REST de Home Assistant.",
  figureAlt:
    "Visor JSON del navegador con las claves de sonda temp 0, 1 y avg, con Fahrenheit, Celsius y humedad",
  figureCaption: "Ejemplo de la estructura de carga del relay que espera el sitio web tras almacenar en caché el JSON del Arduino.",
  scriptsTitle: "Scripts operativos",
  scriptsBody:
    "Más allá de la API, pequeñas utilidades en Python validan el esquema JSON, rellenan archivos CSV históricos o comparan los promedios de las sondas con las previsiones de OpenWeather. Como las sondas exponen JSON plano, puedes prototipar análisis en un notebook antes de llevar la lógica a servicios en producción.",
  repoTitle: "Referencia del repositorio",
  repoBodyHtml: `Los detalles de implementación, la configuración de Redis y las notas de despliegue del relay se mantienen en ${REPO_LINK}. Configura la URL pública del relay en los <a class="text-link" href="/dashboard/devices">ajustes del feed de temperatura</a> después de iniciar sesión.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS para la ingesta push",
  unoBodyHtml: `Un shield W5100 no puede hacer POST a <code>https://probeharbor.dev</code>. El relay con la biblioteca estándar ${RELAY_LINK} escucha HTTP desde el Arduino y reenvía la misma ruta y el mismo cuerpo por HTTPS. Combínalo con ${ETH_LINK} (DHT22 en A4/A5, JSON <code>temp</code> clásico).`,
};

export default es;
