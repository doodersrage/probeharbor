import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setQueryRunnerForTests, type QueryRunner } from "./db/client";
import { claimStripeWebhookEvent, releaseStripeWebhookEvent } from "./stripeWebhookEvents";

// Stand-in for the database: each test decides what the statement returns.
const run = vi.fn<(text: string, params?: readonly unknown[]) => Promise<unknown[]>>();

beforeEach(() => {
  run.mockReset();
  setQueryRunnerForTests(run as unknown as QueryRunner);
});

afterEach(() => {
  setQueryRunnerForTests(null);
  vi.restoreAllMocks();
});

describe("claimStripeWebhookEvent", () => {
  it("claims a new event id", async () => {
    run.mockResolvedValue([{ id: "evt_1" }]);

    const result = await claimStripeWebhookEvent("evt_1", "checkout.session.completed");

    expect(result.alreadyProcessed).toBe(false);
    expect(run).toHaveBeenCalledWith(expect.stringContaining("insert into public.stripe_webhook_events"), [
      "evt_1",
      "checkout.session.completed",
    ]);
  });

  it("recognizes a duplicate delivery (the id was already recorded)", async () => {
    run.mockResolvedValue([]);

    const result = await claimStripeWebhookEvent("evt_1", "checkout.session.completed");

    expect(result.alreadyProcessed).toBe(true);
  });

  it("fails open (processes the event) on a database error", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    run.mockRejectedValue(new Error("connection error"));

    const result = await claimStripeWebhookEvent("evt_1", "checkout.session.completed");

    expect(result.alreadyProcessed).toBe(false);
    expect(error).toHaveBeenCalled();
  });
});

describe("releaseStripeWebhookEvent", () => {
  it("deletes the claimed event row", async () => {
    run.mockResolvedValue([]);

    await releaseStripeWebhookEvent("evt_retry");

    expect(run).toHaveBeenCalledWith(expect.stringContaining("delete from public.stripe_webhook_events"), ["evt_retry"]);
  });

  it("logs, rather than throws, when the delete fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    run.mockRejectedValue(new Error("connection error"));

    await expect(releaseStripeWebhookEvent("evt_retry")).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
  });
});
