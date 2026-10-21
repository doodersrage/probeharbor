import {
  RECIPE_GOAL_LABELS,
  RECIPE_STATUS_LABELS,
  type RecipeGoal,
  type RecipeStatus,
} from "../../lib/hardwareRecipes";
import { defineMessages } from "../translate";

/** /hardware page copy. Recipe cards are in `content/hardwareRecipes`. */
const en = {
  title: "Which sensor hardware works with ProbeHarbor",
  description:
    "Pick what you want to watch (freeze, humidity, leaks, doors) and see the boards, sensors, and setup paths that work, with honest testing status for each.",
  breadcrumbHome: "Home",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "What can I connect?",
  lede: "ProbeHarbor is software: it works with sensors you buy or already own. Choose what you want to watch, and whether you'd rather not write code.",
  flashCta: "Flash an ESP32",
  checkerCta: "Check a payload",
  filterTitle: "Filter",
  watchLegend: "I want to watch",
  anything: "Anything",
  noCode: "No coding",
  hardwareLabel: "Hardware: ",
  setupLabel: "Setup: ",
  watchesLabel: "Watches: ",
  labelsTitle: "What the labels mean",
  verifiedExplain: "we've run this combination on a real board and seen readings arrive.",
  builtInExplain:
    "the flasher firmware supports it, but we haven't wired one up ourselves yet. Tell us if it works for you.",
  guideExplain:
    "a documented path where you adapt example code or configuration. Anything that can send JSON over HTTPS can report.",
  /** Client-side filter count. */
  countNone: "Nothing matches; try another filter.",
  countOne: "1 setup shown.",
  countMany: "{n} setups shown.",
  statusLabels: RECIPE_STATUS_LABELS as Record<RecipeStatus, string>,
  goalLabels: RECIPE_GOAL_LABELS as Record<RecipeGoal, string>,
};

type HardwareMessages = typeof en;

const es: HardwareMessages = {
  title: "Qué hardware de sensores funciona con ProbeHarbor",
  description:
    "Elige qué quieres vigilar (congelación, humedad, fugas, puertas) y mira qué placas, sensores e instalaciones funcionan, con su estado real de pruebas.",
  breadcrumbHome: "Inicio",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "¿Qué puedo conectar?",
  lede: "ProbeHarbor es software: funciona con sensores que compras o que ya tienes. Elige qué quieres vigilar y si prefieres no escribir código.",
  flashCta: "Flashea un ESP32",
  checkerCta: "Comprueba un payload",
  filterTitle: "Filtro",
  watchLegend: "Quiero vigilar",
  anything: "Cualquier cosa",
  noCode: "Sin programar",
  hardwareLabel: "Hardware: ",
  setupLabel: "Instalación: ",
  watchesLabel: "Vigila: ",
  labelsTitle: "Qué significan las etiquetas",
  verifiedExplain: "hemos probado esta combinación en una placa real y hemos visto llegar las lecturas.",
  builtInExplain:
    "el firmware del instalador lo admite, pero todavía no lo hemos cableado nosotros. Cuéntanos si te funciona.",
  guideExplain:
    "un método documentado en el que adaptas código o configuración de ejemplo. Cualquier cosa que pueda enviar JSON por HTTPS puede reportar.",
  countNone: "No hay coincidencias; prueba con otro filtro.",
  countOne: "1 configuración mostrada.",
  countMany: "{n} configuraciones mostradas.",
  statusLabels: {
    verified: "Verificado en hardware",
    "built-in": "Integrado, aún sin probar en hardware",
    guide: "Guía: tú escribes el código",
  },
  goalLabels: {
    freeze: "Congelación / temperatura",
    humidity: "Humedad",
    leak: "Fugas",
    door: "Puertas",
    air: "Calidad del aire / presión",
    battery: "Batería",
  },
};

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

const de: HardwareMessages = {
  title: "Welche Sensor-Hardware mit ProbeHarbor funktioniert",
  description:
    "Wähle, was du überwachen willst (Frost, Luftfeuchte, Lecks, Türen), und sieh, welche Boards, Sensoren und Wege funktionieren – mit ehrlichem Teststatus.",
  breadcrumbHome: "Start",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "Was kann ich anschließen?",
  lede: "ProbeHarbor ist Software: Es funktioniert mit Sensoren, die du kaufst oder schon hast. Wähle, was du überwachen willst und ob du lieber keinen Code schreiben möchtest.",
  flashCta: "ESP32 flashen",
  checkerCta: "Payload prüfen",
  filterTitle: "Filter",
  watchLegend: "Ich will überwachen",
  anything: "Alles",
  noCode: "Ohne Programmieren",
  hardwareLabel: "Hardware: ",
  setupLabel: "Einrichtung: ",
  watchesLabel: "Überwacht: ",
  labelsTitle: "Was die Kennzeichnungen bedeuten",
  verifiedExplain: "Wir haben diese Kombination auf einem echten Board laufen lassen und eintreffende Messwerte gesehen.",
  builtInExplain:
    "Die Flasher-Firmware unterstützt es, aber wir haben es selbst noch nicht verkabelt. Sag uns, ob es bei dir funktioniert.",
  guideExplain:
    "Ein dokumentierter Weg, bei dem du Beispielcode oder eine Konfiguration anpasst. Alles, was JSON über HTTPS senden kann, kann Daten melden.",
  countNone: "Keine Treffer – probier einen anderen Filter.",
  countOne: "1 Variante angezeigt.",
  countMany: "{n} Varianten angezeigt.",
  statusLabels: {
    verified: "Auf Hardware verifiziert",
    "built-in": "Integriert, noch nicht auf Hardware getestet",
    guide: "Anleitung: Du schreibst den Code",
  },
  goalLabels: {
    freeze: "Frost / Temperatur",
    humidity: "Luftfeuchtigkeit",
    leak: "Leck",
    door: "Tür",
    air: "Luftqualität / Luftdruck",
    battery: "Akku",
  },
};

const ptBr: HardwareMessages = {
  title: "Qual hardware de sensores funciona com o ProbeHarbor",
  description:
    "Escolha o que quer monitorar (congelamento, umidade, vazamentos, portas) e veja placas, sensores e instalações que funcionam, com o status real de testes.",
  breadcrumbHome: "Início",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "O que posso conectar?",
  lede: "O ProbeHarbor é software: funciona com sensores que você compra ou já tem. Escolha o que quer monitorar e se prefere não escrever código.",
  flashCta: "Gravar um ESP32",
  checkerCta: "Verificar um payload",
  filterTitle: "Filtro",
  watchLegend: "Quero monitorar",
  anything: "Qualquer coisa",
  noCode: "Sem programar",
  hardwareLabel: "Hardware: ",
  setupLabel: "Instalação: ",
  watchesLabel: "Monitora: ",
  labelsTitle: "O que os rótulos significam",
  verifiedExplain: "rodamos essa combinação em uma placa de verdade e vimos as leituras chegarem.",
  builtInExplain:
    "o firmware do gravador tem suporte, mas ainda não montamos um nós mesmos. Conte para a gente se funcionar com você.",
  guideExplain:
    "um caminho documentado em que você adapta código ou configuração de exemplo. Qualquer coisa que envie JSON via HTTPS pode reportar.",
  countNone: "Nada corresponde; tente outro filtro.",
  countOne: "1 configuração exibida.",
  countMany: "{n} configurações exibidas.",
  statusLabels: {
    verified: "Verificado em hardware",
    "built-in": "Integrado, ainda não testado em hardware",
    guide: "Guia: você escreve o código",
  },
  goalLabels: {
    freeze: "Congelamento / temperatura",
    humidity: "Umidade",
    leak: "Vazamento",
    door: "Porta",
    air: "Qualidade do ar / pressão",
    battery: "Bateria",
  },
};

export const hardwareMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
