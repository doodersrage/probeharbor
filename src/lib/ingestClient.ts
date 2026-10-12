/** Which integration sent an ingest push, as far as its User-Agent says. */
export type IngestClient = { name: "Home Assistant"; version: string | null; at: string };

/** Pushes this close together don't need the device meta rewritten. */
const REFRESH_MS = 60 * 60 * 1000;

/**
 * Home Assistant's shared HTTP session (used by the HACS integration and by
 * rest_command) sends "HomeAssistant/2026.10.1 aiohttp/… Python/…".
 */
export function detectIngestClient(userAgent: string | null | undefined, at: string): IngestClient | null {
  const match = /\bHomeAssistant\/([\w.]+)/i.exec(userAgent ?? "");
  if (!match) return null;
  return { name: "Home Assistant", version: match[1] ?? null, at };
}

/** The ingest_client meta to write, or null when what's stored is still current. */
export function ingestClientPatch(previous: unknown, next: IngestClient | null): IngestClient | null {
  if (!next) return null;
  const prev = readIngestClient(previous);
  if (prev && prev.name === next.name && prev.version === next.version && Date.parse(next.at) - Date.parse(prev.at) < REFRESH_MS) {
    return null;
  }
  return next;
}

export function readIngestClient(value: unknown): IngestClient | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (raw.name !== "Home Assistant" || typeof raw.at !== "string") return null;
  return { name: "Home Assistant", version: typeof raw.version === "string" ? raw.version : null, at: raw.at };
}
