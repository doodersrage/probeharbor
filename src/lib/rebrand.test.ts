import { describe, expect, it } from "vitest";
import { isRenameNoticeAccountPath, shouldShowRenameNotice } from "./rebrand";

describe("shouldShowRenameNotice", () => {
  it("stops after the cut-off date", () => {
    expect(shouldShowRenameNotice(new Date("2026-11-05T00:00:00Z"))).toBe(true);
    expect(shouldShowRenameNotice(new Date("2027-02-01T00:00:00Z"))).toBe(false);
  });
});

describe("isRenameNoticeAccountPath", () => {
  it("covers sign-in and dashboard pages", () => {
    expect(isRenameNoticeAccountPath("/signin")).toBe(true);
    expect(isRenameNoticeAccountPath("/dashboard")).toBe(true);
    expect(isRenameNoticeAccountPath("/dashboard/devices")).toBe(true);
  });

  it("leaves public marketing pages to the arrival check", () => {
    expect(isRenameNoticeAccountPath("/")).toBe(false);
    expect(isRenameNoticeAccountPath("/pricing")).toBe(false);
    expect(isRenameNoticeAccountPath("/register")).toBe(false);
    expect(isRenameNoticeAccountPath("/dashboards-guide")).toBe(false);
    expect(isRenameNoticeAccountPath("/signinx")).toBe(false);
  });
});
