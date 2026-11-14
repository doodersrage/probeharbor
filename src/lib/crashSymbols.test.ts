import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseNmFunctions } from "../../scripts/firmware-symbols.mjs";
import type { CrashReport } from "./crashReport";
import {
  causeName,
  decodeCrash,
  loadSymbolTable,
  lookupFunction,
  type SymbolTable,
} from "./crashSymbols";

const table = (chip: string): SymbolTable => ({
  elf: "0123456789abcdef",
  chip,
  version: "1.5.1",
  functions: [
    [0x400d0000, 0x100, "setup()"],
    [0x400d0100, 0x80, "loop()"],
    [0x400d0200, 0x40, "readProbes()"],
  ],
});
const crash = (over: Partial<CrashReport> = {}): CrashReport => ({
  elf: "0123456789abcdef",
  task: "loopTask",
  pc: "0x400d0210",
  bt: ["0x400d0210", "0x400d0120", "0x400d0010"],
  cause: 28,
  addr: "0x00000000",
  reset: "panic",
  ...over,
});

describe("lookupFunction", () => {
  const t = table("esp32");
  it("finds the function containing an address, with the offset", () => {
    expect(lookupFunction(t, 0x400d0000)).toEqual({ fn: "setup()", offset: 0 });
    expect(lookupFunction(t, 0x400d017f)).toEqual({ fn: "loop()", offset: 0x7f });
  });
  it("returns null in gaps between functions and outside the table", () => {
    expect(lookupFunction(t, 0x400d0180)).toBeNull(); // past loop()'s end
    expect(lookupFunction(t, 0x3fff0000)).toBeNull();
    expect(lookupFunction(t, 0x400e0000)).toBeNull();
  });
});

describe("decodeCrash", () => {
  it("ESP32: the pc, then the backtrace in order, without repeating the pc", () => {
    const d = decodeCrash(crash(), table("esp32"));
    expect(d).toMatchObject({
      version: "1.5.1",
      chip: "esp32",
      stackScan: false,
      cause: "LoadProhibited",
    });
    expect(d.frames.map((f) => f.fn)).toEqual(["readProbes()", "loop()", "setup()"]);
    expect(d.frames[0]).toEqual({ addr: "0x400d0210", fn: "readProbes()", offset: 0x10 });
  });

  it("ESP32: keeps an unknown address in the chain as a bare address", () => {
    const d = decodeCrash(
      crash({ bt: ["0x400d0210", "0x40080000", "0x400d0120"] }),
      table("esp32"),
    );
    expect(d.frames.map((f) => f.fn)).toEqual(["readProbes()", null, "loop()"]);
  });

  it("C3: keeps only stack candidates inside known code, one per function in a row", () => {
    const d = decodeCrash(
      crash({
        cause: 5,
        bt: ["0x3fc90000", "0x400d0120", "0x400d0124", "0x00000005", "0x400d0010"],
      }),
      table("esp32c3"),
    );
    expect(d.stackScan).toBe(true);
    expect(d.cause).toBe("Load access fault");
    expect(d.frames.map((f) => f.fn)).toEqual(["readProbes()", "loop()", "setup()"]);
  });

  it("without a table: raw addresses, nothing named", () => {
    const d = decodeCrash(crash(), null);
    expect(d).toMatchObject({ version: null, chip: null, cause: null });
    expect(d.frames.map((f) => f.addr)).toEqual(["0x400d0210", "0x400d0120", "0x400d0010"]);
    expect(d.frames.every((f) => f.fn === null)).toBe(true);
  });

  it("marks a watchdog restart and drops the exception cause, which doesn't apply", () => {
    for (const reset of ["task_wdt", "int_wdt", "wdt"]) {
      const d = decodeCrash(crash({ reset, task: "IDLE" }), table("esp32"));
      expect(d.watchdog).toBe(true);
      expect(d.cause).toBeNull();
      expect(d.frames.length).toBeGreaterThan(0); // still listed for a bug report
    }
  });

  it("an exception is not a watchdog restart, whatever the task", () => {
    for (const reset of ["panic", null, "poweron"]) {
      expect(decodeCrash(crash({ reset }), table("esp32")).watchdog).toBe(false);
    }
  });

  it("names causes per architecture", () => {
    expect(causeName("esp32s3", 29)).toBe("StoreProhibited");
    expect(causeName("esp32c3", 2)).toBe("Illegal instruction");
    expect(causeName("esp32", 99)).toBeNull();
  });
});

describe("loadSymbolTable", () => {
  const ok = (body: unknown) => async () => new Response(JSON.stringify(body));
  it("loads the table whose elf matches", async () => {
    await expect(loadSymbolTable("0123456789abcdef", ok(table("esp32")))).resolves.toMatchObject({
      version: "1.5.1",
    });
  });
  it("refuses a bad id, a missing file, a mismatched file or a fetch error", async () => {
    await expect(loadSymbolTable("../../etc", ok(table("esp32")))).resolves.toBeNull();
    await expect(
      loadSymbolTable("0123456789abcdef", async () => new Response("", { status: 404 })),
    ).resolves.toBeNull();
    await expect(loadSymbolTable("ffffffffffffffff", ok(table("esp32")))).resolves.toBeNull();
    await expect(
      loadSymbolTable("0123456789abcdef", async () => {
        throw new Error("down");
      }),
    ).resolves.toBeNull();
  });
});

describe("firmware-symbols: nm parsing", () => {
  it("keeps sized code symbols, sorted, one per start address", () => {
    const nm = [
      "400d0200 00000040 T readProbes()",
      "400d0000 00000100 T setup()",
      "400d0000 00000100 W setup_alias()",
      "3ffb0000 00000010 D someData",
      "400d0100 00000000 t zeroSized",
      "400d0100 00000080 t loop()",
    ].join("\n");
    expect(parseNmFunctions(nm)).toEqual([
      [0x400d0000, 0x100, "setup()"],
      [0x400d0100, 0x80, "loop()"],
      [0x400d0200, 0x40, "readProbes()"],
    ]);
  });
});

describe("published firmware has a function table for its exact build", () => {
  // The image embeds its ELF's SHA-256 (app description, 0xb0 into the app at 0x10000);
  // the firmware reports the first 16 hex digits, and the table must exist under that name.
  for (const chip of ["esp32", "esp32s3", "esp32c3"]) {
    it(chip, () => {
      const image = readFileSync(`public/firmware/probeharbor-probe-${chip}.bin`);
      const elf = image.subarray(0x10000 + 0xb0, 0x10000 + 0xb0 + 8).toString("hex");
      const t = JSON.parse(
        readFileSync(`public/firmware/symbols/${elf}.json`, "utf8"),
      ) as SymbolTable;
      const manifest = JSON.parse(readFileSync("public/firmware/manifest.json", "utf8")) as {
        version: string;
      };
      expect(t).toMatchObject({ elf, chip, version: manifest.version });
      expect(t.functions.length).toBeGreaterThan(1000);
      expect(lookupFunction(t, t.functions.find((f) => f[2] === "loop()")![0] + 4)?.fn).toBe(
        "loop()",
      );
    });
  }
});
