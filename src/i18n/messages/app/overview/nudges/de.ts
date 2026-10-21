import type { OverviewNudgesMessages } from "./en";

const de: OverviewNudgesMessages = {
  dismiss: "Ausblenden",
  openAlerts: "Alarme öffnen",
  android: {
    title: "Android-Begleit-App",
    body: "Live-Fühler, Alarme und Haushaltsfunktionen auf deinem Handy: Das Handy selbst ist kein Sensor.",
    googlePlay: "Bei Google Play herunterladen",
    earlyAccess: "Android Early Access",
    orPwa: "Oder die PWA installieren",
  },
  bayBuddy: {
    body: "Desktop-Anzeige für einen Bereich: Frost- und Wasserstimmung, ohne das ganze Dashboard zu öffnen.",
    get: "{name} holen",
    android: "Android-Begleit-App",
  },
  demoPull: {
    title: "Ohne Hardware ausprobieren",
    body: "Ein Klick fügt unseren öffentlichen HTTPS-Beispiel-Feed hinzu. Die Übersicht zeigt dann Live-Temperaturen, ganz ohne ESP.",
    button: "Demo-Feed testen",
  },
  probeSimulator: {
    title: "Noch am Ausprobieren?",
    body: "Lös im interaktiven Simulator eine Kältewelle oder Zugluft durch eine offene Tür aus, mit derselben Bereichsstatus-Logik wie in der Übersicht und ohne Hardware. Wenn du so weit bist, komm zurück und verbinde einen echten Fühler.",
    open: "Fühler-Simulator öffnen",
    doorDraft: "Zugluft testen",
  },
  nest: {
    title: "Nest oder Ecobee?",
    bodyEntitled:
      "Verbinde Nest/Ecobee unter Geräte → Pull-Feeds, um neben deinen Fühlern auch die Innentemperatur im Haus zu sehen.",
    bodyNotEntitled:
      "Thermostat-OAuth für Nest/Ecobee gibt es im Tarif Pro. Mit Free/Member kannst du die Klimatemperatur trotzdem aus Home Assistant als Innenreferenz senden.",
    open: "Pull-Feeds & Thermostate öffnen",
    guide: "Anleitung Thermostat-OAuth",
    viewPro: "Pro ansehen",
  },
  pwa: {
    title: "Auf dem Handy installieren",
    body: "Füge ProbeHarbor deinem Startbildschirm hinzu, um schneller hineinzukommen; optionale Browser-Pushes findest du unter Alarme.",
    install: "Installieren / PWA",
    guide: "Installationsanleitung",
  },
  youreLive: {
    title: "Fühlerkarten findest du unter Live",
    body: "Die Messwerte auf einen Blick sind nach Dashboard → Live umgezogen. Die Übersicht zeigt Risiko und nächste Schritte.",
    openLive: "Live öffnen",
    finishAlertSetup: "Alarme fertig einrichten",
    sendTestAlert: "Testalarm senden",
    reviewHistory: "Verlauf ansehen",
  },
  alertSetup: {
    title: "Alarme fertig einrichten",
    thresholdText:
      "Alarme sind aus oder es fehlt eine Frostschwelle. Leg eine fest, bevor es kalt wird, damit du rechtzeitig gewarnt wirst.",
    emailText:
      "Alarme sind an, aber E-Mail ist nicht eingerichtet. Aktiviere den E-Mail-Kanal und speichere, damit Frostwarnungen in deinem Postfach ankommen.",
    setFreezeEmail: "Frost + E-Mail einstellen",
    enableEmail: "E-Mail-Alarme aktivieren",
  },
  story: {
    eyebrow: "Frostszenario",
    title: "So sieht ein Heizungsausfall um 2 Uhr nachts aus",
    body: "Ein Durchgang durch Fühlerplatzierung, Schwellenwerte und den Ablauf der Alarme, wenn Rohre gefährdet sind.",
    read: "Szenario lesen",
    deepDive: "Technischer Hintergrund",
  },
  testAlert: {
    title: "Schick vor der nächsten kalten Nacht einen Testalarm",
    body: "Alarme sind eingerichtet, aber die Zustellung hast du noch nicht bestätigt. Ein 30-Sekunden-Test jetzt verhindert, dass du einen Tippfehler in deiner E-Mail-Adresse oder SMS-Nummer erst bei echtem Frost entdeckst.",
    send: "Testalarm senden",
  },
  freezeMap: {
    title: "Vergleich deine Fühler mit der Nachbarschaft",
    bodyCity:
      "Nimm an der öffentlichen Frostkarte teil und sieh, wie dein kältester Fühler im Vergleich zu anderen ProbeHarbor-Haushalten in {city} abschneidet: nur anonymisierte Durchschnittswerte, keine Adresse und keine Gerätenamen.",
    bodyNoCity:
      "Nimm an der öffentlichen Frostkarte teil und sieh, wie dein kältester Fühler im Vergleich zu anderen ProbeHarbor-Haushalten in deiner Stadt abschneidet: nur anonymisierte Durchschnittswerte, keine Adresse und keine Gerätenamen.",
    optIn: "In den Haushaltseinstellungen teilnehmen",
    viewMap: "Karte ansehen",
  },
  multiProperty: {
    title: "Mehr als ein Objekt?",
    body: "Pro unterstützt bereits mehrere Haushalte in einem Konto: Füge ein zweites Objekt, eine Mietwohnung oder eine Werkstatt hinzu und wechsle im Dashboard zwischen ihnen. Portfolio hebt die Obergrenze an Objekten für größere Vermieter an.",
    add: "Weiteres Objekt hinzufügen",
    portfolio: "Portfolio für Vermieter",
  },
  alertMoment: {
    labels: {
      freeze: "Frostalarm",
      leak: "Leckalarm",
      forecast: "Frostprognose",
    },
    titles: {
      freeze: "Dein Frostalarm vom {when} ging nur per E-Mail raus",
      leak: "Dein Leckalarm vom {when} ging nur per E-Mail raus",
      forecast: "Deine Frostprognose vom {when} ging nur per E-Mail raus",
    },
    body: "E-Mails gehen nachts leicht unter. Pro schickt den nächsten Frost- oder Leckalarm per SMS aufs Handy, auch während der Ruhezeiten.",
    getSms: "SMS-Alarme mit Pro",
    comparePlans: "Tarife vergleichen",
    notNow: "Nicht jetzt",
  },
  coldSnap: {
    title: "Checkliste für die Kältewelle",
    body: "Prognose oder Außentemperatur sehen kalt aus. Schnelle Schritte im Haushalt, während die Frostalarme die Fühler überwachen.",
    forecastOffHtml:
      'Die Frostwarnung per Prognose ist aus. <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Schalte sie ein</a>, damit du gewarnt wirst, bevor die Tiefstwerte draußen deinen Schwellenwert erreichen.',
    memberHtml:
      'Prognose-Alarme für Kältewellen gibt es ab Member. <a class="text-link" href="/dashboard/plans">Tarife vergleichen</a>',
    checklist: [
      "Lass Wasserhähne an Außenwänden tropfen, wenn Zuleitungen durch kalte Räume laufen.",
      "Prüfe die Türdichtungen (Garage, Werkstatt, Kriechkellerzugang) und schließ offen stehende Türen.",
      "Dämme Außenwasserhähne und nimm Gartenschläuche ab.",
      "Prüfe, ob Frostalarme aktiv sind, und schick einen Testalarm, wenn das schon länger her ist.",
      "Stell sicher, dass ein Fühler in der kältesten Ecke nahe an Rohren oder Lagergut sitzt.",
    ],
    seasonGuide: "Kompletter Frostsaison-Ratgeber",
    playbook: "Leitfaden für Kältewellen",
    essentials: "Wichtigste Alarmeinstellungen",
    sendTest: "Testalarm senden",
  },
};

export default de;
