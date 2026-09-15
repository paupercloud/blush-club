"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatCOP, buildWhatsAppMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { cart, updateQty } = useCart();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    createClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => setSettings(data));
  }, []);

  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const depositPercent = settings?.deposit_percent ?? 50;

  const sendWhatsApp = () => {
    if (!settings?.whatsapp || cart.length === 0) return;
    const msg = buildWhatsAppMessage(
      settings.store_name,
      cart.map((l) => ({ productId: l.productId, productName: l.productName, brand: l.brand, tone: l.tone, qty: l.qty, price: l.price })),
      depositPercent
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="max-w-[700px] mx-auto px-[18px] py-6 pb-16">
      <h1 className="serif text-[28px] mb-4.5">Tu pedido</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12 px-5 bg-[#F1E7E2] rounded-2xl">
          <p className="text-[13px] text-[#5A4448] mb-3.5">Tu carrito está vacío.</p>
          <Link href="/shop" className="inline-block text-white rounded-full px-5 py-2.5 text-xs" style={{ background: "var(--color-primary)" }}>
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-5">
            {cart.map((l) => (
              <div key={l.productId + l.tone} className="flex gap-3 bg-white border border-[#F0E4E1] rounded-2xl p-2.5">
                <div className="w-[60px] h-[60px] rounded-[10px] flex-none bg-[#F1DFDE] overflow-hidden">
                  {l.image && <img src={l.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10.5px] text-[#8A6A6F] font-bold">{l.brand}</p>
                  <p className="text-[13px] font-medium">{l.productName}</p>
                  <p className="text-[11px] text-[#8A6A6F]">Tono: {l.tone}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center border border-[#EADFDA] rounded-full">
                      <button onClick={() => updateQty(l.productId, l.tone, l.qty - 1)} className="w-[26px] h-[26px]">−</button>
                      <span className="w-5 text-center text-xs">{l.qty}</span>
                      <button onClick={() => updateQty(l.productId, l.tone, l.qty + 1)} className="w-[26px] h-[26px]">+</button>
                    </div>
                    <span className="text-[13px] font-semibold">{formatCOP(l.price * l.qty)}</span>
                  </div>
                </div>
                <button onClick={() => updateQty(l.productId, l.tone, 0)} className="self-start">
                  <Trash2 size={15} color="var(--color-accent)" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-[#EADFDA] pt-3.5 mb-4">
            <div className="flex justify-between text-[15px] font-bold mb-1">
              <span>Subtotal</span>
              <span>{formatCOP(total)}</span>
            </div>
            <p className="text-[11px] text-[#8A6A6F]">
              Abono para reservar ({depositPercent}%): {formatCOP((total * depositPercent) / 100)}
            </p>
          </div>
          <button
            onClick={sendWhatsApp}
            className="w-full bg-[#25D366] text-white rounded-full py-3.5 text-[13.5px] font-semibold mb-2"
          >
            Generar pedido por WhatsApp
          </button>
          <Link href="/shop" className="block text-center text-[12.5px]" style={{ color: "var(--color-primary)" }}>
            Continuar comprando
          </Link>
          {settings?.reserve_policy && <p className="text-[11px] text-[#8A6A6F] mt-3.5 leading-relaxed">{settings.reserve_policy}</p>}
        </>
      )}
    </section>
  );
}
