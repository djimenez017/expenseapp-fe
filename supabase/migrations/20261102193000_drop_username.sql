-- Username is unused. Sign-in is the email address, and the app shows the full name.
-- Run this in the Supabase SQL editor after the earlier migrations.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles drop column username;
