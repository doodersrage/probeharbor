
/** /about/python-feeds body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { PythonFeedsMessages } from "./en";

const REPO_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/fast-api-relay">fast-api-relay</a>';
const RELAY_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/blob/main/sketches/relay/push_https_forward.py"><code>sketches/relay/push_https_forward.py</code></a>';
const ETH_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>';

const de: PythonFeedsMessages = {
  intro:
    "Mikrocontroller sind stark im Auslesen von Fühlern, Python im Caching, in der Authentifizierung und im Bereitstellen stabiler HTTPS-Endpunkte. Das Projekt fast-api-relay sitzt zwischen dem Arduino-JSON und der Astro-Website, vereinheitlicht die Antworten und entlastet empfindliche Embedded-Stacks.",
  relayTitle: "Warum eine Relay-Schicht hilft",
  relayBody:
    "Direkte Browser-Abrufe an eine IP-Adresse im lokalen Netz scheitern, sobald sich das DNS ändert, Zertifikate ablaufen oder der Internetanschluss zu Hause ausfällt. Ein Relay auf einem VPS oder Cloud-Worker bietet eine gleichbleibende URL, ergänzt Redis-Caching, damit Dashboards den Fühler nicht ständig abfragen, und kann mehrere Standorte bündeln, wenn du über ein einzelnes Objekt hinauswächst.",
  fastapiTitle: "Aufgaben von FastAPI",
  fastapiItemsHtml: [
    "Nach Zeitplan Daten vom Arduino oder vom Agenten im lokalen Netz entgegennehmen.",
    "Die neueste Payload mit kurzer TTL in Redis speichern.",
    "<code>GET /...</code>-Antworten für die Website sofort aus dem Cache ausliefern.",
    "Veraltete Daten protokollieren, wenn die Quelle nicht mehr aktualisiert: nützlich für Warnungen.",
  ],
  consumerTitle: "Beispiel für einen Abruf",
  consumerBodyHtml:
    "Die Abrufschicht der Astro-Website fragt deine konfigurierte HTTPS-URL ab, liest das Objekt <code>temp</code> aus (oder erkennt automatisch SenML- / Home-Assistant-REST-JSON, wenn diese Wurzel fehlt) und ordnet die Schlüssel den Fühlern im Dashboard zu. Dieselbe URL kann Node-Skripte, Grafana-JSON-Plugins oder REST-Sensoren in Home Assistant versorgen.",
  figureAlt:
    "JSON-Ansicht im Browser mit den Fühlerschlüsseln temp 0, 1 und avg samt Fahrenheit, Celsius und Luftfeuchtigkeit",
  figureCaption: "Beispiel für die Payload-Struktur des Relays, die die Website nach dem Cachen des Arduino-JSON erwartet.",
  scriptsTitle: "Betriebsskripte",
  scriptsBody:
    "Neben der API prüfen kleine Python-Werkzeuge das JSON-Schema, füllen CSV-Archive nach oder vergleichen Fühler-Mittelwerte mit OpenWeather-Vorhersagen. Weil die Fühler einfaches JSON liefern, kannst du Auswertungen erst in einem Notebook ausprobieren und die Logik dann in produktive Dienste übernehmen.",
  repoTitle: "Repository",
  repoBodyHtml: `Implementierungsdetails, Redis-Konfiguration und Hinweise zum Deployment des Relays findest du in ${REPO_LINK}. Trage die öffentliche Relay-URL nach der Anmeldung in deinen <a class="text-link" href="/dashboard/devices">Einstellungen für Temperatur-Feeds</a> ein.`,
  unoTitle: "Uno Ethernet: HTTP→HTTPS für Push-Ingest",
  unoBodyHtml: `Ein W5100-Shield kann keinen POST an <code>https://probeharbor.dev</code> senden. Das Relay ${RELAY_LINK} (nur Standardbibliothek) nimmt HTTP vom Arduino entgegen und leitet denselben Pfad und Body per HTTPS weiter. Kombiniere es mit ${ETH_LINK} (DHT22 an A4/A5, klassisches <code>temp</code>-JSON).`,
};

export default de;
