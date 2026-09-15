import { getSettings } from "@/lib/queries";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <section className="max-w-[500px] mx-auto px-[18px] py-8 pb-16">
      <h1 className="serif text-[28px] mb-4">Contacto</h1>
      <div className="flex flex-col gap-2 text-[13px] text-[#5A4448]">
        {settings?.whatsapp && (
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp: +{settings.whatsapp}
          </a>
        )}
        {settings?.instagram && (
          <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer">
            Instagram: @{settings.instagram}
          </a>
        )}
        {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
      </div>
    </section>
  );
}
