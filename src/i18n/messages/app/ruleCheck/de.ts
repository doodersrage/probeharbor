import type { RuleCheckMessages } from "./en";

const de: RuleCheckMessages = {
  run: "Gespeicherte Regeln jetzt prüfen",
  hint: "Nutzt die neuesten Messwerte und deine gespeicherten Regeln (zuerst speichern). Sendet nichts.",
  client: {
    disabled: "Aus: Diese Regel ist deaktiviert.",
    noConditions: "Hat keine Bedingungen und löst daher nie aus.",
    noneTrue: "Würde nicht auslösen: Keine ihrer Bedingungen ist erfüllt.",
    notAllTrue: "Würde nicht auslösen: Mindestens eine Bedingung ist nicht erfüllt.",
    alertsOff: "Trifft zu, aber Alarme sind ausgeschaltet, daher würde nichts gesendet.",
    cooldown: "Trifft zu, aber vor Kurzem ging bereits ein Regelalarm raus; der nächste kann nach {time} gesendet werden.",
    fires: "Trifft zu: Die nächste Alarmprüfung (alle paar Minuten) würde ihn senden, außer Alarme sind pausiert oder es sind Ruhezeiten.",
    checking: "Wird geprüft…",
    noRules: "Noch keine gespeicherten Regeln. Füge oben eine hinzu und speichere.",
    checkedAt: "Geprüft um {time}.",
    untitled: "Unbenannte Regel",
    or: "ODER ",
    and: "UND ",
    failed: "Regeln konnten gerade nicht geprüft werden. Versuche es in einer Minute erneut.",
    conditions: {},
  },
};

export default de;
