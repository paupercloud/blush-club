import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from("brands").select("*").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Nuevo producto</h2>
      <ProductForm brands={brands || []} categories={categories || []} />
    </div>
  );
}
