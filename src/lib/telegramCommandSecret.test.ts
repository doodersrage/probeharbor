import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  hashTelegramCommandSecret,
  isHashedTelegramSecret,
  sha256Hex,
  storedTelegramCommandSecret,
} from "./telegramCommandSecret";

describe("sha256Hex", () => {
  it("matches node:crypto across block boundaries and non-ASCII text", () => {
    for (const s of ["", "abc", "a".repeat(55), "a".repeat(56), "a".repeat(63), "a".repeat(64), "x".repeat(1000), "héllo ✓ 日本"]) {
      expect(sha256Hex(s)).toBe(createHash("sha256").update(s, "utf8").digest("hex"));
    }
  });
});

describe("Telegram command secret storage form", () => {
  it("matches node:crypto on 500 random strings of every length up to 300 characters", () => {
    const alphabet = "abcXYZ019_-~ éü✓日本🙂";
    let seed = 12345;
    const next = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed;
    };
    for (let i = 0; i < 500; i += 1) {
      const length = next() % 301;
      let text = "";
      for (let j = 0; j < length; j += 1) text += [...alphabet][next() % [...alphabet].length];
      expect(sha256Hex(text)).toBe(createHash("sha256").update(text, "utf8").digest("hex"));
    }
  });

  it("hashes plaintext, keeps an already-hashed value, leaves empty alone", () => {
    const hashed = hashTelegramCommandSecret("abcdefghijklmnop1234");
    expect(hashed).toBe(`sha256:${createHash("sha256").update("abcdefghijklmnop1234").digest("hex")}`);
    expect(isHashedTelegramSecret(hashed)).toBe(true);
    expect(isHashedTelegramSecret("abcdefghijklmnop1234")).toBe(false);
    expect(storedTelegramCommandSecret("abcdefghijklmnop1234")).toBe(hashed);
    expect(storedTelegramCommandSecret(hashed)).toBe(hashed); // no double hashing
    expect(storedTelegramCommandSecret(null)).toBeNull();
    expect(storedTelegramCommandSecret("")).toBe("");
  });
});
