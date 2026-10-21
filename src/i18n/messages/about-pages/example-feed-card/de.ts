
/** ExampleFeedCard copy (also rendered on the English-only dashboard). */
import type { ExampleFeedCardMessages } from "./en";

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

export default de;
