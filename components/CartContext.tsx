"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  productName: string;
  brand: string;
  slug: string;
  tone: string;
  price: number;
  image: string | null;
  qty: number;
};

type CartCtx = {
  cart: CartItem[];
  favs: string[];
  addToCart: (item: Omit<CartItem, "qty">, qty: number) => void;
  updateQty: (productId: string, tone: string, qty: number) => void;
  toggleFav: (productId: string) => void;
  toast: string;
};

const Ctx = createContext<CartCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load("blushclub_cart", []));
  const [favs, setFavs] = useState<string[]>(() => load("blushclub_favs", []));
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("blushclub_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("blushclub_favs", JSON.stringify(favs)), [favs]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart: CartCtx["addToCart"] = (item, qty) => {
    setCart((c) => {
      const idx = c.findIndex((i) => i.productId === item.productId && i.tone === item.tone);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...c, { ...item, qty }];
    });
    setToast("Agregado al carrito");
  };

  const updateQty: CartCtx["updateQty"] = (productId, tone, qty) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !(i.productId === productId && i.tone === tone))
        : c.map((i) => (i.productId === productId && i.tone === tone ? { ...i, qty } : i))
    );
  };

  const toggleFav = (id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <Ctx.Provider value={{ cart, favs, addToCart, updateQty, toggleFav, toast }}>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#2B2024] text-[#FAF6F2] text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
