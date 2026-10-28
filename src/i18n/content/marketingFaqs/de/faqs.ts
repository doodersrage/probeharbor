import type { MarketingFaqOverlay } from "../index";

export default {
  home: [
    {
      question: "Was ist ProbeHarbor?",
      answer: `ProbeHarbor ist Open-Source-Frost- und Wasserüberwachung für Garagen, Werkstätten und Dachböden: ESP/Arduino-Anbindung, Live-Kurven und Alarme. Du baust mit ESP32, Pico W oder Arduino; ProbeHarbor übernimmt das gehostete Dashboard, den Verlauf und die Alarme für deinen Haushalt.`,
    },
    {
      question: "Wie verbinde ich ESP32-, Pico-W- oder Arduino-Sensoren?",
      answer:
        "Beim ESP32 geht es am schnellsten mit dem Web-Flasher unter probeharbor.dev/flash: Board per USB anschließen, die Firmware aus Chrome oder Edge installieren und WLAN-Zugangsdaten sowie Geräteschlüssel übertragen. Auf einem normalen ESP32 ist sie mit DS18B20-Fühlern, einem DHT22, einem BME280 und einem Türschalter getestet; SHT31- und AHT20-Sensoren, Wasser- und Akku-Eingänge sowie S3-/C3-Boards sind eingebaut, aber noch nicht auf Hardware getestet. Für andere Boards legst du unter Dashboard → Devices ein Push-Gerät an und sendest JSON per POST an /api/ingest/<key>; die Sensoren werden beim ersten POST automatisch übernommen. Beispiele für Pico W und Arduino findest du unter probeharbor.dev/about/adding-devices. Keine Hardware zur Hand? Probier den Demo-Pull-Schnellstart auf Overview aus.",
    },
    {
      question: "Muss ich programmieren können?",
      answer:
        "Nein. Beim ESP32 installiert der Web-Flasher fertige Firmware direkt aus deinem Browser und überträgt WLAN-Zugangsdaten und Geräteschlüssel über das USB-Kabel – ganz ohne Arduino IDE und ohne etwas anpassen zu müssen. Die Firmware ist Open Source, falls du sie lesen oder ändern möchtest, und die Beispiel-Sketches für andere Boards gibt es weiterhin.",
    },
    {
      question: "Verschickt ProbeHarbor Frostalarme?",
      answer:
        "Ja. Lege eine Frostschwelle fest und aktiviere Kanäle wie E-Mail, Browser- oder Android-Push, Discord, Telegram, Slack oder (mit Pro) SMS und WhatsApp. Die Time-to-Freeze-Alarme mit verbleibenden Stunden lösen aus, bevor der Fühler die Frostgrenze erreicht – auf Basis der Verzögerung dieses Raums gegenüber der Außenvorhersage (Details: probeharbor.dev/about/time-to-freeze). Vorausschauende Frostwarnungen anhand der Außenvorhersage gibt es mit Member, offizielle NWS-Frost- und Kältewarnungen (USA) mit Pro. Wassersensoren melden sich bei Nässe ebenfalls automatisch; für Tür, Bewegung, Strom und Luftqualität nutzt du eigene Regeln. Mit einem Telegram-Bot-Webhook kannst du im Chat mit /status, /snooze oder /vacation antworten.",
    },
    {
      question: "Ist ProbeHarbor kostenlos?",
      answer:
        "Ja, es gibt einen kostenlosen Tarif mit Live-Kurven, 7 Tagen Verlauf, Schwellenalarmen für Frost und Wasser per E-Mail und Push sowie einem Live-Freigabelink für die Familie (7 Tage gültig). Member bietet zusätzlich 90 Tage Verlauf, CSV-Export, mehr Geräte und Frostwarnungen anhand der Vorhersage; Pro ergänzt mehr als 1 Jahr Verlauf, offizielle NWS-Frost- und Kältewarnungen (USA), SMS, unbegrenzte Freigabeumfänge (Verlauf, Metriken, ohne Ablauf), ein druckbares Nachweispaket für Schadensmeldungen, Webhooks und eine Testphase. Bei jährlicher Abrechnung sind Member und Pro günstiger als bei monatlicher.",
    },
    {
      question: "Warum brauche ich ein Konto?",
      answer:
        "Ein Konto verknüpft deine Ingest-Schlüssel, deinen Verlauf und deine Alarme mit deinem Haushalt – so bleiben deine Fühler privat. Die Registrierung ist kostenlos und ohne Kreditkarte. Den interaktiven Fühler-Simulator und die Live-Demo kannst du auch ohne Anmeldung ausprobieren; leg ein Konto an, sobald du deine eigene Hardware verbinden möchtest.",
    },
    {
      question: "Gibt es eine Android-App für ProbeHarbor?",
      answer:
        "Eine native Android-App ist im Early Access auf GitHub verfügbar, solange die Prüfung bei Google Play noch läuft. Du kannst auch das vollständige Web-Dashboard nutzen oder die Progressive Web App installieren. Begleit-Apps (Android, Desktop, Bay Buddy, PWA) findest du unter probeharbor.dev/apps. Die Smartphone- und Desktop-Apps messen keine Temperatur: Sie verbinden sich mit deinem ProbeHarbor-Konto.",
    },
    {
      question: "Hieß ProbeHarbor früher ThermalTrace?",
      answer:
        "Ja. ThermalTrace wurde im Oktober 2026 in ProbeHarbor umbenannt, um Verwechslungen mit einem anderen, nicht verwandten Produkt zu vermeiden. Konten, Sensoren, Verlauf und Alarme wurden unverändert übernommen. Alte Links auf thermaltrace.dev leiten hierher weiter, und Geräte, die noch an Ingest-URLs auf thermaltrace.dev senden, funktionieren weiter; neue Installationen sollten aber probeharbor.dev verwenden.",
    },
    {
      question: "Wo wird ProbeHarbor gehostet?",
      answer:
        "Im Edge-Netzwerk von Cloudflare (Workers). Website und Ingest-APIs laufen dadurch nah an den Besuchern, ohne dass du einen VPS pflegen musst. Den aktuellen Zustand von Jobs und Ingest findest du unter probeharbor.dev/system-status: Wir veröffentlichen, was wir messen, keine Uptime-Prozentzahl fürs Marketing.",
    },
  ],
  demo: [
    {
      question: "Was unterscheidet diese Seite von der Demo auf der Startseite?",
      answer:
        "Die Startseite führt dich zuerst zum interaktiven Fühler-Simulator, mit einem kurzen Vorgeschmack auf Live-Messwerte. Diese Seite bietet beides: einen prominenten Hinweis auf den Simulator plus den vollständigen Live-Feed (Fühler + Außenwetter), Hintergründe zu Frostalarmen, Schritte für das Kit und QR-Onboarding.",
    },
    {
      question: "Live-Feed oder interaktiver Simulator – was soll ich ausprobieren?",
      answer:
        "Starte mit dem interaktiven Fühler-Simulator (/about/probe-demo), wenn du selbst einen Kälteeinbruch oder Zugluft an der Tür auslösen und zusehen möchtest, wie das Risiko in mehreren Zonen reagiert. Der Live-Feed auf dieser Seite zeigt echte Demo-Fühler über denselben Ingest-Weg, den auch dein ESP/Arduino nutzt: ein Nachweis aus dem Echtbetrieb, keine Sandbox.",
    },
    {
      question: "Was ist QR-Onboarding für Kits?",
      answer:
        "Nachdem du ein Push-Gerät angelegt hast, zeigt ProbeHarbor einen QR-Code mit der vollständigen Ingest-URL an (etwa 30 Minuten lang). Scanne ihn mit dem Smartphone oder drucke ihn auf ein Kit-Etikett, damit Firmware oder Home Assistant per POST senden können, ohne den Schlüssel abzutippen. Anleitung: probeharbor.dev/about/kit-qr-onboarding.",
    },
    {
      question: "Sind die Daten der Live-Demo gefälscht?",
      answer:
        "Nein. Die Messwerte stammen aus dem öffentlichen ProbeHarbor-Demo-Feed und laufen über denselben HTTPS-Ingest/Pull-Weg wie echte Geräte. Der interaktive Simulator ist bewusst synthetisch, damit du Außenluft, Sonne und Türzustand verändern kannst: Für das Frostrisiko nutzt er denselben Raumstatus-Helfer wie Overview.",
    },
    {
      question: "Brauche ich ein Konto, um das auszuprobieren?",
      answer:
        "Für diese Seite und den Fühler-Simulator nicht. Ein kostenloses Konto (ohne Kreditkarte) brauchst du, um einen eigenen Geräteschlüssel anzulegen, den Verlauf zu speichern und Frostalarme einzurichten. Details zu den Tarifen: probeharbor.dev/pricing.",
    },
  ],
  pricing: [
    {
      question: "Was ist im Free-Tarif enthalten?",
      answer: `Live-Messwerte für Temperatur, Luftfeuchtigkeit, Luftqualität, Türen, Wasser, Energie und Bewegung in Garagen, Werkstätten, Dachböden, Kriechkeller und Hallen; 7 Tage Verlauf; Schwellenalarme für Frost und Wasser plus eine Time-to-Freeze-Uhr; E-Mail und Chat-Kanäle; eine begrenzte Anzahl an Geräten; ein Live-Freigabelink für die Familie; und Haushaltsfreigabe, damit deine Familie dieselben Sensoren im Blick hat.`,
    },
    {
      question: "Wann lohnt sich ein Upgrade auf Member oder Pro?",
      answer:
        "Wähle Member für 90 Tage Verlauf, CSV-Export, mehr Geräte und vorausschauende Frostwarnungen anhand der Vorhersage. Wähle Pro für mehr als 1 Jahr Verlauf, offizielle NWS-Frost- und Kältewarnungen (USA), Kontext aus dem Haus per Nest/Ecobee (oder Innenreferenz), SMS/WhatsApp, Browser-Push, unbegrenzte Freigabelinks (Verlauf, Metriken, Einbettungen, ohne Ablauf), ein druckbares Nachweispaket für Schadens- und Versicherungsfälle, ein- und ausgehende Webhooks, Prometheus-Metriken, bis zu 50 eigene Objekte und eine 14-tägige Testphase. Free enthält bereits einen Live-Freigabelink für die Familie. Bei jährlicher Abrechnung zahlst du weniger als bei monatlicher.",
    },
    {
      question: "Wann brauche ich Portfolio statt Pro?",
      answer:
        "Pro deckt bereits bis zu 50 eigene Objekte ab – genug für ein Ferienhaus, ein paar Mietobjekte oder Werkstatt plus Wohnhaus. Portfolio hebt die Grenze auf 500 an und ergänzt Zugänge für Hausverwalter, damit Personal vor Ort Geräte und Alarme für zugewiesene Objekte verwalten kann, ohne Abrechnung oder andere Standorte zu sehen. Siehe probeharbor.dev/property-management.",
    },
    {
      question: "Was ist das Nachweispaket für Schadens- und Versicherungsfälle?",
      answer:
        "Mit Pro kann History für einen frei wählbaren Zeitraum eine PDF-Zusammenfassung für Schadensmeldungen exportieren: Frostbelastung, Geräte und Alarmverlauf, dazu passende CSV-Dateien mit Messwerten und Alarmereignissen. Es handelt sich um Überwachungsnachweise für deinen eigenen Gebrauch, nicht um eine rechtliche oder versicherungstechnische Bewertung. Eine HTML-Version gibt es ebenfalls, falls du etwas bearbeiten oder neu drucken möchtest.",
    },
    {
      question: "Kann ich jederzeit kündigen oder den Tarif wechseln?",
      answer:
        "Bezahlte Tarife werden über Stripe abgerechnet. Im Kundenportal kannst du dein Abo verwalten oder kündigen; bei ausbleibender Zahlung fällt das Konto unter Umständen auf die Free-Grenzen zurück. Diagramme und CSV richten sich sofort nach dem Zeitfenster des aktuellen Tarifs (7 Tage bei Free). Ältere Messwerte werden beim Downgrade nicht gelöscht: Sie bleiben nach dem üblichen Aufbewahrungsplan gespeichert und werden wieder sichtbar, wenn du vor ihrem Ablauf erneut upgradest.",
    },
    {
      question: "Wie sieht die Erstattungsregelung für die Pro-Testphase aus?",
      answer:
        "Die Pro-Testphase ist kostenlos. Kündigst du vor ihrem Ende, wird dir nichts berechnet. Sobald die Testphase in einen bezahlten Tarif übergegangen ist, wird der laufende Abrechnungszeitraum in der Regel nicht erstattet. Melde dich bei uns, wenn dir eine Abbuchung falsch vorkommt – wir prüfen sie.",
    },
    {
      question: "Wie zuverlässig ist das Hosting von ProbeHarbor?",
      answer:
        "Die App läuft auf Cloudflare Workers am Edge. Unter probeharbor.dev/system-status siehst du den aktuellen Zustand von Cron-Jobs und Ingest und kannst dich dort für Hinweise zu Störungen anmelden. Wir geben das Plattform-SLA von Cloudflare nicht als unsere eigene Uptime-Prozentzahl aus.",
    },
  ],
  compare: [
    {
      question: "Was unterscheidet ProbeHarbor von einem selbst geschriebenen Skript?",
      answer:
        "ProbeHarbor hostet für dich Ingest, Verlauf, Haushalte und Frost- und Wasseralarme über mehrere Kanäle. Bei einem eigenen Cron-Skript musst du Server, Datenbanken, die Twilio-Anbindung und die Verfügbarkeit selbst betreiben.",
    },
    {
      question: "Wie schneidet ProbeHarbor im Vergleich zu Govee oder SmartThings ab?",
      answer: `Govee und SmartThings sind allgemeine Verbraucher- und Smart-Home-Apps. ProbeHarbor ist gezielt für Garagen, Werkstätten, Dachböden, Kriechkeller und Hallen gebaut: ESP/Arduino- oder JSON-Ingest, Frost-Abläufe, Luftqualität, Türen, Wasser, Energie und CSV-Verlauf statt eines Sammel-Dashboards für alle möglichen Geräte.`,
    },
    {
      question: "Braucht mein Arduino eine öffentliche IP-Adresse?",
      answer:
        "Für Push-Ingest nicht: Das Gerät sendet ausgehend per POST an ProbeHarbor. Pull-Feeds brauchen eine erreichbare HTTPS-JSON-URL, falls du stattdessen diesen Weg nutzt.",
    },
    {
      question: "Kann ich Home Assistant oder MQTT behalten und trotzdem ProbeHarbor nutzen?",
      answer:
        "Ja. Installiere die offizielle HACS-Integration (github.com/doodersrage/probeharbor-home-assistant), um Entitäten automatisch aus einem Freigabelink zu erzeugen, oder behalte MQTT in deinem LAN und spiegle die Daten per POST /api/ingest/mqtt. Viele betreiben beides parallel: HA lokal, ProbeHarbor für Frost- und Wasser-SMS an den Haushalt und den Verlauf. Siehe probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Warum verlangt ProbeHarbor ein Konto?",
      answer:
        "ProbeHarbor wird gehostet, damit du keine Datenbanken oder SMS-Anbindung selbst betreiben musst. Ein kostenloses Konto (ohne Kreditkarte) ordnet deinen Ingest-Schlüssel deinem Haushalt zu. Du kannst trotzdem parallel Home Assistant oder MQTT im LAN betreiben. ProbeHarbor ist die externe Ebene für Alarme und Verlauf.",
    },
    {
      question: "Muss ich zu Hause einen Server dauerhaft laufen lassen?",
      answer:
        "Nein. ProbeHarbor läuft im Edge-Netzwerk von Cloudflare; deine Fühler brauchen nur ausgehendes HTTPS (Push) oder eine erreichbare Pull-URL. Den aktuellen Dienststatus findest du unter probeharbor.dev/system-status.",
    },
    {
      question: "Ich habe schon Govee oder ein Tempest – brauche ich das trotzdem?",
      answer: `Govee ist ein Raumsensor für Verbraucher, Tempest eine Außenwetterstation. ProbeHarbor überwacht Fühlerkurven in Garagen, Werkstätten, Dachböden, Kriechkeller und Hallen auf Hardware, die du selbst kontrollierst. Beides lässt sich kombinieren: Auf den Vergleichsseiten zu Govee und Tempest erfährst du, wann welches Werkzeug besser passt.`,
    },
  ],
  "freeze-map": [
    {
      question: "Was ist die ProbeHarbor-Frostkarte?",
      answer:
        "Eine freiwillige, auf Stadtebene zusammengefasste Auswertung anonymisierter Temperaturwerte von teilnehmenden Haushalten: nützlich, um das regionale Frostrisiko zu sehen, aber kein persönlicher Live-Feed. Sobald deine Region live ist, kannst du die Karte einbetten oder das Markdown-Badge verwenden.",
    },
    {
      question: "Lassen sich Daten der Frostkarte einzelnen Personen zuordnen?",
      answer:
        "Nein. Die Beiträge werden für die öffentliche Anzeige auf Stadtebene zusammengefasst. Auf der Karte erscheinen keine Adressen, Gerätenamen oder Haushalts-IDs. Dein Dashboard bleibt privat für deinen Haushalt.",
    },
    {
      question: "Kann ich den Beitrag meines Haushalts nach der Teilnahme wieder entfernen?",
      answer:
        "Ja. Du kannst die Teilnahme an der Frostkarte jederzeit unter Dashboard → Household abschalten. Deine Fühler tragen dann ab dem nächsten stündlichen Snapshot nichts mehr bei; frühere Stadtwerte bleiben anonymisiert (sie haben dich nie namentlich genannt).",
    },
    {
      question: "Wie viele Haushalte braucht es, bis meine Stadt echte Daten zeigt?",
      answer: `Eine Stadt erscheint auf der Standardkarte, sobald mindestens 3 teilnehmende Haushalte mit einem aktiven Temperaturfühler im selben Snapshot-Zeitfenster beitragen. Städte mit zu wenigen Daten (unter dieser Grenze) sind standardmäßig ausgeblendet, lassen sich aber über den Schalter für dünn besetzte Städte einblenden. Solange noch keine Stadt die Grenze erreicht, zeigt die Seite eine klar gekennzeichnete Beispielvorschau.`,
    },
    {
      question: "Ich habe nur einen Fühler – zählt das?",
      answer:
        "Ja. Jeder teilnehmende Haushalt liefert einen Wert für seine Stadt (den Mittelwert seiner Temperaturfühler, wobei sich das Frostrisiko am kältesten orientiert). Ein Fühler reicht.",
    },
    {
      question: "Was bedeutet der Anteil mit Frostrisiko?",
      answer:
        "Für jede Stadt gibt „Samples“ die Zahl der teilnehmenden Haushalte in diesem Snapshot an. Der Anteil mit Frostrisiko ist der Prozentsatz (und die Anzahl) dieser Haushalte, deren kältester Fühler zum Erfassungszeitpunkt bei oder unter 1 °C (34 °F) lag.",
    },
  ],
  contact: [
    {
      question: "Was sollte ich klären, bevor ich den Support kontaktiere?",
      answer:
        "Verkabelung der Fühler, Ingest-Payloads, Frost- und Wasseralarme und die Einrichtung des Dashboards werden im Anleitungsbereich und in der Artikelbibliothek behandelt. Nutze dieses Formular für Fragen zu Konto, Abrechnung, Hinweise zum Android-Start oder alles, was die Dokumentation nicht beantwortet.",
    },
    {
      question: "Soll ich das Formular oder GitHub nutzen?",
      answer:
        "Fragen zu Konto, Abrechnung und Haushalt gehören in dieses Formular. Fehler, Firmware-Patches und Ideen für Funktionen gehören in GitHub-Issues, damit andere Bastler mitlesen können.",
    },
    {
      question: "Wie schnell bekomme ich eine Antwort?",
      answer:
        "Wir antworten in der Regel innerhalb von 1–2 Werktagen. Das Formular ist durch Cloudflare Turnstile geschützt; eine Support-Adresse veröffentlichen wir nicht, damit dieses Postfach nicht auf Spam-Listen landet.",
    },
  ],
  docsApi: [
    {
      question: "Wo finde ich die OpenAPI-Spezifikation von ProbeHarbor?",
      answer:
        "Lade openapi.yaml unter /openapi.yaml auf probeharbor.dev herunter (auch gespiegelt in der Entwicklerdokumentation auf GitHub Pages). Die Seite /docs/api in der App ist die Kurzreferenz für Menschen, mit curl-Beispielen, Ratenlimits und Fehlercodes.",
    },
    {
      question: "Wie authentifiziere ich mich an der HTTP-API?",
      answer:
        "Die Geräte-Firmware nutzt einen Ingest-Schlüssel pro Gerät in der URL (oder X-Ingest-Key für die MQTT-Bridge). Pro-Integrationen verwenden einen Bearer-API-Schlüssel aus Dashboard → Share. Das Browser-Dashboard nutzt Sitzungscookies, nicht für Drittanbieter-Clients gedacht. Freigabe- und eingehende Routen verwenden undurchsichtige Tokens im Pfad.",
    },
    {
      question: "Welche Ratenlimits gelten für Ingest?",
      answer:
        "Push-Ingest akzeptiert einen Body von höchstens etwa 64KB und etwa 60 Anfragen pro Minute und Geräteschlüssel (pro Worker-Isolate). Zu große Bodies liefern 413, ein überschrittenes Ratenlimit 429. Halte deine Firmware unter diesen Grenzen: Typische Garagenfühler senden alle 1–5 Minuten.",
    },
    {
      question: "Was bedeutet „verschlüsselter Tresor“ bei reveal-ingest-key?",
      answer:
        "Wenn die Installation INGEST_KEY_ENCRYPTION_SECRET setzt, werden neue Push-Schlüssel verschlüsselt gespeichert, sodass Besitzer sie später unter Devices per Reveal ingest key wieder anzeigen können (mit Ratenlimit und Protokollierung). Auf probeharbor.dev ist das aktiviert. Fehlt das Tresor-Geheimnis, legst du einen Schlüssel an bzw. erneuerst ihn und kopierst ihn aus dem 30-Minuten-Hinweis – später gibt es nichts zu entschlüsseln.",
    },
    {
      question: "Wo finde ich die vollständigen Request- und Response-Schemas?",
      answer:
        "openapi.yaml ist die maßgebliche Quelle. Ausführlichere Anleitungen gibt es unter probeharbor.dev/developers (Ingest, Grafana, Webhooks). Produktanleitungen: probeharbor.dev/about/ingest-and-webhooks und /about/adding-devices.",
    },
    {
      question: "Was ist die Claim-Puck-API?",
      answer:
        "Endpunkte für Begleitsitzungen unter /api/pucks (register, claim/start, claim/finish) plus GET/PUT /api/bays/{bay}/mood. Genutzt vom RP2040-Zero-Claim-Puck und von Bay Buddy. Einrichtung: probeharbor.dev/claim-puck. Details unter /docs/api#claim-puck.",
    },
  ],
  claimPuck: [
    {
      question: "Was ist ein ProbeHarbor Claim Puck?",
      answer:
        "Ein Waveshare RP2040-Zero mit Claim-Puck-Firmware. Er belegt deine physische Anwesenheit, wenn du einen Stellplatz beanspruchst (Taster an GP4), und zeigt danach die Frost- und Wasser-Stimmungen von Bay Buddy über seine LED an. Er ist kein Temperaturfühler. Für einen WLAN-DS18B20 am Pico W / Pico 2 W siehe probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Brauche ich Bay Buddy?",
      answer:
        "Mit Bay Buddy beanspruchst und steuerst du den Puck nach der Anmeldung am einfachsten. Alternativ kannst du die Host-CLI im Repo probeharbor-claim-puck mit Begleitzugang und Refresh-Tokens verwenden.",
    },
    {
      question: "Ist das dasselbe wie das Claims Pack?",
      answer:
        "Nein. Das Claims Pack ist ein druckbares PDF mit Nachweisen für die Versicherung unter probeharbor.dev/claims-pack. Der Claim Puck ist ein Hardware-Anwesenheitsschlüssel und eine Stimmungsleuchte.",
    },
    {
      question: "Wo finde ich weiteres Zubehör?",
      answer:
        "Alarmleuchte, Tür-, Wasser- und Stromkontakte, Kit-Etiketten, Fühler-Montageset und Puck-Gehäuse: probeharbor.dev/accessories.",
    },
  ],
  accessories: [
    {
      question: "Ersetzt Zubehör einen Frostfühler?",
      answer:
        "Nein. Zubehör sind Begleiter (Stimmungsleuchten, Anwesenheitsnachweis), Kontaktsensoren (Tür, Wasser, Strom) und Kit-Teile (Etiketten, Halterungen, Gehäuse). Für die Temperatur brauchst du weiterhin einen Fühler, etwa das ESP32-Frost-Kit (DS18B20, DHT22 oder ein I²C-Sensor), installiert über den Web-Flasher unter probeharbor.dev/flash.",
    },
    {
      question: "Welches Zubehör sollte ich zuerst kaufen?",
      answer:
        "Nach einem funktionierenden Frostfühler: Claim Puck + Bay Buddy für Stimmungen am Schreibtisch oder ein Leak Puck unter dem Warmwasserspeicher. Kit-Etiketten und das Fühler-Montageset helfen bei jeder Installation.",
    },
    {
      question: "Wo finde ich die Teileliste für das Frost-Kit?",
      answer:
        "Stückliste für ESP32 + wasserdichten DS18B20 mit Kauflinks zu Adafruit und Amazon: probeharbor.dev/about/esp32-freeze-kit. Zubehörkatalog: probeharbor.dev/accessories.",
    },
    {
      question: "Enthalten die Amazon-Kauflinks Affiliate-Tags?",
      answer:
        "Sofern eingerichtet, können Amazon-URLs ein Associates-Tag enthalten. Adafruit-Links bleiben direkte Links. ProbeHarbor erhält möglicherweise eine Provision für qualifizierte Amazon-Käufe, ohne Mehrkosten für dich.",
    },
  ],
  apps: [
    {
      question: "Messen die Begleit-Apps die Temperatur?",
      answer:
        "Nein. Android, Desktop, Bay Buddy und die PWA sind Clients für dein ProbeHarbor-Konto. ESP/Arduino-Fühler (oder HTTPS-Feeds) senden die Messwerte; die Apps melden sich an und zeigen sie an.",
    },
    {
      question: "Welche App sollte ich zuerst installieren?",
      answer:
        "Smartphone: die Android-Begleit-App oder die PWA. Vollständiges Dashboard am Schreibtisch: ProbeHarbor Desktop. Frost- und Wasser-Stimmung auf einen Blick auf dem zweiten Monitor: Bay Buddy. Katalog: probeharbor.dev/apps.",
    },
    {
      question: "Wo finde ich Hardware-Zubehör?",
      answer:
        "Claim Puck, Wassersensor-Pads, Türkontakte und Halterungen findest du unter probeharbor.dev/accessories – getrennt von den Begleit-Apps.",
    },
  ],
  alertBeacon: [
    {
      question: "Was ist eine Alarmleuchte?",
      answer:
        "Eine hellere NeoPixel-Stimmungsleuchte, die über dieselbe Bay-Mood-API von Bay Buddy angesteuert wird wie der Claim Puck. Sie misst keine Temperatur. Einrichtung: probeharbor.dev/alert-beacon.",
    },
    {
      question: "Brauche ich trotzdem einen Claim Puck?",
      answer:
        "Nutze einmalig einen Claim Puck (oder die CLI), um den Stellplatz zu verknüpfen. Danach kann die Leuchte den seriellen Weg für die Stimmungssteuerung mitnutzen.",
    },
    {
      question: "Kann die Leuchte SMS- oder E-Mail-Alarme ersetzen?",
      answer:
        "Nein. Sie ist eine Stimmungsleuchte für den schnellen Blick. Frost- und Wasserbenachrichtigungen kommen weiterhin über die Kanäle unter Dashboard → Alerts.",
    },
  ],
  doorPuck: [
    {
      question: "Was sendet der Türkontakt-Puck?",
      answer:
        "JSON wie {\"door1\":true}, wenn die Tür offen ist. Sketch: sketches/arduino/door_contact_ingest. Anleitung: probeharbor.dev/door-puck.",
    },
    {
      question: "Löst eine offene Tür allein schon eine Frost-SMS aus?",
      answer:
        "Nein. Türsensoren fließen in die Zugluft-Stimmung und optionale eigene Alarmregeln ein. Frost-SMS kommen weiterhin von den Temperaturschwellen eines Fühlers.",
    },
    {
      question: "Welchen Mikrocontroller nutzt das Beispiel?",
      answer:
        "Einen ESP32 mit HTTPS-POST über WLAN, derselbe Weg wie beim Frost-Kit. Schließe einen magnetischen Reedkontakt an GPIO4 mit dem Pull-up des Boards an.",
    },
  ],
  leakPuck: [
    {
      question: "Was sendet der Wasserkontakt-Puck?",
      answer:
        "JSON wie {\"leak1\":true} bei Nässe. Wasser-Schlüssel lösen bei Nässe automatisch einen Alarm aus, sobald Alarme aktiviert sind. Anleitung: probeharbor.dev/leak-puck.",
    },
    {
      question: "Können Wasser- und Temperaturwerte einen Geräteschlüssel teilen?",
      answer:
        "Ja. Sende temp1 und leak1 per POST an dieselbe Ingest-URL oder nutze pro Zone ein eigenes Push-Gerät.",
    },
    {
      question: "Wo sollte ich die Pads platzieren?",
      answer:
        "Unter Warmwasserspeichern, Enthärtungsanlagen oder Auffangwannen von Waschmaschinen. Halte den ESP32 trocken und erhöht; nur die Kontaktpads gehören auf den Boden.",
    },
  ],
  powerNudge: [
    {
      question: "Was sendet der Stromausfall-Melder?",
      answer:
        "JSON wie {\"power1\":false}, wenn die erfasste Netz- oder USB-Stromversorgung wegfällt. Der meldende ESP32 sollte an einer USV hängen. Anleitung: probeharbor.dev/power-nudge.",
    },
    {
      question: "Was ist, wenn auch der Frostfühler keinen Strom mehr hat?",
      answer:
        "Die Erkennung veralteter Messwerte deckt Funkstille ab. Der Stromausfall-Melder ist für ein ausdrückliches power1-Ereignis gedacht, solange der Melder online bleibt.",
    },
    {
      question: "Brauche ich eine eigene Alarmregel?",
      answer:
        "Optional. Stromsensoren können eigene Regeln unter Alerts auslösen; ansonsten nutzt du die Energiekarten auf Overview und die Warnungen bei veralteten Fühlerwerten.",
    },
  ],
  kitLabels: [
    {
      question: "Verkauft ProbeHarbor QR-Aufkleber?",
      answer:
        "Nein. Lade das SVG nach dem Anlegen oder Erneuern unter Devices herunter, drucke es auf wasserfeste Etiketten oder schreibe die Ingest-URL auf einen NFC-Tag. Anleitung: probeharbor.dev/kit-labels.",
    },
    {
      question: "Ist NFC an einer öffentlich zugänglichen Tür sicher?",
      answer:
        "Nein. Der Tag enthält die Ingest-URL. Bewahre Etiketten beim Kit oder im Technikraum auf und erneuere den Schlüssel, wenn eines verloren geht.",
    },
    {
      question: "Wie lange bleibt der QR-Code auf dem Bildschirm gültig?",
      answer:
        "Etwa 30 Minuten nach dem Anlegen oder Erneuern unter Devices. Öffne den Hinweis erneut oder lade das SVG herunter, falls er abläuft. Anleitung: probeharbor.dev/about/kit-qr-onboarding.",
    },
  ],
  probeMountKit: [
    {
      question: "Was ist das Fühler-Montageset?",
      answer:
        "Eine Stückliste für Kabelbinder, Rohrschellen, Klebepads, 4,7k-Pull-up und die Montage eines wasserdichten DS18B20 – kein Markenset im Direktversand. probeharbor.dev/probe-mount-kit.",
    },
    {
      question: "Brauche ich trotzdem die Seite zum ESP32-Frost-Kit?",
      answer:
        "Ja, für die Verkabelung von Board und Fühler sowie den Sketch-Download. Das Montageset ist die Stückliste für den mechanischen Einbau, das Frost-Kit der Weg für die Elektronik: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Wo sollte die Fühlerspitze sitzen?",
      answer:
        "Am besten mit Kontakt zum Rohrmetall oder isoliert anliegend, statt frei in einer sonnigen Türöffnung zu baumeln. Halte den Mikrocontroller trocken; nur die Edelstahlspitze gehört in feuchte Kriechkeller.",
    },
  ],
  claimPuckCase: [
    {
      question: "Brauche ich ein Gehäuse für den Claim Puck?",
      answer:
        "Optional. Ein gedrucktes Gehäuse, ein Taster und ein LED-Diffusor machen den RP2040-Zero schreibtischtauglich. Firmware und Claim-API bleiben gleich. probeharbor.dev/claim-puck-case.",
    },
    {
      question: "Ändert ein Gehäuse die Claim-API?",
      answer:
        "Nein. Gleicher Claim-Ablauf in Bay Buddy und dieselben /api/pucks-Endpunkte. Das Gehäuse ändert nur die mechanische Ausführung und die Lichtstreuung der LED.",
    },
    {
      question: "Was ist, wenn ich ein helleres Licht für den Flur möchte?",
      answer:
        "Nimm eine Alarmleuchte mit NeoPixel-Stick, statt die winzige LED des Zero zu übersteuern: probeharbor.dev/alert-beacon.",
    },
  ],
  homeAssistant: [
    {
      question: "Gibt es eine offizielle Home-Assistant-Integration?",
      answer:
        "Ja: eine benutzerdefinierte HACS-Integration unter github.com/doodersrage/probeharbor-home-assistant. Sie fragt einen Freigabelink ab und legt Sensoren und Binärsensoren automatisch an. Free enthält einen Live-Link für die Familie; Pro ergänzt Verlaufs- und Metrik-Umfänge sowie eingehende Snooze-Webhooks. Installationsanleitung: probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Brauche ich Pro für die HACS-Integration?",
      answer:
        "Für die Abfrage der Sensoren reicht ein Live-Freigabelink. Free enthält einen Live-Link für die Familie. Pro schaltet Verlaufs- und Metrik-Umfänge, Links ohne Ablauf und eingehende Webhook-Dienste (Snooze, Urlaub, Status) unter Dashboard → Share frei. Push über thermaltrace.push funktioniert mit dem Ingest-Schlüssel jedes Push-Geräts.",
    },
    {
      question: "Verzögert die HACS-Abfrage Frost- oder Wasseralarme?",
      answer:
        "HACS fragt den Freigabelink standardmäßig alle 5 Minuten ab (einstellbar). Frost- und Wasseralarme von ProbeHarbor per SMS/E-Mail/Push lösen weiterhin sofort über den Push-Ingest deines Fühlers aus. Nutze nativen ESP/Arduino-Push (oder eine MQTT→HTTPS-Bridge) für zeitkritische Schwellen und Nässekontakte; HACS behältst du für lokale Entitäten und Automationen.",
    },
    {
      question: "Funktioniert Nest- oder Ecobee-OAuth für den Kontext im Haus?",
      answer:
        "Auf probeharbor.dev können Pro-Haushalte Nest unter Dashboard → Temperature verbinden, sofern Nest-OAuth eingerichtet ist. Die Entwickler-Registrierung bei Ecobee ist oft geschlossen: Nutze stattdessen den HA-Plan-B (thermaltrace.push von climate current_temperature + Indoor reference). Für Selbst-Hoster: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "Kann ich JSON von HA-REST-Sensoren ohne die HACS-Integration senden?",
      answer:
        "Ja. ProbeHarbor erkennt REST-Antworten von Home Assistant ({ state, attributes }) bei POST /api/ingest/<key> und bei Pull-Feeds automatisch. Ordne den Fühlerschlüssel state unter Devices zu. SenML-JSON-Arrays werden ebenfalls unterstützt. Beispiele: probeharbor.dev/api/feeds/example?format=homeassistant",
    },
    {
      question: "Kann ich ProbeHarbor zusammen mit MQTT und Home Assistant nutzen?",
      answer:
        "Ja: Üblicherweise bleiben Mosquitto/ESPHome in deinem LAN, und ausgewählte Topics werden per HTTPS an ProbeHarbor gespiegelt (POST /api/ingest/mqtt). ProbeHarbor übernimmt externe Frost- und Wasser-SMS/E-Mails und den Verlauf; HA behält die lokalen Automationen. Rezept: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "Wie gelangen Frost- und Wasseralarme in Home Assistant?",
      answer:
        "Richte in ProbeHarbor einen ausgehenden Pro-Webhook ein, der auf deine HA-Webhook-URL zeigt, oder importiere den Blueprint probeharbor_webhook.yaml von probeharbor.dev/ha/probeharbor_webhook.yaml. Wenn du ein Signatur-Geheimnis für den Webhook festlegst, prüfe den HMAC-Header X-Signature, bevor du auf die Payload reagierst.",
    },
  ],
  matter: [
    {
      question: "Ist das ein offizielles Produkt für Apple Home / Matter?",
      answer:
        "Nein. probeharbor-matter ist ein DIY-Plugin für Matterbridge und nicht CSA-zertifiziert. Für den Hausgebrauch ist das in Ordnung; bestätige den Hinweis beim Koppeln. Anleitung: probeharbor.dev/integrations/matter.",
    },
    {
      question: "Brauche ich eine iPhone-App?",
      answer:
        "Nein. Koppel Matterbridge einmal, dann zeigen Apple Home (und Google Home / Alexa) die Sensoren an. Die Bridge läuft auf einem Pi, NAS oder dauerhaft eingeschalteten PC in deinem LAN – nicht auf Cloudflare Workers.",
    },
    {
      question: "Brauche ich Pro?",
      answer:
        "Ein Live-Freigabelink für die Familie aus dem Free-Tarif reicht für Temperatur, Luftfeuchtigkeit, Wasser, Tür, Strom und Bewegung. Pro ergänzt den optionalen Matter-Snooze-Schalter (eingehender Webhook) sowie Verlaufs- und Metrik-Freigabeumfänge.",
    },
    {
      question: "Verzögert die Matter-Abfrage Frost-SMS?",
      answer:
        "Nein. Frost- und Wasseralarme per SMS/E-Mail/Push lösen weiterhin über den Push-Ingest von ProbeHarbor aus. Die Matter-Bridge fragt den Freigabelink alle 1–5 Minuten für den Überblick in Home und für Automationen ab – dasselbe Prinzip wie bei der HACS-Integration.",
    },
    {
      question: "Kann ich Matter und Home Assistant gemeinsam betreiben?",
      answer:
        "Ja. Beide können denselben Freigabelink abfragen. Nutze HACS für HA-Entitäten und das Matterbridge-Plugin für Apple Home: probeharbor.dev/integrations/home-assistant und probeharbor.dev/integrations/matter.",
    },
  ],
  nodeRed: [
    {
      question: "Brauche ich Node-RED, wenn ich schon Home Assistant habe?",
      answer:
        "Nein. HACS kann einen Freigabelink für Entitäten abfragen. Nutze Node-RED, wenn du Mosquitto-Topics bereits mit Flows spiegelst und HTTPS-POSTs an ProbeHarbor senden möchtest, ohne den Broker freizugeben. Anleitung: probeharbor.dev/integrations/node-red.",
    },
    {
      question: "Wo finde ich die Flow-Datei?",
      answer:
        "Lade probeharbor.dev/nodered/mqtt-to-probeharbor.json herunter – ein Temperatur-Tab plus optionaler Garagentor-Tab, begrenzt auf etwa einen POST pro Minute.",
    },
    {
      question: "Ist ProbeHarbor ein MQTT-Broker?",
      answer:
        "Nein. Mosquitto bleibt lokal. Node-RED (oder HA rest_command) sendet per POST an /api/ingest/mqtt mit dem Schlüssel deines Push-Geräts.",
    },
  ],
  automation: [
    {
      question: "IFTTT, Zapier oder n8n?",
      answer:
        "Dasselbe JSON aus dem ausgehenden Pro-Webhook. IFTTT ist am einfachsten für Benachrichtigungen aufs Smartphone und Sheets. Zapier/Make bieten umfangreichere mehrstufige Zaps. n8n hostest du selbst. Rezepte: probeharbor.dev/integrations/automation und probeharbor.dev/about/zapier-make-recipes.",
    },
    {
      question: "Kann ich Frostalarme in Google Sheets protokollieren?",
      answer:
        "Ja. Importiere probeharbor.dev/n8n/probeharbor-alert-to-sheets.json oder nutze Sheets-Aktionen in IFTTT/Zapier mit der URL des ausgehenden Webhooks.",
    },
    {
      question: "Kann Notion dieselben Alarme bekommen?",
      answer:
        "Ja, über den Notion-Knoten in n8n oder über Make – ordne title, kind, body und sent_at aus der Webhook-Payload zu.",
    },
  ],
  influx: [
    {
      question: "Brauche ich für Influx eine neue ProbeHarbor-API?",
      answer:
        "Nein. Telegraf liest den vorhandenen Prometheus-Endpunkt von Pro aus, GET /api/v1/metrics. Beispielkonfiguration: probeharbor.dev/telegraf/probeharbor.conf. Anleitung: probeharbor.dev/integrations/influx.",
    },
    {
      question: "Ersetzt das Grafana?",
      answer:
        "Nein. Nutze Grafana für Dashboards auf Basis von Prometheus; nutze Influx/VictoriaMetrics, wenn du eine Zeitreihendatenbank für die Langzeitspeicherung willst oder schon einen Influx-Stack hast. Gleicher Metrikname: probeharbor_sensor_value.",
    },
    {
      question: "Was ist mit booleschen Wasser- und Türsensoren?",
      answer:
        "Prometheus-Metriken sind ausschließlich numerisch. Für boolesche Werte nutzt du Freigabe-JSON, HACS oder die Matter-Bridge.",
    },
  ],
  smartThings: [
    {
      question: "Gibt es eine offizielle Cloud-to-Cloud-App für SmartThings?",
      answer:
        "Nein. Nutze das Matterbridge-Plugin (probeharbor.dev/integrations/matter), damit SmartThings Garagensensoren über Matter in deinem LAN hinzufügen kann – derselbe Weg wie bei Apple Home.",
    },
    {
      question: "Funktionieren Frost-SMS weiterhin?",
      answer:
        "Ja. Kritische Alarme laufen weiter über den Push-Ingest von ProbeHarbor und SMS/E-Mail mit Pro. Die Matter-Abfrage dient dem Überblick und Automationen in SmartThings.",
    },
    {
      question: "Sollte ich meine Govee-Sensoren dadurch ersetzen?",
      answer:
        "Nur wenn du eine Garagenabdeckung auf ESP-Niveau und einen exportierbaren Verlauf möchtest. In Schlafzimmern können Govee- oder SmartThings-Sensoren beim Preis weiterhin vorne liegen – siehe probeharbor.dev/compare/govee.",
    },
  ],
  android: [
    {
      question: "Misst die Android-App die Fühlertemperatur?",
      answer:
        "Nein. Das Smartphone ist ein Begleit-Client. ESP/Arduino-Sensoren (oder HTTPS-JSON-Feeds) senden Messwerte an ProbeHarbor; die App meldet sich an und zeigt die Daten dieses Kontos an.",
    },
    {
      question: "Wann ist ProbeHarbor bei Google Play verfügbar?",
      answer:
        "Der Eintrag bei Google Play wird gerade geprüft. Baue die App selbst oder installiere sie manuell von github.com/doodersrage/probeharbor-android, oder nutze das Web-Dashboard bzw. die PWA in Chrome auf Android, bis der Store-Link live ist.",
    },
    {
      question: "Funktioniert mein Web-Konto in der Android-App?",
      answer:
        "Ja. Es gelten dieselbe ProbeHarbor-Anmeldung, dieselben Haushalte, Geräte und Alarmeinstellungen. Push auf Android nutzt Firebase Cloud Messaging zusätzlich zu Web Push im Browser.",
    },
    {
      question: "Wie werde ich benachrichtigt, wenn die App erscheint?",
      answer:
        "Nutze das Kontaktformular mit topic=android (verlinkt von /android) und bitte um eine Nachricht zum Start. Neuigkeiten kündigen wir außerdem auf der Website und in den GitHub-Repos an.",
    },
  ],
  bayBuddy: [
    {
      question: "Was ist Bay Buddy?",
      answer:
        "Bay Buddy ist die Desktop-Begleit-App von ProbeHarbor (Windows, macOS, Linux). Nach der Anmeldung mit deinem ProbeHarbor-Konto zeigt sie Frost- und Wasser-Stimmungen für einen Raum auf einen Blick. Sie ist kein zweites vollständiges Dashboard.",
    },
    {
      question: "Wo lade ich Bay Buddy herunter?",
      answer:
        "Über die GitHub Releases von probeharbor-bay-buddy: Linux AppImage/deb/rpm, Windows MSI und macOS DMG. Starte unter probeharbor.dev/bay-buddy.",
    },
    {
      question: "Ersetzt Bay Buddy das Web-Dashboard?",
      answer:
        "Nein. Geräte, Alarme, Verlauf, Nachweispakete und Haushaltseinstellungen bleiben auf probeharbor.dev, in der Android-App / PWA oder in ProbeHarbor Desktop (probeharbor.dev/desktop). Bay Buddy zeigt nur die Stimmung des Stellplatzes, den du ohnehin überwachst.",
    },
    {
      question: "Kann Bay Buddy einen Claim Puck steuern?",
      answer:
        "Ja. Nach dem Verbinden kann das Claim-Puck-Panel einen RP2040-Zero registrieren und beanspruchen und anschließend seine LED über /api/bays/{bay}/mood steuern. Einrichtung: probeharbor.dev/claim-puck.",
    },
  ],
  desktop: [
    {
      question: "Was ist ProbeHarbor Desktop?",
      answer:
        "ProbeHarbor Desktop ist das native Begleit-Dashboard für Windows, macOS und Linux für dein ProbeHarbor-Konto. Es umfasst Live-Messwerte, Verlauf, Alarme, Geräte, Haushalt, Freigaben und Portfolio – mit demselben Konto wie Web- und Android-App. Der PC ist kein Sensor.",
    },
    {
      question: "Wo lade ich ProbeHarbor Desktop herunter?",
      answer:
        "Über die GitHub Releases von probeharbor-desktop: Linux AppImage/deb/rpm, Windows MSI und macOS DMG. Starte unter probeharbor.dev/desktop.",
    },
    {
      question: "Was unterscheidet Desktop von Bay Buddy?",
      answer:
        "Bay Buddy zeigt die Frost- und Wasser-Stimmung für einen Raum auf einen Blick (plus Claim Puck). ProbeHarbor Desktop ist der vollständige Dashboard-Client. Behalte beide, wenn du einen schnellen Stimmungsblick und ein natives Dashboard möchtest.",
    },
    {
      question: "Funktioniert mein Web-Konto in ProbeHarbor Desktop?",
      answer:
        "Ja. Beim Verbinden öffnet sich probeharbor.dev in deinem Browser, einschließlich MFA, falls aktiviert; anschließend wird die Sitzung über einen localhost-Callback an die App übergeben.",
    },
    {
      question: "Unterstützt Desktop Benachrichtigungen und einen Kiosk-Modus?",
      answer:
        "Ja. Mit Pro kann Desktop Systembenachrichtigungen für neue Alarmereignisse anzeigen, solange die App geöffnet ist (Account → Desktop notifications). Der Kiosk-Modus mit Live-Messwerten im Vollbild lässt sich für Anzeigen in der Werkstatt über die obere Leiste starten.",
    },
  ],
} satisfies MarketingFaqOverlay;
