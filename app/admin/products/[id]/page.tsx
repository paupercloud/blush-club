import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const [{ data: product }, { data: brands }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images(*), product_variants(*), product_collections(collections(*))")
      .eq("id", params.id)
      .single(),
    supabase.from("brands").select("*").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Editar producto</h2>
      <ProductForm brands={brands || []} categories={categories || []} initial={product} />
    </div>
  );
}
