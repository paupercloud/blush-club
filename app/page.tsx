import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getHomepageSections, getProducts, getCategories, getBrands, getSettings } from "@/lib/queries";
import type { HomepageSection } from "@/lib/types";

export const revalidate = 0;

export default async function HomePage() {
  const [sections, settings] = await Promise.all([getHomepageSections(), getSettings()]);

  return (
    <div>
      {sections.map((s: HomepageSection) => (
        <SectionRenderer key={s.id} section={s} />
      ))}
      {sections.length === 0 && (
        <div className="max-w-[1100px] mx-auto px-[18px] py-16 text-center text-sm text-[#8A6A6F]">
          Aún no hay secciones configuradas. Ve a /admin → Contenido → Inicio para agregar la primera.
        </div>
      )}
    </div>
  );
}

async function SectionRenderer({ section }: { section: HomepageSection }) {
  if (section.type === "hero") {
    return (
      <section
        className="px-[18px] py-14 text-white"
        style={{ background: `linear-gradient(135deg,var(--color-primary),#8A4655)` }}
      >
        <div className="max-w-[1100px] mx-auto">
          <p className="serif text-[15px] tracking-wide opacity-85 mb-1.5">{section.subtitle}</p>
          <h1 className="serif text-[40px] leading-[1.1] mb-3.5 max-w-[480px]">{section.title}</h1>
          {section.config?.button_text && (
            <Link
              href={section.config.button_link || "/shop"}
              className="inline-block bg-white text-[13px] font-semibold px-5 py-3 rounded-full"
              style={{ color: "var(--color-primary)" }}
            >
              {section.config.button_text}
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "categories") {
    const categories = await getCategories();
    return (
      <Wrap title={section.title}>
        <div className="flex gap-3 overflow-x-auto pb-1.5">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="flex-none w-[120px] text-center">
              <div className="w-[120px] h-[120px] rounded-2xl mb-2 bg-cover bg-center" style={{ background: c.image_url ? `url(${c.image_url}) center/cover` : "linear-gradient(145deg,#F1DFDE,#D8B7BD)" }} />
              <span className="text-xs font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </Wrap>
    );
  }

  if (section.type === "products") {
    const products = await getProducts({ collectionKey: section.config?.collection_key });
    if (products.length === 0) return null;
    return (
      <Wrap title={section.title} subtitle={section.subtitle}>
        <div className="flex gap-3.5 overflow-x-auto pb-2">
          {products.map((p: any) => (
            <div key={p.id} className="flex-none w-[180px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Wrap>
    );
  }

  if (section.type === "brands") {
    const brands = await getBrands();
    return (
      <Wrap title={section.title}>
        <div className="flex gap-2.5 flex-wrap">
          {brands.map((b) => (
            <Link key={b.id} href={`/brand/${b.slug}`} className="border rounded-full px-4 py-2 text-xs font-semibold tracking-wide" style={{ borderColor: "var(--color-secondary)" }}>
              {b.name}
            </Link>
          ))}
        </div>
      </Wrap>
    );
  }

  if (section.type === "text") {
    return (
      <Wrap title={section.title}>
        <p className="text-[13px] text-[#5A4448] max-w-[520px] whitespace-pre-line">{section.subtitle}</p>
      </Wrap>
    );
  }

  if (section.type === "banner") {
    return (
      <Wrap title={section.title}>
        <div
          className="rounded-2xl p-8 text-white bg-cover bg-center"
          style={{ background: section.config?.image_url ? `url(${section.config.image_url}) center/cover` : "linear-gradient(145deg,#D8B7BD,var(--color-primary))" }}
        >
          <p className="serif text-2xl mb-1">{section.title}</p>
          <p className="text-sm opacity-90">{section.subtitle}</p>
        </div>
      </Wrap>
    );
  }

  return null;
}

function Wrap({ title, subtitle, children }: { title?: string | null; subtitle?: string | null; children: React.ReactNode }) {
  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-7">
      {title && (
        <div className="mb-4">
          <h2 className="serif text-2xl">{title}</h2>
          {subtitle && <p className="text-[12.5px] text-[#8A6A6F]">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
