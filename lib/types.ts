export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  image_url: string | null;
  description: string | null;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  active: boolean;
  sort_order: number;
};

export type Collection = { id: string; key: string; label: string };

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  code: string | null;
  swatch_color: string;
  image_url: string | null;
  available: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  brand_id: string | null;
  category_id: string | null;
  subcategory: string | null;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  content: string | null;
  price: number;
  prev_price: number | null;
  available: boolean;
  immediate_delivery: boolean;
  sort_order: number;
  brand?: Brand | null;
  category?: Category | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  product_collections?: { collections: Collection }[];
};

export type SiteSettings = {
  id: number;
  store_name: string;
  tagline: string;
  logo_url: string | null;
  logo_mobile_url: string | null;
  favicon_url: string | null;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_background: string;
  color_text: string;
  border_radius: string;
 whatsapp: string;
  instagram: string;
  email: string;
  logo_width: string;
  header_bg_url: string | null;
  deposit_percent: number;
  delivery_time_text: string;
  reserve_policy: string;
  shipping_info: string;
  seo_description: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  visible: boolean;
};

export type HomepageSection = {
  id: string;
  type: "hero" | "products" | "categories" | "brands" | "banner" | "text";
  title: string | null;
  subtitle: string | null;
  config: Record<string, any>;
  visible: boolean;
  sort_order: number;
};
