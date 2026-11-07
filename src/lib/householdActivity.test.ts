import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRecordActivity = vi.fn();
const mockListActivity = vi.fn();
vi.mock("./db/remaining", () => ({
  recordActivity: (...a: unknown[]) => mockRecordActivity(...a),
  listActivity: (...a: unknown[]) => mockListActivity(...a),
}));

beforeEach(() => {
  mockRecordActivity.mockReset().mockResolvedValue(undefined);
  mockListActivity.mockReset().mockResolvedValue([]);
});

describe("recordHouseholdActivity", () => {
  it("inserts a row with the given fields", async () => {
    const { recordHouseholdActivity } = await import("./householdActivity");

    await recordHouseholdActivity({
      householdId: "house-1",
      userId: "user-1",
      action: "device.created",
      detail: "Garage",
    });

    expect(mockRecordActivity).toHaveBeenCalledWith({
      household_id: "house-1",
      user_id: "user-1",
      action: "device.created",
      detail: "Garage",
    });
  });

  it("defaults userId and detail to null when omitted", async () => {
    const { recordHouseholdActivity } = await import("./householdActivity");

    await recordHouseholdActivity({ householdId: "house-1", action: "device.created" });

    expect(mockRecordActivity).toHaveBeenCalledWith({
      household_id: "house-1",
      user_id: null,
      action: "device.created",
      detail: null,
    });
  });
});

describe("listHouseholdActivity", () => {
  it("queries by household id with the default limit", async () => {
    const { listHouseholdActivity } = await import("./householdActivity");

    await listHouseholdActivity("house-1");

    expect(mockListActivity).toHaveBeenCalledWith("house-1", 40);
  });

  it("honors a custom limit", async () => {
    const { listHouseholdActivity } = await import("./householdActivity");

    await listHouseholdActivity("house-1", 10);

    expect(mockListActivity).toHaveBeenCalledWith("house-1", 10);
  });

  it("returns the rows from the query", async () => {
    const rows = [{ id: "a1", household_id: "house-1", user_id: null, action: "x", detail: null, created_at: "t" }];
    mockListActivity.mockResolvedValue(rows);
    const { listHouseholdActivity } = await import("./householdActivity");

    expect(await listHouseholdActivity("house-1")).toEqual(rows);
  });
});
