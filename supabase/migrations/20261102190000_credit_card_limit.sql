-- Credit limit for credit cards, used to show utilization.
-- Run this in the Supabase SQL editor after the earlier migrations.

alter table public.expenses
  add column credit_limit double precision,
  add constraint expenses_credit_limit_positive
    check (credit_limit is null or credit_limit > 0),
  add constraint expenses_credit_limit_kind
    check (credit_limit is null or kind = 'CREDIT_CARD');
