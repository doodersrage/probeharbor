-- Replace a failed sensor with a new one without losing its history.
--
-- Moves the old sensor's readings, hourly rollups, and door events onto the
-- new sensor, repoints the indoor reference and per-sensor alert thresholds,
-- gives the new sensor the old one's name/order/visibility (rules match by
-- name), then deletes the old sensor row. All in one transaction.
--
-- Calibration offsets are applied at read time, so moved numeric values are
-- shifted by (old offset - new offset): history displays exactly as before
-- and the new probe keeps its own offset.

create or replace function public.replace_device_sensor(
  p_household_id uuid,
  p_old_sensor_id uuid,
  p_new_sensor_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old public.device_sensors%rowtype;
  v_new public.device_sensors%rowtype;
  v_delta double precision;
  v_readings integer;
  v_rollups integer;
begin
  if p_old_sensor_id = p_new_sensor_id then
    raise exception 'same_sensor';
  end if;

  select s.* into v_old
  from public.device_sensors s
  join public.devices d on d.id = s.device_id
  where s.id = p_old_sensor_id and d.household_id = p_household_id
  for update of s;

  select s.* into v_new
  from public.device_sensors s
  join public.devices d on d.id = s.device_id
  where s.id = p_new_sensor_id and d.household_id = p_household_id
  for update of s;

  if v_old.id is null or v_new.id is null then
    raise exception 'sensor_not_found';
  end if;
  if v_old.kind <> v_new.kind then
    raise exception 'kind_mismatch';
  end if;

  v_delta := coalesce(v_old.offset_num, 0) - coalesce(v_new.offset_num, 0);

  update public.sensor_readings
  set sensor_id = v_new.id,
      household_id = p_household_id,
      value_num = case when value_num is null then null else value_num + v_delta end
  where sensor_id = v_old.id;
  get diagnostics v_readings = row_count;

  insert into public.sensor_reading_rollups as r
    (sensor_id, household_id, bucket_start, avg_num, min_num, max_num, sample_count)
  select v_new.id, p_household_id, bucket_start, avg_num + v_delta, min_num + v_delta, max_num + v_delta, sample_count
  from public.sensor_reading_rollups
  where sensor_id = v_old.id
  on conflict (sensor_id, bucket_start) do update set
    avg_num = case
      when r.sample_count + excluded.sample_count = 0 then coalesce(r.avg_num, excluded.avg_num)
      else (coalesce(r.avg_num, 0) * r.sample_count + coalesce(excluded.avg_num, 0) * excluded.sample_count)
        / (r.sample_count + excluded.sample_count)
    end,
    min_num = least(r.min_num, excluded.min_num),
    max_num = greatest(r.max_num, excluded.max_num),
    sample_count = r.sample_count + excluded.sample_count;
  get diagnostics v_rollups = row_count;
  delete from public.sensor_reading_rollups where sensor_id = v_old.id;

  update public.door_open_events set sensor_id = v_new.id where sensor_id = v_old.id;

  update public.households
  set indoor_reference_sensor_id = v_new.id
  where indoor_reference_sensor_id = v_old.id;

  -- Per-sensor thresholds and scope live in jsonb keyed by sensor uuid; uuids
  -- are unique, so a text swap can't touch anything else.
  update public.alert_settings
  set threshold_sensor_scope = replace(threshold_sensor_scope::text, v_old.id::text, v_new.id::text)::jsonb
  where threshold_sensor_scope::text like '%' || v_old.id::text || '%';

  delete from public.device_sensors where id = v_old.id;

  update public.device_sensors
  set label = v_old.label,
      sort_order = v_old.sort_order,
      visible = v_old.visible
  where id = v_new.id;

  return jsonb_build_object('moved_readings', v_readings, 'moved_rollups', v_rollups);
end;
$$;

revoke all on function public.replace_device_sensor(uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.replace_device_sensor(uuid, uuid, uuid) to service_role;
