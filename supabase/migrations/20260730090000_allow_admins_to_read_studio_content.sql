-- Studio editors need to see drafts and archived records as well as public
-- content. Keep the public policy narrow; this policy is evaluated only for
-- authenticated users who are present in portfolio_admins.

create policy "Admins read all projects" on public.portfolio_projects
for select to authenticated
using ((select private.is_portfolio_admin()));

create policy "Admins read all timeline entries" on public.portfolio_timeline_entries
for select to authenticated
using ((select private.is_portfolio_admin()));

create policy "Admins read all settings" on public.portfolio_settings
for select to authenticated
using ((select private.is_portfolio_admin()));
