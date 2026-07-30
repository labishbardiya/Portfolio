-- The homepage status card is portfolio content, not presentation-only copy.
alter table public.portfolio_settings
  add column current_focus jsonb not null default jsonb_build_object(
    'items', jsonb_build_array(
      'Building products that leave the lab.',
      'Researching agents that work together.',
      'Learning loudly, making carefully.'
    ),
    'caption', 'open tabs / code · care · curiosity'
  );

alter table public.portfolio_settings
  add constraint portfolio_settings_current_focus_is_object
  check (jsonb_typeof(current_focus) = 'object');
