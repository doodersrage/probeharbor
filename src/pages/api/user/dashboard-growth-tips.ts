import { refreshCookiesAfterMetadataWrite } from "../../../lib/sessionMetadata";
import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
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

  await refreshCookiesAfterMetadataWrite(cookies, refreshToken);

  return redirect(
    `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}${
      dismissed ? "tips_hidden=1" : "tips_reset=1"
    }`,
  );
};
