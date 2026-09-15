import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/supabase/server";
import { logoutAction } from "@/actions/auth";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Productos"],
  ["/admin/brands", "Marcas"],
  ["/admin/categories", "Categorías"],
  ["/admin/home-sections", "Inicio"],
  ["/admin/navigation", "Menú"],
  ["/admin/settings", "Diseño y configuración"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getCurrentAdmin();

  if (!user) redirect("/login?next=/admin");

  if (!isAdmin) {
    return (
      <section className="max-w-[420px] mx-auto px-[18px] py-20 text-center">
        <h1 className="serif text-2xl mb-2" style={{ color: "var(--color-primary)" }}>Acceso denegado</h1>
        <p className="text-sm text-[#5A4448] mb-5">
          Tu cuenta inició sesión correctamente, pero no tiene permisos de administradora sobre Blush Club.
        </p>
        <form action={logoutAction}>
          <button className="text-xs underline text-[#8A6A6F]">Cerrar sesión</button>
        </form>
      </section>
    );
  }

  return (
    <section className="max-w-[960px] mx-auto px-[18px] py-6 pb-16">
      <div className="flex items-center justify-between mb-5">
        <h1 className="serif text-2xl" style={{ color: "var(--color-primary)" }}>Panel administrativo</h1>
        <form action={logoutAction}>
          <button className="text-xs text-[#8A6A6F]">Cerrar sesión</button>
        </form>
      </div>
      <nav className="flex gap-4 flex-wrap border-b border-[#EADFDA] mb-6 pb-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="text-[13px] font-medium" style={{ color: "var(--color-primary)" }}>
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </section>
  );
}
