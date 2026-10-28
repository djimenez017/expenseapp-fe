-- Empty schema for the expense app. Run this in the Supabase SQL editor.
-- Auth lives in auth.users. Profiles and expenses are created here.
-- The old Category table is not included; the UI never used it.

create type public.frequency as enum ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  username text not null unique,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  amount double precision not null,
  frequency public.frequency not null,
  date_due timestamptz not null,
  created_at timestamptz not null default now()
);

create index expenses_user_id_idx on public.expenses (user_id);

alter table public.profiles enable row level security;
alter table public.expenses enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.expenses from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.expenses to authenticated;
grant usage, select on sequence public.expenses_id_seq to authenticated;

create policy "Users read their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users read their own expenses"
  on public.expenses
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert their own expenses"
  on public.expenses
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update their own expenses"
  on public.expenses
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete their own expenses"
  on public.expenses
  for delete
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
