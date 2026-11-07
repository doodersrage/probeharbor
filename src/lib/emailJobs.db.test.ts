/**
 * Email jobs on the Neon path. Mail sending is stubbed; everything else is
 * real. (Monthly / quarterly / freeze-drill also load preferences through
 * userTempConfig.ts, not converted yet; their queries are tested directly.)
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));
const mail = vi.hoisted(() => ({ to: [] as string[] }));
vi.mock("./mailer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./mailer")>()),
  sendEmail: async (to: string) => {
    mail.to.push(to);
  },
}));

import * as jobs from "./db/emailJobs";
import { sendDripEmailsForAllUsers } from "./dripEmails";
import { addEmailSuppression, isEmailSuppressed, listEmailSuppressions, unsuppressEmail } from "./emailSuppressions";
import { applyUnsubscribe } from "./emailUnsubscribe";
import { addHouseholdMemberByUserId } from "./households";
import { sendTrialRemindersForAllUsers } from "./trialEmails";
import { getUserRecord } from "./userRecords";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

beforeEach(() => {
  mail.to = [];
});

describe("user records (Neon)", () => {
  it("email, sign-up time, confirmation and both metadata objects", async () => {
    const id = await insertTestUser(db.client(), "a@example.com");
    await sql(`insert into public.user_profiles (user_id, metadata, app_metadata) values ($1, '{"locale":"de"}', '{"referred_by":"x"}')`, [id]);
    const user = await getUserRecord(id);
    expect(user).toMatchObject({ id, email: "a@example.com", user_metadata: { locale: "de" }, app_metadata: { referred_by: "x" } });
    expect(user?.email_confirmed_at).toBeTruthy();
    await expect(getUserRecord("00000000-0000-4000-8000-000000000000")).resolves.toBeNull();
  });
});

describe("email suppressions and unsubscribe (Neon)", () => {
  it("suppress, check, list, unsuppress", async () => {
    await expect(addEmailSuppression(" Bounce@Example.com ", "bounce")).resolves.toEqual({ ok: true, error: null });
    await expect(isEmailSuppressed("bounce@example.com")).resolves.toBe(true);
    expect((await listEmailSuppressions()).rows.map((r) => r.email)).toEqual(["bounce@example.com"]);
    await unsuppressEmail("bounce@example.com");
    await expect(isEmailSuppressed("bounce@example.com")).resolves.toBe(false);
  });

  it("unsubscribing from the digest turns it off for the user and their memberships only", async () => {
    const owner = await insertTestUser(db.client(), "owner@example.com");
    const member = await insertTestUser(db.client(), "member@example.com");
    const [h] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [owner]);
    await addHouseholdMemberByUserId(h!.household_id, member, "member");
    await sql("update public.household_members set digest_opt_in = true");

    await expect(applyUnsubscribe(member, "digest")).resolves.toEqual({ error: null });
    const rows = await sql<{ user_id: string; digest_opt_in: boolean }>("select user_id, digest_opt_in from public.household_members");
    expect(rows.find((r) => r.user_id === member)?.digest_opt_in).toBe(false);
    expect(rows.find((r) => r.user_id === owner)?.digest_opt_in).toBe(true);
    expect(await sql("select digest_enabled from public.alert_settings where user_id = $1", [member])).toEqual([{ digest_enabled: false }]);
  });
});

describe("drip and trial emails (Neon)", () => {
  it("the first drip email goes out about an hour after sign-up, once, then advances the stage", async () => {
    const id = await insertTestUser(db.client(), "new@example.com");
    await sql(`update public.auth_users set "createdAt" = now() - interval '2 hours' where id = $1`, [id]);
    await sql("insert into public.alert_settings (user_id, drip_emails_enabled) values ($1, true)", [id]);

    const first = await sendDripEmailsForAllUsers({ hasFirstReading: async () => false });
    expect(first.sent).toBe(1);
    expect(mail.to).toEqual(["new@example.com"]);
    const [row] = await sql<{ drip_email_stage: number; last_drip_email_at: string | null }>(
      "select drip_email_stage, last_drip_email_at from public.alert_settings where user_id = $1",
      [id],
    );
    expect(row?.drip_email_stage).toBeGreaterThan(0);
    expect(row?.last_drip_email_at).not.toBeNull();

    mail.to = [];
    expect((await sendDripEmailsForAllUsers({ hasFirstReading: async () => false })).sent).toBe(0);
    expect(mail.to).toEqual([]);
  });

  it("a suppressed address gets no drip email", async () => {
    const id = await insertTestUser(db.client(), "gone@example.com");
    await sql(`update public.auth_users set "createdAt" = now() - interval '2 hours' where id = $1`, [id]);
    await sql("insert into public.alert_settings (user_id, drip_emails_enabled) values ($1, true)", [id]);
    await addEmailSuppression("gone@example.com", "bounce");
    expect((await sendDripEmailsForAllUsers({ hasFirstReading: async () => false })).sent).toBe(0);
    expect(mail.to).toEqual([]);
  });

  it("a trial ending in 3 days gets one reminder", async () => {
    const id = await insertTestUser(db.client(), "trial@example.com");
    await sql(
      `insert into public.stripe_subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, plan_tier)
       values ($1, 'cus', 'sub', 'trialing', now() + interval '2 days 20 hours', 'pro')`,
      [id],
    );
    await sql("insert into public.alert_settings (user_id) values ($1)", [id]);
    expect((await sendTrialRemindersForAllUsers()).sent).toBe(1);
    expect(mail.to).toEqual(["trial@example.com"]);
    expect((await sendTrialRemindersForAllUsers()).sent).toBe(0); // within 20 h
  });
});

describe("report and digest queries (Neon)", () => {
  it("flags, stamps (allow-listed), first reading, owned household, digest fan-out", async () => {
    const owner = await insertTestUser(db.client(), "owner@example.com");
    const member = await insertTestUser(db.client(), "member@example.com");
    const outsider = await insertTestUser(db.client(), "out@example.com");
    const [h] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [owner]);
    await addHouseholdMemberByUserId(h!.household_id, member, "member");
    // The owner opted in too: the fan-out must still leave them out (they get their own digest).
    await sql("update public.household_members set digest_opt_in = true where user_id = any($1::uuid[])", [[owner, member, outsider]]);
    await sql("insert into public.alert_settings (user_id, monthly_report_enabled) values ($1, true), ($2, false)", [owner, member]);

    await expect(jobs.userIdsWithFlag("monthly_report_enabled")).resolves.toEqual([owner]);
    await jobs.stampSettings(owner, "last_monthly_report_at");
    expect((await sql<{ v: string | null }>("select last_monthly_report_at as v from public.alert_settings where user_id = $1", [owner]))[0]?.v).not.toBeNull();
    await expect(jobs.stampSettings(owner, "email" as never)).rejects.toThrow(/Unknown stamp column/);

    await expect(jobs.firstOwnedHouseholdId(owner)).resolves.toBe(h!.household_id);
    await expect(jobs.digestFanOutMemberIds(owner)).resolves.toEqual([member]);

    await expect(jobs.userHasFirstReading(owner)).resolves.toBe(false);
    await sql("insert into public.devices (household_id, name, source, last_seen_at) values ($1, 'P', 'push', now())", [h!.household_id]);
    await expect(jobs.userHasFirstReading(member)).resolves.toBe(true);
  });
});
