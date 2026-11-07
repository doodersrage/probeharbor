import { updateSessionUserMetadata } from "../../../lib/sessionMetadata";
import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard");
  const action = formData.get("action")?.toString() ?? "dismiss";

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;

  const existing = (user.user_metadata ?? {}) as Record<string, unknown>;
  const dismissed = action !== "reset";

  const { error } = await updateSessionUserMetadata(accessToken, refreshToken, {
    ...existing,
    onboarding_dismissed: dismissed,
  });

  if (error) {
    return redirect(withQuery(redirectTo, { onboarding_error: "1" }));
  }


  return redirect(
    `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}${
      dismissed ? "onboarding_dismissed=1" : "onboarding_reset=1"
    }`,
  );
};
