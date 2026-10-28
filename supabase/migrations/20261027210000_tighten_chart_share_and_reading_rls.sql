-- Close direct-write paths that bypassed the app's role checks.
--
-- The web app writes these tables only with the service role, which ignores
-- RLS, so nothing in it depends on the policies removed here. They only
-- mattered for direct PostgREST calls made with a user's JWT.

-- chart_share_tokens: an owner could set r2_key to any object in the shared
-- HISTORY_ARCHIVE bucket (including household archives), and
-- /share/chart/[token] serves that object to anyone. Rows are created and
-- read by the server only, so users get no direct access at all.
drop policy if exists "Users manage own chart share tokens" on public.chart_share_tokens;

-- sensor_readings: any member (including viewer / alert_only) could insert
-- readings, which can fire or mask alerts. Reading stays open to members.
drop policy if exists sensor_readings_member_insert on public.sensor_readings;
drop policy if exists sensor_readings_editor_insert on public.sensor_readings;
create policy sensor_readings_editor_insert on public.sensor_readings
  for insert to authenticated
  with check (public.is_household_editor(household_id));

-- device_sensors: any member could rename sensors or change calibration
-- offsets. Members keep read access; writes need an editor role, matching
-- devices_editor_all (20260908120000).
drop policy if exists device_sensors_member_all on public.device_sensors;
drop policy if exists device_sensors_member_select on public.device_sensors;
drop policy if exists device_sensors_editor_write on public.device_sensors;

create policy device_sensors_member_select on public.device_sensors
  for select to authenticated
  using (
    exists (
      select 1 from public.devices d
      where d.id = device_id and public.is_household_member(d.household_id)
    )
  );

create policy device_sensors_editor_write on public.device_sensors
  for all to authenticated
  using (
    exists (
      select 1 from public.devices d
      where d.id = device_id and public.is_household_editor(d.household_id)
    )
  )
  with check (
    exists (
      select 1 from public.devices d
      where d.id = device_id and public.is_household_editor(d.household_id)
    )
  );
