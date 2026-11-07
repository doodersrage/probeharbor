import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import {
  quietUntilSevenDaysFromNow,
  updateDashboardQuietUntil,
} from "../../../lib/dashboardComfort";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);

  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard");
  const action = formData.get("action")?.toString() ?? "quiet_7d";

  const quietUntil =
    action === "clear" ? null : quietUntilSevenDaysFromNow();

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  const { error } = await updateDashboardQuietUntil(
    accessToken,
    refreshToken,
    quietUntil,
  );

  if (error) {
    return redirect(withQuery(redirectTo, { quiet_error: "1" }));
  }


  return redirect(
    withQuery(redirectTo, quietUntil ? { quiet_saved: "1" } : { quiet_cleared: "1" }),
  );
};
