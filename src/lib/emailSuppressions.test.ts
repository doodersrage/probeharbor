import { describe, expect, it, vi, beforeEach } from "vitest";

const db = vi.hoisted(() => ({
  isSuppressed: vi.fn(),
  upsertSuppression: vi.fn(),
  listSuppressions: vi.fn(),
  deleteSuppression: vi.fn(),
}));
vi.mock("./db/emailJobs", () => db);

import {
  addEmailSuppression,
  isMailDeliveryBounceError,
  isPlausibleEmailAddress,
  isEmailSuppressed,
  listEmailSuppressions,
  normalizeEmailAddress,
  suppressEmail,
  unsuppressEmail,
} from "./emailSuppressions";

describe("emailSuppressions", () => {
  beforeEach(() => {
    for (const fn of Object.values(db)) fn.mockReset();
  });

  it("normalizes and validates addresses", () => {
    expect(normalizeEmailAddress("  A@B.Com ")).toBe("a@b.com");
    expect(isPlausibleEmailAddress("user@example.com")).toBe(true);
    expect(isPlausibleEmailAddress("not-an-email")).toBe(false);
    expect(isPlausibleEmailAddress("a@b")).toBe(false);
    expect(isPlausibleEmailAddress("1234567+user@users.noreply.github.com")).toBe(
      false,
    );
    expect(isPlausibleEmailAddress("noreply@example.com")).toBe(false);
  });

  it("detects bounce-like mailer errors", () => {
    expect(
      isMailDeliveryBounceError(
        new Error("failed to enqueue email: enqueue failed and delivery had 1 temporary bounces (cannot retry)"),
      ),
    ).toBe(true);
    expect(isMailDeliveryBounceError(new Error("E_RECIPIENT_SUPPRESSED"))).toBe(true);
    expect(isMailDeliveryBounceError(new Error("SMTP timeout"))).toBe(false);
  });

  it("reports suppressed addresses", async () => {
    db.isSuppressed.mockResolvedValue(true);
    expect(await isEmailSuppressed("Bad@Example.com")).toBe(true);
    expect(db.isSuppressed).toHaveBeenCalledWith("bad@example.com");
  });

  it("fails open when the lookup errors", async () => {
    db.isSuppressed.mockRejectedValue(new Error("missing table"));
    expect(await isEmailSuppressed("user@example.com")).toBe(false);
  });

  it("upserts suppressions", async () => {
    db.upsertSuppression.mockResolvedValue(undefined);
    await suppressEmail("Bad@Example.com", "bounce", "hard bounce");
    expect(db.upsertSuppression).toHaveBeenCalledWith("bad@example.com", "bounce", "hard bounce");
  });

  it("adds a manual suppression with a result", async () => {
    db.upsertSuppression.mockResolvedValue(undefined);
    expect(
      await addEmailSuppression("Bad@Example.com", "manual", "ops note"),
    ).toEqual({ ok: true, error: null });
    expect(db.upsertSuppression).toHaveBeenCalledWith("bad@example.com", "manual", "ops note");
  });

  it("reports a failed upsert", async () => {
    db.upsertSuppression.mockRejectedValue(new Error("db down"));
    expect(await addEmailSuppression("bad@example.com")).toEqual({ ok: false, error: "db down" });
  });

  it("rejects blank emails on manual add", async () => {
    expect(await addEmailSuppression("not-an-email")).toEqual({
      ok: false,
      error: "Enter a valid email address",
    });
    expect(db.upsertSuppression).not.toHaveBeenCalled();
  });

  it("lists suppressions with a clamped limit", async () => {
    db.listSuppressions.mockResolvedValue([
      {
        email: "a@example.com",
        reason: "bounce",
        last_error: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
      },
    ]);
    const result = await listEmailSuppressions(50);
    expect(result.error).toBeNull();
    expect(result.rows).toHaveLength(1);
    expect(db.listSuppressions).toHaveBeenCalledWith(50);
    await listEmailSuppressions(5000);
    expect(db.listSuppressions).toHaveBeenLastCalledWith(500);
  });

  it("deletes a suppression", async () => {
    db.deleteSuppression.mockResolvedValue(undefined);
    expect(await unsuppressEmail("Bad@Example.com")).toEqual({
      ok: true,
      error: null,
    });
    expect(db.deleteSuppression).toHaveBeenCalledWith("bad@example.com");
  });
});
