// The middleware imports this module, and it also runs for prerendered pages
// at build time, where cloudflare:workers can't load. The database modules
// read it on import, so they're loaded only when they're used.
const loadDb = () => import("./db/admin");
import { notifyOps } from "./opsNotify";

export type ServerErrorRow = {
  id: string;
  path: string;
  method: string;
  message: string;
  stack: string | null;
  user_id: string | null;
  created_at: string;
};

const NOTIFY_COOLDOWN_MS = 5 * 60 * 1000;
const lastNotifiedByPath = new Map<string, number>();

export async function recordServerError(input: {
  path: string;
  method?: string;
  error: unknown;
  userId?: string | null;
}): Promise<void> {
  const message =
    input.error instanceof Error ? input.error.message : String(input.error);
  const stack = input.error instanceof Error ? input.error.stack ?? null : null;

  try {
    const Sentry = await import("@sentry/cloudflare");
    Sentry.captureException(input.error, {
      tags: { path: input.path, method: input.method ?? "GET" },
      user: input.userId ? { id: input.userId } : undefined,
    });
  } catch {
    /* Sentry optional at build/test time */
  }

  try {
    const row = {
      path: input.path.slice(0, 500),
      method: (input.method ?? "GET").slice(0, 16),
      message: message.slice(0, 2000),
      stack: stack?.slice(0, 8000) ?? null,
      user_id: input.userId ?? null,
    };
    const db = await loadDb();
    await db.insertServerError(row);
  } catch (dbError) {
    console.error("Failed to record server error:", dbError);
  }

  const key = `${input.method ?? "GET"} ${input.path}`;
  const last = lastNotifiedByPath.get(key) ?? 0;
  if (Date.now() - last >= NOTIFY_COOLDOWN_MS) {
    lastNotifiedByPath.set(key, Date.now());
    await notifyOps(
      `ProbeHarbor page error: ${input.path}`,
      [`Method: ${input.method ?? "GET"}`, `Message: ${message}`, stack ? `Stack: ${stack.slice(0, 500)}` : ""]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

export async function listRecentServerErrors(limit = 20): Promise<ServerErrorRow[]> {
  const db = await loadDb();
  return db.listServerErrors<ServerErrorRow>(limit);
}
