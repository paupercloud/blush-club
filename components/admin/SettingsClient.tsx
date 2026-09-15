"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/actions/catalog";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import type { SiteSettings } from "@/lib/types";

export default function SettingsClient({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [logo, setLogo] = useState<UploadedImage[]>(settings.logo_url ? [{ url: settings.logo_url, sort_order: 0, is_primary: true }] : []);
  const [headerBg, setHeaderBg] = useState<UploadedImage[]>(settings.header_bg_url ? [{ url: settings.header_bg_url, sort_order: 0, is_primary: true }] : []);
  const [favicon, setFavicon] = useState<UploadedImage[]>(settings.favicon_url ? [{ url: settings.favicon_url, sort_order: 0, is_primary: true }] : []);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof SiteSettings, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSettings({
        store_name: form.store_name,
        tagline: form.tagline,
        logo_url: logo[0]?.url || null,
        logo_width: form.logo_width || "110px",
        header_bg_url: headerBg[0]?.url || null,
        favicon_url: favicon[0]?.url || null,
        color_primary: form.color_primary,
        color_secondary: form.color_secondary,
        color_accent: form.color_accent,
        color_background: form.color_background,
        color_text: form.color_text,
        border_radius: form.border_radius,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        email: form.email,
        deposit_percent: Number(form.deposit_percent),
        delivery_time_text: form.delivery_time_text,
        reserve_policy: form.reserve_policy,
        shipping_info: form.shipping_info,
        seo_description: form.seo_description,
      });
      router.refresh();
      alert("Guardado. Los cambios ya están en vivo en toda la tienda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[520px] flex flex-col gap-6">
      <Section title="Identidad">
        <Field label="Nombre de la tienda"><input className="input" value={form.store_name} onChange={(e) => set("store_name", e.target.value)} /></Field>
        <Field label="Texto secundario (tagline)"><input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
        <Field label="Logo">
          <ImageUploader bucket="branding" folder="logo" images={logo} onChange={(imgs) => setLogo(imgs.slice(-1))} />
        </Field>
        <Field label="Favicon (ícono de la pestaña del navegador)">
          <ImageUploader bucket="branding" folder="favicon" images={favicon} onChange={(imgs) => setFavicon(imgs.slice(-1))} />
        </Field>
        <Field label="Ancho del logo (ej. 110px, 160px)">
          <input className="input" value={form.logo_width || "110px"} onChange={(e) => set("logo_width", e.target.value)} />
        </Field>
        <Field label="Imagen de fondo del header (opcional)">
          <ImageUploader bucket="branding" folder="header" images={headerBg} onChange={(imgs) => setHeaderBg(imgs.slice(-1))} />
        </Field>
      </Section>

      <Section title="Colores">
        <div className="grid grid-cols-2 gap-2.5">
          <ColorField label="Color principal" value={form.color_primary} onChange={(v) => set("color_primary", v)} />
          <ColorField label="Color secundario" value={form.color_secondary} onChange={(v) => set("color_secondary", v)} />
          <ColorField label="Color de acento" value={form.color_accent} onChange={(v) => set("color_accent", v)} />
          <ColorField label="Fondo" value={form.color_background} onChange={(v) => set("color_background", v)} />
          <ColorField label="Texto" value={form.color_text} onChange={(v) => set("color_text", v)} />
        </div>
        <Field label="Redondeado de bordes (ej. 16px, 4px, 999px)">
          <input className="input" value={form.border_radius} onChange={(e) => set("border_radius", e.target.value)} />
        </Field>
      </Section>

      <Section title="Contacto y redes">
        <Field label="WhatsApp (solo números, con indicativo, ej. 573001234567)">
          <input className="input" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Instagram (usuario, sin @)"><input className="input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
        <Field label="Correo de contacto"><input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
      </Section>

      <Section title="Reservas y envíos">
        <Field label="Porcentaje de abono">
          <input type="number" className="input" value={form.deposit_percent} onChange={(e) => set("deposit_percent", e.target.value)} />
        </Field>
        <Field label="Tiempo estimado de entrega"><input className="input" value={form.delivery_time_text} onChange={(e) => set("delivery_time_text", e.target.value)} /></Field>
        <Field label="Política de reserva"><textarea rows={3} className="input" value={form.reserve_policy} onChange={(e) => set("reserve_policy", e.target.value)} /></Field>
        <Field label="Información de envíos"><textarea rows={3} className="input" value={form.shipping_info} onChange={(e) => set("shipping_info", e.target.value)} /></Field>
      </Section>

      <Section title="SEO básico">
        <Field label="Descripción para buscadores"><textarea rows={2} className="input" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></Field>
      </Section>

      <button onClick={save} disabled={saving} className="text-white rounded-full py-3 text-[13px] font-semibold" style={{ background: "var(--color-primary)" }}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
      <style jsx>{`.input{width:100%;font-size:12.5px;border:1px solid #EADFDA;border-radius:8px;padding:7px 10px;outline:none;}`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold mb-2.5">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10.5px] text-[#8A6A6F] block mb-1">{label}</label>
      {children}
    </div>
  );
}
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-full border-none p-0" />
      <div className="flex-1">
        <label className="text-[10px] text-[#8A6A6F] block">{label}</label>
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <style jsx>{`.input{width:100%;font-size:11.5px;border:1px solid #EADFDA;border-radius:8px;padding:5px 8px;outline:none;}`}</style>
    </div>
  );
}
