import { createServerSupabaseClient } from "@/lib/supabase/server";
import CategoriesClient from "@/components/admin/CategoriesClient";

export default async function AdminCategoriesPage() {
  const supabase = createServerSupabaseClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");
  const { data: subcategories } = await supabase.from("subcategories").select("*").order("sort_order");
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Categorías</h2>
      <CategoriesClient categories={categories || []} subcategories={subcategories || []} />
    </div>
  );
}
