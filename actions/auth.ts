"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Correo o contraseña incorrectos.")}&next=${encodeURIComponent(next)}`);
  }

  // Verifica que la cuenta tenga rol de administrador.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeURIComponent("Esta cuenta no tiene permisos de administradora.")}`);
  }

  redirect(next || "/admin");
}

export async function logoutAction() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
