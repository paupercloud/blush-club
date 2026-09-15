-- =========================================================
-- BLUSH CLUB — esquema de base de datos
-- Ejecutar en Supabase → SQL Editor, en este orden:
-- 01_schema.sql → 02_policies.sql → 03_storage.sql → 04_seed.sql
-- =========================================================

create extension if not exists "pgcrypto";

-- Perfiles de usuario (rol de administrador)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  image_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  description text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Etiquetas / colecciones (viral, bestseller, new, trending, destacado, oferta...)
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  subcategory text,
  name text not null,
  slug text unique not null,
  sku text,
  description text,
  benefits text,
  ingredients text,
  content text,
  price numeric not null default 0,
  prev_price numeric,
  available boolean not null default true,
  immediate_delivery boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_collections (
  product_id uuid references products(id) on delete cascade,
  collection_id uuid references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  code text,
  swatch_color text not null default '#D8B7BD',
  image_url text,
  available boolean not null default true,
  sort_order int not null default 0
);

create table if not exists navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  visible boolean not null default true
);

-- Secciones editables de la página de inicio
create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('hero','products','categories','brands','banner','text')),
  title text,
  subtitle text,
  config jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  sort_order int not null default 0
);

-- Fila única de configuración/identidad de la tienda
create table if not exists site_settings (
  id int primary key default 1,
  store_name text not null default 'BLUSH CLUB',
  tagline text not null default 'tu nuevo espacio favorito de belleza',
  logo_url text,
  logo_mobile_url text,
  favicon_url text,
  color_primary text not null default '#6E2A3A',
  color_secondary text not null default '#C98A93',
  color_accent text not null default '#B08D57',
  color_background text not null default '#FAF6F2',
  color_text text not null default '#2B2024',
  border_radius text not null default '16px',
  whatsapp text not null default '',
  instagram text not null default '',
  email text not null default '',
  deposit_percent int not null default 50,
  delivery_time_text text not null default '25–35 días hábiles aprox.',
  reserve_policy text not null default 'Para reservar se realiza un abono inicial del 50%. El 50% restante se paga cuando el producto llega a Medellín.',
  shipping_info text not null default '',
  seo_description text not null default '',
  constraint single_row check (id = 1)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  customer_city text,
  status text not null default 'pendiente' check (status in
    ('pendiente','abono_recibido','en_camino','recibido','pago_completo','enviado','completado')),
  total numeric not null default 0,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  variant_name text,
  quantity int not null default 1,
  unit_price numeric not null default 0,
  subtotal numeric not null default 0
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

insert into collections (key, label) values
  ('viral','Viral'), ('bestseller','Bestseller'), ('new','Nuevo'),
  ('trending','Trending'), ('destacado','Destacado'), ('oferta','Oferta')
on conflict (key) do nothing;
