import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

/**
 * axe-core checks (WCAG 2.1 A/AA) on public pages. Serious and critical
 * violations fail the test; minor and moderate ones are attached to the
 * report so they're visible without blocking. Lighthouse also scores
 * accessibility, but only on 6 pages and as one number; this names the
 * element and rule.
 */
const PAGES = [
  "/",
  "/pricing",
  "/flash",
  "/system-status",
  "/docs/api",
  "/freeze-time-calculator",
  "/pipe-freeze-forecast",
  "/signin",
  "/signup",
  "/about",
  "/de/pricing",
];

for (const path of PAGES) {
  test(`a11y: ${path}`, async ({ page }, testInfo) => {
    // Entrance animations fade text in; scanning mid-fade reports false
    // contrast failures (ratios near 1:1). Reduced motion shows the final state.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }));
    await testInfo.attach("axe-violations.json", {
      body: JSON.stringify(summary, null, 2),
      contentType: "application/json",
    });

    const blocking = summary.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}
