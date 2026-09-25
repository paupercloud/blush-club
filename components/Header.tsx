"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import type { SiteSettings, NavigationItem } from "@/lib/types";

export default function Header({ settings, nav }: { settings: SiteSettings | null; nav: NavigationItem[] }) {
  const { cart, favs } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className="border-b border-[#EADFDA] sticky top-0 z-40 bg-cover bg-center"
      style={{
        background: settings?.header_bg_url
          ? `url(${settings.header_bg_url}) center/cover`
          : "var(--color-background)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-[18px] py-3.5 flex items-center gap-3.5">
        <button onClick={() => setMenuOpen(!menuOpen)} className="bg-transparent border-none">
                   <Menu size={20} color={settings?.nav_text_color || "var(--color-primary)"} />
        </button>
        <Link href="/" className="flex-none">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.store_name} style={{ width: settings?.logo_width || "110px", height: "auto" }} />
          ) : (
            <span className="serif text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
              {settings?.store_name || "BLUSH CLUB"}
            </span>
          )}
        </Link>
        <form onSubmit={submitSearch} className="flex-1 flex items-center bg-[#F1E7E2] rounded-full px-3.5 py-2 gap-2">
          <Search size={15} color="#8A6A6F" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos, marcas..."
            className="border-none bg-transparent outline-none text-[13px] w-full"
          />
        </form>
        <Link href="/favorites" className="relative">
          <Heart size={20} color="var(--color-primary)" />
          {favs.length > 0 && <Badge n={favs.length} />}
        </Link>
        <Link href="/cart" className="relative">
          <ShoppingBag size={20} color="var(--color-primary)" />
          {cartCount > 0 && <Badge n={cartCount} />}
        </Link>
      </div>
      {menuOpen && (
        <nav className="border-t border-[#EADFDA] px-[18px] py-2.5 flex flex-wrap gap-4">
          {nav.map((item) => (
                       <Link key={item.id} href={item.href} onClick={() => setMenuOpen(false)} className="text-sm" style={{ color: settings?.nav_text_color || "var(--color-primary)" }}>
              {item.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-[#8A6A6F]">
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span
      className="absolute -top-1.5 -right-2 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
      style={{ background: "var(--color-primary)" }}
    > 
      {n}
    </span>
  );
}
