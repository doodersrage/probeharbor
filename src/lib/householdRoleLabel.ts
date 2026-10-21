import type { Locale } from "../i18n/locales";
import { shellMessages } from "../i18n/messages/app/shell";

/** Display labels for household roles (DB values stay owner/member/viewer/…). */
export function householdRoleLabel(role: string | null | undefined, locale: Locale = "en"): string {
  const roles = shellMessages(locale).roles;
  switch (role) {
    case "owner":
    case "member":
    case "viewer":
    case "alert_only":
    case "property_manager":
      return roles[role];
    default:
      return role ? role.replace(/_/g, " ") : "";
  }
}
