-- The platform helper is invoked by its Postgres event trigger, never by the
-- browser. Remove the explicit API-role grants left by its original setup.
revoke execute on function public.rls_auto_enable() from anon, authenticated;
