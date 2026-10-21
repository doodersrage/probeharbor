import type { ProbeDemoMessages } from "./en";

const de: ProbeDemoMessages = {
  conditionsTitle: "Bedingungen an den Fühlern",
  conditionsSubtitleHtml:
    "Wähle einen Raum, stell das Wetter ein und sieh zu, wie die Zonen reagieren, genau wie Overview und Devices mit Live-Ingest. Probier zuerst <strong>Zugluft am Tor</strong> oder <strong>Kälteeinbruch</strong>: Löse die Änderung aus und lies dann die Balken.",
  presetsAria: "Voreingestellte Szenarien",
  spaceLabel: "Überwachter Raum",
  outdoorLabel: "Außentemperatur: {temp}",
  sunLabel: "Sonne / Wärmelast ({pct} %)",
  freezeLabel: "Frostschwelle: {temp}",
  draftCalloutHtml:
    "Der Tor-/Eingangsbereich ist etwa <strong>{spread}</strong> kälter als der wärmste andere Fühler: Genau deshalb kann ein einzelner Sensor an der Werkbank die Frostgefahr am Tor übersehen.",
  reset: "Demo zurücksetzen",
  updated: "Simulierte Aktualisierung alle 2 Sekunden · Letzte Aktualisierung {time}",
  statusEyebrow: "Raumstatus (simuliert)",
  coldestLine:
    "Kältester Fühler {coldest} · Schwelle {threshold} · außen {outdoor}",
  riskNote:
    "In der echten App würden jetzt deine Frost-Grundwarnungen ausgelöst (standardmäßig per E-Mail), mit derselben Logik wie die Raumstatus-Karte in Overview.",
  readingsTitle: "Live-Messwerte der Fühler",
  readingsSubtitle:
    "Jede Karte entspricht einer Sensorbezeichnung, die du nach dem ersten POST in Devices umbenennen würdest.",
  draftBadge: " Zugluft",
  statValue: "{primary}",
  statDetail: "{secondary} · {h} % Luftfeuchtigkeit",
  belowFreeze: " · unter der Frostschwelle",
  nearFreeze: " · nahe der Frostschwelle",
  averageLabel: "Mittelwert · avg",
  comparisonTitle: "Fühlervergleich",
  comparisonOpen:
    "Bei offenem Tor sollte der Balken für den Tor-/Eingangsbereich gegenüber den anderen fallen. Die gestrichelte Linie ist deine Frostschwelle.",
  comparisonClosed:
    "Relative Temperatur nach Zone. Die gestrichelte Linie ist deine Frostschwelle. Öffne das Tor, um den Abstand zu vergrößern.",
  barsAria: "Balkendiagramm zum Vergleich der Fühlertemperaturen",
  barThresholdTitle: "Frost {threshold}",
  barValue: "{primary}",
  thresholdNote:
    "Die senkrechten Markierungen zeigen auf jedem Balken die Frostschwelle von {threshold}.",
  jsonTitle: "Vorschau des JSON-Feeds",
  jsonSubtitleHtml:
    "Push ingest ist das, was ESP/Arduino per POST an Devices senden. Pull fasst dieselben benannten Fühler unter <code>temp</code> für zeitgesteuertes HTTPS-JSON zusammen.",
  jsonTabsAria: "JSON-Format",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "JSON kopieren",
  copied: "Kopiert",
  copyFailed: "Kopieren fehlgeschlagen",
  convertTitle: "Willst du das für deine Garage?",
  convertSubtitle:
    "Dieselben JSON-Strukturen und Frost-Grundwarnungen: etwa 25 US$ für ESP32 + wasserdichten Fühler, dann ein kostenloses Konto, ein POST und eine Frostschwelle vor der nächsten kalten Nacht.",
  kitCta: "ESP32-Frostkit (~25 US$)",
  createAccount: "Kostenloses Konto erstellen",
  allOptions: "Alle Geräteoptionen",
  signedIn: "Schon angemeldet?",
  addPush: "Push-Gerät hinzufügen",
  essentials: "Frost- + E-Mail-Grundwarnungen",
  presets: {
    mild: { label: "Milder Tag", hint: "Typische Werte im geschlossenen Raum" },
    coldSnap: { label: "Kälteeinbruch", hint: "Kältester Fühler unter der Frostschwelle" },
    doorDraft: {
      label: "Zugluft am Tor",
      hint: "Ein offenes Tor zieht Außenluft in eine Zone: Sieh zu, wie der Balken für den Tor-/Eingangsbereich gegenüber den anderen fällt",
    },
    sunny: { label: "Sonnenlast", hint: "Dach- / Westlage erwärmt die wärmste Zone" },
  },
  spaces: {
    garage: {
      label: "Garage",
      doorLabel: "Garagentor offen (mischt Außenluft in den Torbereich)",
      modelHint:
        "Ausgewogenes Modell: Die Sonne wärmt die Werkbankseite; ein offenes Garagentor zieht den Torbereich in Richtung Außentemperatur, während die hintere Wand geschützt bleibt.",
      probeLabels: ["Nordwand", "Torbereich", "Werkbank"],
    },
    workshop: {
      label: "Werkstatt",
      doorLabel: "Werkstatttür offen (mischt Außenluft in den Eingangsbereich)",
      modelHint:
        "Geschlossen etwas wärmer als eine Garage (Wärme von Werkzeugen und Personen). Der Eingangsbereich bekommt die Zugluft ab; die Werkzeugbank bleibt die warme Ecke.",
      probeLabels: ["Außenwand", "Eingangsbereich", "Werkzeugbank"],
    },
    attic: {
      label: "Dachboden",
      doorLabel: "Bodenluke offen (mischt Raumluft aus dem Haus in den Lukenbereich)",
      modelHint:
        "Sonnenempfindlich: First und Sparren schwanken stark mit der Wärmelast. Bei offener Luke gelangt kühlere Hausluft nur in den Lukenbereich.",
      probeLabels: ["Nordsparren", "Lukenbereich", "First"],
    },
    crawlspace: {
      label: "Kriechkeller",
      doorLabel: "Zugangsklappe offen (mischt Außenluft in den Eingangsbereich)",
      modelHint:
        "Kaum Sonneneinfluss und kühlere Grundtemperatur. Bei offenem Zugang trifft Außenluft auf den Fühler am Eingang; die Rohrleitungen bleiben näher an der Bodentemperatur.",
      probeLabels: ["Fundamentwand", "Zugangsbereich", "Rohrleitung"],
    },
  },
  status: {
    freezeRiskTitle: "Akute Frostgefahr",
    freezeRiskDetail:
      "Der kälteste Fühler misst {coldest}; Schwelle: {threshold}.",
    coldSnapTitle: "Kälteeinbruch im Anmarsch",
    nightsTitleOne: "{n} Nacht mit Frostgefahr",
    nightsTitleOther: "{n} Nächte mit Frostgefahr",
    coldSnapDetail:
      "Draußen wird es kalt: Geh die Checkliste durch und prüfe, ob die Vorhersagewarnungen aktiv sind.",
    nightsDetail:
      "Draußen wird es kalt: Prüfe die Fühler unter Live und ob die Vorhersagewarnungen aktiv sind.",
    nearTitle: "Nahe an der Frostschwelle",
    nearDetail:
      "Kältester Fühler {coldest}, weniger als 2,8 °C (5 °F) über {threshold}.",
    okTitle: "Alles im grünen Bereich",
    okDetail: "Die Fühler melden Werte: nichts an der Frostschwelle, keine nassen Hochwasserkontakte.",
  },
};

export default de;
