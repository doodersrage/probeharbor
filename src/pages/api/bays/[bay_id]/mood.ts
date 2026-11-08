import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../../lib/auth";
import { getOrCreateHouseholdForUser } from "../../../../lib/households";
import { householdEditorCtx, requireHouseholdEditor } from "../../../../lib/householdAuth";
import { isBayMood } from "../../../../lib/bayMood";
import {
  resolveBayMoodForHousehold,
  setBayMoodOverride,
} from "../../../../lib/pucks";
import { apiCommonMessages, apiLocale } from "../../../../i18n/messages/app/api/common";

function json(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ params, request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) {
    return json(401, { error: tc.unauthorized });
  }

  const bayId = params.bay_id ?? "";
  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (household.error || !household.householdId) {
    return json(500, { error: household.error ?? "household" });
  }

  const result = await resolveBayMoodForHousehold({
    bayId,
    householdId: household.householdId,
  });
  if (!result.ok) {
    return json(result.status, { error: result.error });
  }

  return json(200, {
    bay_id: result.bayId,
    mood: result.mood,
    updated_at: result.updatedAt,
    space_name: result.spaceName,
    source: result.source,
  });
};

export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) {
    return json(401, { error: tc.unauthorized });
  }

  const bayId = params.bay_id ?? "";
  let body: { mood?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: tc.invalidJson });
  }
  if (!body || typeof body !== "object") {
    return json(400, { error: tc.invalidJson });
  }

  const mood = typeof body.mood === "string" ? body.mood.toLowerCase() : "";
  if (!isBayMood(mood)) {
    return json(400, { error: "bad_mood" });
  }

  // Changing the mood is a write: view-only and alert-only members can't.
  const editor = await requireHouseholdEditor(user.id);
  if (!editor.ok) {
    return json(editor.error === "No household" ? 500 : 403, { error: editor.error === "No household" ? "household" : tc.viewOnly });
  }

  const result = await setBayMoodOverride({
    bayId,
    householdId: householdEditorCtx(editor).householdId,
    mood,
  });
  if (!result.ok) {
    return json(result.status, { error: result.error });
  }

  return json(200, { bay_id: bayId, mood });
};
