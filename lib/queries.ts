import { createServerSupabaseClient } from "@/lib/supabase/server";

const PRODUCT_SELECT = `
  *,
  brand:brands(*),
  category:categories(*),
  product_images(*),
  product_variants(*),
  product_collections(collections(*))
`;

export async function getProducts(filters?: { collectionKey?: string; categorySlug?: string; brandSlug?: string; q?: string }) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).eq("available", true).order("sort_order");

  if (filters?.categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", filters.categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (filters?.brandSlug) {
    const { data: brand } = await supabase.from("brands").select("id").eq("slug", filters.brandSlug).single();
    if (brand) query = query.eq("brand_id", brand.id);
  }
  if (filters?.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  let products = data || [];

  if (filters?.collectionKey) {
    products = products.filter((p: any) =>
      (p.product_collections || []).some((pc: any) => pc.collections?.key === filters.collectionKey)
    );
  }

  // Ordena fotos y tonos por sort_order
  products.forEach((p: any) => {
    p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order);
    p.product_variants?.sort((a: any, b: any) => a.sort_order - b.sort_order);
  });

  return products;
}

export async function getProductBySlug(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).single();
  if (error) return null;
  data.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order);
  data.product_variants?.sort((a: any, b: any) => a.sort_order - b.sort_order);
  return data;
}

export async function getSettings() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data;
}

export async function getHomepageSections() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("homepage_sections").select("*").eq("visible", true).order("sort_order");
  return data || [];
}

export async function getCategories() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("categories").select("*").eq("active", true).order("sort_order");
  return data || [];
}

export async function getBrands() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("brands").select("*").eq("active", true).order("name");
  return data || [];
}
