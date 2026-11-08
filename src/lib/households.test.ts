import { describe, expect, it } from "vitest";
import {
  canEditHousehold,
  canInviteToHousehold,
  canManageHousehold,
  canManageHouseholdMembers,
  type HouseholdRole,
} from "./households";

describe("household roles", () => {
  it("allows owners and members to manage billing/invites/API keys", () => {
    expect(canManageHousehold("owner")).toBe(true);
    expect(canManageHousehold("member")).toBe(true);
    expect(canManageHousehold("viewer")).toBe(false);
    expect(canManageHousehold("property_manager")).toBe(false);
  });

  it("lets property managers edit devices/alerts but not billing", () => {
    expect(canEditHousehold("property_manager")).toBe(true);
    expect(canManageHousehold("property_manager")).toBe(false);
  });

  // One rule for both invite paths (the inviteHouseholdMember action and
  // POST /api/household) and the household page.
  it.each<[HouseholdRole | null, boolean, boolean]>([
    ["owner", true, true],
    ["member", true, false],
    ["viewer", false, false],
    ["alert_only", false, false],
    ["property_manager", false, false],
    [null, false, false],
  ])("%s: invite=%s, remove/change roles=%s", (role, invite, manageMembers) => {
    expect(canInviteToHousehold(role)).toBe(invite);
    expect(canManageHouseholdMembers(role)).toBe(manageMembers);
  });
});
