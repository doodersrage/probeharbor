-- 0004: stop storing two link/command secrets in plaintext.
--
--   1. Status-page email subscriptions: hash each remaining raw token into
--      status_subscriptions.token_hash (SHA-256 hex, the form the app looks
--      up) and clear the raw token column.
--   2. Telegram command secret: replace each plaintext
--      alert_settings.telegram_command_secret with 'sha256:' || SHA-256 hex
--      (the form the app stores and matches). Values already in that form are
--      left alone.
--   3. Alert-settings history: the same for the telegram_command_secret key of
--      each alert_settings_history.settings snapshot (JSON object of
--      alert_settings columns), so a restore puts back a hash, not plaintext.
--
-- Deploy order: 0003 (adds token_hash) -> deploy the code that writes and
-- reads the hashed forms (and still accepts plaintext rows) -> this file.
-- Every link and secret keeps working across it: confirm/unsubscribe links
-- already emailed match by hash, and a Telegram webhook's
-- X-Telegram-Bot-Api-Secret-Token matches its hashed row.
-- Safe to re-run: each statement only touches rows still in plaintext.
--
-- No undo: hashing is one-way, so the plaintext can't be restored. Nothing
-- needs it: old links keep working by hash, and a user who has lost their
-- Telegram secret enters a new one in Alerts (and in setWebhook).

UPDATE public.status_subscriptions
   SET token_hash = encode(sha256(convert_to(token, 'UTF8')), 'hex'),
       token = NULL
 WHERE token IS NOT NULL
   AND token_hash IS NULL;

-- A row can have both only if the notifier ran without a link-signing secret
-- (it then issues a fresh hashed token); the raw one goes either way.
UPDATE public.status_subscriptions
   SET token = NULL
 WHERE token IS NOT NULL;

UPDATE public.alert_settings
   SET telegram_command_secret =
       'sha256:' || encode(sha256(convert_to(telegram_command_secret, 'UTF8')), 'hex')
 WHERE telegram_command_secret IS NOT NULL
   AND telegram_command_secret <> ''
   AND telegram_command_secret !~ '^sha256:[0-9a-f]{64}$';

UPDATE public.alert_settings_history
   SET settings = jsonb_set(
         settings,
         '{telegram_command_secret}',
         to_jsonb('sha256:' || encode(sha256(convert_to(settings ->> 'telegram_command_secret', 'UTF8')), 'hex'))
       )
 WHERE jsonb_typeof(settings -> 'telegram_command_secret') = 'string'
   AND settings ->> 'telegram_command_secret' <> ''
   AND settings ->> 'telegram_command_secret' !~ '^sha256:[0-9a-f]{64}$';
