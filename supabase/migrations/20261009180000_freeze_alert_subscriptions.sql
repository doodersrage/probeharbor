-- Hardware-free freeze alerts: an email the afternoon before a freezing night
-- at a US location, from the same NWS forecast as /pipe-freeze-forecast.
-- Double opt-in; one location per email (re-subscribing moves it).

create table if not exists public.freeze_alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  place_label text not null,
  -- Rounded to ~1 km by the app; never a street address.
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  token text not null unique,
  confirmed_at timestamptz,
  -- Local calendar date of the last night we emailed about, so a night is
  -- alerted once and a cold spell's first freezing night can be detected.
  last_alert_night date,
  created_at timestamptz not null default now()
);

create index if not exists freeze_alert_subscriptions_confirmed_idx
  on public.freeze_alert_subscriptions (confirmed_at)
  where confirmed_at is not null;

-- Server-only: the service role bypasses RLS; no client policies.
alter table public.freeze_alert_subscriptions enable row level security;
