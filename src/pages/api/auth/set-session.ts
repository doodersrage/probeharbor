import type { APIRoute } from "astro";

/** The old Supabase-only endpoint (stored client-side Supabase tokens), now answered as gone. */
export const POST: APIRoute = async () =>
  new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
