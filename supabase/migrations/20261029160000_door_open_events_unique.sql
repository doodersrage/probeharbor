-- Door history: one row per door opening.
--
-- Ingest saves a door's finished opening when it reports "closed", and the
-- rule check saves it too, as a backup. Both check for an existing row
-- before inserting, but two saves at the same moment could both insert, so
-- the same opening could be stored twice. This adds the guard the app's
-- duplicate check assumed: one row per (household, door label, opened_at).
--
-- 1. Copy duplicate rows (all but the earliest-created of each group) into
--    door_open_events_dedupe_backup, then delete them from the table.
-- 2. Add the unique index. The app then inserts with ON CONFLICT DO NOTHING.
--
-- Recovery: deleted rows are kept in door_open_events_dedupe_backup.
--   drop index if exists public.door_open_events_session_key;
--   insert into public.door_open_events select * from public.door_open_events_dedupe_backup;
-- The backup table can be dropped once you're satisfied.

create table if not exists public.door_open_events_dedupe_backup
  (like public.door_open_events including defaults);
alter table public.door_open_events_dedupe_backup enable row level security;
-- No policies: service role only.

with ranked as (
  select id,
         row_number() over (
           partition by household_id, label, opened_at
           order by created_at, id
         ) as rn
  from public.door_open_events
)
insert into public.door_open_events_dedupe_backup
select e.*
from public.door_open_events e
join ranked r on r.id = e.id
where r.rn > 1;

with ranked as (
  select id,
         row_number() over (
           partition by household_id, label, opened_at
           order by created_at, id
         ) as rn
  from public.door_open_events
)
delete from public.door_open_events e
using ranked r
where r.id = e.id and r.rn > 1;

create unique index if not exists door_open_events_session_key
  on public.door_open_events (household_id, label, opened_at);
