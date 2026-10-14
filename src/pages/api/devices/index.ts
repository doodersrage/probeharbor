import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import {
  getOrCreateHouseholdForUser,
  canEditHousehold,
  getUserHouseholdRole,
} from "../../../lib/households";
import {
  createPushDevice,
  deleteDeviceSensor,
  defaultUnitForKind,
  isSensorKind,
  listHouseholdDevices,
  renamePushDevice,
  replaceDeviceSensor,
  rotatePushDeviceKey,
  transferDeviceToHousehold,
  updateDeviceDetails,
  updateDeviceSensor,
  updateDeviceSpace,
} from "../../../lib/devices";
import { getUserEntitlements } from "../../../lib/entitlements";
import { createServerClient } from "../../../lib/supabase";
import {
  householdEditorCtx,
  redirectUnlessEditor,
  requireHouseholdEditor,
} from "../../../lib/householdAuth";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import { uniqueDeviceName } from "../../../lib/uniqueDeviceName";
import { replacementErrorCode } from "../../../lib/sensorReplacement";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";
import { FLASH_INGEST_KEY, setSecretFlash } from "../../../lib/secretFlash";
import { persistEncryptedIngestKey } from "../../../lib/persistIngestKey";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/devices");
  const action = formData.get("action")?.toString() ?? "create_push";

  const editor = await requireHouseholdEditor(user.id);
  const blocked = redirectUnlessEditor(editor, redirectTo, redirect);
  if (blocked) return blocked;

  const entitlements = await getUserEntitlements(user.id);
  const household = await getOrCreateHouseholdForUser(user.id, user.email);

  if (!household.householdId) {
    return redirect(withQuery(redirectTo, { error: "1" }));
  }

  const householdId = householdEditorCtx(editor).householdId;

  if (action === "transfer") {
    const deviceId = formData.get("device_id")?.toString();
    const targetId = formData.get("target_household_id")?.toString();
    if (!deviceId || !targetId) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    // Moving a device adds it (and its history) to the target, so require
    // edit rights there, not just any membership.
    const canTarget = canEditHousehold(await getUserHouseholdRole(user.id, targetId));
    if (!canTarget) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    const result = await transferDeviceToHousehold(deviceId, householdId, targetId);
    if (result.error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    await recordHouseholdActivity({
      householdId,
      userId: user.id,
      action: "device_transfer",
      detail: `${deviceId} → ${targetId}`,
    });
    return redirect(withQuery(redirectTo, { device_transferred: "1" }));
  }

  if (action === "delete") {
    const deviceId = formData.get("device_id")?.toString();
    if (deviceId) {
      const supabase = createServerClient();
      await supabase
        .from("devices")
        .delete()
        .eq("id", deviceId)
        .eq("household_id", householdId);
    }
    return redirect(withQuery(redirectTo, { device_deleted: "1" }));
  }

  if (action === "bulk") {
    const bulkOp = formData.get("bulk_op")?.toString() ?? "";
    const ids = formData
      .getAll("ids")
      .map((v) => String(v).trim())
      .filter(Boolean);
    if (ids.length === 0 || !["enable", "disable", "delete", "set_space"].includes(bulkOp)) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const owned = await listHouseholdDevices(householdId);
    const ownedIds = new Set(owned.devices.map((d) => d.id));
    const targetIds = ids.filter((id) => ownedIds.has(id));
    if (targetIds.length === 0) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const supabase = createServerClient();

    if (bulkOp === "delete") {
      await supabase
        .from("devices")
        .delete()
        .in("id", targetIds)
        .eq("household_id", householdId);
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: "device_bulk_delete",
        detail: `${targetIds.length} devices`,
      });
      return redirect(withQuery(redirectTo, { bulk_deleted: String(targetIds.length) }));
    }

    if (bulkOp === "enable" || bulkOp === "disable") {
      await supabase
        .from("devices")
        .update({ enabled: bulkOp === "enable" })
        .in("id", targetIds)
        .eq("household_id", householdId);
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: `device_bulk_${bulkOp}`,
        detail: `${targetIds.length} devices`,
      });
      return redirect(withQuery(redirectTo, { bulk_updated: String(targetIds.length) }));
    }

    if (bulkOp === "set_space") {
      const space = (formData.get("space")?.toString() ?? "").trim();
      await supabase
        .from("devices")
        .update({ space: space || null })
        .in("id", targetIds)
        .eq("household_id", householdId);
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: "device_bulk_set_space",
        detail: `${targetIds.length} → ${space || "(none)"}`,
      });
      return redirect(withQuery(redirectTo, { bulk_updated: String(targetIds.length) }));
    }

    return redirect(withQuery(redirectTo, { error: "1" }));
  }

  if (action === "rename") {
    const deviceId = formData.get("device_id")?.toString();
    const name = formData.get("name")?.toString() ?? "";
    if (!deviceId) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    const result = await renamePushDevice(householdId, deviceId, name);
    if (result.error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    return redirect(withQuery(redirectTo, { device_renamed: "1" }));
  }

  if (action === "set_space") {
    const deviceId = formData.get("device_id")?.toString();
    const space = formData.get("space")?.toString() ?? "";
    if (!deviceId) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    const result = await updateDeviceSpace(
      householdId,
      deviceId,
      space,
    );
    if (result.error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }
    return redirect(withQuery(redirectTo, { device_renamed: "1" }));
  }

  if (action === "rotate_key") {
    const deviceId = formData.get("device_id")?.toString();
    if (!deviceId) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const rawKey = randomKey();
    const hash = await sha256Hex(rawKey);
    const prefix = rawKey.slice(0, 8);
    const result = await rotatePushDeviceKey(
      householdId,
      deviceId,
      hash,
      prefix,
    );

    if (result.error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    setSecretFlash(cookies, FLASH_INGEST_KEY, rawKey);
    await persistEncryptedIngestKey(deviceId, rawKey);
    return redirect(withQuery(redirectTo, { key_rotated: "1" }));
  }

  if (action === "add_sensor") {
    const deviceId = formData.get("device_id")?.toString();
    const key = formData.get("key")?.toString().trim();
    const label = formData.get("label")?.toString().trim();
    const kindRaw = formData.get("kind")?.toString() ?? "generic";
    const kind = isSensorKind(kindRaw) ? kindRaw : "generic";
    const unit = formData.get("unit")?.toString().trim() || defaultUnitForKind(kind);

    if (!deviceId || !key || !label) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const supabase = createServerClient();
    const owned = await listHouseholdDevices(householdId);
    if (!owned.devices.some((d) => d.id === deviceId)) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    await supabase.from("device_sensors").insert({
      device_id: deviceId,
      key,
      label,
      kind,
      unit,
      visible: true,
    });

    return redirect(withQuery(redirectTo, { sensor_added: "1" }));
  }

  if (action === "add_sensor_pair") {
    const deviceId = formData.get("device_id")?.toString();
    const key = formData.get("key")?.toString().trim();
    const label = formData.get("label")?.toString().trim() || "Probe";

    if (!deviceId || !key) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const owned = await listHouseholdDevices(householdId);
    if (!owned.devices.some((d) => d.id === deviceId)) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("device_sensors").insert([
      {
        device_id: deviceId,
        key,
        label,
        kind: "temperature",
        unit: defaultUnitForKind("temperature"),
        visible: true,
      },
      {
        device_id: deviceId,
        key,
        label: `${label} humidity`,
        kind: "humidity",
        unit: defaultUnitForKind("humidity"),
        visible: true,
      },
    ]);

    if (error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    return redirect(withQuery(redirectTo, { sensor_added: "1" }));
  }

  if (action === "update_sensor") {
    const sensorId = formData.get("sensor_id")?.toString();
    const deviceId = formData.get("device_id")?.toString();
    const key = formData.get("key")?.toString().trim();
    const label = formData.get("label")?.toString().trim();
    const kindRaw = formData.get("kind")?.toString() ?? "generic";
    const kind = isSensorKind(kindRaw) ? kindRaw : "generic";
    const unit = formData.get("unit")?.toString().trim() || defaultUnitForKind(kind);
    const offsetNum = Number.parseFloat(
      formData.get("offset_num")?.toString() ?? "0",
    );
    const visible = formData.has("visible");

    if (!sensorId || !deviceId || !key || !label) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const owned = await listHouseholdDevices(householdId);
    if (!owned.devices.some((d) => d.id === deviceId)) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const result = await updateDeviceSensor(sensorId, deviceId, {
      key,
      label,
      kind,
      unit,
      offsetNum: Number.isFinite(offsetNum) ? offsetNum : 0,
      visible,
    });

    if (result.error) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    return redirect(withQuery(redirectTo, { sensor_updated: "1" }));
  }

  if (action === "delete_sensor") {
    const sensorId = formData.get("sensor_id")?.toString();
    const deviceId = formData.get("device_id")?.toString();

    if (!sensorId || !deviceId) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    const owned = await listHouseholdDevices(householdId);
    if (!owned.devices.some((d) => d.id === deviceId)) {
      return redirect(withQuery(redirectTo, { error: "1" }));
    }

    await deleteDeviceSensor(sensorId, deviceId);
    return redirect(withQuery(redirectTo, { sensor_deleted: "1" }));
  }

  if (action === "update_device") {
    const deviceId = formData.get("device_id")?.toString();
    if (!deviceId) return redirect(withQuery(redirectTo, { error: "1" }));
    const name = formData.get("name")?.toString();
    const result = await updateDeviceDetails(householdId, deviceId, {
      name: name === undefined ? undefined : name,
      space: formData.get("space")?.toString() ?? null,
      enabled: formData.get("enabled") === "true",
    });
    if (result.error) return redirect(withQuery(redirectTo, { error: "1" }));
    return redirect(withQuery(redirectTo, { device_saved: "1" }));
  }

  if (action === "update_sensors") {
    const deviceId = formData.get("device_id")?.toString();
    if (!deviceId) return redirect(withQuery(redirectTo, { error: "1" }));
    const owned = await listHouseholdDevices(householdId);
    const device = owned.devices.find((d) => d.id === deviceId);
    if (!device) return redirect(withQuery(redirectTo, { error: "1" }));

    // A Delete button inside the sensors form names the one sensor to remove.
    const deleteId = formData.get("delete_sensor_id")?.toString();
    if (deleteId) {
      if (!device.sensors.some((s) => s.id === deleteId)) return redirect(withQuery(redirectTo, { error: "1" }));
      await deleteDeviceSensor(deleteId, deviceId);
      return redirect(withQuery(redirectTo, { sensor_deleted: "1" }));
    }

    for (const sensor of device.sensors) {
      const field = (name: string) => formData.get(`${name}:${sensor.id}`)?.toString();
      if (field("label") === undefined) continue;
      const kindRaw = field("kind") ?? sensor.kind;
      const kind = isSensorKind(kindRaw) ? kindRaw : sensor.kind;
      const offsetNum = Number.parseFloat(field("offset") ?? String(sensor.offset_num ?? 0));
      const label = field("label")?.trim() || sensor.label;
      const key = field("key")?.trim() || sensor.key;
      const unit = field("unit")?.trim() || defaultUnitForKind(kind);
      const visible = formData.has(`visible:${sensor.id}`);
      const unchanged =
        label === sensor.label &&
        key === sensor.key &&
        kind === sensor.kind &&
        unit === sensor.unit &&
        visible === sensor.visible &&
        (Number.isFinite(offsetNum) ? offsetNum : 0) === (sensor.offset_num ?? 0);
      if (unchanged) continue;
      const result = await updateDeviceSensor(sensor.id, deviceId, {
        key,
        label,
        kind,
        unit,
        offsetNum: Number.isFinite(offsetNum) ? offsetNum : 0,
        visible,
      });
      if (result.error) return redirect(withQuery(redirectTo, { error: "1" }));
    }
    return redirect(withQuery(redirectTo, { sensor_updated: "1" }));
  }

  if (action === "replace_sensor") {
    const oldSensorId = formData.get("old_sensor_id")?.toString();
    const newSensorId = formData.get("new_sensor_id")?.toString();
    if (!oldSensorId || !newSensorId) {
      return redirect(withQuery(redirectTo, { replace_error: "failed" }));
    }
    const owned = await listHouseholdDevices(householdId);
    const sensors = owned.devices.flatMap((d) => d.sensors.map((s) => ({ ...s, deviceName: d.name })));
    const oldSensor = sensors.find((s) => s.id === oldSensorId);
    const newSensor = sensors.find((s) => s.id === newSensorId);
    const result = await replaceDeviceSensor(householdId, oldSensorId, newSensorId);
    if (result.error) {
      return redirect(withQuery(redirectTo, { replace_error: replacementErrorCode(result.error) }));
    }
    await recordHouseholdActivity({
      householdId,
      userId: user.id,
      action: "sensor_replaced",
      detail: `${oldSensor ? `${oldSensor.deviceName} · ${oldSensor.label}` : "sensor"} → ${
        newSensor ? `${newSensor.deviceName} · ${newSensor.key}` : "new sensor"
      } (${result.movedReadings} readings moved)`,
    });
    return redirect(withQuery(redirectTo, { sensor_replaced: String(result.movedReadings) }));
  }

  // create_push only — enforce device limit here
  const existing = await listHouseholdDevices(householdId);
  const pushCount = existing.devices.filter((d) => d.source === "push").length;
  if (pushCount >= entitlements.maxDevices) {
    return redirect(withQuery(redirectTo, { error: "device_limit" }));
  }

  const name = uniqueDeviceName(
    formData.get("name")?.toString().trim() || "Workshop probe",
    existing.devices.map((d) => d.name),
  );
  const rawKey = randomKey();
  const hash = await sha256Hex(rawKey);
  const prefix = rawKey.slice(0, 8);

  const { device, error } = await createPushDevice(
    householdId,
    name,
    hash,
    prefix,
    formData.get("space")?.toString() ?? null,
  );

  if (error || !device) {
    return redirect(withQuery(redirectTo, { error: "1" }));
  }

  setSecretFlash(cookies, FLASH_INGEST_KEY, rawKey);
  await persistEncryptedIngestKey(device.id, rawKey);
  return redirect(
    withQuery(redirectTo, {
      device_created: "1",
      focus_device: device.id,
    }),
  );
};
