import type { APIRoute } from "astro";
import {
  recordInboundSignatureFormat,
  resolveInboundWebhook,
} from "../../../lib/inboundWebhooks";
import { verifyInboundRequest } from "../../../lib/inboundSigning";
import {
  applySnoozeForHouseholdMembers,
  applyVacationForHouseholdMembers,
  clearSnoozeForHouseholdMembers,
  clearVacationForHouseholdMembers,
} from "../../../lib/alertSnoozeTokens";
import { listHouseholdDevices } from "../../../lib/devices";
import { fetchLatestSensorValues } from "../../../lib/sensorReadings";
import { recordHouseholdActivity } from "../../../lib/householdActivity";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const token = params.token?.trim();
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resolved = await resolveInboundWebhook(token);
  if (!resolved) {
    return new Response(JSON.stringify({ error: "Invalid webhook" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawBody = await request.text();
  const verification = await verifyInboundRequest(
    resolved.signingSecret,
    rawBody,
    request.headers,
  );
  if (!verification.ok) {
    const error =
      verification.reason === "stale_timestamp"
        ? "Stale timestamp (X-ProbeHarbor-Timestamp must be within 5 minutes)"
        : "Invalid signature";
    return new Response(JSON.stringify({ error }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Tells the owner which webhooks still send body-only signatures before
  // timestamps become required.
  await recordInboundSignatureFormat(resolved.webhookId, verification.format);

  let body: Record<string, unknown> = {};
  try {
    body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
  } catch {
    body = {};
  }

  const action =
    typeof body.action === "string"
      ? body.action
      : new URL(request.url).searchParams.get("action");

  if (action === "snooze") {
    const hours = Number(body.hours ?? 24);
    const count = await applySnoozeForHouseholdMembers(
      resolved.householdId,
      Number.isFinite(hours) ? hours : 24,
    );
    await recordHouseholdActivity({
      householdId: resolved.householdId,
      action: "inbound_snooze",
      detail: `${hours}h`,
    });
    return new Response(JSON.stringify({ ok: true, action: "snooze", members: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "vacation") {
    const days = Number(body.days ?? 7);
    const count = await applyVacationForHouseholdMembers(
      resolved.householdId,
      Number.isFinite(days) ? days : 7,
    );
    await recordHouseholdActivity({
      householdId: resolved.householdId,
      action: "inbound_vacation",
      detail: `${days}d`,
    });
    return new Response(JSON.stringify({ ok: true, action: "vacation", members: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "clear_snooze") {
    const count = await clearSnoozeForHouseholdMembers(resolved.householdId);
    return new Response(JSON.stringify({ ok: true, action: "clear_snooze", members: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "clear_vacation") {
    const count = await clearVacationForHouseholdMembers(resolved.householdId);
    return new Response(JSON.stringify({ ok: true, action: "clear_vacation", members: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "status") {
    const { devices } = await listHouseholdDevices(resolved.householdId);
    const sensors = await fetchLatestSensorValues(resolved.householdId);
    const temps = sensors.filter(
      (s) => s.sensor.kind === "temperature" && s.value_num != null,
    );
    return new Response(
      JSON.stringify({
        ok: true,
        action: "status",
        deviceCount: devices.length,
        sensorCount: sensors.length,
        temperatures: temps.slice(0, 8).map((s) => ({
          label: s.sensor.label,
          value: s.value_num,
          unit: s.sensor.unit,
          recorded_at: s.recorded_at,
        })),
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message:
        "Use action=snooze, vacation, clear_snooze, clear_vacation, or status.",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
