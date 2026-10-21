import type { AboutNavigationOverlay } from "../index";

export default {
  megaGroups: {
    environment: {
      title: "Umgebung der Fühler",
      description: "Fühler, Platzierung und die Physik, die Messwerte bewegt.",
    },
    history: {
      title: "Daten & Verlauf",
      description: "Gespeicherte Snapshots, Exporte und wie Messwerte in den Speicher gelangen.",
    },
    hardware: {
      title: "Hardware & Firmware",
      description: "Firmware für Arduino, ESP32, Pico W, STM32, CH32V und AVR-Assembler, Verkabelung und das lokale LCD.",
    },
    software: {
      title: "Backend & Website",
      description: "Python-Relays, Astro auf Cloudflare und Stack-Vergleiche.",
    },
    product: {
      title: "Dashboard & Integrationen",
      description: "Konten, Ingest-API, Alarme, PWA-Installation und Automatisierung.",
    },
  },
  journeys: {
    "winter-pipes": {
      title: "Leitungen diesen Winter schützen",
      description:
        "Frostschwellen festlegen, einen Nass/Trocken-Leckkontakt ergänzen, Alarme einrichten und in den Erfahrungsberichten sehen, wie eine echte Kältewelle oder ein Leck unter der Bodenplatte aussah.",
      ctaLabel: "Kostenlos überwachen",
      steps: [
        { label: "Frostschwellen" },
        { label: "Zeit bis Frost" },
        { label: "Plan für Kältewellen" },
        { label: "Plan für Tauwasser" },
        { label: "Alarmkanäle" },
        { label: "Fallstudie" },
      ],
    },
    "first-dht22": {
      title: "Meinen ersten DHT22 verkabeln",
      description: "Sensorgrundlagen, Pinbelegung und der Arduino-Sketch, der JSON veröffentlicht.",
      ctaLabel: "Arduino-Überblick öffnen",
      steps: [
        { label: "DHT22-Überblick" },
        { label: "Datenleitung verkabeln" },
        { label: "Pinbelegung" },
        { label: "Firmware-Sketch" },
      ],
    },
    "esp-ingest": {
      title: "Von ESP / Pico / MCU / AVR-Assembler senden",
      description:
        "Ein Push-Gerät anlegen, per POST senden, damit Sensoren automatisch importiert werden, optional mit OTA und QR-Aufklebern.",
      ctaLabel: "Gerät hinzufügen",
      steps: [
        { label: "Push oder Pull hinzufügen" },
        { label: "ESP32-Kit kaufen" },
        { label: "Oder Pico W flashen" },
        { label: "Oder STM32 flashen" },
        { label: "Oder CH32V flashen" },
        { label: "Oder AVR-Assembler" },
        { label: "Oder Mobilfunk (LTE)" },
        { label: "Oder Teensy 4.1" },
        { label: "Oder PIC18 Ethernet" },
        { label: "Ingest-API" },
        { label: "Kit-QR" },
        { label: "ESP32 flashen" },
        { label: "ESP32-OTA" },
      ],
    },
    "understand-readings": {
      title: "Meine Messwerte verstehen",
      description:
        "Warum Garagen schwanken, wie Daten auf die Website gelangen und wie du veraltete Feeds erkennst.",
      ctaLabel: "Fühler-Demo ausprobieren",
      steps: [
        { label: "Ursachen der Schwankungen" },
        { label: "Datenfluss" },
        { label: "Veraltete Messwerte" },
        { label: "Verlauf & CSV" },
      ],
    },
    "share-household": {
      title: "Mit meinem Haushalt teilen",
      description: "Familie einladen, Rollen verstehen und Frost- und Leckalarme an einem Ort bündeln.",
      ctaLabel: "Kostenloses Konto erstellen",
      steps: [
        { label: "Anleitung zum Teilen" },
        { label: "Konten & Dashboard" },
        { label: "Rollen & Gruppen" },
        { label: "PWA installieren" },
      ],
    },
  },
} satisfies AboutNavigationOverlay;
