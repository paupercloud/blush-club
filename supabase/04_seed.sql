-- =========================================================
-- BLUSH CLUB — datos de prueba (los mismos 3 productos)
-- Ejecutar después de 01, 02 y 03.
-- Las fotos apuntan a imágenes de marcador de posición;
-- reemplázalas subiendo tus fotos reales desde /admin.
-- =========================================================

insert into categories (name, slug, sort_order) values
  ('Labios', 'labios', 1),
  ('Maquillaje', 'maquillaje', 2),
  ('Skincare', 'skincare', 3),
  ('Body Care', 'body-care', 4),
  ('Hair Care', 'hair-care', 5),
  ('Beauty Finds', 'beauty-finds', 6)
on conflict (slug) do nothing;

insert into brands (name, slug) values
  ('TOWER28', 'tower28'),
  ('SUMMER FRIDAYS', 'summer-fridays'),
  ('KIKO MILANO', 'kiko-milano')
on conflict (slug) do nothing;

insert into navigation_items (label, href, sort_order) values
  ('Inicio', '/', 1),
  ('Tienda', '/shop', 2),
  ('Labios', '/category/labios', 3),
  ('Marcas', '/shop', 4),
  ('Cómo funciona', '/how-it-works', 5)
on conflict do nothing;

insert into homepage_sections (type, title, subtitle, config, sort_order) values
  ('hero', 'Tu nuevo espacio favorito de belleza', 'Importados · originales',
    '{"button_text":"Explorar catálogo","button_link":"/shop","image_url":null}', 1),
  ('categories', 'Categorías', null, '{}', 2),
  ('products', 'Más virales', 'Lo que todas están pidiendo', '{"collection_key":"viral"}', 3),
  ('products', 'Bestsellers', null, '{"collection_key":"bestseller"}', 4),
  ('products', 'Novedades', null, '{"collection_key":"new"}', 5),
  ('brands', 'Marcas destacadas', null, '{}', 6)
on conflict do nothing;

-- Producto 1: TOWER28 LipSoftie
with p as (
  insert into products (brand_id, category_id, name, slug, price, description, benefits, ingredients, content, immediate_delivery)
  select b.id, c.id,
    'LipSoftie™ Hydrating Lip Treatment', 'tower28-lipsoftie', 79900,
    'Bálsamo labial hidratante con un ligero toque de color, formulado para nutrir mientras suaviza el labio.',
    'Hidratación duradera · Acabado natural · Fórmula libre de fragancia',
    'Información pendiente de completar desde el panel administrativo.',
    '10 g', true
  from brands b, categories c where b.slug = 'tower28' and c.slug = 'labios'
  returning id
)
insert into product_images (product_id, url, sort_order, is_primary)
select id, v.url, v.ord, v.ord = 0 from p,
  (values ('https://placehold.co/800x800/E9D7CF/6E2A3A?text=LipSoftie', 0),
          ('https://placehold.co/800x800/F1DFDE/6E2A3A?text=LipSoftie+2', 1),
          ('https://placehold.co/800x800/D8B7BD/6E2A3A?text=LipSoftie+3', 2)) as v(url, ord);

insert into product_variants (product_id, name, swatch_color, available, sort_order)
select id, v.name, v.color, true, v.ord from (select id from products where slug = 'tower28-lipsoftie') p,
  (values ('Ube Vanilla', '#E4D3EA', 0), ('Pistachio', '#B8C9A6', 1), ('Sesame', '#C6A06E', 2)) as v(name, color, ord);

insert into product_collections (product_id, collection_id)
select p.id, c.id from products p, collections c
where p.slug = 'tower28-lipsoftie' and c.key in ('viral','bestseller');

-- Producto 2: SUMMER FRIDAYS Lip Butter Balm
with p as (
  insert into products (brand_id, category_id, name, slug, price, description, benefits, ingredients, content, immediate_delivery)
  select b.id, c.id,
    'Lip Butter Balm', 'summer-fridays-lip-butter-balm', 99900,
    'Bálsamo nutritivo de manteca de labios que deja una capa suave y aterciopelada, ideal para el día a día.',
    'Textura tipo manteca · Nutrición profunda · No pegajoso',
    'Información pendiente de completar desde el panel administrativo.',
    '15 g', false
  from brands b, categories c where b.slug = 'summer-fridays' and c.slug = 'labios'
  returning id
)
insert into product_images (product_id, url, sort_order, is_primary)
select id, v.url, v.ord, v.ord = 0 from p,
  (values ('https://placehold.co/800x800/F1DFDE/6E2A3A?text=Lip+Butter', 0),
          ('https://placehold.co/800x800/EFE3D8/6E2A3A?text=Lip+Butter+2', 1)) as v(url, ord);

insert into product_variants (product_id, name, swatch_color, available, sort_order)
select id, v.name, v.color, v.avail, v.ord from (select id from products where slug = 'summer-fridays-lip-butter-balm') p,
  (values ('Vanilla', '#F1E5C6', true, 0), ('Pink Sugar', '#F0BFC6', true, 1), ('Brown Sugar', '#A06B49', false, 2))
  as v(name, color, avail, ord);

insert into product_collections (product_id, collection_id)
select p.id, c.id from products p, collections c
where p.slug = 'summer-fridays-lip-butter-balm' and c.key in ('viral','new');

-- Producto 3: KIKO MILANO 3D Hydra Lipgloss
with p as (
  insert into products (brand_id, category_id, name, slug, price, prev_price, description, benefits, ingredients, content, immediate_delivery)
  select b.id, c.id,
    '3D Hydra Lipgloss', 'kiko-milano-3d-hydra-lipgloss', 59900, 69900,
    'Gloss labial de efecto tridimensional con acabado brillante y sensación hidratante inmediata.',
    'Brillo espejo · Sensación fresca · Aplicador de precisión',
    'Información pendiente de completar desde el panel administrativo.',
    '6.5 ml', true
  from brands b, categories c where b.slug = 'kiko-milano' and c.slug = 'labios'
  returning id
)
insert into product_images (product_id, url, sort_order, is_primary)
select id, v.url, v.ord, v.ord = 0 from p,
  (values ('https://placehold.co/800x800/D8B7BD/6E2A3A?text=Hydra+Gloss', 0),
          ('https://placehold.co/800x800/E9D7CF/6E2A3A?text=Hydra+Gloss+2', 1),
          ('https://placehold.co/800x800/EFE3D8/6E2A3A?text=Hydra+Gloss+3', 2),
          ('https://placehold.co/800x800/F1DFDE/6E2A3A?text=Hydra+Gloss+4', 3)) as v(url, ord);

insert into product_variants (product_id, name, code, swatch_color, available, sort_order)
select id, v.name, v.code, v.color, v.avail, v.ord from (select id from products where slug = 'kiko-milano-3d-hydra-lipgloss') p,
  (values ('01','01','#E7B3B6', true, 0), ('03','03','#CE6B78', true, 1),
          ('17','17','#B81E52', true, 2), ('20','20','#7C2438', false, 3))
  as v(name, code, color, avail, ord);

insert into product_collections (product_id, collection_id)
select p.id, c.id from products p, collections c
where p.slug = 'kiko-milano-3d-hydra-lipgloss' and c.key = 'bestseller';
