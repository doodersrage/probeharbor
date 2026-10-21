
/** /about/data-flow body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Jede Zahl auf der Startseite durchläuft mehrere Ebenen. Wer diese Kette versteht, findet veraltete Messwerte, fehlende Fühler oder Lücken im Verlauf schneller.",
  step1Title: "Schritt 1. Messen vor Ort",
  step1Html:
    'Die Fühler messen Temperatur und Luftfeuchtigkeit. Der Arduino-Sketch fragt sie alle paar Sekunden ab, verwirft offensichtliche Ausreißer und baut im Speicher eine JSON-Struktur auf. Details: <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a> und <a class="text-link" href="/about/temperature-probes">Temperaturfühler</a>.',
  step2Title: "Schritt 2. JSON veröffentlichen",
  step2Html:
    'Die Platine oder ein Relay in der Nähe stellt JSON über HTTPS bereit. Ein Python-FastAPI-Dienst kann die Antworten in Redis zwischenspeichern, damit das offene Internet nie direkt auf den Hausanschluss zugreift: siehe <a class="text-link" href="/about/python-feeds">Python-Skripte und Feeds</a>.',
  jsonAlt: "JSON-Ansicht im Browser mit den Fühlerschlüsseln 0, 1 und avg mit Fahrenheit, Celsius und Luftfeuchtigkeit",
  jsonCaption: "Aufbau des Live-Feeds, den die Website verarbeitet, nachdem er das lokale Netz verlassen hat.",
  step3Title: "Schritt 3. Abruf und Anzeige auf der Website",
  step3Html:
    "Wenn du die Startseite lädst, ruft der Server jede konfigurierte Feed-URL ab, liest die Fühlerschlüssel aus und zeigt die Messwertkarten an. Angemeldete Nutzer laden ihre Feed- und Fühlerzuordnungen aus Supabase statt der Standardwerte. Wetterdaten nehmen parallel den Weg über OpenWeather, auf Wunsch mit deiner eigenen Stadt.",
  step4Title: "Schritt 4. Verlauf speichern",
  step4Html:
    'Wenn du angemeldet bist, schreibt jeder erfolgreiche Fühlerabruf Zeilen in Supabase: Feed-Name, Fühlerbezeichnung, Schlüssel, Temperaturen, Luftfeuchtigkeit und Zeitstempel. Gäste sehen weiterhin Live-Daten, ergänzen aber keinen Verlauf. Mehr dazu unter <a class="text-link" href="/about/historical-data">Nutzung der Verlaufsdaten</a>.',
  step5Title: "Schritt 5. Dashboard und Export",
  step5Html:
    'Die Verlaufstabelle zeigt diese Zeilen seitenweise an. Der CSV-Export liefert Admins und Abonnenten den vollständigen Datensatz. Stripe-Webhooks halten die Mitgliedschaft in der exportberechtigten Gruppe aktuell. Die Kontowerkzeuge sind unter <a class="text-link" href="/about/accounts-and-dashboard">Konten und Dashboard</a> beschrieben.',
  failuresTitle: "Mögliche Fehlerquellen",
  failures: [
    "Verkabelung oder Stromversorgung des Fühlers: serielle Logs am Arduino.",
    "Heimnetz oder Zertifikat: die Feed-URL per curl von einem Laptop im Mobilfunknetz (LTE) abrufen.",
    "Veralteter Relay-Cache: den Upstream-Abruf in fast-api-relay neu starten.",
    "Zuordnung im Dashboard: Tippfehler im Fühlerschlüssel verbergen Messwerte, selbst wenn das JSON gültig ist.",
    "Anmelde-Cookies: Der Verlauf wird nur bei angemeldeten Sitzungen gespeichert.",
  ],
};

export default de;
