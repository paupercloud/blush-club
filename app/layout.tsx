import type { Metadata } from "next";
import "./globals.css";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { SiteSettings, NavigationItem } from "@/lib/types";

async function getData() {
  const supabase = createServerSupabaseClient();
  const [{ data: settings }, { data: nav }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("navigation_items").select("*").eq("visible", true).order("sort_order"),
  ]);
  return { settings: settings as SiteSettings, nav: (nav || []) as NavigationItem[] };
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getData();
  return {
    title: settings?.store_name || "Blush Club",
    description: settings?.seo_description || settings?.tagline || "",
    icons: settings?.favicon_url ? [{ url: settings.favicon_url }] : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings, nav } = await getData();

  const vars = settings
    ? ({
        "--color-primary": settings.color_primary,
        "--color-secondary": settings.color_secondary,
        "--color-accent": settings.color_accent,
        "--color-background": settings.color_background,
        "--color-text": settings.color_text,
        "--radius": settings.border_radius,
      } as React.CSSProperties)
    : undefined;

  return (
    <html lang="es">
      <body style={vars}>
        <CartProvider>
          <Header settings={settings} nav={nav} />
          <main>{children}</main>
          <Footer settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
