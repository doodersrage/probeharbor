
/** ExampleFeedCard copy (also rendered on the English-only dashboard). */
import type { ExampleFeedCardMessages } from "./en";

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

export default fr;
