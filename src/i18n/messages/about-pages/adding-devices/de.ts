
/**
 * /about/adding-devices body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI labels
 * (Devices, Create push device, Reveal ingest key…) stay English because the
 * dashboard is English-only.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const DEV = "https://probeharbor.dev/developers";
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer">`;
const downloads =
  "<strong>Download Arduino .ino</strong> / <strong>MicroPython .py</strong> / <strong>CircuitPython code.py</strong> / <strong>Zephyr main.c</strong> / <strong>CH32V main.c</strong> / <strong>AVR main.S</strong> / <strong>Teensy 4.1 .ino</strong> / <strong>PIC18 main.c</strong> / <strong>Particle Boron .ino</strong> / <strong>ESPHome snippet</strong>";
const curlBlock = '<a class="text-link" href="/api/feeds/example?format=ingest">';
import type { AddingDevicesMessages } from "./en";

const de: AddingDevicesMessages = {
  introHtml: [
    'ProbeHarbor nimmt Messwerte auf zwei Wegen an: Deine Hardware <strong>sendet</strong> (Push) JSON an eine Ingest-URL, oder wir <strong>holen</strong> (Pull) HTTPS-JSON nach Zeitplan von einem öffentlichen Feed ab. Beides richtest du unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein. Neue ESP- oder Akku-Knoten sollten Push nutzen. Pull ist für dauerhaft laufende LAN-Server oder Relays gedacht, die bereits HTTPS-JSON bereitstellen.',
    'Ein kostenloses Konto (ohne Kreditkarte) verknüpft deinen Ingest-Schlüssel mit deinem Haushalt, damit Verlauf und Alarme privat bleiben. Wenn du Messwerte ohne Anmeldung sehen willst, schau dir zuerst die <a class="text-link" href="/demo">Live-Demo</a> an.',
  ],
  choose: {
    title: "Push oder Pull wählen",
    colPush: "Push-Ingest",
    colPull: "Pull-Feed",
    rowsHtml: [
      ["Wer startet", "Dein Gerät", "ProbeHarbor"],
      ["Netzwerk", "Gerät braucht ausgehendes HTTPS (Uno Ethernet: HTTP an ein TLS-Relay im LAN)", "Feed-URL muss öffentlich erreichbar sein"],
      ["Authentifizierung", "Geräteschlüssel in der URL; Flash-Hinweis + Reveal ingest key", "Öffentliche HTTPS-URL (TLS)"],
      [
        "JSON-Format",
        "Flache Schlüssel, <code>temp</code>-Objekt, <code>sensors[]</code>, SenML oder HA REST",
        "Verschachtelter <code>temp</code>-Stamm (Standard); SenML oder HA REST werden automatisch erkannt",
      ],
      [
        "Ideal für",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + HTTPS-Relay im LAN), Arduino Uno + Ethernet",
        "Ethernet-Server, FastAPI-Relays",
      ],
    ],
  },
  push: {
    title: "Push-Gerät (empfohlen)",
    stepsHtml: [
      'Melde dich an und öffne <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Klicke unter <strong>Push devices</strong> auf <strong>Create push device</strong> (standardmäßig „Workshop probe“ genannt, jederzeit umbenennbar).",
      `Im Ingest-Hinweis: Scanne den QR-Code oder nutze ${downloads} (Ingest-URL bzw. -Pfad vorausgefüllt). Der Schlüssel bleibt 30 Minuten auf der Seite und übersteht ein Neuladen, bis du ihn schließt.`,
      "<strong>Schlüssel später verloren?</strong> Nutze auf der Gerätekarte <strong>Reveal ingest key</strong> (wenn die Schlüsselwiederherstellung auf dem Server aktiviert ist) oder <strong>Rotate key</strong>, um einen neuen auszustellen. Geräte, die vor Aktivierung der Schlüsselwiederherstellung angelegt wurden, brauchen einmal eine Rotation, damit eine wiederherstellbare verschlüsselte Kopie gespeichert wird.",
      'Flashe einen ESP32 (siehe <a class="text-link" href="/about/esp32-web-flash">Flash-Optionen</a>: Arduino IDE, PlatformIO, MicroPython oder das Web-esptool von Espressif), einen Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), ein STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), einen CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), einen Uno in GNU-AVR-Assembler (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), einen Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), einen PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) oder ein Particle Boron (<a class="text-link" href="/about/cellular-ingest">LTE-Webhook</a>). Brauchst du erst die Teile? <a class="text-link" href="/about/esp32-freeze-kit">Stückliste für das ESP32-Frost-Kit</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">AVR-Assembler</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> oder <a class="text-link" href="/about/cellular-ingest">Mobilfunk</a> (wasserdichter DS18B20). Der serielle Monitor mit <strong>115200</strong> sollte <code>POST 200</code> zeigen (bzw. <code>publish ok</code> beim Boron). Sensorschlüssel werden automatisch importiert (flache Schlüssel, <code>temp</code>-Objekt, SenML oder Home Assistant REST). Benenne die Sensoren danach auf der Devices-Seite um. Die manuelle Zuordnung unter <strong>Advanced</strong> ist optional, um Schlüssel vorab zuzuordnen.',
      `Weitere Beispiele (Uno Ethernet + DHT22, MAX31855, MAX6675 usw.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. Der W5100 kann kein TLS. Sende per HTTP-POST an ein Relay im LAN (<a class="text-link" href="/about/python-feeds">Python-Feeds</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Mach einen kurzen Test mit curl und öffne dann angemeldet <a class="text-link" href="/dashboard/live">Live</a>. Kommt etwa 30 Minuten lang kein Post, warnt Live, dass ein Fühler offline sein könnte.',
    ],
  },
  curl: {
    title: "curl-Beispiel (Push)",
    introHtml: `Hol dir einen aktuellen Beispiel-Body aus dem ${curlBlock}Beispiel-Ingest-Feed</a> (wetterbasiert) und sende ihn per POST an deinen Geräteschlüssel.`,
    payloadsHtml: `Payload-Formate: flache Schlüssel, klassisches <code>temp</code>-Objekt, typisiertes <code>sensors[]</code>, <strong>SenML (RFC 8428)</strong> oder <code>state</code>-JSON von <strong>Home Assistant REST</strong>. Dokumentiert sind sie unter <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a> und in der Entwicklerreferenz zu <a class="text-link" href="${DEV}/ingest/">Push-Ingest</a>. Probier Live-Beispiele aus: ${curlBlock}nativ</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Pull-Feed",
    step1Html: "Prüfe, dass dein Feed HTTPS-JSON liefert. Klassisches Format (Standard-Stammschlüssel <code>temp</code>):",
    stepsHtml: [
      'Öffne <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Füge einen Feed hinzu: Name, HTTPS-URL und <strong>JSON root key</strong> (Standard <code>temp</code>). Nutze vor dem Speichern <strong>Test feed URL</strong>.",
      "Klicke auf <strong>Save pull setup</strong>: Die Fühlerschlüssel werden automatisch aus dem Live-Feed importiert. Benenne die Bezeichnungen auf derselben Seite um oder klicke auf <strong>Accept suggested names</strong>.",
      'Klicke auf <strong>Fetch now</strong>, um sofort Messwerte abzurufen, oder warte auf die nächste geplante Abfrage und prüfe die Karten unter <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Pull-Feeds erwarten standardmäßig verschachtelte Fühlerobjekte unter dem konfigurierten Stamm (keine flachen Schlüssel wie bei Push). <strong>SenML-JSON-Arrays</strong> und Antworten von <strong>Home Assistant REST</strong> werden automatisch erkannt, wenn dieser Stamm fehlt: Füge die URL unverändert ein und ordne die Fühlerschlüssel zu, die SenML oder HA liefern (z. B. <code>0</code>, <code>state</code>). Kann der Mikrocontroller kein TLS (Uno + W5100-Ethernet-Shield), nutze ein lokales HTTPS-Relay (siehe <a class="text-link" href="/about/python-feeds">Python-Feeds</a> oder den ${relay}HTTP→HTTPS-Forwarder</a> aus der Standardbibliothek für Push-Ingest).`,
  },
  mqtt: {
    title: "Schon auf MQTT?",
    bodyHtml:
      'Behalte Mosquitto oder Home-Assistant-MQTT in deinem LAN und spiegle die Messwerte per HTTPS. ProbeHarbor ist kein MQTT-Broker. Komplettes Rezept (curl, HA-<code>rest_command</code>, Node-RED): <a class="text-link" href="/about/mqtt-bridge">Anleitung zur MQTT-Bridge</a>. Siehe auch <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs. Eigenbau-MQTT</a>.',
  },
  verify: {
    title: "Prüfen, ob alles läuft",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: Die Karten aktualisieren sich live; säumige Fühler zeigen nach etwa 30 Minuten eine gelbe Offline-Warnung.',
      "<strong>Devices → Status</strong>: zuletzt gesehen, Akku und RSSI, sofern der Payload sie enthält (nach dem ersten Live-Messwert).",
      "<strong>Frost-Grundeinstellungen</strong>: Lege nach dem ersten POST auf Devices oder unter Alerts → When to alert Frostschwelle und E-Mail fest und sende einen Test (schaltet nach der Ersteinrichtung die vollständige Overview frei).",
      "<strong>Overview</strong>: Status des Raums; nach den Grundeinstellungen Status-Kennzahlen (Froststunden, kältester Abstand, ΔT innen−außen, Streuung zwischen Fühlern) und <strong>Insights</strong> (Risikonächte, Tür/Strom/Bewegung, Luftqualität). Wochendiagramme können Luftfeuchte und Taupunkt einblenden, wenn rel. Luftfeuchte vorliegt.",
    ],
  },
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">Ingest-API und Alarm-Webhooks</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Einrichtung per Kit-QR-Code</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Temperatur-Feeds konfigurieren</a> (Pull im Detail)',
      '<a class="text-link" href="/about/debugging-stale-readings">Veraltete Messwerte debuggen</a>',
      `<a class="text-link" href="/about/mqtt-bridge">MQTT-Bridge-Rezept</a> · <a class="text-link" href="/compare/diy-mqtt">vs. Eigenbau-MQTT</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">MQTT-Doku für Entwickler</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Entwickler: Push-Ingest</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">Pull-Feeds</a>`,
    ],
  },
};

export default de;
