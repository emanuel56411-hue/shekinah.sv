-- Ampliar publicaciones del pastor: oración, foto, video + media.
-- Ejecutar en el SQL Editor de Supabase (después de supabase-pastor-posts.sql).

alter table public.pastor_posts
  drop constraint if exists pastor_posts_type_check;

alter table public.pastor_posts
  add constraint pastor_posts_type_check check (
    post_type in ('versiculo', 'anuncio', 'mensaje', 'oracion', 'foto', 'video')
  );

alter table public.pastor_posts
  add column if not exists media_url text;

alter table public.pastor_posts
  add column if not exists media_kind text not null default 'none';

alter table public.pastor_posts
  drop constraint if exists pastor_posts_media_kind_check;

alter table public.pastor_posts
  add constraint pastor_posts_media_kind_check check (
    media_kind in ('none', 'image', 'video')
  );

alter table public.pastor_posts
  drop constraint if exists pastor_posts_content_check;

alter table public.pastor_posts
  add constraint pastor_posts_content_check check (
    char_length(trim(content)) <= 4000
    and (
      char_length(trim(content)) >= 1
      or (
        media_url is not null
        and char_length(trim(media_url)) between 1 and 2000
        and media_kind in ('image', 'video')
      )
    )
  );

alter table public.pastor_posts
  drop constraint if exists pastor_posts_media_url_check;

alter table public.pastor_posts
  add constraint pastor_posts_media_url_check check (
    media_url is null
    or char_length(trim(media_url)) between 1 and 2000
  );

drop view if exists public.public_pastor_posts;

create view public.public_pastor_posts
with (security_invoker = true)
as
select
  id,
  content,
  post_type,
  reference,
  media_url,
  media_kind,
  published_at
from public.pastor_posts
where is_active = true;

grant select on public.public_pastor_posts to anon, authenticated;

drop function if exists public.create_pastor_post(text, text, text, text, boolean, timestamptz);
drop function if exists public.update_pastor_post(text, uuid, text, text, text, boolean, timestamptz);
drop function if exists public.list_pastor_posts_admin(text);

create or replace function public.list_pastor_posts_admin(p_token text)
returns table (
  id uuid,
  content text,
  post_type text,
  reference text,
  media_url text,
  media_kind text,
  is_active boolean,
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.content,
    p.post_type,
    p.reference,
    p.media_url,
    p.media_kind,
    p.is_active,
    p.published_at,
    p.created_at,
    p.updated_at
  from public.pastor_posts p
  order by p.published_at desc, p.created_at desc;
end;
$$;

create or replace function public.create_pastor_post(
  p_token text,
  p_content text,
  p_post_type text default 'mensaje',
  p_reference text default null,
  p_is_active boolean default true,
  p_published_at timestamptz default now(),
  p_media_url text default null,
  p_media_kind text default 'none'
)
returns public.pastor_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  created public.pastor_posts;
  kind text := coalesce(nullif(trim(p_media_kind), ''), 'none');
  url text := nullif(trim(coalesce(p_media_url, '')), '');
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  if kind = 'none' then
    url := null;
  end if;

  insert into public.pastor_posts (
    content,
    post_type,
    reference,
    is_active,
    published_at,
    media_url,
    media_kind
  )
  values (
    trim(coalesce(p_content, '')),
    p_post_type,
    nullif(trim(coalesce(p_reference, '')), ''),
    coalesce(p_is_active, true),
    coalesce(p_published_at, now()),
    url,
    kind
  )
  returning * into created;

  return created;
end;
$$;

create or replace function public.update_pastor_post(
  p_token text,
  p_id uuid,
  p_content text,
  p_post_type text,
  p_reference text default null,
  p_is_active boolean default true,
  p_published_at timestamptz default null,
  p_media_url text default null,
  p_media_kind text default 'none'
)
returns public.pastor_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  updated public.pastor_posts;
  kind text := coalesce(nullif(trim(p_media_kind), ''), 'none');
  url text := nullif(trim(coalesce(p_media_url, '')), '');
begin
  if not public.pastor_admin_ok(p_token) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  if kind = 'none' then
    url := null;
  end if;

  update public.pastor_posts
  set
    content = trim(coalesce(p_content, '')),
    post_type = p_post_type,
    reference = nullif(trim(coalesce(p_reference, '')), ''),
    is_active = coalesce(p_is_active, true),
    published_at = coalesce(p_published_at, published_at),
    media_url = url,
    media_kind = kind
  where id = p_id
  returning * into updated;

  if updated.id is null then
    raise exception 'not_found' using errcode = 'P0002';
  end if;

  return updated;
end;
$$;

revoke all on function public.create_pastor_post(text, text, text, text, boolean, timestamptz, text, text) from public;
revoke all on function public.update_pastor_post(text, uuid, text, text, text, boolean, timestamptz, text, text) from public;
revoke all on function public.list_pastor_posts_admin(text) from public;

grant execute on function public.create_pastor_post(text, text, text, text, boolean, timestamptz, text, text) to anon, authenticated;
grant execute on function public.update_pastor_post(text, uuid, text, text, text, boolean, timestamptz, text, text) to anon, authenticated;
grant execute on function public.list_pastor_posts_admin(text) to anon, authenticated;

-- Storage: bucket público para fotos del pastor (máx. 5 MB, solo imágenes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pastor-media',
  'pastor-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read pastor media" on storage.objects;
drop policy if exists "Anon upload pastor media" on storage.objects;
drop policy if exists "Anon update pastor media" on storage.objects;
drop policy if exists "Anon delete pastor media" on storage.objects;

create policy "Public read pastor media"
on storage.objects
for select
to public
using (bucket_id = 'pastor-media');

create policy "Anon upload pastor media"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'pastor-media'
  and (storage.foldername(name))[1] = 'posts'
);

create policy "Anon update pastor media"
on storage.objects
for update
to anon, authenticated
using (
  bucket_id = 'pastor-media'
  and (storage.foldername(name))[1] = 'posts'
)
with check (
  bucket_id = 'pastor-media'
  and (storage.foldername(name))[1] = 'posts'
);

create policy "Anon delete pastor media"
on storage.objects
for delete
to anon, authenticated
using (
  bucket_id = 'pastor-media'
  and (storage.foldername(name))[1] = 'posts'
);
