"use server";

import { getCurrentAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const { isAdmin, supabase } = await getCurrentAdmin();
  if (!isAdmin) throw new Error("No autorizada: se requiere una cuenta de administradora.");
  return supabase;
}

// ---------- Marcas ----------
export async function saveBrand(input: { id?: string; name: string; slug?: string; logo_url: string | null; image_url: string | null; description: string | null; active: boolean }) {
  const supabase = await requireAdmin();
  const payload = { ...input, slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.name) };
  delete (payload as any).id;
  if (input.id) {
    const { error } = await supabase.from("brands").update(payload).eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("brands").insert(payload);
    if (error) throw error;
  }
  revalidatePath("/");
  revalidatePath("/admin/brands");
}
export async function deleteBrand(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/brands");
}

// ---------- Categorías ----------
export async function saveCategory(input: { id?: string; name: string; slug?: string; image_url: string | null; description: string | null; active: boolean; sort_order: number }) {
  const supabase = await requireAdmin();
  const payload = { ...input, slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.name) };
  delete (payload as any).id;
  if (input.id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) throw error;
  }
  revalidatePath("/");
  revalidatePath("/admin/categories");
}
export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/categories");
}
// ---------- Subcategorías ----------
export async function saveSubcategory(input: { id?: string; category_id: string; name: string; sort_order: number }) {
  const supabase = await requireAdmin();
  if (input.id) {
    const { error } = await supabase.from("subcategories").update({ name: input.name, sort_order: input.sort_order }).eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("subcategories").insert({ category_id: input.category_id, name: input.name, sort_order: input.sort_order });
    if (error) throw error;
  }
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
export async function deleteSubcategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("subcategories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
export async function reorderSubcategories(items: { id: string; sort_order: number }[]) {
  const supabase = await requireAdmin();
  for (const item of items) {
    const { error } = await supabase.from("subcategories").update({ sort_order: item.sort_order }).eq("id", item.id);
    if (error) throw error;
  }
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
// ---------- Configuración / identidad ----------
export async function saveSettings(input: Record<string, any>) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").update(input).eq("id", 1);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

// ---------- Menú ----------
export async function saveNavigationItems(items: { id?: string; label: string; href: string; sort_order: number; visible: boolean }[]) {
  const supabase = await requireAdmin();
  for (const item of items) {
    if (item.id) {
      const { error } = await supabase
        .from("navigation_items")
        .update({ label: item.label, href: item.href, sort_order: item.sort_order, visible: item.visible })
        .eq("id", item.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("navigation_items").insert(item);
      if (error) throw error;
    }
  }
  revalidatePath("/");
  revalidatePath("/admin/navigation");
}
export async function deleteNavigationItem(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/navigation");
}

// ---------- Secciones de inicio ----------
export async function saveHomepageSection(input: { id?: string; type: string; title: string | null; subtitle: string | null; config: Record<string, any>; visible: boolean; sort_order: number }) {
  const supabase = await requireAdmin();
  if (input.id) {
    const { error } = await supabase.from("homepage_sections").update(input).eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("homepage_sections").insert(input);
    if (error) throw error;
  }
  revalidatePath("/");
  revalidatePath("/admin/home-sections");
}
export async function deleteHomepageSection(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/home-sections");
}
