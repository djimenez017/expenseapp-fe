-- Payment apps such as Zelle, Cash App, and Venmo.
-- Run this in the Supabase SQL editor after the earlier migrations.
-- A received transfer increases the app balance. A sent transfer decreases it.

alter type public.expense_kind add value if not exists 'PAYMENT_APP';

create table public.transfers (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  expense_id bigint not null references public.expenses (id) on delete cascade,
  direction text not null,
  amount numeric(12, 2) not null,
  transferred_on date not null default current_date,
  created_at timestamptz not null default now(),
  constraint transfers_direction_ok check (direction in ('SENT', 'RECEIVED')),
  constraint transfers_amount_ok check (amount > 0 and amount <= 9999999999.99)
);

create index transfers_user_id_transferred_on_idx
  on public.transfers (user_id, transferred_on);

create index transfers_expense_id_idx on public.transfers (expense_id);

alter table public.transfers enable row level security;

revoke all on public.transfers from anon, authenticated;
grant select, insert, delete on public.transfers to authenticated;
grant usage, select on sequence public.transfers_id_seq to authenticated;

create policy "Users read their own transfers"
  on public.transfers
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert their own transfers"
  on public.transfers
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.expenses
      where expenses.id = expense_id
        and expenses.user_id = auth.uid()
    )
  );

create policy "Users delete their own transfers"
  on public.transfers
  for delete
  to authenticated
  using (auth.uid() = user_id);
