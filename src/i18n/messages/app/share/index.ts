import { defineMessages } from "../../../catalog";
import { fmt } from "../../../format";
import en from "./en";

export type { ShareMessages } from "./en";
export const shareMessages = defineMessages("app/share", en);

/**
 * Translated flash notice for the Share pages, chosen from the same query
 * params as `loadShareDashboardContext` (which builds the English text).
 */
export function shareNotice(url: URL, t: (typeof en)["notices"]): string | null {
  const p = url.searchParams;
  const error = p.get("error");
  if (p.get("created")) return t.created;
  if (p.get("revoked")) return t.revoked;
  if (p.get("regenerated")) return t.regenerated;
  if (p.get("api_key_created")) return t.apiKeyCreated;
  if (p.get("api_key_revoked")) return t.apiKeyRevoked;
  if (p.get("status_created")) return t.statusCreated;
  if (p.get("status_revoked")) return t.statusRevoked;
  if (p.get("status_regenerated")) return t.statusRegenerated;
  if (error === "family_limit") return t.familyLimit;
  if (error === "pro_required") return t.proRequired;
  if (error) return t.error;
  return null;
}

/** "5m ago"-style age label, same buckets as `formatRelativeAge` in src/lib/relativeTime.ts. */
export function shareAgeLabel(
  iso: string | null | undefined,
  t: (typeof en)["haDiag"]["age"],
  now = Date.now(),
): string {
  const parsed = iso ? Date.parse(iso) : Number.NaN;
  if (Number.isNaN(parsed)) return t.never;
  const ms = now - parsed;
  const minutes = Math.floor(ms / 60000);
  if (ms < 0 || minutes < 1) return t.justNow;
  if (minutes < 60) return fmt(t.minutes, { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return fmt(t.hours, { count: hours });
  return fmt(t.days, { count: Math.floor(hours / 24) });
}
