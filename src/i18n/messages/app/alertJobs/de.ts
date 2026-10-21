import type { AlertJobsMessages } from "./en";

const de: AlertJobsMessages = {
  freeze: {
    confirm: {
      eyebrow: "Frostwarnungen",
      title: "Bestätige deine Frostwarnungen",
      intro: "Klick unten, dann schicken wir dir am Nachmittag vor jeder Frostnacht in {place} eine E-Mail.",
      ignore: "Wenn du das nicht angefordert hast, ignoriere diese Nachricht. Ohne Bestätigung bekommst du nichts.",
      cta: "Frostwarnungen bestätigen",
      footerNote:
        "Du erhältst diese E-Mail, weil jemand diese Adresse in der Rohrfrost-Vorhersage von ProbeHarbor eingegeben hat.",
      subject: "Frostwarnungen für {place} bestätigen",
    },
    errors: {
      invalidEmail: "Gib eine gültige E-Mail-Adresse ein.",
      pickLocation: "Wähle zuerst einen Ort.",
      generic: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    },
    alert: {
      subjectHigh: "Hohes Rohrfrost-Risiko heute Nacht in {place}: Tiefstwert {low}",
      subjectWatch: "Frost heute Nacht in {place}: Tiefstwert {low}",
      eyebrow: "Frostwarnung",
      titleHigh: "Hohes Frostrisiko heute Nacht in {place}",
      titleWatch: "Frost heute Nacht in {place}",
      bullets: [
        "Öffne die Schranktüren unter Spülen an Außenwänden.",
        "Halte das Garagentor geschlossen.",
        "Lass einen Wasserhahn an einer ungeschützten Leitung tropfen.",
        "Wisse, wo dein Hauptwasserhahn ist.",
      ],
      alsoLater: "Auch später in dieser Woche Frost: {nights}.",
      laterNight: "{date} (Tiefstwert {low})",
      outdoorNote:
        "Das ist die Vorhersage für draußen. Eine angebaute oder gedämmte Garage kann deutlich wärmer bleiben, eine zugige fast genauso kalt werden. Ein Fühler für 25 US$ direkt am Rohr zeigt dir, was im Bereich wirklich passiert, und warnt dich, bevor es friert.",
      ctaForecast: "Vorhersage für 5 Nächte ansehen",
      ctaProbe: "Fühler in deine Garage setzen",
      footerNote:
        "Wir schreiben dir am Nachmittag vor der ersten Frostnacht einer Kältewelle und vor jeder Nacht mit −7 °C (20 °F) oder kälter. Vorhersage vom National Weather Service (USA).",
    },
    night: {
      high: "Tiefstwert {low}, auf oder unter der Marke von {mark}, ab der Rohre in unbeheizten Garagen, Kriechkellern und Dachböden häufig gefährdet sind.",
      watch: {
        one: "Etwa {count} Stunde unter dem Gefrierpunkt, Tiefstwert {low}. Ungeschützte Rohre an Außenwänden, nahe Garagentoren oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
        other:
          "Etwa {count} Stunden unter dem Gefrierpunkt, Tiefstwert {low}. Ungeschützte Rohre an Außenwänden, nahe Garagentoren oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
      },
      above: "Bleibt über dem Gefrierpunkt (Tiefstwert {low}).",
      wind: "Wind bis {wind} bei Frost entzieht ungeschützten Rohren schneller Wärme.",
      nextDay: "Auch der nächste Tag bleibt unter dem Gefrierpunkt, unbeheizte Bereiche erwärmen sich also nicht wieder.",
    },
  },
  stuck: {
    faultReset: "der Wert, den ein DS18B20 nach einem Reset meldet (oft schwache Stromversorgung oder ein langes Kabel)",
    faultDisconnected: "der Wert, den die DS18B20-Bibliothek meldet, wenn der Fühler nicht verbunden ist",
    faultMessage:
      "{label} zeigt {value} °F, {why}. Prüfe die Verkabelung des Fühlers; das ist keine echte Temperatur.",
    faultDetail: "{label} zeigt {value} °F (Sensorfehler), Verkabelung prüfen",
    stuckMessage:
      "{label} meldet seit {span} genau {value} °F. Der Fühler hängt möglicherweise oder die Platine sendet einen alten Wert erneut; Frost könnte hier unbemerkt bleiben.",
    stuckDetail: "{label} hängt seit {span} bei {value} °F",
    spanHours: { one: "{count} Stunde", other: "{count} Stunden" },
    spanOverDay: "über einem Tag",
  },
  portfolio: {
    title: "Heute gefährdete Objekte ({count})",
    intro: {
      one: "Vermieter-Übersicht: {count} Objekt liegt auf oder unter der Frostgrenze:",
      other: "Vermieter-Übersicht: {count} Objekte liegen auf oder unter der Frostgrenze:",
    },
    line: "{name}: {temp} °F (Schwellenwert {threshold} °F)",
  },
  tenant: {
    greetingName: "Hallo {name},",
    greeting: "Hallo,",
    intro: "Die Hausverwaltung von {household} hat uns gebeten, dir eine Frostwarnung weiterzuleiten:",
    eyebrow: "Weitergeleiteter Alarm für Mieter",
    footerNote:
      "Du erhältst diese E-Mail, weil der Eigentümer dich als Ansprechpartner vor Ort eingetragen hat. Das ist kein vollständiger Dashboard-Zugang.",
    errors: {
      invalidEmail: "Ungültige E-Mail-Adresse.",
      notAuthorized: "Du darfst den Mieter nicht benachrichtigen.",
      noContact: "Kein Mieterkontakt eingerichtet.",
      deliveryFailed: "E-Mail konnte nicht zugestellt werden.",
    },
  },
  feedUptime: {
    title: "Feed nicht erreichbar",
  },
  playbook: {
    titleFallback: "Ablauf: {title}",
  },
  ackPlaybook: {
    notFound: "Alarm nicht gefunden.",
    noHousehold: "Kein Haushalt für die Weiterleitung an Mieter.",
    defaultPropertyName: "Objekt",
    relayFailed: "Weiterleitung an Mieter fehlgeschlagen.",
    noWebhook: "Kein ausgehender Webhook eingerichtet.",
    ackFailed: "Alarm konnte nicht bestätigt werden.",
    raised: "Fehlalarm erledigt: Frost-Schwellenwert auf {value} °F erhöht und Alarme 24 h pausiert.",
    falseAlarmTip: "Als Fehlalarm markiert: Alarme 24 h pausiert. Vorschlag: {tip}. Öffne {href}",
    results: {
      ack: "Alarm als erledigt markiert.",
      snooze_1h: "Alarm erledigt: Frostalarme für 1 Stunde pausiert.",
      snooze_4h: "Alarm erledigt: Frostalarme für 4 Stunden pausiert.",
      snooze_24h: "Alarm erledigt: Frostalarme für 24 Stunden pausiert.",
      false_alarm:
        "Als Fehlalarm markiert: Alarme 24 h pausiert. Prüfe die Position des Fühlers, wenn das öfter passiert.",
      raise_threshold: "Fehlalarm erledigt und Frost-Schwellenwert erhöht.",
      notify_tenant: "Alarm erledigt: Mieterkontakt per E-Mail informiert.",
      webhook_ping: "Alarm erledigt: ausgehender Webhook benachrichtigt.",
    },
  },
  telegram: {
    help: "Befehle: /status [Name], /snooze [Stunden], /vacation [Tage], /help",
    commandsDisabled: "Telegram-Befehle sind deaktiviert, bis du unter Alarme eine Chat-ID speicherst.",
    snoozed: {
      one: "Alarme für {count} Stunde pausiert. Frost- und Leckalarme kommen trotzdem.",
      other: "Alarme für {count} Stunden pausiert. Frost- und Leckalarme kommen trotzdem.",
    },
    vacation: {
      one: "Urlaubsmodus für {count} Tag aktiviert. Frost- und Leckalarme kommen trotzdem.",
      other: "Urlaubsmodus für {count} Tage aktiviert. Frost- und Leckalarme kommen trotzdem.",
    },
    noHousehold: "Kein aktiver Haushalt.",
    open: "OFFEN",
    closed: "geschlossen",
    noMatch: "Keine Sensoren passend zu „{query}“.",
    noReadings: "Noch keine Messwerte.",
  },
  events: {
    notFound: "Alarm nicht gefunden.",
    noUnhandled: "Keine offenen Alarme.",
  },
  ackPage: {
    title: "Alarm bestätigen",
    heading: "Alarm bestätigen?",
    body: "Bestätige, dass du dich um diesen Frost- oder Wasseralarm kümmerst. Automatische Link-Vorschauen lösen diese Aktion nicht aus.",
    button: "Ja, als erledigt markieren",
    cancel: "Abbrechen",
    resultInvalid: "Bestätigungslink ungültig oder abgelaufen.",
    resultNone: "Keine offenen Alarme zum Bestätigen.",
    resultHandled: "Alarm als erledigt markiert.",
  },
  snoozePage: {
    title: "Alarme pausieren",
    heading: "Alarme pausieren?",
    body: "Bestätige, dass Schwellenwert-Meldungen pausiert werden. Kritische Frost- und Wasseralarme können trotzdem kommen. Automatische Link-Vorschauen lösen diese Aktion nicht aus.",
    button: "Ja, pausieren",
    cancel: "Abbrechen",
    missingToken: "Token fehlt",
    resultInvalid: "Pausier-Link ungültig oder bereits verwendet.",
    resultExpired: "Pausier-Link abgelaufen.",
    resultSnoozed: { one: "Alarme für {count} Stunde pausiert.", other: "Alarme für {count} Stunden pausiert." },
  },
};

export default de;
