import type { IntegrationsMessages } from "./en";

const de: IntegrationsMessages = {
  breadcrumbHome: "Start",
  breadcrumbIntegrations: "Integrationen",
  allIntegrations: "Alle Integrationen",
  createShareLink: "Freigabelink erstellen",
  startFreeShareLink: "Kostenlos starten → Freigabelink",
  pluginOnGithub: "Plugin auf GitHub",

  hub: {
    title: "Integrationen",
    description:
      "Verbinde ProbeHarbor mit Home Assistant, Matter, MQTT, Grafana, Nest, Ecobee, Webhooks und Zapier für Frost- und Wasseralarme.",
    kicker: "Integrationen",
    heading: "ProbeHarbor in dein Setup einbinden",
    lede: "Gehostete Frost- und Wasser-/Leckalarme samt Verlauf für ESP-/Arduino-Sensoren, optional mit Home Assistant, Matter / SmartThings, Node-RED, Influx, Prometheus-Metriken, Thermostatdaten und Webhook-Automationen. Die Anleitungen unten bleiben auf probeharbor.dev; ausführliche Payload- und Grafana-Beschreibungen liegen auf der Entwicklerdoku-Seite und sind gekennzeichnet, wenn sie dorthin führen.",
    dashboardShare: "Dashboard → Share",
    startFree: "Kostenlos starten",
    hacsStatus: "Offizielle HACS-Custom-Integration: Aufnahme in den Standard-Store läuft.",
    devDocsHtml: 'Suchst du OpenAPI-Schemas oder Details zum Grafana-Dashboard-JSON? Die <a class="text-link" href="{devDocsUrl}" target="_blank" rel="noreferrer">Entwicklerdoku (GitHub Pages)</a> öffnet sich in einem neuen Tab. Außerdem: <a class="text-link" href="/integrations/influx">Influx / Telegraf</a>, <a class="text-link" href="/integrations/node-red">Node-RED</a>, <a class="text-link" href="/integrations/automation">IFTTT / n8n</a>.',
    learnMore: "Mehr erfahren",
    more: "Mehr",
    opensDevDocs: " (öffnet die Entwicklerdoku)",
    diyTitle: "Noch bei DIY-MQTT?",
    diyCopy:
      "Du kannst Mosquitto im LAN behalten und Messwerte an ProbeHarbor spiegeln – für Frost-/Wasseralarme, Freigabelinks und Nachweise für Versicherungsfälle.",
    compareDiy: "Vergleich mit DIY-MQTT",
    guidesHub: "Alle Anleitungen",
    hacsInstallGuide: "HACS-Installationsanleitung",
    ingestWebhooks: "Ingest & Webhooks",
    freezeMapEmbed: "Frostkarte einbetten",
  },

  ha: {
    title: "Externe Frostalarme für Home Assistant",
    kicker: "HACS-Integration",
    heading: "Der Frostalarm, der auch funktioniert, wenn Home Assistant ausfällt",
    lede: "Eine Home-Assistant-Automation kann dich nicht vor dem Strom- oder Internetausfall warnen, der Home Assistant selbst lahmlegt – und genau das ist oft der Moment, in dem das Haus auskühlt. Schick deine vorhandenen Sensoren an ProbeHarbor: Es alarmiert dich extern, wenn ein Raum sich dem Gefrierpunkt nähert, ein Lecksensor nass wird oder keine Messwerte mehr ankommen. Behalte alles lokal in Home Assistant und ergänze ProbeHarbor für die Alarme, die dich unbedingt erreichen müssen.",
    hacsRepo: "HACS-Repo auf GitHub",
    vsDiyMqtt: "vs. DIY-MQTT",
    statusHtml:
      'Schon heute als HACS-Custom-Repository installierbar. Der <a class="text-link" href="https://github.com/hacs/default/pull/11756" target="_blank" rel="noreferrer">Standard-Store-PR #11756</a> ist in Prüfung. <a class="text-link" href="https://github.com/doodersrage/probeharbor/blob/main/docs/community/home-assistant-forum-post.md" target="_blank" rel="noreferrer">Entwurf des Forenbeitrags</a>',
    addsTitle: "Was es deinem Home-Assistant-Setup hinzufügt",
    addsItemsHtml: [
      "<strong>Ein Alarm, wenn es im Haus still wird.</strong> Bleiben Messwerte eine festgelegte Anzahl Stunden aus, sagt ProbeHarbor dir Bescheid. Stille im Winter heißt meist, dass Strom oder Internet weg sind – und die Heizung womöglich auch.",
      "<strong>Alarme, die nicht von deinem Netzwerk abhängen.</strong> E-Mail, Push und Chat-Apps im Free-Plan, SMS mit Pro. Haushaltsmitglieder bekommen sie, ohne Zugriff auf dein Home Assistant zu brauchen.",
      "<strong>Warnung, bevor die Kälte kommt.</strong> Eine Schätzung der Zeit bis zum Gefrieren in jedem Plan, Frostwarnungen aus der Wettervorhersage mit Member und Unwetterwarnungen des National Weather Service (USA) mit Pro.",
      "<strong>Keine neue Hardware.</strong> Sende jede Temperatur- oder Leck-Entität aus Home Assistant. Zwei Geräte sind kostenlos.",
    ],
    addsFootHtml:
      'Zwei Richtungen, einzeln oder kombiniert: Sende Entitäten aus Home Assistant an ProbeHarbor für externe Alarme (das YAML wird mit deinem Schlüssel unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> erzeugt, wenn du Home Assistant auswählst), und hol ProbeHarbor-Sensoren mit der HACS-Integration unten als Entitäten in Home Assistant. Hintergrund: <a class="text-link" href="/answers/home-assistant-freeze-alert">Frostalarm in Home Assistant einrichten</a> und <a class="text-link" href="/answers/wifi-freeze-alarm-power-outage">was bei einem Stromausfall passiert</a>.',
    installTitle: "Installation über HACS",
    installStep1Html: "In Home Assistant: <strong>HACS → Integrations → ⋮ → Custom repositories</strong>",
    installStep2Html: 'Repository <code class="text-xs break-all">{repo}</code> hinzufügen (Kategorie: Integration)',
    installStep3Html: "<strong>ProbeHarbor</strong> installieren und Home Assistant neu starten",
    installStep4Html: "<strong>Settings → Devices &amp; services → Add integration → ProbeHarbor</strong>",
    installStep5Html:
      'Erstelle unter <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> einen <strong>Live</strong>-Freigabelink (Free enthält einen Familien-Livelink; Pro ergänzt Verlauf/Metriken und Links ohne Ablaufdatum) und füge das Token aus <code>/share/YOUR_TOKEN</code> ein',
    installFootHtml: 'Ausführliche Entwickleranleitung: <a class="text-link" href="{devDocsUrl}" target="_blank" rel="noreferrer">Home-Assistant-Anleitung ↗</a> · Manuelle YAML-Rezepte funktionieren weiterhin, wenn du REST-Sensoren statt HACS bevorzugst.',
    showsTitle: "Was in HA erscheint",
    showsItemsHtml: [
      "<strong>Sensoren</strong>: Temperatur, Luftfeuchte, CO₂, Luftdruck, PM2.5, VOC, Füllstand, Energie und allgemeine numerische Sensoren",
      "<strong>Binärsensoren</strong>: Tür, Wasser/Leck, Bewegung und Stromzustand",
      "<strong>Abfrageintervall</strong>. HACS fragt standardmäßig alle 5 Minuten ab (60–3600 s einstellbar). Für Dashboards reicht das; für zeitkritische Frostgrenzen und Nässekontakte nimm lieber <strong>nativen Push-Ingest</strong> (ESP/Arduino → ProbeHarbor), damit Alarme beim Messwert auslösen und nicht erst nach der nächsten HA-Abfrage. Parallelbetrieb ist normal: Push für Frost- und Leck-SMS, HACS für lokale Entitäten.",
      "<strong>Dienste</strong> (optionaler eingehender Webhook + Secret aus Dashboard → Share): <code>thermaltrace.snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>",
      "<strong>Push-Dienst</strong> (optionaler Ingest-Schlüssel): <code>thermaltrace.push</code> mit einem JSON-<code>payload</code>-Dict",
    ],
    formatsTitle: "Native JSON-Formate (Push & Pull)",
    formatsLede:
      "Über den HACS-Freigabelink hinaus erkennt ProbeHarbor automatisch JSON, das dein HA-Setup vielleicht schon ausgibt – ganz ohne eigenen Wrapper.",
    formatsItemsHtml: [
      '<strong>Home-Assistant-REST-Sensor</strong>. Per POST senden oder abrufen: <code>{ "state": "65.3", "attributes": { "unit_of_measurement": "°F" } }</code>; ordne unter Devices den Sensorschlüssel <code>state</code> zu',
      "<strong>SenML (RFC 8428)</strong>. JSON-Array mit den Einheiten <code>Cel</code> / <code>%RH</code>; verbreitet bei IoT-Gateways",
      "<strong>thermaltrace.push</strong>: native <code>sensors[]</code> aus Automationen (siehe Innentemperatur unten)",
      "<strong>MQTT-Bridge</strong>: MQTT-Payloads aus dem LAN über <code>POST /api/ingest/mqtt</code> entpacken",
    ],
    liveSamples: "Live-Beispiele:",
    sampleHaRest: "HA REST",
    sampleSenml: "SenML",
    ingestFormatsGuide: "Anleitung zu Ingest-Formaten",
    indoorTitle: "Innentemperatur über Home Assistant",
    indoorLede:
      "Haus- und Sensorwerte nebeneinander in Overview und History. Zwei Wege: Nest-OAuth mit Pro (sofern verfügbar) oder als Plan B eine beliebige HA-Klima-Entität senden – praktisch, wenn die Ecobee-Entwickleranmeldung geschlossen ist oder du ein anderes Thermostat nutzt.",
    nestTitle: "Nest-OAuth (Pro, bevorzugt, sofern verfügbar)",
    nestCopyHtml:
      'Auf <strong>probeharbor.dev</strong> können Pro-Haushalte Nest unter <a class="text-link" href="/dashboard/devices">Dashboard → Temperature</a> verbinden – für Live-Innentemperatur, Sollwert und HVAC-Modus neben den Sensoren in Dachboden, Kriechkeller oder Werkstatt; Frostalarme können diesen Kontext enthalten. Der Verlauf speichert Thermostat-Snapshots im selben ~15-Minuten-Takt wie andere Pro-Datenquellen.',
    nestCompareHtml: 'Vergleich für Endnutzer: <a class="text-link" href="/compare/nest">ProbeHarbor vs. Nest</a>',
    nestOperatorHtml:
      'Betreiber selbst gehosteter Instanzen, die OAuth-Secrets aktivieren: <a class="text-link" href="/about/thermostat-oauth">Nest- &amp; Ecobee-Einrichtung für Betreiber</a>',
    planBTitle: "Plan B: Raumluft aus Home Assistant senden",
    planBCopyHtml:
      "Die Anmeldung zum Ecobee-Entwicklerprogramm ist oft geschlossen, daher steht Ecobee-OAuth selbst mit Pro eventuell nicht zur Verfügung. Jedes Thermostat, das schon in HA ist (Ecobee, Nest über HA, generisches <code>climate.*</code>), kann ProbeHarbor trotzdem beliefern: Sende die Raumtemperatur mit <code>thermaltrace.push</code> und wähle diesen Sensor dann unter Dashboard → Devices als <strong>Indoor reference</strong>.",
    planBStepsHtml: [
      "Mach dein Thermostat in HA verfügbar (z. B. <code>climate.living_room</code>).",
      "Ruf alle 15 Minuten <code>thermaltrace.push</code> mit einem <code>temperature</code>-Sensor auf (Schlüssel <code>house_indoor</code>).",
      'In ProbeHarbor: <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=thermostat#indoor-reference">Devices → Indoor reference</a>: diesen Sensor auswählen.',
    ],
    planBFootHtml:
      'Auch nützlich für Ecobee über HA, wenn OAuth nicht verfügbar ist: siehe <a class="text-link" href="/compare/ecobee">ProbeHarbor vs. Ecobee</a>. Ausführliche Payload-Hinweise (GitHub Pages): <a class="text-link" href="https://probeharbor.dev/developers/integrations/home-assistant#indoor-temperature-ecobee--any-thermostat" target="_blank" rel="noreferrer">Entwicklerdoku ↗</a>',
    mqttTitle: "Parallelbetrieb mit MQTT (der übliche Weg)",
    mqttLede:
      "ProbeHarbor ist kein MQTT-Broker. Die meisten Homelabber behalten Mosquitto / ESPHome / HA-MQTT im LAN und spiegeln ausgewählte Topics per HTTPS, wenn sie Frost- und Leckalarme aus der Cloud samt Verlauf wollen.",
    mqttItemsHtml: [
      '<a class="text-link" href="/about/mqtt-bridge">Rezept für die MQTT → HTTPS-Bridge</a> <code>POST /api/ingest/mqtt</code> mit deinem Geräteschlüssel',
      '<a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>Node-RED-Flow</a> für Mosquitto-Abonnenten',
      '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs. selbst gehostetes MQTT</a>: wann gehostete Alarme besser sind als ein eigener Stack',
    ],
    alertsTitle: "Alarme in Home Assistant",
    alertsLede:
      "Ausgehende Pro-Webhooks feuern, wenn ProbeHarbor einen Frost-, Leck- oder eigenen Regelalarm sendet. Richte die URL auf deinen HA-Webhook-Endpunkt oder importiere den Blueprint.",
    downloadBlueprint: "Webhook-Blueprint-YAML herunterladen",
    entityYamlHtml: '<a class="text-link" href="{href}" download>YAML zur Entitätsbenennung</a> für Push-Geräte',
    productGuideHtml:
      'Produktanleitung: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a>',
    configureTokensHtml:
      'Ausgehende und eingehende Tokens konfigurierst du unter <a class="text-link" href="/dashboard/share">Dashboard → Share</a>',
    verifyHtml:
      '<strong>Prüfe <code>X-Signature</code></strong>, wenn du in ProbeHarbor ein Webhook-Signatur-Secret festlegst. HA (oder jeder andere Empfänger) sollte POSTs ablehnen, die die HMAC-Prüfung nicht bestehen. Der Blueprint dokumentiert den Header; Details in der <a class="text-link" href="/about/ingest-and-webhooks">Ingest- &amp; Webhook-Anleitung</a> und den FAQ unten.',
    exampleTitle: "Beispiel-Automation",
    exampleLede: "ProbeHarbor-Frost- und Leckalarme pausieren, solange eine Tür für Wartungsarbeiten offen steht:",
    faqLede: "Häufige Fragen zu HACS, Freigabelinks und dem Parallelbetrieb mit MQTT.",
  },

  matter: {
    title: "Matter-/Apple-Home-Bridge",
    breadcrumb: "Matter",
    kicker: "Matter-Bridge",
    heading: "ProbeHarbor in Apple Home",
    lede: "Installiere das Matterbridge-Plugin auf einem Pi, NAS oder Dauerläufer-PC, füge das Token eines Familien-Livelinks ein (Free enthält einen) und erhalte Zubehör für Temperatur, Luftfeuchte, Leck, Tür, Strom und Bewegung in Apple Home, Google Home oder Alexa. Nicht CSA-zertifiziert. Die Sensoren bleiben auf ESP/Arduino; diese Bridge fragt nur deinen Freigabelink ab.",
    vsHomeAssistant: "vs. Home Assistant",
    whyTitle: "Warum Matter statt einer iOS-App?",
    whyCopyHtml:
      'Haushaltsmitglieder, die ohnehin in der Home-App unterwegs sind, sehen Frost und Wasser in der Garage auf einen Blick – ohne ProbeHarbor-Login. Derselbe Freigabelink-Vertrag wie bei der <a class="text-link" href="/integrations/home-assistant">HACS-Integration</a>, gedacht für alle, die nie Home Assistant installieren werden. Kritische Frost-SMS kommen weiterhin aus dem ProbeHarbor-Push-Ingest – diese Abfrage dient Home-Automationen und dem schnellen Überblick.',
    installTitle: "Installation",
    installStep1Html:
      'Installiere <a class="text-link" href="https://matterbridge.io/" target="_blank" rel="noreferrer">Matterbridge</a> auf einem Rechner im LAN (Raspberry Pi, NAS oder Dauerläufer-PC). Das Matter-Pairing braucht lokales mDNS – auf Cloudflare Workers läuft es nicht.',
    installStep2Html: 'Klone <code class="text-xs break-all">{repo}</code>, führe <code>npm install &amp;&amp; npm run build</code> aus, dann <code>matterbridge --add .</code>',
    installStep3Html:
      'Erstelle unter <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> einen <strong>Familien-Livelink</strong> und füge das Token aus <code>/share/YOUR_TOKEN</code> in die Plugin-Konfiguration ein.',
    installStep4: "Starte Matterbridge neu und kopple den QR-Code in Apple Home / Google Home / Alexa.",
    readmeLead: "Vollständige README und Konfigurationsschema:",
    mapTitle: "Sensorzuordnung",
    mapCaption: "ProbeHarbor-Sensorarten und ihre Matter-Gerätetypen",
    mapKindHeader: "ProbeHarbor-Art",
    mapAccessoryHeader: "Matter-Zubehör",
    mapRows: [
      "Temperatursensor (°F → °C)",
      "Luftfeuchtesensor",
      "Wasserlecksensor",
      "Kontaktsensor",
      "Kontaktsensor (Strom an = geschlossen)",
      "Anwesenheitssensor",
    ],
    mapFootHtml:
      "In v1 nicht enthalten: Energie, Füllstand, Luftqualitäts-Cluster und die Zeit bis zum Gefrieren (dafür gibt es keinen passenden nativen Matter-Typ). Der optionale Pro-Schalter <strong>Snooze</strong> sendet denselben eingehenden Webhook wie Home Assistant.",
    dualTitle: "Parallelbetrieb mit Home Assistant",
    dualCopyHtml:
      'Homelabber können <a class="text-link" href="/integrations/home-assistant">HACS</a> für lokale Entitäten behalten und diese Matter-Bridge für Apple Home über denselben Freigabelink ergänzen. Frag alle 60–300 Sekunden ab; Freigabe-Messwerte erlauben etwa 60 Anfragen pro Minute.',
    faqTitle: "Matter-FAQ",
    faqLede: "Zertifizierung, Installationsrechner und wie das mit Sensoren und Home Assistant zusammenhängt.",
  },

  automation: {
    title: "IFTTT, n8n & Sheets",
    breadcrumb: "Automation",
    kicker: "No-Code & selbst gehostet",
    heading: "IFTTT, n8n, Sheets & Notion",
    alertsWebhooks: "Alerts → Webhooks",
    startFreeTrial: "Kostenlos starten / Pro testen",
    downloadN8n: "n8n → Sheets herunterladen",
    zapierMake: "Zapier & Make",
    iftttStepsHtml: [
      "Erstelle ein Applet mit dem Trigger <strong>Webhooks → Receive a web request</strong> (Ereignisname z. B. <code>probeharbor_alert</code>).",
      "Kopiere die IFTTT-Maker-URL in ProbeHarbor unter <strong>Pro → Alerts → Outbound webhook</strong>. Optional ein Signatur-Secret festlegen und <code>X-Signature</code> in einem Filterschritt prüfen, falls dein Plan Code erlaubt.",
      "Aktion: Benachrichtigung senden, eine smarte Steckdose schalten oder über den Sheets-Dienst von IFTTT eine Zeile in ein Google Sheet schreiben.",
    ],
    n8nStep1Html: 'Importiere <a class="text-link" href="{href}" download>probeharbor-alert-to-sheets.json</a> (Webhook → Set → Google Sheets append).',
    n8nStep2: "Aktiviere den Workflow und kopiere die Produktions-Webhook-URL in den ausgehenden Webhook von ProbeHarbor.",
    n8nStep3Html:
      "Ersetze <code>YOUR_GOOGLE_SHEET_ID</code>; Spaltenüberschriften: <code>sent_at</code>, <code>kind</code>, <code>title</code>, <code>body</code>.",
    n8nFootHtml:
      "Dieselbe Payload wie bei Zapier: <code>title</code>, <code>body</code>, <code>kind</code>, <code>sent_at</code>. <code>kind</code> kann unter anderem <code>threshold</code>, <code>flood</code>, <code>runway</code> oder <code>forecast</code> sein.",
    sheetsTitle: "Google Sheets & Notion",
    sheetsLede: "Lückenlose Dokumentation für Vermieter und Versicherungsfälle – ohne eigenen Konnektor zur Hausverwaltungssoftware:",
    sheetsItemHtml:
      "<strong>Sheets</strong> – nutze den n8n-Flow oben, IFTTT Sheets oder Zapier „Create Spreadsheet Row“.",
    notionItemHtml:
      "<strong>Notion</strong> – n8n-Notion-Node oder Make „Create a database item“ aus demselben Catch Hook; ordne <code>title</code> → Name, <code>kind</code> → Select, <code>body</code> → Text, <code>sent_at</code> → Date zu.",
    inboundTitle: "Eingehendes Pausieren (Pro)",
    inboundLede: "Aus IFTTT/n8n, wenn du die Alarmanlage scharf schaltest oder das Haus verlässt:",
    inboundFootHtml:
      'Das Token erstellst du unter Dashboard → Share. Details: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a> · <a class="text-link" href="/about/zapier-make-recipes">Rezepte für Zapier &amp; Make</a>.',
    faqTitle: "Automations-FAQ",
    faqLede: "IFTTT vs. n8n vs. Zapier und Alarme in Sheets protokollieren.",
  },

  influx: {
    title: "InfluxDB, Telegraf & VictoriaMetrics",
    breadcrumb: "InfluxDB",
    kicker: "Zeitreihen",
    heading: "ProbeHarbor-Daten nach Influx holen",
    downloadTelegraf: "Telegraf-Konfiguration herunterladen",
    createApiKey: "API-Schlüssel erstellen",
    startFreePro: "Kostenlos starten / Pro",
    httpApi: "HTTP-API",
    howTitle: "So funktioniert’s",
    howCopyHtml:
      'Pro-API-Schlüssel stellen Prometheus-Text unter <code>GET /api/v1/metrics</code> bereit. <code>inputs.prometheus</code> von Telegraf fragt diesen Endpunkt ab und schreibt nach InfluxDB 2.x, VictoriaMetrics oder in jeden anderen Telegraf-Output. Keine neue ProbeHarbor-API – derselbe Vertrag wie bei <a class="text-link" href="https://probeharbor.dev/developers/integrations/grafana" target="_blank" rel="noreferrer">Grafana</a>.',
    quickTitle: "Schnellstart",
    quickStep1Html:
      'Erstelle unter <a class="text-link" href="/dashboard/share">Dashboard → Share</a> einen Pro-API-Schlüssel.',
    quickStep2Html: 'Lade <a class="text-link" href="{href}" download>telegraf/probeharbor.conf</a> herunter und setze <code>PROBEHARBOR_API_KEY</code>, <code>INFLUX_TOKEN</code>, <code>INFLUX_ORG</code>, <code>INFLUX_BUCKET</code>.',
    quickStep3Html:
      "<code>telegraf --config probeharbor.conf</code> – prüfe, dass <code>probeharbor_sensor_value</code>-Punkte im Bucket ankommen.",
    shapeTitle: "Aufbau der Metrik",
    shapeCopyHtml:
      "Ein einzelnes Gauge <code>probeharbor_sensor_value</code> mit den Labels <code>device</code>, <code>key</code>, <code>kind</code> (<code>temperature</code>, <code>humidity</code>, <code>flood</code>, …). Nur numerische Messwerte – boolesche Werte bleiben bei Freigabe-JSON / HACS / Matter.",
    shapeFoot:
      "Selbst gehostet: Ersetze den Host in der Telegraf-URL. Wer VictoriaMetrics nutzt, kann den Output gegen Prometheus Remote Write tauschen (auskommentiertes Beispiel in der Konfiguration).",
    grafanaTitle: "Grafana funktioniert weiterhin",
    grafanaCopyHtml:
      'Lieber Dashboards als eine Langzeit-TSDB? Importiere <a class="text-link" href="/grafana/probeharbor-dashboard.json" download>probeharbor-dashboard.json</a> mit einer Prometheus-Datenquelle, die auf dieselbe Metrik-URL zeigt.',
    faqTitle: "Influx-FAQ",
    faqLede: "Telegraf-Abfrage, Pro-Schlüssel und VictoriaMetrics.",
  },

  nodeRed: {
    title: "Node-RED-MQTT-Bridge",
    kicker: "Node-RED",
    heading: "Mosquitto zu ProbeHarbor spiegeln",
    downloadFlow: "Flow-JSON herunterladen",
    createPushDevice: "Push-Gerät erstellen",
    startFreeDevices: "Kostenlos starten → Devices",
    mqttBridgeRecipe: "Rezept für die MQTT-Bridge",
    installTitle: "Installation",
    step1Html:
      'Erstelle unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein <strong>Push-Gerät</strong> und kopiere den Ingest-Schlüssel.',
    step2Html: 'In Node-RED: <strong>Menu → Import</strong> → <a class="text-link" href="{href}" download>mqtt-to-probeharbor.json</a> hochladen (oder die URL einfügen).',
    step3Html:
      "Setze die Umgebungsvariable <code>PROBEHARBOR_INGEST_KEY</code> (oder bearbeite den Function-Node). Richte die MQTT-Nodes auf deinen Broker.",
    step4: "Deployen und HTTP 200 im Debug-Node prüfen. Die Messwerte erscheinen unter Devices / Overview.",
    installFoot:
      "Der Flow begrenzt auf etwa 1 POST pro Minute und enthält einen optionalen Tab fürs Garagentor. ProbeHarbor ist kein MQTT-Broker – behalte Mosquitto im LAN.",
    postsTitle: "Was gesendet wird",
    postsLedeHtml:
      "Umschlag für <code>POST /api/ingest/mqtt</code> mit dem Header <code>X-Ingest-Key</code>:",
    relatedTitle: "Verwandte Themen",
    relatedItemsHtml: [
      '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a> – Entitäten per Freigabelink, ganz ohne Node-RED',
      '<a class="text-link" href="/integrations/matter">Matter / Apple Home</a> – Sensoren in der Home-App für denselben Haushalt',
      '<a class="text-link" href="/about/garage-door-cold-playbook">Playbook Tür + Kälte</a> – passend zum Tür-Tab',
    ],
    faqTitle: "Node-RED-FAQ",
    faqLede: "Import, Schlüssel und wie das mit Home Assistant zusammenhängt.",
  },

  smartThings: {
    title: "SmartThings über Matter",
    kicker: "SmartThings",
    heading: "Garagensensoren in SmartThings",
    matterGuide: "Anleitung zur Matter-Bridge",
    shareLink: "Freigabelink",
    startFree: "Kostenlos starten",
    vsGovee: "vs. Govee / ST-Sensoren",
    noC2cTitle: "Keine Cloud-to-Cloud-App (mit Absicht)",
    noC2cCopyHtml:
      "Ein Cloud-to-Cloud-Konnektor für Samsung SmartThings bedeutet Store-Prüfung, OAuth und einen zusätzlichen Umweg über eine zweite Cloud. ProbeHarbor hat bereits ein <strong>Matterbridge</strong>-Plugin, das Temperatur, Luftfeuchte, Leck, Tür, Strom und Bewegung aus dem Freigabelink in deinem LAN bereitstellt. SmartThings kann diese Matter-Bridge (wie Apple Home und Google Home) hinzufügen – ein Installationsweg für alle drei.",
    setupTitle: "Einrichtung",
    setupStep1Html:
      'Erstelle unter <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> einen Familien-Livelink.',
    setupStep2Html: 'Installiere Matterbridge + <a class="text-link" href="{href}" target="_blank" rel="noreferrer">probeharbor-matter</a> auf einem Pi/NAS.',
    setupStep3: "In der SmartThings-App: ein Matter-Gerät hinzufügen bzw. den Matterbridge-QR-Code scannen (wie bei anderen Matter-Bridges).",
    setupStep4: "Lass Frost-SMS über den ProbeHarbor-Push-Ingest laufen – die Matter-Abfrage dient dem schnellen Überblick und lokalen Automationen.",
    aloneTitle: "Wann ProbeHarbor allein die bessere Wahl ist",
    aloneCopyHtml:
      'Fürs Schlafzimmer sind ST-/Govee-Sensoren aus dem Handel günstiger. Für freistehende Garagen und Werkstätten schlagen ESP-Ingest und Frost-/Leckalarme für den ganzen Haushalt die Bluetooth-Reichweite der Hersteller. Siehe <a class="text-link" href="/compare/govee">ProbeHarbor vs. Govee / SmartThings</a>.',
    faqTitle: "SmartThings-FAQ",
    faqLede: "Der Matter-Weg vs. eine eigene SmartThings-Cloud-App.",
  },
};

export default de;
