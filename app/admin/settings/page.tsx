import { createServerSupabaseClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function AdminSettingsPage() {
  const supabase = createServerSupabaseClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Diseño y configuración</h2>
      <SettingsClient settings={settings as any} />
    </div>
  );
}
