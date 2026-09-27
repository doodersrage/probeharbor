-- Custom rule alerts get their own cooldown so a rule match can't suppress
-- freeze (threshold) alerts, which previously shared last_alert_sent_at.
alter table public.alert_settings
  add column if not exists last_rule_alert_at timestamptz;

comment on column public.alert_settings.last_rule_alert_at is
  'Last custom alert-rule notification; cooldown for rule alerts only';
