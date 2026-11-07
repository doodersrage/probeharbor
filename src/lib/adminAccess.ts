import * as neonAdmin from "./db/admin";

export const ADMIN_GROUP_NAME = "admin";
export const USER_GROUP_NAME = "user";
export const MEMBER_GROUP_NAME = "member";

export async function canDownloadHistoryCsv(userId: string): Promise<boolean> {
  const { getUserEntitlements } = await import("./entitlements");
  const entitlements = await getUserEntitlements(userId);
  return entitlements.canDownloadCsv;
}

export async function isUserInGroup(
  userId: string,
  groupName: string,
): Promise<boolean> {
  return neonAdmin.isUserInGroup(userId, groupName);
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  return isUserInGroup(userId, ADMIN_GROUP_NAME);
}
