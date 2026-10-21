
/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */
import type { AccountsAndDashboardMessages } from "./en";

const de: AccountsAndDashboardMessages = {
  introHtml:
    'Mit einem Konto schaltest du Personalisierung, Geräte, Verlauf, Alarme und optionale kostenpflichtige Funktionen frei. Angemeldet behält die Oberfläche die Objekt-Navigation (Raumauswahl, Tarif, Schnelllinks), während jede Seite fokussiert bleibt: <a class="text-link" href="/dashboard">Overview</a> für Risiken und Trends, <a class="text-link" href="/dashboard/live">Live</a> für aktuelle Messwerte, Devices / Alerts / History / Share für Einrichtung und Betrieb.',
  screenshots: [
    "Overview startet mit dem Raumstatus, Schnellaktionen und einer prognosebasierten Zeit bis zum Frost.",
    "Status-Leiste: letzter Messwert, Sensoren, Feeds, Alarme und Frostabstand. Pinne weitere an, etwa ΔT, Fühlerstreuung und Kondensation.",
    "Devices: Zustandswert, zuletzt gesehen, aktuelle Sensorwerte und Feed-Zustand. Unter Setup findest du Push, Pull, Home Assistant und MQTT.",
    "History-Kurven mit Frostlinie: Luftfeuchte und Taupunkt werden eingeblendet, wenn rel. Luftfeuchte vorliegt.",
  ],
  account: {
    title: "Konto anlegen",
    bodyHtml:
      "Die Registrierung läuft per E-Mail und Passwort über Supabase Auth. Passwort-Zurücksetzen und (sofern in Supabase aktiviert) OAuth-Anbieter wie Google, GitHub oder Discord stehen auf der Anmeldeseite zur Verfügung. Neue Nutzer starten im Free-Tarif mit einem Standardhaushalt.",
  },
  checklist: {
    title: "Checkliste für den Einstieg",
    bodyHtml:
      "Bis du die Grundeinstellungen abgeschlossen hast (ein Gerät oder Feed, Frost-E-Mail und ein Testalarm) – oder den Hinweis schließt –, bleibt Overview in einem ruhigen <strong>Ersteinrichtungs</strong>-Modus: Raumstatus und Einrichtungsschritte, ohne vollständige Status-Leiste oder Insights-Karten. Eine kurze Checkliste führt durch das Verbinden des Geräts, das Bestätigen der Messwerte unter Live und danach optionale Alarme und Haushaltseinladungen. Sind die Kern- und optionalen Schritte erledigt oder schließt du sie, verschwindet die Checkliste; mit <strong>Show checklist</strong> holst du sie zurück.",
  },
  overview: {
    title: "Overview (Simple vs. Insights)",
    bodyHtml:
      'Nach der Ersteinrichtung öffnet <a class="text-link" href="/dashboard">Overview</a> mit dem Risikostatus von Garage bzw. Raum und einer Status-Leiste: letzter Messwert, Sensoren, Feeds, Alarme, Froststunden (mit Gradstunden), kältester Abstand über deiner Frostschwelle, ΔT innen−außen, Fühlerstreuung, Kondensationsstunden und Feed-Zustand, wenn Pull-Feeds vorhanden sind. Ein <strong>Frost-Countdown</strong> steht in Simple und Insights unter dem Raumstatus: Er zeigt, wann diese Garage, Werkstatt oder dieser Kriechkeller voraussichtlich deine Frostschwelle erreicht, berechnet aus der Verzögerung des Raums gegenüber der Außenprognose. Schalte <strong>Insights</strong> ein für Risikonächte, Wochenvergleich, Heizungsauswertung, Zusammenhang von Tür und Strom, Bewegung, Akku-/RSSI-Trends, Luftqualität, Energie und Wasser/Füllstand. Das 7-Tage-Fühlerdiagramm (Simple und Insights) kann Luftfeuchte in % und Taupunkt (°F) zeigen, wenn die Messwerte rel. Luftfeuchte enthalten; dieselben Steuerelemente gibt es unter History. Live-Karten findest du unter <a class="text-link" href="/dashboard/live">Live</a>, nicht in Overview.',
  },
  live: {
    title: "Live-Werte",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> ist nach der Anmeldung der Ort für aktuelle Fühlerkarten, das Außenwetter (falls aktiviert) und Offline-Warnungen. Nutze Live nach einer Übertragung oder einem Pull-Abruf; nutze Overview für Frostrisiko und Trends.',
  },
  devices: {
    title: "Geräte & Sensoren",
    introHtml:
      'Unter <a class="text-link" href="/dashboard/devices">Devices</a> dient <strong>Setup</strong> zum Verbinden der Hardware und <strong>Status</strong> zur Zustandsüberwachung (zuletzt gesehen, Akku, RSSI). Du kannst:',
    itemsHtml: [
      "<strong>Push-Geräte</strong>. ESP/Arduino sendet JSON per POST an eine eindeutige Ingest-URL. Kopiere den Schlüssel aus dem 30-Minuten-Hinweis; nutze später <strong>Reveal ingest key</strong> oder <strong>Rotate key</strong>. Sensoren werden beim ersten POST automatisch importiert; benenne die Bezeichnungen danach unter Devices um.",
      "<strong>Pull-Feeds</strong>: Reiter <strong>Pull feeds</strong> mit HTTPS-JSON-URLs, die wir alle 15 Minuten abrufen. <strong>Save pull setup</strong> importiert die Fühlerschlüssel automatisch; SenML- und Home-Assistant-REST-JSON werden automatisch erkannt, wenn der Stamm fehlt.",
    ],
    stepsHtml:
      'Schritt für Schritt: <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Wenn die Sensoren zugeordnet sind, prüfe die Übertragung (oder warte auf den nächsten Pull) und öffne dann <a class="text-link" href="/dashboard/live">Live</a>, um die Live-Werte zu bestätigen. Payload-Beispiele: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a>.',
  },
  display: {
    title: "Anzeigeeinstellungen",
    bodyHtml:
      'Wähle, ob Live die Fühler, das Außenwetter oder beides zeigt. Die Einstellungen werden in deinen Profildaten gespeichert und gelten sofort nach dem Speichern unter <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Verlauf",
    bodyHtml:
      "Der seitenweise Verlauf listet Temperatur- und Luftfeuchte-Momentaufnahmen deines Haushalts. Filtere nach Feed, Fühler und Zeitraum; setze die Filter zurück, wenn eine Abfrage keine Zeilen liefert. Das Durchsuchen ist für alle angemeldeten Nutzer enthalten; der CSV-Download erfordert Member/Pro (oder Admin). Die Hintergrunderfassung läuft per Cron alle <strong>15 Minuten</strong> (plus jede erfolgreiche Push-Übertragung). Ein Neuladen von Live kann auch die Live-Karten aktualisieren.",
  },
  activity: {
    title: "Haushaltsaktivität",
    bodyHtml:
      'Eigentümer und Verwalter sehen unter <a class="text-link" href="/dashboard/household">Household</a> und <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> ein Protokoll <strong>Recent activity</strong>: Freigabelinks, gespeicherte Alarme, Geräteübertragungen und <strong>angezeigte Ingest-Schlüssel</strong> (protokolliert, wenn jemand Reveal ingest key nutzt).',
  },
  alerts: {
    title: "Alarme",
    bodyHtml:
      'Starte mit <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (Frostschwelle in °F + E-Mail). Nach deinem ersten Ingest-POST kann Devices die Grundeinstellungen auch direkt speichern, ohne die Einrichtung zu verlassen. Kostenlose Tarife enthalten E-Mail, Push und Discord; Pro schaltet SMS und ausgehende Webhooks frei. Aktiviere einen Kanal erst, wenn sein Ziel eingetragen ist: Unvollständige Kanäle werden übersprungen. Mit <strong>Send test now</strong> siehst du, welche Kanäle tatsächlich ausgelöst haben.',
  },
  households: {
    title: "Haushalte & Freigabelinks",
    bodyHtml:
      'Lade Familienmitglieder per E-Mail über <a class="text-link" href="/dashboard/household">Household</a> ein. Mitglieder teilen Geräte und Verlauf dieses Haushalts. Jeder Tarif enthält einen <a class="text-link" href="/dashboard/share/links">Familien-Live-Link</a> für Personen ohne Konto. Pro ergänzt umfassendere Freigabebereiche (Verlauf/Metriken), Ablaufzeiten für Gäste und jederzeitigen Widerruf.',
  },
  plans: {
    title: "Tarife",
    itemsHtml: [
      "<strong>Free</strong>: Live-Sensoren, Geräte (begrenzt), Verlauf ansehen, Alarme per E-Mail/Discord, ein Familien-Live-Link.",
      "<strong>Member</strong>: CSV-Export.",
      "<strong>Pro</strong>: höhere Gerätelimits, SMS, ausgehende Webhooks, erweiterte Freigabebereiche, Nachweispaket für Versicherungsfälle.",
    ],
    upgradeHtml: "Wechsle den Tarif über die Karte Plans im Dashboard oder auf der Seite Alerts.",
  },
  admin: {
    title: "Nur für Admins",
    itemsHtml: [
      "<strong>User manager</strong>: Konten prüfen und Admin-Rechte vergeben oder entziehen.",
      "<strong>Contact submissions</strong>: Nachrichten aus dem öffentlichen Kontaktformular lesen.",
      "<strong>Jobs</strong>: Einblick in Betriebsjobs, wenn aktiviert.",
    ],
  },
  firstPath: {
    title: "Empfohlener Einstieg",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Konto anlegen</a>.',
      'Mit einem Klick <strong>Create push device</strong> unter <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (standardmäßig „Workshop probe“ genannt).',
      "Einen Messwert per POST senden: Sensoren werden automatisch importiert; dann Frostschwelle in °F + E-Mail unter Devices oder Alerts → When to alert festlegen und einen Test senden.",
      'Karten unter <a class="text-link" href="/dashboard/live">Live</a> prüfen, dann den Raumstatus in Overview (Status-Leiste und Insights werden nach den Grundeinstellungen freigeschaltet).',
      "Optional Haushaltsmitglieder einladen und einen Familien-Live-Link teilen.",
    ],
  },
};

export default de;
