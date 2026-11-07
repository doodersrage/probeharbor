import type { APIRoute } from "astro";
import { forwardOAuthCallback } from "../../../../lib/betterAuthRuntime";

/**
 * GitHub returns here after sign-in. Better Auth checks the state and code
 * itself, then sends the visitor on to /api/auth/oauth-done.
 */
export const GET: APIRoute = async ({ request }) => forwardOAuthCallback(request, "github");
