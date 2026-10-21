/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */
import type { AndroidMessages } from "./en";

const de: AndroidMessages = {
  title: "Android-App",
  descriptionLive: "{brand} Android-Begleit-App bei Google Play: Live-Fühler, Frost- und Wasseralarme, MFA und Haushaltsfunktionen. Das Handy ist kein Sensor.",
  descriptionPwa: "Nutze {brand} auf Android per installierbarer Web-App; die native Play-App wird geprüft. Live-Fühler, Frost- und Wasseralarme. Das Handy ist kein Sensor.",
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "Android-App",
  schemaName: "{brand} für Android",
  kickerLive: "Google Play",
  kickerPwa: "Funktioniert schon heute · native App folgt",
  heading: "ProbeHarbor für Android",
  ledeLive:
    "Native Begleit-App bei Google Play: Live-Werte, Verlauf, Frost- und Wasseralarme, Geräte, MFA und Haushaltsfunktionen für dein ProbeHarbor-Konto.",
  ledePwa:
    "Nutze ProbeHarbor schon heute auf Android mit der installierbaren Web-App – gleiches Konto, Live-Werte und Alarme. Der native Play-Eintrag wird gerade geprüft; Selbst-Bauen oder Sideloading über GitHub ist optional für frühe Tester.",
  getOnPlay: "Jetzt bei Google Play",
  installPwa: "Web-App (PWA) installieren",
  githubSideload: "GitHub · selbst bauen oder sideloaden",
  sourceOnGithub: "Quellcode auf GitHub",
  requestLaunchNote: "Bei Play-Start benachrichtigen",
  imageAlt: "{brand}-Stimmungsfoto: Fühlerwerte auf Handy und Laptop neben einer Eigenbau-Installation an Kupferrohren prüfen",
  imageCaption:
    "Eigenbau-Stimmung: Handy und Laptop als Begleiter deiner eigenen Fühler. Die Bildschirme in dieser Illustration sind stilisiert und kein Produkt-Screenshot.",
  phoneTitle: "Was das Handy kann (und was nicht)",
  doesHtml:
    "<strong>Kann:</strong> sich bei deinem ProbeHarbor-Konto anmelden, Live-Kurven, den Verlauf und denselben prognosebasierten Countdown bis zum Frost wie in der Übersicht anzeigen, Alarme, Geräte und Haushaltseinstellungen verwalten und Frost- und Wasser-Pushmeldungen über Firebase Cloud Messaging empfangen.",
  doesNotHtml:
    "<strong>Kann nicht:</strong> die Temperatur mit dem Handy messen. Dein ESP/Arduino (oder deine JSON-Feeds) senden weiterhin an probeharbor.dev; die App ist ein Client über HTTPS.",
  bayBuddyNoteHtml:
    'Lieber ein kurzer Blick am Desktop? <a class="text-link" href="/bay-buddy">Bay Buddy</a> zeigt Frost- und Wasser-Stimmungen für einen Raum, ohne das volle Dashboard zu öffnen.',
  playTitle: "Google Play",
  playCopy:
    "Installiere die App aus dem Play Store mit demselben ProbeHarbor-Konto, das du im Web nutzt. Push-Alarme laufen auf Android über Firebase Cloud Messaging und sind in jedem Tarif enthalten.",
  openInPlay: "In Google Play öffnen",
  pwaTitle: "Android schon heute nutzen (PWA)",
  pwaCopy:
    "Installiere probeharbor.dev aus Chrome – Symbol auf dem Startbildschirm, Live-Werte und Alarme mit deinem bestehenden Konto. Der native Play-Eintrag folgt; Selbst-Bauen oder Sideloading über GitHub bleibt optional für frühe Tester.",
  pwaSteps: "PWA-Installationsschritte",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler verbinden.',
    "Die PWA installieren (oder die native App selbst bauen bzw. sideloaden) und mit denselben Zugangsdaten anmelden.",
    'Push-Alarme in den <a class="text-link" href="/dashboard/alerts">Alarmeinstellungen</a> aktivieren, um Frostmeldungen über Firebase zu erhalten, sobald die native App installiert ist.',
  ],
  pendingTitle: "Solange die Play-Prüfung läuft",
  pendingCopy:
    "Mit der PWA hast du schon jetzt den vollen Funktionsumfang auf dem Handy. Die native App verbindet sich mit demselben Konto, sobald der Eintrag live ist.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses Konto anlegen</a> und ein sendendes Gerät oder einen HTTPS-Feed verbinden.',
    'Frostschwellen in den <a class="text-link" href="/dashboard/alerts">Alarmeinstellungen</a> festlegen (E-Mail, Push und Chat in jedem Tarif; SMS mit Pro).',
    'In Chrome auf Android <a class="text-link" href="/about/install-pwa">die PWA installieren</a> – für eine Verknüpfung auf dem Startbildschirm und optional Web Push im Browser.',
    'Lieber eine E-Mail zum Start? <a class="text-link" href="/contact?topic=android">Sag uns, dass du auf die Play-Version wartest</a> – wir lesen jede Nachricht.',
  ],
  deepLinksHtml:
    "Deep Links entsprechen denen der Web-App (<code>/dashboard</code>, Alarme, Haushalt), damit sich nativer Client und PWA vertraut anfühlen.",
  ossTitle: "Open Source",
  ossHtml: 'App-Repository: <a class="text-link" href="{repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Datenschutz: <a class="text-link" href="/privacy">so werden Android-Push-Tokens behandelt</a> · API: <a class="text-link" href="/docs/api">HTTP-Referenz</a>',
  faqLede: "Klare Antworten für Play-Prüfer und Hausbesitzer, die auf den Eintrag warten.",
  backToApps: "← Alle Begleit-Apps",
};

export default de;
