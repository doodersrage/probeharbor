/**
 * Database and sign-in helpers for the ops scripts (Neon Postgres + Better
 * Auth since the move off Supabase; see IMPLEMENTATION_PLAN.md step 7).
 *
 * Plain Node, no app imports: the scripts can't load the app's TypeScript.
 * What they need from Better Auth is small and mirrored here:
 * - passwords: bcrypt for hashes copied from Supabase, Better Auth's scrypt
 *   otherwise (same rule as verifyStoredPassword in src/lib/betterAuthConfig.ts);
 * - sessions: a row in public.auth_sessions plus the signed cookie value
 *   Better Auth expects (`token.base64(HMAC-SHA256(token, secret))`, URL-encoded).
 */
import { createHmac, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import pg from "pg";

/** Production cookie name (the Worker runs with secure cookies). */
export const SESSION_COOKIE = "__Secure-better-auth.session_token";

/**
 * A small client for one connection string. Timestamps come back as ISO
 * strings, as the Supabase client returned them, so script code can keep
 * using Date.parse() and .slice().
 */
export function openDb(connectionString, label = "database") {
  if (!connectionString?.trim()) throw new Error(`No connection string for ${label}.`);
  const pool = new pg.Pool({ connectionString: connectionString.trim(), max: 2 });
  const iso = (value) => (value instanceof Date ? value.toISOString() : value);
  return {
    async rows(text, params = []) {
      const result = await pool.query(text, params);
      return result.rows.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, iso(v)])));
    },
    end: () => pool.end(),
  };
}

/** The account with this email (case-insensitive), with its password hash and two-factor flag. */
export async function findAccount(db, email) {
  const [row] = await db.rows(
    `select u.id, u.email, u."twoFactorEnabled" as two_factor_enabled, a.password
     from public.auth_users u
     left join public.auth_accounts a on a."userId" = u.id and a."providerId" = 'credential'
     where lower(u.email) = lower($1)`,
    [email],
  );
  return row ?? null;
}

export async function passwordMatches(hash, password) {
  if (!hash) return false;
  if (/^\$2[aby]\$/.test(hash)) return bcrypt.compare(password, hash);
  return verifyPassword({ hash, password });
}

/**
 * Sign in as `email` with its real password and return a short-lived session:
 * `cookie` is a Cookie header value; call `end()` to delete the session.
 * Refuses accounts with an authenticator app (the scripts can't pass it).
 */
export async function signInForScript(db, { email, password, secret, userAgent, minutes = 30 }) {
  if (!secret?.trim()) throw new Error("BETTER_AUTH_SECRET is required to sign the session cookie.");
  const account = await findAccount(db, email);
  if (!account || !(await passwordMatches(account.password, password))) {
    throw new Error(`Sign-in failed for ${email}: wrong password or no password on the account.`);
  }
  if (account.two_factor_enabled) {
    throw new Error(`${email} has an authenticator app enrolled; use an account without one.`);
  }
  const token = randomBytes(24).toString("base64url");
  await db.rows(
    `insert into public.auth_sessions (token, "userId", "expiresAt", "updatedAt", "userAgent")
     values ($1, $2, now() + make_interval(mins => $3), now(), $4)`,
    [token, account.id, minutes, userAgent],
  );
  const signature = createHmac("sha256", secret.trim()).update(token).digest("base64");
  return {
    userId: account.id,
    cookie: `${SESSION_COOKIE}=${encodeURIComponent(`${token}.${signature}`)}`,
    end: () => db.rows("delete from public.auth_sessions where token = $1", [token]),
  };
}

/**
 * Set the password of an existing email + password account (Better Auth's
 * hash) and end its sessions, as a reset does. Returns false when there is
 * no such account.
 */
export async function setAccountPassword(db, email, password) {
  const account = await findAccount(db, email);
  if (!account || account.password == null) return false;
  const hash = await hashPassword(password);
  await db.rows(
    `update public.auth_accounts set password = $2, "updatedAt" = now()
     where "userId" = $1 and "providerId" = 'credential'`,
    [account.id, hash],
  );
  await db.rows(`delete from public.auth_sessions where "userId" = $1`, [account.id]);
  return true;
}
