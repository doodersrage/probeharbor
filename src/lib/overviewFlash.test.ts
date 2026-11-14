import { describe, expect, it } from "vitest";
import { parseOverviewFlash, spaceCheckedAtFor } from "./overviewFlash";

const flash = (query: string) => parseOverviewFlash(new URLSearchParams(query));

describe("parseOverviewFlash", () => {
  it("is all off for a plain visit", () => {
    expect(flash("")).toEqual({
      passwordUpdated: false,
      prefsSaved: null,
      prefsError: null,
      pinnedFlash: null,
      checkedSaved: false,
      checkedError: false,
      ackOk: false,
      ackMsg: null,
      snoozeFlash: false,
      snoozeCleared: false,
      snoozeHours: null,
      vacationFlash: false,
      vacationCleared: false,
      vacationError: false,
    });
  });

  it("reads each notice the form actions redirect with", () => {
    const f = flash(
      "password=updated&prefs_saved=units&prefs_error=bad&checked_saved=1&ack_ok=1&ack_msg=Done&snooze=1&hours=24&vacation_cleared=1",
    );
    expect(f).toMatchObject({
      passwordUpdated: true,
      prefsSaved: "units",
      prefsError: "bad",
      checkedSaved: true,
      checkedError: false,
      ackOk: true,
      ackMsg: "Done",
      snoozeFlash: true,
      snoozeHours: "24",
      vacationCleared: true,
      vacationFlash: false,
    });
  });

  it("needs the exact value: =1 for flags, =updated for the password", () => {
    expect(flash("snooze=true&password=yes&ack_ok=0")).toMatchObject({
      snoozeFlash: false,
      passwordUpdated: false,
      ackOk: false,
    });
  });

  it("pinned metrics: saved wins, then the max error, then any other error", () => {
    expect(flash("pinned_saved=1&pinned_error=max").pinnedFlash).toBe("saved");
    expect(flash("pinned_error=max").pinnedFlash).toBe("max");
    expect(flash("pinned_error=oops").pinnedFlash).toBe("error");
    expect(flash("pinned_error=").pinnedFlash).toBeNull();
  });
});

describe("spaceCheckedAtFor", () => {
  it("prefers this household's value, then the account-wide one", () => {
    const meta = {
      space_checked_by_household: { h1: "2026-11-10T08:00:00Z", h2: 5 },
      space_checked_at: "2026-11-01T08:00:00Z",
    };
    expect(spaceCheckedAtFor(meta, "h1")).toBe("2026-11-10T08:00:00Z");
    expect(spaceCheckedAtFor(meta, "h2")).toBe("2026-11-01T08:00:00Z"); // not a string
    expect(spaceCheckedAtFor(meta, "h3")).toBe("2026-11-01T08:00:00Z");
    expect(spaceCheckedAtFor(meta, null)).toBe("2026-11-01T08:00:00Z");
  });

  it("ignores a malformed per-household map and missing metadata", () => {
    expect(spaceCheckedAtFor({ space_checked_by_household: ["h1"] }, "h1")).toBeNull();
    expect(spaceCheckedAtFor(undefined, "h1")).toBeNull();
  });
});
