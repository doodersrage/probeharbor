/**
 * sendFcmToUser: Google OAuth (signed service-account JWT), one FCM v1 send
 * per registered token, stale-token cleanup, and the result the push channel
 * reports. fetch and the token table are faked; the RSA key is real so the
 * JWT signature is actually checked. Each test loads a fresh module so the
 * cached access token never leaks between tests.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { runtimeEnvStore, push } = vi.hoisted(() => ({
  runtimeEnvStore: new Map<string, string>(),
  push: {
    listFcmTokens: vi.fn(),
    deleteFcmToken: vi.fn(),
    countFcmTokens: vi.fn(),
    releaseFcmTokenFromOtherUsers: vi.fn(),
  },
}));

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => runtimeEnvStore.get(key),
}));
vi.mock("./db/pushTokens", () => push);

const OAUTH_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://fcm.googleapis.com/v1/projects/demo-proj/messages:send";
const PAYLOAD = { title: "Freeze risk", body: "Garage 33°F", eventId: 7 };

let privatePem = "";
let publicKey: CryptoKey;

function toPem(der: ArrayBuffer): string {
  const b64 = Buffer.from(der).toString("base64");
  const lines = b64.match(/.{1,64}/g)!.join("\n");
  return `-----BEGIN PRIVATE KEY-----\n${lines}\n-----END PRIVATE KEY-----\n`;
}

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64"));
}

beforeAll(async () => {
  const pair = (await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  privatePem = toPem(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  publicKey = pair.publicKey;
});

type Reply = { status: number; body?: unknown } | Error;

/** Fake fetch: OAuth replies and send replies are consumed in order. */
function fakeFetch(oauth: Reply[], sends: Reply[]) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const respond = (r: Reply | undefined) => {
    if (!r) throw new Error("unexpected fetch");
    if (r instanceof Error) throw r;
    const text = typeof r.body === "string" ? r.body : JSON.stringify(r.body ?? {});
    return new Response(text, { status: r.status });
  };
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return respond(url === OAUTH_URL ? oauth.shift() : sends.shift());
  });
  vi.stubGlobal("fetch", fn);
  return calls;
}

const okToken = { status: 200, body: { access_token: "ya29.test", expires_in: 3600 } };

async function loadFcm() {
  vi.resetModules();
  return import("./fcm");
}

function configure() {
  runtimeEnvStore.set(
    "FCM_SERVICE_ACCOUNT_JSON",
    JSON.stringify({ project_id: "demo-proj", client_email: "svc@demo-proj.iam.gserviceaccount.com", private_key: privatePem }),
  );
}

beforeEach(() => {
  runtimeEnvStore.clear();
  for (const f of Object.values(push)) f.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sendFcmToUser: before anything is sent", () => {
  it("skips without touching the database or network when FCM isn't configured", async () => {
    const calls = fakeFetch([], []);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 0, skippedReason: "fcm_not_configured" });
    expect(push.listFcmTokens).not.toHaveBeenCalled();
    expect(calls).toHaveLength(0);
  });

  it("reports a token-load failure separately from having no tokens", async () => {
    configure();
    push.listFcmTokens.mockRejectedValueOnce(new Error("db down"));
    const calls = fakeFetch([], []);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 0, skippedReason: "fcm_load_failed" });
    expect(calls).toHaveLength(0);
  });

  it("skips OAuth entirely when the user has no registered device", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([]);
    const calls = fakeFetch([], []);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 0, skippedReason: "fcm_no_token" });
    expect(calls).toHaveLength(0);
  });

  it("counts every token as failed when Google rejects the service account, and deletes none", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "a" }, { token: "b" }]);
    const calls = fakeFetch([{ status: 401, body: { error: "invalid_grant" } }], []);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 2, skippedReason: "fcm_auth_failed" });
    expect(calls.map((c) => c.url)).toEqual([OAUTH_URL]);
    expect(push.deleteFcmToken).not.toHaveBeenCalled();
  });

  it("treats an OAuth reply without access_token as an auth failure", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "a" }]);
    fakeFetch([{ status: 200, body: { expires_in: 3600 } }], []);
    const { sendFcmToUser } = await loadFcm();
    expect((await sendFcmToUser("u1", PAYLOAD)).skippedReason).toBe("fcm_auth_failed");
  });
});

describe("sendFcmToUser: OAuth assertion", () => {
  it("signs an RS256 JWT for the FCM scope that verifies with the service account's key", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "a" }]);
    const calls = fakeFetch([okToken], [{ status: 200, body: { name: "m1" } }]);
    const { sendFcmToUser } = await loadFcm();
    await sendFcmToUser("u1", PAYLOAD);

    const form = new URLSearchParams(String(calls[0]!.init.body));
    expect(form.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:jwt-bearer");
    const [h, c, sig] = form.get("assertion")!.split(".");
    expect(JSON.parse(new TextDecoder().decode(b64urlDecode(h!)))).toEqual({ alg: "RS256", typ: "JWT" });
    const claim = JSON.parse(new TextDecoder().decode(b64urlDecode(c!)));
    expect(claim).toMatchObject({
      iss: "svc@demo-proj.iam.gserviceaccount.com",
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: OAUTH_URL,
    });
    expect(claim.exp - claim.iat).toBe(3600);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      b64urlDecode(sig!),
      new TextEncoder().encode(`${h}.${c}`),
    );
    expect(valid).toBe(true);
  });

  it("reuses the access token across sends until it nears expiry", async () => {
    configure();
    push.listFcmTokens.mockResolvedValue([{ token: "a" }]);
    const calls = fakeFetch([okToken], [{ status: 200 }, { status: 200 }]);
    const { sendFcmToUser } = await loadFcm();
    await sendFcmToUser("u1", PAYLOAD);
    await sendFcmToUser("u2", PAYLOAD);
    expect(calls.filter((c) => c.url === OAUTH_URL)).toHaveLength(1);
  });

  it("fetches a new access token when the cached one expires within a minute", async () => {
    configure();
    push.listFcmTokens.mockResolvedValue([{ token: "a" }]);
    const calls = fakeFetch(
      [{ status: 200, body: { access_token: "short", expires_in: 30 } }, okToken],
      [{ status: 200 }, { status: 200 }],
    );
    const { sendFcmToUser } = await loadFcm();
    await sendFcmToUser("u1", PAYLOAD);
    await sendFcmToUser("u1", PAYLOAD);
    expect(calls.filter((c) => c.url === OAUTH_URL)).toHaveLength(2);
    expect((calls.at(-1)!.init.headers as Record<string, string>).Authorization).toBe("Bearer ya29.test");
  });
});

describe("sendFcmToUser: per-device delivery", () => {
  it("sends one message per token to the project's v1 endpoint with the bearer token", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "phone" }, { token: "tablet" }]);
    const calls = fakeFetch([okToken], [{ status: 200 }, { status: 200 }]);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 2, failed: 0, skippedReason: null });

    const sends = calls.filter((c) => c.url === SEND_URL);
    expect(sends).toHaveLength(2);
    expect((sends[0]!.init.headers as Record<string, string>).Authorization).toBe("Bearer ya29.test");
    const bodies = sends.map((s) => JSON.parse(String(s.init.body)).message);
    expect(bodies.map((m) => m.token)).toEqual(["phone", "tablet"]);
    expect(bodies[0].data.event_id).toBe("7");
  });

  it("deletes a token FCM says is unregistered, and still delivers to the others", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "old" }, { token: "new" }]);
    fakeFetch(
      [okToken],
      [{ status: 404, body: { error: { status: "NOT_FOUND", details: [{ errorCode: "UNREGISTERED" }] } } }, { status: 200 }],
    );
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 1, failed: 1, skippedReason: null });
    expect(push.deleteFcmToken).toHaveBeenCalledTimes(1);
    expect(push.deleteFcmToken).toHaveBeenCalledWith("u1", "old");
  });

  it("reads the error code from the details even when the HTTP status isn't 404", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "old" }]);
    fakeFetch([okToken], [{ status: 400, body: { error: { details: [{ "@type": "x" }, { errorCode: "UNREGISTERED" }] } } }]);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 1, skippedReason: "fcm_delivery_failed" });
    expect(push.deleteFcmToken).toHaveBeenCalledWith("u1", "old");
  });

  it("keeps the token on a server error, quota error or unparseable reply", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "a" }, { token: "b" }, { token: "c" }]);
    fakeFetch(
      [okToken],
      [
        { status: 503, body: { error: { details: [{ errorCode: "UNAVAILABLE" }] } } },
        { status: 429, body: { error: { details: [{ errorCode: "QUOTA_EXCEEDED" }] } } },
        { status: 500, body: "<html>oops</html>" },
      ],
    );
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 0, failed: 3, skippedReason: "fcm_delivery_failed" });
    expect(push.deleteFcmToken).not.toHaveBeenCalled();
  });

  it("counts a network error or timeout as failed and moves on to the next device", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "a" }, { token: "b" }]);
    fakeFetch([okToken], [new Error("The operation was aborted due to timeout"), { status: 200 }]);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 1, failed: 1, skippedReason: null });
    expect(push.deleteFcmToken).not.toHaveBeenCalled();
  });

  it("counts a failed stale-token delete as a failure without throwing", async () => {
    configure();
    push.listFcmTokens.mockResolvedValueOnce([{ token: "old" }, { token: "new" }]);
    push.deleteFcmToken.mockRejectedValueOnce(new Error("db down"));
    fakeFetch([okToken], [{ status: 404 }, { status: 200 }]);
    const { sendFcmToUser } = await loadFcm();
    expect(await sendFcmToUser("u1", PAYLOAD)).toEqual({ delivered: 1, failed: 1, skippedReason: null });
  });
});

describe("countFcmTokens", () => {
  it("returns the stored count, or 0 when the lookup fails", async () => {
    const { countFcmTokens } = await loadFcm();
    push.countFcmTokens.mockResolvedValueOnce(3);
    expect(await countFcmTokens("u1")).toBe(3);
    push.countFcmTokens.mockRejectedValueOnce(new Error("db down"));
    expect(await countFcmTokens("u1")).toBe(0);
  });
});
