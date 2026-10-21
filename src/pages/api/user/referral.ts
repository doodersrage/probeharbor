import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { countReferralSignups, getOrCreateReferralCode } from "../../../lib/referrals";
import { getSiteUrl } from "../../../lib/stripe";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";

export const GET: APIRoute = async ({ cookies, request, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { user } = await getAuthFromCookies(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [code, signupCount] = await Promise.all([
    getOrCreateReferralCode(user.id),
    countReferralSignups(user.id),
  ]);

  const siteUrl = getSiteUrl(request);
  const registerUrl = `${siteUrl}/register?ref=${encodeURIComponent(code)}`;

  return new Response(
    JSON.stringify({
      code,
      registerUrl,
      signupCount,
      bonusTrialDays: 7,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
