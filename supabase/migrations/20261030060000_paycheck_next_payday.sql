-- Next payday anchors which bills come out of the current check.
-- Run this in the Supabase SQL editor after the paycheck tracking migration.

alter table public.paychecks
  add column if not exists next_payday date;
