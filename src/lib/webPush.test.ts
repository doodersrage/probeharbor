import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setQueryRunnerForTests, type QueryRunner } from "./db/client";
import { isStalePushStatus, releasePushSubscriptionFromOtherUsers } from "./webPush";

describe("web push helpers", () => {
  it("treats 404 and 410 as stale subscriptions", () => {
    expect(isStalePushStatus(404)).toBe(true);
    expect(isStalePushStatus(410)).toBe(true);
    expect(isStalePushStatus(201)).toBe(false);
    expect(isStalePushStatus(500)).toBe(false);
  });
});

describe("releasePushSubscriptionFromOtherUsers", () => {
  // Stand-in for the database: records each statement.
  const run = vi.fn<(text: string, params?: readonly unknown[]) => Promise<unknown[]>>();

  beforeEach(() => {
    run.mockReset().mockResolvedValue([]);
    setQueryRunnerForTests(run as unknown as QueryRunner);
  });

  afterEach(() => {
    setQueryRunnerForTests(null);
    vi.restoreAllMocks();
  });

  it("deletes the endpoint from any other account, scoped by endpoint and excluding the caller", async () => {
    await releasePushSubscriptionFromOtherUsers(null, "user-a", "https://push.example.com/ep1");

    expect(run).toHaveBeenCalledTimes(1);
    const [text, params] = run.mock.calls[0]!;
    expect(text).toMatch(/delete from public\.push_subscriptions where endpoint = \$1 and user_id <> \$2/);
    expect(params).toEqual(["https://push.example.com/ep1", "user-a"]);
  });

  it("logs, rather than throws, when the delete fails (subscribing continues)", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    run.mockRejectedValue(new Error("connection error"));

    await expect(
      releasePushSubscriptionFromOtherUsers(null, "user-a", "https://push.example.com/ep1"),
    ).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
  });
});
