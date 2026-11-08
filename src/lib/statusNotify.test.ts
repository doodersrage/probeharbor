import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchSummary = vi.fn();
vi.mock("./appStatus", () => ({
  fetchAppStatusSummary: (...args: unknown[]) => mockFetchSummary(...args),
}));

const mockListSubscribers = vi.fn();
vi.mock("./statusSubscriptions", () => ({
  listConfirmedStatusSubscribers: (...args: unknown[]) => mockListSubscribers(...args),
  statusUnsubscribeUrlFor: async (s: { id: string }) => `https://example.com/unsub?token=${s.id}.sig`,
}));

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const mockRead = vi.fn();
const mockWrite = vi.fn();
vi.mock("./db/statusPages", () => ({
  readLastKnownHealthy: (...args: unknown[]) => mockRead(...args),
  writeLastKnownHealthy: (...args: unknown[]) => mockWrite(...args),
}));

beforeEach(() => {
  mockFetchSummary.mockReset();
  mockListSubscribers.mockReset().mockResolvedValue([]);
  mockSendEmail.mockReset().mockResolvedValue(undefined);
  mockRead.mockReset();
  mockWrite.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("checkAndNotifyStatusSubscribers", () => {
  it("is a no-op when the status check itself fails", async () => {
    mockFetchSummary.mockResolvedValue(null);
    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();
    expect(result).toEqual({ changed: false, healthy: null, sent: 0, errors: ["status check failed"] });
    expect(mockRead).not.toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it("does nothing (and reports it) when the last state can't be read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchSummary.mockResolvedValue({ healthy: true });
    mockRead.mockRejectedValue(new Error("db down"));

    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();

    expect(result).toEqual({ changed: false, healthy: true, sent: 0, errors: ["state read failed"] });
    expect(mockWrite).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("records a baseline on the first run without emailing anyone", async () => {
    mockFetchSummary.mockResolvedValue({ healthy: true });
    mockRead.mockResolvedValue(null); // no row yet

    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();

    expect(result.changed).toBe(false);
    expect(result.sent).toBe(0);
    expect(mockWrite).toHaveBeenCalledWith(true);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("does nothing when health hasn't changed", async () => {
    mockFetchSummary.mockResolvedValue({ healthy: true });
    mockRead.mockResolvedValue(true);

    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();

    expect(result.changed).toBe(false);
    expect(mockWrite).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("emails every confirmed subscriber on a genuine transition", async () => {
    mockFetchSummary.mockResolvedValue({ healthy: false });
    mockRead.mockResolvedValue(true);
    mockListSubscribers.mockResolvedValue([
      { id: "ta", email: "a@example.com" },
      { id: "tb", email: "b@example.com" },
    ]);

    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();

    expect(result.changed).toBe(true);
    expect(result.healthy).toBe(false);
    expect(result.sent).toBe(2);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // Each email carries that subscriber's own unsubscribe link.
    expect(String(mockSendEmail.mock.calls[0]![3].html)).toContain("https://example.com/unsub?token=ta.sig");
    expect(String(mockSendEmail.mock.calls[1]![3].html)).toContain("https://example.com/unsub?token=tb.sig");
    expect(mockWrite).toHaveBeenCalledWith(false);
  });

  it("keeps going and reports per-recipient errors when a send fails", async () => {
    mockFetchSummary.mockResolvedValue({ healthy: true });
    mockRead.mockResolvedValue(false);
    mockListSubscribers.mockResolvedValue([
      { id: "tf", email: "fails@example.com" },
      { id: "to", email: "ok@example.com" },
    ]);
    mockSendEmail
      .mockRejectedValueOnce(new Error("mailer down"))
      .mockResolvedValueOnce(undefined);

    const { checkAndNotifyStatusSubscribers } = await import("./statusNotify");
    const result = await checkAndNotifyStatusSubscribers();

    expect(result.changed).toBe(true);
    expect(result.sent).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("fails@example.com");
  });
});
