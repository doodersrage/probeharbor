/**
 * The probe firmware prints its failure lines in English ("TT wifi failed: …").
 * The flasher's raw log keeps them as-is; its status line uses the page's
 * language. Unknown lines (newer firmware) fall back to the board's own words.
 */
export function flasherFailureMessage(line: string, text: Record<string, string | undefined>): string {
  const own = line.charAt(3).toUpperCase() + line.slice(4);
  const pick = (key: string) => text[key] || own;
  if (line.startsWith("TT wifi failed")) return pick("wifiFailed");
  if (line.startsWith("TT key rejected")) return pick("keyRejected");
  if (line.startsWith("TT config error")) return pick("configError");
  if (line.startsWith("TT no probe")) {
    const pin = /GPIO (\d+)/.exec(line)?.[1] ?? "4";
    return text.noProbe ? text.noProbe.replace("{pin}", pin) : own;
  }
  return own;
}
