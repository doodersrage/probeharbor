-- Door history: fill in openings from the last 90 days of raw readings.
--
-- Until 2026-10-29 door openings were only saved while alert rules were
-- checked, and the read behind it saw only the oldest ~17 h of each day for
-- a device reporting every minute. The raw door readings (kept 90 days)
-- still hold every open/close, so rebuild the openings from them.
--
-- An opening = a reading that says open after one that said closed (or the
-- first reading on record), up to the next reading that says closed. Same
-- rule as computeDoorOpenSessions. Doors still open are skipped (no close
-- yet). Openings that overlap one already saved for the same door are
-- skipped, so nothing is stored twice. The door's current label is used.
--
-- Needs 20261029160000_door_open_events_unique (ON CONFLICT target).
--
-- Every inserted id is logged in door_open_events_backfill_log.
-- Recovery:
--   delete from public.door_open_events
--   where id in (select id from public.door_open_events_backfill_log);

create table if not exists public.door_open_events_backfill_log (
  id uuid primary key,
  logged_at timestamptz not null default now()
);
alter table public.door_open_events_backfill_log enable row level security;
-- No policies: service role only.

with door_sensors as (
  select s.id as sensor_id, s.label, d.household_id
  from public.device_sensors s
  join public.devices d on d.id = s.device_id
  where s.kind = 'door'
),
readings as (
  select r.sensor_id,
         r.recorded_at,
         r.value_bool,
         lag(r.value_bool) over (partition by r.sensor_id order by r.recorded_at, r.id) as prev
  from public.sensor_readings r
  join door_sensors ds on ds.sensor_id = r.sensor_id
  where r.value_bool is not null
),
changes as (
  -- Only the readings where the state changed (the first reading counts).
  select sensor_id,
         recorded_at,
         value_bool,
         lead(recorded_at) over (partition by sensor_id order by recorded_at) as next_change_at
  from readings
  where prev is distinct from value_bool
),
openings as (
  -- Changes alternate, so the change after an "open" is the "close".
  select ds.household_id, c.sensor_id, ds.label,
         c.recorded_at as opened_at,
         c.next_change_at as closed_at
  from changes c
  join door_sensors ds on ds.sensor_id = c.sensor_id
  where c.value_bool = true
    and c.next_change_at is not null
),
inserted as (
  insert into public.door_open_events (household_id, sensor_id, label, opened_at, closed_at, duration_ms)
  select o.household_id, o.sensor_id, o.label, o.opened_at, o.closed_at,
         (extract(epoch from (o.closed_at - o.opened_at)) * 1000)::bigint
  from openings o
  where not exists (
    select 1
    from public.door_open_events e
    where e.household_id = o.household_id
      and e.label = o.label
      and e.opened_at <= o.closed_at
      and coalesce(e.closed_at, 'infinity'::timestamptz) >= o.opened_at
  )
  on conflict (household_id, label, opened_at) do nothing
  returning id
)
insert into public.door_open_events_backfill_log (id)
select id from inserted;
