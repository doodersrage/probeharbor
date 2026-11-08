import { beforeEach, describe, expect, it, vi } from "vitest";
import { devicesToTempConfig, updateDeviceDetails, type DeviceWithSensors } from "./devices";

const neonDevices = vi.hoisted(() => ({
  createPushDevice: vi.fn(),
  renamePushDevice: vi.fn(),
  updateDeviceSpace: vi.fn(),
  getDeviceSource: vi.fn(),
  updateDeviceDetails: vi.fn(),
  updateDeviceSensor: vi.fn(),
}));
const neonIngest = vi.hoisted(() => ({
  updateDeviceMeta: vi.fn(),
}));
vi.mock("./db/devices", () => neonDevices);
vi.mock("./db/ingest", () => neonIngest);

beforeEach(() => {
  for (const fn of [...Object.values(neonDevices), ...Object.values(neonIngest)]) fn.mockReset();
});

function device(overrides: Partial<DeviceWithSensors> = {}): DeviceWithSensors {
  return {
    id: "device-1",
    household_id: "house-1",
    name: "Garage",
    source: "pull_url",
    pull_url: "https://example.com/feed.json",
    ingest_key_prefix: null,
    enabled: true,
    last_seen_at: null,
    sort_order: 0,
    sensors: [],
    ...overrides,
  };
}

describe("devicesToTempConfig", () => {
  it("only maps enabled-source pull devices with a url into feeds", () => {
    const devices = [
      device({ id: "d1" }),
      device({ id: "d2", source: "push", pull_url: null }),
      device({ id: "d3", source: "pull_url", pull_url: null }),
    ];
    const { feeds } = devicesToTempConfig(devices);
    expect(feeds.map((f) => f.id)).toEqual(["d1"]);
  });

  it("only surfaces temperature sensors as probes, never humidity or others", () => {
    const devices = [
      device({
        id: "d1",
        sensors: [
          { id: "s1", device_id: "d1", key: "temp1", label: "Bay 1", kind: "temperature", unit: "F", visible: true, sort_order: 0, offset_num: 0 },
          { id: "s2", device_id: "d1", key: "temp1", label: "Bay 1 humidity", kind: "humidity", unit: "%", visible: true, sort_order: 1, offset_num: 0 },
          { id: "s3", device_id: "d1", key: "door1", label: "Door", kind: "door" as never, unit: null, visible: true, sort_order: 2, offset_num: 0 },
        ],
      }),
    ];
    const { probes } = devicesToTempConfig(devices);
    expect(probes).toHaveLength(1);
    expect(probes[0]).toMatchObject({ id: "d1:temp1", feedId: "d1", key: "temp1", visible: true });
  });

  it("strips a trailing ' humidity' suffix from a temperature sensor's own label", () => {
    const devices = [
      device({
        id: "d1",
        sensors: [
          { id: "s1", device_id: "d1", key: "temp1", label: "Bay 1 humidity", kind: "temperature", unit: "F", visible: true, sort_order: 0, offset_num: 0 },
        ],
      }),
    ];
    const { probes } = devicesToTempConfig(devices);
    // A mislabeled temperature sensor still gets its (accidental) " humidity"
    // suffix trimmed -- matches the same regex used for real humidity pairs.
    expect(probes[0].label).toBe("Bay 1");
  });

  it("de-duplicates probes sharing the same device+key", () => {
    const devices = [
      device({
        id: "d1",
        sensors: [
          { id: "s1", device_id: "d1", key: "temp1", label: "A", kind: "temperature", unit: "F", visible: true, sort_order: 0, offset_num: 0 },
          { id: "s2", device_id: "d1", key: "temp1", label: "A dup", kind: "temperature", unit: "F", visible: true, sort_order: 1, offset_num: 0 },
        ],
      }),
    ];
    const { probes } = devicesToTempConfig(devices);
    expect(probes).toHaveLength(1);
  });

  it("returns empty feeds/probes for an empty device list", () => {
    expect(devicesToTempConfig([])).toEqual({ feeds: [], probes: [] });
  });
});

describe("createPushDevice", () => {
  it("trims the space and stores a blank one as null", async () => {
    neonDevices.createPushDevice.mockResolvedValue({ device: null, error: null });
    const { createPushDevice } = await import("./devices");

    await createPushDevice("house-1", "New device", "hash-abc", "gtm_abc", "  Attic  ");
    await createPushDevice("house-1", "New device", "hash-abc", "gtm_abc", "   ");

    expect(neonDevices.createPushDevice).toHaveBeenNthCalledWith(1, "house-1", "New device", "hash-abc", "gtm_abc", "Attic");
    expect(neonDevices.createPushDevice).toHaveBeenNthCalledWith(2, "house-1", "New device", "hash-abc", "gtm_abc", null);
  });
});

describe("renamePushDevice", () => {
  it("rejects a blank name without touching the database", async () => {
    const { renamePushDevice } = await import("./devices");
    expect(await renamePushDevice("house-1", "d1", "   ")).toEqual({
      error: "Name is required",
    });
    expect(neonDevices.renamePushDevice).not.toHaveBeenCalled();
  });

  it("saves the trimmed name with the localized failure message", async () => {
    neonDevices.renamePushDevice.mockResolvedValue({ error: null });
    const { renamePushDevice } = await import("./devices");

    expect(await renamePushDevice("house-1", "d1", "  Garage  ")).toEqual({ error: null });
    expect(neonDevices.renamePushDevice).toHaveBeenCalledWith("house-1", "d1", "Garage", "Failed to rename device");
  });
});

describe("updateDeviceSpace", () => {
  it("normalizes a blank space to null and trims a real value", async () => {
    neonDevices.updateDeviceSpace.mockResolvedValue({ error: null });
    const { updateDeviceSpace } = await import("./devices");

    await updateDeviceSpace("house-1", "d1", "   ");
    await updateDeviceSpace("house-1", "d1", "  Attic  ");

    expect(neonDevices.updateDeviceSpace.mock.calls[0]?.[2]).toBeNull();
    expect(neonDevices.updateDeviceSpace.mock.calls[1]?.[2]).toBe("Attic");
  });
});

describe("updateDeviceSensor", () => {
  it("clamps the offset for the sensor's kind before saving", async () => {
    neonDevices.updateDeviceSensor.mockResolvedValue({ error: null });
    const { updateDeviceSensor } = await import("./devices");

    await updateDeviceSensor("house-1", "s1", "d1", {
      key: "temp1",
      label: "Bay",
      kind: "temperature",
      offsetNum: 999,
    });

    // TEMP_OFFSET_MAX_F is 10 -- an absurd input offset must be clamped, not stored raw.
    expect(neonDevices.updateDeviceSensor).toHaveBeenCalledWith(
      "house-1",
      "s1",
      "d1",
      expect.objectContaining({ offsetNum: 10, unit: null }),
    );
  });

  it("leaves visible unset when not provided, rather than forcing it false", async () => {
    neonDevices.updateDeviceSensor.mockResolvedValue({ error: null });
    const { updateDeviceSensor } = await import("./devices");

    await updateDeviceSensor("house-1", "s1", "d1", { key: "temp1", label: "Bay", kind: "temperature" });

    expect(neonDevices.updateDeviceSensor.mock.calls[0]?.[3]?.visible).toBeUndefined();
  });
});

describe("updateDeviceDetails", () => {
  it("saves name, space, and enabled for a push device", async () => {
    neonDevices.getDeviceSource.mockResolvedValue("push");
    neonDevices.updateDeviceDetails.mockResolvedValue({ error: null });
    expect(await updateDeviceDetails("house-1", "d1", { name: " Attic ", space: " Attic ", enabled: false })).toEqual({ error: null });
    expect(neonDevices.updateDeviceDetails).toHaveBeenCalledWith("house-1", "d1", true, "Attic", false, "Attic");
  });

  it("tells the save it's a pull feed, which owns its own name and on/off", async () => {
    neonDevices.getDeviceSource.mockResolvedValue("pull_url");
    neonDevices.updateDeviceDetails.mockResolvedValue({ error: null });
    await updateDeviceDetails("house-1", "d1", { name: "Renamed", space: "", enabled: false });
    expect(neonDevices.updateDeviceDetails).toHaveBeenCalledWith("house-1", "d1", false, "Renamed", false, null);
  });

  it("refuses a blank name and devices from other properties", async () => {
    neonDevices.getDeviceSource.mockResolvedValueOnce("push");
    expect((await updateDeviceDetails("house-1", "d1", { name: "  ", space: null })).error).toMatch(/Name/);
    neonDevices.getDeviceSource.mockResolvedValueOnce(null);
    expect((await updateDeviceDetails("house-1", "x", { space: null })).error).toMatch(/not found/);
    neonDevices.getDeviceSource.mockRejectedValueOnce(new Error("db down"));
    expect((await updateDeviceDetails("house-1", "x", { space: null })).error).toMatch(/not found/);
    expect(neonDevices.updateDeviceDetails).not.toHaveBeenCalled();
  });
});

describe("updateDeviceMeta", () => {
  it("stamps last_seen_at for readings but not for bookkeeping writes", async () => {
    const { updateDeviceMeta } = await import("./devices");
    await updateDeviceMeta("house-1", "d1", { ingest_key_enc: "x" });
    await updateDeviceMeta("house-1", "d1", { ingest_key_enc: "x" }, { touchLastSeen: false });
    expect(neonIngest.updateDeviceMeta).toHaveBeenNthCalledWith(1, "house-1", "d1", { ingest_key_enc: "x" }, true);
    expect(neonIngest.updateDeviceMeta).toHaveBeenNthCalledWith(2, "house-1", "d1", { ingest_key_enc: "x" }, false);
  });
});
