import type { HardwareMessages } from "./en";

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

export default de;
