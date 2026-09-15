import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export const revalidate = 0;

export default async function ShopPage({ searchParams }: { searchParams: { q?: string } }) {
  const products = await getProducts({ q: searchParams.q });

  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-1">Tienda</h1>
      <p className="text-[12.5px] text-[#8A6A6F] mb-4.5">
        {searchParams.q ? `Resultados para "${searchParams.q}"` : `${products.length} productos`}
      </p>
      {products.length === 0 ? (
        <p className="text-[13px] text-[#8A6A6F]">No encontramos productos con esa búsqueda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
