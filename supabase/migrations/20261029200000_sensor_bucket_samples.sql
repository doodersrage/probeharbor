-- Chart samples per time bucket: real readings, not averages.
--
-- The History and Overview charts read every raw temperature/humidity row
-- 1000 at a time (~86,000 rows for 30 days of one probe reporting every
-- minute) and then kept 500 evenly spaced readings, which could drop the
-- coldest one. Chart data also feeds freeze hours, "coldest", cold-snap
-- replays, reports and the claims pack, so averages would hide short dips.
--
-- For each sensor and time bucket this returns the first reading, plus the
-- lowest and highest readings for sensors in p_extreme_sensor_ids
-- (temperature). Every row is a measured reading with its own recorded_at,
-- so temperature and humidity from the same post still pair, and dips and
-- spikes survive. A reading that is both first and lowest is returned once.
--
-- Read-only (stable), one household only, service role only.
-- Rollback: drop function public.sensor_bucket_samples(uuid, uuid[], uuid[], timestamptz, timestamptz, integer);

create or replace function public.sensor_bucket_samples(
  p_household_id uuid,
  p_sensor_ids uuid[],
  p_extreme_sensor_ids uuid[],
  p_from timestamptz,
  p_to timestamptz,
  p_bucket_seconds integer
)
returns table (
  sensor_id uuid,
  recorded_at timestamptz,
  value_num double precision
)
language sql
stable
set search_path = public
as $$
  select y.sensor_id, y.recorded_at, y.value_num
  from (
    select x.*,
           row_number() over (partition by x.sensor_id, x.bucket order by x.recorded_at, x.id) as rn_first,
           row_number() over (partition by x.sensor_id, x.bucket order by x.value_num, x.recorded_at, x.id) as rn_min,
           row_number() over (partition by x.sensor_id, x.bucket order by x.value_num desc, x.recorded_at, x.id) as rn_max
    from (
      select r.id, r.sensor_id, r.recorded_at, r.value_num,
             date_bin(make_interval(secs => greatest(p_bucket_seconds, 60)), r.recorded_at, timestamptz 'epoch') as bucket
      from public.sensor_readings r
      where r.household_id = p_household_id
        and r.sensor_id = any (p_sensor_ids)
        and r.recorded_at >= p_from
        and r.recorded_at <= p_to
        and r.value_num is not null
        -- Bounded work per call.
        and coalesce(cardinality(p_sensor_ids), 0) <= 50
    ) x
  ) y
  where y.rn_first = 1
     or ((y.rn_min = 1 or y.rn_max = 1) and y.sensor_id = any (coalesce(p_extreme_sensor_ids, '{}')))
  order by y.recorded_at, y.sensor_id;
$$;

revoke all on function public.sensor_bucket_samples(uuid, uuid[], uuid[], timestamptz, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.sensor_bucket_samples(uuid, uuid[], uuid[], timestamptz, timestamptz, integer) to service_role;
