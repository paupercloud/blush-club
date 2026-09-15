import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();
  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Stat label="Productos" value={productCount ?? 0} />
        <Stat label="Pedidos" value={orderCount ?? 0} />
      </div>
      <p className="text-sm text-[#5A4448] mb-3">Accesos rápidos:</p>
      <div className="flex flex-wrap gap-2.5">
        <Link href="/admin/products/new" className="text-white rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "var(--color-primary)" }}>
          + Agregar producto
        </Link>
        <Link href="/admin/settings" className="border rounded-full px-4 py-2 text-xs font-semibold" style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
          Editar diseño y WhatsApp
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#F1E7E2] rounded-2xl p-4">
      <p className="serif text-3xl" style={{ color: "var(--color-primary)" }}>{value}</p>
      <p className="text-xs text-[#8A6A6F]">{label}</p>
    </div>
  );
}
