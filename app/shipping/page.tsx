import { getSettings } from "@/lib/queries";

export default async function ShippingPage() {
  const settings = await getSettings();
  return (
    <section className="max-w-[700px] mx-auto px-[18px] py-8 pb-16">
      <h1 className="serif text-[28px] mb-4">Envíos</h1>
      <p className="text-[13px] text-[#5A4448] leading-relaxed whitespace-pre-line">
        {settings?.shipping_info || "Información de envíos pendiente de configurar desde /admin → Diseño y configuración."}
      </p>
    </section>
  );
}
