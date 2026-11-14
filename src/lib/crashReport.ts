/**
 * Crash reports from the probe firmware (1.5.1+).
 *
 * After a crash the chip saves a core dump to flash. On the next boot the
 * firmware reads its summary and sends it once, as `crash` next to `fw` and
 * `rssi` in a normal ingest post, then erases it when the post is accepted:
 *
 *   "crash": { "elf": "bf1fcfaf50728988", "task": "loopTask", "pc": "0x400d1234",
 *              "bt": ["0x400d1234", "0x400d5678"], "cause": 28, "addr": "0x0",
 *              "reset": "panic" }
 *
 * - `elf`: first 16 hex digits of the crashing build's ELF SHA-256 (it names
 *   the exact build, even if the probe has updated since).
 * - `pc`: where it stopped. `bt`: on ESP32 / S3 the backtrace; on the C3 (no
 *   backtrace in the summary) code addresses found on the crashing task's
 *   stack, which the decoder keeps only when they land in a known function.
 * - `cause` / `addr`: Xtensa EXCCAUSE / EXCVADDR, or RISC-V mcause / mtval.
 * - `reset`: the reset reason at the boot that read it (`panic`, `task_wdt`,
 *   `int_wdt`, …); the report may come from an earlier boot.
 *
 * Everything is checked here; a report that doesn't fit is dropped (the post
 * still succeeds). Decoding addresses into function names is
 * crashSymbols.ts.
 */

export type CrashReport = {
  elf: string;
  task: string | null;
  pc: string;
  bt: string[];
  cause: number | null;
  addr: string | null;
  reset: string | null;
};

/** Stored on the device; `reported_fw` is the version that sent it (the crashed build is `elf`). */
export type StoredCrash = CrashReport & { received_at: string; reported_fw: string | null };

const HEX32 = /^0x[0-9a-f]{1,8}$/i;
const MAX_FRAMES = 16;

const hex32 = (value: unknown): string | null =>
  typeof value === "string" && HEX32.test(value.trim())
    ? `0x${value.trim().slice(2).toLowerCase().padStart(8, "0")}`
    : null;

/** Validate `crash` from an ingest payload; null when absent or malformed. */
export function parseCrashReport(value: unknown): CrashReport | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const c = value as Record<string, unknown>;
  const elf = typeof c.elf === "string" ? c.elf.trim().toLowerCase() : "";
  if (!/^[0-9a-f]{16}$/.test(elf)) return null;
  const pc = hex32(c.pc);
  if (!pc) return null;
  if (c.bt !== undefined && !Array.isArray(c.bt)) return null;
  const rawBt = (c.bt as unknown[] | undefined) ?? [];
  if (rawBt.length > MAX_FRAMES) return null;
  const bt: string[] = [];
  for (const frame of rawBt) {
    const parsed = hex32(frame);
    if (!parsed) return null;
    bt.push(parsed);
  }
  const task = typeof c.task === "string" && /^[\x20-\x7e]{1,16}$/.test(c.task) ? c.task : null;
  const cause =
    typeof c.cause === "number" &&
    Number.isInteger(c.cause) &&
    c.cause >= 0 &&
    c.cause <= 0xffffffff
      ? c.cause
      : null;
  const reset = typeof c.reset === "string" && /^[a-z_]{1,24}$/.test(c.reset) ? c.reset : null;
  return { elf, task, pc, bt, cause, addr: hex32(c.addr), reset };
}

/** Read `meta.last_crash` back, re-checking it; null when absent or malformed. */
export function parseStoredCrash(value: unknown): StoredCrash | null {
  const report = parseCrashReport(value);
  if (!report) return null;
  const v = value as Record<string, unknown>;
  const receivedAt =
    typeof v.received_at === "string" && !Number.isNaN(Date.parse(v.received_at))
      ? v.received_at
      : null;
  if (!receivedAt) return null;
  const reportedFw =
    typeof v.reported_fw === "string" && /^\d+\.\d+\.\d+$/.test(v.reported_fw)
      ? v.reported_fw
      : null;
  return { ...report, received_at: receivedAt, reported_fw: reportedFw };
}
