-- This event-trigger helper runs as its owner when Postgres creates a table.
-- It is not an application RPC endpoint, so browser roles must not invoke it.
revoke execute on function public.rls_auto_enable() from public;
