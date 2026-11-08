-- 0003: API key scopes, household-level alert snooze, hashed status-page
-- subscription tokens. Additive only: safe to apply before deploying the code
-- that uses it (the code running today ignores these columns).
--
-- Deploy order: apply this, then deploy. 0004 (hash existing tokens, clear
-- the plaintext ones) runs after the deploy.
--
-- Undo (drops the new data):
--   ALTER TABLE public.api_keys DROP CONSTRAINT api_keys_scope_check, DROP COLUMN scope;
--   ALTER TABLE public.households DROP COLUMN alerts_snoozed_until, DROP COLUMN alerts_vacation_until;
--   DROP INDEX public.status_subscriptions_token_hash_key;
--   ALTER TABLE public.status_subscriptions DROP COLUMN token_hash, ALTER COLUMN token SET NOT NULL;

-- API keys: "read" (metrics, readings) or "write" (also create devices, edit
-- sensors, replace the pull setup). Keys that exist today keep full access,
-- as before; new keys are read-only unless the owner picks write.
ALTER TABLE public.api_keys ADD COLUMN scope text DEFAULT 'write' NOT NULL;
ALTER TABLE public.api_keys ALTER COLUMN scope SET DEFAULT 'read';
ALTER TABLE public.api_keys ADD CONSTRAINT api_keys_scope_check CHECK (scope IN ('read', 'write'));

-- Snooze / vacation set for a whole household (its inbound webhook): holds
-- that household's alerts only, not its members' alerts for other households.
ALTER TABLE public.households
    ADD COLUMN alerts_snoozed_until timestamp with time zone,
    ADD COLUMN alerts_vacation_until timestamp with time zone;

-- Status-page subscriptions: look tokens up by SHA-256 hash. The plaintext
-- column becomes nullable here and is cleared by 0004.
ALTER TABLE public.status_subscriptions ADD COLUMN token_hash text;
ALTER TABLE public.status_subscriptions ALTER COLUMN token DROP NOT NULL;
CREATE UNIQUE INDEX status_subscriptions_token_hash_key
    ON public.status_subscriptions (token_hash) WHERE token_hash IS NOT NULL;
