import type { APIRoute } from "astro";
import { forwardOAuthCallback } from "../../../../lib/betterAuthRuntime";
import { dbBackend } from "../../../../lib/db/client";

/**
 * Google and Discord return here when sign-in runs on Better Auth
 * (DB_BACKEND=neon); with Supabase they return to Supabase instead. The
 * provider consoles need these URLs added before the cutover:
 *   https://<site>/api/auth/callback/google
 *   https://<site>/api/auth/callback/discord
 */
const PROVIDERS = new Set(["google", "discord"] as const);

export const GET: APIRoute = async ({ params, request }) => {
  const provider = params.provider as "google" | "discord";
  if (dbBackend() !== "neon" || !PROVIDERS.has(provider)) return new Response("Not found", { status: 404 });
  return forwardOAuthCallback(request, provider);
};
