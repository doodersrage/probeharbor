/**
 * The signed-in user and session as the app sees them (built from Better
 * Auth in betterAuthSession.ts and from the database in userRecords.ts).
 * Field names follow the shape the app used before the move off Supabase,
 * so pages and helpers read `user.user_metadata`, `session.access_token`, ...
 */
export type UserMetadata = { [key: string]: unknown };

export interface User {
  id: string;
  email?: string;
  aud?: string;
  role?: string;
  created_at: string;
  updated_at?: string;
  /** Set when the address is verified (Better Auth keeps a yes/no; this is the sign-up time then). */
  email_confirmed_at?: string;
  /** user_profiles.metadata: the user's own settings. */
  user_metadata: UserMetadata;
  /** user_profiles.app_metadata: server-set fields (referrals, ...). Never written from user input. */
  app_metadata: UserMetadata;
  two_factor_enabled?: boolean;
}

export interface Session {
  /** The Better Auth session token (cookie value or Bearer token). */
  access_token: string;
  /** Always "": Better Auth sessions aren't refreshed with a separate token. */
  refresh_token: string;
  token_type: string;
  expires_at?: number;
  expires_in: number;
  user: User;
}
