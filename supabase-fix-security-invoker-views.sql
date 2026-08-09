-- Corrige avisos "Vista del definidor de seguridad" en Supabase.
-- Ejecutar en Supabase SQL Editor si Security Advisor marca estas vistas como CRÍTICO.
-- Es seguro ejecutarlo aunque todavía no hayas instalado la fase de galería.

do $$
begin
  if to_regclass('public.site_schedules') is not null then
    execute $view$
      create or replace view public.public_site_schedules
      with (security_invoker = true)
      as
      select
        id,
        day_of_week,
        day_label,
        title,
        start_time,
        end_time,
        sort_order
      from public.site_schedules
      where is_active = true
      order by sort_order asc, day_of_week asc, start_time asc
    $view$;

    grant select on public.public_site_schedules to anon, authenticated;
  end if;

  if to_regclass('public.site_calendar_events') is not null then
    execute $view$
      create or replace view public.public_site_calendar_events
      with (security_invoker = true)
      as
      select
        id,
        event_date,
        title,
        event_time,
        description,
        sort_order
      from public.site_calendar_events
      where is_active = true
      order by event_date asc, sort_order asc, event_time asc
    $view$;

    grant select on public.public_site_calendar_events to anon, authenticated;
  end if;

  if to_regclass('public.site_gallery_items') is not null then
    execute $view$
      create or replace view public.public_site_gallery_items
      with (security_invoker = true)
      as
      select
        id,
        image_url,
        title,
        tag,
        alt,
        width,
        height,
        sort_order
      from public.site_gallery_items
      where is_active = true
      order by sort_order asc, created_at asc
    $view$;

    grant select on public.public_site_gallery_items to anon, authenticated;
  end if;
end;
$$;
