import { describe, expect, it } from "vitest";
import { requestLocale } from "./_locale";

describe("requestLocale", () => {
  it("reads locals.locale and tolerates a missing locals", () => {
    expect(requestLocale({ locals: { locale: "fr" } as App.Locals })).toBe("fr");
    expect(requestLocale({})).toBe("en");
  });
});
