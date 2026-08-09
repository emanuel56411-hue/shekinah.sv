-- Galería administrable del sitio.
-- Ejecutar en Supabase SQL Editor después de supabase-pastor-posts.sql.

create extension if not exists pgcrypto;

create table if not exists public.site_gallery_items (
  id text primary key default gen_random_uuid()::text,
  image_url text not null check (char_length(trim(image_url)) between 1 and 2000),
  title text not null check (char_length(trim(title)) between 1 and 140),
  tag text not null default '',
  alt text not null default '',
  width integer,
  height integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_gallery_items enable row level security;

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
order by sort_order asc, created_at asc;

grant select on public.public_site_gallery_items to anon, authenticated;

insert into public.site_gallery_items (id, image_url, title, tag, alt, width, height, sort_order)
values
  (
    'gallery-congregacion-culto',
    '/assets/fotos/congregacion-culto-opt.webp',
    'Congregación en culto',
    'Culto',
    'Congregación reunida durante un culto',
    1080,
    732,
    10
  ),
  (
    'gallery-ministerio-ninos',
    '/assets/fotos/ministerio-ninos-opt.webp',
    'Ministerio de niños',
    'Niñez',
    'Niños participando en actividad de la iglesia',
    1280,
    576,
    20
  ),
  (
    'gallery-aniversario-shekinah',
    '/assets/fotos/aniversario-shekinah-opt.webp',
    'Aniversario Shekinah',
    'Celebración',
    'Celebración de aniversario de Iglesia Bautista Shekinah',
    1200,
    1600,
    30
  ),
  (
    'gallery-liderazgo-pastoral',
    '/assets/fotos/liderazgo-pastoral-opt.webp',
    'Liderazgo pastoral',
    'Familia',
    'Liderazgo pastoral de Iglesia Bautista Shekinah',
    1400,
    1184,
    40
  ),
  (
    'gallery-predicacion-shekinah',
    '/assets/fotos/predicacion-shekinah-opt.webp',
    'Predicación',
    'Palabra',
    'Predicación en Iglesia Bautista Shekinah',
    883,
    1600,
    50
  ),
  (
    'gallery-predicacion-horarios',
    '/assets/fotos/predicacion-horarios-opt.webp',
    'Enseñanza bíblica',
    'Palabra',
    'Enseñanza bíblica en Iglesia Bautista Shekinah',
    1300,
    1950,
    60
  ),
  (
    'gallery-presentacion-ninos',
    '/assets/fotos/presentacion-ninos-opt.webp',
    'Presentación de niños',
    'Familia',
    'Niños participando en una presentación bíblica',
    640,
    480,
    70
  )
on conflict (id) do nothing;

create or replace function public.list_site_gallery_items_admin(p_token text)
returns setof public.site_gallery_items
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
  select *
  from public.site_gallery_items
  order by sort_order asc, created_at asc;
end;
$$;

create or replace function public.upsert_site_gallery_item(
  p_token text,
  p_id text,
  p_image_url text,
  p_title text,
  p_tag text,
  p_alt text,
  p_width integer,
  p_height integer,
  p_is_active boolean,
  p_sort_order integer
)
returns public.site_gallery_items
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := coalesce(nullif(p_id, ''), gen_random_uuid()::text);
  v_row public.site_gallery_items;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.site_gallery_items (
    id, image_url, title, tag, alt, width, height, is_active, sort_order, updated_at
  )
  values (
    v_id,
    trim(p_image_url),
    trim(p_title),
    trim(coalesce(p_tag, '')),
    trim(coalesce(p_alt, '')),
    p_width,
    p_height,
    coalesce(p_is_active, true),
    coalesce(p_sort_order, 0),
    now()
  )
  on conflict (id) do update set
    image_url = excluded.image_url,
    title = excluded.title,
    tag = excluded.tag,
    alt = excluded.alt,
    width = excluded.width,
    height = excluded.height,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.delete_site_gallery_item(p_token text, p_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_image_url text;
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  delete from public.site_gallery_items
  where id = p_id
  returning image_url into v_image_url;

  return v_image_url;
end;
$$;

grant execute on function public.list_site_gallery_items_admin(text) to anon, authenticated;
grant execute on function public.upsert_site_gallery_item(text, text, text, text, text, text, integer, integer, boolean, integer) to anon, authenticated;
grant execute on function public.delete_site_gallery_item(text, text) to anon, authenticated;
