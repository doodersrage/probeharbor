/**
 * Request-building and delivery-accounting tests for sendWebPushToUser.
 *
 * Uses freshly generated VAPID and browser-side keys and a stubbed fetch: no
 * network, no real push service. The body is decrypted here with an
 * independent RFC 8291 implementation, so a passing test means the payload
 * is well-formed aes128gcm for these keys. It does NOT prove a real push
 * service or browser accepts it; that still needs a manual browser test.
 */
import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const env: Record<string, string | undefined> = {};
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => env[key],
  hasRuntimeEnv: (...keys: string[]) => keys.every((key) => Boolean(env[key])),
}));

const mockListPushSubscriptions = vi.fn();
const mockDeletePushSubscription = vi.fn();
vi.mock("./db/pushTokens", () => ({
  listPushSubscriptions: (...args: unknown[]) => mockListPushSubscriptions(...args),
  deletePushSubscription: (...args: unknown[]) => mockDeletePushSubscription(...args),
}));

import { sendWebPushToUser } from "./webPush";

const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
const fromB64url = (value: string) => new Uint8Array(Buffer.from(value, "base64url"));
const hmac = (key: Uint8Array, data: Uint8Array) =>
  new Uint8Array(createHmac("sha256", key).update(data).digest());
const concat = (...parts: Uint8Array[]) => new Uint8Array(Buffer.concat(parts));
const ascii = (text: string) => new Uint8Array(Buffer.from(text, "latin1"));

/** Same key format as scripts/generate-vapid-keys.mjs. */
async function generateVapidKeys() {
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
    "sign",
    "verify",
  ]);
  const pub = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const priv = await crypto.subtle.exportKey("jwk", pair.privateKey);
  return {
    publicKey: b64url(concat(new Uint8Array([4]), fromB64url(pub.x!), fromB64url(pub.y!))),
    privateKey: priv.d!,
  };
}

/** What a browser's PushManager.subscribe() would hold on its side. */
async function generateBrowserSubscription(endpoint: string) {
  const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveBits",
  ]);
  const publicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  const authSecret = crypto.getRandomValues(new Uint8Array(16));
  return {
    row: { endpoint, p256dh: b64url(publicRaw), auth: b64url(authSecret) },
    privateKey: pair.privateKey,
    publicRaw,
    authSecret,
  };
}

/** Independent RFC 8291 / RFC 8188 (single record) decryption. */
async function decryptAes128gcm(
  body: Uint8Array,
  browser: Awaited<ReturnType<typeof generateBrowserSubscription>>,
): Promise<string> {
  const salt = body.slice(0, 16);
  const idLen = body[20];
  const senderPublic = body.slice(21, 21 + idLen);
  const ciphertext = body.slice(21 + idLen);

  const senderKey = await crypto.subtle.importKey(
    "raw",
    senderPublic,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const ecdhSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: senderKey }, browser.privateKey, 256),
  );
  const prkKey = hmac(browser.authSecret, ecdhSecret);
  const ikm = hmac(
    prkKey,
    concat(ascii("WebPush: info\0"), browser.publicRaw, senderPublic, new Uint8Array([1])),
  ).slice(0, 32);
  const prk = hmac(salt, ikm);
  const cek = hmac(prk, concat(ascii("Content-Encoding: aes128gcm\0"), new Uint8Array([1]))).slice(
    0,
    16,
  );
  const nonce = hmac(prk, concat(ascii("Content-Encoding: nonce\0"), new Uint8Array([1]))).slice(
    0,
    12,
  );
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const padded = new Uint8Array(
    await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, ciphertext),
  );
  let end = padded.length - 1;
  while (end >= 0 && padded[end] === 0) end -= 1;
  expect(padded[end]).toBe(2); // last-record delimiter
  return Buffer.from(padded.slice(0, end)).toString("utf8");
}

/** The user's stored subscriptions; records each (userId, endpoint) deleted. */
function makeDb(rows: Array<{ endpoint: string; p256dh: string; auth: string }>) {
  const deletes: Array<[string, string]> = [];
  mockListPushSubscriptions.mockResolvedValue(rows);
  mockDeletePushSubscription.mockImplementation(async (userId: string, endpoint: string) => {
    deletes.push([userId, endpoint]);
  });
  return { deletes };
}

const ENDPOINT = "https://push.example.test/send/abc123";
let vapid: Awaited<ReturnType<typeof generateVapidKeys>>;
const fetchMock = vi.fn();

beforeEach(async () => {
  vapid = await generateVapidKeys();
  env.VAPID_PUBLIC_KEY = vapid.publicKey;
  env.VAPID_PRIVATE_KEY = vapid.privateKey;
  env.VAPID_SUBJECT = "mailto:test@example.test";
  fetchMock.mockReset();
  mockListPushSubscriptions.mockReset();
  mockDeletePushSubscription.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sendWebPushToUser request building", () => {
  it("POSTs an aes128gcm body with VAPID auth, TTL and urgency, decryptable by the browser keys", async () => {
    const browser = await generateBrowserSubscription(ENDPOINT);
    const { deletes } = makeDb([browser.row]);
    fetchMock.mockResolvedValue(new Response(null, { status: 201 }));

    const result = await sendWebPushToUser("user-1", { title: "Garage freezing", body: "29.5°F at 02:10" });

    expect(mockListPushSubscriptions).toHaveBeenCalledWith("user-1");
    expect(result).toEqual({ delivered: 1, failed: 0, skippedReason: null });
    expect(deletes).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe("post");
    expect(init.signal).toBeInstanceOf(AbortSignal);

    const headers = init.headers;
    expect(headers["content-encoding"]).toBe("aes128gcm");
    expect(headers["content-type"]).toBe("application/octet-stream");
    expect(headers.ttl).toBe("3600");
    expect(headers.urgency).toBe("high");
    expect(headers.topic).toBeUndefined();
    expect(headers["crypto-key"]).toBeUndefined();
    expect(headers.encryption).toBeUndefined();

    // RFC 8292: vapid t=<jwt>, k=<public key>; JWT audience is the push service origin.
    const auth = /^vapid t=([^,]+), k=(.+)$/.exec(headers.authorization);
    expect(auth).not.toBeNull();
    expect(auth![2]).toBe(vapid.publicKey);
    const claims = JSON.parse(Buffer.from(auth![1].split(".")[1], "base64url").toString("utf8"));
    expect(claims.aud).toBe("https://push.example.test");
    expect(claims.sub).toBe("mailto:test@example.test");

    const body = init.body as Uint8Array;
    expect(body).toBeInstanceOf(Uint8Array);
    expect(body.byteLength).toBe(4096); // padded to a constant size
    expect(headers["content-length"]).toBe(String(body.byteLength));
    expect(Buffer.from(body).includes(Buffer.from("Garage freezing"))).toBe(false);

    const plaintext = await decryptAes128gcm(body, browser);
    expect(JSON.parse(plaintext)).toEqual({ title: "Garage freezing", body: "29.5°F at 02:10" });
  });
});

describe("sendWebPushToUser delivery accounting", () => {
  it.each([404, 410])("counts %i as failed and removes that stale subscription", async (status) => {
    const browser = await generateBrowserSubscription(ENDPOINT);
    const { deletes } = makeDb([browser.row]);
    fetchMock.mockResolvedValue(new Response("gone", { status }));

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 0, failed: 1, skippedReason: "push_delivery_failed" });
    expect(deletes).toEqual([["user-1", ENDPOINT]]);
  });

  it("counts a 5xx as failed without deleting the subscription", async () => {
    const browser = await generateBrowserSubscription(ENDPOINT);
    const { deletes } = makeDb([browser.row]);
    fetchMock.mockResolvedValue(new Response("busy", { status: 503 }));

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 0, failed: 1, skippedReason: "push_delivery_failed" });
    expect(deletes).toEqual([]);
  });

  it("counts a network error as failed, not delivered", async () => {
    const browser = await generateBrowserSubscription(ENDPOINT);
    makeDb([browser.row]);
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 0, failed: 1, skippedReason: "push_delivery_failed" });
  });

  it("still delivers to a good subscription when another one fails", async () => {
    const good = await generateBrowserSubscription(ENDPOINT);
    const gone = await generateBrowserSubscription("https://push.example.test/send/old");
    const { deletes } = makeDb([gone.row, good.row]);
    fetchMock.mockImplementation(async (url: string) =>
      new Response(null, { status: url === ENDPOINT ? 201 : 410 }),
    );

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 1, failed: 1, skippedReason: null });
    expect(deletes).toEqual([["user-1", "https://push.example.test/send/old"]]);
  });

  it("fails (without sending) when the payload exceeds the 3993-byte aes128gcm limit", async () => {
    const browser = await generateBrowserSubscription(ENDPOINT);
    const { deletes } = makeDb([browser.row]);

    const result = await sendWebPushToUser("user-1", { title: "t", body: "x".repeat(4000) });

    expect(result).toEqual({ delivered: 0, failed: 1, skippedReason: "push_delivery_failed" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(deletes).toEqual([]);
  });

  it("reports a failed subscription lookup without sending", async () => {
    mockListPushSubscriptions.mockRejectedValue(new Error("connection error"));

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 0, failed: 0, skippedReason: "push_load_failed" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports no subscription when the user has none", async () => {
    makeDb([]);

    const result = await sendWebPushToUser("user-1", { title: "t", body: "b" });

    expect(result).toEqual({ delivered: 0, failed: 0, skippedReason: "push_no_subscription" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
