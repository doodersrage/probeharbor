-- Status-page links: store a SHA-256 hash of the token instead of the token.
--
-- Additive and non-destructive: existing rows keep their raw `token` (so
-- their links and badges keep working and stay visible to managers) and get
-- `token_hash` filled in. New rows store only `token_hash`; `token` is null.
-- Clearing the old raw tokens is a separate, later migration that needs the
-- owner's approval.
--
-- Apply BEFORE deploying the code that writes token_hash.
--
-- Rollback (only while no row has a null token, i.e. before any new status
-- page is created):
--   drop index if exists status_page_tokens_token_hash_key;
--   alter table public.status_page_tokens drop column token_hash;
--   alter table public.status_page_tokens alter column token set not null;

alter table public.status_page_tokens
  add column if not exists token_hash text;

update public.status_page_tokens
set token_hash = encode(sha256(convert_to(token, 'UTF8')), 'hex')
where token_hash is null and token is not null;

create unique index if not exists status_page_tokens_token_hash_key
  on public.status_page_tokens (token_hash);

alter table public.status_page_tokens
  alter column token drop not null;
