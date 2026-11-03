-- Lets a signed-in user wipe their own account.
-- Run this in the Supabase SQL editor.
-- Deletes spending, expenses, paycheck, profile, and the auth user.
-- Child rows also cascade when the profile or auth user is removed.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  uid := auth.uid();

  if uid is null then
    raise exception 'Not signed in';
  end if;

  delete from public.spending where user_id = uid;
  delete from public.expenses where user_id = uid;
  delete from public.paychecks where user_id = uid;
  delete from public.profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
