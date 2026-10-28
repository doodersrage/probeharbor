-- Share links: store a SHA-256 hash of the token instead of the token.
--
-- Additive and non-destructive, like 20261028140000 for status pages:
-- existing rows keep their raw `token` (live links, embeds, Prometheus
-- scrapes and Home Assistant setups keep working, and managers still see the
-- URLs), and get `token_hash` and `token_preview` (last 4 characters, for the
-- masked "share/••••abcd" label). New rows store only the hash and preview;
-- `token` is null. Clearing old raw tokens is a later step that needs the
-- owner's approval.
--
-- Apply BEFORE deploying the code that writes token_hash.
--
-- Rollback (only while no row has a null token):
--   drop index if exists share_links_token_hash_key;
--   alter table public.share_links drop column token_hash, drop column token_preview;
--   alter table public.share_links alter column token set not null;

alter table public.share_links
  add column if not exists token_hash text,
  add column if not exists token_preview text;

update public.share_links
set token_hash = encode(sha256(convert_to(token, 'UTF8')), 'hex'),
    token_preview = right(token, 4)
where token_hash is null and token is not null;

create unique index if not exists share_links_token_hash_key
  on public.share_links (token_hash);

alter table public.share_links
  alter column token drop not null;
