import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const db = vi.hoisted(() => ({
  findStatusSubscriber: vi.fn(),
  writeStatusSubscriberToken: vi.fn(),
  confirmStatusSubscriber: vi.fn(),
  deleteStatusSubscriber: vi.fn(),
  listConfirmedStatusSubscribers: vi.fn(),
}));
vi.mock("./db/statusPages", () => db);

beforeEach(() => {
  mockSendEmail.mockReset().mockResolvedValue(undefined);
  for (const fn of Object.values(db)) fn.mockReset();
  db.writeStatusSubscriberToken.mockResolvedValue(undefined);
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
    const [email, token] = db.writeStatusSubscriberToken.mock.calls[0]!;
    expect(email).toBe("new@example.com");
    expect(token).toMatch(/^[0-9a-f]{48}$/);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail.mock.calls[0][0]).toBe("new@example.com");
    expect(mockSendEmail.mock.calls[0][2]).toContain(`token=${token}`);
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
    expect(db.confirmStatusSubscriber).toHaveBeenCalledWith("tok123");
  });
});

describe("unsubscribeStatusSubscription", () => {
  it("deletes the row for a valid token", async () => {
    db.deleteStatusSubscriber.mockResolvedValue(true);
    const { unsubscribeStatusSubscription } = await import("./statusSubscriptions");
    const result = await unsubscribeStatusSubscription("tok123");
    expect(result.ok).toBe(true);
    expect(db.deleteStatusSubscriber).toHaveBeenCalledWith("tok123");
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
    db.listConfirmedStatusSubscribers.mockResolvedValue([{ email: "a@example.com", token: "t1" }]);

    const { listConfirmedStatusSubscribers } = await import("./statusSubscriptions");
    const result = await listConfirmedStatusSubscribers();
    expect(result).toEqual([{ email: "a@example.com", token: "t1" }]);
  });

  it("returns an empty list on error rather than throwing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    db.listConfirmedStatusSubscribers.mockRejectedValue(new Error("boom"));
    const { listConfirmedStatusSubscribers } = await import("./statusSubscriptions");
    const result = await listConfirmedStatusSubscribers();
    expect(result).toEqual([]);
  });
});
