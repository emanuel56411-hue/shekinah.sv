-- Cambia la contraseña del administrador pastoral a: shekinah
-- Ejecutar en Supabase SQL Editor después de supabase-pastor-posts.sql.

insert into public.app_secrets (key, value_hash, updated_at)
values ('pastor_admin', public.pastor_token_hash('shekinah'), now())
on conflict (key) do update
set
  value_hash = excluded.value_hash,
  updated_at = now();
