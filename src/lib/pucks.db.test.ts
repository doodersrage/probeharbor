import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  finishPuckClaim,
  getPuck,
  hmacSha256Hex,
  registerPuck,
  resolveBayMoodForHousehold,
  setBayMoodOverride,
  startPuckClaim,
} from "./pucks";

import { bindClaimedBay } from "./db/pucks";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const DEVICE = "0123456789abcdef0123456789abcdef";
const SECRET = "a".repeat(64);

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function claim(householdId: string, bayId = "bay-1", secret = SECRET) {
  const started = await startPuckClaim({ deviceId: DEVICE, bayId, householdId });
  if (!started.ok) throw new Error(started.error);
  const responseHex = await hmacSha256Hex(secret, started.nonceHex);
  return { nonceHex: started.nonceHex, responseHex };
}

describe("puck registration (Neon)", () => {
  it("the owning household can re-key its puck; another household can't take it", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await expect(registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id })).resolves.toEqual({ ok: true });
    await expect(
      registerPuck({ deviceId: DEVICE, secretHex: "b".repeat(64), householdId: a.home, createdBy: a.id }),
    ).resolves.toEqual({ ok: true });
    await expect(
      registerPuck({ deviceId: DEVICE, secretHex: "c".repeat(64), householdId: b.home, createdBy: b.id }),
    ).resolves.toMatchObject({ ok: false, error: "device_owned", status: 409 });
    await expect(getPuck(DEVICE)).resolves.toMatchObject({ household_id: a.home, secret_hex: "b".repeat(64) });
  });

  it("two households registering the same new device at once: exactly one gets it", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const results = await Promise.all([
      registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id }),
      registerPuck({ deviceId: DEVICE, secretHex: "d".repeat(64), householdId: b.home, createdBy: b.id }),
    ]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    const owner = (await getPuck(DEVICE))!.household_id;
    expect(owner).toBe(results[0]!.ok ? a.home : b.home);
  });
});

describe("puck claims and moods (Neon)", () => {
  it("a correct HMAC binds the bay once; replaying it fails; a wrong one never binds", async () => {
    const a = await home("a@example.com");
    await registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id });

    const bad = await claim(a.home, "bay-1", "f".repeat(64));
    await expect(
      finishPuckClaim({ deviceId: DEVICE, bayId: "bay-1", nonceHex: bad.nonceHex, responseHex: bad.responseHex, spaceName: "X", householdId: a.home }),
    ).resolves.toMatchObject({ ok: false, error: "bad_mac" });

    const good = await claim(a.home);
    const input = { deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: " Garage ", householdId: a.home };
    await expect(finishPuckClaim(input)).resolves.toEqual({ ok: true, bayId: "bay-1", spaceName: "Garage" });
    await expect(finishPuckClaim(input)).resolves.toMatchObject({ ok: false, error: "no_pending" });
    await expect(getPuck(DEVICE)).resolves.toMatchObject({ bay_id: "bay-1", space_name: "Garage" });
  });

  it("an expired claim is refused as expired, and the bind step itself won't use it", async () => {
    const a = await home("a@example.com");
    await registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id });
    const good = await claim(a.home);
    await sql("update public.puck_claim_pending set expires_at = now() - interval '1 minute' where device_id = $1", [DEVICE]);
    const input = { deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: "Garage", householdId: a.home };
    await expect(finishPuckClaim(input)).resolves.toMatchObject({ ok: false, error: "expired" });
    // Straight to the bind (as if the expiry passed between check and bind): nothing is bound or used up.
    await expect(bindClaimedBay(DEVICE, a.home, "bay-1", good.nonceHex, "Garage")).resolves.toBe("gone");
    await expect(getPuck(DEVICE)).resolves.toMatchObject({ bay_id: null });
    expect(await sql("select 1 from public.puck_claim_pending where device_id = $1", [DEVICE])).toHaveLength(1);
  });

  it("the same valid response sent twice at once binds only once", async () => {
    const a = await home("a@example.com");
    await registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id });
    const good = await claim(a.home);
    const input = { deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: "Garage", householdId: a.home };
    const results = await Promise.all([finishPuckClaim(input), finishPuckClaim(input), finishPuckClaim(input)]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
  });

  it("another household can't start or finish a claim, or set the mood", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id });
    await expect(startPuckClaim({ deviceId: DEVICE, bayId: "bay-1", householdId: b.home })).resolves.toMatchObject({
      ok: false,
      error: "unknown_device",
    });
    const good = await claim(a.home);
    await expect(
      finishPuckClaim({ deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: "X", householdId: b.home }),
    ).resolves.toMatchObject({ ok: false, error: "unknown_device" });
    await finishPuckClaim({ deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: "Garage", householdId: a.home });
    await expect(setBayMoodOverride({ bayId: "bay-1", householdId: b.home, mood: "panic" })).resolves.toMatchObject({
      ok: false,
      error: "bay_not_claimed",
    });
  });

  it("a mood override is what the bay shows", async () => {
    const a = await home("a@example.com");
    await registerPuck({ deviceId: DEVICE, secretHex: SECRET, householdId: a.home, createdBy: a.id });
    const good = await claim(a.home);
    await finishPuckClaim({ deviceId: DEVICE, bayId: "bay-1", nonceHex: good.nonceHex, responseHex: good.responseHex, spaceName: "Garage", householdId: a.home });
    await expect(setBayMoodOverride({ bayId: "bay-1", householdId: a.home, mood: "cozy" })).resolves.toEqual({ ok: true });
    await expect(resolveBayMoodForHousehold({ bayId: "bay-1", householdId: a.home })).resolves.toMatchObject({
      ok: true,
      mood: "cozy",
      spaceName: "Garage",
      source: "override",
    });
  });
});
