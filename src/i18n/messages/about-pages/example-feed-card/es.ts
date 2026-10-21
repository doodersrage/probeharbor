
/** ExampleFeedCard copy (also rendered on the English-only dashboard). */
import type { ExampleFeedCardMessages } from "./en";

const es: ExampleFeedCardMessages = {
  title: "Feed de ejemplo basado en el clima",
  introHtml:
    "JSON público por HTTPS alimentado por el clima exterior en vivo: tres sondas de taller simuladas más <code>avg</code>. Úsalo para probar feeds de extracción (pull) antes de que tu hardware esté en línea, o copia el payload de envío (push) para pruebas rápidas con curl.",
  pullUrl: "URL del feed pull",
  openPull: "Abrir JSON pull",
  pushSample: "JSON de ejemplo push",
  senml: "JSON SenML",
  setupDoc: "Documento de configuración",
  mappingHtml:
    "Asigna las claves de sonda <code>0</code>, <code>1</code>, <code>2</code> y <code>avg</code> bajo la raíz JSON <code>temp</code>, o usa <code>?format=senml</code> / <code>?format=homeassistant</code> para JSON en formatos estándar del sector. Parámetros de consulta opcionales: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

export default es;
