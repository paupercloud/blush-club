import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: brand } = await supabase.from("brands").select("*").eq("slug", params.slug).single();
  const products = await getProducts({ brandSlug: params.slug });

  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-1">{brand?.name || params.slug}</h1>
      {brand?.description && <p className="text-[13px] text-[#5A4448] mb-4 max-w-[480px]">{brand.description}</p>}
      <div className="grid grid-cols-2 gap-3.5">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
