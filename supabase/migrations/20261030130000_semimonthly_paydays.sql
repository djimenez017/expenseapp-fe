-- Twice-a-month pay uses two days of the month, such as the 5th and the 20th.
-- Run this in the Supabase SQL editor.

alter table public.paychecks
  add column if not exists payday_one smallint,
  add column if not exists payday_two smallint;

alter table public.paychecks
  drop constraint if exists paychecks_payday_one_range;

alter table public.paychecks
  drop constraint if exists paychecks_payday_two_range;

alter table public.paychecks
  add constraint paychecks_payday_one_range
    check (payday_one is null or payday_one between 1 and 31);

alter table public.paychecks
  add constraint paychecks_payday_two_range
    check (payday_two is null or payday_two between 1 and 31);
