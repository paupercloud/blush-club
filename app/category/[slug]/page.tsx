import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProducts({ categorySlug: params.slug });
  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-1 capitalize">{params.slug.replace(/-/g, " ")}</h1>
      <p className="text-[12.5px] text-[#8A6A6F] mb-4.5">{products.length} productos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
