
/**
 * /about/thermostat-oauth body copy. Secret names, URIs and commands stay in English.
 * `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Pro-Haushalte können ein <strong>Nest</strong>- oder <strong>Ecobee</strong>-Thermostat verbinden, sodass Innentemperatur und Sollwert im Dashboard neben den Fühlern in Dachboden, Kriechkeller und Werkstatt erscheinen und Frostalarme diesen Zusammenhang mitliefern. Nutzer verbinden sich über <strong>Dashboard → Temperature</strong>; diese Seite richtet sich an Betreiber, die OAuth auf einer selbst gehosteten oder produktiven Installation aktivieren.",
  connectTitle: "Wann der Verbinden-Button erscheint",
  connectHtml:
    "Die Thermostat-Karte bleibt ausgeblendet, bis die Installation die Client-Zugangsdaten des Anbieters in den Worker-Secrets hat. Sobald die Secrets hochgeladen sind, sehen Pro-Verwalter für jeden konfigurierten Anbieter <strong>Connect</strong>.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "Weiterleitungs-URI für die Produktion (<strong>probeharbor.dev</strong>): genau so in die Google Cloud Console kopieren:",
  nestSteps: [
    'Lege in der <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> ein Projekt an (einmalige Gebühr).',
    "Erstelle einen Google-Cloud-OAuth-Client (Webanwendung) im <strong>selben</strong> GCP-Projekt, das mit Device Access verknüpft ist.",
    'Aktiviere in diesem GCP-Projekt die <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> (OAuth kann auch ohne sie klappen, Live-Werte liefern aber 403, bis sie aktiv ist).',
    "Trage die Weiterleitungs-URI von oben ein (selbst gehostet: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Setze die Worker-Secrets: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (die UUID oben in deinem Device-Access-Projekt, nicht die Google-Cloud-Projektnummer).",
    "Trage die Schlüssel in <code>.env</code> ein und lade sie hoch: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "Weiterleitungs-URI für die Produktion:",
  ecobeeSteps: [
    'Registriere dich im <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">Ecobee-Entwicklerportal</a>.',
    "Erstelle eine App mit der Weiterleitungs-URI von oben (selbst gehostet: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Setze das Worker-Secret: <code>ECOBEE_CLIENT_ID</code> (Ecobee verwendet kein Client-Secret).",
    "In <code>.env</code> eintragen und <code>pnpm secrets:push</code> ausführen.",
  ],
  uxTitle: "Aus Nutzersicht",
  uxHtml:
    "Jeder Haushalt speichert nach OAuth sein eigenes Refresh-Token; ein gemeinsames globales Thermostat-Token gibt es nicht. Verwalter können die Verbindung im Dashboard trennen; dabei werden die Tokens in der Datenbank widerrufen.",
  seeAlsoHtml:
    'Siehe auch: <a class="text-link" href="/integrations">Integrationsübersicht</a>, <a class="text-link" href="/compare/nest">ProbeHarbor oder Nest</a>, <a class="text-link" href="/compare/ecobee">oder Ecobee</a>.',
};

export default de;
