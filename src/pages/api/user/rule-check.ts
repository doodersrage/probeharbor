import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { listHouseholdDevices } from "../../../lib/devices";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { getAlertSettingsForUser } from "../../../lib/notify";
import { explainRulesForUser } from "../../../lib/alertNotifications";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Why each saved rule would or wouldn't fire right now. Read-only; sends nothing. */
export const GET: APIRoute = async ({ cookies }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) return json({ error: "Unauthorized" }, 401);

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) return json({ error: "No property" }, 404);

  const [settings, { devices }] = await Promise.all([
    getAlertSettingsForUser(user.id),
    listHouseholdDevices(household.householdId),
  ]);
  return json(await explainRulesForUser(user.id, settings, household.householdId, devices));
};
