-- 0005: a least-privilege role for checking pending migrations from CI.
--
-- `migration_reader` can't log in. It may read public.schema_migrations
-- (version, checksum, applied_at) and nothing else: no other table is
-- granted, and RLS (on for every table) still hides every other row from it.
-- CI connects as a separate LOGIN role that is only a member of this one;
-- that role and its password are created by hand per database, never here:
--
--   CREATE ROLE ci_migration_check LOGIN PASSWORD '<random>' IN ROLE migration_reader;
--
-- schema_migrations is normally created by scripts/db-migrate.mjs before the
-- first migration; it's created here too (same definition) for databases built
-- by running the files directly, such as the test database.
--
-- Undo:
--   DROP POLICY migration_reader_select ON public.schema_migrations;
--   REVOKE SELECT ON public.schema_migrations FROM migration_reader;
--   REVOKE USAGE ON SCHEMA public FROM migration_reader;
--   DROP ROLE migration_reader;   -- after dropping the login roles in it

CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version text PRIMARY KEY,
    checksum text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migration_reader') THEN
    CREATE ROLE migration_reader NOLOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO migration_reader;
GRANT SELECT ON public.schema_migrations TO migration_reader;

DROP POLICY IF EXISTS migration_reader_select ON public.schema_migrations;
CREATE POLICY migration_reader_select ON public.schema_migrations
    FOR SELECT TO migration_reader USING (true);
