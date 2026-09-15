-- =========================================================
-- BLUSH CLUB — Storage (fotos de productos y branding)
-- =========================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

-- Lectura pública (para que las fotos se vean en la tienda)
create policy "public read product-images"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "public read branding"
  on storage.objects for select using (bucket_id = 'branding');

-- Solo el admin puede subir, reemplazar o borrar
create policy "admin upload product-images"
  on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product-images"
  on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product-images"
  on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "admin upload branding"
  on storage.objects for insert with check (bucket_id = 'branding' and public.is_admin());
create policy "admin update branding"
  on storage.objects for update using (bucket_id = 'branding' and public.is_admin());
create policy "admin delete branding"
  on storage.objects for delete using (bucket_id = 'branding' and public.is_admin());
