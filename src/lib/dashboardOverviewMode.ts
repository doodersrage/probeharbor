import { updateSessionUserMetadata } from "./sessionMetadata";
import type { User } from "@supabase/supabase-js";

export type DashboardOverviewMode = "simple" | "insights";

export function getDashboardOverviewMode(
  user: User | null | undefined,
): DashboardOverviewMode {
  const raw = user?.user_metadata?.dashboard_overview_mode;
  return raw === "insights" ? "insights" : "simple";
}

export async function updateDashboardOverviewMode(
  accessToken: string,
  refreshToken: string,
  mode: DashboardOverviewMode,
): Promise<{ user: User | null; error: Error | null }> {
  return updateSessionUserMetadata(accessToken, refreshToken, { dashboard_overview_mode: mode });
}
