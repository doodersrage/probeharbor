import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { listHouseholdDevices } from "../../../lib/devices";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { getAlertSettingsForUser } from "../../../lib/notify";
import { explainRulesForUser } from "../../../lib/alertNotifications";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Why each saved rule would or wouldn't fire right now. Read-only; sends nothing. */
export const GET: APIRoute = async ({ cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) return json({ error: tc.unauthorized }, 401);

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) return json({ error: apiUserMessages(locale).noProperty }, 404);

  const [settings, { devices }] = await Promise.all([
    getAlertSettingsForUser(user.id),
    listHouseholdDevices(household.householdId),
  ]);
  return json(await explainRulesForUser(user.id, settings, household.householdId, devices, locale));
};
