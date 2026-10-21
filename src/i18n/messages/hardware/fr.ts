import type { HardwareMessages } from "./en";

const fr: HardwareMessages = {
  title: "Quel matériel de capteurs fonctionne avec ProbeHarbor",
  description:
    "Choisissez ce que vous voulez surveiller (gel, humidité, fuites, portes) et voyez les cartes, capteurs et installations compatibles, avec leur état de test.",
  breadcrumbHome: "Accueil",
  breadcrumbHardware: "Matériel",
  kicker: "Matériel",
  heading: "Que puis-je connecter ?",
  lede: "ProbeHarbor est un logiciel : il fonctionne avec les capteurs que vous achetez ou possédez déjà. Choisissez ce que vous voulez surveiller, et si vous préférez ne pas écrire de code.",
  flashCta: "Flasher un ESP32",
  checkerCta: "Vérifier un payload",
  filterTitle: "Filtre",
  watchLegend: "Je veux surveiller",
  anything: "Tout",
  noCode: "Sans code",
  hardwareLabel: "Matériel : ",
  setupLabel: "Installation : ",
  watchesLabel: "Surveille : ",
  labelsTitle: "Ce que signifient les étiquettes",
  verifiedExplain: "nous avons fait tourner cette combinaison sur une vraie carte et vu les relevés arriver.",
  builtInExplain:
    "le firmware de l’outil de flashage le prend en charge, mais nous ne l’avons pas encore câblé nous-mêmes. Dites-nous si ça marche chez vous.",
  guideExplain:
    "une méthode documentée où vous adaptez un exemple de code ou de configuration. Tout ce qui peut envoyer du JSON en HTTPS peut remonter des données.",
  countNone: "Aucun résultat ; essayez un autre filtre.",
  countOne: "1 configuration affichée.",
  countMany: "{n} configurations affichées.",
  statusLabels: {
    verified: "Vérifié sur matériel",
    "built-in": "Intégré, pas encore testé sur matériel",
    guide: "Guide : vous écrivez le code",
  },
  goalLabels: {
    freeze: "Gel / température",
    humidity: "Humidité",
    leak: "Fuite",
    door: "Porte",
    air: "Qualité de l’air / pression",
    battery: "Batterie",
  },
};

export default fr;
