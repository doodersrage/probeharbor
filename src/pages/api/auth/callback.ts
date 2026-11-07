import type { APIRoute } from "astro";
import { buildSignInRedirectUrl } from "../../../lib/signInErrors";

/**
 * The old Supabase OAuth return, now answered as gone. Providers return to
 * /api/auth/callback/<provider> or the GitHub callback instead.
 */
export const GET: APIRoute = async ({ redirect }) => redirect(buildSignInRedirectUrl("oauth_exchange_failed"));
