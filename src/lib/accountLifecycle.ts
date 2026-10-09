import { createAdminClient, createServerClient } from "./supabase";
import { createStripeClient, isActiveSubscriptionStatus } from "./stripe";
import { getUserSubscription } from "./stripeSubscriptions";
import { notifyOps } from "./opsNotify";

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
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  deletedHouseholdIds: string[],
): Promise<void> {
  const bucket = await historyArchiveBucket();
  if (!bucket) return;
  try {
    for (const householdId of deletedHouseholdIds) {
      await deleteR2Prefix(bucket, `archives/${householdId}/`);
    }
    const { data } = await supabase.from("chart_share_tokens").select("r2_key").eq("user_id", userId);
    const keys = (data ?? []).map((row) => row.r2_key).filter(Boolean);
    if (keys.length) await bucket.delete(keys);
  } catch (error) {
    console.error("Account deletion: stored file cleanup failed:", error);
  }
}

export async function deleteUserAccount(
  userId: string,
): Promise<{ error: string | null }> {
  await cancelStripeSubscriptionForDeletedAccount(userId);

  const supabase = createServerClient();

  // Remove owned households where user is sole owner (cascade deletes devices)
  const deletedHouseholdIds: string[] = [];
  const { data: owned } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .eq("role", "owner");

  for (const row of owned ?? []) {
    const { count } = await supabase
      .from("household_members")
      .select("id", { count: "exact", head: true })
      .eq("household_id", row.household_id);

    if ((count ?? 0) <= 1) {
      await supabase.from("households").delete().eq("id", row.household_id);
      deletedHouseholdIds.push(row.household_id);
    } else {
      // This household has other members and this deleted account is its
      // only owner. Promote someone else to owner first -- otherwise the
      // household is left with members but no owner, and nobody can rename
      // it, manage billing, or invite/remove members afterward. Prefer an
      // existing "member" (already trusted with owner-level management),
      // falling back to whoever else has been in the household longest.
      const { data: candidates } = await supabase
        .from("household_members")
        .select("id, role, created_at")
        .eq("household_id", row.household_id)
        .neq("user_id", userId)
        .order("created_at", { ascending: true });

      const promotee =
        (candidates ?? []).find((member) => member.role === "member") ??
        candidates?.[0] ??
        null;

      if (promotee) {
        await supabase
          .from("household_members")
          .update({ role: "owner" })
          .eq("id", promotee.id);
      }

      await supabase
        .from("household_members")
        .delete()
        .eq("household_id", row.household_id)
        .eq("user_id", userId);
    }
  }

  await supabase.from("alert_settings").delete().eq("user_id", userId);
  await deleteStoredFilesForAccount(supabase, userId, deletedHouseholdIds);

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  return { error: error?.message ?? null };
}

