/**
 * The Overview's one-shot notices, read from the query string that a form
 * action redirects back with (`?prefs_saved=…`, `?snooze=1`, …), and the
 * "space last checked" timestamp from the user's metadata. Pure: the page
 * (src/pages/dashboard.astro) destructures the result under the same names.
 */
export type OverviewFlash = {
  passwordUpdated: boolean;
  prefsSaved: string | null;
  prefsError: string | null;
  /** Pinned-metrics form: saved, too many pinned, or another error. */
  pinnedFlash: "saved" | "max" | "error" | null;
  checkedSaved: boolean;
  checkedError: boolean;
  ackOk: boolean;
  ackMsg: string | null;
  snoozeFlash: boolean;
  snoozeCleared: boolean;
  snoozeHours: string | null;
  vacationFlash: boolean;
  vacationCleared: boolean;
  vacationError: boolean;
};

export function parseOverviewFlash(params: URLSearchParams): OverviewFlash {
  const is = (key: string, value = "1") => params.get(key) === value;
  return {
    passwordUpdated: is("password", "updated"),
    prefsSaved: params.get("prefs_saved"),
    prefsError: params.get("prefs_error"),
    pinnedFlash: params.get("pinned_saved")
      ? "saved"
      : params.get("pinned_error") === "max"
        ? "max"
        : params.get("pinned_error")
          ? "error"
          : null,
    checkedSaved: is("checked_saved"),
    checkedError: is("checked_error"),
    ackOk: is("ack_ok"),
    ackMsg: params.get("ack_msg"),
    snoozeFlash: is("snooze"),
    snoozeCleared: is("snooze_cleared"),
    snoozeHours: params.get("hours"),
    vacationFlash: is("vacation"),
    vacationCleared: is("vacation_cleared"),
    vacationError: is("vacation_error"),
  };
}

/**
 * When this household's space was last marked checked: the per-household
 * value (`space_checked_by_household[householdId]`), else the older
 * account-wide `space_checked_at`, else null.
 */
export function spaceCheckedAtFor(
  metadata: Record<string, unknown> | null | undefined,
  householdId: string | null | undefined,
): string | null {
  const byHousehold = metadata?.space_checked_by_household;
  const map =
    byHousehold && typeof byHousehold === "object" && !Array.isArray(byHousehold)
      ? (byHousehold as Record<string, unknown>)
      : {};
  if (householdId && typeof map[householdId] === "string") return map[householdId] as string;
  return typeof metadata?.space_checked_at === "string" ? metadata.space_checked_at : null;
}
