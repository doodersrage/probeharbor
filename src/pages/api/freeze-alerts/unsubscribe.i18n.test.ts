import { describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";
import { ensureLocale } from "../../../i18n";

vi.mock("../../../lib/freezeAlerts", () => ({
  unsubscribeFreezeAlerts: () => Promise.resolve({ ok: true }),
}));

import { GET, POST } from "./unsubscribe";

function ctx(locale: string): APIContext {
  return {
    url: new URL("https://probeharbor.dev/api/freeze-alerts/unsubscribe?token=abc"),
    locals: { locale },
  } as unknown as APIContext;
}

describe("freeze-alert unsubscribe page language", () => {
  it("renders in the request locale", async () => {
    await ensureLocale("de", ["app"]);
    const confirm = await (await GET(ctx("de"))).text();
    expect(confirm).toContain('<html lang="de">');
    expect(confirm).toContain("Frostalarme abbestellen?");
    expect(confirm).toContain(">Abmelden</button>");
    const done = await (await POST(ctx("de"))).text();
    expect(done).toContain("Du bist abgemeldet");
  });

  it("stays English without a locale", async () => {
    const done = await (await POST(ctx("en"))).text();
    expect(done).toContain("You're unsubscribed");
    expect(done).toContain('<a href="/pipe-freeze-forecast">Pipe freeze forecast</a>');
  });
});
