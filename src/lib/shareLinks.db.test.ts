import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
const signedIn = vi.hoisted(() => ({ user: null as null | { id: string; email: string } }));
vi.mock("./auth", () => ({
  getAuthFromRequest: async () => ({ user: signedIn.user }),
}));

import { GET as listRoute } from "../pages/api/share/manage";
import { insertChartShare, findChartShare } from "./db/shareLinks";
import { sha256Hex, storedShareTokenFields } from "./shareLinkTokens";
import {
  countLiveShareLinks,
  deleteShareLink,
  findShareLink,
  insertShareLink,
  listShareLinks,
  replaceShareLinkToken,
  resolveShareToken,
} from "./shareLinksStore";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function owner(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, email, home: m!.household_id };
}

async function link(householdId: string, createdBy: string, token: string, scope = "live") {
  await insertShareLink({ ...(await storedShareTokenFields(token)), household_id: householdId, scope, label: null, expires_at: null, created_by: createdBy });
  return (await listShareLinks(householdId)).links.find((l) => l.token_preview === token.slice(-4))!;
}

describe("share links (Neon)", () => {
  it("a token resolves to its household by hash; the raw token isn't stored", async () => {
    const a = await owner("a@example.com");
    const row = await link(a.home, a.id, "share-token-aaaa");
    expect(row.token).toBeNull();
    await expect(resolveShareToken(await sha256Hex("share-token-aaaa"), null)).resolves.toMatchObject({
      household_id: a.home,
      scope: "live",
    });
    await expect(resolveShareToken(await sha256Hex("wrong"), null)).resolves.toBeNull();
  });

  it("a pre-hash link only resolves by raw token when asked, and not once hashed", async () => {
    const a = await owner("a@example.com");
    const raw = "a".repeat(48);
    await sql("insert into public.share_links (token, household_id, scope) values ($1, $2, 'live')", [raw, a.home]);
    await expect(resolveShareToken(await sha256Hex(raw), null)).resolves.toBeNull();
    await expect(resolveShareToken(await sha256Hex(raw), raw)).resolves.toMatchObject({ household_id: a.home });
    await sql("update public.share_links set token_hash = 'x' where token = $1", [raw]);
    await expect(resolveShareToken(await sha256Hex(raw), raw)).resolves.toBeNull();
  });

  it("another household can't find, regenerate, revoke or list the link", async () => {
    const a = await owner("a@example.com");
    const b = await owner("b@example.com");
    const row = await link(a.home, a.id, "share-token-bbbb");

    await expect(findShareLink(b.home, row.id)).resolves.toBeNull();
    expect((await replaceShareLinkToken(b.home, row.id, await storedShareTokenFields("hijack-token-cccc"))).error).toBeTruthy();
    await deleteShareLink(b.home, row.id);
    expect((await listShareLinks(b.home)).links).toEqual([]);
    await expect(resolveShareToken(await sha256Hex("share-token-bbbb"), null)).resolves.toMatchObject({ household_id: a.home });

    // The owner can regenerate: the old token stops working.
    expect((await replaceShareLinkToken(a.home, row.id, await storedShareTokenFields("share-token-dddd"))).error).toBeNull();
    await expect(resolveShareToken(await sha256Hex("share-token-bbbb"), null)).resolves.toBeNull();
    await expect(resolveShareToken(await sha256Hex("share-token-dddd"), null)).resolves.toMatchObject({ household_id: a.home });
    await deleteShareLink(a.home, row.id);
    await expect(resolveShareToken(await sha256Hex("share-token-dddd"), null)).resolves.toBeNull();
  });

  it("counts live links per household", async () => {
    const a = await owner("a@example.com");
    const b = await owner("b@example.com");
    await link(a.home, a.id, "share-token-1111");
    await link(a.home, a.id, "share-token-2222", "history");
    await link(b.home, b.id, "share-token-3333");
    await expect(countLiveShareLinks(a.home)).resolves.toBe(1);
  });

  it("the Share API never sends token_hash, and lists only the caller's household", async () => {
    const a = await owner("a@example.com");
    const b = await owner("b@example.com");
    await link(a.home, a.id, "share-token-eeee");
    await link(b.home, b.id, "share-token-ffff");
    signedIn.user = { id: a.id, email: a.email };

    const response = await listRoute({ request: new Request("https://example.com/api/share/manage"), cookies: {} } as unknown as APIContext);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).not.toContain("token_hash");
    const body = JSON.parse(text) as { links: Array<{ token_preview: string }> };
    expect(body.links.map((l) => l.token_preview)).toEqual(["eeee"]);
  });
});

describe("chart image shares (Neon)", () => {
  it("stores and finds a share by token", async () => {
    const a = await owner("a@example.com");
    const expires = new Date(Date.now() + 86400_000).toISOString();
    await expect(
      insertChartShare({ token: "chart-tok", user_id: a.id, r2_key: "chart-shares/chart-tok.png", title: "Week", expires_at: expires }),
    ).resolves.toEqual({ error: null });
    await expect(findChartShare("chart-tok")).resolves.toMatchObject({ r2_key: "chart-shares/chart-tok.png", title: "Week" });
    await expect(findChartShare("nope")).resolves.toBeNull();
  });
});
