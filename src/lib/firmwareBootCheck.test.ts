/**
 * The QEMU boot check's verdict (scripts/firmware-boot-check.mjs). QEMU itself
 * only runs in CI's Firmware workflow; these pin down what counts as a pass.
 */
import { describe, expect, it } from "vitest";
import { judgeBoot } from "../../scripts/firmware-boot-check.mjs";

const ROM = [
  "ESP-ROM:esp32c3-api1-20210207",
  "rst:0x1 (POWERON),boot:0x8 (SPI_FAST_FLASH_BOOT)",
  "load:0x3fcd5820,len:0x458",
  "entry 0x403cc710",
].join("\n");
const VERSION_LINE = "\nTT firmware 1.5.0\n";
const RADIO_ABORT = [
  "assert failed: esp_phy_enable phy_init.c:241 (phy_init_data)",
  "Backtrace: 0x40081d2e:0x3ffb1f40 0x4008a3f1:0x3ffb1f60",
  "rst:0xc (SW_CPU_RESET),boot:0x8 (SPI_FAST_FLASH_BOOT)",
].join("\n");

describe("firmware QEMU boot check", () => {
  it("passes when setup prints the version line", () => {
    expect(judgeBoot(ROM + VERSION_LINE, "1.5.0")).toMatchObject({ ok: true, status: "ok" });
  });

  it("passes when it stops at the Wi-Fi radio after the version line (QEMU has none)", () => {
    const r = judgeBoot(`${ROM}${VERSION_LINE}${RADIO_ABORT}\n${ROM}${VERSION_LINE}`, "1.5.0");
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/no Wi-Fi radio/);
  });

  it("fails when the ROM never starts the app", () => {
    expect(judgeBoot("ESP-ROM:esp32c3\ninvalid header: 0xffffffff\n", "1.5.0")).toMatchObject({
      ok: false,
      status: "no boot",
    });
  });

  it("fails on a crash before the version line", () => {
    const out = `${ROM}\nGuru Meditation Error: Core  0 panic'ed (LoadProhibited). Exception was unhandled.\n`;
    expect(judgeBoot(out, "1.5.0")).toMatchObject({ ok: false, status: "crash" });
  });

  it("fails on a reboot loop before the version line", () => {
    const loop = `${ROM}\n${ROM}\n${ROM}\n`;
    expect(judgeBoot(loop, "1.5.0")).toMatchObject({ ok: false, status: "boot loop" });
  });

  it("fails when it boots but stalls before the version line", () => {
    expect(judgeBoot(`${ROM}\nsome early line\n`, "1.5.0")).toMatchObject({
      ok: false,
      status: "stalled",
    });
  });

  it("needs this build's version, not an older one", () => {
    expect(judgeBoot(`${ROM}\nTT firmware 1.4.9\n`, "1.5.0").ok).toBe(false);
    expect(judgeBoot(`${ROM}\nTT firmware 1.5.01\n`, "1.5.0").ok).toBe(false);
  });

  it("an interrupt watchdog before the version line is a crash", () => {
    expect(
      judgeBoot(
        `${ROM}\nGuru Meditation Error: Core 0 panic'ed (Interrupt wdt timeout on CPU0).\n`,
        "1.5.0",
      ).ok,
    ).toBe(false);
  });
});
