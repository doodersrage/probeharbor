import { describe, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { requestLocale, saveLocaleIfMissing } from "./_locale";

const session = { access_token: "at", refresh_token: "rt", user: { user_metadata: {} } } as unknown as Session;

function makeClient(overrides: Record<string, unknown> = {}) {
  const fresh = { access_token: "at2", refresh_token: "rt2" };
  return {
    auth: {
      setSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      refreshSession: vi.fn().mockResolvedValue({ data: { session: fresh } }),
      ...overrides,
    },
  };
}

describe("requestLocale", () => {
  it("reads locals.locale and tolerates a missing locals", () => {
    expect(requestLocale({ locals: { locale: "fr" } as App.Locals })).toBe("fr");
    expect(requestLocale({})).toBe("en");
  });
});

describe("saveLocaleIfMissing", () => {
  it("saves a non-English locale and returns the refreshed session", async () => {
    const client = makeClient();
    const result = await saveLocaleIfMissing(client as never, session, { user_metadata: {} }, "es");
    expect(client.auth.updateUser).toHaveBeenCalledWith({ data: { locale: "es" } });
    expect(result.access_token).toBe("at2");
  });

  it("skips English unless always is set", async () => {
    const client = makeClient();
    expect(await saveLocaleIfMissing(client as never, session, { user_metadata: {} }, "en")).toBe(session);
    expect(client.auth.setSession).not.toHaveBeenCalled();
    await saveLocaleIfMissing(client as never, session, { user_metadata: {} }, "en", { always: true });
    expect(client.auth.updateUser).toHaveBeenCalledWith({ data: { locale: "en" } });
  });

  it("keeps an already saved language", async () => {
    const client = makeClient();
    await saveLocaleIfMissing(client as never, session, { user_metadata: { locale: "de" } }, "es");
    expect(client.auth.setSession).not.toHaveBeenCalled();
  });

  it("never throws", async () => {
    const client = makeClient({ updateUser: vi.fn().mockRejectedValue(new Error("down")) });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await saveLocaleIfMissing(client as never, session, null, "pt-br")).toBe(session);
  });
});
