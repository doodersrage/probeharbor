import { describe, expect, it } from "vitest";
import { linkClickLeavesPage } from "./unsavedChangesGuard";

const here = "https://probeharbor.test/dashboard/alerts?tab=settings";
const click = { button: 0 };

describe("linkClickLeavesPage", () => {
  it("treats in-app links (tabs, sidebar, bottom nav) as leaving", () => {
    expect(linkClickLeavesPage({ href: "/dashboard/alerts?tab=activity" }, click, here)).toBe(true);
    expect(linkClickLeavesPage({ href: "/dashboard" }, click, here)).toBe(true);
    expect(linkClickLeavesPage({ href: "https://example.com/docs" }, click, here)).toBe(true);
  });

  it("treats a link to the same URL as leaving (it reloads)", () => {
    expect(linkClickLeavesPage({ href: here }, click, here)).toBe(true);
  });

  it("ignores same-page hash jumps", () => {
    expect(linkClickLeavesPage({ href: "#alert-section-essentials" }, click, here)).toBe(false);
    expect(
      linkClickLeavesPage({ href: "#x" }, click, `${here}#x`),
    ).toBe(false);
  });

  it("ignores new tabs, downloads and modified clicks", () => {
    expect(linkClickLeavesPage({ href: "/dashboard", target: "_blank" }, click, here)).toBe(false);
    expect(linkClickLeavesPage({ href: "/export.csv", download: true }, click, here)).toBe(false);
    expect(linkClickLeavesPage({ href: "/dashboard" }, { button: 0, metaKey: true }, here)).toBe(false);
    expect(linkClickLeavesPage({ href: "/dashboard" }, { button: 0, ctrlKey: true }, here)).toBe(false);
    expect(linkClickLeavesPage({ href: "/dashboard" }, { button: 1 }, here)).toBe(false);
  });

  it("ignores links another handler already took over", () => {
    expect(linkClickLeavesPage({ href: "/dashboard" }, { button: 0, defaultPrevented: true }, here)).toBe(false);
  });

  it("ignores non-http links", () => {
    expect(linkClickLeavesPage({ href: "mailto:help@example.com" }, click, here)).toBe(false);
    expect(linkClickLeavesPage({ href: "javascript:void(0)" }, click, here)).toBe(false);
  });

  it("counts target=_self as this tab", () => {
    expect(linkClickLeavesPage({ href: "/dashboard", target: "_self" }, click, here)).toBe(true);
  });
});
