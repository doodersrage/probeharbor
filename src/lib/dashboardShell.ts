import type { User, Session } from "./appUser";
import type { AstroCookies } from "astro";
import { getAuthFromCookies } from "./auth";
import { isUserAdmin } from "./adminAccess";
import { getUserEntitlements, type Entitlements } from "./entitlements";
import { countUnacknowledgedAlerts } from "./alertEvents";
import {
  getOrCreateHouseholdForUser,
  listUserHouseholds,
  type UserHousehold,
} from "./households";
import {
  fetchLatestSensorValuesResult,
  type LatestSensorRow,
} from "./sensorReadings";
import { formatRelativeAge } from "./relativeTime";
import { newestRecordedAt } from "./dashboardNav";
import { getUserSubscription } from "./stripeSubscriptions";

export type DashboardShell = {
  session: Session;
  user: User;
  isAdmin: boolean;
  entitlements: Entitlements;
  unackedAlerts: number;
  households: UserHousehold[];
  householdCount: number;
  showPortfolioInMonitor: boolean;
  liveLagging: boolean;
  activeHouseholdId: string | null;
  activeHouseholdName: string | null;
  lastReadingAt: string | null;
  /** Present when live-lag was computed; reuse to avoid a second latest fetch. */
  latest: LatestSensorRow[] | null;
  /**
   * The renewal payment failed and Stripe is retrying (past_due): the plan is
   * kept for now, so the dashboard asks for a working card. False when the
   * lookup fails.
   */
  paymentFailed: boolean;
};

export type DashboardShellOptions = {
  includeLiveLag?: boolean;
};

/**
 * Shared dashboard chrome data. Prefer Astro.locals.dashboardShell from middleware
 * so Overview/Devices/etc. do not re-fetch entitlements/unacked/households/latest.
 */
export async function loadDashboardShell(
  cookies: AstroCookies,
  opts?: DashboardShellOptions,
): Promise<DashboardShell | null> {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) return null;
  return loadDashboardShellForUser(user, session, opts);
}

export async function loadDashboardShellForUser(
  user: User,
  session: Session,
  opts?: DashboardShellOptions,
): Promise<DashboardShell> {
  const includeLiveLag = opts?.includeLiveLag ?? true;

  const [isAdmin, entitlements, unackedAlerts, userHouseholds, household, subscription] =
    await Promise.all([
      isUserAdmin(user.id),
      getUserEntitlements(user.id),
      countUnacknowledgedAlerts(user.id),
      listUserHouseholds(user.id),
      getOrCreateHouseholdForUser(user.id, user.email),
      getUserSubscription(user.id).catch(() => null),
    ]);

  const households = userHouseholds.households;
  const householdCount = households.length;
  const showPortfolioInMonitor =
    entitlements.canUsePortfolio || householdCount >= 2;
  const activeHouseholdId = household.householdId;
  const activeHouseholdName =
    households.find((row) => row.household_id === activeHouseholdId)?.name ??
    null;

  let liveLagging = false;
  let latest: LatestSensorRow[] | null = null;
  let lastReadingAt: string | null = null;
  if (includeLiveLag && activeHouseholdId) {
    const result = await fetchLatestSensorValuesResult(activeHouseholdId);
    // On a failed lookup leave `latest` null so the page fetches again and can
    // show "couldn't load" instead of an empty household.
    latest = result.error ? null : result.rows;
    lastReadingAt = newestRecordedAt(result.rows);
    // No readings yet isn't "lagging": a brand-new account shouldn't get a warning dot.
    liveLagging =
      result.rows.length > 0 &&
      result.rows.some((row) => {
        if (!row.recorded_at) return true;
        return formatRelativeAge(row.recorded_at, undefined, undefined, row.reportIntervalMs).lagging;
      });
  }

  return {
    session,
    user,
    isAdmin,
    entitlements,
    unackedAlerts,
    households,
    householdCount,
    showPortfolioInMonitor,
    liveLagging,
    activeHouseholdId,
    activeHouseholdName,
    lastReadingAt,
    latest,
    paymentFailed: subscription?.status === "past_due",
  };
}

export function planLabelForEntitlements(entitlements: Entitlements): string {
  if (entitlements.tier === "admin") return "Admin";
  return entitlements.tier.charAt(0).toUpperCase() + entitlements.tier.slice(1);
}

/** Prefer shell.latest when it matches this household. */
export function latestFromShell(
  shell: DashboardShell | null | undefined,
  householdId: string | null | undefined,
): LatestSensorRow[] | null {
  if (!shell?.latest || !householdId) return null;
  if (shell.activeHouseholdId !== householdId) return null;
  return shell.latest;
}

export function computeLiveLagging(latest: LatestSensorRow[]): boolean {
  if (latest.length === 0) return true;
  return latest.some((row) => {
    if (!row.recorded_at) return true;
    return formatRelativeAge(row.recorded_at, undefined, undefined, row.reportIntervalMs).lagging;
  });
}
