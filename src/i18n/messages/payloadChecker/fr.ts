/**
 * /payload-checker copy. `script` strings are read by the client script from a
 * data attribute: `{n}` is a count, `{value}` a device field value.
 * Warnings in the result come from the API and stay English.
 */
import type { PayloadCheckerMessages } from "./en";

const fr: PayloadCheckerMessages = {
  title: "Vérificateur de payload de capteur",
  description:
    "Collez le JSON envoyé par votre ESP32, Arduino, flux Node-RED ou script et voyez quels relevés ProbeHarbor enregistrerait, avant de brancher un vrai appareil.",
  breadcrumbHome: "Accueil",
  kicker: "Outil",
  heading: "ProbeHarbor comprendra-t-il mon capteur ?",
  lede: "Collez le JSON envoyé par votre appareil. Vous verrez chaque relevé qu’il produit, le type de capteur sous lequel il est classé, et tout ce qui serait ignoré ou mal lu. Rien n’est enregistré et aucun compte n’est nécessaire.",
  apiDocs: "Documentation de l’API d’ingestion",
  whichHardware: "Quel matériel est compatible ?",
  inputTitle: "Votre payload",
  tryExample: "Essayez un exemple :",
  examples: { flat: "Clés à plat", classic: "Arduino classique", typed: "Capteurs typés" },
  jsonBody: "Corps JSON",
  check: "Vérifier le payload",
  resultTitle: "Résultat",
  tableCaption: "Relevés que ce payload enregistrerait",
  colKey: "Clé",
  colStoredAs: "Enregistré comme",
  colType: "Type",
  colValue: "Valeur",
  nextTitle: "Quand tout semble correct",
  nextHtml:
    'Créez un appareil dans le tableau de bord pour obtenir une clé d’ingestion, puis envoyez le même corps en POST à <code>/api/ingest/_</code> avec un en-tête <code>X-Ingest-Key</code>. Les relevés apparaissent dans l’onglet Devices en quelques secondes. Pas de code du tout ? L’<a class="text-link" href="/flash">outil de flashage web</a> installe un firmware prêt à l’emploi sur un ESP32 depuis votre navigateur.',
  script: {
    invalidJson: "Ce n’est pas encore du JSON valide.",
    invalidJsonHint: "Vérifiez les guillemets, les virgules et les crochets.",
    checkFailed: "Impossible de vérifier ce payload.",
    acceptedOne: "Accepté : 1 relevé serait enregistré.",
    acceptedMany: "Accepté : {n} relevés seraient enregistrés.",
    acceptedOneNotes: "Accepté : 1 relevé serait enregistré, avec des remarques ci-dessous.",
    acceptedManyNotes: "Accepté : {n} relevés seraient enregistrés, avec des remarques ci-dessous.",
    rejected: "Refusé : le point d’accès répondrait 400.",
    unreachable: "Impossible de joindre le vérificateur. Réessayez dans un instant.",
    battery: "batterie {value} %",
    signal: "signal {value} dBm",
    firmware: "firmware {value}",
    ignored: "ignorés : {value}",
    deviceFields: "Champs de l’appareil : {value}",
  },
};

export default fr;
