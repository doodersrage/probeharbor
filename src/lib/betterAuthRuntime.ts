/**
 * Better Auth on Workers, for DB_BACKEND=neon. A database pool can't be
 * shared between requests on Workers, so each call opens a Neon pool
 * (WebSocket, pg-compatible), builds the auth instance, runs, and closes the
 * pool before returning.
 *
 * Imports cloudflare:workers (via runtimeEnv): load it with a dynamic
 * import from anything the middleware or a prerendered page imports.
 */
import { Pool } from "@neondatabase/serverless";
import { createBetterAuth, type ProbeHarborAuth } from "./betterAuthConfig";
import { getRuntimeEnv } from "./runtimeEnv";
import { buildSiteUrl } from "./siteUrl";
import { resolveWebAuthnRp } from "./webauthnRp";

const notWiredYet = (what: string) => async () => {
  // Emails move over in step 4c; until then, fail loudly instead of pretending to send.
  throw new Error(`${what} email is not wired to Better Auth yet (step 4c).`);
};

export async function withBetterAuth<T>(request: Request | undefined, run: (auth: ProbeHarborAuth) => Promise<T>): Promise<T> {
  const url = getRuntimeEnv("DATABASE_URL");
  const secret = getRuntimeEnv("BETTER_AUTH_SECRET");
  if (!url || !secret) throw new Error("Better Auth needs DATABASE_URL and BETTER_AUTH_SECRET.");
  const pool = new Pool({ connectionString: url, max: 2 });
  try {
    const auth = createBetterAuth({
      database: pool,
      secret,
      baseURL: buildSiteUrl(request),
      rpID: resolveWebAuthnRp(request).rpId,
      sendVerificationEmail: notWiredYet("Confirmation"),
      sendResetPassword: notWiredYet("Password reset"),
    });
    return await run(auth);
  } finally {
    await pool.end().catch(() => {});
  }
}
