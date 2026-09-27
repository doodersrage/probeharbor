import type { APIRoute } from "astro";
import { createAuthClient } from "../../../lib/supabase";
import { getAuthFromCookies, setAuthCookies } from "../../../lib/auth";
import { updateDashboardGrowthTipsDismissed } from "../../../lib/dashboardComfort";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard");
  const action = formData.get("action")?.toString() ?? "dismiss";
  const dismissed = action !== "reset";

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  const { error } = await updateDashboardGrowthTipsDismissed(
    accessToken,
    refreshToken,
    dismissed,
  );

  if (error) {
    return redirect(withQuery(redirectTo, { tips_error: "1" }));
  }

  const { data: refreshedSession } = await createAuthClient().auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (refreshedSession.session) {
    setAuthCookies(
      cookies,
      refreshedSession.session.access_token,
      refreshedSession.session.refresh_token,
    );
  }

  return redirect(
    `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}${
      dismissed ? "tips_hidden=1" : "tips_reset=1"
    }`,
  );
};
