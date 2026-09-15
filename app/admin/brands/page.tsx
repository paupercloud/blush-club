import { createServerSupabaseClient } from "@/lib/supabase/server";
import BrandsClient from "@/components/admin/BrandsClient";

export default async function AdminBrandsPage() {
  const supabase = createServerSupabaseClient();
  const { data: brands } = await supabase.from("brands").select("*").order("name");
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Marcas</h2>
      <BrandsClient brands={brands || []} />
    </div>
  );
}
