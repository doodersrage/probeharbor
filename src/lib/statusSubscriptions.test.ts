import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

const env = vi.hoisted(() => ({ values: {} as Record<string, string | undefined> }));
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => env.values[key],
  hasRuntimeEnv: (key: string) => Boolean(env.values[key]),
}));

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const db = vi.hoisted(() => ({
  findStatusSubscriber: vi.fn(),
  writeStatusSubscriberToken: vi.fn(),
  confirmStatusSubscriber: vi.fn(),
  deleteStatusSubscriber: vi.fn(),
  deleteStatusSubscriberById: vi.fn(),
  rotateStatusSubscriberTokenHash: vi.fn(),
  listConfirmedStatusSubscribers: vi.fn(),
}));
vi.mock("./db/statusPages", () => db);

beforeEach(() => {
  mockSendEmail.mockReset().mockResolvedValue(undefined);
  for (const fn of Object.values(db)) fn.mockReset();
  db.writeStatusSubscriberToken.mockResolvedValue(undefined);
  env.values = { CRON_SECRET: "test-cron-secret" };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("subscribeToStatusUpdates", () => {
  it("rejects an invalid email without touching the database", async () => {
    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");
    const result = await subscribeToStatusUpdates("not-an-email");
    expect(result.ok).toBe(false);
    expect(db.findStatusSubscriber).not.toHaveBeenCalled();
    expect(db.writeStatusSubscriberToken).not.toHaveBeenCalled();
  });

  it("creates a new subscription and emails a confirm link", async () => {
    db.findStatusSubscriber.mockResolvedValue(null);

    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");
    const result = await subscribeToStatusUpdates("New@Example.com");

    expect(result.ok).toBe(true);
    expect(db.findStatusSubscriber).toHaveBeenCalledWith("new@example.com");
    const [email, stored] = db.writeStatusSubscriberToken.mock.calls[0]!;
    expect(email).toBe("new@example.com");
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail.mock.calls[0][0]).toBe("new@example.com");
    const token = /token=([0-9a-f]{48})/.exec(mockSendEmail.mock.calls[0][2])?.[1];
    expect(token).toBeTruthy();
    // Only the hash is written; the emailed token itself is never stored.
    expect(stored).toBe(sha(token!));
  });

  it("re-sends confirmation for an existing unconfirmed subscriber", async () => {
    db.findStatusSubscriber.mockResolvedValue({ id: "row1", confirmed_at: null });

    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");
    const result = await subscribeToStatusUpdates("pending@example.com");

    expect(result.ok).toBe(true);
    expect(db.writeStatusSubscriberToken).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("is a silent no-op for an already-confirmed subscriber (no duplicate email)", async () => {
    db.findStatusSubscriber.mockResolvedValue({ id: "row1", confirmed_at: "2026-01-01T00:00:00.000Z" });

    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");
    const result = await subscribeToStatusUpdates("confirmed@example.com");

    expect(result.ok).toBe(true);
    expect(db.writeStatusSubscriberToken).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("fails without emailing when the lookup or the write fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");

    db.findStatusSubscriber.mockRejectedValueOnce(new Error("db down"));
    expect(await subscribeToStatusUpdates("a@example.com")).toEqual({
      ok: false,
      error: "Something went wrong. Please try again.",
    });

    db.findStatusSubscriber.mockResolvedValueOnce(null);
    db.writeStatusSubscriberToken.mockRejectedValueOnce(new Error("db down"));
    expect(await subscribeToStatusUpdates("a@example.com")).toEqual({
      ok: false,
      error: "Something went wrong. Please try again.",
    });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("still succeeds when the confirm email can't be sent", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    db.findStatusSubscriber.mockResolvedValue(null);
    mockSendEmail.mockRejectedValue(new Error("mailer down"));

    const { subscribeToStatusUpdates } = await import("./statusSubscriptions");
    expect(await subscribeToStatusUpdates("a@example.com")).toEqual({ ok: true });
  });
});

describe("confirmStatusSubscription", () => {
  it("rejects an unknown token", async () => {
    db.confirmStatusSubscriber.mockResolvedValue(false);
    const { confirmStatusSubscription } = await import("./statusSubscriptions");
    const result = await confirmStatusSubscription("bogus");
    expect(result).toEqual({ ok: false, message: "Invalid or expired confirmation link." });
  });

  it("confirms a subscription", async () => {
    db.confirmStatusSubscriber.mockResolvedValue(true);
    const { confirmStatusSubscription } = await import("./statusSubscriptions");
    const result = await confirmStatusSubscription("tok123");
    expect(result).toEqual({ ok: true, message: "You're subscribed to status updates." });
    // By hash, with the raw token for rows migration 0004 hasn't hashed yet.
    expect(db.confirmStatusSubscriber).toHaveBeenCalledWith(sha("tok123"), "tok123");
  });
});

describe("unsubscribeStatusSubscription", () => {
  it("deletes the row for a valid token", async () => {
    db.deleteStatusSubscriber.mockResolvedValue(true);
    const { unsubscribeStatusSubscription } = await import("./statusSubscriptions");
    const result = await unsubscribeStatusSubscription("tok123");
    expect(result.ok).toBe(true);
    expect(db.deleteStatusSubscriber).toHaveBeenCalledWith(sha("tok123"), "tok123");
  });

  it("a signed link removes exactly its subscription; a forged or unsigned-env one does nothing", async () => {
    db.deleteStatusSubscriberById.mockResolvedValue(true);
    const { signedStatusUnsubscribeToken, unsubscribeStatusSubscription } = await import("./statusSubscriptions");
    const id = "6f1c2c1e-7a55-4b39-9a0e-0c1d2e3f4a5b";
    const signed = await signedStatusUnsubscribeToken(id);
    expect(signed).toMatch(new RegExp(`^${id}\\.[0-9a-f]{64}$`));

    expect((await unsubscribeStatusSubscription(signed!)).ok).toBe(true);
    expect(db.deleteStatusSubscriberById).toHaveBeenCalledWith(id);
    expect(db.deleteStatusSubscriber).not.toHaveBeenCalled();

    db.deleteStatusSubscriberById.mockClear();
    const otherId = "00000000-0000-4000-8000-000000000000";
    expect((await unsubscribeStatusSubscription(`${otherId}.${signed!.split(".")[1]}`)).ok).toBe(false);
    expect(db.deleteStatusSubscriberById).not.toHaveBeenCalled();

    env.values = {};
    expect((await unsubscribeStatusSubscription(signed!)).ok).toBe(false);
    expect(await signedStatusUnsubscribeToken(id)).toBeNull();
  });

  it("rejects an unknown token", async () => {
    db.deleteStatusSubscriber.mockResolvedValue(false);
    const { unsubscribeStatusSubscription } = await import("./statusSubscriptions");
    const result = await unsubscribeStatusSubscription("bogus");
    expect(result.ok).toBe(false);
  });
});

describe("listConfirmedStatusSubscribers", () => {
  it("returns confirmed subscribers", async () => {
    db.listConfirmedStatusSubscribers.mockResolvedValue([{ id: "s1", email: "a@example.com" }]);

    const { listConfirmedStatusSubscribers } = await import("./statusSubscriptions");
    const result = await listConfirmedStatusSubscribers();
    expect(result).toEqual([{ id: "s1", email: "a@example.com" }]);
  });

  it("returns an empty list on error rather than throwing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    db.listConfirmedStatusSubscribers.mockRejectedValue(new Error("boom"));
    const { listConfirmedStatusSubscribers } = await import("./statusSubscriptions");
    const result = await listConfirmedStatusSubscribers();
    expect(result).toEqual([]);
  });
});

describe("statusUnsubscribeUrlFor", () => {
  it("signs the subscription id when the link secret is set (nothing written)", async () => {
    const { statusUnsubscribeUrlFor } = await import("./statusSubscriptions");
    const url = await statusUnsubscribeUrlFor({ id: "6f1c2c1e-7a55-4b39-9a0e-0c1d2e3f4a5b" });
    expect(url).toMatch(/\/api\/status\/unsubscribe\?token=6f1c2c1e-7a55-4b39-9a0e-0c1d2e3f4a5b\.[0-9a-f]{64}$/);
    expect(db.rotateStatusSubscriberTokenHash).not.toHaveBeenCalled();
  });

  it("without a secret, issues a fresh token and stores only its hash", async () => {
    env.values = {};
    vi.spyOn(console, "warn").mockImplementation(() => {});
    db.rotateStatusSubscriberTokenHash.mockResolvedValue(undefined);
    const { statusUnsubscribeUrlFor } = await import("./statusSubscriptions");
    const url = await statusUnsubscribeUrlFor({ id: "s1" });
    const token = /token=([0-9a-f]{48})$/.exec(url)?.[1];
    expect(token).toBeTruthy();
    expect(db.rotateStatusSubscriberTokenHash).toHaveBeenCalledWith("s1", sha(token!));
  });
});
