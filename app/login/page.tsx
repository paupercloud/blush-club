import { loginAction } from "@/actions/auth";

export default function LoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  return (
    <section className="max-w-[380px] mx-auto px-[18px] py-16">
      <h1 className="serif text-[26px] mb-1.5 text-center" style={{ color: "var(--color-primary)" }}>
        Acceso administrativo
      </h1>
      <p className="text-center text-xs text-[#8A6A6F] mb-6">Solo para el equipo de Blush Club.</p>

      {searchParams.error && (
        <div className="bg-[#FBE9E9] text-[#8A2A2A] text-xs rounded-lg px-3 py-2 mb-4">{searchParams.error}</div>
      )}

      <form action={loginAction} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={searchParams.next || "/admin"} />
        <div>
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Correo electrónico</label>
          <input name="email" type="email" required className="w-full border border-[#EADFDA] rounded-lg px-3 py-2.5 text-sm outline-none" />
        </div>
        <div>
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Contraseña</label>
          <input name="password" type="password" required className="w-full border border-[#EADFDA] rounded-lg px-3 py-2.5 text-sm outline-none" />
        </div>
        <button type="submit" className="text-white rounded-full py-3 text-sm font-semibold mt-2" style={{ background: "var(--color-primary)" }}>
          Iniciar sesión
        </button>
      </form>
    </section>
  );
}
