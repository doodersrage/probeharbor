import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));
vi.mock("./mailer", () => ({ sendEmail: async () => {} }));

import { readLastKnownHealthy, writeLastKnownHealthy } from "./db/statusPages";
import {
  createStatusPageToken,
  listStatusPageTokens,
  regenerateStatusPageToken,
  resolveStatusPageToken,
  revokeStatusPageToken,
} from "./statusPage";
import {
  confirmStatusSubscription,
  listConfirmedStatusSubscribers,
  subscribeToStatusUpdates,
  unsubscribeStatusSubscription,
} from "./statusSubscriptions";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return m!.household_id;
}

describe("household status pages (Neon)", () => {
  it("a page's token resolves to its household; regenerate and revoke stop the old link", async () => {
    const a = await home("a@example.com");
    const { token } = await createStatusPageToken(a, "  ");
    await expect(resolveStatusPageToken(token!)).resolves.toEqual({ householdId: a });
    const [page] = await listStatusPageTokens(a);
    expect(page).toMatchObject({ label: "Status page", token: null });

    const { token: fresh } = await regenerateStatusPageToken(a, page!.id);
    await expect(resolveStatusPageToken(token!)).resolves.toBeNull();
    await expect(resolveStatusPageToken(fresh!)).resolves.toEqual({ householdId: a });

    await revokeStatusPageToken(a, page!.id);
    await expect(resolveStatusPageToken(fresh!)).resolves.toBeNull();
    expect(await listStatusPageTokens(a)).toEqual([]);
    expect((await regenerateStatusPageToken(a, page!.id)).error).toBeTruthy(); // revoked pages stay off
  });

  it("another household can't regenerate, revoke or list the page", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const { token } = await createStatusPageToken(a, "Cabin");
    const [page] = await listStatusPageTokens(a);
    expect((await regenerateStatusPageToken(b, page!.id)).error).toBeTruthy();
    await revokeStatusPageToken(b, page!.id);
    expect(await listStatusPageTokens(b)).toEqual([]);
    await expect(resolveStatusPageToken(token!)).resolves.toEqual({ householdId: a });
  });
});

describe("status email subscriptions (Neon)", () => {
  it("subscribe → confirm → listed; re-subscribing a confirmed address keeps its link; unsubscribe removes it", async () => {
    await expect(subscribeToStatusUpdates(" Ops@Example.com ")).resolves.toEqual({ ok: true });
    const [row] = await sql<{ token: string; email: string }>("select token, email from public.status_subscriptions");
    expect(row?.email).toBe("ops@example.com");
    expect(await listConfirmedStatusSubscribers()).toEqual([]);

    expect((await confirmStatusSubscription(row!.token)).ok).toBe(true);
    expect(await listConfirmedStatusSubscribers()).toEqual([{ email: "ops@example.com", token: row!.token }]);

    await subscribeToStatusUpdates("ops@example.com");
    expect((await listConfirmedStatusSubscribers())[0]?.token).toBe(row!.token);

    expect((await unsubscribeStatusSubscription(row!.token)).ok).toBe(true);
    expect(await listConfirmedStatusSubscribers()).toEqual([]);
    expect((await unsubscribeStatusSubscription(row!.token)).ok).toBe(false);
  });

  it("an unconfirmed address gets a new link on re-subscribe; two at once leave one row", async () => {
    await subscribeToStatusUpdates("new@example.com");
    const [first] = await sql<{ token: string }>("select token from public.status_subscriptions");
    await Promise.all([subscribeToStatusUpdates("new@example.com"), subscribeToStatusUpdates("new@example.com")]);
    const rows = await sql<{ token: string }>("select token from public.status_subscriptions");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.token).not.toBe(first?.token);
    expect((await confirmStatusSubscription("nope")).ok).toBe(false);
  });
});

describe("status notifier state (Neon)", () => {
  it("no row reads as null, then remembers the last value", async () => {
    await expect(readLastKnownHealthy()).resolves.toBeNull();
    await writeLastKnownHealthy(false);
    await expect(readLastKnownHealthy()).resolves.toBe(false);
    await writeLastKnownHealthy(true);
    await expect(readLastKnownHealthy()).resolves.toBe(true);
  });
});
