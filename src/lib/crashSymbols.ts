/**
 * Decode a probe crash report (crashReport.ts) into function names, with the
 * function table written for that exact build (scripts/firmware-symbols.mjs,
 * public/firmware/symbols/<elf>.json).
 *
 * - The program counter and, on ESP32 / S3, the backtrace are shown in order;
 *   an address outside every known function stays as a bare address.
 * - On the ESP32-C3 the report carries code addresses found on the crashed
 *   task's stack instead of a backtrace. Only those inside a known function
 *   are kept; they are likely callers, in stack order, not a proven chain.
 * - With no table for the build (an unknown or local build), nothing is
 *   decoded and the page shows the raw addresses.
 */
import type { CrashReport } from "./crashReport";

export type SymbolTable = {
  elf: string;
  chip: string;
  version: string;
  /** [start, size, name], sorted by start. */
  functions: [number, number, string][];
};

export type CrashFrame = { addr: string; fn: string | null; offset: number | null };

export type DecodedCrash = {
  /** The crashed build, from its table; null when there is none. */
  version: string | null;
  chip: string | null;
  frames: CrashFrame[];
  /** True on the C3: frames after the first are stack candidates, not a backtrace. */
  stackScan: boolean;
  /** "LoadProhibited", "Illegal instruction", … when the cause is known. */
  cause: string | null;
  /**
   * The chip was restarted by a watchdog (the reset reason the firmware sent),
   * not by an exception: the addresses show where it was when the watchdog
   * fired (for the task watchdog, usually the idle task), not the code that
   * stopped responding, and the exception cause doesn't apply.
   */
  watchdog: boolean;
};

/** Reset reasons (firmware 1.5.1 resetReasonName) that mean a watchdog restart. */
const WATCHDOG_RESETS = new Set(["task_wdt", "int_wdt", "wdt"]);

export function isWatchdogReset(reset: string | null): boolean {
  return reset != null && WATCHDOG_RESETS.has(reset);
}

/** The function containing `addr`, by binary search; null when none does. */
export function lookupFunction(
  table: SymbolTable,
  addr: number,
): { fn: string; offset: number } | null {
  const f = table.functions;
  let lo = 0;
  let hi = f.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (f[mid]![0] <= addr) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  if (found < 0) return null;
  const [start, size, fn] = f[found]!;
  return addr < start + size ? { fn, offset: addr - start } : null;
}

/** Xtensa EXCCAUSE (ESP32, ESP32-S3). */
const XTENSA_CAUSES: Record<number, string> = {
  0: "IllegalInstruction",
  2: "InstructionFetchError",
  3: "LoadStoreError",
  6: "IntegerDivideByZero",
  9: "LoadStoreAlignment",
  20: "InstFetchProhibited",
  28: "LoadProhibited",
  29: "StoreProhibited",
};

/** RISC-V mcause exceptions (ESP32-C3). */
const RISCV_CAUSES: Record<number, string> = {
  0: "Instruction address misaligned",
  1: "Instruction access fault",
  2: "Illegal instruction",
  3: "Breakpoint",
  4: "Load address misaligned",
  5: "Load access fault",
  6: "Store address misaligned",
  7: "Store access fault",
  11: "Environment call from M-mode",
};

export function causeName(chip: string | null, cause: number | null): string | null {
  if (cause == null || chip == null) return null;
  return (chip === "esp32c3" ? RISCV_CAUSES : XTENSA_CAUSES)[cause] ?? null;
}

export function decodeCrash(crash: CrashReport, table: SymbolTable | null): DecodedCrash {
  const chip = table?.chip ?? null;
  const stackScan = chip === "esp32c3";
  const frame = (addr: string): CrashFrame => {
    const hit = table ? lookupFunction(table, Number.parseInt(addr, 16)) : null;
    return { addr, fn: hit?.fn ?? null, offset: hit?.offset ?? null };
  };
  const frames: CrashFrame[] = [frame(crash.pc)];
  for (const addr of crash.bt) {
    const f = frame(addr);
    // Stack candidates count only when they land in code we know.
    if (stackScan && !f.fn) continue;
    // The backtrace usually repeats the pc first; don't show it twice.
    const last = frames[frames.length - 1]!;
    if (f.addr === last.addr || (stackScan && f.fn === last.fn)) continue;
    frames.push(f);
  }
  return {
    version: table?.version ?? null,
    chip,
    frames,
    stackScan,
    cause: isWatchdogReset(crash.reset) ? null : causeName(chip, crash.cause),
    watchdog: isWatchdogReset(crash.reset),
  };
}

function isSymbolTable(value: unknown, elf: string): value is SymbolTable {
  if (!value || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  return (
    t.elf === elf &&
    typeof t.chip === "string" &&
    typeof t.version === "string" &&
    Array.isArray(t.functions)
  );
}

/**
 * The table for a build, through the Worker's static assets. `fetchAsset`
 * defaults to the ASSETS binding; null when there is no table (or on error).
 */
export async function loadSymbolTable(
  elf: string,
  fetchAsset?: (path: string) => Promise<Response>,
): Promise<SymbolTable | null> {
  if (!/^[0-9a-f]{16}$/.test(elf)) return null;
  const path = `/firmware/symbols/${elf}.json`;
  try {
    const get =
      fetchAsset ??
      (async (p: string) => {
        const { env } = await import("cloudflare:workers");
        const assets = (env as unknown as { ASSETS?: { fetch: (r: Request) => Promise<Response> } })
          .ASSETS;
        if (!assets) throw new Error("no ASSETS binding");
        return assets.fetch(new Request(`https://assets.invalid${p}`));
      });
    const res = await get(path);
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return isSymbolTable(json, elf) ? json : null;
  } catch {
    return null;
  }
}
