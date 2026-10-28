import type { AlertsMessages } from "./en";

const de: AlertsMessages = {
  page: {
    title: "Alarme",
    subtitle: "Was ausgelöst hat und wer benachrichtigt wurde. In den Einstellungen legst du fest, wann und wie alarmiert wird.",
    tabsLabel: "Alarm-Bereiche",
    tabActivity: "Aktivität",
    tabActivityCount: "Aktivität ({count})",
    tabSettings: "Einstellungen",
  },
  notices: {
    restored:
      "Frühere Alarmeinstellungen wiederhergestellt. Deine vorherige Version findest du unter „Letzte Änderungen“, falls du sie zurückhaben willst.",
    savedIncomplete:
      "Alarmeinstellungen gespeichert. Bei einigen aktivierten Kanälen fehlt das Ziel; sie werden übersprungen, bis es eingetragen ist.",
    saved: "Alarmeinstellungen gespeichert.",
    invalidWebhookUrl:
      "Eine deiner Webhook-URLs ist keine gültige https://-Adresse oder zeigt auf ein privates Netzwerk. Korrigiere sie und speichere erneut.",
    weakTelegramSecret:
      "Das Telegram-Webhook-Secret muss mindestens 16 Zeichen lang sein – es ist der einzige Schutz für diesen Endpunkt. Verwende einen längeren Zufallswert und speichere erneut.",
    restoreFailed: "Diese Einstellungen konnten nicht wiederhergestellt werden. Es wurde nichts geändert.",
    saveFailed: "Alarmeinstellungen konnten nicht gespeichert werden.",
    testSentSkipped: "Test gesendet über {sent}. Unvollständig und übersprungen: {skipped}.",
    testSentVia: "Testalarm gesendet über {channels}.",
    yourEnabledChannels: "deine aktivierten Kanäle",
    testIncomplete:
      "Kein Kanal konnte senden: Aktiviere einen Kanal, trage sein Ziel ein und versuche es erneut.",
    testNoChannels: "Keine Alarmkanäle aktiviert. Schalte mindestens einen Kanal ein, speichere und versuche es erneut.",
    testFailed: "Testalarm konnte nicht gesendet werden. Prüfe die Kanaleinstellungen und versuche es erneut.",
    ackOk: "Alarm als erledigt markiert.",
    ackError: "Alarm konnte nicht bestätigt werden.",
  },
  status: {
    label: "Status:",
    on: "An",
    off: "Aus",
    lastAlert: "Letzter Alarm {age}",
    noAlertsYet: "Noch keine Alarme gesendet",
  },
  activity: {
    heading: "Letzte Alarmaktivität",
    subtitle: "Protokoll der zugestellten und übersprungenen Kanäle.",
    kindLabel: "Art",
    kinds: {
      all: "Alle",
      freeze: "Frost",
      flood: "Wasserschaden",
      forecast: "Vorhersage",
      threshold: "Schwellenwert",
      test: "Test",
    },
    unhandledOnly: "Nur unerledigte",
    filter: "Filtern",
    clear: "Zurücksetzen",
    confirmAckAll: "Alle {count} unerledigten Alarme als erledigt markieren?",
    markAllHandled: "Alle {count} als erledigt markieren",
    newer: "Neuere",
    older: "Ältere",
  },
  claims: {
    heading: "Nachweise für einen Versicherungsfall nötig?",
    body: "Exportiere nach einem echten Frost- oder Leckereignis im Verlauf eine datierte Zusammenfassung mit den passenden Messwerten.",
    open: "Schadensmappe öffnen",
    seePro: "Schadensmappe ansehen (Pro)",
  },
  testSent: {
    heading: "Alarme funktionieren",
    body: "Zustellweg bestätigt. Ein paar sinnvolle nächste Schritte, wenn du schon hier bist:",
    shareFamily: "Live-Link mit der Familie teilen",
    shareLinks: "Freigabelinks",
    downloadClaims: "Schadensmappe herunterladen",
    claimsEvidence: "Nachweismappe für Schadensfälle",
    comparePlans: "Tarife vergleichen",
  },
  testCard: {
    heading: "Testalarm senden",
    bodyRepeat:
      "Sendet eine Beispielnachricht an jeden Kanal, den du gerade aktiviert hast. Speichere zuerst, wenn du die Einstellungen eben geändert hast.",
    bodyFirst:
      "Bestätige die Zustellung einmal, bevor du dich auf Frostwarnungen verlässt. Schalte oben mindestens einen Kanal ein, speichere und sende dann.",
    sendNow: "Jetzt Test senden",
  },
  history: {
    heading: "Letzte Änderungen",
    body: "Jedes Speichern, neueste zuerst. „Wiederherstellen“ setzt die Einstellungen auf den Stand direkt vor diesem Speichern zurück; deine aktuelle Version bleibt hier ebenfalls erhalten.",
    confirmUndo: "Deine letzte Änderung an den Alarmeinstellungen rückgängig machen?",
    confirmRestore:
      "Alarmeinstellungen auf den Stand vor dieser Änderung zurücksetzen? Spätere Änderungen werden ebenfalls rückgängig gemacht.",
    undo: "Rückgängig",
    restoreBefore: "Auf Stand davor zurücksetzen",
  },
  list: {
    empty:
      "Noch keine Alarmereignisse für diesen Filter. Nach Frost, Wasserschaden oder einem Test erscheinen hier Einträge mit Begründung und Aktionen gegen Fehlalarme.",
    sent: "Angenommen von {channels}",
    skipped: "Übersprungen: {channels}",
    why: "Warum",
    suggested: "Vorschlag: {tip}.",
    suggestedFix: "Vorgeschlagene Lösung: {tip}.",
    open: "Öffnen",
    raiseThreshold: "Frost-Schwellenwert um 1,1 °C (2 °F) anheben",
    checkPlacement: "Platzierung des Fühlers prüfen",
    handled: "Erledigt",
    recovered: "Normalisiert",
    expired: "Abgelaufen",
    showMore: {
      one: "{count} weiteren ähnlichen anzeigen (zurück bis {oldest})",
      other: "{count} weitere ähnliche anzeigen (zurück bis {oldest})",
    },
    hideSimilar: { one: "{count} ähnlichen ausblenden", other: "{count} ähnliche ausblenden" },
    caption: "Letzte Ereignisse zu Alarmzustellung und Bestätigung",
    columns: {
      when: "Wann",
      kind: "Art",
      title: "Titel",
      why: "Warum",
      sent: "Gesendet",
      skipped: "Übersprungen",
      ack: "Bestätigung",
    },
  },
  ack: {
    imOnIt: "Ich kümmere mich",
    imOnItTitle: "Stoppt wiederholte Alarme, bis der Bereich wieder über deinem Schwellenwert liegt",
    more: "Mehr",
    snooze1h: "Erledigt & 1 Std. pausieren",
    snooze4h: "Erledigt & 4 Std. pausieren",
    snooze24h: "Erledigt & 24 Std. pausieren",
    falseAlarm: "Fehlalarm (24 Std. pausieren)",
    raiseThreshold: "Fehlalarm + Schwellenwert um 1,1 °C (2 °F) anheben",
    notifyTenant: "Erledigt & Mieter per E-Mail informieren",
    webhookPing: "Erledigt & Webhook anpingen",
  },
  tipsCard: {
    summary: "Zu viele Alarme? Tipps gegen Fehlalarme",
    intro:
      "Frost-Fehlalarme liegen meist an Platzierung oder Schwellenwert. Wasserschaden-Fehlalarme an Spritzwasser, Kondenswasser oder Pumpenzyklen im Pumpensumpf: Nasse Kontakte lösen auch während einer Pause aus.",
    freeze: "Frost",
    flood: "Wasserschaden / Leck",
  },
  tips: {
    placement: {
      title: "Platzierung des Fühlers prüfen",
      detail:
        "Fühler an Torschienen, neben Abluftventilatoren oder an sonnenbeschienenen Wänden schwanken stark und lösen Frostalarme aus, die die Rohre nie erleben. Setze sie näher an die kälteste Leitung oder eine Ecke der Bodenplatte.",
      hrefLabel: "Fühler-Simulator",
    },
    unplugged: {
      title: "Keine Daten heißt oft: ausgesteckt",
      detail:
        "Wenn ein Fühler stundenlang nichts sendet, denke zuerst an Strom oder WLAN, nicht an Frost. Aktiviere Ausfallalarme und prüfe unter Geräte, ob der ESP noch POSTs sendet.",
      hrefLabel: "Anleitung zu veralteten Messwerten",
    },
    threshold: {
      title: "Schwellenwert um ein, zwei Grad anheben",
      detail:
        "Ein Schwellenwert von 0 °C (32 °F) löst bei jedem kurzen Luftzug aus. Viele Haushalte nutzen 1–2 °C (34–36 °F), um vor der Eisbildung zu handeln, ohne bei jedem Türöffnen geweckt zu werden.",
      hrefLabel: "Alarm-Grundeinstellungen",
    },
    snooze: {
      title: "Ruhe, während du es behebst",
      detail:
        "Du arbeitest in einem kalten Raum? Tippe im Alarm auf „Ich kümmere mich“: Er wiederholt sich nicht, solange dieser Frost anhält. Pausieren stellt Routine-Alarme stumm, aber Frost-, Wasserschaden- und Stromausfall-Alarme kommen immer durch. Bei Fehlalarmen den Schwellenwert anheben oder den Fühler neu setzen.",
    },
    splash: {
      title: "Spritzwasser und Kondenswasser",
      detail:
        "Ein Kontakt unter einem Warmwasserspeicher oder Waschbecken kann durch Kondenswasser oder einen schon versiegten Tropfen kurz nass melden. Befestige ihn am Boden der Auffangwanne, weg von Tropfstellen, und trockne ihn nach einem Fehlalarm ab.",
    },
    sump_cycle: {
      title: "Pumpenzyklus im Pumpensumpf ≠ Leck",
      detail:
        "Ein steigender Pegel im Pumpensumpf bei Unwetter ist normal. Nutze einen Wasserschaden-/Leck-Kontakt für stehendes Wasser und eine eigene level_above-Regel nur, wenn du früh vor einem Pumpenausfall gewarnt werden willst, nicht bei jedem Pumpenzyklus.",
      hrefLabel: "Alarmregeln",
    },
    test_wet: {
      title: "Mit feuchtem Tuch testen, dann trocknen",
      detail:
        "Wasserschaden-Alarme lösen bei Nässe automatisch aus (auch im Urlaub). Trockne den Kontakt nach einem Platzierungstest, damit er nicht über Nacht auf „nass“ hängen bleibt.",
    },
  },
  staleProbes: {
    one: "{count} Fühler wirkt veraltet: vermutlich ausgesteckt, WLAN offline oder Akku leer. Prüfe Stromversorgung und Geräte, bevor du von Frost ausgehst.",
    other:
      "{count} Fühler wirken veraltet: vermutlich ausgesteckt, WLAN offline oder Akku leer. Prüfe Stromversorgung und Geräte, bevor du von Frost ausgehst.",
  },
  wetFlood: {
    one: "{count} Wasserschaden-/Leck-Sensor ist gerade nass: Wasserschaden-Alarme ignorieren Pause und Urlaubsmodus. Prüfe Auffangwanne, Pumpensumpf oder Zuleitung.",
    other:
      "{count} Wasserschaden-/Leck-Sensoren sind gerade nass: Wasserschaden-Alarme ignorieren Pause und Urlaubsmodus. Prüfe Auffangwanne, Pumpensumpf oder Zuleitung.",
  },
  why: {
    probeAt: "{probe} bei {temp} °F",
    probeAtUnnamed: "Fühler bei {temp} °F",
    threshold: "Schwellenwert {temp} °F",
    outdoor: "außen {temp} °F",
    deltaT: "ΔT {delta} °F",
    runway: "~{hours} Std. Vorlauf",
    doorOpen: "Tür in der Nähe offen",
  },
  referral: {
    heading: "Verschenke einen Winter Überwachung",
    introHtml: "Teile deinen Link: Neue Anmeldungen bekommen <strong>7 zusätzliche Tage</strong> Pro-Testphase.",
    bonusDays: {
      one: "Du hast {count} Bonus-Testtag durch erfolgreiche Empfehlungen.",
      other: "Du hast {count} Bonus-Testtage durch erfolgreiche Empfehlungen.",
    },
    earn: "Du bekommst +7 Testtage, wenn ein geworbener Freund Pro abonniert.",
    howGifting: "So funktioniert das Verschenken",
    loading: "Empfehlungslink wird geladen…",
    copyInvite: "Einladungslink kopieren",
    copied: "Kopiert!",
    copyFailed: "Kopieren fehlgeschlagen",
    unavailable: "Empfehlungslink nicht verfügbar.",
    friendsJoined: {
      one: "{count} Freund hat sich über deinen Link angemeldet.",
      other: "{count} Freunde haben sich über deinen Link angemeldet.",
    },
    noSignups: "Noch keine Anmeldungen – teile den Link oben.",
  },
};

export default de;
