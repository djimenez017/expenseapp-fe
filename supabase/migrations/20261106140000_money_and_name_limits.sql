-- Cap names and store money as fixed-precision amounts.
-- Run this in the Supabase SQL editor after the earlier migrations.

alter table public.profiles
  add constraint profiles_full_name_length
    check (char_length(full_name) <= 80);

alter table public.expenses
  add constraint expenses_name_length
    check (char_length(btrim(name)) between 1 and 120);

alter table public.spending
  add constraint spending_name_length
    check (char_length(btrim(name)) between 1 and 120);

alter table public.expenses
  alter column amount type numeric(12, 2) using round(amount::numeric, 2),
  alter column remaining_balance type numeric(12, 2) using (
    case
      when remaining_balance is null then null
      else round(remaining_balance::numeric, 2)
    end
  ),
  alter column credit_limit type numeric(12, 2) using (
    case
      when credit_limit is null then null
      else round(credit_limit::numeric, 2)
    end
  );

alter table public.expenses
  add constraint expenses_amount_nonnegative check (amount >= 0);

alter table public.paychecks
  alter column amount type numeric(12, 2) using round(amount::numeric, 2);

alter table public.spending
  alter column amount type numeric(12, 2) using round(amount::numeric, 2);
