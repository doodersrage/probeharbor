-- Door history, step 3: temperature and humidity at the moment a door opened
-- and closed, for many doors at once, in one round trip.
--
-- For every (sensor, time) pair, returns that sensor's latest numeric
-- reading at or before the time, if one exists within p_max_age_seconds.
-- Pairs with no such reading return no row (missing, never zero).
--
-- Read-only (stable). Restricted to one household's rows and to the
-- service role, like the other server-side helpers. Uses the existing
-- sensor_readings_sensor_recorded_idx (sensor_id, recorded_at desc).
-- Raw readings are kept 90 days, so older times return nothing.
--
-- Rollback: drop function public.sensor_values_before(uuid, uuid[], timestamptz[], integer);

create or replace function public.sensor_values_before(
  p_household_id uuid,
  p_sensor_ids uuid[],
  p_times timestamptz[],
  p_max_age_seconds integer default 1800
)
returns table (
  sensor_id uuid,
  at_time timestamptz,
  value_num double precision,
  recorded_at timestamptz
)
language sql
stable
set search_path = public
as $$
  select s.sensor_id, t.at_time, r.value_num, r.recorded_at
  from unnest(p_sensor_ids) as s(sensor_id)
  cross join unnest(p_times) as t(at_time)
  join lateral (
    select sr.value_num, sr.recorded_at
    from public.sensor_readings sr
    where sr.sensor_id = s.sensor_id
      and sr.household_id = p_household_id
      and sr.value_num is not null
      and sr.recorded_at <= t.at_time
      and sr.recorded_at >= t.at_time - make_interval(secs => greatest(p_max_age_seconds, 0))
    order by sr.recorded_at desc
    limit 1
  ) r on true
  -- Bounded work per call: callers batch within these limits.
  where coalesce(cardinality(p_sensor_ids), 0) <= 50
    and coalesce(cardinality(p_times), 0) <= 2000;
$$;

revoke all on function public.sensor_values_before(uuid, uuid[], timestamptz[], integer) from public, anon, authenticated;
grant execute on function public.sensor_values_before(uuid, uuid[], timestamptz[], integer) to service_role;
