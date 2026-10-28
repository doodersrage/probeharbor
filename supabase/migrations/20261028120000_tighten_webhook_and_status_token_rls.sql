-- Viewers and alert-only members could read inbound webhook signing secrets
-- and status-page tokens through RLS (any household member had select).
-- The app only manages these as owner/member (canManageHousehold) and reads
-- them with the service role, so limit user-JWT reads to managers, matching
-- share_links and household_invites in 20260908120000.
--
-- Rollback: recreate the *_member_select policies from
-- 20260826160000:66-69 and 20260826180000:41-44.

-- inbound_webhooks: signing_secret is on the row
drop policy if exists inbound_webhooks_member_select on public.inbound_webhooks;
drop policy if exists inbound_webhooks_manager_select on public.inbound_webhooks;

create policy inbound_webhooks_manager_select on public.inbound_webhooks
  for select to authenticated
  using (public.is_household_manager(household_id));

-- status_page_tokens: token grants public read access to the status page
drop policy if exists status_page_tokens_member_select on public.status_page_tokens;
drop policy if exists status_page_tokens_manager_select on public.status_page_tokens;

create policy status_page_tokens_manager_select on public.status_page_tokens
  for select to authenticated
  using (public.is_household_manager(household_id));
