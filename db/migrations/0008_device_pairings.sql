-- 0008: pairing codes for probes (design: IMPLEMENTATION_LOG.md,
-- "Pairing codes").
--
-- A signed-in editor asks for a code for a push device; the probe sends the
-- code (typed into its setup portal or /flash instead of the long device
-- key) to POST /api/pair/claim, which gives it a fresh device key once.
-- Only the code's SHA-256 is stored. A code is single-use (used_at) and
-- expires (expires_at, 30 minutes); making a new code for a device replaces
-- any unused one.
--
-- Additive only: a new table, nothing existing changes. Safe to apply before
-- or after deploying the code that uses it (the API answers 503 until it
-- exists).
--
-- Undo:
--   DROP TABLE public.device_pairings;

CREATE TABLE public.device_pairings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    code_hash text NOT NULL UNIQUE,
    household_id uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
    device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    created_by uuid REFERENCES public.auth_users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    used_chip text,
    CONSTRAINT device_pairings_code_hash CHECK (code_hash ~ '^[0-9a-f]{64}$'),
    CONSTRAINT device_pairings_used_chip CHECK (used_chip IS NULL OR used_chip ~ '^[A-Za-z0-9:._-]{1,64}$')
);

CREATE INDEX device_pairings_device_id ON public.device_pairings (device_id);
CREATE INDEX device_pairings_household_id ON public.device_pairings (household_id);

-- As every table: RLS on with no policies; the app connects as the owner
-- and checks household access in code.
ALTER TABLE public.device_pairings ENABLE ROW LEVEL SECURITY;
