"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Check } from "lucide-react";
import { formatCOP, buildWhatsAppMessage } from "@/lib/format";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";
import type { Product, SiteSettings } from "@/lib/types";

export default function ProductDetailClient({
  product,
  related,
  settings,
}: {
  product: Product;
  related: Product[];
  settings: SiteSettings | null;
}) {
  const { favs, toggleFav, addToCart } = useCart();
  const isFav = favs.includes(product.id);
    const tones = product.product_variants || [];
  const allImages = product.product_images || [];
  const defaultImages = allImages.filter((img) => !img.variant_id);
  const firstAvailable = tones.findIndex((t) => t.available);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [toneIdx, setToneIdx] = useState(firstAvailable >= 0 ? firstAvailable : 0);
  const [qty, setQty] = useState(1);
  const tone = tones[toneIdx];
  const toneImages = tone ? allImages.filter((img) => img.variant_id === tone.id) : [];
  const photos = toneImages.length > 0 ? toneImages : defaultImages;
    const currentPhoto = photos[photoIdx] || photos[0];
  const photo = currentPhoto?.url;
  const photoFocus = currentPhoto?.focus || "center";

  const selectTone = (i: number) => {
    setToneIdx(i);
    setPhotoIdx(0);
  };

  const handleAdd = () => {
    if (!tone || !tone.available) return;
    addToCart(
      {
        productId: product.id,
        productName: product.name,
        brand: product.brand?.name || "",
        slug: product.slug,
        tone: tone.name,
        price: product.price,
        image: photos[0]?.url || null,
      },
      qty
    );
  };

  const reserveNow = () => {
    if (!tone || !tone.available || !settings?.whatsapp) return;
    const msg = buildWhatsAppMessage(
      settings.store_name,
      [{ productId: product.id, productName: product.name, brand: product.brand?.name || "", tone: tone.name, qty, price: product.price }],
      settings.deposit_percent
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="max-w-[1100px] mx-auto px-[18px] py-4.5 pb-16">
      <Link href="/shop" className="inline-flex items-center gap-1 text-xs text-[#8A6A6F] mb-3">
        <ChevronLeft size={14} /> Volver
      </Link>
      <p className="text-[11px] text-[#8A6A6F] mb-4">
        Tienda / {product.category?.name} / {product.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
                    <div className="relative rounded-[18px] mb-2.5 bg-[#F1DFDE] overflow-hidden">
                                    {photo && <img src={photo} alt={product.name} className="w-full h-auto" />}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 rounded-full w-[30px] h-[30px]"
                >
                  <ChevronLeft size={16} className="mx-auto" />
                </button>
                <button
                  onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 rounded-full w-[30px] h-[30px]"
                >
                  <ChevronRight size={16} className="mx-auto" />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {photos.map((ph, i) => (
              <button
                key={ph.id}
                onClick={() => setPhotoIdx(i)}
                className="w-14 h-14 rounded-[10px] flex-none overflow-hidden"
                style={{ border: i === photoIdx ? "2px solid var(--color-primary)" : "2px solid transparent" }}
              >
                                <img src={ph.url} alt="" className="w-full h-full object-cover" style={{ objectPosition: ph.focus === "top" ? "center top" : ph.focus === "bottom" ? "center bottom" : "center center" }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-wide text-[#8A6A6F]">{product.brand?.name}</p>
          <div className="flex justify-between items-start">
            <h1 className="serif text-[26px] max-w-[320px]">{product.name}</h1>
            <button onClick={() => toggleFav(product.id)} className="bg-[#F1E7E2] rounded-full w-9 h-9 flex items-center justify-center">
              <Heart size={16} color="var(--color-primary)" fill={isFav ? "var(--color-primary)" : "none"} />
            </button>
          </div>
          <div className="flex items-baseline gap-2 my-2.5">
            <span className="text-xl font-bold">{formatCOP(product.price)}</span>
            {product.prev_price && <span className="text-[13px] line-through text-[#B08D57]">{formatCOP(product.prev_price)}</span>}
            {product.immediate_delivery && (
              <span className="text-[10px] bg-[#EADFDA] px-2 py-0.5 rounded-full" style={{ color: "var(--color-primary)" }}>
                Entrega inmediata
              </span>
            )}
          </div>
          {!product.immediate_delivery && settings && (
            <div className="bg-[#F1E7E2] rounded-xl px-3 py-2.5 mb-3.5">
              <p className="text-[12.5px] font-semibold" style={{ color: "var(--color-primary)" }}>
                Resérvalo por {formatCOP(product.price * (settings.deposit_percent / 100))}
              </p>
              <p className="text-[11px] text-[#8A6A6F] mt-0.5">
                Pagas el {settings.deposit_percent}% ahora y cancelas el resto cuando tu pedido llega a Colombia{settings.delivery_time_text ? ` (${settings.delivery_time_text})` : ""}.
              </p>
            </div>
          )}
          <p className="text-[13px] text-[#5A4448] leading-relaxed mb-4">{product.description}</p>

          {tones.length > 0 && (
            <div className="mb-4.5">
              <p className="text-xs font-semibold mb-2">
                                                                                Tono: <span className="font-normal">{tone?.name}{tone && !tone.available && " (agotado)"}</span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                                {tones.map((t, i) => (
                  <button
                    key={t.id}
                    title={t.name}
                    onClick={() => selectTone(i)}
                    className="swatch w-[30px] h-[30px] rounded-full relative overflow-hidden"
                    style={{
                      background: t.swatch_type === "image" ? "transparent" : t.swatch_color,
                      border: i === toneIdx ? "2.5px solid var(--color-text)" : "1.5px solid rgba(0,0,0,0.15)",
                      opacity: t.available ? 1 : 0.35,
                    }}
                  >
                    {t.swatch_type === "image" && t.image_url && (
                      <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                    )}
                    {i === toneIdx && <Check size={13} color="#fff" className="absolute inset-0 m-auto drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3.5">
            <div className="flex items-center border border-[#EADFDA] rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8">−</button>
              <span className="w-6 text-center text-[13px]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8">+</button>
            </div>
            <button
              disabled={!tone?.available}
              onClick={handleAdd}
              className="flex-1 text-white rounded-full py-3 text-[13px] font-semibold disabled:opacity-40"
              style={{ background: "var(--color-primary)" }}
            >
              Agregar al carrito
            </button>
          </div>
          <button
            onClick={reserveNow}
            disabled={!tone?.available}
            className="w-full rounded-full py-2.5 text-[13px] font-semibold mb-5 disabled:opacity-40"
            style={{ border: "1.5px solid var(--color-primary)", color: "var(--color-primary)" }}
          >
            Reservar por WhatsApp
          </button>

          <DetailBlock title="Beneficios" text={product.benefits} />
          <DetailBlock title="Ingredientes" text={product.ingredients} />
          <DetailBlock title="Contenido" text={product.content} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="serif text-xl mb-3.5">También te puede gustar</h2>
          <div className="flex gap-3.5 overflow-x-auto pb-2">
            {related.slice(0, 6).map((p) => (
              <div key={p.id} className="flex-none w-[180px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DetailBlock({ title, text }: { title: string; text: string | null | undefined }) {
  if (!text) return null;
  return (
    <div className="border-t border-[#EADFDA] py-3">
      <p className="text-xs font-semibold mb-1">{title}</p>
      <p className="text-[12.5px] text-[#5A4448] leading-relaxed">{text}</p>
    </div>
  );
}
