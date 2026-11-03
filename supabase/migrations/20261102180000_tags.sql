-- Tags label what an expense or purchase is for.
-- The same tag can sit on a bill and a loan at the same time.
-- Run this in the Supabase SQL editor after the earlier migrations.

create table public.tags (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint tags_name_ok check (
    char_length(name) between 1 and 40
    and name = btrim(name)
    and name !~ '\s{2}'
  )
);

create unique index tags_user_lower_name_idx
  on public.tags (user_id, lower(name));

create table public.expense_tags (
  expense_id bigint not null references public.expenses (id) on delete cascade,
  tag_id bigint not null references public.tags (id) on delete cascade,
  primary key (expense_id, tag_id)
);

create index expense_tags_tag_id_idx on public.expense_tags (tag_id);

create table public.spending_tags (
  spending_id bigint not null references public.spending (id) on delete cascade,
  tag_id bigint not null references public.tags (id) on delete cascade,
  primary key (spending_id, tag_id)
);

create index spending_tags_tag_id_idx on public.spending_tags (tag_id);

alter table public.tags enable row level security;
alter table public.expense_tags enable row level security;
alter table public.spending_tags enable row level security;

revoke all on public.tags from anon, authenticated;
revoke all on public.expense_tags from anon, authenticated;
revoke all on public.spending_tags from anon, authenticated;

grant select, insert on public.tags to authenticated;
grant select, insert, delete on public.expense_tags to authenticated;
grant select, insert, delete on public.spending_tags to authenticated;
grant usage, select on sequence public.tags_id_seq to authenticated;

create policy "Users read their own tags"
  on public.tags
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert their own tags"
  on public.tags
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users read tags on their expenses"
  on public.expense_tags
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.expenses
      where expenses.id = expense_id
        and expenses.user_id = auth.uid()
    )
  );

create policy "Users insert tags on their expenses"
  on public.expense_tags
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.expenses
      where expenses.id = expense_id
        and expenses.user_id = auth.uid()
    )
    and exists (
      select 1
      from public.tags
      where tags.id = tag_id
        and tags.user_id = auth.uid()
    )
  );

create policy "Users delete tags on their expenses"
  on public.expense_tags
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.expenses
      where expenses.id = expense_id
        and expenses.user_id = auth.uid()
    )
  );

create policy "Users read tags on their spending"
  on public.spending_tags
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.spending
      where spending.id = spending_id
        and spending.user_id = auth.uid()
    )
  );

create policy "Users insert tags on their spending"
  on public.spending_tags
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.spending
      where spending.id = spending_id
        and spending.user_id = auth.uid()
    )
    and exists (
      select 1
      from public.tags
      where tags.id = tag_id
        and tags.user_id = auth.uid()
    )
  );

create policy "Users delete tags on their spending"
  on public.spending_tags
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.spending
      where spending.id = spending_id
        and spending.user_id = auth.uid()
    )
  );

create or replace function public.delete_unused_tag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.tags
  where id = old.tag_id
    and not exists (
      select 1 from public.expense_tags where tag_id = old.tag_id
    )
    and not exists (
      select 1 from public.spending_tags where tag_id = old.tag_id
    );

  return old;
end;
$$;

revoke all on function public.delete_unused_tag() from public, anon, authenticated;

create trigger expense_tags_delete_unused_tag
  after delete on public.expense_tags
  for each row execute function public.delete_unused_tag();

create trigger spending_tags_delete_unused_tag
  after delete on public.spending_tags
  for each row execute function public.delete_unused_tag();
