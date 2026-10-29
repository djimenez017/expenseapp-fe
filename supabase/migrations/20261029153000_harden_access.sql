-- Tighten profile updates and expense values. Run after 20261027170000_init.sql.
-- Length limits match components/lib/limits.js.

update public.profiles
set full_name = 'User'
where char_length(btrim(full_name)) < 1;

update public.profiles
set full_name = left(full_name, 120)
where char_length(full_name) > 120;

update public.profiles
set username = left(replace(id::text, '-', ''), 40)
where char_length(btrim(username)) < 1
   or char_length(username) > 40;

update public.expenses
set name = 'Expense'
where char_length(btrim(name)) < 1;

update public.expenses
set name = left(name, 200)
where char_length(name) > 200;

revoke update on table public.profiles from authenticated;
grant update (full_name) on table public.profiles to authenticated;

alter table public.profiles
  drop constraint if exists profiles_full_name_length;

alter table public.profiles
  add constraint profiles_full_name_length
  check (
    char_length(full_name) between 1 and 120
    and char_length(btrim(full_name)) >= 1
  );

alter table public.profiles
  drop constraint if exists profiles_username_length;

alter table public.profiles
  add constraint profiles_username_length
  check (
    char_length(username) between 1 and 40
    and char_length(btrim(username)) >= 1
  );

alter table public.expenses
  drop constraint if exists expenses_name_length;

alter table public.expenses
  add constraint expenses_name_length
  check (
    char_length(name) between 1 and 200
    and char_length(btrim(name)) >= 1
  );

alter table public.expenses
  drop constraint if exists expenses_amount_range;

alter table public.expenses
  add constraint expenses_amount_range
  check (amount > 0 and amount < 1000000000);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_name text;
  next_username text;
begin
  next_name := btrim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  if char_length(next_name) < 1 then
    next_name := 'User';
  end if;

  next_username := btrim(coalesce(new.raw_user_meta_data ->> 'username', ''));
  if char_length(next_username) < 1 then
    next_username := btrim(split_part(coalesce(new.email, ''), '@', 1));
    if char_length(next_username) < 1 then
      next_username := left(replace(new.id::text, '-', ''), 40);
    elsif char_length(next_username) > 40 then
      next_username := left(next_username, 40);
    end if;
  end if;

  insert into public.profiles (id, full_name, username, email)
  values (new.id, next_name, next_username, new.email);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
