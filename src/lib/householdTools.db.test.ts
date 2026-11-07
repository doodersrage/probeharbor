import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { archiveOldReadings } from "./archiveHistory";
import { createClaimsPackExport, getClaimsPackExportByToken, revokeClaimsPackExport } from "./claimsPackExports";
import { createHistorySavedView, deleteHistorySavedView, listHistorySavedViews } from "./historySavedViews";
import { createInboundWebhook, listInboundWebhooks, resolveInboundWebhook, revokeInboundWebhook } from "./inboundWebhooks";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

describe("inbound webhooks (Neon)", () => {
  it("a token resolves to its household and records use; lists never show the secret; other households can't revoke", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const { token, signingSecret } = await createInboundWebhook(a.home, a.id, "  ");
    expect(await sql("select 1 from public.inbound_webhooks where token_hash = $1", [token])).toEqual([]); // stored hashed

    await expect(resolveInboundWebhook(` ${token} `)).resolves.toMatchObject({ householdId: a.home, signingSecret });
    const { webhooks } = await listInboundWebhooks(a.home);
    expect(webhooks).toHaveLength(1);
    expect(webhooks[0]).toMatchObject({ name: "Inbound webhook", has_signing_secret: true });
    expect(webhooks[0]?.last_used_at).not.toBeNull();
    expect(JSON.stringify(webhooks)).not.toContain(signingSecret!);
    expect((await listInboundWebhooks(b.home)).webhooks).toEqual([]);

    await revokeInboundWebhook(webhooks[0]!.id, b.home);
    await expect(resolveInboundWebhook(token!)).resolves.not.toBeNull();
    await revokeInboundWebhook(webhooks[0]!.id, a.home);
    await expect(resolveInboundWebhook(token!)).resolves.toBeNull();
  });
});

describe("claims-pack exports (Neon)", () => {
  it("a pack opens by token until revoked by its own household", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const pack = { rangeFrom: "2026-01-01T00:00:00Z", rangeTo: "2026-02-01T00:00:00Z", householdName: "Home" } as never;
    const { token, contentHash } = await createClaimsPackExport(a.home, pack, a.id);
    expect(contentHash).toMatch(/^[0-9a-f]{64}$/);
    await expect(getClaimsPackExportByToken(token!)).resolves.toMatchObject({ householdName: "Home" });

    await revokeClaimsPackExport(b.home, token!);
    await expect(getClaimsPackExportByToken(token!)).resolves.not.toBeNull();
    await revokeClaimsPackExport(a.home, token!);
    await expect(getClaimsPackExportByToken(token!)).resolves.toBeNull();
  });
});

describe("saved History views (Neon)", () => {
  it("each user sees and deletes only their own views", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const { id } = await createHistorySavedView({ userId: a.id, householdId: a.home, name: " Week ", params: { days: 7 } as never });
    expect(await listHistorySavedViews(a.id)).toEqual([expect.objectContaining({ id, name: "Week", params: { days: 7 } })]);
    expect(await listHistorySavedViews(b.id)).toEqual([]);
    await deleteHistorySavedView(b.id, id!);
    expect(await listHistorySavedViews(a.id)).toHaveLength(1);
    await deleteHistorySavedView(a.id, id!);
    expect(await listHistorySavedViews(a.id)).toEqual([]);
  });
});

describe("cold-storage archive (Neon)", () => {
  it("writes old readings to storage, oldest first, and records the archive", async () => {
    const a = await home("a@example.com");
    const [d] = await sql<{ id: string }>("insert into public.devices (household_id, name, source) values ($1, 'P', 'push') returning id", [a.home]);
    const [s] = await sql<{ id: string }>(
      "insert into public.device_sensors (device_id, key, label, kind) values ($1, 't', 'T', 'temperature') returning id",
      [d!.id],
    );
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values
       ($1, $2, now() - interval '120 days', 1), ($1, $2, now() - interval '100 days', 2), ($1, $2, now() - interval '1 day', 3)`,
      [s!.id, a.home],
    );
    const stored = new Map<string, string>();
    const r2 = { put: async (key: string, body: string) => void stored.set(key, body) } as unknown as R2Bucket;

    await expect(archiveOldReadings({ r2, retentionDays: 90 })).resolves.toEqual({ archived: 2, skipped: false, error: null });
    const [[key, body]] = [...stored.entries()] as [[string, string]];
    expect(key).toMatch(new RegExp(`^archives/${a.home}/`));
    expect((JSON.parse(body) as Array<{ value_num: number }>).map((r) => r.value_num)).toEqual([1, 2]);
    expect(await sql("select row_count, object_key from public.history_archives")).toEqual([{ row_count: 2, object_key: key }]);
  });
});
