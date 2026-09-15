import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/format";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = createServerSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, brand:brands(name), product_images(url, sort_order)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#5A4448]">{products?.length || 0} productos</p>
        <Link href="/admin/products/new" className="text-white rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "var(--color-primary)" }}>
          + Agregar producto
        </Link>
      </div>
      <div className="flex flex-col gap-2.5">
        {(products || []).map((p: any) => {
          const img = [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0];
          return (
            <div key={p.id} className="flex items-center gap-3 bg-white border border-[#F0E4E1] rounded-xl p-2.5">
              <div className="w-[46px] h-[46px] rounded-lg flex-none bg-[#F1DFDE] overflow-hidden">
                {img && <img src={img.url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-[10.5px] text-[#8A6A6F] font-bold">{p.brand?.name}</p>
                <p className="text-[13px] font-medium">{p.name}</p>
                <p className="text-[11px] text-[#8A6A6F]">
                  {formatCOP(p.price)} · {p.available ? "visible" : "oculto"}
                </p>
              </div>
              <Link href={`/admin/products/${p.id}`} className="bg-[#F1E7E2] rounded-lg px-3 py-2 text-xs font-medium">
                Editar
              </Link>
              <DeleteProductButton id={p.id} name={p.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
