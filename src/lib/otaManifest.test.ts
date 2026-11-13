import { generateKeyPairSync, randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  OTA_APP_OFFSET,
  appSlice,
  buildOtaManifest,
  checkOtaEntry,
  compareVersions,
  otaMessage,
  publicKeyFromHeader,
  publicKeyHeader,
} from "../../scripts/otaManifest.mjs";

function keyPair() {
  const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  return {
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }) as string,
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }) as string,
  };
}

/** A merged /flash image: bootloader area, then an app image (0xE9 magic) at 0x10000. */
function mergedImage(appLength = 4096) {
  const app = randomBytes(appLength);
  app[0] = 0xe9;
  return { merged: Buffer.concat([Buffer.alloc(OTA_APP_OFFSET, 0xff), app]), app };
}

describe("OTA manifest", () => {
  const keys = keyPair();
  const esp32 = mergedImage();
  const s3 = mergedImage(5000);
  const manifest = buildOtaManifest({
    version: "1.4.0",
    images: [
      { chip: "esp32", merged: esp32.merged },
      { chip: "esp32s3", merged: s3.merged },
    ],
    privateKeyPem: keys.privateKeyPem,
    rolloutPct: 25,
  });

  it("describes each chip's app image: offset, size, hash, cache-busting URL", () => {
    expect(manifest).toMatchObject({ format: 1, version: "1.4.0", rollout_pct: 25 });
    expect(manifest.builds.esp32).toMatchObject({
      url: "/firmware/probeharbor-probe-esp32.bin?v=1.4.0",
      offset: 0x10000,
      size: 4096,
    });
    expect(manifest.builds.esp32s3.size).toBe(5000);
    expect(manifest.builds.esp32.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("verifies with the matching public key and the real image", () => {
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keys.publicKeyPem, app: esp32.app, runningVersion: "1.3.1" })).toBeNull();
    expect(checkOtaEntry({ manifest, chip: "esp32s3", publicKeyPem: keys.publicKeyPem, app: s3.app })).toBeNull();
  });

  it("refuses another key's signature", () => {
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keyPair().publicKeyPem })).toBe("bad signature");
  });

  it("refuses an edited manifest: version, size or hash changed after signing", () => {
    const pk = keys.publicKeyPem;
    const bumped = { ...manifest, version: "9.9.9" };
    expect(checkOtaEntry({ manifest: bumped, chip: "esp32", publicKeyPem: pk })).toBe("bad signature");
    const resized = { ...manifest, builds: { ...manifest.builds, esp32: { ...manifest.builds.esp32, size: 1 } } };
    expect(checkOtaEntry({ manifest: resized, chip: "esp32", publicKeyPem: pk })).toBe("bad signature");
    const rehashed = { ...manifest, builds: { ...manifest.builds, esp32: { ...manifest.builds.esp32, sha256: "0".repeat(64) } } };
    expect(checkOtaEntry({ manifest: rehashed, chip: "esp32", publicKeyPem: pk })).toBe("bad signature");
  });

  it("refuses another chip's image under this chip's name", () => {
    const swapped = { ...manifest, builds: { ...manifest.builds, esp32: manifest.builds.esp32s3 } };
    expect(checkOtaEntry({ manifest: swapped, chip: "esp32", publicKeyPem: keys.publicKeyPem })).toBe("bad signature");
  });

  it("refuses a download that doesn't match: changed byte, truncated", () => {
    const changed = Buffer.from(esp32.app);
    changed[100] ^= 1;
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keys.publicKeyPem, app: changed })).toBe("wrong hash");
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keys.publicKeyPem, app: esp32.app.subarray(1) })).toBe("wrong size");
  });

  it("refuses the same or an older version, and a chip it has no build for", () => {
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keys.publicKeyPem, runningVersion: "1.4.0" })).toBe("not newer");
    expect(checkOtaEntry({ manifest, chip: "esp32", publicKeyPem: keys.publicKeyPem, runningVersion: "1.10.0" })).toBe("not newer");
    expect(checkOtaEntry({ manifest, chip: "esp32c3", publicKeyPem: keys.publicKeyPem })).toBe("no build for this chip");
  });

  it("serves images from urlBase for test publishes", () => {
    const test = buildOtaManifest({
      version: "1.4.1",
      images: [{ chip: "esp32s3", merged: s3.merged }],
      privateKeyPem: keys.privateKeyPem,
      urlBase: "/firmware/ota-test",
    });
    expect(test.builds.esp32s3?.url).toBe("/firmware/ota-test/probeharbor-probe-esp32s3.bin?v=1.4.1");
  });

  it("signs exactly the documented message (the firmware rebuilds it byte for byte)", () => {
    expect(otaMessage({ chip: "esp32", version: "1.4.0", size: 4096, sha256: "ab" })).toBe(
      "probeharbor-ota-v1\nesp32\n1.4.0\n4096\nab\n",
    );
  });

  it("rejects bad inputs when building", () => {
    const images = [{ chip: "esp32", merged: esp32.merged }];
    expect(() => buildOtaManifest({ version: "1.4", images, privateKeyPem: keys.privateKeyPem })).toThrow(/x\.y\.z/);
    expect(() => buildOtaManifest({ version: "1.4.0", images, privateKeyPem: keys.privateKeyPem, rolloutPct: 101 })).toThrow(/rollout/);
    expect(() => appSlice(Buffer.alloc(OTA_APP_OFFSET + 100))).toThrow(/no ESP app image/);
  });
});

describe("compareVersions", () => {
  it("compares numerically per part, ignoring a -suffix", () => {
    expect(compareVersions("1.3.10", "1.3.9")).toBe(1);
    expect(compareVersions("1.4.0", "1.4.0")).toBe(0);
    expect(compareVersions("1.3.1", "1.4.0")).toBe(-1);
    expect(compareVersions("1.3.0-test", "1.3.0")).toBe(0);
    expect(compareVersions("2.0", "1.9.9")).toBe(1);
  });
});

describe("public key header", () => {
  it("round-trips the PEM through the C header", () => {
    const { publicKeyPem } = keyPair();
    const header = publicKeyHeader(publicKeyPem);
    expect(header).toContain("static const char OTA_PUBLIC_KEY_PEM[]");
    expect(publicKeyFromHeader(header)).toBe(publicKeyPem);
  });
});
