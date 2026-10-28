-- Record which signature format each inbound webhook last used ('v2' =
-- timestamped, 'legacy' = body-only HMAC), so the owner can see who must
-- update before timestamps become required. Additive and nullable; the app
-- writes it best effort and works without it.
--
-- Rollback: alter table public.inbound_webhooks drop column last_signature_format;

alter table public.inbound_webhooks
  add column if not exists last_signature_format text;
