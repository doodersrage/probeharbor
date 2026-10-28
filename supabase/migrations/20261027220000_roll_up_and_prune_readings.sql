-- Daily retention: roll raw readings older than the cutoff into hourly
-- rollups, then delete them, in one transaction.
--
-- Replaces the Worker-side version, which fetched at most 20,000 rows (and
-- PostgREST caps responses at the project's max_rows, 1,000 by default) but
-- then deleted every row older than the cutoff, so readings beyond the cap
-- were lost without a rollup. It also overwrote an existing hour bucket
-- instead of merging into it.
--
-- Here nothing is deleted unless its rollup was written in the same
-- transaction, and buckets merge with the same weighted-average rule as
-- replace_device_sensor (20261013200000).
--
-- Rows with no numeric value (door/leak/text) are deleted without a rollup,
-- as before; door history lives in its own table.

create or replace function public.roll_up_and_prune_readings(p_cutoff timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rolled_up integer;
  v_deleted integer;
begin
  if p_cutoff is null or p_cutoff > now() - interval '1 day' then
    raise exception 'cutoff_too_recent';
  end if;

  insert into public.sensor_reading_rollups as r
    (sensor_id, household_id, bucket_start, avg_num, min_num, max_num, sample_count)
  select
    sensor_id,
    -- All of a sensor's readings share one household; take any.
    (array_agg(household_id))[1],
    date_trunc('hour', recorded_at at time zone 'UTC') at time zone 'UTC',
    avg(value_num),
    min(value_num),
    max(value_num),
    count(*)::integer
  from public.sensor_readings
  where recorded_at < p_cutoff
    and value_num is not null
  group by sensor_id, date_trunc('hour', recorded_at at time zone 'UTC')
  on conflict (sensor_id, bucket_start) do update set
    avg_num = case
      when r.sample_count + excluded.sample_count = 0 then coalesce(r.avg_num, excluded.avg_num)
      else (coalesce(r.avg_num, 0) * r.sample_count + coalesce(excluded.avg_num, 0) * excluded.sample_count)
        / (r.sample_count + excluded.sample_count)
    end,
    min_num = least(r.min_num, excluded.min_num),
    max_num = greatest(r.max_num, excluded.max_num),
    sample_count = r.sample_count + excluded.sample_count;
  get diagnostics v_rolled_up = row_count;

  delete from public.sensor_readings where recorded_at < p_cutoff;
  get diagnostics v_deleted = row_count;

  return jsonb_build_object('rolled_up', v_rolled_up, 'deleted', v_deleted);
end;
$$;

revoke all on function public.roll_up_and_prune_readings(timestamptz) from public, anon, authenticated;
grant execute on function public.roll_up_and_prune_readings(timestamptz) to service_role;
