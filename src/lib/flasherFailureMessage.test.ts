import { describe, expect, it } from "vitest";
import { flasherFailureMessage } from "./flasherFailureMessage";
import en from "../i18n/messages/flashBrowser/en";
import de from "../i18n/messages/flashBrowser/de";
import es from "../i18n/messages/flashBrowser/es";
import fr from "../i18n/messages/flashBrowser/fr";
import ptBr from "../i18n/messages/flashBrowser/pt-br";

// Lines exactly as firmware/probeharbor-probe/src/main.cpp prints them.
const WIFI = "TT wifi failed: check the network name and password (2.4 GHz only)";
const KEY = "TT key rejected: copy the device key again from Dashboard → Devices";
const CONFIG = "TT config error: network name and device key are required";
const PROBE = "TT no probe: check the wiring (DS18B20 or DHT22 data on GPIO 4, 4.7k pull-up to 3.3V)";
const NOT_READING = "TT nothing sent: AHT20 found but not reading";

describe("flasherFailureMessage", () => {
  it("uses the page language for each known failure", () => {
    expect(flasherFailureMessage(WIFI, de.status)).toMatch(/^WLAN fehlgeschlagen/);
    expect(flasherFailureMessage(KEY, es.status)).toMatch(/^Clave rechazada/);
    expect(flasherFailureMessage(CONFIG, fr.status)).toMatch(/^La carte n’a pas accepté/);
    expect(flasherFailureMessage(PROBE, ptBr.status)).toMatch(/^Nenhuma sonda encontrada/);
  });

  it("fills in the probe pin the board reported", () => {
    expect(flasherFailureMessage(PROBE.replace("GPIO 4", "GPIO 5"), en.status)).toContain("GPIO 5");
    expect(flasherFailureMessage(PROBE, en.status)).not.toContain("{pin}");
  });

  it("names the I2C sensor that was found but gave no reading (firmware 1.2.6+), not the DS18B20 hint", () => {
    expect(flasherFailureMessage(NOT_READING, en.status)).toBe(
      "Found the AHT20 but couldn't read it: check its 3.3V, GND, SDA and SCL wires, then try again.",
    );
    expect(flasherFailureMessage(NOT_READING, de.status)).toMatch(/^AHT20 gefunden/);
    expect(flasherFailureMessage(NOT_READING, en.status)).not.toContain("DS18B20");
    expect(flasherFailureMessage(NOT_READING, {})).toBe("Nothing sent: AHT20 found but not reading");
  });

  it("every locale has all five failure messages", () => {
    for (const messages of [en, de, es, fr, ptBr]) {
      for (const key of ["wifiFailed", "keyRejected", "configError", "noProbe", "sensorNotReading"] as const) {
        expect(messages.status[key]).toBeTruthy();
      }
      expect(messages.status.noProbe).toContain("{pin}");
      expect(messages.status.sensorNotReading).toContain("{sensor}");
    }
  });

  it("falls back to the board's own words for an unknown line or missing copy", () => {
    expect(flasherFailureMessage("TT wifi failed: something new", {})).toBe("Wifi failed: something new");
    expect(flasherFailureMessage(PROBE, {})).toBe(PROBE.slice(3).replace(/^n/, "N"));
  });
});
