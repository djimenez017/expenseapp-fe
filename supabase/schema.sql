-- Expense Tracker schema for Supabase.
-- Run once in the Supabase SQL editor. Then set NEXT_PUBLIC_SUPABASE_URL
-- and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
--
-- Login uses email. Username is display data on profiles.
-- In Authentication → Providers → Email, turn "Confirm email" off if signup
-- should continue straight into the app. With it on, signup asks the user
-- to confirm before a session exists.

create type public.expense_frequency as enum (
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) > 0),
  username text not null unique check (char_length(trim(username)) > 0),
  created_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  amount numeric(12, 2) not null check (amount >= 0),
  frequency public.expense_frequency not null,
  date_due date not null,
  created_at timestamptz not null default now()
);

create index expenses_user_id_idx on public.expenses (user_id);

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.expenses to authenticated;

alter table public.profiles enable row level security;
alter table public.expenses enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "expenses_select_own"
  on public.expenses
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "expenses_insert_own"
  on public.expenses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "expenses_update_own"
  on public.expenses
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "expenses_delete_own"
  on public.expenses
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Signup writes full_name and username into raw_user_meta_data.
-- security definer bypasses RLS so the new user gets a profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    trim(coalesce(new.raw_user_meta_data ->> 'username', ''))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
