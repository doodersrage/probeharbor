-- 0007: drop public.user_temp_feeds and public.user_temp_probes, the
-- pre-device pull-feed config tables.
--
-- Both were empty in production on 2026-11-13, nothing has written them
-- since devices became the source of truth, and since c85ec80 nothing reads
-- them either (the per-request move into devices is gone). See the
-- "Legacy tables" entries in IMPLEMENTATION_LOG.md.
--
-- Drops each table with its own keys, indexes, identity sequence, RLS
-- setting and foreign key to auth_users. No CASCADE: nothing else depends on
-- them, and if something unexpected did, the drop fails instead.
--
-- Undo: recreate both from 0001_baseline.sql (they held no rows).

DROP TABLE IF EXISTS public.user_temp_probes;
DROP TABLE IF EXISTS public.user_temp_feeds;
