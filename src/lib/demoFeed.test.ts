import { describe, expect, it } from "vitest";
import {
  excludeDemoDevices,
  excludeDemoFeeds,
  excludeDemoRows,
  isDemoDevice,
  isDemoFeedUrl,
  onboardingDeviceStep,
  realReadingRows,
  statusReadingScope,
} from "./demoFeed";
import { pullDeviceMeta } from "./devices";
import { getExampleFeedUrl } from "./exampleFeed";

describe("isDemoFeedUrl", () => {
  it("recognizes the example feed on any host, with or without a trailing slash or query", () => {
    expect(isDemoFeedUrl("https://probeharbor.com/api/feeds/example")).toBe(true);
    expect(isDemoFeedUrl("https://probeharbor.com/api/feeds/example/")).toBe(true);
    expect(isDemoFeedUrl("https://self-hosted.example.org/api/feeds/example?format=pull")).toBe(true);
    expect(isDemoFeedUrl(getExampleFeedUrl("https://probeharbor.com"))).toBe(true);
  });

  it("does not flag real feeds", () => {
    expect(isDemoFeedUrl("https://garage.local/api/feeds/example-copy")).toBe(false);
    expect(isDemoFeedUrl("https://garage.example.org/temps.json")).toBe(false);
    expect(isDemoFeedUrl("https://probeharbor.com/api/feeds/example/extra")).toBe(false);
    expect(isDemoFeedUrl("not a url")).toBe(false);
    expect(isDemoFeedUrl("")).toBe(false);
    expect(isDemoFeedUrl(null)).toBe(false);
  });
});

describe("isDemoDevice", () => {
  it("flags existing pull devices by URL (no stored flag needed)", () => {
    expect(
      isDemoDevice({ source: "pull_url", pull_url: "https://probeharbor.com/api/feeds/example", meta: {} }),
    ).toBe(true);
  });

  it("flags devices marked demo in meta", () => {
    expect(isDemoDevice({ source: "pull_url", pull_url: "https://x.example/feed", meta: { demo: true } })).toBe(true);
  });

  it("leaves push devices and real pull feeds alone", () => {
    expect(isDemoDevice({ source: "push", pull_url: null, meta: {} })).toBe(false);
    expect(isDemoDevice({ source: "pull_url", pull_url: "https://x.example/feed", meta: { demo: "yes" } })).toBe(false);
    expect(isDemoDevice(null)).toBe(false);
  });
});

describe("pullDeviceMeta", () => {
  it("marks the example feed as demo when it is saved", () => {
    expect(pullDeviceMeta({}, { url: "https://probeharbor.com/api/feeds/example", jsonRoot: "temp" })).toEqual({
      pull_json_root: "temp",
      demo: true,
    });
  });

  it("clears the flag when the URL changes to a real feed and keeps other meta", () => {
    expect(
      pullDeviceMeta({ demo: true, battery_pct: 80 }, { url: "https://x.example/feed", jsonRoot: "temp" }),
    ).toEqual({ battery_pct: 80, pull_json_root: "temp" });
  });
});

describe("excluding demo data", () => {
  const demo = { id: "d", source: "pull_url", pull_url: "https://probeharbor.com/api/feeds/example" };
  const real = { id: "r", source: "push", pull_url: null };

  it("drops demo devices", () => {
    expect(excludeDemoDevices([demo, real])).toEqual([real]);
  });

  it("drops demo feeds and their probes", () => {
    const feeds = [
      { id: "demo", url: "https://probeharbor.com/api/feeds/example" },
      { id: "real", url: "https://garage.example.org/temps.json" },
    ];
    const probes = [
      { feedId: "demo", key: "0" },
      { feedId: "real", key: "0" },
    ];
    expect(excludeDemoFeeds(feeds, probes)).toEqual({ feeds: [feeds[1]], probes: [probes[1]] });
  });

  it("drops rows flagged demo and keeps rows without the flag", () => {
    const rows = [{ id: 1, deviceDemo: true }, { id: 2, deviceDemo: false }, { id: 3 }];
    expect(excludeDemoRows(rows).map((row) => row.id)).toEqual([2, 3]);
  });
});

describe("realReadingRows", () => {
  it("drops rows flagged demo and rows from demo devices without the flag", () => {
    const devices = [
      { id: "demo", source: "pull_url", pull_url: "https://probeharbor.com/api/feeds/example" },
      { id: "real", source: "push", pull_url: null },
    ];
    const rows = [
      { sensor: { device_id: "demo" } },
      { sensor: { device_id: "x" }, deviceDemo: true },
      { sensor: { device_id: "real" }, deviceDemo: false },
    ];
    expect(realReadingRows(rows, devices)).toEqual([rows[2]]);
  });
});

describe("onboardingDeviceStep", () => {
  const demoDevice = {
    id: "demo",
    source: "pull_url",
    pull_url: "https://probeharbor.com/api/feeds/example",
    last_seen_at: "2026-11-01T00:00:00Z",
  };
  const pushNeverSeen = { id: "push", source: "push", pull_url: null, last_seen_at: null };
  const pushSeen = { ...pushNeverSeen, last_seen_at: "2026-11-01T00:00:00Z" };
  const demoRow = { sensor: { device_id: "demo" }, deviceDemo: true };

  it("is todo with no devices", () => {
    expect(onboardingDeviceStep([], [])).toBe("todo");
  });

  it("is todo with only the demo feed, even when it has readings", () => {
    expect(onboardingDeviceStep([demoDevice], [demoRow])).toBe("todo");
    // Rows from a cached snapshot may lack the flag: the device list still decides.
    expect(onboardingDeviceStep([demoDevice], [{ sensor: { device_id: "demo" } }])).toBe("todo");
  });

  it("is waiting while a real device exists but has never reported", () => {
    expect(onboardingDeviceStep([pushNeverSeen], [])).toBe("waiting");
    expect(onboardingDeviceStep([demoDevice, pushNeverSeen], [demoRow])).toBe("waiting");
  });

  it("is done once a real device has reported", () => {
    expect(onboardingDeviceStep([pushSeen], [])).toBe("done");
    expect(
      onboardingDeviceStep([demoDevice, pushNeverSeen], [demoRow, { sensor: { device_id: "push" }, deviceDemo: false }]),
    ).toBe("done");
  });
});

describe("statusReadingScope", () => {
  const demoDevice = { id: "demo", source: "pull_url", pull_url: "https://probeharbor.com/api/feeds/example" };
  const pushDevice = { id: "push", source: "push", pull_url: null };
  const demoRow = { sensor: { device_id: "demo" }, deviceDemo: true, value_num: 20 };
  const realRow = { sensor: { device_id: "push" }, deviceDemo: false, value_num: 50 };

  it("judges real devices only when any exist, demo excluded", () => {
    const scope = statusReadingScope([demoRow, realRow], [demoDevice, pushDevice]);
    expect(scope.rows).toEqual([realRow]);
    expect(scope.devices).toEqual([pushDevice]);
    expect(scope.demoOnly).toBe(false);
  });

  it("keeps a real device that hasn't reported: no rows rather than the demo ones", () => {
    const scope = statusReadingScope([demoRow], [demoDevice, pushDevice]);
    expect(scope.rows).toEqual([]);
    expect(scope.devices).toEqual([pushDevice]);
    expect(scope.demoOnly).toBe(false);
  });

  it("catches unflagged rows from a demo device by the device list", () => {
    const unflagged = { sensor: { device_id: "demo" }, value_num: 20 };
    const scope = statusReadingScope([unflagged, realRow], [demoDevice, pushDevice]);
    expect(scope.rows).toEqual([realRow]);
  });

  it("marks demo-only when the only readings are demo", () => {
    const scope = statusReadingScope([demoRow], [demoDevice]);
    expect(scope.rows).toEqual([demoRow]);
    expect(scope.demoOnly).toBe(true);
  });

  it("is not demo-only with nothing reported at all", () => {
    expect(statusReadingScope([], [demoDevice]).demoOnly).toBe(false);
    expect(statusReadingScope([], []).demoOnly).toBe(false);
  });
});
