import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getE2ECredentials, signIn } from "./helpers/auth";

/**
 * axe (WCAG 2.1 A/AA) on signed-in dashboard pages, using the E2E account.
 * Serious and critical violations fail (like e2e/a11y.spec.ts); every
 * violation is printed to the CI log and attached. The first CI run
 * (2026-10-28, report-only) found 0 violations on all 6 pages.
 */
const PAGES = [
  "/dashboard",
  "/dashboard/history",
  "/dashboard/devices",
  "/dashboard/alerts",
  "/dashboard/household",
  "/dashboard/share/links",
];

test.describe("dashboard accessibility", () => {
  test("scan signed-in pages", async ({ page }, testInfo) => {
    test.skip(!getE2ECredentials(), "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD");
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await signIn(page, "/dashboard");

    const report: Array<{ path: string; id: string; impact: string | null | undefined; help: string; nodes: string[] }> = [];
    for (const path of PAGES) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      for (const v of results.violations) {
        report.push({ path, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) });
      }
    }
    for (const r of report) console.log(`AXE ${r.impact} ${r.path} ${r.id}: ${r.help} :: ${r.nodes.join(" | ")}`);
    console.log(`AXE summary: ${report.length} violation(s) across ${PAGES.length} pages`);
    await testInfo.attach("axe-dashboard.json", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
    const blocking = report.filter((r) => r.impact === "serious" || r.impact === "critical");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});
