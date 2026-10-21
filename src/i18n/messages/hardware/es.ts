import type { HardwareMessages } from "./en";

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

export default es;
