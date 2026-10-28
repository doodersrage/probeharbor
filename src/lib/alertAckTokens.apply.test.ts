import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAcknowledgeAlertEvent = vi.fn();
const mockAcknowledgeLatest = vi.fn();
vi.mock("./alertEvents", () => ({
  acknowledgeAlertEvent: (...a: unknown[]) => mockAcknowledgeAlertEvent(...a),
  acknowledgeLatestUnackedAlert: (...a: unknown[]) => mockAcknowledgeLatest(...a),
}));

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", "test-ack-secret");
  vi.stubEnv("ALERT_ACK_SECRET", "");
  mockAcknowledgeAlertEvent.mockReset().mockResolvedValue({ ok: true });
  mockAcknowledgeLatest.mockReset().mockResolvedValue({ ok: true, eventId: 99 });
});

describe("applyAckToken", () => {
  it("acknowledges exactly the alert the link was sent with, never a newer one", async () => {
    const { applyAckToken, signAckPayload } = await import("./alertAckTokens");
    const exp = Date.now() + 60_000;

    const result = await applyAckToken("user-1", exp, await signAckPayload("user-1", exp, 42), "en", 42);

    expect(result.ok).toBe(true);
    expect(mockAcknowledgeAlertEvent).toHaveBeenCalledWith("user-1", 42);
    expect(mockAcknowledgeLatest).not.toHaveBeenCalled();
  });

  it("refuses a link whose event id was changed", async () => {
    const { applyAckToken, signAckPayload } = await import("./alertAckTokens");
    const exp = Date.now() + 60_000;

    const result = await applyAckToken("user-1", exp, await signAckPayload("user-1", exp, 42), "en", 43);

    expect(result.ok).toBe(false);
    expect(mockAcknowledgeAlertEvent).not.toHaveBeenCalled();
  });

  it("keeps older links (no event id) working the old way until they expire", async () => {
    const { applyAckToken, signAckPayload } = await import("./alertAckTokens");
    const exp = Date.now() + 60_000;

    const result = await applyAckToken("user-1", exp, await signAckPayload("user-1", exp), "en");

    expect(result.ok).toBe(true);
    expect(mockAcknowledgeLatest).toHaveBeenCalledWith("user-1", "en");
  });
});
