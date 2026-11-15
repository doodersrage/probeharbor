/**
 * MAINTENANCE_MODE=1 (a runtime setting; no rebuild): for a short database
 * move. Probe uploads answer 503 with Retry-After, so firmware 1.3.0+ keeps
 * the readings and resends them with their own times afterwards; scheduled
 * jobs (history collection, alerts, emails) are skipped. Nothing else
 * changes: pages still render, sign-in still works.
 */
import { getRuntimeEnv } from "./runtimeEnv";

export function isMaintenanceMode(): boolean {
  const v = getRuntimeEnv("MAINTENANCE_MODE")?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "on";
}

/** Seconds a client should wait before resending. */
export const MAINTENANCE_RETRY_AFTER_S = 120;

export function maintenanceIngestResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Down for a few minutes of maintenance: send again shortly" }),
    {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(MAINTENANCE_RETRY_AFTER_S),
      },
    },
  );
}
