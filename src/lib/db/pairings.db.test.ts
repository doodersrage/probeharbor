/**
 * Pairing codes on Postgres: single use, expiry, replacement, push devices
 * only, and a race between two claims.
 */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { insertTestUser, useTestDatabase } from "../../test/db";
import { claimPairing, createPairing } from "./pairings";

const db = useTestDatabase();
const sql = async <R>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as R[];
const h = (s: string) => createHash("sha256").update(s).digest("hex");

async function device(email: string, source: "push" | "pull" = "push") {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1",
    [userId],
  );
  // A pull feed has a URL and no key (devices_source_check).
  const [d] =
    source === "push"
      ? await sql<{ id: string }>(
          `insert into public.devices (household_id, name, source, ingest_key_hash, ingest_key_prefix)
           values ($1, 'Garage probe', 'push', $2, 'tk') returning id`,
          [m!.household_id, h(`k-${email}`)],
        )
      : await sql<{ id: string }>(
          `insert into public.devices (household_id, name, source, pull_url)
           values ($1, 'Garage probe', 'pull_url', 'https://example.com/feed.json') returning id`,
          [m!.household_id],
        );
  return { userId, householdId: m!.household_id, deviceId: d!.id };
}
const soon = () => new Date(Date.now() + 30 * 60_000);

describe("device pairings", () => {
  it("a code pairs its device once", async () => {
    const d = await device("a@example.com");
    await createPairing({ ...d, codeHash: h("one"), expiresAt: soon() });

    expect(await claimPairing(h("one"), "esp32c3")).toEqual({
      householdId: d.householdId,
      deviceId: d.deviceId,
      deviceName: "Garage probe",
    });
    expect(await claimPairing(h("one"), "esp32c3")).toBeNull();
    const [row] = await sql<{ used_chip: string; used: boolean }>(
      "select used_chip, used_at is not null as used from public.device_pairings where code_hash = $1",
      [h("one")],
    );
    expect(row).toEqual({ used_chip: "esp32c3", used: true });
  });

  it("an expired or unknown code pairs nothing", async () => {
    const d = await device("a@example.com");
    await createPairing({ ...d, codeHash: h("old"), expiresAt: new Date(Date.now() - 1000) });
    expect(await claimPairing(h("old"), null)).toBeNull();
    expect(await claimPairing(h("never-made"), null)).toBeNull();
  });

  it("a new code for a device replaces its unused one, but not used ones", async () => {
    const d = await device("a@example.com");
    await createPairing({ ...d, codeHash: h("first"), expiresAt: soon() });
    await claimPairing(h("first"), null);
    await createPairing({ ...d, codeHash: h("second"), expiresAt: soon() });
    await createPairing({ ...d, codeHash: h("third"), expiresAt: soon() });

    expect(await claimPairing(h("second"), null)).toBeNull();
    expect(await claimPairing(h("third"), null)).not.toBeNull();
    const rows = await sql<{ n: number }>(
      "select count(*)::int n from public.device_pairings where device_id = $1",
      [d.deviceId],
    );
    expect(rows[0]!.n).toBe(2); // first (used) and third
  });

  it("codes are per device: one device's new code leaves another's alone", async () => {
    const a = await device("a@example.com");
    const b = await device("b@example.com");
    await createPairing({ ...a, codeHash: h("a"), expiresAt: soon() });
    await createPairing({ ...b, codeHash: h("b"), expiresAt: soon() });
    expect((await claimPairing(h("a"), null))?.householdId).toBe(a.householdId);
    expect((await claimPairing(h("b"), null))?.householdId).toBe(b.householdId);
  });

  it("only push devices pair (a pull feed has no key to hand out)", async () => {
    const d = await device("a@example.com", "pull");
    await createPairing({ ...d, codeHash: h("pull"), expiresAt: soon() });
    expect(await claimPairing(h("pull"), null)).toBeNull();
  });

  it("two simultaneous claims of one code: exactly one wins", async () => {
    const d = await device("a@example.com");
    await createPairing({ ...d, codeHash: h("race"), expiresAt: soon() });
    const results = await Promise.all([claimPairing(h("race"), "x"), claimPairing(h("race"), "y")]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("deleting the device deletes its codes", async () => {
    const d = await device("a@example.com");
    await createPairing({ ...d, codeHash: h("gone"), expiresAt: soon() });
    await sql("delete from public.devices where id = $1", [d.deviceId]);
    expect(
      await sql("select 1 from public.device_pairings where device_id = $1", [d.deviceId]),
    ).toHaveLength(0);
  });
});
