import type { APIRoute } from "astro";
import { forwardOAuthCallback } from "../../../../lib/betterAuthRuntime";

/**
 * Google and Discord return here after sign-in; Better Auth finishes it.
 * The provider consoles list these URLs:
 *   https://<site>/api/auth/callback/google
 *   https://<site>/api/auth/callback/discord
 */
const PROVIDERS = new Set(["google", "discord"] as const);

export const GET: APIRoute = async ({ params, request }) => {
  const provider = params.provider as "google" | "discord";
  if (!PROVIDERS.has(provider)) return new Response("Not found", { status: 404 });
  return forwardOAuthCallback(request, provider);
};
