import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUserEntitlements = vi.fn();
vi.mock("./entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockNeonIsUserInGroup = vi.fn();
vi.mock("./db/admin", () => ({
  isUserInGroup: (...a: unknown[]) => mockNeonIsUserInGroup(...a),
}));

beforeEach(() => {
  mockGetUserEntitlements.mockReset().mockResolvedValue({ canDownloadCsv: false });
  mockNeonIsUserInGroup.mockReset().mockResolvedValue(false);
});

describe("canDownloadHistoryCsv", () => {
  it("delegates to the user's entitlements", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canDownloadCsv: true });
    const { canDownloadHistoryCsv } = await import("./adminAccess");

    expect(await canDownloadHistoryCsv("user-1")).toBe(true);
    expect(mockGetUserEntitlements).toHaveBeenCalledWith("user-1");
  });

  it("returns false when entitlements deny it", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canDownloadCsv: false });
    const { canDownloadHistoryCsv } = await import("./adminAccess");

    expect(await canDownloadHistoryCsv("user-1")).toBe(false);
  });
});

describe("isUserInGroup", () => {
  it("returns the database's answer for the given user and group", async () => {
    mockNeonIsUserInGroup.mockResolvedValue(true);
    const { isUserInGroup } = await import("./adminAccess");

    expect(await isUserInGroup("user-1", "portfolio")).toBe(true);
    expect(mockNeonIsUserInGroup).toHaveBeenCalledWith("user-1", "portfolio");
  });

  it("returns false when the user isn't in the group", async () => {
    const { isUserInGroup } = await import("./adminAccess");

    expect(await isUserInGroup("user-1", "admin")).toBe(false);
  });
});

describe("isUserAdmin", () => {
  it("checks membership in the admin group", async () => {
    mockNeonIsUserInGroup.mockResolvedValue(true);
    const { isUserAdmin } = await import("./adminAccess");

    expect(await isUserAdmin("user-1")).toBe(true);
    expect(mockNeonIsUserInGroup).toHaveBeenCalledWith("user-1", "admin");
  });
});
