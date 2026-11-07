-- 0002: server-only user fields (Supabase app_metadata) next to user_profiles.metadata.
--
-- Supabase kept trusted, server-written fields (referred_by,
-- referral_reward_days) in app_metadata, apart from user_metadata, so a user
-- can't grant themselves trial days. Keep that split: `metadata` holds what
-- was user_metadata, `app_metadata` what was app_metadata. Only server code
-- writes either (no public database API on Neon).
--
-- The step 5 data copy must fill app_metadata from auth.users.raw_app_meta_data.

ALTER TABLE public.user_profiles
    ADD COLUMN app_metadata jsonb DEFAULT '{}'::jsonb NOT NULL;
