import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function displayPrefs(
  overrides: {
    showGarageTemps?: boolean;
    showWeather?: boolean;
    weatherCityId?: string | null;
    weatherSource?: "openweather" | "ambient" | "weatherflow";
    ambientWeatherMac?: string | null;
    ambientWeatherApiKey?: string | null;
    weatherflowStationId?: string | null;
    weatherflowToken?: string | null;
    useCelsius?: boolean;
    theme?: "dark" | "light" | "system";
  } = {},
) {
  return {
    showGarageTemps: true,
    showWeather: true,
    weatherCityId: null,
    weatherSource: "openweather" as const,
    ambientWeatherMac: null,
    ambientWeatherApiKey: null,
    weatherflowStationId: null,
    weatherflowToken: null,
    useCelsius: false,
    theme: "dark" as const,
    ...overrides,
  };
}

// The write goes through the shared session-metadata helper (Better Auth
// session token → user_profiles.metadata; tested against Postgres in
// accountSettings.db.test.ts). Here: which keys it sends.
const mockUpdateSessionUserMetadata = vi.fn();
vi.mock("./sessionMetadata", () => ({
  updateSessionUserMetadata: (...args: unknown[]) => mockUpdateSessionUserMetadata(...args),
}));

beforeEach(() => {
  mockUpdateSessionUserMetadata.mockReset().mockResolvedValue({ user: { id: "user-1" }, error: null });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("updateUserDisplayPreferences", () => {
  it("writes the display settings for the session's user", async () => {
    const { updateUserDisplayPreferences } = await import("./userPreferences");
    const result = await updateUserDisplayPreferences("at-1", "rt-1", displayPrefs({ showWeather: false, weatherCityId: "123" }));

    expect(mockUpdateSessionUserMetadata).toHaveBeenCalledTimes(1);
    const [token, , patch] = mockUpdateSessionUserMetadata.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(token).toBe("at-1");
    expect(patch).toMatchObject({ show_weather: false, weather_city_id: "123" });
    expect(Object.keys(patch)).toEqual(expect.arrayContaining(["show_garage_temps", "show_weather", "weather_city_id", "use_celsius", "theme"]));
    expect(result).toEqual({ user: { id: "user-1" }, error: null });
  });

  it("passes the helper's error back (e.g. an expired session)", async () => {
    mockUpdateSessionUserMetadata.mockResolvedValue({ user: null, error: new Error("Invalid session") });
    const { updateUserDisplayPreferences } = await import("./userPreferences");
    const result = await updateUserDisplayPreferences("at-1", "rt-1", displayPrefs());
    expect(result.user).toBeNull();
    expect(result.error?.message).toBe("Invalid session");
  });
});
