import type { APIRoute } from "astro";
import { createAuthClient } from "../../../lib/supabase";
import { getAuthFromCookies, setAuthCookies } from "../../../lib/auth";
import {
  updateDashboardOverviewMode,
  type DashboardOverviewMode,
} from "../../../lib/dashboardOverviewMode";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);

  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard");
  const modeRaw = formData.get("mode")?.toString();
  const mode: DashboardOverviewMode =
    modeRaw === "insights" ? "insights" : "simple";

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  const { error } = await updateDashboardOverviewMode(
    accessToken,
    refreshToken,
    mode,
  );

  if (error) {
    return redirect(withQuery(redirectTo, { overview_mode_error: "1" }));
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

  return redirect(redirectTo);
};
