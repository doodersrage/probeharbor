import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) =>
    key === "DB_BACKEND" ? "neon" : key === "MOBILE_EXCHANGE_SECRET" ? "test-exchange-secret-0123456789" : undefined,
  hasRuntimeEnv: () => false,
}));

import * as neonRemaining from "./db/remaining";
import { listHouseholdActivity, recordHouseholdActivity } from "./householdActivity";
import { createMobileExchangeToken, verifyMobileExchangeToken } from "./mobileAuthExchange";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

describe("last small queries (Neon)", () => {
  it("mobile sign-in exchange tokens work once, and not after expiry", async () => {
    const token = await createMobileExchangeToken("access-1", "refresh-1");
    expect(token).toBeTruthy();
    await expect(verifyMobileExchangeToken(token!)).resolves.toEqual({ access_token: "access-1", refresh_token: "refresh-1" });
    await expect(verifyMobileExchangeToken(token!)).resolves.toBeNull();

    const late = await createMobileExchangeToken("access-2", "refresh-2");
    await sql("update public.mobile_oauth_exchanges set expires_at = now() - interval '1 second'");
    await expect(verifyMobileExchangeToken(late!)).resolves.toBeNull();
  });

  it("activity log is per household", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await recordHouseholdActivity({ householdId: a.home, userId: a.id, action: "alerts.saved", detail: "on" });
    await recordHouseholdActivity({ householdId: b.home, action: "other" });
    const rows = await listHouseholdActivity(a.home);
    expect(rows.map((r) => [r.action, r.detail, r.user_id])).toEqual([["alerts.saved", "on", a.id]]);
  });

  it("freeze-estimate snapshot upserts one row per household", async () => {
    const a = await home("a@example.com");
    await neonRemaining.saveEstimateSnapshot(a.home, { v: 1 }, "2026-11-01T00:00:00.000Z");
    await neonRemaining.saveEstimateSnapshot(a.home, { v: 2 }, "2026-11-02T00:00:00.000Z");
    await expect(neonRemaining.getEstimateSnapshot(a.home)).resolves.toEqual({ data: { v: 2 }, updated_at: "2026-11-02T00:00:00+00:00" });
    expect(await sql("select 1 from public.freeze_estimate_snapshots")).toHaveLength(1);
  });

  it("digest opt-in changes only this member; owners listed once; contacts stored", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await sql("insert into public.household_members (household_id, user_id, role) values ($1, $2, 'member')", [a.home, b.id]);
    await expect(neonRemaining.setDigestOptIn(a.home, b.id, true)).resolves.toEqual({ error: null });
    await expect(neonRemaining.getDigestOptIn(a.home, b.id)).resolves.toBe(true);
    await expect(neonRemaining.getDigestOptIn(a.home, a.id)).resolves.toBe(false);
    await expect(neonRemaining.getDigestOptIn(b.home, b.id)).resolves.toBe(false);
    expect((await neonRemaining.ownerUserIds()).sort()).toEqual([a.id, b.id].sort());
    await expect(neonRemaining.insertContact("Pat", "pat@example.com", "Hi")).resolves.toEqual({ error: null });
    expect(await sql("select name, status from public.contacts")).toEqual([{ name: "Pat", status: "new" }]);
  });

  it("Telegram secret resolves to exactly one user", async () => {
    const a = await home("a@example.com");
    await sql("insert into public.alert_settings (user_id, telegram_command_secret) values ($1, 'sekrit')", [a.id]);
    await expect(neonRemaining.userByTelegramSecret("sekrit")).resolves.toBe(a.id);
    await expect(neonRemaining.userByTelegramSecret("other")).resolves.toBeNull();
  });
});
