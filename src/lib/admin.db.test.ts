import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
vi.mock("./opsNotify", () => ({ notifyOps: async () => {} }));

import { isUserAdmin, isUserInGroup } from "./adminAccess";
import { fetchCheckoutAnalyticsAdmin } from "./checkoutAnalytics";
import { fetchAllContactSubmissions, fetchContactSubmissions } from "./contactSubmissions";
import { updateContact } from "./db/admin";
import { listRecentServerErrors, recordServerError } from "./serverErrors";
import { fetchManagedUsers, setUserAdminMembership } from "./userManager";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function makeAdmin(userId: string) {
  await sql(
    "insert into public.group_members (user_id, group_id, role) select $1, id, 'member' from public.groups where name = 'admin'",
    [userId],
  );
}

describe("admin checks and user manager (Neon)", () => {
  it("only members of the admin group are admins", async () => {
    const admin = await insertTestUser(db.client(), "admin@example.com");
    const user = await insertTestUser(db.client(), "user@example.com");
    await makeAdmin(admin);
    await expect(isUserAdmin(admin)).resolves.toBe(true);
    await expect(isUserAdmin(user)).resolves.toBe(false);
    await expect(isUserInGroup(user, "user")).resolves.toBe(true); // signup group
    await expect(isUserInGroup(user, "no-such-group")).resolves.toBe(false);
  });

  it("an admin can list users and grant admin; a non-admin gets neither", async () => {
    const admin = await insertTestUser(db.client(), "admin@example.com");
    const user = await insertTestUser(db.client(), "user@example.com");
    await makeAdmin(admin);

    const listed = await fetchManagedUsers(admin);
    expect(listed.error).toBeNull();
    expect(listed.totalCount).toBe(2);
    expect(listed.users.map((u) => u.email).sort()).toEqual(["admin@example.com", "user@example.com"]);

    const denied = await fetchManagedUsers(user);
    expect(denied.users).toEqual([]);
    expect(denied.error).toMatch(/Forbidden/);
    expect((await setUserAdminMembership(user, user, true)).error).toMatch(/Forbidden/);
    await expect(isUserAdmin(user)).resolves.toBe(false);

    await expect(setUserAdminMembership(admin, user, true)).resolves.toEqual({ error: null });
    await expect(isUserAdmin(user)).resolves.toBe(true);
  });
});

describe("contact submissions (Neon)", () => {
  it("pages, filters by status, searches safely, and updates one row", async () => {
    for (const [name, status] of [
      ["Alice", "new"],
      ["Bob", "done"],
      ["Carol", "new"],
    ] as const) {
      await sql("insert into public.contacts (name, email, message, status) values ($1, $2, 'hello', $3)", [
        name,
        `${name.toLowerCase()}@example.com`,
        status,
      ]);
    }
    expect((await fetchContactSubmissions(1, 2)).totalPages).toBe(2);
    expect((await fetchContactSubmissions(1, 10, { status: "new" })).totalCount).toBe(2);
    expect((await fetchContactSubmissions(1, 10, { search: "bob@" })).submissions.map((s) => s.name)).toEqual(["Bob"]);
    // Text that would be filter syntax in PostgREST is just text here.
    expect((await fetchContactSubmissions(1, 10, { search: "x,status.eq.new" })).totalCount).toBe(0);

    const bob = (await fetchAllContactSubmissions()).submissions.find((s) => s.name === "Bob")!;
    await updateContact(bob.id, { admin_notes: "called back" });
    const after = (await fetchAllContactSubmissions()).submissions.find((s) => s.id === bob.id)!;
    expect(after).toMatchObject({ status: "done", admin_notes: "called back" });
  });
});

describe("ops logs (Neon)", () => {
  it("server errors are recorded and listed newest first", async () => {
    await recordServerError({ path: "/a", method: "POST", error: new Error("first") });
    await recordServerError({ path: "/b", error: "second" });
    const rows = await listRecentServerErrors();
    expect(rows.map((r) => r.message)).toEqual(["second", "first"]);
    expect(rows[1]).toMatchObject({ path: "/a", method: "POST" });
  });

  it("checkout analytics count recent checkout starts", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [userId]);
    await sql(
      `insert into public.household_activity (household_id, user_id, action, detail, created_at) values
       ($1, $2, 'checkout_started', 'pro|annual|pricing', now()),
       ($1, $2, 'checkout_started', 'member|monthly', now() - interval '40 days'),
       ($1, $2, 'device_added', null, now())`,
      [m!.household_id, userId],
    );
    const stats = await fetchCheckoutAnalyticsAdmin(30);
    expect(stats).toMatchObject({ totalCheckouts: 2, last30Days: 1 });
  });
});
