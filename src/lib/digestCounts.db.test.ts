/**
 * The weekly digest counts only emails that went out (Neon path): a
 * suppressed address is "skipped", a failed send is an error, neither is
 * "sent". (Found when running the job on the scrubbed Neon dev copy: it
 * reported sent: 1 for an address the mailer had refused.)
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
const mail = vi.hoisted(() => ({ to: [] as string[], suppressed: new Set<string>(), failing: new Set<string>() }));
vi.mock("./mailer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./mailer")>()),
  sendEmail: async (to: string) => {
    if (mail.suppressed.has(to)) throw new Error(`Email address is suppressed: ${to}`);
    if (mail.failing.has(to)) throw new Error("mail binding unavailable");
    mail.to.push(to);
  },
}));

import { sendWeeklyDigestsForAllUsers } from "./digestEmails";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function ownerWithReadings(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  await sql("insert into public.alert_settings (user_id, enabled, digest_enabled) values ($1, true, true)", [id]);
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source, last_seen_at) values ($1, 'Garage', 'push', now()) returning id",
    [m!.household_id],
  );
  const [s] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind) values ($1, '0', 'Probe', 'temperature') returning id",
    [d!.id],
  );
  for (const hoursAgo of [30, 20, 10, 2]) {
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values ($1, $2, now() - ($3 || ' hours')::interval, 41)`,
      [s!.id, m!.household_id, hoursAgo],
    );
  }
  return id;
}

beforeEach(() => {
  mail.to = [];
  mail.suppressed.clear();
  mail.failing.clear();
});

describe("weekly digest counts (Neon)", () => {
  it("a delivered digest is sent; a suppressed one is skipped; a failed one is an error", async () => {
    await ownerWithReadings("ok@example.com");
    await ownerWithReadings("bounced@example.com");
    await ownerWithReadings("broken@example.com");
    mail.suppressed.add("bounced@example.com");
    mail.failing.add("broken@example.com");

    const result = await sendWeeklyDigestsForAllUsers();
    expect(mail.to).toEqual(["ok@example.com"]);
    expect(result.sent).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/digest email failed/);
  });
});
