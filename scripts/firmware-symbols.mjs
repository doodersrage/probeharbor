#!/usr/bin/env node
/**
 * Function tables for decoding probe crash reports (src/lib/crashSymbols.ts).
 *
 * For each built image, the code symbols of its ELF (nm: start, size, name),
 * written to public/firmware/symbols/<elf>.json where <elf> is the first 16
 * hex digits of the ELF's SHA-256: the same value the firmware embeds in the
 * image and sends with a crash report. Served as static files, so the site
 * can name the function behind a crash address without the ELF itself.
 *
 *   node scripts/firmware-symbols.mjs <firmware.elf> <chip> <version> <out-dir>
 *
 * build-firmware.mjs runs this for every chip after merging the images.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** nm for each chip, from PlatformIO's toolchains. */
export const NM = {
  esp32: "xtensa-esp32-elf-nm",
  esp32s3: "xtensa-esp32s3-elf-nm",
  esp32c3: "riscv32-esp-elf-nm",
};

const MAX_NAME = 160;

/**
 * Parse `nm -S -n -C --defined-only` output into [start, size, name] for code
 * symbols (T/t/W/w with a size), sorted by start, one entry per start.
 * @param {string} nmOutput
 * @returns {[number, number, string][]}
 */
export function parseNmFunctions(nmOutput) {
  const byStart = new Map();
  for (const line of nmOutput.split("\n")) {
    const m = /^([0-9a-f]{8}) ([0-9a-f]{8}) ([TtWw]) (.+)$/.exec(line.trim());
    if (!m) continue;
    const start = Number.parseInt(m[1], 16);
    const size = Number.parseInt(m[2], 16);
    if (size === 0) continue;
    const name = m[4].length > MAX_NAME ? `${m[4].slice(0, MAX_NAME - 1)}…` : m[4];
    // Aliases share a start: keep the first (nm -n lists strong before weak).
    if (!byStart.has(start)) byStart.set(start, [start, size, name]);
  }
  return [...byStart.values()].sort((a, b) => a[0] - b[0]);
}

/** First 16 hex digits of the ELF's SHA-256, as the firmware reports it. */
export function elfId(elfBytes) {
  return createHash("sha256").update(elfBytes).digest("hex").slice(0, 16);
}

export function writeSymbolTable({ elfPath, chip, version, outDir, nm }) {
  const tool =
    nm ?? globSync(join(homedir(), ".platformio", "packages", "toolchain-*", "bin", NM[chip]))[0];
  if (!tool) throw new Error(`${NM[chip]} not found in PlatformIO's toolchains`);
  const output = execFileSync(tool, ["-S", "-n", "-C", "--defined-only", elfPath], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const elf = elfId(readFileSync(elfPath));
  const functions = parseNmFunctions(output);
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${elf}.json`);
  writeFileSync(file, `${JSON.stringify({ elf, chip, version, functions })}\n`);
  return { elf, file, count: functions.length };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [elfPath, chip, version, outDir] = process.argv.slice(2);
  if (!elfPath || !NM[chip] || !version || !outDir) {
    console.error(
      "Usage: node scripts/firmware-symbols.mjs <firmware.elf> <esp32|esp32s3|esp32c3> <version> <out-dir>",
    );
    process.exit(2);
  }
  const r = writeSymbolTable({ elfPath, chip, version, outDir });
  console.log(`${chip}: ${r.count} functions → ${r.file}`);
}
