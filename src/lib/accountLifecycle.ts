import * as neonAccounts from "./db/accounts";
import { createStripeClient, isActiveSubscriptionStatus } from "./stripe";
import { getUserSubscription } from "./stripeSubscriptions";
import { notifyOps } from "./opsNotify";
import { isChartShareKey } from "./chartShareKeys";

// Deleting the account must not leave a live subscription billing someone who
// can no longer sign in to cancel it themselves. Cancel first; if Stripe is
// unreachable, alert ops so a human can cancel it manually rather than
// silently deleting the account with billing still running.
export async function cancelStripeSubscriptionForDeletedAccount(
  userId: string,
): Promise<void> {
  const subscription = await getUserSubscription(userId);
  if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
    return;
  }

  try {
    const stripe = createStripeClient();
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    await notifyOps(
      "ProbeHarbor: Stripe cancellation failed during account deletion",
      `User ${userId} deleted their account but subscription ${subscription.stripe_subscription_id} could not be cancelled: ${message}. Cancel it manually in Stripe.`,
    );
  }
}

/** R2 bucket for history archives and shared chart images; null outside the Worker. */
async function historyArchiveBucket(): Promise<R2Bucket | null> {
  try {
    // Dynamic import: a static cloudflare:workers import breaks prerendered pages at build time.
    const { env } = await import("cloudflare:workers");
    return (env as unknown as { HISTORY_ARCHIVE?: R2Bucket }).HISTORY_ARCHIVE ?? null;
  } catch {
    return null;
  }
}

/**
 * Delete every object under a prefix, a page (up to 1000 keys) at a time.
 * Each page is deleted before listing again from the start, so no cursor has
 * to survive the deletions.
 */
export async function deleteR2Prefix(bucket: R2Bucket, prefix: string): Promise<number> {
  let deleted = 0;
  for (;;) {
    const page = await bucket.list({ prefix });
    const keys = page.objects.map((object) => object.key);
    if (keys.length === 0) break;
    await bucket.delete(keys);
    deleted += keys.length;
    if (!page.truncated) break;
  }
  return deleted;
}

/**
 * Files outside the database: cold-storage history archives of households
 * being deleted, and the user's shared chart images. Best-effort, so a storage
 * hiccup never blocks deleting the account.
 */
async function deleteStoredFilesForAccount(
  /** The user's shared chart image keys (read before the account is removed). */
  loadChartKeys: () => Promise<string[]>,
  deletedHouseholdIds: string[],
): Promise<void> {
  const bucket = await historyArchiveBucket();
  if (!bucket) return;
  try {
    for (const householdId of deletedHouseholdIds) {
      await deleteR2Prefix(bucket, `archives/${householdId}/`);
    }
    const keys = (await loadChartKeys()).filter(isChartShareKey);
    if (keys.length) await bucket.delete(keys);
  } catch (error) {
    console.error("Account deletion: stored file cleanup failed:", error);
  }
}

export async function deleteUserAccount(
  userId: string,
): Promise<{ error: string | null }> {
  await cancelStripeSubscriptionForDeletedAccount(userId);

  let deletedHouseholdIds: string[];
  try {
    deletedHouseholdIds = await neonAccounts.releaseOwnedHouseholds(userId);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
  await deleteStoredFilesForAccount(() => neonAccounts.chartShareKeys(userId), deletedHouseholdIds);
  try {
    await neonAccounts.deleteUserRow(userId);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
