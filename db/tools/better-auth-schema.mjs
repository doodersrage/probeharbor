/**
 * Print the SQL for Better Auth's tables, as configured for ProbeHarbor.
 * The step 4 auth config must use the same model names, id type and plugins,
 * or Better Auth will look for tables that don't exist.
 *
 * Needs better-auth, @better-auth/passkey and pg installed, and an EMPTY
 * Postgres at BA_SCHEMA_DB_URL (it compares against what exists there).
 */
import { betterAuth } from "better-auth";
import { twoFactor, bearer } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { getMigrations } from "better-auth/db/migration";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.BA_SCHEMA_DB_URL ?? "postgres://postgres@127.0.0.1:55433/ba_gen",
});
const authOptions = {
  database: pool,
  secret: "schema-generation-only-not-a-real-secret",
  baseURL: "https://probeharbor.dev",
  emailAndPassword: { enabled: true },
  user: { modelName: "auth_users" },
  session: { modelName: "auth_sessions" },
  account: { modelName: "auth_accounts" },
  verification: { modelName: "auth_verifications" },
  advanced: { database: { generateId: "uuid" } },
  plugins: [
    twoFactor({ schema: { twoFactor: { modelName: "auth_two_factors" } } }),
    passkey({ schema: { passkey: { modelName: "auth_passkeys" } } }),
    bearer(),
  ],
};
const auth = betterAuth(authOptions);
const { compileMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options);
console.error("tables:", toBeCreated.map((t) => t.table).join(", "), "| added cols on:", toBeAdded.map((t) => t.table).join(", ") || "none");
process.stdout.write((await compileMigrations()) + "\n");
await pool.end();
