-- Expense type, one paycheck per user, and one-time spending.
-- Run this in the Supabase SQL editor after the earlier migrations.

create type public.expense_kind as enum ('BILL', 'SUBSCRIPTION', 'LOAN');
create type public.pay_schedule as enum ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY');

alter table public.expenses
  add column kind public.expense_kind not null default 'BILL',
  add column remaining_balance double precision,
  add constraint expenses_remaining_balance_nonnegative
    check (remaining_balance is null or remaining_balance >= 0);

create table public.paychecks (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  amount double precision not null check (amount >= 0),
  schedule public.pay_schedule not null,
  updated_at timestamptz not null default now()
);

create table public.spending (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  amount double precision not null check (amount >= 0),
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index spending_user_id_spent_on_idx on public.spending (user_id, spent_on);

alter table public.paychecks enable row level security;
alter table public.spending enable row level security;

revoke all on public.paychecks from anon, authenticated;
revoke all on public.spending from anon, authenticated;

grant select, insert, update on public.paychecks to authenticated;
grant select, insert, update, delete on public.spending to authenticated;
grant usage, select on sequence public.spending_id_seq to authenticated;

create policy "Users read their own paycheck"
  on public.paychecks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert their own paycheck"
  on public.paychecks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update their own paycheck"
  on public.paychecks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read their own spending"
  on public.spending
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert their own spending"
  on public.spending
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update their own spending"
  on public.spending
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete their own spending"
  on public.spending
  for delete
  to authenticated
  using (auth.uid() = user_id);
