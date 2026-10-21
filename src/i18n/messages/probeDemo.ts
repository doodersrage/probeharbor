import { PROBE_DEMO_TEXT_EN, type ProbeDemoText } from "../../components/ProbeDemo";
import { defineMessages } from "../translate";

/**
 * Strings for the ProbeDemo island (passed as its `text` prop). Plain data only:
 * `{name}` placeholders are filled in the island. English keeps the preset,
 * space and status copy from `lib/probeDemo` / `lib/garageRiskStatus`.
 * Translations show °C first with °F in parentheses; the simulator itself runs in °F.
 */
const en: ProbeDemoText = PROBE_DEMO_TEXT_EN;

const es: ProbeDemoText = {
  conditionsTitle: "Condiciones de las sondas",
  conditionsSubtitleHtml:
    "Elige un espacio, ajusta el clima y observa cómo responden las zonas, igual que Overview y Devices con la ingesta en vivo. Prueba primero <strong>Corriente en la puerta</strong> o <strong>Ola de frío</strong>: provoca el cambio y luego lee las barras.",
  presetsAria: "Escenarios predefinidos",
  spaceLabel: "Espacio monitorizado",
  outdoorLabel: "Temperatura exterior: {c} °C ({f} °F)",
  sunLabel: "Sol / carga térmica ({pct} %)",
  freezeLabel: "Umbral de helada: {c} °C ({f} °F)",
  draftCalloutHtml:
    "La zona de la puerta/entrada está unos <strong>{spreadC} °C ({spread} °F)</strong> más fría que la sonda más cálida: por eso un solo sensor en el banco de trabajo puede pasar por alto el riesgo de helada junto a la puerta.",
  reset: "Reiniciar demo",
  updated: "Actualización simulada cada 2 segundos · Última actualización {time}",
  statusEyebrow: "Estado del espacio (simulado)",
  coldestLine:
    "Sonda más fría {coldestC} °C ({coldest} °F) · umbral {thresholdC} °C ({threshold} °F) · exterior {outdoorC} °C ({outdoor} °F)",
  riskNote:
    "En la app real, esto activaría tus alertas esenciales de helada (por correo electrónico por defecto), con la misma lógica que la tarjeta de estado del espacio de Overview.",
  readingsTitle: "Lecturas de las sondas en vivo",
  readingsSubtitle:
    "Cada tarjeta representa la etiqueta de un sensor que renombrarías en Devices tras el primer POST.",
  draftBadge: " corriente",
  statValue: "{c} °C",
  statDetail: "{f} °F · {h} % de humedad",
  belowFreeze: " · bajo el umbral de helada",
  nearFreeze: " · cerca del umbral de helada",
  averageLabel: "Promedio · avg",
  comparisonTitle: "Comparación de sondas",
  comparisonOpen:
    "Con la puerta abierta, la barra de la puerta/entrada debería bajar frente a las demás. La línea discontinua es tu umbral de helada.",
  comparisonClosed:
    "Temperatura relativa por zona. La línea discontinua es tu umbral de helada. Abre la puerta para ampliar la diferencia.",
  barsAria: "Gráfico de barras que compara las temperaturas de las sondas",
  barThresholdTitle: "Helada {thresholdC} °C ({threshold} °F)",
  barValue: "{c} °C",
  thresholdNote: "Las marcas verticales indican el umbral de helada de {thresholdC} °C ({threshold} °F) en cada barra.",
  jsonTitle: "Vista previa del feed JSON",
  jsonSubtitleHtml:
    "Push ingest es lo que los ESP/Arduino envían por POST a Devices. Pull agrupa las mismas sondas con nombre bajo <code>temp</code> para el JSON HTTPS programado.",
  jsonTabsAria: "Formato JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copiar JSON",
  copied: "Copiado",
  copyFailed: "No se pudo copiar",
  convertTitle: "¿Lo quieres para tu garaje?",
  convertSubtitle:
    "Las mismas estructuras JSON y alertas esenciales de helada: unos 25 US$ en piezas (ESP32 + sonda impermeable), luego una cuenta gratuita, un POST y un umbral de helada antes de la próxima noche fría.",
  kitCta: "Kit antiheladas ESP32 (~25 US$)",
  createAccount: "Crear cuenta gratuita",
  allOptions: "Todas las opciones de dispositivos",
  signedIn: "¿Ya has iniciado sesión?",
  addPush: "Añadir un dispositivo push",
  essentials: "Alertas esenciales de helada + correo",
  presets: {
    mild: { label: "Día templado", hint: "Lecturas típicas con el espacio cerrado" },
    coldSnap: { label: "Ola de frío", hint: "Por debajo del umbral de helada en la sonda más fría" },
    doorDraft: {
      label: "Corriente en la puerta",
      hint: "La puerta abierta mete aire exterior en una zona: mira cómo baja la barra de la puerta/entrada frente a las demás",
    },
    sunny: { label: "Carga solar", hint: "La exposición del tejado / al oeste calienta la zona más cálida" },
  },
  spaces: {
    garage: {
      label: "Garaje",
      doorLabel: "Puerta del garaje abierta (mezcla aire exterior en la zona de la puerta)",
      modelHint:
        "Modelo equilibrado: el sol calienta el lado del banco de trabajo; una puerta de garaje abierta acerca la zona de la puerta a la temperatura exterior, mientras la pared del fondo queda protegida.",
      probeLabels: ["Pared norte", "Zona de la puerta", "Banco de trabajo"],
    },
    workshop: {
      label: "Taller",
      doorLabel: "Puerta del taller abierta (mezcla aire exterior en la zona de entrada)",
      modelHint:
        "Base algo más cálida que un garaje cerrado (calor de herramientas y personas). La zona de entrada recibe la corriente; el banco de herramientas sigue siendo el rincón cálido.",
      probeLabels: ["Pared exterior", "Zona de entrada", "Banco de herramientas"],
    },
    attic: {
      label: "Ático",
      doorLabel: "Trampilla abierta (mezcla aire climatizado en la zona de la trampilla)",
      modelHint:
        "Sensible al sol: la cumbrera y las vigas varían mucho con la carga térmica. Con la trampilla abierta, el aire más fresco de la casa solo entra en la zona de la trampilla.",
      probeLabels: ["Viga norte", "Zona de la trampilla", "Cumbrera"],
    },
    crawlspace: {
      label: "Cámara sanitaria",
      doorLabel: "Puerta de acceso abierta (mezcla aire exterior cerca de la entrada)",
      modelHint:
        "Poco afectada por el sol y con una base más fresca. Con el acceso abierto, el aire exterior llega a la sonda de entrada; las tuberías se mantienen más cerca de la temperatura del suelo.",
      probeLabels: ["Muro de cimentación", "Zona de acceso", "Tramo de tubería"],
    },
  },
  status: {
    freezeRiskTitle: "Riesgo de helada ahora mismo",
    freezeRiskDetail: "La sonda más fría marca {coldestC} °C ({coldest} °F); umbral: {thresholdC} °C ({threshold} °F).",
    coldSnapTitle: "Se acerca una ola de frío",
    nightsTitleOne: "{n} noche con riesgo de helada",
    nightsTitleOther: "{n} noches con riesgo de helada",
    coldSnapDetail:
      "Las condiciones exteriores son frías: sigue la lista de comprobación y confirma que las alertas de previsión están activadas.",
    nightsDetail:
      "Las condiciones exteriores son frías: comprueba las sondas en Live y confirma que las alertas de previsión están activadas.",
    nearTitle: "Cerca del umbral de helada",
    nearDetail:
      "Sonda más fría {coldestC} °C ({coldest} °F), a menos de 2,8 °C (5 °F) de {thresholdC} °C ({threshold} °F).",
    okTitle: "Todo en orden",
    okDetail: "Las sondas están enviando datos: nada en el umbral de helada y ningún contacto de inundación mojado.",
  },
};

const fr: ProbeDemoText = {
  conditionsTitle: "Conditions des sondes",
  conditionsSubtitleHtml:
    "Choisissez un espace, ajustez la météo et regardez les zones réagir comme dans Overview et Devices avec l’ingestion en direct. Essayez d’abord <strong>Courant d’air</strong> ou <strong>Vague de froid</strong> : provoquez le changement, puis lisez les barres.",
  presetsAria: "Scénarios prédéfinis",
  spaceLabel: "Espace surveillé",
  outdoorLabel: "Température extérieure\u00a0: {c} °C ({f} °F)",
  sunLabel: "Soleil / charge thermique ({pct} %)",
  freezeLabel: "Seuil de gel\u00a0: {c} °C ({f} °F)",
  draftCalloutHtml:
    "La zone porte/entrée est environ <strong>{spreadC} °C ({spread} °F)</strong> plus froide que la sonde la plus chaude : c’est pour cela qu’un seul capteur sur l’établi peut passer à côté du risque de gel près de la porte.",
  reset: "Réinitialiser la démo",
  updated: "Actualisation simulée toutes les 2 secondes · Dernière mise à jour {time}",
  statusEyebrow: "État de l’espace (simulé)",
  coldestLine:
    "Sonde la plus froide {coldestC} °C ({coldest} °F) · seuil {thresholdC} °C ({threshold} °F) · extérieur {outdoorC} °C ({outdoor} °F)",
  riskNote:
    "Dans l’application réelle, cela déclencherait vos alertes gel essentielles (par e-mail par défaut), avec la même logique que la carte d’état de l’espace d’Overview.",
  readingsTitle: "Relevés des sondes en direct",
  readingsSubtitle:
    "Chaque carte correspond au libellé d’un capteur que vous renommeriez dans Devices après le premier POST.",
  draftBadge: " courant d’air",
  statValue: "{c} °C",
  statDetail: "{f} °F · {h} % d’humidité",
  belowFreeze: " · sous le seuil de gel",
  nearFreeze: " · proche du seuil de gel",
  averageLabel: "Moyenne · avg",
  comparisonTitle: "Comparaison des sondes",
  comparisonOpen:
    "Porte ouverte, la barre porte/entrée devrait baisser par rapport aux autres. La ligne pointillée représente votre seuil de gel.",
  comparisonClosed:
    "Température relative par zone. La ligne pointillée représente votre seuil de gel. Ouvrez la porte pour creuser l’écart.",
  barsAria: "Graphique à barres comparant les températures des sondes",
  barThresholdTitle: "Gel {thresholdC} °C ({threshold} °F)",
  barValue: "{c} °C",
  thresholdNote: "Les repères verticaux indiquent le seuil de gel de {thresholdC} °C ({threshold} °F) sur chaque barre.",
  jsonTitle: "Aperçu du flux JSON",
  jsonSubtitleHtml:
    "Push ingest correspond à ce que les ESP/Arduino envoient en POST à Devices. Pull regroupe les mêmes sondes nommées sous <code>temp</code> pour le JSON HTTPS planifié.",
  jsonTabsAria: "Format JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copier le JSON",
  copied: "Copié",
  copyFailed: "Échec de la copie",
  convertTitle: "Vous voulez ça pour votre garage ?",
  convertSubtitle:
    "Les mêmes structures JSON et alertes gel essentielles : environ 25 $ US de pièces (ESP32 + sonde étanche), puis un compte gratuit, un POST et un seuil de gel avant la prochaine nuit froide.",
  kitCta: "Kit antigel ESP32 (~25 $ US)",
  createAccount: "Créer un compte gratuit",
  allOptions: "Toutes les options d’appareils",
  signedIn: "Déjà connecté ?",
  addPush: "Ajouter un appareil push",
  essentials: "Alertes gel + e-mail essentielles",
  presets: {
    mild: { label: "Journée douce", hint: "Relevés typiques d’un espace fermé" },
    coldSnap: { label: "Vague de froid", hint: "Sous le seuil de gel sur la sonde la plus froide" },
    doorDraft: {
      label: "Courant d’air",
      hint: "La porte ouverte fait entrer l’air extérieur dans une zone : regardez la barre porte/entrée baisser par rapport aux autres",
    },
    sunny: { label: "Charge solaire", hint: "Le toit / l’exposition ouest réchauffe la zone la plus chaude" },
  },
  spaces: {
    garage: {
      label: "Garage",
      doorLabel: "Porte de garage ouverte (l’air extérieur se mêle à la zone de la porte)",
      modelHint:
        "Modèle équilibré : le soleil réchauffe le côté établi ; une porte de garage ouverte rapproche la zone de la porte de la température extérieure, tandis que le mur du fond reste protégé.",
      probeLabels: ["Mur nord", "Zone de la porte", "Établi"],
    },
    workshop: {
      label: "Atelier",
      doorLabel: "Porte de l’atelier ouverte (l’air extérieur se mêle à la zone d’entrée)",
      modelHint:
        "Base fermée un peu plus chaude qu’un garage (chaleur des outils et des personnes). La zone d’entrée prend le courant d’air ; l’établi reste le coin chaud.",
      probeLabels: ["Mur extérieur", "Zone d’entrée", "Établi à outils"],
    },
    attic: {
      label: "Combles",
      doorLabel: "Trappe ouverte (l’air chauffé de la maison se mêle à la zone de la trappe)",
      modelHint:
        "Sensible au soleil : le faîtage et les chevrons varient fortement avec la charge thermique. Trappe ouverte, l’air plus frais de la maison ne gagne que la zone de la trappe.",
      probeLabels: ["Chevron nord", "Zone de la trappe", "Faîtage"],
    },
    crawlspace: {
      label: "Vide sanitaire",
      doorLabel: "Trappe d’accès ouverte (l’air extérieur se mêle près de l’entrée)",
      modelHint:
        "Peu sensible au soleil, base plus fraîche. Accès ouvert, l’air extérieur arrive sur la sonde d’entrée ; les canalisations restent plus proches de la température du sol.",
      probeLabels: ["Mur de fondation", "Zone d’accès", "Canalisation"],
    },
  },
  status: {
    freezeRiskTitle: "Risque de gel en ce moment",
    freezeRiskDetail:
      "La sonde la plus froide indique {coldestC} °C ({coldest} °F)\u00a0; seuil\u00a0: {thresholdC} °C ({threshold} °F).",
    coldSnapTitle: "Vague de froid en approche",
    nightsTitleOne: "{n} nuit à risque de gel",
    nightsTitleOther: "{n} nuits à risque de gel",
    coldSnapDetail:
      "Les conditions extérieures sont froides : suivez la check-list et vérifiez que les alertes de prévision sont activées.",
    nightsDetail:
      "Les conditions extérieures sont froides : vérifiez les sondes dans Live et que les alertes de prévision sont activées.",
    nearTitle: "Proche du seuil de gel",
    nearDetail:
      "Sonde la plus froide à {coldestC} °C ({coldest} °F), à moins de 2,8 °C (5 °F) de {thresholdC} °C ({threshold} °F).",
    okTitle: "Tout va bien",
    okDetail:
      "Les sondes transmettent : rien au seuil de gel, aucun contact d’inondation mouillé.",
  },
};

const de: ProbeDemoText = {
  conditionsTitle: "Bedingungen an den Fühlern",
  conditionsSubtitleHtml:
    "Wähle einen Raum, stell das Wetter ein und sieh zu, wie die Zonen reagieren, genau wie Overview und Devices mit Live-Ingest. Probier zuerst <strong>Zugluft am Tor</strong> oder <strong>Kälteeinbruch</strong>: Löse die Änderung aus und lies dann die Balken.",
  presetsAria: "Voreingestellte Szenarien",
  spaceLabel: "Überwachter Raum",
  outdoorLabel: "Außentemperatur: {c} °C ({f} °F)",
  sunLabel: "Sonne / Wärmelast ({pct} %)",
  freezeLabel: "Frostschwelle: {c} °C ({f} °F)",
  draftCalloutHtml:
    "Der Tor-/Eingangsbereich ist etwa <strong>{spreadC} °C ({spread} °F)</strong> kälter als der wärmste andere Fühler: Genau deshalb kann ein einzelner Sensor an der Werkbank die Frostgefahr am Tor übersehen.",
  reset: "Demo zurücksetzen",
  updated: "Simulierte Aktualisierung alle 2 Sekunden · Letzte Aktualisierung {time}",
  statusEyebrow: "Raumstatus (simuliert)",
  coldestLine:
    "Kältester Fühler {coldestC} °C ({coldest} °F) · Schwelle {thresholdC} °C ({threshold} °F) · außen {outdoorC} °C ({outdoor} °F)",
  riskNote:
    "In der echten App würden jetzt deine Frost-Grundwarnungen ausgelöst (standardmäßig per E-Mail), mit derselben Logik wie die Raumstatus-Karte in Overview.",
  readingsTitle: "Live-Messwerte der Fühler",
  readingsSubtitle:
    "Jede Karte entspricht einer Sensorbezeichnung, die du nach dem ersten POST in Devices umbenennen würdest.",
  draftBadge: " Zugluft",
  statValue: "{c} °C",
  statDetail: "{f} °F · {h} % Luftfeuchtigkeit",
  belowFreeze: " · unter der Frostschwelle",
  nearFreeze: " · nahe der Frostschwelle",
  averageLabel: "Mittelwert · avg",
  comparisonTitle: "Fühlervergleich",
  comparisonOpen:
    "Bei offenem Tor sollte der Balken für den Tor-/Eingangsbereich gegenüber den anderen fallen. Die gestrichelte Linie ist deine Frostschwelle.",
  comparisonClosed:
    "Relative Temperatur nach Zone. Die gestrichelte Linie ist deine Frostschwelle. Öffne das Tor, um den Abstand zu vergrößern.",
  barsAria: "Balkendiagramm zum Vergleich der Fühlertemperaturen",
  barThresholdTitle: "Frost {thresholdC} °C ({threshold} °F)",
  barValue: "{c} °C",
  thresholdNote:
    "Die senkrechten Markierungen zeigen auf jedem Balken die Frostschwelle von {thresholdC} °C ({threshold} °F).",
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
      "Der kälteste Fühler misst {coldestC} °C ({coldest} °F); Schwelle: {thresholdC} °C ({threshold} °F).",
    coldSnapTitle: "Kälteeinbruch im Anmarsch",
    nightsTitleOne: "{n} Nacht mit Frostgefahr",
    nightsTitleOther: "{n} Nächte mit Frostgefahr",
    coldSnapDetail:
      "Draußen wird es kalt: Geh die Checkliste durch und prüfe, ob die Vorhersagewarnungen aktiv sind.",
    nightsDetail:
      "Draußen wird es kalt: Prüfe die Fühler unter Live und ob die Vorhersagewarnungen aktiv sind.",
    nearTitle: "Nahe an der Frostschwelle",
    nearDetail:
      "Kältester Fühler {coldestC} °C ({coldest} °F), weniger als 2,8 °C (5 °F) über {thresholdC} °C ({threshold} °F).",
    okTitle: "Alles im grünen Bereich",
    okDetail: "Die Fühler melden Werte: nichts an der Frostschwelle, keine nassen Hochwasserkontakte.",
  },
};

const ptBr: ProbeDemoText = {
  conditionsTitle: "Condições das sondas",
  conditionsSubtitleHtml:
    "Escolha um espaço, ajuste o clima e veja as zonas reagirem do mesmo jeito que o Overview e o Devices com a ingestão ao vivo. Experimente primeiro <strong>Corrente de ar na porta</strong> ou <strong>Onda de frio</strong>: provoque a mudança e depois leia as barras.",
  presetsAria: "Cenários predefinidos",
  spaceLabel: "Espaço monitorado",
  outdoorLabel: "Temperatura externa: {c} °C ({f} °F)",
  sunLabel: "Sol / carga térmica ({pct}%)",
  freezeLabel: "Limite de congelamento: {c} °C ({f} °F)",
  draftCalloutHtml:
    "A zona da porta/entrada está cerca de <strong>{spreadC} °C ({spread} °F)</strong> mais fria que a sonda mais quente: é por isso que um único sensor na bancada pode não perceber o risco de congelamento perto da porta.",
  reset: "Reiniciar demo",
  updated: "Atualização simulada a cada 2 segundos · Última atualização {time}",
  statusEyebrow: "Status do espaço (simulado)",
  coldestLine:
    "Sonda mais fria {coldestC} °C ({coldest} °F) · limite {thresholdC} °C ({threshold} °F) · externa {outdoorC} °C ({outdoor} °F)",
  riskNote:
    "No app de verdade, isso dispararia seus alertas essenciais de congelamento (por e-mail, por padrão), com a mesma lógica do cartão de status do espaço no Overview.",
  readingsTitle: "Leituras das sondas ao vivo",
  readingsSubtitle:
    "Cada cartão corresponde ao rótulo de um sensor que você renomearia no Devices depois do primeiro POST.",
  draftBadge: " corrente de ar",
  statValue: "{c} °C",
  statDetail: "{f} °F · {h}% de umidade",
  belowFreeze: " · abaixo do limite de congelamento",
  nearFreeze: " · perto do limite de congelamento",
  averageLabel: "Média · avg",
  comparisonTitle: "Comparação das sondas",
  comparisonOpen:
    "Com a porta aberta, a barra da porta/entrada deve cair em relação às outras. A linha tracejada é o seu limite de congelamento.",
  comparisonClosed:
    "Temperatura relativa por zona. A linha tracejada é o seu limite de congelamento. Abra a porta para aumentar a diferença.",
  barsAria: "Gráfico de barras comparando as temperaturas das sondas",
  barThresholdTitle: "Congelamento {thresholdC} °C ({threshold} °F)",
  barValue: "{c} °C",
  thresholdNote:
    "As marcas verticais mostram o limite de congelamento de {thresholdC} °C ({threshold} °F) em cada barra.",
  jsonTitle: "Prévia do feed JSON",
  jsonSubtitleHtml:
    "Push ingest é o que o ESP/Arduino envia por POST para o Devices. Pull agrupa as mesmas sondas nomeadas em <code>temp</code> para o JSON HTTPS agendado.",
  jsonTabsAria: "Formato JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copiar JSON",
  copied: "Copiado",
  copyFailed: "Falha ao copiar",
  convertTitle: "Quer isso na sua garagem?",
  convertSubtitle:
    "Os mesmos formatos JSON e alertas essenciais de congelamento: cerca de US$ 25 em peças (ESP32 + sonda à prova d’água), depois uma conta gratuita, um POST e um limite de congelamento antes da próxima noite fria.",
  kitCta: "Kit antecongelamento ESP32 (~US$ 25)",
  createAccount: "Criar conta gratuita",
  allOptions: "Todas as opções de dispositivos",
  signedIn: "Já entrou?",
  addPush: "Adicionar um dispositivo push",
  essentials: "Alertas essenciais de congelamento + e-mail",
  presets: {
    mild: { label: "Dia ameno", hint: "Leituras típicas com o espaço fechado" },
    coldSnap: { label: "Onda de frio", hint: "Abaixo do limite de congelamento na sonda mais fria" },
    doorDraft: {
      label: "Corrente de ar na porta",
      hint: "A porta aberta puxa ar externo para uma zona: veja a barra da porta/entrada cair em relação às outras",
    },
    sunny: { label: "Carga solar", hint: "O telhado / a face oeste aquece a zona mais quente" },
  },
  spaces: {
    garage: {
      label: "Garagem",
      doorLabel: "Portão da garagem aberto (mistura ar externo na zona da porta)",
      modelHint:
        "Modelo equilibrado: o sol aquece o lado da bancada; um portão aberto aproxima a zona da porta da temperatura externa, enquanto a parede do fundo fica protegida.",
      probeLabels: ["Parede norte", "Zona da porta", "Bancada"],
    },
    workshop: {
      label: "Oficina",
      doorLabel: "Porta da oficina aberta (mistura ar externo na zona de entrada)",
      modelHint:
        "Base fechada um pouco mais quente que a de uma garagem (calor de ferramentas e pessoas). A zona de entrada recebe a corrente de ar; a bancada de ferramentas continua sendo o canto quente.",
      probeLabels: ["Parede externa", "Zona de entrada", "Bancada de ferramentas"],
    },
    attic: {
      label: "Sótão",
      doorLabel: "Alçapão aberto (mistura ar climatizado na zona do alçapão)",
      modelHint:
        "Sensível ao sol: a cumeeira e os caibros variam muito com a carga térmica. Com o alçapão aberto, o ar mais fresco da casa entra só na zona do alçapão.",
      probeLabels: ["Caibro norte", "Zona do alçapão", "Cumeeira"],
    },
    crawlspace: {
      label: "Porão baixo",
      doorLabel: "Porta de acesso aberta (mistura ar externo perto da entrada)",
      modelHint:
        "Pouco afetado pelo sol e com base mais fria. Com o acesso aberto, o ar externo chega à sonda da entrada; os canos ficam mais perto da temperatura do solo.",
      probeLabels: ["Parede da fundação", "Zona de acesso", "Trecho de cano"],
    },
  },
  status: {
    freezeRiskTitle: "Risco de congelamento agora",
    freezeRiskDetail:
      "A sonda mais fria marca {coldestC} °C ({coldest} °F); limite: {thresholdC} °C ({threshold} °F).",
    coldSnapTitle: "Onda de frio a caminho",
    nightsTitleOne: "{n} noite com risco de congelamento",
    nightsTitleOther: "{n} noites com risco de congelamento",
    coldSnapDetail:
      "As condições externas estão frias: siga o checklist e confirme que os alertas de previsão estão ativados.",
    nightsDetail:
      "As condições externas estão frias: confira as sondas no Live e confirme que os alertas de previsão estão ativados.",
    nearTitle: "Perto do limite de congelamento",
    nearDetail:
      "Sonda mais fria em {coldestC} °C ({coldest} °F), a menos de 2,8 °C (5 °F) de {thresholdC} °C ({threshold} °F).",
    okTitle: "Tudo certo",
    okDetail: "As sondas estão enviando dados: nada no limite de congelamento, nenhum contato de inundação molhado.",
  },
};

export const probeDemoMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
