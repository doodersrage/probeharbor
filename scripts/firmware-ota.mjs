#!/usr/bin/env node
/**
 * OTA signing for the probe firmware. Run on the owner's machine only.
 *
 *   pnpm firmware:keygen [--out <path>]
 *     Makes the ECDSA P-256 signing key pair. Writes the PRIVATE key to
 *     <path> (default ~/.config/probeharbor/ota-signing-key.pem, mode 600;
 *     never overwritten) and the public key into
 *     firmware/probeharbor-probe/src/ota_pubkey.h. Put the private key in a
 *     password manager. Lose it and probes can't be updated over the air
 *     until they're reflashed over USB with a new key.
 *
 *   pnpm firmware:sign [--key <path>] [--rollout <0-100>]
 *                      [--dir <public/...>] [--chips esp32,...] [--version x.y.z]
 *     After `pnpm firmware:build`: signs <dir>/ota.json (default
 *     public/firmware) for the version in <dir>/manifest.json (or --version),
 *     checks every entry against the committed public key, then writes it.
 *     --rollout limits the share of probes that take the update (default
 *     100; 0 stops a rollout). --dir/--chips/--version are for test
 *     publishes (see HARDWARE-TESTS.md test 12).
 *
 * Neither command prints or logs the private key.
 */
import { createPublicKey, generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildOtaManifest, checkOtaEntry, publicKeyFromHeader, publicKeyHeader } from "./otaManifest.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const headerPath = join(repoRoot, "firmware", "probeharbor-probe", "src", "ota_pubkey.h");
const publicDir = join(repoRoot, "public");
const CHIPS = ["esp32", "esp32s3", "esp32c3"];
const defaultKey = join(homedir(), ".config", "probeharbor", "ota-signing-key.pem");

const [command, ...args] = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (command === "keygen") {
  const out = resolve(arg("--out", defaultKey));
  if (existsSync(out)) fail(`${out} already exists; not overwriting a signing key.`);
  const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  mkdirSync(dirname(out), { recursive: true, mode: 0o700 });
  writeFileSync(out, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600, flag: "wx" });
  const publicPem = publicKey.export({ type: "spki", format: "pem" });
  writeFileSync(headerPath, publicKeyHeader(publicPem));
  console.log(`Private key: ${out} (mode 600). Store it in your password manager.`);
  console.log(`Public key written to ${headerPath.slice(repoRoot.length + 1)}; commit that file.`);
} else if (command === "sign") {
  const keyPath = resolve(arg("--key", defaultKey));
  if (!existsSync(keyPath)) fail(`No signing key at ${keyPath}. Run pnpm firmware:keygen first, or pass --key.`);
  if (!existsSync(headerPath)) fail("firmware/probeharbor-probe/src/ota_pubkey.h is missing.");
  const publicKeyPem = publicKeyFromHeader(readFileSync(headerPath, "utf8"));
  if (!publicKeyPem) fail("Couldn't read the public key from ota_pubkey.h.");
  const rolloutPct = Number(arg("--rollout", "100"));
  const firmwareDir = resolve(repoRoot, arg("--dir", "public/firmware"));
  if (!firmwareDir.startsWith(`${publicDir}/`)) fail("--dir must be inside public/.");
  const urlBase = firmwareDir.slice(publicDir.length);
  const chips = arg("--chips", CHIPS.join(",")).split(",");
  if (chips.some((chip) => !CHIPS.includes(chip))) fail(`--chips must be from ${CHIPS.join(", ")}.`);
  const version = arg("--version", "") || JSON.parse(readFileSync(join(firmwareDir, "manifest.json"), "utf8")).version;
  const images = chips.map((chip) => ({
    chip,
    merged: readFileSync(join(firmwareDir, `probeharbor-probe-${chip}.bin`)),
  }));
  const privateKeyPem = readFileSync(keyPath, "utf8");
  // A key that doesn't match the committed public key would publish updates
  // no probe accepts: catch that here.
  try {
    if (createPublicKey(privateKeyPem).export({ type: "spki", format: "pem" }) !== publicKeyPem) {
      fail("That private key doesn't match firmware/probeharbor-probe/src/ota_pubkey.h.");
    }
  } catch {
    fail("Couldn't read the private key.");
  }
  const manifest = buildOtaManifest({ version, images, privateKeyPem, rolloutPct, urlBase });
  for (const { chip, merged } of images) {
    const problem = checkOtaEntry({ manifest, chip, publicKeyPem, app: merged.subarray(manifest.builds[chip].offset) });
    if (problem) fail(`${chip}: ${problem}; ota.json not written.`);
  }
  writeFileSync(join(firmwareDir, "ota.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${firmwareDir.slice(repoRoot.length + 1)}/ota.json: ${version}, rollout ${rolloutPct}%, ${chips.join(", ")} (signatures checked).`);
} else {
  fail("Usage: firmware-ota.mjs keygen [--out <path>] | sign [--key <path>] [--rollout <0-100>] [--dir <public/...>] [--chips a,b] [--version x.y.z]");
}
