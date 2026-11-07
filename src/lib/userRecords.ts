/**
 * Look up a user by id for server jobs (emails, reports): email, sign-up time,
 * whether the email is confirmed, settings (user_metadata) and server-only
 * fields (app_metadata), from auth_users + user_profiles. Same shape as the
 * Supabase admin user callers (getUserLocale, getUserPreferences, ...) expect.
 */
import type { User } from "./appUser";
import { query } from "./db/client";

export type UserRecord = Pick<User, "id" | "email" | "created_at" | "email_confirmed_at" | "user_metadata" | "app_metadata"> & {
  /** TOTP is on for this account (a Better Auth session then only exists after the code). */
  two_factor_enabled?: boolean;
};

/** null when there is no such user or the lookup failed. */
export async function getUserRecord(userId: string): Promise<UserRecord | null> {
  try {
    const [row] = await query<{
      id: string;
      email: string;
      created_at: string;
      email_verified: boolean;
      two_factor_enabled: boolean | null;
      user_metadata: Record<string, unknown> | null;
      app_metadata: Record<string, unknown> | null;
    }>(
      `select u.id, u.email, u."createdAt" as created_at, u."emailVerified" as email_verified, u."twoFactorEnabled" as two_factor_enabled,
              p.metadata as user_metadata, p.app_metadata
       from public.auth_users u left join public.user_profiles p on p.user_id = u.id
       where u.id = $1`,
      [userId],
    );
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      created_at: row.created_at,
      // Better Auth keeps a yes/no, not a time; callers only check that it's set.
      email_confirmed_at: row.email_verified ? row.created_at : undefined,
      user_metadata: row.user_metadata ?? {},
      app_metadata: row.app_metadata ?? {},
      two_factor_enabled: row.two_factor_enabled === true,
    };
  } catch (error) {
    console.error("getUserRecord failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
