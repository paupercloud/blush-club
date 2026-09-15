import { createServerSupabaseClient } from "@/lib/supabase/server";
import NavigationClient from "@/components/admin/NavigationClient";

export default async function AdminNavigationPage() {
  const supabase = createServerSupabaseClient();
  const { data: items } = await supabase.from("navigation_items").select("*").order("sort_order");
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Menú</h2>
      <p className="text-xs text-[#8A6A6F] mb-4">Este es el menú que aparece al tocar ☰ en la parte superior de la tienda.</p>
      <NavigationClient items={items || []} />
    </div>
  );
}
