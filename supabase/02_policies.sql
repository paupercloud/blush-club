-- =========================================================
-- BLUSH CLUB — Row Level Security
-- Esto es lo que hace que el panel sea seguro de verdad:
-- aunque alguien intente saltarse el frontend y llamar a la
-- base de datos directamente, la base de datos misma rechaza
-- cualquier escritura que no venga de tu cuenta de admin.
-- =========================================================

-- Función auxiliar: ¿el usuario actual es administrador?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- profiles ----------
alter table profiles enable row level security;

create policy "read own profile" on profiles
  for select using (auth.uid() = id);

-- Nadie puede insertarse a sí mismo como admin: el rol se asigna
-- manualmente desde el SQL Editor (ver README, paso "crear tu cuenta").

-- ---------- brands ----------
alter table brands enable row level security;
create policy "public read active brands" on brands for select using (active = true or is_admin());
create policy "admin insert brands" on brands for insert with check (is_admin());
create policy "admin update brands" on brands for update using (is_admin());
create policy "admin delete brands" on brands for delete using (is_admin());

-- ---------- categories ----------
alter table categories enable row level security;
create policy "public read active categories" on categories for select using (active = true or is_admin());
create policy "admin insert categories" on categories for insert with check (is_admin());
create policy "admin update categories" on categories for update using (is_admin());
create policy "admin delete categories" on categories for delete using (is_admin());

-- ---------- collections ----------
alter table collections enable row level security;
create policy "public read collections" on collections for select using (true);
create policy "admin write collections" on collections for insert with check (is_admin());
create policy "admin update collections" on collections for update using (is_admin());
create policy "admin delete collections" on collections for delete using (is_admin());

-- ---------- products ----------
alter table products enable row level security;
create policy "public read available products" on products for select using (available = true or is_admin());
create policy "admin insert products" on products for insert with check (is_admin());
create policy "admin update products" on products for update using (is_admin());
create policy "admin delete products" on products for delete using (is_admin());

-- ---------- product_collections ----------
alter table product_collections enable row level security;
create policy "public read product_collections" on product_collections for select using (true);
create policy "admin write product_collections" on product_collections for insert with check (is_admin());
create policy "admin delete product_collections" on product_collections for delete using (is_admin());

-- ---------- product_images ----------
alter table product_images enable row level security;
create policy "public read product_images" on product_images for select using (true);
create policy "admin insert product_images" on product_images for insert with check (is_admin());
create policy "admin update product_images" on product_images for update using (is_admin());
create policy "admin delete product_images" on product_images for delete using (is_admin());

-- ---------- product_variants ----------
alter table product_variants enable row level security;
create policy "public read product_variants" on product_variants for select using (true);
create policy "admin insert product_variants" on product_variants for insert with check (is_admin());
create policy "admin update product_variants" on product_variants for update using (is_admin());
create policy "admin delete product_variants" on product_variants for delete using (is_admin());

-- ---------- navigation_items ----------
alter table navigation_items enable row level security;
create policy "public read visible nav" on navigation_items for select using (visible = true or is_admin());
create policy "admin insert nav" on navigation_items for insert with check (is_admin());
create policy "admin update nav" on navigation_items for update using (is_admin());
create policy "admin delete nav" on navigation_items for delete using (is_admin());

-- ---------- homepage_sections ----------
alter table homepage_sections enable row level security;
create policy "public read visible sections" on homepage_sections for select using (visible = true or is_admin());
create policy "admin insert sections" on homepage_sections for insert with check (is_admin());
create policy "admin update sections" on homepage_sections for update using (is_admin());
create policy "admin delete sections" on homepage_sections for delete using (is_admin());

-- ---------- site_settings ----------
alter table site_settings enable row level security;
create policy "public read settings" on site_settings for select using (true);
create policy "admin update settings" on site_settings for update using (is_admin());

-- ---------- orders / order_items ----------
alter table orders enable row level security;
alter table order_items enable row level security;
-- Cualquier visitante puede crear un pedido (al reservar), pero solo el admin puede leerlos/editarlos.
create policy "anyone can create an order" on orders for insert with check (true);
create policy "admin read orders" on orders for select using (is_admin());
create policy "admin update orders" on orders for update using (is_admin());
create policy "admin delete orders" on orders for delete using (is_admin());

create policy "anyone can create order items" on order_items for insert with check (true);
create policy "admin read order_items" on order_items for select using (is_admin());
create policy "admin update order_items" on order_items for update using (is_admin());
create policy "admin delete order_items" on order_items for delete using (is_admin());
