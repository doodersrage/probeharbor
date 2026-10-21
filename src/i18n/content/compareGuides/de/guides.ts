import type { CompareGuideOverlay } from "../index";

export default {
  "diy-mqtt": {
    competitor: "Eigenbau-MQTT / Node-RED",
    title: "ProbeHarbor vs. Eigenbau-MQTT",
    seoTitle: "Gehostete Alternative zu Frostalarmen per Eigenbau-MQTT",
    headline: "ProbeHarbor vs. Eigenbau-MQTT + Node-RED",
    description:
      "Frost- und Leckalarme von ProbeHarbor im Vergleich zu selbst gehostetem MQTT, Node-RED und Cron: Wartung, SMS, Verlauf und Zugriff für den Haushalt.",
    summary:
      "Eigenbau-MQTT ist mächtig, wenn du gern Broker, Dashboards und Alarmskripte betreust. ProbeHarbor liefert dasselbe Ergebnis (Live-Fühler, Frost- und Leckalarme, Verlauf), ohne dass du um 2 Uhr nachts den Stack hüten musst.",
    lede:
      "Ein Mosquitto-Broker, Node-RED-Flows und ein Cronjob können dich vor Frost in der Garage warnen. Der Preis dafür: Updates, TLS, Twilio und ein Raspberry Pi, der immer laufen muss. ProbeHarbor ist die gehostete Ebene für Alarme und Verlauf: Lass MQTT im Heimnetz, wenn du willst, leite Messwerte per HTTPS weiter und überlass die Frost- und Leckalarme für deinen Haushalt der Cloud.",
    whenProbeHarbor: [
      "Du willst Frost- und Leckalarme per SMS, E-Mail oder Push, ohne Twilio selbst anzubinden",
      "Andere im Haushalt brauchen Zugriff ohne VPN zu deinem Raspberry Pi",
      "Du nutzt weiter ESP/Arduino: Versand per HTTPS oder MQTT→HTTP-Bridge",
    ],
    whenOther: [
      "Du betreibst schon einen abgesicherten MQTT- und Grafana-Stack und pflegst ihn gern",
      "Jede Automatisierung muss komplett im Heimnetz bleiben, ganz ohne Cloud",
      "Du brauchst spezielle Industrieprotokolle, die ProbeHarbor nicht spricht",
    ],
    rows: [
      { capability: "Wartung von Broker / Server", probeharbor: "Gehostet (kein Mosquitto zum Patchen)", other: "Du patchst Mosquitto/HA" },
      { capability: "Frost- und Leckalarme", probeharbor: "Integrierte Kanäle + Countdown der Reststunden bis zum Frost", other: "Node-RED + Twilio/E-Mail" },
      { capability: "Datenversand vom ESP", probeharbor: "HTTPS-Geräteschlüssel oder MQTT-Bridge", other: "MQTT-Topics selbst entwerfen" },
      { capability: "Verlauf & CSV", probeharbor: "In den Bezahlplänen", other: "Influx/Postgres in Eigenregie" },
      { capability: "Mit der Familie teilen", probeharbor: "Einladungen in den Haushalt", other: "VPN oder Reverse Proxy" },
    ],
    faqs: [
      {
        question: "Kann ich MQTT behalten und trotzdem ProbeHarbor nutzen?",
        answer:
          "Ja. Lass Mosquitto oder Home Assistant für lokale Automatisierungen im Heimnetz und leite ausgewählte Topics per HTTPS weiter. ProbeHarbor ist die externe Ebene für Frost-/Leckalarme und Verlauf.",
      },
      {
        question: "Muss ich Twilio selbst betreiben?",
        answer:
          "Nein. Push- und Chat-Kanäle sind in jedem Plan gehostet, SMS in Pro. Bei Eigenbau-MQTT musst du Twilio oder E-Mail meist selbst anbinden und diesen Stack online halten.",
      },
      {
        question: "Wo finde ich die Anleitung zur MQTT-Bridge?",
        answer:
          "Unter probeharbor.dev/about/mqtt-bridge, die HACS-Integration unter probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  govee: {
    title: "ProbeHarbor vs. Govee",
    seoTitle: "Govee-Alternative für Frostalarme in der Garage",
    headline: "ProbeHarbor vs. Govee-Sensoren",
    description:
      "Govee vs. ProbeHarbor für Frost- und Leckwarnung in unbeheizten Räumen: Alarme, ESP-Datenversand, Zonen mit mehreren Fühlern und exportierbarer Verlauf.",
    summary:
      "Govee und Consumer-Hubs wie SmartThings sind prima für günstige Raumsensoren und eine schicke App. ProbeHarbor ist für Frost- und Leckwarnung in Garagen, Werkstätten, Dachböden und Hallen gebaut: eigene ESP-Fühler, Alarme für den ganzen Haushalt und ein Verlauf, den du exportieren kannst.",
    lede:
      "Govee-Hygrometer (und Hubs im SmartThings-Stil, die dieselbe Art Bluetooth-/WLAN-Sensoren einbinden) punkten mit Preis und einer freundlichen App für Schlafzimmer und Schränke. In einer freistehenden Garage oder Werkstatt schwächeln sie: Bluetooth-Reichweite, Herstellerbindung und Alarme, die meist in der App bleiben. ProbeHarbor geht davon aus, dass du einen ESP32 mitbringst, und liefert dann Frost- und Leckalarme für den Haushalt sowie eine ganze Saison exportierbaren Verlauf.",
    whenProbeHarbor: [
      "Du willst ESP-, Pico-W-, STM32-, CH32V- oder Arduino-Fühler, die du selbst kontrollierst (nicht nur Herstellersensoren)",
      "Frost- und Leckalarme brauchen SMS, Webhooks oder Weiterleitung an den Haushalt",
      "Dir sind CSV und Verlauf über eine ganze Kältesaison wichtig",
    ],
    whenOther: [
      "Du brauchst nur ein paar batteriebetriebene Bluetooth-Sensoren in Innenräumen",
      "Du bevorzugst eine Komplett-App ohne Eigenbau-Hardware",
      "WLAN in der Garage ist unmöglich und die Bluetooth-Reichweite genügt",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Eigene: ESP / Pico / Arduino", other: "Govee-Sensoren" },
      { capability: "Garage / Nebengebäude", probeharbor: "Dafür gebaut", other: "Reichweite mal so, mal so" },
      { capability: "Alarmkanäle", probeharbor: "E-Mail, SMS, Push, Chat, Webhooks + Countdown bis zum Frost", other: "Meist App-Push" },
      { capability: "Preis", probeharbor: "Rund 25 US$ Teile pro Fühler; Free-Plan, Member 4 US$/Monat, Pro 10 US$/Monat", other: "Etwa 35–50 US$ für WLAN-Gateway + Sensor; kein Abo" },
      { capability: "Datenexport", probeharbor: "CSV (ab Member) und API (Pro)", other: "Export aus der App; bei manchen Modellen 2 Jahre gespeicherte Daten" },
      { capability: "Mehrere Nutzer pro Haushalt", probeharbor: "Inklusive", other: "Kontoteilung umständlich" },
    ],
    faqs: [
      {
        question: "Ersetzt ProbeHarbor Govee im Schlafzimmer?",
        answer:
          "Nicht in erster Linie. Govee gewinnt bei günstigen Bluetooth-Sensoren für innen und einer ausgereiften Consumer-App. ProbeHarbor ist für Frost- und Leckwarnung in Garagen, Werkstätten und anderen unbeheizten Räumen auf Hardware gedacht, die du kontrollierst.",
      },
      {
        question: "Kann ich einen ESP32 statt Govee-Sensoren verwenden?",
        answer:
          "Ja. ProbeHarbor setzt auf eigenen ESP/Pico/Arduino (oder JSON-Versand). Genau darum geht es bei freistehenden Garagen, wo die Bluetooth-Reichweite nicht reicht.",
      },
      {
        question: "Wer hat die besseren Kanäle für Frostalarme?",
        answer:
          "ProbeHarbor: E-Mail, Push und Chat-Apps in jedem Plan, SMS und Webhooks in Pro, dazu ein Countdown bis zum Frost. Govee-Alarme sind App-Benachrichtigungen, und unterwegs bekommst du sie nur mit der Version mit WLAN-Gateway.",
      },
    ],
    sources: {
      checkedOn: "September 2026",
      links: [
        { label: "GoveeLife Smart Thermometer R1 (Gateway + Sensor)" },
        { label: "Govee Wi-Fi Thermo-Hygrometer" },
      ],
    },
  },
  tempest: {
    title: "ProbeHarbor vs. Tempest",
    seoTitle: "Tempest vs. Innenfühler für Frostalarme an Leitungen",
    headline: "ProbeHarbor vs. WeatherFlow Tempest",
    description:
      "Außenwetterstationen wie Tempest vs. ProbeHarbor-Innenfühler: wenn du Frostalarme für Leitungen genau dort brauchst, wo das Wasser ist.",
    summary:
      "Tempest glänzt beim Wetter im Garten: Wind, Regen, Außentemperatur. Die Frostgefahr für Leitungen liegt aber drinnen. ProbeHarbor überwacht Garage, Kriechkeller oder Werkstatt, wo die Rohre verlaufen.",
    lede:
      "Eine Tempest auf dem Dach misst Außenluft, Wind und Regen mit hervorragender Genauigkeit. Leitungen frieren aber dort ein, wo das Wasser ist, meist in einer Garage, einem Kriechkeller oder einer Werkstatt, die die Station nie sieht. Nimm Tempest fürs Gartenwetter und ProbeHarbor für den Innenfühler direkt an den Rohren.",
    whenProbeHarbor: [
      "Du brauchst Fühlertemperaturen aus Innen- oder unbeheizten Räumen, um das Risiko für Leitungen einzuschätzen",
      "Alarme sollen auf die Raumtemperatur reagieren, nicht nur auf die Außenluft",
      "Du hast schon Eigenbau-Sensoren im WLAN oder willst welche",
    ],
    whenOther: [
      "Du willst eine erstklassige private Außenwetterstation",
      "Dein Ziel sind hyperlokale Prognosen und Unwetterdaten",
      "Bei dir besteht keine Frostgefahr für Leitungen im Haus",
    ],
    rows: [
      { capability: "Hauptaufgabe", probeharbor: "Frost- und Raumüberwachung innen", other: "Außenwetter" },
      { capability: "Fühlerstandort", probeharbor: "Garage, Kriechkeller, Abstellraum", other: "Dach / Garten" },
      { capability: "Frostalarme für Leitungen", probeharbor: "Direkt + Countdown der Stunden bis zum Frost", other: "Nur aus Außenwerten abgeleitet" },
      { capability: "Datenversand von Eigenbau-ESP", probeharbor: "Ja", other: "Entfällt" },
      { capability: "Ergänzen sich die beiden?", probeharbor: "Ja, nutze beide", other: "Ja: Kontext von draußen" },
    ],
    faqs: [
      {
        question: "Ersetzt Tempest einen Frostfühler im Haus?",
        answer:
          "Nein. Tempest misst das Wetter draußen im Garten. Die Frostgefahr für Leitungen liegt drinnen (Garage, Kriechkeller, Werkstatt). Nimm Tempest für den Außenkontext und ProbeHarbor für den Fühler an den Rohren.",
      },
      {
        question: "Kann ich Tempest und ProbeHarbor zusammen nutzen?",
        answer:
          "Ja. Viele Haushalte behalten Tempest fürs Wetter und nutzen ProbeHarbor für Temperaturalarme dort, wo tatsächlich Wasser steht.",
      },
      {
        question: "Erkennt die Außenluft allein Frost in der Garage?",
        answer:
          "Nicht zuverlässig. Garagen folgen der Außenluft verzögert und können frieren, während es im Garten milder wirkt, oder wärmer bleiben, während die Außentemperatur absackt. Miss im Raum selbst.",
      },
    ],
  },
  nest: {
    title: "ProbeHarbor vs. Nest Thermostat",
    seoTitle: "Nest-Thermostat vs. Frostsensor für die Garage",
    headline: "ProbeHarbor vs. ein Nest Thermostat zum Frostschutz in unbeheizten Räumen",
    description:
      "Ein Nest-Thermostat bekommt aus einer unbeheizten Garage kein Signal. ProbeHarbor misst dort und kann deinen Nest-Wert bei Frostalarmen anzeigen.",
    summary:
      "Nest steuert deine Heizung hervorragend und meldet die Temperatur dort, wo es (oder ein Nest Temperature Sensor) installiert ist, also fast nie in der Garage, im Kriechkeller oder in der Werkstatt, wo Leitungen tatsächlich einfrieren. ProbeHarbor überwacht diesen Raum direkt und holt, wenn du dein Nest-Konto verbindest, dessen Messwert und Heizstatus als Kontext in jeden Frostalarm.",
    lede:
      "Nest macht eine Sache sehr gut: die Heizung steuern und die Temperatur des Raums verfolgen, in dem es hängt. Eine unbeheizte Garage, ein Kriechkeller oder eine Werkstatt ist bewusst nicht klimatisiert, also hat Nest von dort überhaupt keinen Messwert, und es gibt nichts, worauf es reagieren könnte. ProbeHarbor setzt einen eigenen Fühler in diesen Raum, und wenn du dein Nest-Konto verbindest (Pro), zeigt jeder Frostalarm die Innentemperatur deines Hauses und ob gerade geheizt wird. So siehst du auf einen Blick, ob die Kälte normal ist (Garage unbeheizt, Haus in Ordnung) oder ob wirklich etwas nicht stimmt.",
    whenProbeHarbor: [
      "Du hast eine Garage, einen Kriechkeller, Keller oder eine Werkstatt außerhalb des Nest-Heizkreises",
      "Du willst einen Alarm aus genau dem unbeheizten Raum, keine Schätzung über das Thermostat",
      "Du nutzt schon Nest und willst dessen Wert neben Frostalarmen sehen, statt es zu ersetzen",
    ],
    whenOther: [
      "Du brauchst nur die Temperatur der von Nest beheizten Wohnräume",
      "Du willst Heiz- und Kühlzeiten steuern, nicht nur einen kalten Raum überwachen",
      "Du hast keinen separaten unbeheizten Raum, der einen eigenen Fühler braucht",
    ],
    rows: [
      { capability: "Hauptaufgabe", probeharbor: "Frost-/Lecküberwachung für jeden Raum", other: "Heizungs- und Klimasteuerung für beheizte Räume" },
      { capability: "Erfasst eine unbeheizte Garage / einen Kriechkeller", probeharbor: "Ja: eigener Fühler", other: "Nein: unbeheizte Räume liegen außerhalb des Kreises" },
      { capability: "Frost-/Leckalarme (SMS, Push, E-Mail)", probeharbor: "Ja, plus Countdown der Reststunden bis zum Frost", other: "Nein" },
      { capability: "Zeigt Thermostatwert bei Frostalarmen", probeharbor: "Ja, wenn verbunden (Pro)", other: "Entfällt" },
      { capability: "Steuert Heizzeiten", probeharbor: "Nein", other: "Ja" },
      { capability: "Ergänzen sich die beiden?", probeharbor: "Ja: verbinde beide", other: "Ja: verbinde beide" },
    ],
    faqs: [
      {
        question: "Sieht Nest meine unbeheizte Garage?",
        answer:
          "Meist nicht. Nest meldet den beheizten Raum, in dem es (oder ein Nest Temperature Sensor) installiert ist. Unbeheizte Garagen und Kriechkeller liegen außerhalb dieses Kreises.",
      },
      {
        question: "Kann ProbeHarbor Nest-Werte anzeigen?",
        answer:
          "Ja, in Pro, wenn Nest per OAuth verbunden ist: Frostalarme und Overview können Innentemperatur und Heizstatus des Hauses neben deinem Garagenfühler zeigen.",
      },
      {
        question: "Sollte ich Nest durch ProbeHarbor ersetzen?",
        answer:
          "Nein. Nest steuert die Heizung; ProbeHarbor überwacht unbeheizte Räume. Verbinde beide, wenn du Thermostatkontext in Frostalarmen willst.",
      },
    ],
  },
  ecobee: {
    title: "ProbeHarbor vs. Ecobee Thermostat",
    seoTitle: "Ecobee-Thermostat vs. Frostsensor für die Garage",
    headline: "ProbeHarbor vs. ein Ecobee Thermostat zum Frostschutz in unbeheizten Räumen",
    description:
      "Ein Ecobee-Thermostat bekommt aus einer unbeheizten Garage kein Signal. ProbeHarbor misst dort und kann deinen Ecobee-Wert bei Frostalarmen anzeigen.",
    summary:
      "Ecobee steuert deine Heizung hervorragend und meldet die Temperatur dort, wo es (oder ein Ecobee SmartSensor) installiert ist, also fast nie in der Garage, im Kriechkeller oder in der Werkstatt, wo Leitungen tatsächlich einfrieren. ProbeHarbor überwacht diesen Raum direkt und holt, wenn du dein Ecobee-Konto verbindest, dessen Messwert und Heizstatus als Kontext in jeden Frostalarm.",
    lede:
      "Ecobee macht eine Sache sehr gut: die Heizung steuern und die Temperatur des Raums verfolgen, in dem es hängt. Eine unbeheizte Garage, ein Kriechkeller oder eine Werkstatt ist bewusst nicht klimatisiert, also hat Ecobee von dort überhaupt keinen Messwert, und es gibt nichts, worauf es reagieren könnte. ProbeHarbor setzt einen eigenen Fühler in diesen Raum, und wenn du dein Ecobee-Konto verbindest (Pro), zeigt jeder Frostalarm die Innentemperatur deines Hauses und ob gerade geheizt wird. So siehst du auf einen Blick, ob die Kälte normal ist (Garage unbeheizt, Haus in Ordnung) oder ob wirklich etwas nicht stimmt.",
    whenProbeHarbor: [
      "Du hast eine Garage, einen Kriechkeller, Keller oder eine Werkstatt außerhalb des Ecobee-Heizkreises",
      "Du willst einen Alarm aus genau dem unbeheizten Raum, keine Schätzung über das Thermostat",
      "Du nutzt schon Ecobee und willst dessen Wert neben Frostalarmen sehen, statt es zu ersetzen",
    ],
    whenOther: [
      "Du brauchst nur die Temperatur der von Ecobee beheizten Wohnräume",
      "Du willst Heiz- und Kühlzeiten steuern, nicht nur einen kalten Raum überwachen",
      "Du hast keinen separaten unbeheizten Raum, der einen eigenen Fühler braucht",
    ],
    rows: [
      { capability: "Hauptaufgabe", probeharbor: "Frost-/Lecküberwachung für jeden Raum", other: "Heizungs- und Klimasteuerung für beheizte Räume" },
      { capability: "Erfasst eine unbeheizte Garage / einen Kriechkeller", probeharbor: "Ja: eigener Fühler", other: "Nein: unbeheizte Räume liegen außerhalb des Kreises" },
      { capability: "Frost-/Leckalarme (SMS, Push, E-Mail)", probeharbor: "Ja, plus Countdown der Reststunden bis zum Frost", other: "Nein" },
      { capability: "Zeigt Thermostatwert bei Frostalarmen", probeharbor: "Ja, wenn verbunden (Pro)", other: "Entfällt" },
      { capability: "Steuert Heizzeiten", probeharbor: "Nein", other: "Ja" },
      { capability: "Ergänzen sich die beiden?", probeharbor: "Ja: verbinde beide", other: "Ja: verbinde beide" },
    ],
    faqs: [
      {
        question: "Sieht Ecobee meine unbeheizte Garage?",
        answer:
          "Meist nicht. Ecobee meldet die beheizten Wohnräume (oder SmartSensors in diesem Kreis), standardmäßig aber keine freistehende Garage und keinen Kriechkeller.",
      },
      {
        question: "Kann ProbeHarbor Ecobee-Werte anzeigen?",
        answer:
          "Ja, in Pro, wenn Ecobee-OAuth verfügbar und verbunden ist. Ist die Entwickleranmeldung bei Ecobee geschlossen, nutze stattdessen Home Assistant → Datenversand → Innenreferenz.",
      },
      {
        question: "Sollte ich Ecobee durch ProbeHarbor ersetzen?",
        answer:
          "Nein. Ecobee steuert die Heizung; ProbeHarbor überwacht unbeheizte Räume. Die beiden ergänzen sich.",
      },
    ],
  },
  tempstick: {
    title: "ProbeHarbor vs. TempStick",
    seoTitle: "Temp-Stick-Alternative: Frostsensoren zum Selbstbauen",
    headline: "ProbeHarbor vs. Temp Stick WLAN-Sensoren",
    description:
      "Temp Stick vs. ProbeHarbor: einmalig 149–209 US$ pro Sensor mit Gratis-SMS oder 25-US$-Eigenbaufühler mit mehreren Zonen, Leckkontakten und Home Assistant.",
    summary:
      "Temp Stick ist für ein oder zwei Räume die einfachere Wahl: ein fertiger Batteriesensor, kein Abo und kostenlose Alarme per SMS, E-Mail und App. ProbeHarbor ist pro Sensor günstiger und flexibler (mehrere Fühler, Leckkontakte, Home Assistant), aber du baust den Sensor selbst, und SMS gibt es erst mit Pro.",
    lede:
      "Temp Stick verkauft fertige WLAN-Sensoren: 149 US$ für das Standardmodell oder rund 199 US$ für die PRO-Version mit Rohrschellenfühler, mit kostenlosen Alarmen per SMS, E-Mail und App und ohne Abo. Das ist kaum zu schlagen, wenn du einen einzelnen Sensor ganz ohne Einrichtung willst. ProbeHarbor passt, wenn du mehrere Fühler, einen Leckkontakt unter dem Warmwasserspeicher oder Messwerte in Home Assistant willst: Ein ESP32 mit Fühler kostet rund 25 US$, Alarme per E-Mail und Chat sind kostenlos, SMS gibt es mit Pro.",
    whenProbeHarbor: [
      "Du willst Fühler an mehreren Stellen (Leitungen, Türseite, Kriechkeller), ohne für jede einen Sensor ab 149 US$ zu kaufen",
      "Du willst Nass/Trocken-Leckkontakte und Frostalarme in einem Konto",
      "Du nutzt schon Home Assistant, ESPHome oder MQTT und willst Messwerte in beide Richtungen austauschen",
      "Du willst Frostwarnungen per Prognose, eine Schätzung der Zeit bis zum Frost oder Open-Source-Software, die du prüfen kannst",
    ],
    whenOther: [
      "Du willst einen fertigen Sensor ohne Löten, Flashen oder Einrichtung außer WLAN",
      "Du brauchst Batteriebetrieb, wo keine Steckdose ist",
      "Du willst kostenlose SMS-Alarme ohne Abo",
      "Ein oder zwei Sensoren decken alles ab, was du brauchst",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Eigenbau: ESP32 / Pico / Arduino + DS18B20 oder DHT22", other: "Fertiger Sensor mit Batterie oder Netzteil" },
      { capability: "Anschaffungskosten", probeharbor: "Rund 25 US$ Teile pro Fühler", other: "149 US$ Standard; rund 199 US$ PRO mit Rohrschelle" },
      { capability: "Laufende Kosten", probeharbor: "Free-Plan; Member 4 US$/Monat; Pro 10 US$/Monat für SMS", other: "Keine" },
      { capability: "Fühler am Rohr", probeharbor: "Ja (wasserdichter DS18B20 am Rohr)", other: "Ja bei PRO (Rohrschelle)" },
      { capability: "Leck-/Wasserkontakte", probeharbor: "Ja, automatischer Alarm bei Nässe", other: "Beim Rohrschellenmodell nicht aufgeführt" },
      { capability: "Alarmkanäle", probeharbor: "E-Mail, Push, Chat-Apps kostenlos; SMS, Webhooks in Pro", other: "SMS, E-Mail, App, alles kostenlos" },
      { capability: "Teilen und Daten", probeharbor: "Einladungen in den Haushalt, CSV (ab Member), API (Pro)", other: "Bis zu 10 Alarmkontakte, CSV-Export, öffentliche API" },
      { capability: "Home Assistant", probeharbor: "Offizielle HACS-Integration + Versand aus HA", other: "Über deren API" },
      { capability: "Prognosewarnungen", probeharbor: "Frostprognose (ab Member), NWS-Warnungen (Pro, nur USA)", other: "Nicht aufgeführt; Schwellenwertalarme" },
    ],
    faqs: [
      {
        question: "Ist Temp Stick einfacher einzurichten als ProbeHarbor?",
        answer:
          "Ja. Ein Temp Stick verbindet sich mit dem WLAN und läuft über seine App. ProbeHarbor braucht einen ESP32 oder ein ähnliches Board mit einem vorausgefüllten Sketch oder eine bestehende Home-Assistant-, ESPHome- oder MQTT-Installation.",
      },
      {
        question: "Was ist günstiger?",
        answer:
          "Für einen Sensor mit SMS Temp Stick: einmalig 149–209 US$ gegenüber rund 25 US$ Teilen plus 100 US$ pro Jahr für ProbeHarbor Pro. Für mehrere Zonen oder reine E-Mail-Alarme ProbeHarbor: Drei Fühler kosten rund 75 US$ an Teilen, und der Free-Plan enthält E-Mail-Alarme, gegenüber 447 US$ und mehr für drei Temp Sticks.",
      },
      {
        question: "Verlangt Temp Stick ein Abo?",
        answer:
          "Nein. Laut Temp Stick sind Überwachung, Datenaufzeichnung sowie Alarme per SMS, E-Mail und App für die gesamte Lebensdauer des Sensors kostenlos.",
      },
      {
        question: "Kann ProbeHarbor eine leerstehende Hütte überwachen wie ein Temp Stick?",
        answer:
          "Ja, wenn die Hütte WLAN und Strom für einen ESP32 hat. Setz einen wasserdichten Fühler an die kälteste Leitung, ergänze bei Bedarf einen Leckkontakt und wähle E-Mail-Alarme (kostenlos) oder SMS (Pro).",
      },
    ],
    sources: {
      checkedOn: "September 2026",
      links: [
        { label: "Temp Stick WLAN-Sensor (149 US$)" },
        { label: "Temp Stick PRO mit Rohrschelle" },
        { label: "Temp Stick häufige Fragen (Gebühren, Kontakte, Export, API)" },
      ],
    },
  },
  yolink: {
    title: "ProbeHarbor vs. YoLink",
    seoTitle: "YoLink-Alternative für Frostalarme an Leitungen",
    headline: "ProbeHarbor vs. YoLink-Temperatursensoren",
    description:
      "YoLink vs. ProbeHarbor: ein Hub-Set für 59,99 US$ mit fertigen Batteriesensoren und SMS oder Eigenbaufühler direkt am Rohr mit Open-Source-Software.",
    summary:
      "YoLink ist bei fertigen Sensoren die einfachere und oft günstigere Wahl: Ein Hub mit zwei Batteriesensoren kostet 59,99 US$ und alarmiert per Push, E-Mail und SMS. ProbeHarbor passt, wenn du einen Fühler direkt am Rohr, keinen Hub, eigene Hardware oder Messwerte in einem offenen System willst.",
    lede:
      "YoLink verkauft einen Hub mit zwei batteriebetriebenen Temperatur- und Feuchtesensoren für 59,99 US$. Die Sensoren sind für −30 °C bis 60 °C (−22 °F bis 140 °F) ausgelegt, laufen mit zwei Batterien zwei Jahre oder länger und senden Alarme per Push, E-Mail und SMS. Für die meisten, die ein fertiges Produkt für eine kalte Garage wollen, ist das eine starke Option. ProbeHarbor passt besser, wenn du einen wasserdichten Fühler direkt am Rohr, Leckkontakte und Frostalarme an einem Ort, keinen proprietären Hub oder Software willst, die du lesen und selbst hosten kannst: Ein ESP32 mit Fühler kostet rund 25 US$, Alarme per E-Mail und Chat sind kostenlos, SMS gibt es mit Pro.",
    whenProbeHarbor: [
      "Du willst einen wasserdichten Fühler direkt am Rohr statt eines Raumsensors an der Wand",
      "Du nutzt schon Home Assistant, ESPHome oder MQTT und willst ein weiteres Ziel, keinen weiteren Hub",
      "Du willst Open-Source-Software, eine HTTP-API, an die jedes Board senden kann, und keine Herstellerhardware",
      "Du willst neben Schwellenwertalarmen auch Frostwarnungen per Prognose und eine Schätzung der Zeit bis zum Frost",
    ],
    whenOther: [
      "Du willst fertige Batteriesensoren ohne Verkabeln oder Flashen",
      "Wo der Sensor hin muss, gibt es keine Steckdose",
      "Du willst Push-, E-Mail- und SMS-Alarme aus der App eines einzigen Herstellers",
      "Der Raum ist weit von deinem WLAN entfernt, und ein Hub mit großer Reichweite passt besser",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Eigenbau: ESP32 / Pico / Arduino + DS18B20 oder DHT22", other: "Fertiger Batteriesensor; YoLink-Hub erforderlich" },
      { capability: "Anschaffungskosten", probeharbor: "Rund 25 US$ Teile pro Fühler", other: "59,99 US$ für einen Hub und zwei Sensoren" },
      { capability: "Laufende Kosten", probeharbor: "Free-Plan; Member 4 US$/Monat; Pro 10 US$/Monat für SMS", other: "Auf der Produktseite nicht angegeben" },
      { capability: "Für Räume mit Frost ausgelegt", probeharbor: "Ja (DS18B20-Fühler: −55 °C bis 125 °C (−67 °F bis 257 °F))", other: "Ja (−30 °C bis 60 °C (−22 °F bis 140 °F))" },
      { capability: "Stromversorgung", probeharbor: "USB am Board", other: "Zwei Batterien, voraussichtlich 2+ Jahre" },
      { capability: "Fühler am Rohr", probeharbor: "Ja (wasserdichter DS18B20 am Rohr)", other: "Separater Außensensor mit Fühler (YS8005)" },
      { capability: "Alarmkanäle", probeharbor: "E-Mail, Push, Chat-Apps kostenlos; SMS, Webhooks in Pro", other: "Push, E-Mail, SMS" },
      { capability: "Datenexport", probeharbor: "CSV (ab Member), API (Pro)", other: "CSV-Export" },
      { capability: "Home Assistant", probeharbor: "Offizielle HACS-Integration + Versand aus HA", other: "Als kompatibel aufgeführt" },
    ],
    faqs: [
      {
        question: "Ist YoLink günstiger als ProbeHarbor?",
        answer:
          "Bei fertigen Sensoren meist ja. Der YoLink-Hub mit zwei Sensoren kostet 59,99 US$. Zwei ProbeHarbor-Fühler kosten rund 50 US$ an Teilen, und der Free-Plan enthält E-Mail-Alarme, aber du baust sie selbst, und SMS braucht Pro.",
      },
      {
        question: "Braucht YoLink einen Hub?",
        answer:
          "Ja. YoLink-Sensoren sprechen mit einem YoLink-Hub, der mit deinem Netzwerk verbunden ist. ProbeHarbor-Geräte senden direkt ins Internet, per WLAN, Ethernet oder Mobilfunk, ganz ohne Hub.",
      },
      {
        question: "Funktionieren YoLink-Sensoren in einer unbeheizten Garage?",
        answer:
          "Ja. YoLink gibt seinen YS8003-Sensor für −30 °C bis 60 °C (−22 °F bis 140 °F) an und nennt Gefriergeräte als Einsatzzweck.",
      },
      {
        question: "Warum ProbeHarbor statt YoLink?",
        answer:
          "Wegen der Fühlerposition und der Offenheit: ein wasserdichter Fühler an der kältesten Leitung, mehrere Fühler an einem Board, Leckkontakte im selben Konto und Open-Source-Software, die Messwerte von jedem Gerät annimmt, das eine HTTPS-Anfrage senden kann.",
      },
    ],
    sources: {
      checkedOn: "Oktober 2026",
      links: [
        { label: "YoLink-Hub mit zwei Temperatur- und Feuchtesensoren (59,99 US$)" },
        { label: "YoLink YS8003 Datenblatt (Messbereich, Batterie, Alarme)" },
      ],
    },
  },
  sensorpush: {
    title: "ProbeHarbor vs. SensorPush",
    seoTitle: "SensorPush-Alternative für Frostalarme aus der Ferne",
    headline: "ProbeHarbor vs. SensorPush-Sensoren",
    description:
      "SensorPush vs. ProbeHarbor: genaue Bluetooth-Sensoren, die für Fernalarme ein Gateway für 99,95 US$ brauchen, oder WLAN-Eigenbaufühler direkt am Rohr.",
    summary:
      "SensorPush baut kleine, genaue Bluetooth-Sensoren mit einer ausgereiften App und ohne Monatsgebühr, aber für Alarme unterwegs brauchst du das WLAN-Gateway für 99,95 US$. ProbeHarbor-Fühler melden sich direkt per WLAN und können am Rohr sitzen; du baust sie selbst, und SMS braucht Pro.",
    lede:
      "SensorPush-Sensoren sind kompakt und genau: Der HT1 kostet 54,95 US$, der wassergeschützte HT.w 69,99 US$, beide ausgelegt für −40 °C bis 60 °C (−40 °F bis 140 °F) mit einem Jahr oder mehr Batterielaufzeit. Es sind Bluetooth-Sensoren, dein Handy muss also in Reichweite sein, außer du ergänzt das G1 Wi‑Fi Gateway für 99,95 US$, das Cloud-Zugriff ohne Monatsgebühr sowie Alarme in der App und per E-Mail enthält. ProbeHarbor fängt am anderen Ende an: Ein ESP32 mit wasserdichtem Fühler (rund 25 US$ an Teilen) meldet sich selbst per WLAN, Alarme per E-Mail und Chat sind kostenlos, und Leckkontakte, Prognosewarnungen und Home Assistant sind eingebaut. SMS gibt es mit Pro.",
    whenProbeHarbor: [
      "Du willst Fernalarme, ohne ein Gateway zu kaufen",
      "Du willst einen wasserdichten Fühler am Rohr oder mehrere Fühler an einem Board",
      "Du willst Alarme per SMS, Chat-App oder Webhook oder einen Leckkontakt im selben Konto",
      "Du nutzt Home Assistant, ESPHome oder MQTT und willst die Messwerte dort haben",
    ],
    whenOther: [
      "Du willst einen kleinen fertigen Sensor mit einem Jahr oder mehr Batterielaufzeit",
      "Du bist meist zu Hause, die Bluetooth-Reichweite zum Handy genügt also",
      "Du willst sehr genaue Lufttemperatur und -feuchte (Humidor, Instrumentenkoffer oder Weinlager)",
      "Du bevorzugst einen einmaligen Kauf ohne Plan, um den du dich kümmern musst",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Eigenbau: ESP32 / Pico / Arduino + DS18B20 oder DHT22", other: "Fertiger Bluetooth-Sensor" },
      { capability: "Anschaffungskosten", probeharbor: "Rund 25 US$ Teile pro Fühler", other: "54,95 US$ (HT1) oder 69,99 US$ (HT.w) pro Sensor" },
      { capability: "Alarme unterwegs", probeharbor: "Ja, Sensoren melden sich per WLAN", other: "Braucht das G1 Wi‑Fi Gateway (99,95 US$)" },
      { capability: "Laufende Kosten", probeharbor: "Free-Plan; Member 4 US$/Monat; Pro 10 US$/Monat für SMS", other: "Keine; Gateway-Cloud ohne Monatsgebühr" },
      { capability: "Für Räume mit Frost ausgelegt", probeharbor: "Ja (DS18B20-Fühler: −55 °C bis 125 °C (−67 °F bis 257 °F))", other: "Ja (−40 °C bis 60 °C (−40 °F bis 140 °F))" },
      { capability: "Alarmkanäle", probeharbor: "E-Mail, Push, Chat-Apps kostenlos; SMS, Webhooks in Pro", other: "In der App und per E-Mail; SMS nicht aufgeführt" },
      { capability: "Stromversorgung", probeharbor: "USB am Board", other: "Batterie: über 1 Jahr (HT1), über 2 Jahre (HT.w)" },
      { capability: "API", probeharbor: "HTTP-Datenversand in jedem Plan; API-Schlüssel in Pro", other: "API für die Gateway-Cloud" },
    ],
    faqs: [
      {
        question: "Funktioniert SensorPush ohne Gateway?",
        answer:
          "Ja, per Bluetooth, wenn dein Handy in Reichweite ist (SensorPush nennt rund 100 Meter (325 Fuß) bei Sichtverbindung). Um unterwegs Messwerte zu sehen oder Alarme zu bekommen, brauchst du das G1 Wi‑Fi Gateway.",
      },
      {
        question: "Verlangt SensorPush ein Abo?",
        answer:
          "Nein. Laut SensorPush hat der im G1 Wi‑Fi Gateway enthaltene Cloud-Dienst keine Monatsgebühr.",
      },
      {
        question: "Was ist für Frostalarme aus der Ferne günstiger?",
        answer:
          "Für einen Sensor mit Fernalarmen kostet SensorPush einmalig 154,90 US$ (HT1 plus Gateway). Ein ProbeHarbor-Fühler kostet rund 25 US$ an Teilen mit kostenlosen E-Mail-Alarmen, oder 100 US$ mehr pro Jahr, wenn du SMS mit Pro willst. Jeder weitere SensorPush-Sensor kostet 54,95 US$; jeder weitere ProbeHarbor-Fühler rund 25 US$, oder weniger, wenn sie sich ein Board teilen.",
      },
      {
        question: "Ist SensorPush genauer?",
        answer:
          "Bei der Lufttemperatur ja: SensorPush gibt für den HT1 typisch ±0,3 °C (±0,5 °F) an, ein DS18B20 liegt bei etwa ±0,5 °C (±1 °F). Für einen Frostalarm reicht beides locker, denn die Alarmschwelle sollte ohnehin ein paar Grad über 0 °C (32 °F) liegen.",
      },
    ],
    sources: {
      checkedOn: "Oktober 2026",
      links: [
        { label: "SensorPush HT1 Sensor (54,95 US$)" },
        { label: "SensorPush HT.w wassergeschützter Sensor (69,99 US$)" },
        { label: "SensorPush G1 Wi‑Fi Gateway (99,95 US$; Cloud, Alarme, API)" },
      ],
    },
  },
  shelly: {
    title: "ProbeHarbor vs. Shelly H&T",
    seoTitle: "Shelly H&T für Frostalarme: Grenzen und Alternativen",
    headline: "ProbeHarbor vs. Shelly H&T Gen3 für Frostalarme",
    description:
      "Shelly H&T Gen3: guter Raumsensor für 40,99 US$, aber nur für 0–40 °C ausgelegt, nicht für eine Garage mit Frost. So unterscheidet sich ein Rohrfühler.",
    summary:
      "Der Shelly H&T Gen3 ist ein ordentlicher WLAN-Raumsensor für 40,99 US$ mit Display, MQTT und Webhooks. Shelly gibt ihn allerdings nur für 0 °C bis 40 °C (32 °F bis 105 °F) an, was ihn für Räume ausschließt, in denen es wirklich friert. ProbeHarbor nutzt einen Fühler, der weit unter den Gefrierpunkt ausgelegt ist, direkt am Rohr.",
    lede:
      "Der Shelly H&T Gen3 kostet 40,99 US$, läuft rund ein Jahr mit vier AA-Batterien oder über USB‑C, zeigt Temperatur und Luftfeuchte auf einem E-Paper-Display und spricht WLAN, MQTT und Webhooks. Für einen beheizten Raum ist er ein guter Sensor. Shelly gibt als Umgebungs-Betriebstemperatur 0 °C bis 40 °C (32 °F bis 105 °F) und 30–70 % Luftfeuchte an, eine unbeheizte Garage oder ein Kriechkeller bei einer Kältewelle liegt also außerhalb seiner Spezifikation. ProbeHarbor ist für genau diese Räume gebaut: ein wasserdichter DS18B20-Fühler, ausgelegt bis −55 °C (−67 °F), direkt am Rohr, mit Frost-, Leck- und Ausfallalarmen und Prognosewarnungen. Wenn du drinnen schon Shelly-Geräte nutzt, können deren Messwerte über Home Assistant oder MQTT zu ProbeHarbor gelangen.",
    whenProbeHarbor: [
      "Der Raum kann unter 0 °C (32 °F) fallen, also außerhalb des spezifizierten Bereichs des Shelly H&T",
      "Du willst den Messwert am Rohr unter der Dämmung, nicht die Raumluft",
      "Du willst Frost-, Leck- und Offline-Alarme und eine Prognosewarnung, ohne Automatisierungen zu bauen",
      "Du willst, dass andere im Haushalt die Alarme über Haushaltseinladungen bekommen",
    ],
    whenOther: [
      "Du überwachst einen beheizten Raum: Keller, Hauswirtschaftsraum oder Wohnbereich",
      "Du willst einen Batteriesensor mit Display und ohne Kabel",
      "Du nutzt schon die Shelly-App, Home Assistant oder MQTT und baust den Alarm selbst",
      "Die Luftfeuchte in einem beheizten Raum ist dir wichtiger als die Rohrtemperatur",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Eigenbau: ESP32 / Pico / Arduino + DS18B20 oder DHT22", other: "Fertiger WLAN-Sensor mit E-Paper-Display" },
      { capability: "Anschaffungskosten", probeharbor: "Rund 25 US$ Teile pro Fühler", other: "40,99 US$" },
      { capability: "Spezifizierte Betriebstemperatur", probeharbor: "DS18B20-Fühler: −55 °C bis 125 °C (−67 °F bis 257 °F)", other: "0 °C bis 40 °C (32 °F bis 105 °F)" },
      { capability: "Fühler am Rohr", probeharbor: "Ja (wasserdichter DS18B20 am Rohr)", other: "Nein; misst die Luft am Gerät" },
      { capability: "Stromversorgung", probeharbor: "USB am Board", other: "4 AA-Batterien (rund 1 Jahr) oder USB‑C" },
      { capability: "Lokale Integrationen", probeharbor: "Home Assistant (HACS), ESPHome, MQTT-Bridge", other: "MQTT und Webhooks (URL-Aktionen)" },
      { capability: "Leck-/Wasserkontakte", probeharbor: "Ja, automatischer Alarm bei Nässe", other: "Nicht bei diesem Gerät" },
    ],
    faqs: [
      {
        question: "Kann man einen Shelly H&T in einer unbeheizten Garage verwenden?",
        answer:
          "Shelly gibt für den H&T Gen3 eine Umgebungs-Betriebstemperatur von 0 °C bis 40 °C (32 °F bis 105 °F) an. Eine Garage, in der es friert, liegt außerhalb dieses Bereichs, für einen Frostalarm dort ist er also das falsche Werkzeug.",
      },
      {
        question: "Kann ein Shelly-Gerät Messwerte an ProbeHarbor senden?",
        answer:
          "Ja. Für einen H&T führt der einfachste Weg über Home Assistant oder MQTT, wofür ProbeHarbor eine Integration und eine Bridge-Anleitung hat. Die Anleitung zu ESPHome- und Shelly-Rezepten unter probeharbor.dev/about/esphome-shelly-recipes beschreibt den direkten Versand von Shelly-Plus- und Gen2-Modulen.",
      },
      {
        question: "Ist ein Shelly H&T günstiger als ein ProbeHarbor-Fühler?",
        answer:
          "Nein. Der H&T Gen3 kostet 40,99 US$; ein ESP32 mit wasserdichtem DS18B20 kommt auf rund 25 US$ an Teilen. Der Shelly ist fertig und batteriebetrieben, dafür zahlst du den Aufpreis.",
      },
    ],
    sources: {
      checkedOn: "Oktober 2026",
      links: [
        { label: "Shelly H&T Gen3 Produktseite und technische Daten (40,99 US$)" },
        { label: "Wasserdichter DS18B20, technische Daten (Adafruit)" },
      ],
    },
  },
} satisfies CompareGuideOverlay;
