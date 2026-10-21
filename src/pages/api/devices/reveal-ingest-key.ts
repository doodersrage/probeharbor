import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { decryptStoredIngestKey, ingestKeyVaultConfigured } from "../../../lib/ingestKeyVault";
import {
  createAuthClientFromSession,
  userHasAnyMfaEnrolled,
} from "../../../lib/mfa";
import { hasElevatedAuth } from "../../../lib/mfaStepUpProof";
import { checkRevealIngestKeyRateLimit } from "../../../lib/revealIngestKeyLimits";
import { listHouseholdDevices } from "../../../lib/devices";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import { requireHouseholdEditor, householdEditorCtx } from "../../../lib/householdAuth";
import { fmt, formatNumber } from "../../../i18n";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiDevicesMessages } from "../../../i18n/messages/app/api/devices";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const t = apiDevicesMessages(locale).reveal;
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return new Response(JSON.stringify({ ok: false, error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rate = checkRevealIngestKeyRateLimit(user.id);
  if (!rate.ok) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: fmt(t.tooManyAttempts, { seconds: formatNumber(rate.retryAfterSec ?? 60, locale) }),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rate.retryAfterSec ?? 60),
        },
      },
    );
  }

  if (!ingestKeyVaultConfigured()) {
    return new Response(
      JSON.stringify({ ok: false, error: t.notConfigured }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const { client, error: sessionError } = await createAuthClientFromSession(
    session.access_token,
    session.refresh_token,
  );
  if (sessionError) {
    return new Response(JSON.stringify({ ok: false, error: tc.sessionExpired }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hasMfa = await userHasAnyMfaEnrolled(client, user);
  if (
    hasMfa &&
    !(await hasElevatedAuth(request, cookies, session.access_token, user.id))
  ) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: t.verifyMfa,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const editor = await requireHouseholdEditor(user.id);
  if (!editor.ok) {
    return new Response(JSON.stringify({ ok: false, error: tc.viewOnly }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { device_id?: string } | null;
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
  const deviceId = typeof body.device_id === "string" ? body.device_id.trim() : "";
  if (!deviceId) {
    return new Response(JSON.stringify({ ok: false, error: "device_id required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { devices } = await listHouseholdDevices(householdEditorCtx(editor).householdId);
  const device = devices.find((row) => row.id === deviceId && row.source === "push");
  if (!device) {
    return new Response(JSON.stringify({ ok: false, error: t.deviceNotFound }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const meta =
    device.meta && typeof device.meta === "object" && !Array.isArray(device.meta)
      ? (device.meta as Record<string, unknown>)
      : {};
  const stored = typeof meta.ingest_key_enc === "string" ? meta.ingest_key_enc : null;
  if (!stored) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: t.noRecoverableKey,
      }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const ingestKey = await decryptStoredIngestKey(stored);
  if (!ingestKey) {
    return new Response(JSON.stringify({ ok: false, error: t.decryptFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  await recordHouseholdActivity({
    householdId: householdEditorCtx(editor).householdId,
    userId: user.id,
    action: "ingest_key_revealed",
    detail: `${device.name} (${deviceId})`,
  });

  return new Response(
    JSON.stringify({ ok: true, ingest_key: ingestKey }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
};
