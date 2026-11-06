import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { expandedAboutPageMeta } from "./aboutExpandedPages";
import { HARDWARE_RECIPES } from "./hardwareRecipes";

const expandedSlugs = new Set(expandedAboutPageMeta.map((page) => page.slug));

function pageExists(href: string): boolean {
  const path = href.replace(/^\//, "").replace(/\/$/, "");
  if (existsSync(`src/pages/${path}.astro`) || existsSync(`src/pages/${path}/index.astro`)) return true;
  const about = /^about\/([\w-]+)$/.exec(path);
  return Boolean(about && expandedSlugs.has(about[1]!));
}

describe("hardware recipes", () => {
  it("link only to pages that exist", () => {
    const missing = HARDWARE_RECIPES.flatMap((r) => r.links.map((l) => l.href)).filter((href) => !pageExists(href));
    expect(missing).toEqual([]);
  });

  it("have unique ids, and no-code recipes go through the flasher", () => {
    expect(new Set(HARDWARE_RECIPES.map((r) => r.id)).size).toBe(HARDWARE_RECIPES.length);
    for (const recipe of HARDWARE_RECIPES.filter((r) => r.noCode)) {
      expect(recipe.links.some((l) => l.href === "/flash")).toBe(true);
    }
  });

  it("never mark an ESP32-C3 setup as verified (see firmware/probeharbor-probe/HARDWARE-TESTS.md)", () => {
    const c3 = HARDWARE_RECIPES.filter((r) => /C3/.test(`${r.title} ${r.hardware}`));
    expect(c3.length).toBeGreaterThan(0);
    expect(c3.filter((r) => r.status === "verified").map((r) => r.id)).toEqual([]);
  });
});
