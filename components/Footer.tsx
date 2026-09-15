import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="mt-10 px-[18px] py-8" style={{ background: "var(--color-text)", color: "var(--color-background)" }}>
      <div className="max-w-[1100px] mx-auto">
        <p className="serif text-xl mb-2.5">{settings?.store_name || "BLUSH CLUB"}</p>
        <div className="flex gap-4 flex-wrap text-xs opacity-85">
          <Link href="/shop">Tienda</Link>
          <Link href="/favorites">Favoritos</Link>
          <Link href="/how-it-works">Cómo funciona</Link>
          {settings?.instagram && (
            <a href={`https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {settings?.whatsapp && <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
          <Link href="/admin">Admin</Link>
        </div>
        <p className="text-[10.5px] opacity-50 mt-4">
          © {new Date().getFullYear()} {settings?.store_name || "Blush Club"}
        </p>
      </div>
    </footer>
  );
}
