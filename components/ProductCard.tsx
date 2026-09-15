"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCOP } from "@/lib/format";
import { useCart } from "./CartContext";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { favs, toggleFav } = useCart();
  const [toneIdx, setToneIdx] = useState(0);
  const isFav = favs.includes(product.id);
  const tones = product.product_variants || [];
  const tone = tones[toneIdx];
  const photo = product.product_images?.[0]?.url;
  const collections = (product.product_collections || []).map((c) => c.collections?.key);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#F0E4E1]">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[#F1DFDE]">
        {photo && <img src={photo} alt={product.name} className="w-full h-full object-cover" />}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFav(product.id);
          }}
          className="absolute top-2.5 right-2.5 bg-white/85 rounded-full w-[30px] h-[30px] flex items-center justify-center"
        >
          <Heart size={15} color="var(--color-primary)" fill={isFav ? "var(--color-primary)" : "none"} />
        </button>
        {collections.includes("new") && <Tag text="NUEVO" />}
        {collections.includes("viral") && !collections.includes("new") && <Tag text="VIRAL" />}
        {product.prev_price && <Tag text="OFERTA" style={{ top: 42 }} bg="var(--color-accent)" />}
      </Link>
      <div className="px-3 pt-2.5 pb-3.5">
        <Link href={`/product/${product.slug}`}>
          <p className="text-[10.5px] font-bold tracking-wide text-[#8A6A6F]">{product.brand?.name}</p>
          <p className="text-[13px] font-medium mb-1.5">{product.name}</p>
        </Link>
        {tones.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {tones.slice(0, 4).map((t, i) => (
              <button
                key={t.id}
                title={t.name}
                onClick={() => setToneIdx(i)}
                className="swatch w-4 h-4 rounded-full"
                style={{
                  background: t.swatch_color,
                  border: i === toneIdx ? "2px solid var(--color-text)" : "1px solid rgba(0,0,0,0.15)",
                  opacity: t.available ? 1 : 0.35,
                }}
              />
            ))}
            {tones.length > 4 && <span className="text-[10px] text-[#8A6A6F]">+{tones.length - 4}</span>}
          </div>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-semibold">{formatCOP(product.price)}</span>
          {product.prev_price && <span className="text-[11px] line-through" style={{ color: "var(--color-accent)" }}>{formatCOP(product.prev_price)}</span>}
        </div>
        {tone && <p className="text-[10px] text-[#8A6A6F] mt-0.5">{tone.name}{!tone.available && " · agotado"}</p>}
      </div>
    </div>
  );
}

function Tag({ text, style, bg = "var(--color-primary)" }: { text: string; style?: React.CSSProperties; bg?: string }) {
  return (
    <span
      className="absolute left-2.5 top-2.5 text-white text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full"
      style={{ background: bg, ...style }}
    >
      {text}
    </span>
  );
}
