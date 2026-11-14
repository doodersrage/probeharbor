#!/usr/bin/env node
/**
 * Boot the probe firmware's merged images (ESP32, ESP32-S3, ESP32-C3) in
 * Espressif's QEMU and check that each gets through setup() far enough to
 * print its version line, with no crash or reboot loop before it.
 *
 * What a pass means: the image boots and the start of setup() (sensor bus,
 * settings storage, the reading buffer, the reset-reason and OTA probation
 * checks) runs on that chip's emulator. It is not a hardware test: QEMU has
 * no Wi-Fi radio, so starting Wi-Fi right after the version line usually
 * stops the run there, which is expected and not a failure.
 *
 *   node scripts/build-firmware.mjs --out .firmware-ci
 *   QEMU_DIR=/path/to/qemu node scripts/firmware-boot-check.mjs [--dir .firmware-ci]
 *
 * QEMU_DIR holds bin/qemu-system-xtensa and bin/qemu-system-riscv32 from
 * https://github.com/espressif/qemu/releases (CI downloads them). Exits 1 if
 * any chip fails twice in a row. The checks are adapted from esp32-bench's
 * scripts/emulate-firmware.mjs.
 */
import { spawn } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const MACHINES = {
  esp32: { bin: "qemu-system-xtensa", args: ["-machine", "esp32"] },
  esp32s3: { bin: "qemu-system-xtensa", args: ["-machine", "esp32s3"] },
  esp32c3: { bin: "qemu-system-riscv32", args: ["-machine", "esp32c3", "-icount", "3"] },
};

/** All three builds are for 4 MB flash; QEMU wants the whole chip. */
const FLASH_BYTES = 4 * 1024 * 1024;

const BOOTED = /entry 0x[0-9a-f]+/i;
const RESET = /rst:0x[0-9a-f]+ \(/gi;
const CRASH =
  /Guru Meditation|abort\(\) was called|panic'ed|Stack smashing|assert failed|Backtrace: 0x|Interrupt wdt timeout/i;

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Judge one run's serial output.
 * @param {string} out everything QEMU printed
 * @param {string} version FIRMWARE_VERSION from main.cpp
 * @returns {{ ok: boolean; status: string; note: string }}
 */
export function judgeBoot(out, version) {
  const booted = BOOTED.exec(out);
  if (!booted) return { ok: false, status: "no boot", note: "the ROM never started the app" };
  const versionLine = new RegExp(`TT firmware ${escapeRegExp(version)}\\b`).exec(out);
  const until = versionLine ? versionLine.index : out.length;
  const before = out.slice(0, until);
  const crash = CRASH.exec(before);
  if (crash) {
    const line = before
      .slice(before.lastIndexOf("\n", crash.index) + 1)
      .split("\n")[0]
      .trim()
      .slice(0, 160);
    return { ok: false, status: "crash", note: `crashed before the version line: ${line}` };
  }
  const resets = (before.match(RESET) ?? []).length;
  if (resets > 1)
    return { ok: false, status: "boot loop", note: `${resets} resets before the version line` };
  if (!versionLine) {
    return {
      ok: false,
      status: "stalled",
      note: `booted but never printed "TT firmware ${version}"`,
    };
  }
  const after = out.slice(versionLine.index);
  return CRASH.test(after)
    ? {
        ok: true,
        status: "ok",
        note: "printed its version line, then stopped where QEMU has no Wi-Fi radio",
      }
    : { ok: true, status: "ok", note: "printed its version line" };
}

/** Boot one image; stop a few seconds after the version line, or at the time limit. */
function boot(qemuDir, chip, imagePath, version, seconds) {
  return new Promise((done) => {
    const image = readFileSync(imagePath);
    if (image.length > FLASH_BYTES) {
      done({ out: "", error: `${imagePath} is larger than 4 MB` });
      return;
    }
    const flash = Buffer.alloc(FLASH_BYTES, 0xff);
    image.copy(flash);
    const work = mkdtempSync(join(tmpdir(), "ph-qemu-"));
    const file = join(work, `${chip}.bin`);
    writeFileSync(file, flash);
    const m = MACHINES[chip];
    const child = spawn(
      join(qemuDir, "bin", m.bin),
      ["-nographic", ...m.args, "-drive", `file=${file},if=mtd,format=raw`],
      {
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let out = "";
    let stopSoon = null;
    const take = (d) => {
      if (out.length < 200_000) out += d.toString("utf8");
      // Give it a few seconds past the version line to show what happens next.
      if (!stopSoon && out.includes(`TT firmware ${version}`))
        stopSoon = setTimeout(() => child.kill("SIGTERM"), 4000);
    };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    const limit = setTimeout(() => child.kill("SIGTERM"), seconds * 1000);
    const finish = (error) => {
      clearTimeout(limit);
      if (stopSoon) clearTimeout(stopSoon);
      rmSync(work, { recursive: true, force: true });
      done({ out, error });
    };
    child.on("error", (e) => finish(e.message));
    child.on("exit", () => finish(null));
  });
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
  };
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const dir = resolve(opt("--dir", join(repoRoot, "public", "firmware")));
  const qemuDir = resolve(process.env.QEMU_DIR ?? "qemu");
  const source = readFileSync(
    join(repoRoot, "firmware", "probeharbor-probe", "src", "main.cpp"),
    "utf8",
  );
  const version = source.match(/#define FIRMWARE_VERSION "([^"]+)"/)?.[1];
  if (!version) {
    console.error("FIRMWARE_VERSION not found in main.cpp");
    return 2;
  }

  const rows = [];
  let failed = false;
  for (const chip of Object.keys(MACHINES)) {
    const image = join(dir, `probeharbor-probe-${chip}.bin`);
    if (!existsSync(image)) {
      console.error(`Missing ${image}`);
      return 2;
    }
    // The C3 runs with -icount (slower); give every chip the same generous limit.
    let run = await boot(qemuDir, chip, image, version, 45);
    let verdict = run.error
      ? { ok: false, status: "error", note: run.error }
      : judgeBoot(run.out, version);
    if (!verdict.ok) {
      // QEMU now and then faults at startup; keep a failure only if it repeats.
      const first = verdict.note;
      run = await boot(qemuDir, chip, image, version, 45);
      verdict = run.error
        ? { ok: false, status: "error", note: run.error }
        : judgeBoot(run.out, version);
      verdict.note = verdict.ok
        ? `${verdict.note}; the first run failed: ${first}`
        : `${verdict.note} (twice)`;
    }
    failed ||= !verdict.ok;
    console.log(`${verdict.ok ? "ok  " : "FAIL"} ${chip}: ${verdict.note}`);
    const tail = run.out
      .split("\n")
      .filter((l) => l.trim())
      .slice(-12)
      .join("\n");
    console.log(tail.replace(/^/gm, "    "));
    rows.push(
      `| ${chip} | ${verdict.ok ? "✅" : "❌"} ${verdict.status} | ${verdict.note.replace(/\|/g, "\\|")} |`,
    );
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      [
        `### Probe firmware ${version} in QEMU`,
        "",
        "Emulator boot check, not a hardware test: QEMU has no Wi-Fi radio.",
        "",
        "| Chip | Result | Detail |",
        "|---|---|---|",
        ...rows,
        "",
      ].join("\n"),
    );
  }
  return failed ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    },
  );
}
