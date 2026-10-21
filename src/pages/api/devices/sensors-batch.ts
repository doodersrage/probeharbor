import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { listHouseholdDevices, updateDeviceSensor } from "../../../lib/devices";
import { requireHouseholdEditor, householdEditorCtx } from "../../../lib/householdAuth";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiDevicesMessages } from "../../../i18n/messages/app/api/devices";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { user } = await getAuthFromCookies(cookies);
  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const editor = await requireHouseholdEditor(user.id);
  if (!editor.ok) {
    return new Response(JSON.stringify({ ok: false, error: tc.viewOnly }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    sensors?: Array<{ id?: string; label?: string }>;
  } | null;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ ok: false, error: tc.invalidJson }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!Array.isArray(body.sensors) || body.sensors.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: apiDevicesMessages(locale).noSensorsProvided }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { devices } = await listHouseholdDevices(householdEditorCtx(editor).householdId);
  const sensorById = new Map(
    devices.flatMap((device) =>
      device.sensors.map((sensor) => [sensor.id, { sensor, deviceId: device.id }] as const),
    ),
  );

  for (const row of body.sensors) {
    if (!row || typeof row !== "object") continue;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const label = typeof row.label === "string" ? row.label.trim() : undefined;
    if (!id || !label) continue;
    const match = sensorById.get(id);
    if (!match) continue;
    const result = await updateDeviceSensor(id, match.deviceId, {
      key: match.sensor.key,
      label,
      kind: match.sensor.kind,
      unit: match.sensor.unit,
      offsetNum: match.sensor.offset_num,
    });
    if (result.error) {
      return new Response(JSON.stringify({ ok: false, error: result.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
