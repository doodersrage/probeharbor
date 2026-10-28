/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */
import type { FlashMessages } from "./en";

const de: FlashMessages = {
  title: "ESP32-Frostsensor im Browser flashen",
  description:
    "Mach aus einem ESP32 und einem DS18B20-Fühler einen Frostsensor, ohne IDE: im Browser flashen, WLAN und Geräteschlüssel eingeben, fertig.",
  breadcrumbHome: "Start",
  breadcrumbFlash: "Web-Flasher",
  faqs: [
    {
      question: "Was brauche ich?",
      answer:
        "Ein ESP32-Board (getestet ist der originale ESP32; ESP32-S3 und ESP32-C3 sind gebaut, aber noch nicht auf Hardware getestet), einen wasserdichten DS18B20-Fühler oder einen DHT22-Sensor für Temperatur und Luftfeuchtigkeit (ein DHT11 wird unterstützt, ist aber noch nicht auf Hardware getestet) mit 4,7-kΩ-Pull-up-Widerstand an GPIO 4, ein USB-Datenkabel sowie Chrome oder Edge auf einem Desktop-PC oder Laptop.",
    },
    {
      question: "Brauche ich die Arduino IDE?",
      answer:
        "Nein. Die Firmware ist vorkompiliert und wird vom Browser installiert. WLAN und Geräteschlüssel werden nach dem Flashen ans Board geschickt, du musst also nichts kompilieren.",
    },
    {
      question: "Kann ich mehr als einen Fühler anschließen?",
      answer:
        "Ja, bis zu vier DS18B20-Fühler am selben Pin. Sie melden sich als temp1 bis temp4 und lassen sich im Dashboard umbenennen. Ein DHT22 ist ein Sensor pro Board.",
    },
    {
      question: "Was kann ich noch anschließen?",
      answer:
        "Einen I²C-Sensor für Temperatur und Luftfeuchtigkeit (BME280, SHT31 oder AHT20, wird automatisch erkannt; ein BME280 meldet zusätzlich den Luftdruck), einen Leck- oder Wasserkontakt für Überschwemmungsalarme, einen magnetischen Türschalter und einen Akku über einen 1:1-Spannungsteiler für die Schätzung der Akkulaufzeit. Hake beim Senden der Einstellungen Leck, Tür und Akku an, damit das Board weiß, dass sie angeschlossen sind. Bisher auf Hardware getestet: der BME280 und der Türschalter. SHT31, AHT20, Leck und Akku sind eingebaut, aber noch nicht auf Hardware getestet.",
    },
    {
      question: "Funktioniert es mit einem DHT22?",
      answer:
        "Ja. Er wird genauso verkabelt (Daten an GPIO 4, 4,7 kΩ an 3,3 V). Die Firmware sucht zuerst nach DS18B20-Fühlern und liest, wenn keine da sind, einen DHT22 oder DHT11 an diesem Pin aus, mit Temperatur und Luftfeuchtigkeit. Am Rohr ist ein DS18B20 die bessere Wahl; ein DHT22 eignet sich für Raumluft und Feuchte im Kriechkeller oder Keller.",
    },
    {
      question: "Wie bringe ich das Board in ein anderes Netzwerk?",
      answer:
        "Halte die BOOT-Taste fünf Sekunden gedrückt, um das gespeicherte WLAN und den Geräteschlüssel zu löschen, und sende dann neue Einstellungen über diese Seite oder über das Netzwerk ProbeHarbor-Setup.",
    },
    {
      question: "Ist die Firmware Open Source?",
      answer:
        "Ja. Der Quellcode liegt im ProbeHarbor-Repository unter firmware/probeharbor-probe, zusammen mit Sketches, die du selbst bearbeiten und flashen kannst.",
    },
  ],
  buy: {
    board: "Board (eins auswählen)",
    s3c3: "Oder ein S3-/C3-Board (noch nicht auf Hardware getestet; Verfügbarkeit schwankt)",
    sensor: "Sensor an GPIO 4",
    i2c: "Oder ein I²C-Luftsensor (kein Widerstand nötig)",
    extras: "Optionale Extras",
    ds18b20: "Wasserdichter DS18B20-Fühler",
    resistor4k7: "4,7-kΩ-Widerstände",
    bme280: "BME280 (mit Luftdruck)",
    reed: "Magnetischer Türschalter",
    resistor100k: "100-kΩ-Widerstände (Akku-Spannungsteiler)",
  },
  kicker: "Einrichtung · Beta",
  heading: "Frostsensor im Browser flashen",
  lede: "Keine Arduino IDE, kein Code zum Anpassen. Schließ einen DS18B20-Fühler oder einen DHT22 an einen ESP32 an, installiere die Firmware über diese Seite und schick ihm dann WLAN und Geräteschlüssel über dasselbe USB-Kabel.",
  getKey: "Geräteschlüssel holen",
  startFreeGetKey: "Kostenlos starten → Geräteschlüssel holen",
  partsAndWiring: "Teileliste und Verkabelung",
  beforeTitle: "Bevor du anfängst",
  wireHtml:
    'Verkable den Sensor: Versorgung an 3,3 V, Masse an GND, Daten an GPIO 4, mit einem 4,7-kΩ-Widerstand zwischen Daten und 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">Schaltplan</a>). Das gilt für einen DS18B20-Fühler (rote, schwarze, gelbe Ader) genauso wie für einen DHT22; die Firmware erkennt, welcher angeschlossen ist.',
  extrasIntro: "Optionale Extras an diesen Pins (jeder Schalter oder Kontakt kommt zwischen Pin und GND):",
  pinTable: {
    connect: "Anschluss",
    data: "DS18B20- oder DHT22-Daten",
    i2c: "I²C-Sensor SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Leck-/Wasserkontakt",
    door: "Tür-Reedschalter",
    battery: "Akku + über 1:1-Teiler (2 × 100 kΩ)",
  },
  i2cNote:
    "I²C-Sensoren werden automatisch erkannt; hake unten Leck, Tür oder Akku an, damit das Board weiß, dass sie angeschlossen sind.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 oder ESP32 Feather V2):</strong> Nimm die ESP32-Spalte. Die Fühlerdaten (GPIO 4) liegen am Pin mit der Beschriftung A5, der Türschalter (GPIO 26) an A0, und der Leckkontakt kommt an Pin 27. Der Akku-Spannungsteiler ist schon auf dem Board: Steck einen LiPo-Akku in die Akkubuchse und hake Akku an, Widerstände brauchst du nicht. Ein I²C-Sensor kommt an die SDA/SCL-Pins des Feather oder an seinen STEMMA-QT-Port; die Firmware findet ihn beim Start (nach dem Anstecken einmal stromlos machen). Feathers haben keine BOOT-Taste an GPIO 0, daher funktioniert der 5-Sekunden-Reset nicht; um das WLAN zu wechseln, sende stattdessen neue Einstellungen über diese Seite.",
  deviceKeyHtml:
    'Lege unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein Push-Gerät an und kopiere seinen Geräteschlüssel. Im kostenlosen Tarif sind zwei Geräte enthalten.',
  buyTitle: "Was du kaufen solltest",
  buyIntro:
    "Teile, die zu den Pins oben passen. Ein normaler ESP32 ist die getestete Wahl. Die S3- und C3-Links führen zu Espressifs eigenen Entwicklerboards, für die die Firmware gebaut ist; sind sie ausverkauft, sollte auch ein anderes ESP32-S3-DevKitC-1- oder ESP32-C3-DevKitM-1-Board (oder ein Klon mit derselben Pinbelegung) funktionieren; S3- und C3-Boards sind aber noch nicht auf Hardware getestet.",
  leakHtml:
    '<strong>Lecksensor:</strong> Die einfachste günstige Lösung ist ein LM393-Modul „Regen-/Wassersensor“ (gibt es in vielen Shops): VCC an den 3,3-V-Pin des Boards (nie 5 V, damit sein Ausgang für den ESP32 sicher bleibt), GND an GND, DO an den Leck-Pin. Dreh am Poti, bis ein Wassertropfen „nass“ ergibt, und prüfe dann, dass er wieder „trocken“ meldet. Die offenen Kontaktflächen korrodieren, wenn sie nass bleiben, also sieh ihn als Einsteigerteil. Für eine langlebigere Installation nimm zwei Edelstahlschrauben oder -spitzen im Abstand von etwa 5&nbsp;mm, eine an den Leck-Pin und eine an GND. So oder so: Teste mit deinem eigenen Wasser, denn sehr sauberes Wasser oder ein dünner Film lösen ihn eventuell nicht aus. Sensoren, deren Ausgang bei Nässe auf High geht, etwa der Wassersensor von Adafruit, brauchen einen anderen Eingang und funktionieren mit dieser Firmware nicht.',
  afterTitle: "Wenn er läuft",
  afterHtml:
    'Messwerte kommen einmal pro Minute an. Befestige den Fühler am kältesten Rohr, stell unter <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> eine Frostschwelle von 1–3 °C (34–38 °F) ein und sende einen Testalarm. Lies, <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">wo der Sensor hingehört</a> und <a class="text-link" href="/answers/freeze-alarm-temperature-setting">bei welcher Temperatur du alarmieren solltest</a>. Du bearbeitest den Code lieber selbst? Die <a class="text-link" href="/about/esp32-web-flash">anderen Flash-Optionen</a> decken Arduino, PlatformIO, MicroPython und ESPHome ab.',
};

export default de;
