-- Latest reading for each of a list of sensors, in one round-trip.
--
-- fetchLatestSensorValues used to send one query per sensor on every ingest
-- POST (Sentry JAVASCRIPT-ASTRO-7, "N+1 API Call"). The lateral join still
-- does one index lookup per sensor on sensor_readings_sensor_recorded_idx
-- (sensor_id, recorded_at desc), but inside Postgres instead of over HTTP.

create or replace function public.latest_sensor_readings(p_sensor_ids uuid[])
returns table (
  sensor_id uuid,
  value_num double precision,
  value_bool boolean,
  value_text text,
  recorded_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select s.id, r.value_num, r.value_bool, r.value_text, r.recorded_at
  from unnest(p_sensor_ids) as s(id)
  cross join lateral (
    select sr.value_num, sr.value_bool, sr.value_text, sr.recorded_at
    from public.sensor_readings sr
    where sr.sensor_id = s.id
    order by sr.recorded_at desc
    limit 1
  ) r;
$$;

revoke all on function public.latest_sensor_readings(uuid[]) from public, anon, authenticated;
grant execute on function public.latest_sensor_readings(uuid[]) to service_role;
