import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProducts({ categorySlug: params.slug });

  const supabase = createServerSupabaseClient();
  const { data: category } = await supabase.from("categories").select("id").eq("slug", params.slug).single();
  const { data: subcats } = category
    ? await supabase.from("subcategories").select("name, sort_order").eq("category_id", category.id).order("sort_order")
    : { data: [] };

  const orderMap: Record<string, number> = {};
  (subcats || []).forEach((s: any, i: number) => {
    orderMap[s.name.toLowerCase()] = s.sort_order ?? i;
  });

  const groups: Record<string, { label: string; items: any[] }> = {};
  for (const p of products) {
    const label = p.subcategory?.trim() || "Otros";
    const key = label.toLowerCase();
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(p);
  }
  const groupKeys = Object.keys(groups).sort((a, b) => {
    if (a === "otros") return 1;
    if (b === "otros") return -1;
    const orderA = orderMap[a] ?? 999;
    const orderB = orderMap[b] ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return groups[a].label.localeCompare(groups[b].label);
  });

  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-1 capitalize">{params.slug.replace(/-/g, " ")}</h1>
      <p className="text-[12.5px] text-[#8A6A6F] mb-4.5">{products.length} productos</p>
      {groupKeys.map((key) => (
        <div key={key} className="mb-7">
          {groupKeys.length > 1 && (
            <h2 className="text-[15px] font-semibold mb-2.5">{groups[key].label}</h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {groups[key].items.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
