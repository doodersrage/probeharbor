-- Built-in power-off alerts, alert settings history (undo), and the
-- previous time-to-freeze estimate per property ("why did it change?").

-- Power sensors that read "off" alert like a wet leak sensor (on by default).
alter table public.alert_settings
  add column if not exists power_alerts_enabled boolean not null default true,
  add column if not exists last_power_alert_at timestamptz;

-- Each alert settings save keeps the version it replaced (cooldowns and
-- snooze excluded) plus a plain-words list of what changed. Server-only.
create table if not exists public.alert_settings_history (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  settings jsonb not null,
  changes text[] not null default '{}',
  saved_at timestamptz not null default now()
);

create index if not exists alert_settings_history_user_saved_idx
  on public.alert_settings_history (user_id, saved_at desc);

alter table public.alert_settings_history enable row level security;

-- One earlier time-to-freeze estimate per property, replaced at most hourly.
create table if not exists public.freeze_estimate_snapshots (
  household_id uuid primary key references public.households (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.freeze_estimate_snapshots enable row level security;
