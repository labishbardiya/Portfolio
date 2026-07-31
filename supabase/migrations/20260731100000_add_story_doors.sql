-- Small, optional entry points for personal stories. Public visitors can only
-- read published doors; Studio admins retain the same draft/archive workflow
-- used by projects and writing posts.
create table public.portfolio_story_doors (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  body text not null check (char_length(body) between 1 and 1400),
  position_x numeric(5,2) not null default 88 check (position_x between 0 and 100),
  position_y numeric(5,2) not null default 72 check (position_y between 0 and 100),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_story_doors_public_order
  on public.portfolio_story_doors (status, sort_order, created_at);

create trigger set_portfolio_story_doors_updated_at
before update on public.portfolio_story_doors
for each row execute function public.set_updated_at();

alter table public.portfolio_story_doors enable row level security;

grant select on public.portfolio_story_doors to anon;
grant select, insert, update, delete on public.portfolio_story_doors to authenticated;

create policy "Public reads published story doors" on public.portfolio_story_doors
for select to anon
using (status = 'published');

create policy "Authenticated reads published story doors or admin content" on public.portfolio_story_doors
for select to authenticated
using (status = 'published' or (select private.is_portfolio_admin()));

create policy "Admins insert story doors" on public.portfolio_story_doors
for insert to authenticated
with check ((select private.is_portfolio_admin()));

create policy "Admins update story doors" on public.portfolio_story_doors
for update to authenticated
using ((select private.is_portfolio_admin()))
with check ((select private.is_portfolio_admin()));

create policy "Admins delete story doors" on public.portfolio_story_doors
for delete to authenticated
using ((select private.is_portfolio_admin()));
