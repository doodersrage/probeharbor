-- Averages per time bucket for chart lines, in one call.
--
-- A sensor reporting every minute has ~43,000 readings in 30 days; charts
-- draw ~1,500 points. Reading every row 1,000 at a time (PostgREST's limit)
-- was slow and was capped, so the Overview house-reference line covered only
-- the newest ~7 days. This returns one row per sensor per bucket instead.
--
-- Read-only (stable), one household's rows only, service role only. Uses
-- sensor_readings_sensor_recorded_idx. Buckets are aligned to the epoch
-- (date_bin), so different sensors' buckets line up. Missing buckets are
-- simply absent (no zeros).
--
-- Rollback: drop function public.sensor_bucket_averages(uuid, uuid[], timestamptz, timestamptz, integer);

create or replace function public.sensor_bucket_averages(
  p_household_id uuid,
  p_sensor_ids uuid[],
  p_from timestamptz,
  p_to timestamptz,
  p_bucket_seconds integer
)
returns table (
  sensor_id uuid,
  bucket_start timestamptz,
  avg_num double precision,
  min_num double precision,
  max_num double precision,
  sample_count integer
)
language sql
stable
set search_path = public
as $$
  select r.sensor_id,
         date_bin(make_interval(secs => greatest(p_bucket_seconds, 60)), r.recorded_at, timestamptz 'epoch') as bucket_start,
         avg(r.value_num),
         min(r.value_num),
         max(r.value_num),
         count(*)::integer
  from public.sensor_readings r
  where r.household_id = p_household_id
    and r.sensor_id = any (p_sensor_ids)
    and r.recorded_at >= p_from
    and r.recorded_at <= p_to
    and r.value_num is not null
    -- Bounded work per call.
    and coalesce(cardinality(p_sensor_ids), 0) <= 50
  group by 1, 2
  order by 2, 1;
$$;

revoke all on function public.sensor_bucket_averages(uuid, uuid[], timestamptz, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.sensor_bucket_averages(uuid, uuid[], timestamptz, timestamptz, integer) to service_role;
