import { getSettings } from "@/lib/queries";

export default async function HowItWorksPage() {
  const settings = await getSettings();
  const steps = [
    ["Elige", "Explora el catálogo o envíanos una captura, foto o enlace del producto que quieres."],
    ["Cotiza y reserva", "Te enviamos el precio. Reservas con el abono inicial y nos das tus datos."],
    ["Nosotras lo traemos", "Con tu encargo confirmado, hacemos posible traerlo a Colombia."],
    ["¡Llegó!", "Te avisamos cuando tu pedido llegue."],
    ["Completa y recibe", `Pagas el saldo restante y te lo enviamos. ${settings?.delivery_time_text || ""}`],
  ];
  return (
    <section className="max-w-[700px] mx-auto px-[18px] py-8 pb-16">
      <h1 className="serif text-[28px] mb-5">Cómo funciona</h1>
      <div className="flex flex-col gap-3">
        {steps.map(([t, d], i) => (
          <div key={i} className="bg-[#F1E7E2] rounded-2xl p-4">
            <p className="serif text-xl mb-1" style={{ color: "var(--color-primary)" }}>{i + 1}. {t}</p>
            <p className="text-[13px] text-[#5A4448]">{d}</p>
          </div>
        ))}
      </div>
      {settings?.reserve_policy && (
        <p className="text-[12.5px] text-[#5A4448] mt-5 leading-relaxed">{settings.reserve_policy}</p>
      )}
    </section>
  );
}
