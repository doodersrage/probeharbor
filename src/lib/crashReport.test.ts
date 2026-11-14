import { describe, expect, it } from "vitest";
import { parseCrashReport } from "./crashReport";

const good = {
  elf: "BF1FCFAF50728988",
  task: "loopTask",
  pc: "0x400D1234",
  bt: ["0x400d1234", "0x400d5678"],
  cause: 28,
  addr: "0x0",
  reset: "panic",
};

describe("parseCrashReport", () => {
  it("accepts a firmware crash report, normalised to lowercase 8-digit hex", () => {
    expect(parseCrashReport(good)).toEqual({
      elf: "bf1fcfaf50728988",
      task: "loopTask",
      pc: "0x400d1234",
      bt: ["0x400d1234", "0x400d5678"],
      cause: 28,
      addr: "0x00000000",
      reset: "panic",
    });
  });

  it("needs the build hash and a program counter; the rest is optional", () => {
    expect(parseCrashReport({ elf: good.elf, pc: good.pc })).toEqual({
      elf: "bf1fcfaf50728988",
      task: null,
      pc: "0x400d1234",
      bt: [],
      cause: null,
      addr: null,
      reset: null,
    });
    expect(parseCrashReport({ pc: good.pc })).toBeNull();
    expect(parseCrashReport({ elf: good.elf })).toBeNull();
  });

  it("rejects a malformed hash, address or backtrace instead of guessing", () => {
    expect(parseCrashReport({ ...good, elf: "bf1fcfaf5072898" })).toBeNull(); // 15 digits
    expect(parseCrashReport({ ...good, elf: "zz1fcfaf50728988" })).toBeNull();
    expect(parseCrashReport({ ...good, pc: "400d1234" })).toBeNull();
    expect(parseCrashReport({ ...good, pc: "0x1400d1234" })).toBeNull(); // over 32 bits
    expect(parseCrashReport({ ...good, bt: ["0x400d1234", "oops"] })).toBeNull();
    expect(parseCrashReport({ ...good, bt: "0x400d1234" })).toBeNull();
    expect(parseCrashReport({ ...good, bt: Array.from({ length: 17 }, () => "0x1") })).toBeNull();
  });

  it("drops optional fields that don't fit rather than the whole report", () => {
    const r = parseCrashReport({
      ...good,
      task: "<script>alert(1)</script>",
      cause: -1,
      addr: "nope",
      reset: "Panic!",
    });
    expect(r).toMatchObject({ task: null, cause: null, addr: null, reset: null, pc: "0x400d1234" });
  });

  it("ignores anything that isn't an object", () => {
    for (const v of [undefined, null, "crash", 3, [good]]) expect(parseCrashReport(v)).toBeNull();
  });
});

describe("parseStoredCrash", () => {
  it("reads back what ingest stored", async () => {
    const { parseStoredCrash } = await import("./crashReport");
    expect(
      parseStoredCrash({ ...good, received_at: "2026-11-14T12:00:00.000Z", reported_fw: "1.5.1" }),
    ).toMatchObject({
      elf: "bf1fcfaf50728988",
      received_at: "2026-11-14T12:00:00.000Z",
      reported_fw: "1.5.1",
    });
  });
  it("refuses a value without a valid receive time, and drops a bad version", async () => {
    const { parseStoredCrash } = await import("./crashReport");
    expect(parseStoredCrash(good)).toBeNull();
    expect(parseStoredCrash({ ...good, received_at: "yesterday" })).toBeNull();
    expect(
      parseStoredCrash({ ...good, received_at: "2026-11-14T12:00:00.000Z", reported_fw: "<b>" })
        ?.reported_fw,
    ).toBeNull();
  });
});
