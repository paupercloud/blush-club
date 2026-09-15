"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

const SELECT = `*, brand:brands(*), category:categories(*), product_images(*), product_variants(*), product_collections(collections(*))`;

export default function FavoritesPage() {
  const { favs } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (favs.length === 0) {
      setProducts([]);
      return;
    }
    createClient()
      .from("products")
      .select(SELECT)
      .in("id", favs)
      .then(({ data }) => setProducts((data as any) || []));
  }, [favs]);

  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-4.5">Favoritos</h1>
      {products.length === 0 ? (
        <div className="text-center py-12 px-5 bg-[#F1E7E2] rounded-2xl">
          <p className="text-[13px] text-[#5A4448] mb-3.5">Aún no has guardado productos favoritos.</p>
          <Link href="/shop" className="inline-block text-white rounded-full px-5 py-2.5 text-xs" style={{ background: "var(--color-primary)" }}>
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
