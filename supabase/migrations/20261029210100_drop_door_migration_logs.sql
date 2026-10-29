-- Clean up the recovery tables left by today's door-history migrations,
-- at the owner's request (2026-10-29), after checking their results:
--   door_open_events_dedupe_backup   (20261029160000): 0 duplicates removed
--   door_open_events_backfill_log    (20261029160100): 2 openings backfilled
--   door_open_events_start_fix_log   (20261029180100): 0 starts fixed
--
-- After this, those migrations can no longer be undone from these tables.
-- The 2 backfilled openings stay in door_open_events (they match the raw
-- readings); nothing in door_open_events is changed here.

drop table if exists public.door_open_events_dedupe_backup;
drop table if exists public.door_open_events_backfill_log;
drop table if exists public.door_open_events_start_fix_log;
