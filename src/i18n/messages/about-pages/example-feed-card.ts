import { defineMessages } from "../../translate";

/** ExampleFeedCard copy (also rendered on the English-only dashboard). */
const en = {
  title: "Example weather-based feed",
  introHtml:
    "Public HTTPS JSON driven by live outdoor weather: three simulated shop probes plus <code>avg</code>. Use it to test pull feeds before your hardware is online, or copy the push payload for curl smoke tests.",
  pullUrl: "Pull feed URL",
  openPull: "Open pull JSON",
  pushSample: "Push sample JSON",
  senml: "SenML JSON",
  setupDoc: "Setup document",
  mappingHtml:
    "Map probe keys <code>0</code>, <code>1</code>, <code>2</code>, and <code>avg</code> under JSON root <code>temp</code>, or use <code>?format=senml</code> / <code>?format=homeassistant</code> for industry-style JSON. Optional query params: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};
type ExampleFeedCardMessages = typeof en;

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

const fr: ExampleFeedCardMessages = {
  title: "Flux d’exemple basé sur la météo",
  introHtml:
    "JSON public en HTTPS alimenté par la météo extérieure en direct : trois sondes d’atelier simulées plus <code>avg</code>. Utilisez-le pour tester les flux en mode pull avant que votre matériel soit en ligne, ou copiez la charge utile push pour des tests rapides avec curl.",
  pullUrl: "URL du flux pull",
  openPull: "Ouvrir le JSON pull",
  pushSample: "Exemple de JSON push",
  senml: "JSON SenML",
  setupDoc: "Document de configuration",
  mappingHtml:
    "Associez les clés de sonde <code>0</code>, <code>1</code>, <code>2</code> et <code>avg</code> sous la racine JSON <code>temp</code>, ou utilisez <code>?format=senml</code> / <code>?format=homeassistant</code> pour un JSON aux formats standard du secteur. Paramètres de requête facultatifs : <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

const de: ExampleFeedCardMessages = {
  title: "Beispiel-Feed auf Wetterbasis",
  introHtml:
    "Öffentliches HTTPS-JSON, gespeist vom aktuellen Außenwetter: drei simulierte Werkstattfühler plus <code>avg</code>. Damit kannst du Pull-Feeds testen, bevor deine Hardware online ist, oder den Push-Payload für schnelle curl-Tests kopieren.",
  pullUrl: "Pull-Feed-URL",
  openPull: "Pull-JSON öffnen",
  pushSample: "Push-Beispiel-JSON",
  senml: "SenML-JSON",
  setupDoc: "Einrichtungsdokument",
  mappingHtml:
    "Ordne die Fühlerschlüssel <code>0</code>, <code>1</code>, <code>2</code> und <code>avg</code> unter dem JSON-Stamm <code>temp</code> zu, oder nutze <code>?format=senml</code> / <code>?format=homeassistant</code> für JSON in branchenüblichen Formaten. Optionale Query-Parameter: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

const ptBr: ExampleFeedCardMessages = {
  title: "Feed de exemplo baseado no clima",
  introHtml:
    "JSON público via HTTPS alimentado pelo clima externo ao vivo: três sondas de oficina simuladas mais <code>avg</code>. Use-o para testar feeds pull antes de o seu hardware ficar on-line, ou copie o payload push para testes rápidos com curl.",
  pullUrl: "URL do feed pull",
  openPull: "Abrir JSON pull",
  pushSample: "JSON de exemplo push",
  senml: "JSON SenML",
  setupDoc: "Documento de configuração",
  mappingHtml:
    "Mapeie as chaves de sonda <code>0</code>, <code>1</code>, <code>2</code> e <code>avg</code> sob a raiz JSON <code>temp</code>, ou use <code>?format=senml</code> / <code>?format=homeassistant</code> para JSON em formatos padrão do setor. Parâmetros de consulta opcionais: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

export const exampleFeedCardMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
