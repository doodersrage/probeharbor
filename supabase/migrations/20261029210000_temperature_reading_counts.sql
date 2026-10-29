-- True temperature reading counts for History → Exports and the claims pack.
--
-- Both showed the number of chart points as "Readings" / "Total readings"
-- (and "Readings ≤ threshold"). Charts now hold sampled readings, so that
-- number is not how many readings were recorded, which matters in an
-- insurance document.
--
-- total_count: raw readings in [p_from, p_to] plus, for hours already rolled
-- up (raw readings are kept 90 days, then summarised hourly), each hour's
-- recorded sample_count. Raw rows and rollups never overlap, so this is exact.
-- below_count: raw readings at or below p_threshold_f (calibration offset
-- applied), plus rolled-up hours whose highest reading was at or below it.
-- Hours that only dipped below aren't counted, so with rollups this is a
-- minimum; from_rollups says rollups contributed.
--
-- p_sensor_ids limits the count to those temperature sensors (History's
-- device/probe filter); null = every temperature sensor in the household.
-- Read-only, one household, service role only.
-- Rollback: drop function public.temperature_reading_counts(uuid, timestamptz, timestamptz, double precision, uuid[]);

create or replace function public.temperature_reading_counts(
  p_household_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_threshold_f double precision,
  p_sensor_ids uuid[] default null
)
returns table (
  total_count bigint,
  below_count bigint,
  from_rollups boolean
)
language sql
stable
set search_path = public
as $$
  with temp_sensors as (
    select s.id, s.offset_num
    from public.device_sensors s
    join public.devices d on d.id = s.device_id
    where d.household_id = p_household_id
      and s.kind = 'temperature'
      and (p_sensor_ids is null or s.id = any (p_sensor_ids))
  ),
  raw as (
    select count(*) as total,
           count(*) filter (where r.value_num + ts.offset_num <= p_threshold_f) as below
    from public.sensor_readings r
    join temp_sensors ts on ts.id = r.sensor_id
    where r.household_id = p_household_id
      and r.recorded_at >= p_from
      and r.recorded_at <= p_to
      and r.value_num is not null
  ),
  rolled as (
    select coalesce(sum(x.sample_count), 0) as total,
           coalesce(sum(x.sample_count) filter (where x.max_num + ts.offset_num <= p_threshold_f), 0) as below,
           count(*) as hours
    from public.sensor_reading_rollups x
    join temp_sensors ts on ts.id = x.sensor_id
    where x.household_id = p_household_id
      and x.bucket_start >= p_from
      and x.bucket_start <= p_to
  )
  select (raw.total + rolled.total)::bigint,
         (raw.below + rolled.below)::bigint,
         rolled.hours > 0
  from raw, rolled;
$$;

revoke all on function public.temperature_reading_counts(uuid, timestamptz, timestamptz, double precision, uuid[]) from public, anon, authenticated;
grant execute on function public.temperature_reading_counts(uuid, timestamptz, timestamptz, double precision, uuid[]) to service_role;
