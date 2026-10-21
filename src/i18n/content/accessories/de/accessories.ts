import type { AccessoryOverlay } from "../index";

export default {
  "claim-puck": {
    tagline:
      "USB-Anwesenheitsschlüssel: Bereich per Tastendruck beanspruchen, dann Frost- und Hochwasser-Stimmungen auf einer RP2040-Zero-LED anzeigen.",
  },
  "alert-beacon": {
    tagline:
      "Stimmungslicht für Schreibtisch oder Flur, das die Frost-/Hochwasser-Stimmungen von Bay Buddy spiegelt. Kein Temperaturfühler.",
  },
  "door-puck": {
    name: "Door puck (Türkontakt)",
    tagline:
      "Reed- oder Tasterkontakt, der Tür offen/zu per POST an den Ingest meldet – für die drafty-Stimmung und eigene Alarme.",
  },
  "leak-puck": {
    name: "Leak puck (Leckkontakt)",
    tagline:
      "Wasserkontakte, die nass/trocken als Hochwassersensor per POST melden. Bei aktivierten Alarmen alarmiert ProbeHarbor bei Nässe automatisch.",
  },
  "power-nudge": {
    name: "Power nudge (Stromausfall)",
    tagline:
      "USB-, Netz- oder USV-Kontakt, der Stromausfall und -rückkehr per POST meldet, damit du weißt, wann der Bereich dunkel wurde.",
  },
  "kit-labels": {
    name: "QR- und NFC-Etiketten fürs Kit",
    shortName: "Kit-Etiketten",
    tagline:
      "Druckbare QR-Aufkleber und optionale NFC-Tags mit deiner Push-Ingest-URL – einrichten, ohne Schlüssel abzutippen.",
  },
  "probe-mount-kit": {
    name: "Fühler-Montageset",
    shortName: "Montageset",
    tagline:
      "Kabelbinder, Rohrclips, Klebepads, 4,7k-Pull-up und Montagetipps für den wasserdichten DS18B20 – für einen zuverlässigen Frostfühler.",
  },
  "claim-puck-case": {
    name: "Gehäuse für den Claim puck",
    shortName: "Puck-Gehäuse",
    tagline:
      "Gehäuse, Taster und optionaler LED-Diffusor für den Claim puck mit RP2040-Zero – aus der nackten Platine wird ein fertiges Gerät.",
  },
} satisfies AccessoryOverlay;
