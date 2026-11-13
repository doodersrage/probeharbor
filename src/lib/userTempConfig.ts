import type { User } from "./appUser";
import type { TempFeedConfig, TempProbeConfig } from "./tempFeedConfig";
import {
  getDefaultTempFeeds,
  getLegacyTempProbes,
  normalizePullFeedUrl,
  sanitizeTempFeeds,
  sanitizeTempProbes,
} from "./tempFeedConfig";
import { discoverAndMergeFeedProbes } from "./feedDiscovery";

export { normalizePullFeedUrl };

type TempConfigRow = {
  feeds: TempFeedConfig[];
  probes: TempProbeConfig[];
};

export async function saveUserTempConfig(
  userId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
): Promise<{ error: Error | null }> {
  const sanitizedFeeds = sanitizeTempFeeds(feeds);
  const sanitizedProbes = sanitizeTempProbes(probes, sanitizedFeeds);

  // Devices are the source of truth — do not write legacy tables.
  try {
    const { getOrCreateHouseholdForUser } = await import("./households");
    const { savePullDevicesForHousehold } = await import("./devices");
    const household = await getOrCreateHouseholdForUser(userId);
    if (household.householdId) {
      const sync = await savePullDevicesForHousehold(
        household.householdId,
        sanitizedFeeds,
        sanitizedProbes,
      );
      if (sync.error) {
        return { error: new Error(sync.error) };
      }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Failed to save pull devices"),
    };
  }

  return { error: null };
}

async function getCurrentTempConfig(userId: string): Promise<TempConfigRow> {
  const { getUserDevicesAsTempConfig } = await import("./devices");
  const fromDevices = await getUserDevicesAsTempConfig(userId);
  if (fromDevices.householdId) {
    return { feeds: fromDevices.feeds, probes: fromDevices.probes };
  }


  return { feeds: [], probes: [] };
}

/** Save pull feeds and probe labels in one step (feeds-only omits probe renames). */
export async function saveUserPullSetup(
  userId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[] | null,
): Promise<{ error: Error | null; discoveredProbes?: number }> {
  const current = await getCurrentTempConfig(userId);
  // An empty list is a real choice: never re-add the example feed behind the user's back.
  const sanitizedFeeds = sanitizeTempFeeds(feeds);
  const baseProbes =
    probes ??
    current.probes.filter((probe) =>
      sanitizedFeeds.some((feed) => feed.id === probe.feedId),
    );
  const sanitizedProbes = sanitizeTempProbes(baseProbes, sanitizedFeeds);

  const { feeds: mergedFeeds, probes: mergedProbes, discovered } =
    await discoverAndMergeFeedProbes(sanitizedFeeds, sanitizedProbes);

  const result = await saveUserTempConfig(userId, mergedFeeds, mergedProbes);
  if (result.error) {
    return result;
  }
  return { error: null, discoveredProbes: discovered };
}

/**
 * The same save for a known household (the metrics API: the key names the
 * household). Never goes through a user's preferred household, which can be
 * a different one they only view.
 */
export async function saveHouseholdPullSetup(
  householdId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
): Promise<{ error: Error | null; discoveredProbes?: number }> {
  const sanitizedFeeds = sanitizeTempFeeds(feeds);
  const sanitizedProbes = sanitizeTempProbes(probes, sanitizedFeeds);
  const { feeds: mergedFeeds, probes: mergedProbes, discovered } =
    await discoverAndMergeFeedProbes(sanitizedFeeds, sanitizedProbes);
  try {
    const { savePullDevicesForHousehold } = await import("./devices");
    const finalFeeds = sanitizeTempFeeds(mergedFeeds);
    const sync = await savePullDevicesForHousehold(householdId, finalFeeds, sanitizeTempProbes(mergedProbes, finalFeeds));
    if (sync.error) return { error: new Error(sync.error) };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error("Failed to save pull devices") };
  }
  return { error: null, discoveredProbes: discovered };
}

export async function deleteUserTempFeed(
  userId: string,
  feedId: string,
): Promise<{ error: Error | null }> {
  const current = await getCurrentTempConfig(userId);
  const feeds = current.feeds.filter((feed) => feed.id !== feedId);
  const probes = current.probes.filter((probe) => probe.feedId !== feedId);
  // Deleting the last feed leaves none (it used to re-create the example feed).
  return saveUserTempConfig(userId, feeds, probes);
}

export async function migrateLegacyTempConfigFromMetadata(
  user: Pick<User, "id" | "user_metadata">,
): Promise<TempConfigRow> {
  const metadata = user.user_metadata ?? {};
  const tempFeeds = metadata.temp_feeds
    ? sanitizeTempFeeds(metadata.temp_feeds)
    : getDefaultTempFeeds();
  const tempProbes = metadata.temp_probes
    ? sanitizeTempProbes(metadata.temp_probes, tempFeeds)
    : getLegacyTempProbes(metadata);

  await saveUserTempConfig(user.id, tempFeeds, tempProbes);

  return { feeds: tempFeeds, probes: tempProbes };
}

export async function getUserTempConfig(user: Pick<User, "id" | "email" | "user_metadata">): Promise<{
  feeds: TempFeedConfig[];
  probes: TempProbeConfig[];
  error: string | null;
}> {
  // Devices are the source of truth (the pre-device user_temp_* tables are
  // retired: empty in production, nothing writes them).
  const { getUserDevicesAsTempConfig } = await import("./devices");
  const fromDevices = await getUserDevicesAsTempConfig(user.id, user.email);
  if (fromDevices.feeds.length > 0 || fromDevices.devices.length > 0) {
    return {
      feeds: fromDevices.feeds,
      probes: fromDevices.probes,
      error: fromDevices.error,
    };
  }

  const metadata = user.user_metadata ?? {};
  if (metadata.temp_feeds || metadata.temp_probes || metadata.show_probe_0 !== undefined) {
    const migrated = await migrateLegacyTempConfigFromMetadata(user);
    return {
      feeds: migrated.feeds,
      probes: migrated.probes,
      error: null,
    };
  }

  // No feeds yet: the example feed is offered explicitly ("Try demo feed"), never pre-filled.
  return { feeds: [], probes: [], error: null };
}
