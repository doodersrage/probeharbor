import type { AboutPhotoOverlay } from "../index";

/** German alt text and captions for about-page photos. Credits and licenses stay English. */
export default {
  "frost-window": {
    alt: "Farnartige Eiskristalle auf einer dunklen Fensterscheibe",
    caption: "Eisblumen entstehen, wenn feuchte Luft auf eine Oberfläche unter dem Gefrierpunkt trifft.",
  },
  "utility-pipes": {
    alt: "Kupferwasserleitungen, Absperrventil und Wasserzähler an einer Betonwand im Hausanschlussraum",
    caption: "Frostalarme zählen vor allem dort, wo Leitungen frei liegen und Wände ungedämmt sind.",
  },
  "basement-pex-pipes": {
    alt: "Blaue PEX- und Kupferwasserleitungen mit Ventilen an einer Kellerdecke",
    caption: "Versorgungsleitungen in Kellern und Kriechkellern sind das Frostrisiko, das Verlaufsdiagramme belegen.",
  },
  "crawlspace": {
    alt: "Niedriger Kriechkeller unter einem Haus mit Erdboden und Fundamentwänden",
    caption: "Kriechkeller und Hohlräume unter dem Boden werden kälter als der Wohnraum: Die Platzierung der Fühler entscheidet.",
  },
  "attic-insulation": {
    alt: "Handwerker verlegt Glaswolle-Dämmmatten zwischen den Dachsparren",
    caption: "Dachböden und Dächer schwanken stark: Dämmung und Fühlerplatzierung bestimmen, was du tatsächlich misst.",
  },
  "greenhouse": {
    alt: "Kleines Gewächshaus im Garten, aus dessen Dachfenstern Weinreben wachsen",
    caption: "Gewächshäuser und Werkstätten brauchen ein Auge auf Feuchte und Hitze, nicht nur auf Frostschwellen.",
  },
  "frozen-thermometer": {
    alt: "Vereistes Außenthermometer mit Raureif auf Skala und Gehäuse",
    caption: "Die Außenluft kann unbedenklich wirken, während eine kalte Ecke der Garage schon unter der Schwelle liegt.",
  },
  "network-switch": {
    alt: "Gestapelte Netzwerk-Switches mit eingesteckten Ethernet-Kabeln an der Vorderseite",
    caption: "Pull-Feeds, MQTT-Bridges und LAN-Relays laufen oft über einen Switch, bevor sie das Gebäude verlassen.",
  },
  "cold-weather-road": {
    alt: "Person in extremer Kälte hält ein Außenthermometer, das weit unter null anzeigt",
    caption: "Regionale Kälteeinbrüche können eine angebaute Garage, Werkstatt oder einen Kriechkeller härter treffen, als Wetter-Apps vermuten lassen.",
  },
  "snow-cabins": {
    alt: "Verschneite Berghütten mit hohen Schneeverwehungen an den Holzwänden",
    caption: "Leere Hütten fallen mitten in der Woche unbemerkt aus: Alarme zählen, wenn niemand vor Ort ist.",
  },
  "server-rack": {
    alt: "Reihen beleuchteter Serverschränke in einem dicht belegten Rechenzentrumsgang",
    caption: "Technikschränke und Homelab-Racks brauchen eine Hitzeüberwachung so sehr wie Garagen Frost- und Leckalarme.",
  },
  "dht22-module": {
    alt: "Aosong-AM2302-DHT22-Temperatur- und Feuchtesensormodul auf einer schwarzen Breakout-Platine",
    caption: "Der DHT22 (AM2302) ist der digitale Feuchte- und Temperatursensor, der in vielen Selbstbau-Projekten steckt.",
  },
  "arduino-uno-board": {
    alt: "Draufsicht auf eine blaue Arduino-Uno-Mikrocontrollerplatine vor weißem Hintergrund",
    caption: "Arduino-kompatible Boards führen den Sketch aus, der die Fühler abfragt und JSON veröffentlicht.",
  },
  "arduino-dht11": {
    alt: "Arduino Uno, mit drei Steckbrücken an einen DHT-Temperatur- und Feuchtesensor angeschlossen",
    caption: "Ein minimaler Aufbau aus Mikrocontroller und Sensor, bevor Ethernet, LCD und zwei Fühler dazukommen.",
  },
  "garage-workbench": {
    alt: "Schleifbock auf einer Holzwerkbank vor einer Ziegelwand in der Garage, daneben Werkzeug",
    caption: "Werkstätten und Garagen schwanken stärker als Wohnräume: Die Platzierung zählt mehr als die Sensormarke.",
  },
  "home-workshop": {
    alt: "Vollgestellte Hobbywerkstatt mit Werkbank, Werkzeug, Holz und vollen Regalen",
    caption: "Schwankungen von Feuchte und Temperatur zählen, wenn Werkzeug, Holz und Farbe im selben Raum lagern.",
  },
  "ethernet-cable": {
    alt: "Nahaufnahme weißer Cat-5e-Ethernet-Kabel mit RJ45-Steckern",
    caption: "Das Fühler-JSON verlässt das LAN meist über Ethernet oder ein nahes Relay, nicht direkt übers öffentliche Internet.",
  },
  "desk-workspace": {
    alt: "Schreibtisch zu Hause mit Laptop, externem Monitor und Tastatur im Wohnbereich",
    caption: "Alle im Haushalt sehen dasselbe Dashboard, egal wo sie gerade arbeiten.",
  },
} satisfies AboutPhotoOverlay;
