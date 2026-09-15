import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para componentes de cliente ("use client").
// Usa la anon key: es pública a propósito, la seguridad real vive
// en las políticas de RLS de la base de datos, no en esta clave.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
