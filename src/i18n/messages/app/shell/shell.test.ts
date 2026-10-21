import { describe, expect, it } from "vitest";
import { ensureLocale } from "../../../catalog";
import { householdRoleLabel } from "../../../../lib/householdRoleLabel";
import { shellMessages } from ".";

describe("app/shell messages", () => {
  it("keeps English role labels and translates them once loaded", async () => {
    expect(householdRoleLabel("member")).toBe("Editor");
    expect(householdRoleLabel("alert_only")).toBe("Alert only");
    await ensureLocale("de", ["app"]);
    expect(householdRoleLabel("owner", "de")).toBe("Eigentümer");
    expect(shellMessages("de").nav.alerts).toBe("Alarme");
    expect(householdRoleLabel("custom_role", "de")).toBe("custom role");
  });
});
