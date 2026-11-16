import { describe, expect, it } from "vitest";
import {
  formatPairingCode,
  generateDeviceKey,
  generatePairingCode,
  hashPairingCode,
  normalizePairingCode,
  PAIRING_ALPHABET,
} from "./pairingCode";

describe("pairing codes", () => {
  it("are 8 characters from the look-alike-free alphabet", () => {
    for (let i = 0; i < 200; i++) {
      const c = generatePairingCode();
      expect(c).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/);
    }
    expect(PAIRING_ALPHABET).not.toMatch(/[01ILO]/);
  });

  it("use every character of the alphabet (no bias toward a few)", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) for (const ch of generatePairingCode()) seen.add(ch);
    expect(seen.size).toBe(PAIRING_ALPHABET.length);
  });

  it("are shown as XXXX-XXXX and read back however they're typed", () => {
    expect(formatPairingCode("K7QF3XZ9")).toBe("K7QF-3XZ9");
    for (const typed of ["K7QF-3XZ9", "k7qf3xz9", " k7qf - 3xz9 ", "K7QF 3XZ9"]) {
      expect(normalizePairingCode(typed)).toBe("K7QF3XZ9");
    }
  });

  it("reject anything that can't be a code, including device keys", () => {
    for (const bad of [
      "",
      "K7QF-3XZ",
      "K7QF-3XZ99",
      "K7QF-3XZ0",
      "K7QF-3XZI",
      "abc",
      generateDeviceKey(),
    ]) {
      expect(normalizePairingCode(bad)).toBeNull();
    }
  });

  it("hash to 64 hex characters, the same for the same code", async () => {
    const a = await hashPairingCode("K7QF3XZ9");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashPairingCode("K7QF3XZ9")).toBe(a);
    expect(await hashPairingCode("K7QF3XZ8")).not.toBe(a);
  });

  it("device keys stay 48 hex characters", () => {
    expect(generateDeviceKey()).toMatch(/^[0-9a-f]{48}$/);
  });
});
