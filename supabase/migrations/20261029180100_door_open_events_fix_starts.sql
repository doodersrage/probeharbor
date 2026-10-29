-- Door history: correct openings saved with a start that was cut short.
--
-- Before 2026-10-29 the save read a door's readings oldest-first and only
-- 1000 of them, from a 24 h window. A door left open for more than ~17 h
-- could be saved starting at the window edge instead of when it opened.
--
-- For each saved opening, rebuild the real opening from raw door readings
-- (same rule as computeDoorOpenSessions / the backfill). If the real one
-- closed at the same moment but opened earlier, move opened_at back and
-- recompute duration_ms. Skipped when another row already has that start
-- (unique key). Raw readings are kept 90 days, so older rows are left alone.
--
-- Every change is logged in door_open_events_start_fix_log.
-- Recovery:
--   update public.door_open_events e
--   set opened_at = l.old_opened_at, duration_ms = l.old_duration_ms
--   from public.door_open_events_start_fix_log l where l.id = e.id;

create table if not exists public.door_open_events_start_fix_log (
  id uuid primary key,
  old_opened_at timestamptz not null,
  old_duration_ms bigint,
  new_opened_at timestamptz not null,
  fixed_at timestamptz not null default now()
);
alter table public.door_open_events_start_fix_log enable row level security;
-- No policies: service role only.

with door_sensors as (
  select s.id as sensor_id, s.label, d.household_id
  from public.device_sensors s
  join public.devices d on d.id = s.device_id
  where s.kind = 'door'
),
readings as (
  select r.sensor_id, r.recorded_at, r.value_bool,
         lag(r.value_bool) over (partition by r.sensor_id order by r.recorded_at, r.id) as prev
  from public.sensor_readings r
  join door_sensors ds on ds.sensor_id = r.sensor_id
  where r.value_bool is not null
),
changes as (
  select sensor_id, recorded_at, value_bool,
         lead(recorded_at) over (partition by sensor_id order by recorded_at) as next_change_at
  from readings
  where prev is distinct from value_bool
),
openings as (
  select ds.household_id, ds.label, c.recorded_at as opened_at, c.next_change_at as closed_at
  from changes c
  join door_sensors ds on ds.sensor_id = c.sensor_id
  where c.value_bool = true and c.next_change_at is not null
),
fixes as (
  select e.id, e.opened_at as old_opened_at, e.duration_ms as old_duration_ms, o.opened_at as new_opened_at, o.closed_at
  from public.door_open_events e
  join openings o
    on o.household_id = e.household_id
   and o.label = e.label
   and o.closed_at = e.closed_at
   and o.opened_at < e.opened_at
  where not exists (
    select 1 from public.door_open_events x
    where x.household_id = e.household_id and x.label = e.label and x.opened_at = o.opened_at
  )
),
logged as (
  insert into public.door_open_events_start_fix_log (id, old_opened_at, old_duration_ms, new_opened_at)
  select id, old_opened_at, old_duration_ms, new_opened_at from fixes
  on conflict (id) do nothing
  returning id
)
update public.door_open_events e
set opened_at = f.new_opened_at,
    duration_ms = (extract(epoch from (f.closed_at - f.new_opened_at)) * 1000)::bigint
from fixes f
where f.id = e.id
  and e.id in (select id from logged);
