-- Follow-up for projects created before the Studio foundation adopted a
-- private schema for SECURITY DEFINER helpers.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_portfolio_admin() from public;
grant execute on function private.is_portfolio_admin() to authenticated;

drop policy "Admins manage projects" on public.portfolio_projects;
drop policy "Admins manage timeline entries" on public.portfolio_timeline_entries;
drop policy "Admins manage settings" on public.portfolio_settings;

create policy "Admins insert projects" on public.portfolio_projects
for insert to authenticated
with check ((select private.is_portfolio_admin()));

create policy "Admins update projects" on public.portfolio_projects
for update to authenticated
using ((select private.is_portfolio_admin()))
with check ((select private.is_portfolio_admin()));

create policy "Admins delete projects" on public.portfolio_projects
for delete to authenticated
using ((select private.is_portfolio_admin()));

create policy "Admins insert timeline entries" on public.portfolio_timeline_entries
for insert to authenticated
with check ((select private.is_portfolio_admin()));

create policy "Admins update timeline entries" on public.portfolio_timeline_entries
for update to authenticated
using ((select private.is_portfolio_admin()))
with check ((select private.is_portfolio_admin()));

create policy "Admins delete timeline entries" on public.portfolio_timeline_entries
for delete to authenticated
using ((select private.is_portfolio_admin()));

create policy "Admins insert settings" on public.portfolio_settings
for insert to authenticated
with check ((select private.is_portfolio_admin()));

create policy "Admins update settings" on public.portfolio_settings
for update to authenticated
using ((select private.is_portfolio_admin()))
with check ((select private.is_portfolio_admin()));

create policy "Admins delete settings" on public.portfolio_settings
for delete to authenticated
using ((select private.is_portfolio_admin()));

revoke all on function public.is_portfolio_admin() from public;
revoke execute on function public.is_portfolio_admin() from anon, authenticated;
drop function public.is_portfolio_admin();
