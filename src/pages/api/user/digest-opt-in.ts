import * as neonRemaining from "../../../lib/db/remaining";
import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/household");
  const optInRaw = formData.getAll("digest_opt_in").map(String);
  const optIn = optInRaw.includes("1") || optInRaw.includes("on");

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) {
    return redirect(withQuery(redirectTo, { digest_error: "1" }));
  }

  const { error } = await neonRemaining.setDigestOptIn(household.householdId, user.id, optIn);

  if (error) {
    return redirect(withQuery(redirectTo, { digest_error: "1" }));
  }

  return redirect(
    `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}digest_saved=1`,
  );
};
