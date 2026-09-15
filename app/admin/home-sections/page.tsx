import { createServerSupabaseClient } from "@/lib/supabase/server";
import HomeSectionsClient from "@/components/admin/HomeSectionsClient";

export default async function AdminHomeSectionsPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: sections }, { data: collections }] = await Promise.all([
    supabase.from("homepage_sections").select("*").order("sort_order"),
    supabase.from("collections").select("*"),
  ]);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Contenido de inicio</h2>
      <p className="text-xs text-[#8A6A6F] mb-4">Agrega, oculta, reordena o elimina las secciones de tu página principal.</p>
      <HomeSectionsClient sections={sections || []} collections={collections || []} />
    </div>
  );
}
