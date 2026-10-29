-- Temperature/humidity hourly rollups averaged into wider buckets, in one call.
--
-- Long History ranges (> 90 days) and the prior-year overlay read hourly
-- rollups. Paging them 1000 rows at a time was capped at 20 pages, so a
-- very long range could miss its oldest part. This returns one row per
-- sensor per bucket, weighted by each hour's sample count, with what the
-- chart needs to pair humidity with temperature (key, label, kind, offset,
-- device name).
--
-- Read-only (stable), one household only, service role only. Uses
-- sensor_reading_rollups_household_bucket_idx.
--
-- Rollback: drop function public.rollup_bucket_averages(uuid, timestamptz, timestamptz, integer);

create or replace function public.rollup_bucket_averages(
  p_household_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_bucket_seconds integer
)
returns table (
  sensor_id uuid,
  key text,
  label text,
  kind text,
  offset_num double precision,
  device_name text,
  bucket_start timestamptz,
  avg_num double precision
)
language sql
stable
set search_path = public
as $$
  select r.sensor_id,
         s.key,
         s.label,
         s.kind,
         s.offset_num::double precision,
         d.name,
         date_bin(make_interval(secs => greatest(p_bucket_seconds, 3600)), r.bucket_start, timestamptz 'epoch') as bucket_start,
         sum(r.avg_num * greatest(r.sample_count, 1)) / sum(greatest(r.sample_count, 1)) as avg_num
  from public.sensor_reading_rollups r
  join public.device_sensors s on s.id = r.sensor_id
  join public.devices d on d.id = s.device_id
  where r.household_id = p_household_id
    and r.bucket_start >= p_from
    and r.bucket_start <= p_to
    and r.avg_num is not null
    and s.kind in ('temperature', 'humidity')
  group by r.sensor_id, s.key, s.label, s.kind, s.offset_num, d.name, 7
  order by 7, 1;
$$;

revoke all on function public.rollup_bucket_averages(uuid, timestamptz, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.rollup_bucket_averages(uuid, timestamptz, timestamptz, integer) to service_role;
