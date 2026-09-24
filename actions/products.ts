"use server";

import { createServerSupabaseClient, getCurrentAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";

// Cada función vuelve a comprobar isAdmin antes de tocar la base de datos.
// Aunque alguien manipulara el formulario del navegador, la base de datos
// (RLS) rechazaría igual el INSERT/UPDATE/DELETE si no es tu cuenta admin.
async function requireAdmin() {
  const { isAdmin, supabase } = await getCurrentAdmin();
  if (!isAdmin) throw new Error("No autorizada: se requiere una cuenta de administradora.");
  return supabase;
}

export type ProductFormInput = {
  id?: string;
  brand_id: string | null;
  category_id: string | null;
  subcategory: string | null;
  name: string;
  slug?: string;
  sku: string | null;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  content: string | null;
  price: number;
  prev_price: number | null;
  available: boolean;
  immediate_delivery: boolean;
  collection_keys: string[];
  variants: {
    id?: string;
    name: string;
    code: string | null;
    swatch_color: string;
    swatch_type: "color" | "image";
    image_url: string | null;
    available: boolean;
    sort_order: number;
        images: { url: string; sort_order: number; focus?: string }[];
  }[];
    images: { id?: string; url: string; sort_order: number; is_primary: boolean; focus?: string }[];
};

export async function saveProduct(input: ProductFormInput) {
  const supabase = await requireAdmin();
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);

  const payload = {
    brand_id: input.brand_id,
    category_id: input.category_id,
    subcategory: input.subcategory,
    name: input.name,
    slug,
    sku: input.sku,
    description: input.description,
    benefits: input.benefits,
    ingredients: input.ingredients,
    content: input.content,
    price: input.price,
    prev_price: input.prev_price,
    available: input.available,
    immediate_delivery: input.immediate_delivery,
    updated_at: new Date().toISOString(),
  };

  let productId = input.id;
  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) throw error;
    productId = data.id;
  }

  // Colecciones/etiquetas: reemplaza todas
  await supabase.from("product_collections").delete().eq("product_id", productId);
  if (input.collection_keys.length) {
    const { data: cols } = await supabase.from("collections").select("id,key").in("key", input.collection_keys);
    if (cols?.length) {
      await supabase
        .from("product_collections")
        .insert(cols.map((c) => ({ product_id: productId, collection_id: c.id })));
    }
  }

   // Tonos: borra los anteriores (esto borra en cascada las fotos propias de cada tono) y crea de nuevo
  await supabase.from("product_variants").delete().eq("product_id", productId);

  const newVariantIds: string[] = [];
  for (let i = 0; i < input.variants.length; i++) {
    const v = input.variants[i];
    const { data: vRow, error: vErr } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
        name: v.name,
        code: v.code,
        swatch_color: v.swatch_color,
        swatch_type: v.swatch_type,
        image_url: v.image_url,
        available: v.available,
        sort_order: i,
      })
      .select("id")
      .single();
    if (vErr) throw vErr;
    newVariantIds.push(vRow.id);
  }

  // Fotos generales del producto (sin tono asignado)
  await supabase.from("product_images").delete().eq("product_id", productId).is("variant_id", null);
    if (input.images.length) {
    await supabase.from("product_images").insert(
      input.images.map((img, i) => ({
        product_id: productId,
        variant_id: null,
        url: img.url,
        sort_order: i,
        is_primary: i === 0,
        focus: img.focus || "center",
      }))
    );
  }

  // Fotos propias de cada tono
  for (let i = 0; i < input.variants.length; i++) {
    const v = input.variants[i];
    const variantId = newVariantIds[i];
    if (v.images && v.images.length) {
           await supabase.from("product_images").insert(
        v.images.map((img, j) => ({
          product_id: productId,
          variant_id: variantId,
          url: img.url,
          sort_order: j,
          is_primary: j === 0,
          focus: img.focus || "center",
        }))
      );
    }
  }
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/products");
  return { slug };
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}
