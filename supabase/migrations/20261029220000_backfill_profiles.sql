-- Accounts created before the signup trigger have no profile row.
-- expenses.user_id references profiles, so those accounts cannot add an expense.

grant insert on public.profiles to authenticated;

drop policy if exists "Users insert their own profile" on public.profiles;
create policy "Users insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

insert into public.profiles (id, full_name, username, email)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  left(
    coalesce(
      nullif(u.raw_user_meta_data ->> 'username', ''),
      split_part(u.email, '@', 1)
    )
    || case
      when exists (
        select 1
        from public.profiles existing
        where existing.username = coalesce(
          nullif(u.raw_user_meta_data ->> 'username', ''),
          split_part(u.email, '@', 1)
        )
      )
      then '-' || left(u.id::text, 8)
      else ''
    end,
    50
  ),
  u.email
from auth.users u
where u.email is not null
  and not exists (
    select 1 from public.profiles p where p.id = u.id
  );
